import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { config } from './config/index.js';
import { Camp } from './models/Camp.js';
import { User } from './models/User.js';
import { Registration } from './models/Registration.js';
import { FCFSQueueService } from './services/fcfsQueue.service.js';

describe('Fair First-Come-First-Served (FCFS) Queue Engine', () => {
  let testCamp: any;
  let adminUser: any;
  let user1: any;
  let user2: any;
  let user3: any;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongoUri);
    }

    // Create a dedicated test camp with capacity = 1 to test waitlist promotion
    testCamp = await Camp.create({
      campCode: 'TEST_FCFS_' + Date.now(),
      title: 'FCFS Test Camp',
      tagline: 'Revive your mind.',
      fee: 49,
      capacity: 1, // Only 1 seat to test waitlist immediately
      isOpen: true,
      waitlistEnabled: true,
    });

    adminUser = await User.create({
      name: 'Admin Tester',
      email: `admin_fcfs_${Date.now()}@neurosage.test`,
      passwordHash: 'hash',
      role: 'admin',
    });

    user1 = await User.create({
      name: 'Student One',
      email: `student1_${Date.now()}@neurosage.test`,
      passwordHash: 'hash',
      role: 'user',
    });

    user2 = await User.create({
      name: 'Student Two',
      email: `student2_${Date.now()}@neurosage.test`,
      passwordHash: 'hash',
      role: 'user',
    });

    user3 = await User.create({
      name: 'Student Three',
      email: `student3_${Date.now()}@neurosage.test`,
      passwordHash: 'hash',
      role: 'user',
    });
  });

  afterAll(async () => {
    if (testCamp) {
      await Registration.deleteMany({ camp: testCamp._id });
      await Camp.findByIdAndDelete(testCamp._id);
    }
    await User.deleteMany({ email: /.*_fcfs_.*@neurosage\.test/ });
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it('should assign monotonically increasing sequence numbers', async () => {
    const reg1 = await FCFSQueueService.createRegistration({
      userId: user1._id,
      campId: testCamp._id,
      fullName: user1.name,
      email: user1.email,
      collegeName: 'Campus 1',
      collegeYear: 'First year',
      paymentSlip: {
        filename: 'slip1.jpg',
        originalName: 'slip1.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
      },
    });

    const reg2 = await FCFSQueueService.createRegistration({
      userId: user2._id,
      campId: testCamp._id,
      fullName: user2.name,
      email: user2.email,
      collegeName: 'Campus 2',
      collegeYear: 'Second year',
      paymentSlip: {
        filename: 'slip2.jpg',
        originalName: 'slip2.jpg',
        mimeType: 'image/jpeg',
        size: 2048,
      },
    });

    expect(reg2.sequenceNumber).toBe(reg1.sequenceNumber + 1);
    expect(reg1.registrationStatus).toBe('PENDING_PAYMENT_VERIFICATION');
    expect(reg2.registrationStatus).toBe('PENDING_PAYMENT_VERIFICATION');
  });

  it('should confirm reg1 upon admin verification and waitlist reg2 due to capacity = 1', async () => {
    const reg1 = await Registration.findOne({ user: user1._id, camp: testCamp._id });
    const reg2 = await Registration.findOne({ user: user2._id, camp: testCamp._id });

    // Verify reg1
    const updated1 = await FCFSQueueService.verifyPayment(reg1!._id.toString(), adminUser._id.toString(), 'Admin');
    expect(updated1.registrationStatus).toBe('CONFIRMED');
    expect(updated1.allocatedSeatNumber).toBe(1);

    // Verify reg2
    const updated2 = await FCFSQueueService.verifyPayment(reg2!._id.toString(), adminUser._id.toString(), 'Admin');
    expect(updated2.registrationStatus).toBe('WAITLISTED');
    expect(updated2.allocatedSeatNumber).toBeNull();
  });

  it('should automatically promote waitlisted reg2 when reg1 is cancelled', async () => {
    const reg1 = await Registration.findOne({ user: user1._id, camp: testCamp._id });
    await FCFSQueueService.cancelRegistration(
      reg1!._id.toString(),
      adminUser._id.toString(),
      'Admin',
      'admin',
      'Test cancellation to free seat'
    );

    // Check reg2: should now be promoted to CONFIRMED with seat #1!
    const updated2 = await Registration.findOne({ user: user2._id, camp: testCamp._id });
    expect(updated2?.registrationStatus).toBe('CONFIRMED');
    expect(updated2?.allocatedSeatNumber).toBe(1);
    expect(updated2?.auditLog.some((l) => l.action === 'WAITLIST_PROMOTION')).toBe(true);
  });
});
