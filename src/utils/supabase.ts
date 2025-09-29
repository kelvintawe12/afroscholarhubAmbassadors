import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Please check your environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'afroscholarhub-ambassadors@1.0.0',
    },
  },
});
// Define database types to match Supabase schema
export type User = {
  id: string;
  email: string;
  full_name: string;
  role: 'management' | 'country_lead' | 'ambassador' | 'support';
  country_code?: string;
  avatar_url?: string;
  created_at: string;
};
export type School = {
  upcoming_activities: any;
  id: string;
  name: string;
  location: string;
  address: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  student_count: number;
  status: 'prospect' | 'visited' | 'partnered' | 'inactive';
  country_code: string;
  region: string;
  created_at: string;
  ambassador_id?: string;
  partnership_strength?: 'strong' | 'moderate' | 'weak' | 'new' | string;
  partnership_date?: string; // <-- Add this line
  last_visit?: string;       // <-- (Optional) Add if you use school.last_visit
};
export type Visit = {
  id: string;
  school_id: string;
  ambassador_id: string;
  visit_date: string;
  duration_minutes: number;
  students_reached: number;
  activities: string[];
  notes: string;
  created_at: string;
};
export type Task = {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  due_date: string;
  school_id?: string;
  ambassador_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};
export type Event = {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  country_code: string;
  region: string;
  expected_attendance: number;
  actual_attendance?: number;
  budget: number;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
};
export type Resource = {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'template' | 'guide';
  url: string;
  file_type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'mp4' | 'jpg' | 'png';
  category: string;
  tags: string[];
  created_by: string;
  created_at: string;
};
export type Country = {
  code: string;
  name: string;
  flag_emoji: string;
  currency?: string;
  timezone?: string;
  lead_id?: string;
  active: boolean;
  settings?: any;
  created_at: string;
  updated_at: string;
};
