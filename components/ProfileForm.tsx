'use client';

import { useState } from 'react';
import supabase from '@/utils/supabase/client';
import { Profile, User } from '@/types';

interface ProfileFormProps {
  profile: Profile;
  user: User;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, user }) => {
  const [username, setUsername] = useState(profile.username || '');
  const [role, setRole] = useState(profile.role || 'Reader');
  const [bio, setBio] = useState(profile.bio || '');
  const [profilePicture, setProfilePicture] = useState(profile.profile_picture || '');

  const handleSave = async () => {
    console.log('Saving profile with data:', {
      user_id: user.id,
      username,
      role,
      bio,
      profile_picture: profilePicture,
    });

    const response = await fetch('api/saveProfile', {
      method: 'POST',
      headers: {
'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        username,
        role,
        bio,
        profile_picture: profilePicture || null
      }),
    });

   
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error saving profile:', errorData.error);
    } else {
      const data = await response.json();
      console.log('Profile saved successfully:', data);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-4">
        <label className="block mb-2">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Role:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="Writer">Writer</option>
            <option value="Reader">Reader</option>
          </select>
        </label>
        <label className="block mb-2">
          Bio:
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Profile Picture (optional):
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter URL or leave empty"
          />
        </label>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
