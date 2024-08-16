// components/AuthWrapper.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react';
import useAuthRedirect from '@/lib/useAuthRedirect';
import styles from '@/components/AuthWrapper.module.css';
import { useRouter } from 'next/navigation';

// Define the interface for props
interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { loading } = useAuthRedirect();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevent rendering until the component is mounted

  if (loading) {
    return <div className={styles.ldsRipple}><div></div><div></div></div>;
  }

  return <>{children}</>;
};

export default AuthWrapper;
