// pages/404.tsx
import Link from 'next/link';
import styles from '@/app/not-found.module.css'; // Optional: if you want to use CSS modules

const NotFound = () => {
  return (
    <main className={styles.contentWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.description}>
          Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/" className={styles.link}>
          Go back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
