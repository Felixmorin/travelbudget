import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { requireSupabaseAuthConfig } from "./config";

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  const config = requireSupabaseAuthConfig();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot set cookies; proxy refreshes sessions.
        }
      },
    },
  });
};
