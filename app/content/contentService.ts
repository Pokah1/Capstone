import supabase from "@/utils/supabase/client";
import { Post } from "@/types";

const chunkContent = (content: string, chunkSize: number) => {
  const chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.slice(i, i + chunkSize));
  }
  return chunks;
};

export const createContent = async (post: Post) => {
  const { title, content, cover_url, user_id } = post;

  const chunkSize = 10000; // Adjust chunk size as needed
  const chunks = chunkContent(content, chunkSize);

  const { data, error } = await supabase
    .from('posts')
    .insert([{ title, content, cover_url, user_id }]);

  if (error) {
    console.error('Error creating content:', error);
    throw new Error(error.message);
  }
  return data;
};

export const getContent = async (id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching content:', error);
    throw new Error(error.message);
  }
  return data;
};

export const getAllContent = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*');

  if (error) {
    console.error('Error fetching content:', error);
    throw new Error(error.message);
  }
  return data;
};
