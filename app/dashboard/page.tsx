
import Image from 'next/image';
import Link from 'next/link';
import profileIcon from '@/app/assets/profile-pic.jpg'
import styles from '@/app/dashboard/dashboard.module.css'
import FooterBottom from '@/components/firstPage/footerBottom';
// import AuthButton from "@/omponents/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SignOut from '@/components/signOut';


export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }


  const profileImageSrc = user.user_metadata?.avatar_url || profileIcon;


  return (
    <div className={styles.dashboard}>
      <aside className={styles.aside}>
      <Link href="/content">
        <button className={styles.createContentButton}>Write ✍️</button>
      </Link>
      <header className={styles.header}>
        <h2 className={styles.name}>
          Welcome {user.phone || 'John Doe'}
        </h2>
        <div className={styles.profile}>
          <Image src={profileImageSrc} alt="Profile" width={50} height={50} />
          <span>{user?.email}</span>
        </div>
        <SignOut />
      </header>
    </aside>
      <section className={styles.searchBar}>
        <h2>Search</h2>
        <input type="text" placeholder="Search content or users..." />
      </section>
      <section className={styles.metrics}>
        <div className={styles.metricItem}>
          <h2>Posts</h2>
          <p>42</p>
        </div>
        <div className={styles.metricItem}>
          <h2>Followers</h2>
          <p>123</p>
        </div>
        <div className={styles.metricItem}>
          <h2>Likes</h2>
          <p>789</p>
        </div>
      </section>
      <section>
        {/* <PieChart data={pieData} /> */}
      </section>
      <section className={styles.recentActivity}>
        <h2>Recent Activity</h2>
        <ul className={styles.activityList}>
          <li>Latest post...</li>
          <li>Another activity...</li>
          {/* Map over recent posts and comments */}
        </ul>
      </section>
      <section className={styles.notifications}>
        <h2>Notifications</h2>
        <ul className={styles.notificationList}>
          <li>New comment on your post...</li>
          <li>Someone liked your post...</li>
          {/* Map over notifications */}
        </ul>
      </section>
      <section className={styles.quickLinks}>
        <h2>Quick Links</h2>
        <ul className={styles.quickLinksList}>
          <li><Link href="/create-post">Create New Post</Link></li>
          <li><Link href="/profile">Manage Profile</Link></li>
          <li><Link href="/explore">Explore Content</Link></li>
        </ul>
      </section>
      <FooterBottom/>
    </div>
  );
}