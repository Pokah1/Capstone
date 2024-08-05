// components/ProfileSetup.tsx
'use client';
import { useState, FormEvent } from 'react';

export default function ProfileSetup() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState(''); // Ensure this is correctly set
  const [profilePicture, setProfilePicture] = useState('');

  const handleProfileSetup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/route', { // Ensure the correct endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, username, bio, role, profile_picture: profilePicture }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
    } else {
      const errorData = await res.json();
      console.error(errorData.error);
    }
  };

  return (
    <form onSubmit={handleProfileSetup}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="text"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Bio"
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
      />
      <input
        type="text"
        value={profilePicture}
        onChange={(e) => setProfilePicture(e.target.value)}
        placeholder="Profile Picture URL"
      />
      <button type="submit" className='bg-red-800 text-white'>Set Up Profile</button>
    </form>
  );
}
