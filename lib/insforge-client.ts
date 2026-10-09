import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl:
    process.env.NEXT_PUBLIC_INSFORGE_BASE_URL ||
    process.env.NEXT_PUBLIC_INSFORGE_URL ||
    'https://dbkj3rqn.us-east.insforge.app',
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

export default insforge;
