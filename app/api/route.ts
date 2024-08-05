// app/api/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { saveProfile } from '@/utils/profilesQuery';

export async function POST(req: NextRequest) {
  try {
    const { user_id, username, role, bio, profile_picture } = await req.json();
    const data = await saveProfile({ user_id, username, role, bio, profile_picture });
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
