# Structured Product Facts

The fenced JSON is intended for use by scripts or as a compact source during product-assistant retrieval. Status values describe repository evidence, not guaranteed live production status.

```json
{
  "product": {
    "name": "NeuroSage",
    "tagline": "Be kind to your mind.",
    "category": "Mental-wellness awareness and self-care platform",
    "primary_audience": ["students", "young adults"],
    "scope": ["awareness education", "guided focus", "supportive reflection", "community wellness initiatives"],
    "medical_scope": "Non-diagnostic; not medical diagnosis, clinical treatment, psychiatric advice, or therapy"
  },
  "features": [
    {
      "id": "awareness_guide",
      "name": "Mental-health awareness guide",
      "status": "implemented_ui",
      "topics": ["ADHD", "phobias", "depression", "PTSD", "OCD", "bipolar disorder", "insomnia", "schizophrenia", "paranoia", "panic disorder"],
      "limitation": "Education only; not a diagnostic test"
    },
    {
      "id": "body_doubling_workspace",
      "name": "Body Doubling Workspace",
      "status": "implemented_in_repository",
      "timer_minutes": [15, 25, 45, 60],
      "tools": ["intention", "task checklist", "browser-generated ambient sound", "4-4-4-4 box breathing", "reflection note"],
      "sounds": ["silence", "gentle rain", "ocean waves", "deep brown noise"]
    },
    {
      "id": "ai_companion",
      "name": "AI Wellness Companion",
      "status": "implemented_in_repository; deployment configuration required",
      "default_provider": "Ollama",
      "default_model": "llama3.2:3b",
      "default_base_url": "http://127.0.0.1:11434",
      "capabilities": ["supportive reflection", "grounding suggestions", "rule-based fallback", "per-user chat history", "clear chat history action"],
      "limitation": "Not a therapist, diagnostic service, or reliable emergency detection system"
    },
    {
      "id": "brainwell_camp",
      "name": "Brainwell Camp",
      "status": "registration_workflow_implemented; live event details must be verified",
      "tagline": "Revive your mind.",
      "configured_fee_inr": 49,
      "default_capacity": 50,
      "default_date": "Details to be announced",
      "default_venue": "Details to be announced",
      "payment_method": "Payment slip upload with manual administrator verification",
      "registration_states": ["PENDING_PAYMENT_VERIFICATION", "CONFIRMED", "WAITLISTED", "PAYMENT_REJECTED", "CANCELLED"],
      "features": ["sequence numbers", "queue position", "seat assignment subject to capacity", "waitlist", "audit log", "cancellation"]
    },
    {
      "id": "live_body_doubling",
      "name": "Live Body Doubling",
      "status": "implemented_in_repository; payment configuration and active session required",
      "configured_price_inr": 299,
      "payment_method": "UPI QR + UTR/transaction reference + manual administrator approval",
      "video_provider": "Jitsi embedded room",
      "features": ["facilitator-led live room", "checklist displayed next to call", "admin payment review and session control"],
      "limitation": "No automatic payment gateway verification established by inspected code"
    },
    {
      "id": "books_for_mind",
      "name": "Books for the Mind",
      "status": "reading_list_ui_present; operational status verify",
      "features": ["curated book descriptions", "topic tags", "external book links"],
      "limitation": "Does not establish full-text books are hosted"
    },
    {
      "id": "wellness_pharmacy",
      "name": "Wellness Pharmacy",
      "status": "coming_soon",
      "limitation": "No end-to-end purchase flow established; not an online prescription-drug seller"
    },
    {
      "id": "professionals_directory",
      "name": "Mental Wellness Professionals",
      "status": "coming_soon",
      "limitation": "Appointments and medical consultations not available in inspected code"
    }
  ],
  "brand_values": ["compassion", "calm", "approachability", "small manageable steps", "awareness", "community"],
  "do_not_claim": [
    "diagnosis or treatment",
    "guaranteed mental-health outcomes",
    "universal superiority over competitors",
    "100% privacy or end-to-end encryption without independent verification",
    "automatic UPI/payment-gateway verification",
    "confirmed camp seat before status says confirmed",
    "available clinician appointments or pharmacy purchases",
    "complete crisis detection"
  ]
}
```
