import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PUT(request: Request) {
  const supabase =  createClient()
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const { title, content, cover_url } = await request.json();
    const { data, error } = await supabase.from('posts').update({ title, content, cover_url }).eq('id', id);
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase =  createClient()
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


