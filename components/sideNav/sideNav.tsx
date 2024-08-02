"use client";
import React, { SVGProps } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/components/sideNav/sideNav.module.css';
import Logo from '@/app/assets/logo.png';
import profileImage from '@/app/assets/profile-pic.jpg';
import dashboardIcon from '@/app/assets/dashboard.svg';
import analyticsIcon from '@/app/assets/analytics.svg';
import contentIcon from '@/app/assets/content.svg';
import discoverIcon from '@/app/assets/discover.svg';
import categoriesIcon from '@/app/assets/category.svg';
import notificationIcon from '@/app/assets/notifications.svg';
import profileIcon from '@/app/assets/profile.svg';
import settingsIcon from '@/app/assets/settings.svg';
// import logoutIcon from '@/app/assets/logout.svg';
import socialIcon from '@/app/assets/socials.svg';

interface SideNavProps {
  id?: string;
}

const SideNav: React.FC<SideNavProps> = ({ id }) => {
  const router = useRouter();


  interface MenuItems {
    title: string;
    icon: React.FC<SVGProps<SVGSVGElement>>;
    onClick?: () => void;
  }

  const menuItems: MenuItems[] = [
    { title: 'Dashboard', icon: dashboardIcon, onClick: () => router.push('/dashboard') },
    { title: 'Analytics', icon: analyticsIcon, onClick: () => router.push('/analytics') },
    { title: 'Content', icon: contentIcon, onClick: () => router.push('/content') },
    { title: 'Discover', icon: discoverIcon, onClick: () => router.push('/discover') },
    { title: 'Categories', icon: categoriesIcon, onClick: () => router.push('/categories') },
    { title: 'Socials', icon: socialIcon, onClick: () => router.push('/socials') },
    { title: 'Notification', icon: notificationIcon, onClick: () => router.push('/notification') },
  ];

  const accountItems: MenuItems[] = [
    { title: 'Profile', icon: profileIcon, onClick: () => router.push('/profiles') },
    { title: 'Settings', icon: settingsIcon, onClick: () => router.push('/settings') },
    // { title: 'Sign Out', icon: logoutIcon, onClick: signOut },
  ];

  return (
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
              src={profileImage}
              alt="user-profile"
              width={50}
              height={50}
              className={styles.profilePic}
            />
            <div className={styles.userDetails}>
              <h3>{'John Doe'}</h3>
              <span>{'Developer'}</span>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
};

export default SideNav;
