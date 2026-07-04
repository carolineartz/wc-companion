/// <reference types="vitest/config" />

import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // Same-path proxy as the Netlify redirect, so the ESPN fallback route
    // works identically in `npm run dev` and in production.
    proxy: {
      "/api/espn": {
        target: "https://site.api.espn.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/espn/, ""),
      },
    },
  },
  test: {
    // Jest-like ergonomics (globals + jsdom) — a familiar landing spot when
    // migrating a Jest suite to Vitest.
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/components/ui/**", // vendored shadcn primitives
      ],
    },
  },
});
