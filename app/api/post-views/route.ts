import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const { post_id, user_id } = await request.json();

    console.log('Received POST request with:', { post_id, user_id });

    if (!post_id || !user_id) {
      console.error('Invalid input:', { post_id, user_id });
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Check if the view record already exists for this user
    const { data: existingView, error: fetchError } = await supabase
      .from('post_views')
      .select('id')
      .eq('post_id', post_id)
      .eq('user_id', user_id)
      .maybeSingle(); // Use maybeSingle instead of single

    if (fetchError) {
      console.error('Error checking existing view:', fetchError);
      return NextResponse.json({ error: 'Failed to check view record' }, { status: 500 });
    }

    if (!existingView) {
      // Insert a new view record if it does not exist
      const { error: insertError } = await supabase
        .from('post_views')
        .insert([{ post_id, user_id }]);

      if (insertError) {
        if (insertError.code === '23505') { // Unique constraint violation
          console.log('View record already exists.');
        } else {
          console.error('Error recording view:', insertError);
          return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
        }
      }
    }

    // Call the stored procedure to increment view count
    const { error: incrementError } = await supabase.rpc('increment_view_count', { post_id });

    if (incrementError) {
      console.error('Error incrementing view count:', incrementError);
      return NextResponse.json({ error: 'Failed to increment view count' }, { status: 500 });
    }

    return NextResponse.json({ message: 'View recorded successfully' });
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
