# NeuroSage — Frequently Asked Questions

## What is NeuroSage?
NeuroSage is a mental-wellness awareness and self-care platform for students and young adults. It offers condition-awareness content, a guided focus workspace, a reflective AI companion, and Brainwell Camp.

## What does “Be kind to your mind” mean?
It captures NeuroSage's emphasis on compassion, practical small steps, and a less judgmental approach to everyday wellbeing. It is brand language, not a medical promise.

## Is NeuroSage a therapy service?
No. NeuroSage describes itself as an educational awareness, guided-focus, and supportive self-reflection platform. Its content and AI responses are not medical diagnosis, clinical treatment, psychiatric advice, or therapy.

## Can NeuroSage diagnose ADHD, OCD, depression, or another condition?
No. The awareness guide is educational and explicitly says it is not a diagnosis. A qualified health professional can assess symptoms and discuss care options.

## What is the Body Doubling Workspace?
It is a focus environment where a user can set an intention, select a 15/25/45/60-minute timer, create a small checklist, optionally use generated ambient sound, follow a box-breathing rhythm, and write a session reflection.

## What is body doubling?
Body doubling generally means working on a task while another person is present, which some people find helpful for getting started or staying engaged. NeuroSage offers a solo focus workspace and a separate facilitator-led live video-session feature. Do not promise it will work for everyone.

## What sounds can I choose?
The workspace offers Silence, Gentle Rain, Ocean Waves, and Deep Brown Noise. The code generates these sounds in the browser using Web Audio APIs.

## What is the AI Wellness Companion?
It is a conversational space intended for gentle reflection, grounding exercises, and general self-care suggestions. The current server uses a locally configured Ollama model with a rule-based fallback. It is not a therapist or diagnostic tool.

## Does the AI always run locally?
The repository's sample configuration points to Ollama at `http://127.0.0.1:11434` and defaults to `llama3.2:3b`. Whether a particular deployment uses local inference depends on its environment configuration and server topology. Do not claim the entire web product runs only on the user's own device without verifying the deployment.

## Does the AI handle emergencies?
It is not an emergency service. Its backend checks a limited list of crisis phrases and responds with support contacts when matched, but keyword-based detection cannot guarantee that all risk is detected. If someone may be in immediate danger, encourage immediate contact with local emergency services and a trusted person.

## What is Brainwell Camp?
Brainwell Camp is NeuroSage's featured community-oriented wellness initiative. Its current configured name is Brainwell Camp and tagline is “Revive your mind.” The application describes it as encouraging mindful habits, awareness, and supportive conversations.

## How much does Brainwell Camp cost?
The current code configures the fee as ₹49 per participant. Always verify the live event page before stating a price because event settings can change.

## When and where is Brainwell Camp?
The repository's default values say “Details to be announced” for both date and venue. Check the live app or official event communication for updated details. Never invent a date or venue.

## Does submitting the Brainwell Camp form guarantee a seat?
No. The registration begins pending payment verification. A confirmed seat is shown only when the payment is verified and a seat is allocated. When capacity is full, a verified registration may be waitlisted.

## How does the Brainwell Camp queue work?
The backend assigns registrations an atomic, increasing sequence number. Payment slips are reviewed by an administrator; seats are allocated subject to capacity and sequence-based rules, and waitlisting is supported. The user's “My Camp Registrations” page shows status and queue information.

## How do I prove camp payment?
Follow the official instructions shown in the current registration flow and upload the requested payment slip in PDF, JPG, or PNG format, up to 5MB. The repository documents manual verification. Do not share banking information or transaction slips in public chats.

## Can I cancel a camp registration?
The app provides a cancellation flow in My Camp Registrations. It asks for a reason and updates the registration status. The queue service can promote the earliest eligible verified waitlisted participant if a confirmed seat opens.

## What is Live Body Doubling?
It is a separate facilitator-led live session accessible after paid access is approved. The current code embeds a Jitsi video room and puts the user's checklist beside the call.

## How much does Live Body Doubling cost?
The current configured amount is ₹299 INR. Verify the in-app payment prompt for the current amount before paying.

## Is Live Body Doubling payment automatic?
No. The documented flow uses a UPI QR and UTR/transaction reference. An administrator must review and approve the payment. Do not promise automatic gateway verification or instant access.

## Does paying guarantee I can join immediately?
Not necessarily. Payment approval grants access, but the code also requires an active live session to join. If no session is available, check again or contact the NeuroSage team.

## Is the Wellness Pharmacy available now?
It is marked “Coming Soon.” The inspected code does not provide an end-to-end online pharmacy purchasing flow and states that NeuroSage does not sell or distribute prescription drugs online.

## Can I book a therapist or psychiatrist through NeuroSage?
The professional directory is described as coming soon, and the page says appointments and medical consultations are not yet available through NeuroSage. Do not invent provider listings or booking availability.

## Is there a book library?
The current frontend has a Books for the Mind page listing selected books and linking to external book pages. This is not the same as hosting full books or providing medical treatment. Verify which book resources are currently available in the live deployment.

## Can I delete my AI chat history?
The companion includes a “Clear space” action that requests deletion of the signed-in user's stored conversation record. A user can use that control inside the companion.

## Is my information private and encrypted?
The repository includes some privacy-oriented controls, including authenticated user-specific chat history and private authenticated access to camp payment slips. Do not make blanket claims like “100% private” or “everything is encrypted” without a deployment-specific security and data-retention review. Users should avoid sharing highly sensitive information they do not need to share.

## What should I do in a crisis?
NeuroSage is not an emergency service. If danger is immediate, contact local emergency services and reach out to a trusted person now. The repository's UI/backend lists India support numbers including Tele-MANAS 14416 / 1800-891-4416, KIRAN 1800-599-0019, and Vandrevala Foundation +91 9999 666 555. Numbers and availability must be re-verified before deployment; the assistant should not pretend to call on the user's behalf.

## How do I contact the team?
The public page and footer in the inspected repository list campus-awareness leads. Those contact details should be re-verified before use because contact information can change. Prefer the current official website contact section.
