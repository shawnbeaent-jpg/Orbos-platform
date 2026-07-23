import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Unit + integration tests for pure domain logic (no DB required).
    include: ['lib/**/*.test.ts', 'tests/unit/**/*.test.ts'],
    exclude: ['node_modules', '.next', 'tests/e2e', 'reference'],
    environment: 'node',
  },
});
