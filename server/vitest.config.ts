// packages/api/vitest.config.ts
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  plugins: [tsconfigPaths()],
  test: {
    env: loadEnv("test", process.cwd(), ""),
    pool: "forks", // safer for DB connections
    poolOptions: {
      forks: { singleFork: true },
    },
  },
}));
