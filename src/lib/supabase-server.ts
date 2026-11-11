// Server-side only: imported by route handlers, never by client components.
// The publishable key is public by design; the leads table only allows anonymous INSERT.
export const SUPABASE_URL = 'https://odxzizpyttwqpqesbumf.supabase.co';
export const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_1ha2v65jX-0xvOvc778VrA_FLwkDXgz';
