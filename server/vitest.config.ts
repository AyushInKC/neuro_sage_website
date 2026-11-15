
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    hookTimeout: 60000, // 60 seconds for beforeAll/afterAll
    testTimeout: 30000, // 30 seconds for individual tests
  },
});
