import { createBrowserClient } from "@supabase/ssr";

import { requireSupabaseAuthConfig } from "./config";

export const createClient = () => {
  const config = requireSupabaseAuthConfig();

  return createBrowserClient(config.url, config.anonKey);
};
