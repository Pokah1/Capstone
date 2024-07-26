import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Import the server-side client

export async function POST() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Clear session cookies
  const headers = new Headers();
  headers.append('Set-Cookie', 'supabase-auth-token=; Max-Age=0; Path=/; HttpOnly');

  return NextResponse.json({ message: 'Signed out successfully' });
}
