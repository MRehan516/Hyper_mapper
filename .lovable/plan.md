# Plan: Display the new bridge_check question

Add a distinct, accessible card below the existing comprehension quiz on the main dashboard to render the new `bridge_check` object returned by the Edge Function.

## What gets changed

1. **Type update** (`src/lib/supabase.ts`)
   - Add `BridgeCheck` type: `{ question: string; options: string[]; correct_index: number }`.
   - Add `bridge_check?: BridgeCheck` to `ConceptMapPayload`.

2. **State handling** (`src/routes/index.tsx`)
   - Add isolated state: `const [bridgeAnswer, setBridgeAnswer] = useState<number | null>(null);`.
   - Reset `bridgeAnswer` to `null` whenever a new map is generated (`generate()`), alongside the existing `setAnswers({})`.

3. **UI placement** (`src/routes/index.tsx`)
   - Append the new card **after** the existing comprehension quiz `<ol>`/score block, still inside the result branch.
   - Only render when `result?.bridge_check` exists.
   - Card header: prominent text `"One more check — no factory, no game, just the real thing"` with a Lucide icon (e.g., `ShieldCheck` or `BadgeCheck`).
   - Visual distinction: use `bg-secondary/30` plus a `border-l-4 border-primary` left accent. Keep all colors within the existing Tailwind semantic tokens.
   - Option buttons: mirror the existing quiz option styling but use the isolated `bridgeAnswer` state. Each option is a `<button>` with `min-h-12`, full keyboard access, and `aria-label`.
   - Feedback: after selection, show correct/incorrect icon and explanation (if available) — similar pattern to existing quiz, but independent state.

4. **Safety**
   - Leave the existing `comprehension_check` mapping loop and `answers` state untouched.
   - Do not save the bridge answer score to the database; the requirement only asks to display it.

## Verification

- Run `bun run build` after edits to confirm no TypeScript or runtime errors.
