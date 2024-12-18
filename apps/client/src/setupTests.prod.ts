import { server } from './tests/mocks/server';

beforeAll(() => {
  // Désactiver les appels réseau réels en prod
  if (process.env.NODE_ENV === 'production') {
    server.listen();
  }
});

afterAll(() => {
  if (process.env.NODE_ENV === 'production') {
    server.close();
  }
});