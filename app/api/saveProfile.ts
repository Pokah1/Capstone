import { NextRequest, NextResponse } from 'next/server';
import { saveProfile } from '@/utils/databaseActions/profilesQuery';
import { Profile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const {
      user_id,
      username = '',
      role = 'Reader',
      bio = '',
      profile_picture = null,
    }: Partial<Profile> = await req.json();
    
    if (!user_id) {
      throw new Error('user_id is required');
    }

    const data = await saveProfile({ user_id, username, role, bio, profile_picture });
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

