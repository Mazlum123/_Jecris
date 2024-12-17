import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Désactiver les logs en production
console.error = () => {};
console.warn = () => {};

afterEach(() => {
  cleanup();
});