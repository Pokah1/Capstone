// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   // The `/auth/callback` route is required for the server-side auth flow implemented
//   // by the SSR package. It exchanges an auth code for the user's session.
//   // https://supabase.com/docs/guides/auth/server-side/nextjs
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get("code");
//   const origin = requestUrl.origin;

//   if (code) {
//     const supabase = createClient();
//     await supabase.auth.exchangeCodeForSession(code);
//   }

//   // URL to redirect to after sign up process completes
//   return NextResponse.redirect(`${origin}/dashboard`);
// }


import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const {searchParams, origin} = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
     {
      cookies:{
      get(name:string){
        return cookieStore.get(name)?.value
      },
      set(name:string, value:string, options: CookieOptions){
        cookieStore.set({name, value, ...options})
      },
      remove(name:string, options: CookieOptions){
        cookieStore.delete({name, ...options})
      },
     },
    }
    )
    const {error} = await supabase.auth.exchangeCodeForSession(code)
    if(!error){
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/login?message=Could not login with provider`)
}