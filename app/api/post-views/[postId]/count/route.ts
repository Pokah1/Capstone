import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = createClient();

  try {
    const url = new URL(request.url);
    const post_id = url.pathname.split('/')[3]; // Extract post_id from URL

    console.log('Fetching view count for post ID:', post_id);

    // Fetch the view count
    const { data: postData, error } = await supabase
      .from('posts')
      .select('view_count')
      .eq('id', post_id)
      .single();

    if (error || !postData) {
      console.error('Error fetching view count:', error || 'No data found');
      return NextResponse.json({ error: 'Failed to fetch view count' }, { status: 500 });
    }

    return NextResponse.json({ viewCount: postData.view_count });
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
