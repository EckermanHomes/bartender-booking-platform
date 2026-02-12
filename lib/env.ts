const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_BASE_URL',
  'ADMIN_PASSWORD',
  'DEPOSIT_MODE',
  'DEPOSIT_AMOUNT',
  'DEPOSIT_PERCENT'
] as const;

export function assertEnv() {
  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`Missing env var: ${key}`);
    }
  }
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
  adminPassword: process.env.ADMIN_PASSWORD ?? '',
  depositMode: (process.env.DEPOSIT_MODE ?? 'flat') as 'flat' | 'percent',
  depositAmount: Number(process.env.DEPOSIT_AMOUNT ?? '100'),
  depositPercent: Number(process.env.DEPOSIT_PERCENT ?? '20')
};
