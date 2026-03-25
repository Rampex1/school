import { beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Reset module state before each test
beforeEach(() => {
  // Clear any mocked data between tests
  // This ensures test isolation
});

// Mock Next.js server-only modules
vi.mock('server-only', () => ({}));

// Global test utilities can be added here
