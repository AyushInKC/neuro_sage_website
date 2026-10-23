# NeuroSage User Journeys

## Journey A — New visitor wants to understand NeuroSage

1. Open the landing page.
2. Read the product introduction and service overview.
3. Browse awareness cards to learn about mental-health topics.
4. Explore Brainwell Camp details.
5. Register or sign in to use authenticated tools.

Suggested assistant guidance: Ask what the visitor wants help with — learning about a feature, focusing on a task, reflective support, or camp registration. Do not pressure them to disclose personal health information.

## Journey B — Create an account

1. Open **Get started / Register**.
2. Enter full name, email, password, and password confirmation.
3. Agree to the terms/privacy text to complete registration.
4. Optionally consent to occasional campus wellness updates.
5. Continue to the dashboard.

If registration fails, offer general troubleshooting (check required fields, password length, network/server status). Never ask the user to send their password to the assistant.

## Journey C — Use the Body Doubling Workspace for a task

1. Sign in and open **Body Doubling Workspace**.
2. Write one clear intention, such as “Read two pages” or “Draft one paragraph.”
3. Select a 15-, 25-, 45-, or 60-minute focus block.
4. Add two or three small, concrete checklist actions.
5. Optionally choose silence, gentle rain, ocean waves, or deep brown noise.
6. Start the timer; pause or reset as needed.
7. Use the 4-4-4-4 box-breathing guide if it feels comfortable.
8. Write a short reflection note about the focus block.

Helpful assistant behavior: Make the next action small and specific. Avoid framing rest, interruption, or unfinished tasks as personal failure. Breathing exercises are optional; if they cause discomfort, suggest stopping and choosing another grounding method.

## Journey D — Talk with the AI Wellness Companion

1. Sign in and open the companion.
2. Begin with a starter prompt or type a message.
3. Read the response, which is intended for supportive reflection and general wellness.
4. Chat history is loaded from the user's account.
5. Use **Clear space** to delete the stored conversation history for that account.

Boundaries: The companion cannot diagnose, prescribe, or replace a professional. For medical questions or persistent symptoms, encourage a qualified professional. For imminent danger or self-harm risk, prioritize immediate human support and emergency/crisis resources.

## Journey E — Register for Brainwell Camp

1. Sign in.
2. Open Brainwell Camp details and check the currently configured dates, venue, capacity, and registration status. The repository's defaults say dates and venue are to be announced.
3. Open registration and provide full name, email, institution, and academic year.
4. Follow the currently displayed official payment instructions for ₹49 and upload a payment slip (PDF, JPG, or PNG, at most 5MB).
5. Submit the registration.
6. The system assigns a registration reference and sequence number. The status begins as pending payment verification.
7. Open **My Camp Registrations** to check current payment status, queue position, seat allocation, or waitlist status.
8. If capacity has been reached after verification, the user may be waitlisted. If an eligible confirmed seat becomes available, the FCFS process can promote the earliest eligible verified waitlisted participant.
9. A user may cancel a registration using the in-product cancellation flow.

Never promise a seat before the registration status is confirmed. Never claim payment is automatically verified.

## Journey F — Unlock Live Body Doubling

1. Sign in and open the Body Doubling Workspace.
2. Choose **Unlock Live Body Doubling — ₹299**.
3. Scan the configured UPI QR code and pay using a supported UPI app.
4. Enter the UTR/transaction reference.
5. Wait for an administrator to verify the transaction. The user remains pending until this review.
6. After approval, check whether an active facilitator session is available.
7. Join the Jitsi room when the join action is available.
8. Use the existing checklist beside the video call; leave the session through the page control.

This is manual verification, not an automatic payment gateway. Payment approval does not mean an active session is always available.

## Journey G — Ask about future resources

- If asked about pharmacy access, state that it is marked coming soon and online pharmacy purchasing is not available in the inspected implementation.
- If asked to book a clinician, state that the professional directory/appointments are described as planned and booking is not available in the inspected implementation.
- If asked for mental-wellness books, the current UI includes a curated list and external book information links, but not full-text book access.
