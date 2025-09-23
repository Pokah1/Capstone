// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Helper to normalize id
const getPostId = (id: string | string[]) => (Array.isArray(id) ? id[0] : id);

// GET /api/posts/[id] - Fetch a single post
export async function GET(
  request: Request,
  { params }: { params: { id: string | string[] } }
) {
  const postId = getPostId(params.id);
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
  request: Request,
  { params }: { params: { id: string | string[] } }
) {
  const postId = getPostId(params.id);
  const supabase = await createClient();

  try {
    const { title, content, cover_url } = await request.json();

    const { data, error } = await supabase
      .from("posts")
      .update({ title, content, cover_url })
      .eq("id", postId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: Request,
  { params }: { params: { id: string | string[] } }
) {
  const postId = getPostId(params.id);
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
