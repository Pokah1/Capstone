import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL');
}

if (!supabaseKey) {
    throw new Error('Missing SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      storageKey: 'supabase.auth.token',
      persistSession: true,
      autoRefreshToken: true,
    },
  });

export default supabase;


