import { createClient } from '@/utils/supabase/server';
import { Post } from '@/types';

const supabase = createClient();

export const savePost = async ({  title, content,  cover_url }: Partial<Post>) => {
  if (!title) {
    throw new Error('userId is required');
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
      
        title,
        content,
        cover_url:  cover_url || null,
      },
    ]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getPosts = async (user_id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updatePost = async (id: string, user_id: string, { title, content,  cover_url }: Partial<Post>) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ title, content, cover_url:  cover_url })
    .eq('id', id)
    .eq('user_id', user_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deletePost = async (id: string, user_id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
