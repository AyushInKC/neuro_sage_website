# Repository Sources Used

Repository inspected: [AyushInKC/neuro_sage_website](https://github.com/AyushInKC/neuro_sage_website), default branch `main`.

Primary sources consulted:

- [`README.md`](https://github.com/AyushInKC/neuro_sage_website/blob/main/README.md) — product overview, scope, feature summaries, setup notes, stated prices and disclaimers.
- [`client/src/pages/LandingPage.tsx`](https://github.com/AyushInKC/neuro_sage_website/blob/main/client/src/pages/LandingPage.tsx) — public positioning, service cards, Brainwell Camp, ten-item awareness guide, contact section.
- [`client/src/pages/dashboard/DashboardOverviewPage.tsx`](https://github.com/AyushInKC/neuro_sage_website/blob/main/client/src/pages/dashboard/DashboardOverviewPage.tsx) — dashboard, intentions, links to primary features.
- [`client/src/pages/bodyDoubling/BodyDoublingPage.tsx`](https://github.com/AyushInKC/neuro_sage_website/blob/main/client/src/pages/bodyDoubling/BodyDoublingPage.tsx) — timer, tasks, sound choices, breathing, reflections and Live Body Doubling purchase entry.
- [`client/src/pages/bodyDoubling/LiveBodyDoublingPage.tsx`](https://github.com/AyushInKC/neuro_sage_website/blob/main/client/src/pages/bodyDoubling/LiveBodyDoublingPage.tsx) — embedded Jitsi session and checklist.
- [`client/src/pages/ai/AICompanionPage.tsx`](https://github.com/AyushInKC/neuro_sage_website/blob/main/client/src/pages/ai/AICompanionPage.tsx) — companion interface, disclaimers, history clear action.
- [`server/src/services/ai.service.ts`](https://github.com/AyushInKC/neuro_sage_website/blob/main/server/src/services/ai.service.ts) — current system prompt, Ollama request, fallback, limited keyword crisis handling.
- [`server/src/controllers/ai.controller.ts`](https://github.com/AyushInKC/neuro_sage_website/blob/main/server/src/controllers/ai.controller.ts) and [`server/src/models/ChatConversation.ts`](https://github.com/AyushInKC/neuro_sage_website/blob/main/server/src/models/ChatConversation.ts) — authenticated chat persistence and history clearing.
- [`server/src/config/index.ts`](https://github.com/AyushInKC/neuro_sage_website/blob/main/server/src/config/index.ts) and [`server/.env.example`](https://github.com/AyushInKC/neuro_sage_website/blob/main/server/.env.example) — configured model endpoint, sample prices, camp defaults. Secrets are intentionally not repeated here.
- [`client/src/pages/camps/CampDetailsPage.tsx`](https://github.com/AyushInKC/neuro_sage_website/blob/main/client/src/pages/camps/CampDetailsPage.tsx) — camp details, displayed registration policy, queue explanations.
- [`client/src/pages/camps/CampRegisterPage.tsx`](https://github.com/AyushInKC/neuro_sage_website/blob/main/client/src/pages/camps/CampRegisterPage.tsx) and [`client/src/pages/camps/MyRegistrationsPage.tsx`](https://github.com/AyushInKC/neuro_sage_website/blob/main/client/src/pages/camps/MyRegistrationsPage.tsx) — registration form, upload, queue/status UX.
- [`server/src/controllers/camp.controller.ts`](https://github.com/AyushInKC/neuro_sage_website/blob/main/server/src/controllers/camp.controller.ts) — camp registration and retrieval API behavior.
- [`server/src/services/fcfsQueue.service.ts`](https://github.com/AyushInKC/neuro_sage_website/blob/main/server/src/services/fcfsQueue.service.ts) — sequence assignment, payment verification, seat allocation, waitlist promotion, cancellation, audit log and queue statistics.
- [`client/src/pages/services/ComingSoonPages.tsx`](https://github.com/AyushInKC/neuro_sage_website/blob/main/client/src/pages/services/ComingSoonPages.tsx) — pharmacy, clinician directory and books page copy/current UI.
- [`client/src/pages/admin/LiveBodyDoublingAdmin.tsx`](https://github.com/AyushInKC/neuro_sage_website/blob/main/client/src/pages/admin/LiveBodyDoublingAdmin.tsx), [`server/src/controllers/liveBodyDoubling.controller.ts`](https://github.com/AyushInKC/neuro_sage_website/blob/main/server/src/controllers/liveBodyDoubling.controller.ts) and relevant model files — manual payment approval and live session workflow.
- [`client/src/App.tsx`](https://github.com/AyushInKC/neuro_sage_website/blob/main/client/src/App.tsx) — routed product pages.

## Scope limitations

This was a repository inspection, not a production penetration test or live end-to-end test. No database, private runtime settings, hosted service, or user accounts were accessed. Do not infer live availability, operational health, data-retention practices, or clinical quality solely from source files.
