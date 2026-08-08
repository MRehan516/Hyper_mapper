Add a static accessibility banner to the main dashboard

Goal
Add a purely visual, static accessibility banner to the top of the main dashboard (`/`), directly above the existing "Build your concept map" card.

Changes
- In `src/routes/index.tsx`, insert a static banner element immediately inside the `<main>` responsive wrapper (after the `<h1>` and before the "Build your concept map" `<section>`).
- Use the provided styling: `bg-secondary/40 text-secondary-foreground text-sm font-medium py-3 px-4 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-2 text-center mb-6`.
- Include the text: "Designed for how your brain works — zero medical labels, zero diagnostic profiling required."
- Include a gentle Lucide icon (e.g., `Brain` or `Shield`) to the left of the text.
- Ensure the banner is a single, static JSX element with no new React state, no event handlers, and no backend fetch logic.

Verification
- Run the build and confirm no errors.
- Confirm in the preview that the banner appears above the input card and remains within the same responsive max-width column on wide screens.
