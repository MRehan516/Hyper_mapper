# Credibility & Honesty Stabilization

Text/analytics-only changes in `src/routes/index.tsx`. No changes to Supabase calls, mapping execution, print CSS, sidebar, dropzone, format toggles, or PWA install.

## 1. Research & Impact citation

Replace the two large stat cards (92.1% / 83.4%) and the quote block with a single citation card carrying the exact approved wording:

"According to Connolly, Constable & Mullally (2023, Frontiers in Psychiatry), 92.1% of students experiencing severe school distress are neurodivergent (83.4% autistic). Standard educational environments demand high working memory, which frequently triggers executive dysfunction. Hyper-Mapper is built to bridge this accessibility gap."

Attribution line updated to the full three-author citation with journal.

## 2. My Learning DNA — remove false precision

Current view shows a "Autonomous Behavioral Adaptation / Local pattern intelligence" panel with derived "Top anchor category" and counts. Replace that panel with an honest local activity log:

- Heading: "Recent activity (this device only)".
- A simple list built from the existing localStorage deck: concept title, cognitive anchor used, and timestamp (locale-formatted date + time).
- Empty state when there is no history yet.
- Keep the "Cognitive anchor" and "Sensory & formatting options" cards (factual, user-set) and the Export Teacher Pass button unchanged.
- Remove the now-unused `deckStats`/`categorizeAnchor` derivation if nothing else references it; no percentages or mastery scores anywhere.

## Technical notes

- Only `src/routes/index.tsx` is edited; timestamps read from the deck item's saved date field (fall back to "—" if absent).
- Teacher Pass export and print classes (`no-profile-print`, etc.) stay on the same wrappers.
