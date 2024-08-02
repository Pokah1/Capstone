import ProfileForm from '@/components/ProfileForm';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FooterBottom from "@/components/firstPage/footerBottom";
import { Profile, User } from '@/types';

export default async function Profiles() {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/');
    return null; // Ensure no further rendering occurs
  }

  let profile: Profile | null = null;

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') {
    console.error('Profile error:', profileError.message, 'for user ID:', user.id);
    throw new Error(`Error fetching profile data for user ID ${user.id}`);
  } else if (profileData) {
    profile = profileData;
  }

  // Default profile object if no profile data exists
  const defaultProfile: Profile = {
    user_id: user.id,
    username: '',
    role: 'Reader',
    bio: ''
  };

  return (
    <div>
      <h1 className="text-white mt-3 font-bold">Profiles</h1>
      <p className="text-white">Welcome, {user.email}</p>
      <ProfileForm profile={profile || defaultProfile} user={user as User} />
      <FooterBottom />
    </div>
  );
}
