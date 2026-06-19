import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Course = {
  id: string;
  title: string;
  description: string | null;
  color: string;
  total_modules: number;
  created_at: string;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order: number;
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  display_name: string | null;
  bio: string | null;
  created_at: string;
};
