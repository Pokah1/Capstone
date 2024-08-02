import { createClient } from '@/utils/supabase/server';
import EditorPage from '@/components/contentEditor/EditorPage';
import { Post, User } from '@/types';

interface ContentPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ContentPage({ searchParams }: ContentPageProps) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  const postId = Array.isArray(searchParams?.postId) ? searchParams.postId[0] : searchParams?.postId;

  if (userError || !user) {
    // Redirect to login or return an error component
    return <div>User not authenticated</div>;
  }

  let post = null;
  if (postId) {
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (!postError) {
      post = postData;
    }
  }

  return (
    <main>
      <EditorPage user={user} post={post} />
    </main>
  );
}
