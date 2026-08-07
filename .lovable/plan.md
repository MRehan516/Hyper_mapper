# Hyper-Mapper — Build Plan

An accessibility-first, no-login learning tool that translates K-12 concepts into a student's own "cognitive anchor" (Minecraft Redstone, city transit, logic gates...).

## What gets built

**1. Backend (Lovable Cloud)**
- Enable Cloud (database + serverless functions, no accounts, no login screens).
- Tables:
  - `mapping_sessions`: raw_concept, cognitive_anchor, structured_output (JSON), comprehension_score, created_at
  - `tester_feedback`: tester_identifier, clarity_rating, friction_rating, notes, created_at
  - Both are anonymous-write/no-PII, so public insert/update policies are used deliberately; reads stay closed.
- AI mapping function `map-concept`: takes `{ raw_concept, cognitive_anchor }`, returns `{ error: false, data: { concept_summary, mappings, comprehension_check } }` using the built-in AI gateway (Gemini, no API key needed). Real errors are returned as-is — never mocked.

**2. Learner Dashboard (`/`)**
- Header: "Hyper-Mapper" logo/title, subtitle, teal "Designed & Tested with NNEA Self-Advocates" badge, high-contrast dark-mode toggle (persisted locally).
- Input card (max 700px): concept textarea + cognitive anchor input + large teal "Generate Concept Map" button with spinner state.
- Loading: accessible pulsing skeleton card (aria-busy, live region).
- Results: amber-bordered summary callout; grid of mapping cards with step badge, concept element, anchor equivalent, plain-language explanation.
- Comprehension check: 3 multiple-choice questions, instant green/soft-red feedback (icon + text, not colour alone), final score summary, score saved back to the session row.
- Errors: honest soft-red error card showing the real message plus a Retry button.

**3. Tester Feedback (`/tester-feedback`)**
- Header + subtitle, tester identifier select, two 1–5 star ratings (keyboard-operable radio group), notes textarea, submit → writes to `tester_feedback` → "Thank You for Validating Our Design!" success state.

**4. Design system**
- Warm editorial palette as tokens: background #FDFBF7, cards #FFFFFF, border #E2E8F0, text #1E293B, teal #0D9488, amber #D97706; dark mode #0F172A / #F8FAFC with high-contrast borders.
- Clear sans-serif, leading-relaxed 1.6+, generous spacing, visible focus rings, 44px tap targets, semantic landmarks, per-route SEO metadata.

## Technical notes
- Stack is TanStack Start + Tailwind v4 + shadcn/Lucide. Routes: `src/routes/index.tsx` (replaces placeholder) and `src/routes/tester-feedback.tsx`.
- AI generation is called exactly as specified via `supabase.functions.invoke('map-concept', { body: { raw_concept, cognitive_anchor } })`, reading the nested payload from `data.data`. Note: on this stack a server function would be the more native choice, but the plan follows your specified edge-function contract.
- DB writes go through the browser Supabase client: insert on generation (id kept in state), update `comprehension_score` on quiz completion, insert on feedback submit.
- No auth middleware, no `_authenticated` routes, no session state.
