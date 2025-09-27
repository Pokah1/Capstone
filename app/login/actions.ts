'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Provider } from '@supabase/supabase-js'
import { getURL } from '@/utils/getURL'

export async function signin(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error("Signin error:", error)
    redirect("/login?message=Could not authenticate user")
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    redirect("/login?message=Passwords do not match")
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getURL()}auth/confirm`, // ✅ dynamic
    },
  })

  if (error) {
    console.error("Signup error:", error)
    redirect("/login?message=" + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=check-email')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function oAuthSignIn(provider: Provider) {
  if (!provider) {
    redirect('/login?message=No provider selected')
  }

  const supabase = await createClient()
  const redirectUrl = `${getURL()}auth/callback?next=/dashboard`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectUrl },
  })

  if (error) {
    console.error("OAuth sign-in error:", error)
    redirect("/login?message=Could not login with provider")
  }

  return redirect(data.url) // send user to provider
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}reset-password`, // ✅ dynamic
  })

  if (error) {
    console.error(error)
    redirect("/forgot-password?message=Could not send reset email")
  }

  redirect("/confirm?message=Password reset link sent to your email")
}
