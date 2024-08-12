import Link from 'next/link';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return redirect('/');
  }

  const confirmReset = async (formData: FormData) => {
    'use server';

    const origin = headers().get('origin');
    const email = formData.get('email') as string;
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });

    if (error) {
      return redirect('/forgot-password?message=Could not authenticate user');
    }

    return redirect(
      '/confirm?message=Password Reset link has been sent to your email address'
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <Link
        href="/"
        className="py-2 px-4 rounded-md text-white bg-indigo-700 hover:bg-indigo-800 text-sm mb-8"
      >
        Home
      </Link>

      <div className="w-full px-8 sm:max-w-md mx-auto mt-4">
        <form
          className="flex flex-col w-full gap-4"
          action={confirmReset}
        >
          <label className="text-white text-lg" htmlFor="email">
            Enter Email Address
          </label>
          <input
            className="rounded-md px-4 py-2 bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            name="email"
            placeholder="you@example.com"
            required
          />

          <button className="bg-indigo-700 rounded-md px-4 py-2 text-white hover:bg-indigo-800">
            Confirm
          </button>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-red-500 text-white text-center rounded-md">
              {searchParams.message}
            </p>
          )}
        </form>

        <Link
          href="/login"
          className="mt-6 text-indigo-500 hover:underline text-sm block text-center"
        >
          Remember your password? Sign in
        </Link>
      </div>
    </div>
  );
}
