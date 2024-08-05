// types/index.ts



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








//Post types
export interface Post{
  id?: string; // Make id optional
  user_id: string;
  title: string;
  content: string;
  cover_url?: string;
  created_at?: string;
  updated_at?: string;
  user?: string;
}
