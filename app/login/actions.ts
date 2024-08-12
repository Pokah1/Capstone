'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

import { Provider } from '@supabase/supabase-js'
import { getURL } from '@/utils/helper'
import { headers } from 'next/headers'

export async function signin(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect("/login?message=Could not authenticate user")
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const origin = headers
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password!== confirmPassword) {
    redirect("/login?message=Passwords do not match")
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options:{
      emailRedirectTo: `${origin}/auth/callback`,
    }
  })

  if (error) {
    redirect("/login?message=Error Signing Up")
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=check-email')
}

export async function signout() {
   const supabase = createClient()
   await supabase.auth.signOut()
   redirect('/')
}

export async function oAuthSignIn(provider:Provider){
  if(!provider){
    return redirect('/login?message= No provider selected')
  }
  const supabase = createClient();
  const redirectUrl = getURL("/auth/callback")
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    }
  })
  if (error) {
    console.error("Error logging in with provider:", error);
     redirect("/login?message=Could not login with provider")
  }


  return redirect(data.url)
}