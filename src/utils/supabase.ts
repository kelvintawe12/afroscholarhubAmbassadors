import { createClient } from '@supabase/supabase-js';
// Initialize the Supabase client
const supabaseUrl = 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
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
  flag_url: string;
  lead_id?: string;
};