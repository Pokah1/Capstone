"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const SignOut: React.FC = () => {
  const router = useRouter();

  const signOut = async () => {
    try {
      const response = await fetch('/api/signout', {
        method: 'GET',
      });

      if (response.ok) {
        router.push('/login?message=Successfully signed out');
      } else {
        const data = await response.json();
        console.error('Error signing out:', data.error);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
    className='bg-black'
    onClick={signOut}>
      Sign Out
    </button>
  );
};

export default SignOut;
