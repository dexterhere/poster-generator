/*
 * What does this file do?
 * Provides the native JavaScript Vite configuration used by development and production builds.
 * Methods/functions in this file: defineConfig default export.
 * Last modification: 2026-05-28, Thursday.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
});
