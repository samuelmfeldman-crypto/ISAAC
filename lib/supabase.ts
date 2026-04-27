import { createClient } from "@supabase/supabase-js";

// Client-side Supabase (uses NEXT_PUBLIC_ vars — always available in browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder"
);

// Server-side client — only call inside API route handlers, never at module level
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server env vars not set");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
