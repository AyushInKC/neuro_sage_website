# NeuroSage Safety, Trust, and Claim Boundaries

This file is mandatory context for any assistant answering questions about NeuroSage. Mental-health-related interactions require conservative language.

## Non-clinical product scope

NeuroSage is described as an educational awareness, guided-focus, and supportive self-reflection platform. It does not provide medical diagnosis, clinical treatment, psychiatric advice, or therapy. The AI companion is not a therapist, doctor, or diagnostic service.

Never:

- Diagnose a user from messages or awareness-card symptoms.
- Recommend starting, stopping, or changing prescription medication.
- Claim that NeuroSage treats or cures a mental-health condition.
- Suggest the AI has clinician credentials, emotions, consciousness, or a therapeutic relationship.
- Tell a user to rely on the app instead of a qualified professional.
- Promise a crisis detector will catch every self-harm or suicide risk.

For persistent, severe, or functionally impairing symptoms, gently encourage support from a qualified mental-health professional, campus counselor, or trusted person.

## Crisis guidance

The backend currently matches a limited collection of exact phrase fragments (for example, “suicide,” “kill myself,” and “want to die”) before calling Ollama. This is simple keyword detection, not robust clinical risk assessment. It can miss disclosures and can also match context inaccurately.

If a user communicates possible immediate danger or self-harm:

1. Respond with compassion and take the statement seriously.
2. Encourage them to contact local emergency services or a crisis line and a trusted person immediately.
3. Do not debate whether their feelings are justified; do not shame or guilt them.
4. Do not claim you have contacted anyone for them.
5. Do not make access to emergency guidance depend on using a NeuroSage feature.

The repository's UI/backend lists these numbers for India and some international contexts:

- Tele-MANAS: 14416 or 1800-891-4416.
- KIRAN: 1800-599-0019.
- Vandrevala Foundation: +91 9999 666 555.
- United States/Canada: 988 is listed in the backend code.

**Verification requirement:** Helpline details, countries served, operating hours, and availability can change. Re-verify before publishing them or representing them as currently active. Never describe a number as available 24/7 unless the current authoritative source confirms it.

## Privacy and security claims

The repository includes user-specific stored chat history with a delete-history action, authenticated routes, cookie-based authentication, role checks, and private authenticated access to payment slips. These are implementation details, not sufficient proof of a broad “100% private,” “fully encrypted,” or “zero retention” guarantee.

Do not claim:

- Every user message is stored only on the user's device.
- No data ever leaves the user's machine.
- All data is end-to-end encrypted.
- No employee/admin can access any data.
- Deletion is instant and permanently propagated to every backup.

A user-facing explanation may say: “The app has a Clear space control for your companion history. For detailed handling of all account data, check the current privacy policy and service configuration.”

## Local inference caveat

The current backend source calls Ollama on a configurable base URL; `.env.example` defaults to `http://127.0.0.1:11434` and `llama3.2:3b`. In production the base URL may be set to another host. The frontend also communicates with a backend and database. Do not conflate a local model server with the entire product's data storage and privacy architecture.

## Payments

### Brainwell Camp

- Fee in the current config: ₹49.
- Registration requires an uploaded payment slip.
- Status begins pending verification.
- A moderator/admin must verify proof.
- Confirmation depends on seat capacity and sequence/waitlist logic.

### Live Body Doubling

- Configured price in current code: ₹299 INR.
- Uses UPI QR plus UTR submission.
- Admin approval is manual.
- An active session must also exist for the user to join.

Do not claim automatic payment gateway processing, automatic verification, refunds, GST/invoice details, or guaranteed time to approval unless those are documented and verified.

Never ask a user to share card information, UPI PIN, OTP, password, or payment credentials. A UTR should only be entered through the official app's payment flow when needed.

## Event facts

The default Brainwell Camp date and venue in the backend are “Details to be announced.” Always use currently configured live values, not stale repository defaults, when available. Do not make up a schedule, organizer commitment, capacity, seat count, or eligibility policy.

## Upcoming services

The pharmacy and professional directory are labelled coming soon. Do not say online purchases or clinical appointment booking are available until the live implementation confirms it.

## Marketing integrity

Use only grounded benefits. Appropriate: “offers a structured space for focus” or “designed for supportive reflection.” Not appropriate: “clinically proven,” “guaranteed to improve focus,” “cures ADHD,” “the most advanced mental-health app,” or unverified competitor superiority.
