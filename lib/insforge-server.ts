import { auth } from '@insforge/nextjs/server';
import { createClient } from '@insforge/sdk';

export async function getAuthServer() {
  const { token, user } = await auth();

  const insforge = createClient({
    baseUrl:
      process.env.INSFORGE_BASE_URL ||
      process.env.NEXT_PUBLIC_INSFORGE_BASE_URL ||
      process.env.NEXT_PUBLIC_INSFORGE_URL ||
      'https://dbkj3rqn.us-east.insforge.app',
    edgeFunctionToken: token || undefined,
  });

  return { insforge, user };
}
