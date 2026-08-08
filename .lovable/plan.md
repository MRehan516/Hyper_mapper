# Install App button (manifest-only PWA)

Add a native "Install App" button to the header, backed by a static web app manifest. No service worker, no offline caching, no new packages, no build config changes.

## What gets built

1. **`public/manifest.json`** — name "Hyper-Mapper", short_name "HyperMapper", `display: "standalone"`, `start_url: "/"`, theme_color and background_color `#ffffff`, plus an icon entry pointing at the existing `/favicon.ico` so browsers accept the manifest.

2. **`InstallButton` component** (`src/components/install-button.tsx`)
   - `useEffect` listens for `beforeinstallprompt`, calls `preventDefault()`, stores the event in `deferredPrompt` state; cleans up the listener on unmount.
   - Renders `null` when `deferredPrompt` is null, so nothing shows when install isn't available or the app is already installed.
   - On click: `prompt()`, await `userChoice`, then reset `deferredPrompt` to null.
   - Styled with the existing `Button` (outline variant), Lucide `Download`/`Smartphone` icon, min 44px touch target, matching the High Contrast toggle. Marked `no-print`.

3. **Header wiring** — render `<InstallButton />` next to the High Contrast toggle in `src/components/site-header.tsx`.

## Technical note

This project is TanStack Start, so there is no `index.html` to edit. The manifest link goes in the root route's `head()` links array in `src/routes/__root.tsx` (`{ rel: "manifest", href: "/manifest.json" }`), which renders the exact same `<link rel="manifest">` tag in the document head. A `theme-color` meta and `apple-touch-icon` are added there too.

Untouched: map generation, saved-maps deck, print logic, `vite.config.ts`, dependencies.
