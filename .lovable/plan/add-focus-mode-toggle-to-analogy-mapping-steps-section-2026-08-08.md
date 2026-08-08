Add Focus Mode toggle to Analogy Mapping Steps section

1. Add imports to `src/routes/index.tsx`:
   - Import `Switch` from `@/components/ui/switch`.
   - Import `ChevronLeft` and `ChevronRight` from `lucide-react`.

2. Add state inside `Index()` component:
   - `const [isFocusMode, setIsFocusMode] = useState(false);`
   - `const [activeCardIndex, setActiveCardIndex] = useState(0);`

3. Add reset `useEffect`:
   - `useEffect(() => { setActiveCardIndex(0); setIsFocusMode(false); }, [result]);`
   - This prevents out-of-bounds index when a new concept map is generated.

4. Add the Focus Mode toggle UI above the mapping cards:
   - Place a row (flex, wrap-friendly) inside the `section` for `#mappings`, after the heading and before the card list.
   - Render a `<Switch>` with `id="focus-mode"`, `checked={isFocusMode}`, `onCheckedChange={setIsFocusMode}`.
   - Add a `<label htmlFor="focus-mode">` with the text "Focus Mode (One step at a time)" so the label is explicitly associated with the input.
   - Style for accessibility and alignment (e.g., `rounded-xl border border-border bg-card p-4`, `min-h-11`, focus-visible ring).

5. Update mapping cards rendering logic:
   - When `isFocusMode` is `false`, keep rendering all `result.mappings` exactly as today (vertical list/grid).
   - When `isFocusMode` is `true`, render only `result.mappings[activeCardIndex]`. Keep the same card markup and step numbering (index + 1).

6. Add Previous/Next navigation buttons below the active card when `isFocusMode` is `true`:
   - Render `Button` "Previous Step" with `ChevronLeft`, disabled when `activeCardIndex === 0`.
   - Render "Next Step" with `ChevronRight`, disabled when `activeCardIndex === result.mappings.length - 1`.
   - On click: `setActiveCardIndex((i) => Math.max(0, i - 1))` / `Math.min(result.mappings.length - 1, i + 1)`.
   - Apply disabled opacity styling (`disabled:opacity-50`).

7. Safety boundaries:
   - Do not mutate `result.mappings` array.
   - Do not remove or change `bridge_check` rendering logic.
   - Only add new visual presentation logic.

8. Verify:
   - Run `bun run build` and check for TypeScript errors.
   - Check that the toggle works and boundary buttons disable correctly.
