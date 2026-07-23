import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { publicEnv } from '@/lib/env';
import type { Database } from './database.types';

/**
 * Request-scoped Supabase client bound to the signed-in user's cookies.
 * All queries run under the user's JWT, so Row Level Security is enforced.
 * Use this for every read/write on behalf of a user — never the admin client.
 */
export function createSupabaseServerClient(): SupabaseClient<Database> {
  const cookieStore = cookies();
  return createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // `set` throws in Server Components (read-only cookie store).
            // Session refresh is handled in middleware, so this is safe to ignore.
          }
        },
      },
    },
  );
}
