# Plan: Update Anchor Chip Focus Timing to `setTimeout`

## Goal
Adjust the existing anchor suggestion chips in `src/routes/index.tsx` so that after a chip writes its anchor string into the input, focus and caret placement at the end of the string are deferred using `setTimeout(() => { ... }, 0)` instead of `requestAnimationFrame`.

## Current State
- The six chips, Lucide icons, suggestions array, `anchorInputRef`, `applyAnchorSuggestion`, and chip UI are already present in `src/routes/index.tsx`.
- The existing `applyAnchorSuggestion` uses `requestAnimationFrame` to focus the input and set the selection range.

## Changes
1. In `src/routes/index.tsx`, change `applyAnchorSuggestion`:
   - Replace the `requestAnimationFrame` wrapper with `setTimeout(() => { ... }, 0)`.
   - Keep the same body: `input.focus()` and `input.setSelectionRange(value.length, value.length)` after confirming `input` exists.
2. Confirm the surrounding chips, icons, labels, `aria-label`, `min-h-11`, `border-2`, `focus-visible` rings, and `role="list"`/`role="listitem"` structure remain unchanged.

## Files to Modify
- `src/routes/index.tsx` — only the `applyAnchorSuggestion` function.

## Verification
- Run a build to confirm no type errors.
- Optionally verify in the preview that clicking a chip still inserts the text, focuses the input, and places the cursor at the end of the inserted string.
