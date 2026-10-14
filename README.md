# NeuroSage — Mental Wellness Platform

> **Brand**: NeuroSage  
> **Tagline**: *Be kind to your mind.*  
> **Featured Event**: Brainwell Camp (*“Revive your mind.”* — Registration fee: ₹49 per participant)

NeuroSage is a full-stack mental-wellness web application built to make mental-health awareness, mindful habits, guided focus, and supportive reflection approachable, calm, and accessible to students and young adults.

---

## 🌿 Core Architecture & Highlights

### 1. Startup Identity & Design System
- **Palette**: Calm, warm, human, and restrained.
  - Ivory background: `#F8F4ED`
  - Soft cream: `#F0E7DA`
  - Light sand: `#E6D5C3`
  - Muted terracotta: `#B87560`
  - Dusty rose: `#D8B4A7`
  - Muted sage: `#A8B5A0`
  - Deep warm brown: `#44362F`
  - Secondary text: `#786A61`
- **Typography**: Headings set in **DM Serif Display**, interface and body set in **DM Sans**.
- **Awareness Section**: Integrated "10 Psychological Conditions Understood" awareness guide directly based on the startup's educational outreach poster.
- **Genuine Outreach Contacts**: Direct campus awareness leads Yash Chaudhary (`8218030248`) and Ayush Singh (`7307998313`).

### 2. Fair First-Come-First-Served (FCFS) Registration System
- **Atomic Sequence Ordering**: Each Brainwell Camp registration receives a strictly monotonic sequence number via an atomic counter (`counters` collection).
- **Payment Verification Gate**: Registrations initially enter `PENDING_PAYMENT_VERIFICATION`.
- **Seat Allocation by Sequence, Not Admin Click Order**: When an administrator verifies a payment slip, seats are granted strictly according to the participant's original queue sequence number up to camp capacity.
- **Automatic Waitlisting & Promotion**: When capacity is reached, participants are waitlisted. If an earlier confirmed participant cancels or has their payment rejected, the system automatically promotes the earliest eligible waitlisted participant (`promoteEarliestWaitlisted`).
- **Private Payment Slip Storage**: Slips (PDF, JPG, PNG up to 5MB) are inspected for magic bytes/signatures, stored in private object storage, and streamed only through authenticated administrator endpoints (`GET /api/admin/registrations/:id/payment-slip`).

### 3. AI Mental Wellness Companion
- **Reflective Space**: Dedicated conversational interface designed for emotional grounding, gentle CBT cognitive reframing, and stress de-escalation.
- **Hugging Face Service Abstraction**: Connects to instruction-following models via `@huggingface/inference` when `HF_TOKEN` is supplied, with an integrated reflective rule-based engine fallback.
- **Crisis Helpline Protocol**: Automatically detects acute distress or self-harm keywords and immediately prioritizes 24/7 crisis helplines (Tele-MANAS `14416`, KIRAN `1800-599-0019`, Vandrevala `+91 9999 666 555`, Global `988`).
- **History & Privacy**: Chat history is persisted securely per user and can be cleared at any time.

### 4. Functional Body-Doubling Workspace
- **Focus Timer**: Configurable focus blocks (15, 25, 45, 60 minutes) with play, pause, and reset controls.
- **Synthesized Ambient Soundscapes**: Pure browser-synthesized audio (Gentle Rain, Ocean Waves, Deep Brown Noise, or Silence) using the Web Audio API without heavy third-party audio assets.
- **Micro-tasks Checklist**: Manageable session tasks to reduce task paralysis and executive dysfunction.
- **Box Breathing (4-4-4-4)**: Visual and rhythmic autonomic nervous system grounding exercise.
- **Community Presence**: Live counter showing peers focusing together.

### 5. Future Services
- **Wellness Pharmacy** (`/dashboard/pharmacy`): Coming soon with notification interest toggle.
- **Mental Wellness Professionals** (`/dashboard/doctors`): Coming soon with directory description and emergency contacts.
- **A Library for the Mind** (`/dashboard/books`): Coming soon bibliotherapy showcase.

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Lucide React.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose (MongoDB).
- **Security**: Argon2/Bcrypt password hashing, JWT with HTTP-only cookies, automatic refresh token rotation, Helmet, Express Rate Limit, magic-number file signature validation.
- **Testing**: Vitest for frontend and backend, Supertest for API integration.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js (v18+)
- Local MongoDB running on `127.0.0.1:27017` or MongoDB Atlas URI

### Installation
```bash
# Clone repository and install dependencies
git clone <repo-url>
cd neuro_sage
npm run install:all
```

### Seeding Initial Data
Run the seed script to initialize Brainwell Camp, the default Admin account, and a sample Student account:
```bash
npm run seed
```

**Default Seed Credentials:**
- **Admin**: `admin@neurosage.org` / `AdminPassword123!`
- **Student**: `ayush@neurosage.org` / `StudentPassword123!`

### Development Mode
Run both backend (`http://localhost:5000`) and frontend (`http://localhost:3000`) concurrently:
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

---

## 🛡️ License & Medical Disclaimer
NeuroSage is an educational awareness, guided focus, and supportive self-reflection platform. Content, reflections, and AI companion responses provided on this platform are for general wellness awareness and personal reflection only, and do not constitute medical diagnosis, clinical treatment, psychiatric advice, or therapy.
