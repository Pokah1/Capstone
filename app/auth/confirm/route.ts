
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'
  // Default to /dashboard if next is not provided

  if (token_hash && type) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      console.log('OTP Verified, redirecting to:', next)
      // Redirect user to specified redirect URL or root of app
      return NextResponse.redirect(next) // Redirects to the value of next, which is /dashboard by default
    } else {
      console.error('Error verifying OTP:', error.message)
    }
  } else {
    console.error('Missing token_hash or type')
  }

  // Redirect the user to an error page with some instructions
  return NextResponse.redirect('/login?message=Could not verify OTP')
}
