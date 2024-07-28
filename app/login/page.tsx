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
  const  supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }
  

  return (
  
  <main className={styles.container}>

      <div className={styles.formSegment}>
        <Link
          href="/"
          className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
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
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>{" "}
          Back
        </Link>
        <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
          <label className="text-md text-black font-bold" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6 text-black bg-gray-600"
            name="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          <label className="text-md text-black font-bold" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6 text-black bg-gray-600"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <SubmitButton
            formAction={signin}
            className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
            pendingText="Signing In... "
          >
            Sign In
          </SubmitButton>
          <SubmitButton
            formAction={signup}
            className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2 bg-green-700"
            pendingText="Signing Up..."
            style={{ marginBottom: '-20px' }}
          >
            Sign Up
          </SubmitButton>
          {searchParams?.message && (
            <p className="mt-2 p-4 bg-foreground/10 text-foreground text-center text-red height-"
    
            >
              {searchParams.message}
            </p>
          )}
    
        </form>
        <OAuthButton/>
      </div>
  </main>
  );
}
