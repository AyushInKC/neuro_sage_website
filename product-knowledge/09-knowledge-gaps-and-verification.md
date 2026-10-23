# Knowledge Gaps and Verification Checklist

This list is deliberately included so the AI does not turn uncertain or stale information into confident answers.

## Must verify against the live product

- Whether the deployed site currently uses the same source version as GitHub `main`.
- Whether local Ollama is used in each deployment and whether `OLLAMA_BASE_URL` differs from localhost.
- Current Brainwell Camp registration status, price, capacity, event date, venue, registration closing date, eligibility, and contact person.
- Current status of each user's registration/payment/seat — only the authenticated app can show this.
- Current Live Body Doubling price, payment QR/UPI ID, approval delay, availability, session times, facilitator identity, and whether sessions are active.
- Current validity and service details of all helplines.
- Official contact email and phone numbers displayed in the current public site.
- Privacy policy contents, data retention, deletion behavior, backups, logs, access controls, encryption in transit/at rest, and provider processing details.
- Current availability of pharmacy, clinician directory, and book resources.
- Whether the displayed peer count is connected to real-time data; inspected source shows a literal “14 members” label.

## Current repository facts that must be handled carefully

- The README describes the AI as having used a Hugging Face service abstraction in earlier language, but current `server/src/services/ai.service.ts` makes an Ollama `/api/chat` request and a rule-based fallback. Prefer the current service code for present behavior.
- Public copy calls the platform private/confidential, but these adjectives should not be expanded into technical privacy guarantees without audit evidence.
- The public site presents contact phone numbers and an email. They should be checked before being shared in high-stakes situations or used as proof of current official support.
- The crisis logic is based on a small keyword list; it is not a complete clinical risk classifier.
- Pharmacy and therapist-directory features are explicitly “Coming soon.” Do not say users can purchase products or book appointments.
- The Books for the Mind UI is present even though the README groups it with future services. Explain that a reading-list UI exists, but verify current availability and don't claim the service is a full digital library.
- Manual payments are not equivalent to an integrated automated payment gateway.
- Sample `.env.example` files can contain operationally significant values. Never repeat credentials/secrets from environment files in user-facing answers. Do not expose admin defaults.

## Ask product owner to decide or document

- Is NeuroSage mainly for students, young adults, or a broader audience?
- Are users allowed to join group sessions with camera off or audio off? What are the participation rules?
- What exactly does “monitor” mean during facilitator-led sessions? Is there explicit consent and what data can an administrator view?
- Are live sessions recorded? The inspected page embeds Jitsi and does not by itself establish recording policy. The assistant must not assume recording occurs or does not occur.
- What is the formal privacy/data retention policy for AI chat, user profiles, focus intentions, notes, payment proof, UTR references, and session participation?
- What is the refund, cancellation, and rescheduling policy for camp registrations and Live Body Doubling?
- What are the precise eligibility requirements, event date, venue, and participant capacity for each camp?
- Are the awareness descriptions reviewed by a qualified mental-health professional and when were they last reviewed?
- Are book links checked for correctness/licensing and accessibility?
- Which contacts should be used for product support versus campus awareness versus emergencies?
- What are the operational guarantees for AI response latency and availability?

## Rule for the assistant

When a user asks a question whose answer depends on any item above, acknowledge that the knowledge base does not establish it. Do not guess or present a default from the repository as current live truth.
