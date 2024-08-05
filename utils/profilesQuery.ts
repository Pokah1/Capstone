// utils/profilesQuery.ts
import { createClient } from '@/utils/supabase/server';
import { Profile } from '@/types';

const supabase = createClient();

export const saveProfile = async ({
  user_id,
  username,
  role,
  bio,
  profile_picture,
}: Partial<Profile>) => {
  if (!user_id) {
    throw new Error('user_id is required');
  }
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        user_id,
        username: username || '',
        role: role || 'Reader',
        bio: bio || '',
        profile_picture: profile_picture || null,
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
