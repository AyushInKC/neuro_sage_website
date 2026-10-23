# NeuroSage Feature Catalog

This catalog distinguishes present code/UI from future plans. An implementation being present in GitHub does not guarantee the production deployment is correctly configured or currently operational.

## Public landing page
**Status:** Implemented in frontend code.

Users can view the NeuroSage introduction, service overview, Brainwell Camp section, mental-health awareness guide, and outreach/contact section. The public copy uses the phrase “Be kind to your mind” and a warm ivory/cream/terracotta/sage palette.

**Explain it as:** A starting point to learn what NeuroSage offers and navigate to registration or sign-in.

## Condition awareness guide
**Status:** Implemented in frontend code.

The landing page shows ten topics: ADHD, phobias, depression, PTSD, OCD, bipolar disorder, insomnia, schizophrenia, paranoia, and panic disorder. Each card includes a short description and illustrative signs.

**Important boundary:** It is awareness information, not a diagnostic quiz. The page says symptoms vary and that a qualified professional can help. Do not infer a diagnosis from someone's symptoms.

## Account creation, login, and profile
**Status:** Implemented in frontend/backend code.

Registration collects name, email, password, and confirmation, requires agreement to terms/privacy text, and includes optional consent for non-essential updates. Passwords are hashed on the backend. The UI also includes login, forgot-password, reset-password, and a profile page. Authentication uses HTTP-only cookie-based access/refresh-token flows according to the repository.

**Caveat:** Do not promise a specific email-verification experience without testing the deployed configuration; the current registration controller responds with `isEmailVerified: true` while also triggering a verification email asynchronously.

## Dashboard overview
**Status:** Implemented in frontend code.

The dashboard greets the user, features Brainwell Camp, links to Body Doubling and the AI Companion, and lets the user save a daily intention in browser local storage associated with their user ID. It also presents upcoming services.

## Body Doubling Workspace
**Status:** Implemented in frontend/backend code.

The workspace provides:

- Focus duration presets of 15, 25, 45, and 60 minutes.
- Start, pause, and reset controls.
- A personal intention for the focus block.
- A checklist of small tasks, which can be added, completed, and deleted.
- Sound choices: Silence, Gentle Rain, Ocean Waves, and Deep Brown Noise. Audio is generated in the browser using the Web Audio API rather than downloaded audio tracks.
- A box-breathing guide with 4-second inhale, hold, exhale, and pause phases.
- A post-session reflection note.
- Saving of session intentions, tasks, duration, sound selection, and reflection notes to the user's backend session record.

**How to explain its value:** It gives users a simple structure for starting and staying with a task, including tiny action steps and optional sensory ambience. Avoid promising clinical outcomes or saying it treats ADHD.

**Accuracy caveat:** The displayed “14 members focusing right now” counter is hard-coded UI copy in the inspected component; do not present it as a verified live count.

## AI Wellness Companion
**Status:** Implemented in frontend/backend code, subject to server configuration.

The companion offers an authenticated text conversation, suggested starter prompts, history loading, and a “Clear space” action to clear chat history. The frontend shows a non-diagnostic disclaimer and crisis contacts. The backend:

- Sends the system instructions plus recent conversation context to the configured Ollama `/api/chat` endpoint.
- Uses the configured model (default in `.env.example`: `llama3.2:3b`).
- Includes a rule-based reflective fallback if Ollama fails.
- Checks the latest message against a small list of crisis-related phrases before the normal model call, then responds with support resources if a phrase matches.

**Limits to communicate:** Keyword detection is not comprehensive clinical risk assessment and can miss indirect, ambiguous, or differently worded disclosures. It may also trigger on phrases without understanding context. Never portray it as a guaranteed crisis detector. The companion is not a therapist or diagnostic service.

## Brainwell Camp
**Status:** Registration and administration flows are implemented in the repository; event details/operations need current verification.

The configured default values include:

- Name: Brainwell Camp.
- Tagline: “Revive your mind.”
- Fee: ₹49 per participant.
- Default capacity: 50 participants.
- Event date and venue: “Details to be announced.”

Registration asks for full name, email, college/institution, academic year, and a payment slip (PDF/JPG/PNG up to 5MB). The backend validates submitted fields, validates uploaded file signatures through storage utilities, stores the payment slip for private authenticated admin access, creates a sequence/reference, and begins in `PENDING_PAYMENT_VERIFICATION`.

The admin interface provides queue/status filtering, search, payment-slip inspection, payment verification/rejection, cancellation, and audit-log display. Seat allocation follows payment verification and camp capacity. A waitlist is supported; the FCFS service can promote the earliest eligible verified participant when a seat opens.

**User explanation:** Payment proof is reviewed by an organizer. Registration is not the same as a confirmed seat. Users should check “My Camp Registrations” for the current status and queue details.

## Live Body Doubling
**Status:** Implemented in repository; requires payment configuration and an active facilitator session.

- Displayed price: ₹299 INR.
- Payment method: UPI QR and transaction reference/UTR submission.
- Payment status: Pending until administrator approval or rejection.
- User joins only after approved access and while an active session exists.
- Admin can view pending payments, approve/reject, create a live session, and monitor a session.
- Video uses an embedded Jitsi room.
- The user sees a checklist beside the call and can toggle tasks.

**Important:** This is a manual UPI verification process. Do not say card payments, automatic gateway confirmation, instant unlock, recording, transcripts, end-to-end encryption, or guaranteed availability exist unless separately verified.

## A Library for the Mind / Books for the Mind
**Status:** Reading-list UI is present in code; operational readiness should be verified.

The page lists books related to ADHD, autism/neurodiversity, and self-understanding, with short descriptions and external Goodreads links. Visible titles in the code include *Unmasking Autism*, *ADHD 2.0*, *How to ADHD*, *NeuroTribes*, *Driven to Distraction*, *Laziness Does Not Exist*, *Order from Chaos*, and *Thinking in Pictures*.

Do not frame the books as professional treatment or guarantee that a particular title is appropriate for every user. Do not claim that full-text books are hosted or included.

## Wellness Pharmacy
**Status:** Coming soon / not an available online pharmacy flow.

The UI describes planned access to wellness supplies and non-prescription support resources. It explicitly says NeuroSage does not sell or distribute prescription drugs online. The current interest toggle is stored in browser local storage and should not be represented as a backend-managed launch notification service without checking later implementation.

## Mental Wellness Professionals
**Status:** Coming soon / appointment booking not available in inspected code.

The page describes a future directory of verified licensed clinical psychologists, campus counselors, and psychiatric professionals. It explicitly says appointments and medical consultations are not yet available through NeuroSage. Do not invent clinician names, credentials, appointment times, or booking links.

## Admin portal
**Status:** Implemented in repository.

Authorized administrators can manage camp registrations and payments, review payment slips privately, inspect audit history, manage live Body Doubling payments, and start/monitor live sessions. Never instruct a normal user to enter the admin area or disclose administrator credentials.

## Authentication and account support
**Status:** Implemented in repository, subject to configured mail service.

The code includes registration, login, logout, refresh/authentication support, forgot-password and reset-password flows. The API uses authentication middleware for the AI routes and role-based checks for admin functions. If someone reports that mail or sign-in is not working, avoid asserting the deployment is operational; suggest checking current service configuration or contacting the team.
