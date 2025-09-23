// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// GET /api/posts/[id] - Fetch a single post
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", params.id)
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
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  try {
    const { title, content, cover_url } = await request.json();

    const { data, error } = await supabase
      .from("posts")
      .update({ title, content, cover_url })
      .eq("id", params.id)
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
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", params.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// app/api/posts/[id]/route.ts
// import { NextResponse } from "next/server";
// import { supabaseAdmin } from "@/utils/supabase/admin"; // <-- use admin

// // GET /api/posts/[id]
// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { data, error } = await supabaseAdmin
//       .from("posts")
//       .select("*")
//       .eq("id", params.id)
//       .single();

//     if (error) throw error;
//     return NextResponse.json(data);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // PUT /api/posts/[id]
// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { title, content, cover_url } = await request.json();

//     const { data, error } = await supabaseAdmin
//       .from("posts")
//       .update({ title, content, cover_url })
//       .eq("id", params.id)
//       .select()
//       .single();

//     if (error) throw error;
//     return NextResponse.json(data);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // DELETE /api/posts/[id]
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { error } = await supabaseAdmin
//       .from("posts")
//       .delete()
//       .eq("id", params.id);

//     if (error) throw error;
//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
