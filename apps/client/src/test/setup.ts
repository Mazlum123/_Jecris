import '@testing-library/jest-dom';
import { expect, afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock de fetch global
global.fetch = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  cleanup();
});