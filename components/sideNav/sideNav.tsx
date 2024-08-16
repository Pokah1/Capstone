"use client";
import React, { SVGProps, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/components/sideNav/sideNav.module.css';
import Logo from '@/app/assets/logo.png';
import dashboardIcon from '@/app/assets/dashboard.svg';
import contentIcon from '@/app/assets/content.svg';
import profileIcon from '@/app/assets/profile.svg';
import { createClient } from '@/utils/supabase/client';
import profileImage from '@/app/assets/profile-pic.jpg'
import logoutIcon from '@/app/assets/logout.svg'
import AuthWrapper from '../AuthWrapper';





interface SideNavProps {
  id?: string;
}

const SideNav: React.FC<SideNavProps> = ({ id }) => {
  const [user, setUser] = useState<any>(null); // Updated to any or appropriate type
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error);
        } else {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      localStorage.clear();
      setUser(null);
      router.push('/'); // Redirect to the HomePage
    }
  };

  interface MenuItems {
    title: string;
    icon: React.FC<SVGProps<SVGSVGElement>>;
    onClick?: () => void;
  }

  const menuItems: MenuItems[] = [
    { title: 'Dashboard', icon: dashboardIcon, onClick: () => router.push('/dashboard') },
  
    { title: 'Content', icon: contentIcon, onClick: () => router.push('/content') },
    
   
  ];

  const accountItems: MenuItems[] = [
    { title: 'Profile', icon: profileIcon, onClick: () => router.push('/profiles') },
   
    { title: 'Logout', icon: logoutIcon, onClick: signOut },
  ];

  return (
    <AuthWrapper>
    <main className="container">
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href='/'>
            <Image className={styles.logo} src={Logo} alt="logo" />
          </Link>
          <h2>Chatter</h2>
        </div>
        <ul className={styles.sidebarLinks}>
          <h4>
            <span>Main Menu</span>
            <div className={styles.menuSeparator}></div>
          </h4>
          {menuItems.map((item, index) => (
            <li key={index}>
              <a href="#" onClick={item.onClick}>
                <item.icon className={`${styles.icon} ${item.title}Icon`} />
                <span className={styles.title}>{item.title}</span>
              </a>
            </li>
          ))}
          <h4>
            <span>Account</span>
            <div className={styles.menuSeparator}></div>
          </h4>
          {accountItems.map((item, index) => (
            <li key={index}>
              <a href="#" onClick={item.onClick}>
                <item.icon className={`${styles.icon} ${item.title}Icon`} />
                <span className={styles.title}>{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.userAccount}>
          <div className={styles.userProfile}>
            <Image
              src={user?.user_metadata?.avatar_url || profileImage}
              alt="user-profile"
              width={50}
              height={50}
              className={styles.profilePic}
            />
            <div className={styles.userDetails}>
            <span>
                {user?.user_metadata?.full_name || user?.email || 'Guest'}
              </span>
              <span>{user?.role || 'User'}</span>
            </div>
          </div>
        </div>
      </aside>
    </main>
    </AuthWrapper>
  );
};

export default SideNav;
