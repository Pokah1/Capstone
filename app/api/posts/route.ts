import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createClient()
    try{
        const {data, error} = await supabase
         .from("posts")
         .select("*");
         if(error) throw error;
         return NextResponse.json(data);
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, {status:500});
    }
}



export async function POST(request: Request) {
  const supabase = createClient()
  try {
    const { title, content, cover_url, user_id } = await request.json();
    console.log('Received content:', content);

    if (!user_id) {
      throw new Error("User ID is required");
    }
    
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, content, cover_url, user_id }]);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error : any) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



