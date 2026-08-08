# App Workspace layout + Teacher Pass export

Refactor the dashboard into a sidebar workspace, add a printable "Teacher Pass", and move the session feedback form into a modal. All Supabase calls, result state, mapping render loops, Install button and Focus Mode stay exactly as they are.

## What the user sees

**Left sidebar** (collapsible, with a trigger in the header so it can always be reopened):
- The Crisis — a styled info card with the Connolly & Mullally research text.
- My Learning DNA — an "Export Teacher Pass" button that prints a one-page sheet showing only the chosen Cognitive Anchor and the selected Sensory & Formatting options.
- Saved Maps — the existing history accordion, moved out of the page bottom, still driven by the same `deck` state so it updates the moment a new map is generated.

**Main pane** (right): accessibility banner, input card, and all generated output exactly as today.

**Feedback**: the per-conversation feedback form leaves the bottom of the page and becomes a modal that opens from the "Tester feedback" button in the top header. Previously submitted entries for the session stay visible inside the modal.

## Technical details

- `src/components/app-sidebar.tsx` (new): presentational `Sidebar` built from `@/components/ui/sidebar`, props `deck`, `cognitiveAnchor`, `sensoryPrefs`, `onExportTeacherPass`. Renders the three groups; Saved Maps reuses the existing accordion markup and `MappingCard`.
- `src/routes/index.tsx`: wrap page in `SidebarProvider` + `<AppSidebar .../>` + `SidebarInset`; delete the bottom Saved Maps section and the bottom feedback section; move the feedback JSX into a `Dialog` whose open state lives here. Sidebar widths use explicit `var(--sidebar-width)` syntax. No changes to fetch/generate logic beyond passing state down.
- `src/components/site-header.tsx`: add a `SidebarTrigger`; the "Tester feedback" control becomes a button that calls an `onOpenFeedback` prop when provided (the `/tester-feedback` route stays reachable and unchanged as a fallback on other pages).
- Teacher Pass: new `isPrintingProfile` state. Handler sets it true, calls `window.print()` in a `requestAnimationFrame`, and resets on `afterprint`. When true, `<body>` gets a `printing-profile` class (via a wrapper class on the root div) so `@media print` hides everything except a hidden-until-print `#teacher-pass` block listing the anchor and sensory prefs.
- `src/styles.css`: extend the existing `@media print` block with `.printing-profile .no-profile-print { display: none !important; }` and rules to reveal `#teacher-pass`; the current Study Sheet print rules are untouched.

## Safety

No Supabase queries, edge-function calls, parsers, or mapping data structures are altered — this is layout, print CSS, and a modal wrapper only.
