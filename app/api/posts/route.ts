// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// GET /api/posts - Fetch all posts
export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/posts - Create new post
export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { title, content, cover_url, user_id, author_name } = await request.json();

    if (!user_id) throw new Error("User ID is required");
    if (!title?.trim()) throw new Error("Title is required");
    if (!content?.trim()) throw new Error("Content is required");

    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, content, cover_url, user_id, author_name }])
      .select()
      .single(); // ensure we return the created row

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error saving post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// app/api/posts/route.ts
// import { NextResponse } from "next/server";
// import { supabaseAdmin } from "@/utils/supabase/admin"; // <-- use admin

// // GET /api/posts - Fetch all posts
// export async function GET() {
//   try {
//     const { data, error } = await supabaseAdmin
//       .from("posts")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) throw error;

//     return NextResponse.json(data);
//   } catch (error: any) {
//     console.error("Error fetching posts:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // POST /api/posts - Create new post
// export async function POST(request: Request) {
//   try {
//     const { title, content, cover_url, user_id, author_name } = await request.json();

//     if (!user_id) throw new Error("User ID is required");
//     if (!title?.trim()) throw new Error("Title is required");
//     if (!content?.trim()) throw new Error("Content is required");

//     const { data, error } = await supabaseAdmin
//       .from("posts")
//       .insert([{ title, content, cover_url, user_id, author_name }])
//       .select()
//       .single(); // return created row

//     if (error) throw error;

//     return NextResponse.json(data);
//   } catch (error: any) {
//     console.error("Error saving post:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
