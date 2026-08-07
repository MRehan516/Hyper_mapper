# Hyper-Mapper — Build Plan

An accessibility-first, no-login learning tool that translates K-12 concepts into a student's own "cognitive anchor" (Minecraft Redstone, city transit, logic gates...).

## What gets built

**1. Backend: your external Supabase (no Lovable Cloud, no built-in AI)**
- No Cloud backend is created, no AI gateway is used, no tables or functions are provisioned. Your existing `mapping_sessions`, `tester_feedback`, and `map-concept` Edge Function are used as-is.
- Add `@supabase/supabase-js` and create a single browser client at `src/lib/supabase.ts` reading `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY` (values supplied by you via the Integrations panel).
- If those values are missing at runtime, the UI shows the same honest error card rather than mock data.


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
- All Supabase calls run client-side against your external instance via `@supabase/supabase-js` — no server functions, no `@/integrations/supabase/*` (that path only exists with Cloud).
- Mapping call is exactly `supabase.functions.invoke('map-concept', { body: { raw_concept, cognitive_anchor } })`, reading the nested payload from `data.data`.
- DB writes: insert into `mapping_sessions` on generation (row id kept in state), update `comprehension_score` on quiz completion, insert into `tester_feedback` on submit.
- No auth middleware, no `_authenticated` routes, no session state.

