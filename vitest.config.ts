import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    include: ["./src/tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "node_modules/**",
        "src/tests/**",
        ".next/**",
        "dist/**",
        "**/*.d.ts",
        "**/*.config.{js,ts}",
        "**/mocks/**",
      ],
      include: ["src/**/*.{ts,tsx}"],
      reportsDirectory: "./coverage",
      all: false,
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
