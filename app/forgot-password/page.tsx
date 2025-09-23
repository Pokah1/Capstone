"use client";

import Link from "next/link";
import { forgotPassword } from "../login/actions";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-950 to-black font-poppins text-white grid grid-cols-1 md:grid-cols-2">
      {/* Left Branding */}
      <div
        className="flex flex-col justify-center items-center p-12 
  bg-gradient-to-br from-purple-800/80 via-indigo-900/80 to-black/90 relative"
      >
        <h1 className="text-4xl sm:text-5xl font-playfair font-bold drop-shadow-lg z-10 text-yellow-400">
          CHATTER
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-md text-center z-10 leading-relaxed">
          Discover. Share. Connect. <br />
          Your stories belong here.
        </p>
        <div
          className="absolute inset-0 
    bg-[radial-gradient(circle_at_top_left,rgba(255,255,0,0.1),transparent_50%)]"
        />
      </div>

      {/* Right Form */}
      <div className="flex flex-col justify-center items-center p-10">
        <div className="grid gap-8 w-full max-w-lg">
          {/* Back Link */}
          <Link
            href="/login"
            className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition w-fit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Sign In
          </Link>

          {/* Form */}
          <form className="grid grid-cols-1 gap-6" action={forgotPassword}>
            <div>
              <label htmlFor="email" className="block text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>

            {/* Normal button instead of SubmitButton */}
            <button
              type="submit"
              className="py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition shadow-md"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
