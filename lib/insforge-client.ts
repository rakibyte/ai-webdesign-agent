import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl:
    process.env.NEXT_PUBLIC_INSFORGE_BASE_URL ||
    process.env.NEXT_PUBLIC_INSFORGE_URL ||
    'https://dbkj3rqn.us-east.insforge.app',
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

// Polyfill getCurrentSession on auth for @insforge/react & @insforge/nextjs compatibility
if (!('getCurrentSession' in insforge.auth)) {
  Object.defineProperty(insforge.auth, 'getCurrentSession', {
    value: async function getCurrentSession() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const auth = this as any;
      const session = auth.tokenManager?.getSession?.();
      if (session?.accessToken && session?.user) {
        return { data: { session }, error: null };
      }
      try {
        const { data, error } = await auth.getCurrentUser();
        if (error || !data?.user) {
          return { data: { session: null }, error: error ?? null };
        }
        const activeSession = auth.tokenManager?.getSession?.();
        if (activeSession) {
          return { data: { session: activeSession }, error: null };
        }
        const token = auth.tokenManager?.getAccessToken?.() || '';
        return {
          data: {
            session: {
              accessToken: token,
              user: data.user,
            },
          },
          error: null,
        };
      } catch (err) {
        return { data: { session: null }, error: err };
      }
    },
    writable: true,
    configurable: true,
  });
}

export default insforge;
