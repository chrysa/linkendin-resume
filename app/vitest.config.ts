/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      tempDir: '/tmp/vitest-coverage-tmp',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/__tests__/**', 'src/types/**', 'src/vite-env.d.ts', '**/*.d.ts'],
      thresholds: {
        lines: 65,
        branches: 50,
        functions: 55,
        statements: 65,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
