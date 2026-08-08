# Plan: Add Anchor Suggestion Chips to the Main Dashboard

## Goal
Update the main learner dashboard (`/`) so users can quickly choose a common cognitive anchor category via a row of pill-shaped chips below the "Your Preferred Cognitive Anchor" input. Selecting a chip will insert the exact anchor text into the input, then focus the input and place the cursor at the end of the string so the user can keep typing.

## UI Changes
- Add a wrapping row of chips directly below the `Input` for the preferred anchor in `src/routes/index.tsx`.
- Each chip should be a pill-shaped `button` with a Lucide icon and a short label, high-contrast border, and minimum 44px touch height.
- Categories and exact strings to write into state:

  | Icon | Label | Anchor text |
  | --- | --- | --- |
  | Gamepad2 | Video games | Video game logic — |
  | Trophy | A sport I play | Sports rules — |
  | ChefHat | Cooking | Baking/Cooking steps — |
  | TrainFront | Public transit | City transit maps — |
  | Music | Music | Music production — |
  | Clapperboard | A show I love | TV/Movie plots — |

- The chip row should be keyboard-accessible (Tab navigation, activated by Enter/Space) and labeled with clear text. Use a `<div role="list" aria-label="Anchor suggestions">` container with `role="listitem"` items, or use a semantic group if a simpler structure is needed.

## State & Interaction Behavior
- Reuse the existing `anchor` state from the `Index` component.
- Create a `useRef<HTMLInputElement>(null)` for the anchor input and attach it to the `Input` via the `ref` prop.
- When a chip is clicked, call `setAnchor(value)` with the exact string from the table above.
- Immediately after state updates, focus the input and set the cursor at the end of the value. Use `requestAnimationFrame` or a short `setTimeout` after `setAnchor` to ensure the DOM has the new value, then call `inputRef.current.focus()` and `inputRef.current.setSelectionRange(value.length, value.length)`.

## Accessibility Details
- Minimum 44px height (`min-h-11`) for every chip.
- Use `focus-visible` rings from the existing design system.
- Keep the chip text and icons high-contrast against the light/dark backgrounds.
- Each chip should have a descriptive accessible label, e.g., `aria-label="Use anchor: Video game logic —"`.

## Design & Styling
- Use the existing Tailwind theme tokens: `bg-card`, `border-border`, `text-foreground`, `hover:bg-secondary`, `hover:border-primary`, and `focus-visible:ring-ring`.
- Add a subtle transition (`transition-colors`) and a high-contrast border (`border-2`).
- The chip row should wrap on smaller screens using `flex-wrap` and `gap-2`.

## Files to Modify
- `src/routes/index.tsx` — add the chip row, import new Lucide icons, and wire up the ref and state behavior.

## Verification
- Run a build to ensure no type errors and that the new Lucide icons and `useRef` usage are valid.
- Optionally test the preview by clicking a chip and confirming the input is focused with the cursor at the end.
