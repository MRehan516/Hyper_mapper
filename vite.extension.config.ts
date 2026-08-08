import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { crx, defineManifest } from "@crxjs/vite-plugin";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const manifest = defineManifest(
  JSON.parse(
    readFileSync(resolve(projectRoot, "extension/manifest.json"), "utf8"),
  ),
);

export default defineConfig({
  root: resolve(projectRoot, "extension"),
  plugins: [react(), tailwindcss(), ...crx({ manifest })],
  resolve: {
    alias: {
      "@": resolve(projectRoot, "src"),
    },
  },
  build: {
    outDir: resolve(projectRoot, "dist-extension"),
    emptyOutDir: true,
    sourcemap: false,
  },
});
