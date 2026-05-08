export type SupabaseClientConfig = { url: string; anonKey: string };
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export function getSupabaseClientConfig(): SupabaseClientConfig | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}
export function isSupabaseAuthEnabled(): boolean { return getSupabaseClientConfig() !== null; }
