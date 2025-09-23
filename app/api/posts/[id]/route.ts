import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type Context = { params: { id: string | string[] } };

const getPostId = (id: string | string[]) => (Array.isArray(id) ? id[0] : id);

// GET /api/posts/[id]
export async function GET(request: Request, context: Context) {
  const { id } = context.params;
  const postId = getPostId(id);

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

// PUT /api/posts/[id]
export async function PUT(request: Request, context: Context) {
  const { id } = context.params;
  const postId = getPostId(id);

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

// DELETE /api/posts/[id]
export async function DELETE(request: Request, context: Context) {
  const { id } = context.params;
  const postId = getPostId(id);

  const supabase = await createClient();
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
