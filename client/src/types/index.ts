export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
}

export interface Camp {
  id: string;
  campCode: string;
  title: string;
  tagline: string;
  fee: number;
  capacity: number;
  confirmedCount: number;
  waitlistedCount: number;
  pendingCount: number;
  isOpen: boolean;
  venue: string;
  dates: string;
  description: string;
}

export type PaymentStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
export type RegistrationStatus =
  | 'PENDING_PAYMENT_VERIFICATION'
  | 'CONFIRMED'
  | 'WAITLISTED'
  | 'PAYMENT_REJECTED'
  | 'CANCELLED';

export interface QueueStats {
  queuePosition: number;
  waitlistPosition: number | null;
  totalInQueue: number;
  confirmedSeats: number;
  capacity: number;
}

export interface Registration {
  id: string;
  reference: string;
  sequenceNumber: number;
  fullName: string;
  email: string;
  collegeName: string;
  collegeYear: string;
  paymentStatus: PaymentStatus;
  registrationStatus: RegistrationStatus;
  allocatedSeatNumber?: number | null;
  rejectionReason?: string;
  createdAt: string;
  camp?: any;
  queueStats?: QueueStats;
  auditLog?: Array<{
    action: string;
    performerName?: string;
    performerRole?: string;
    timestamp: string;
    notes?: string;
    previousStatus?: string;
    newStatus?: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface BodyDoublingSession {
  _id: string;
  intention: string;
  tasks: TaskItem[];
  durationMinutes: number;
  soundAmbience: string;
  reflectionNotes?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LiveSession {
  id: string;
  sessionId: string;
  roomName: string;
  startedAt: string;
  status: 'active' | 'ended';
}

export interface LivePaymentInfo {
  amount: number;
  currency: string;
  qrImageUrl: string;
  upiId: string;
}
