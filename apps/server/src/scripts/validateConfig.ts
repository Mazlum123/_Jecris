import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  FRONTEND_URL: z.string().url()
});

const validateConfig = () => {
  try {
    const config = envSchema.parse(process.env);
    console.log('✅ Configuration validée');
    return config;
  } catch (error) {
    console.error('❌ Configuration invalide:', error);
    process.exit(1);
  }
};

export const config = validateConfig();