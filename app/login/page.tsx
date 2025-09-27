import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { OAuthButton } from "./oauth-signin";
import { signin, signup } from "./actions";
import PasswordInput from "@/components/PasswordInput";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return redirect("/dashboard");

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-950 to-black font-poppins text-white grid grid-cols-1 md:grid-cols-2">
      {/* Left Branding */}
      <div className="flex flex-col justify-center items-center p-12 bg-gradient-to-br from-purple-800/80 via-indigo-900/80 to-black/90 relative">
        <h1 className="text-4xl sm:text-5xl font-playfair font-bold drop-shadow-lg z-10 text-yellow-400">
          CHATTER
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-md text-center z-10 leading-relaxed">
          Discover. Share. Connect. <br />
          Your stories belong here.
        </p>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,0,0.1),transparent_50%)]" />
      </div>

      {/* Right Form */}
      <div className="flex flex-col justify-center items-center p-10">
        <div className="grid gap-8 w-full max-w-lg">
          {/* Back Link */}
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition w-fit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </Link>

          {/* Title */}
          <div>
            <h2 className="text-4xl font-playfair font-bold text-yellow-400">
              Welcome
            </h2>
            <p className="text-gray-300">Sign in or create a new account</p>
          </div>

          {/* Form */}
          <form className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>

            <PasswordInput
              name="password"
              label="Password"
              required
            />

            <PasswordInput
              name="confirmPassword"
              label="Confirm"
              required
            />

            {/* Action Buttons */}
            <SubmitButton
              formAction={signin}
              className="col-span-1 py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition shadow-md"
              pendingText="Signing In..."
            >
              Sign In
            </SubmitButton>

            <SubmitButton
              formAction={signup}
              className="col-span-1 py-3 rounded-lg border border-yellow-400 text-yellow-400 font-semibold hover:bg-yellow-400 hover:text-black transition shadow-md"
              pendingText="Signing Up..."
            >
              Sign Up
            </SubmitButton>

            {message && (
              <p
                className={`col-span-2 p-3 rounded-md text-center font-medium ${
                  message.toLowerCase().includes("confirmed") ||
                  message.toLowerCase().includes("success")
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {message}
              </p>
            )}
          </form>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-4">
            <OAuthButton className="col-span-2" />
          </div>

          {/* Forgot Password */}
          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition"
            >
              Forgotten Password?
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
