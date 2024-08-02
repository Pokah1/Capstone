import { NextRequest, NextResponse } from 'next/server';
import { savePost, getPosts, updatePost, deletePost } from '@/utils/databaseActions/contentQuery';
import { Post } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { title, content, cover_url, user_id }: Partial<Post> = await req.json();

    if (!user_id) {
      throw new Error('Unauthorized');
    }

    const data = await savePost({ user_id, title, content, cover_url });
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user_id = req.nextUrl.searchParams.get('user_id');

    if (!user_id) {
      throw new Error('Unauthorized');
    }

    const data = await getPosts(user_id);
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, user_id, title, content, cover_url }: Partial<Post> = await req.json();

    if (!id || !user_id) {
      throw new Error('Post ID and user ID are required');
    }

    const data = await updatePost(id, user_id, { title, content, cover_url });
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, user_id }: Partial<Post> = await req.json();

    if (!id || !user_id) {
      throw new Error('Post ID and user ID are required');
    }

    const data = await deletePost(id, user_id);
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

export default async function handler(req: NextRequest) {
  switch (req.method) {
    case 'POST':
      return POST(req);
    case 'GET':
      return GET(req);
    case 'PUT':
      return PUT(req);
    case 'DELETE':
      return DELETE(req);
    default:
      return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}
