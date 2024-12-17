interface EnvConfig {
    apiUrl: string;
    stripeKey: string;
    environment: 'development' | 'production' | 'test';
  }

  const getEnvConfig = (): EnvConfig => {
    switch (process.env.NODE_ENV) {
      case 'production':
        return {
          apiUrl: import.meta.env.VITE_API_URL,
          stripeKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
          environment: 'production'
        };
      case 'test':
        return {
          apiUrl: 'http://localhost:3000/api',
          stripeKey: 'test_key',
          environment: 'test'
        };
      default:
        return {
          apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
          stripeKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
          environment: 'development'
        };
    }
  };

  export const env = getEnvConfig();