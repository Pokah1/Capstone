// pages/404.tsx
import Link from 'next/link';

const NotFound = () => {
  return (
    <main className="bg-cover bg-center flex justify-center items-center min-h-screen w-full text-white bg-[url('/assets/404.jpg')]">
      <div className="text-center">
        <h1 className="text-4xl mb-4">404 - Page Not Found</h1>
        <p className="mb-4">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/">
          <p className="text-white underline">Go back to Home</p>
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
