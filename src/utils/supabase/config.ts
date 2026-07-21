const PLACEHOLDER_VALUES = new Set([
  "your-anon-key",
  "your-supabase-anon-key",
  "your-supabase-url",
]);

const readEnv = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value || PLACEHOLDER_VALUES.has(value.toLowerCase())) {
    return undefined;
  }

  return value;
};

export const getSupabaseAuthConfig = () => {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
};

export const requireSupabaseAuthConfig = () => {
  const config = getSupabaseAuthConfig();

  if (!config) {
    throw new Error(
      "Supabase auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return config;
};
