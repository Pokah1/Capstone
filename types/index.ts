// types/index.ts

import { User as SupabaseUser } from '@supabase/supabase-js';

//Profiles types
export interface Profile {
  id?: string; // Make id optional
  user_id: string;
  username: string;
  role: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  profile_picture?: string | null; 
}

// Post types
export interface Post {
  id?: string; // Make id optional
  user_id: string;
  title: string;
  content: string;
  cover_url?: string;
  created_at?: string;
  updated_at?: string;
  user?: SupabaseUser;
  likes?: number; 
  userHasLiked?: boolean;
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string; 
  };
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  liked_at?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  comment: string;
  author_name: string;
  created_at?: string;
  commented_at?: string;
   updated_at?: string;
  full_name?: string;
}
export interface Post {
  id?: string;
  user_id: string;
  title: string;
  content: string;
  cover_url?: string;
  created_at?: string;
  updated_at?: string;
  user?: SupabaseUser;
  likes?: number;          // total like count
  userHasLiked?: boolean;  // current user's like state
  comments?: Comment[];    // optional, for easier handling in UI
}

