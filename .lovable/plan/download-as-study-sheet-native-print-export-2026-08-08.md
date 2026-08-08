# Download as Study Sheet (native print export)

Add a print-friendly export of the active concept map — no external libraries, just a button and CSS print rules.

## What the user sees

- A secondary "Download as Study Sheet" button with a Download icon, sitting next to the "Analogy Mapping Steps" title (visible only when a map exists).
- Clicking it opens the browser's native print/save-as-PDF dialog.
- The printed sheet contains only: concept summary, all mapping steps, the comprehension check, and the bridge check.
- Printing is always black text on white, even when Dark Mode is on.

## Technical details

**src/routes/index.tsx**
- Import `Download` icon; add the button next to the mappings heading, `variant="outline"`, calling `window.print()`.
- Add `no-print` class to: site header wrapper (via header component or a wrapper), the accessibility banner, the Step 1 input card, the Focus Mode toggle row, the Previous/Next step buttons, and the "Your Saved Maps" section, plus the new button itself.
- Add `print-card` class to the mapping cards, summary card, and check cards.
- When Focus Mode is on, printing shows only the active card (acceptable) — no state changes are made.

**src/styles.css** — append a `@media print` block:
- `.no-print { display: none !important; }`
- Force `background: white !important` on `html, body` and `color: black !important` on body and all descendants (`body *`), plus `border-color: #999 !important`.
- `.print-card, section { break-inside: avoid; }`
- Remove shadows and rounded heaviness: `box-shadow: none !important;`
- `@page { margin: 1.5cm; }`

## Safety

No data, state, or backend logic is touched; changes are a button plus CSS classes.
