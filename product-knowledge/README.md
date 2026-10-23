# NeuroSage Product Knowledge Pack

This folder is a user-facing product knowledge base for NeuroSage, prepared from the public repository `AyushInKC/neuro_sage_website` (branch `main`) as inspected on 2026-10-23.

These files are meant to teach a product assistant what NeuroSage is, how users experience it, which features are implemented versus planned, how to explain value without making unsupported claims, and how to respond safely to mental-health-related questions.

## Files

- `01-product-overview.md` — concise canonical description, audience, mission, product pillars.
- `02-feature-catalog.md` — feature-by-feature details and current availability status.
- `03-user-journeys.md` — user-facing workflows.
- `04-differentiators-and-positioning.md` — grounded positioning and comparisons without unverifiable superiority claims.
- `05-faq.md` — user FAQs and answer guidance.
- `06-tone-and-terminology.md` — language, product vocabulary, response style.
- `07-safety-and-trust.md` — mental-health boundaries, crisis support, privacy/payment claims to handle carefully.
- `08-ai-system-instructions.md` — suggested system prompt for an AI that represents NeuroSage.
- `09-knowledge-gaps-and-verification.md` — items to verify and claims that the AI must not invent.
- `10-sample-conversations.md` — example responses grounded in the documented product.
- `11-product-facts.json.md` — machine-friendly structured fact sheet in JSON.
- `SOURCES.md` — repository files used to prepare the pack.

## Important implementation note

These documents do not change Llama's model weights by themselves. They are product knowledge for a system prompt and/or a retrieval-augmented generation (RAG) pipeline. Keep them as the product source of truth, retrieve relevant passages for each user question, and pass those passages to the model.

## Evidence labels

- **Implemented/documented**: represented in current UI/API logic in the repository.
- **Planned/coming soon**: shown as future service or not implemented as a real user workflow in the inspected code.
- **Verify before claiming**: branding or README wording may go beyond what can be proven from inspected implementation, or current service operations can change outside GitHub.

This is based on repository contents, not a live production test. Prices, dates, contact details, helpline availability, service status, and privacy/security practices should be re-verified before publishing or answering time-sensitive questions.
