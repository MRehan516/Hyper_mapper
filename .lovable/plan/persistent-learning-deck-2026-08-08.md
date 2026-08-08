# Persistent Learning Deck

Automatically save each generated concept map to the browser and show them in a collapsible "Your Saved Maps" list at the bottom of the dashboard. Purely additive — the existing result card, quiz, bridge check and Focus Mode stay untouched.

## What gets built

- **Deck state**: a `deck` array initialized from `localStorage` key `hypermapper_deck`, wrapped in try/catch so corrupt or missing data falls back to an empty list.
- **Persistence**: a `useEffect` writes the deck back to `localStorage` whenever it changes, guarded so a storage failure never crashes the page.
- **Save on generation**: right after the new map is set into `result`, a copy is prepended to the deck with a `_id` from `crypto.randomUUID()`, alongside the concept and anchor text, and the list is capped at the 15 most recent maps to avoid storage quota errors.
- **Saved Maps section**: at the bottom of the dashboard, a "Your Saved Maps" heading with an Accordion (shadcn). Each closed row shows only the concept name; expanding it reveals the saved summary and its analogy mappings. Hidden entirely when the deck is empty.

## Technical notes

- Single file changed: `src/routes/index.tsx` (plus the existing `@/components/ui/accordion` import).
- Deck rendering reuses the existing mapping card markup for consistency; no changes to `result`, `sessionId`, quiz state, or any Supabase call.
- Accordion items are keyboard-accessible by default; each trigger gets an accessible label with the concept name.
