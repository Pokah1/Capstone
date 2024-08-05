import Link from "next/link";
import { createClient } from "@/utils/supabase/server"; // Server-side client
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { OAuthButton } from "./oauth-signin";
import { signin, signup } from "./actions";
import styles from '@/app/login/login.module.css'

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }
  

  return (
    <main className={`${styles.container} flex items-center justify-center min-h-screen bg-gray-100`}>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <Link
          href="/"
          className="absolute top-8 left-8 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="text-sm">Back</span>
        </Link>

        <h1 className="w-full text-3xl md:text-4xl lg:text-3xl font-playfair font-bold mb-6">
    CHATTER ✍️ {""}
  </h1>
  <h2 className="text-xl md:text-2xl lg:text-xl font-semibold text-center">
    Sign Up to continue...
  </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border rounded-md bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          
          <SubmitButton
            formAction={signin}
            className="w-full bg-gray-800 text-white rounded-md px-4 py-2 hover:bg-black"
            pendingText="Signing In... "
          >
            Sign In
          </SubmitButton>
          
          <SubmitButton
            formAction={signup}
            className="w-full border border-blue-600 text-blue-600 rounded-md px-4 py-2 hover:bg-blue-50"
            pendingText="Signing Up..."
            style={{ marginBottom: '-20px' }}
          >
            Sign Up
          </SubmitButton>

          {searchParams?.message && (
            <p className="mt-4 p-3 bg-red-100 text-red-600 rounded-md text-center">
              {searchParams.message}
            </p>
          )}
        </form>
        <div className="flex gap-4 mt-5">
      <OAuthButton className="flex-1" />
    </div>
      </div>
    </main>
  );
}
