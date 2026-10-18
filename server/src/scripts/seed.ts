import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { User } from '../models/User.js';
import { Camp } from '../models/Camp.js';
import { Registration } from '../models/Registration.js';
import { Counter } from '../models/Counter.js';

async function seed() {
  console.log('[Seed] Connecting to MongoDB...');
  await mongoose.connect(config.mongoUri);

  console.log('[Seed] Ensuring Brainwell Camp...');
  let camp = await Camp.findOne({ campCode: config.camp.code });
  if (!camp) {
    camp = await Camp.create({
      campCode: config.camp.code,
      title: config.camp.title,
      tagline: config.camp.tagline,
      fee: 49,
      capacity: 50,
      isOpen: true,
      waitlistEnabled: true,
      venue: 'Details to be announced',
      dates: 'Details to be announced',
      description:
        'Make space to pause, reconnect, and care for your mind. Brainwell Camp is a NeuroSage initiative designed to encourage mental-wellness awareness, mindful habits, and supportive conversations.',
    });
    console.log('[Seed] Created Brainwell Camp');
  }

  // Admin user
  const adminEmail = config.admin.email;
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const adminHash = await bcrypt.hash(config.admin.password, 12);
    admin = await User.create({
      name: 'NeuroSage Admin',
      username: config.admin.username,
      email: adminEmail,
      passwordHash: adminHash,
      role: 'admin',
      isEmailVerified: true,
    });
    console.log(`[Seed] Created administrator account: ${config.admin.username}`);
  }

  // Sample student user (Ayush Singh from the poster)
  const studentEmail = 'ayush@neurosage.org';
  let student = await User.findOne({ email: studentEmail });
  if (!student) {
    const studentHash = await bcrypt.hash('StudentPassword123!', 12);
    student = await User.create({
      name: 'Ayush Singh',
      email: studentEmail,
      passwordHash: studentHash,
      role: 'user',
      isEmailVerified: true,
    });
    console.log('[Seed] Created default Student user: ayush@neurosage.org / StudentPassword123!');
  }

  console.log('[Seed] Database seeding completed successfully.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[Seed] Error during seeding:', err);
  process.exit(1);
});
