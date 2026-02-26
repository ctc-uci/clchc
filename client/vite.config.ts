/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@server': path.resolve(__dirname, '../server'),
      },
    },

    /**
     * Configuration for proxying auth requests from our domain to firebaseapp.com.
     *
     * @see {@link client/docs/signInWithRedirect.md} for more detailed documentation.
     */
    preview: {
      allowedHosts: ['clchc-production-a749.up.railway.app'],
    },

    server: {
      fs: {
        allow: [path.resolve(__dirname, '..')],
      },
      proxy: {
        "/__/auth": {
          target: `https://${process.env.VITE_FIREBASE_AUTHDOMAIN}`,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/__\/auth/, "/__/auth"),
        },
      },
    },

    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
    },
  };
});
