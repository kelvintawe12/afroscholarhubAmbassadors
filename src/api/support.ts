import { supabase } from '../utils/supabase';
import { User, AuditLog } from '../types';

// Support API functions

// Get directory of users (filtered by role/country if needed)
export const getDirectory = async (filters?: {
  role?: string;
  country_code?: string;
  search?: string;
}) => {
  let query = supabase
    .from('users')
    .select(`
      id,
      full_name,
      email,
      role,
      country_code,
      phone,
      status,
      created_at
    `)
    .order('full_name', { ascending: true });

  if (filters?.role) {
    query = query.eq('role', filters.role);
  }

  if (filters?.country_code) {
    query = query.eq('country_code', filters.country_code);
  }

  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as User[];
};

// Get audit logs (from audit_logs table)
export const getAudits = async (filters?: {
  start_date?: string;
  end_date?: string;
  table_name?: string;
  user_id?: string;
}) => {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.start_date) {
    query = query.gte('created_at', filters.start_date);
  }

  if (filters?.end_date) {
    query = query.lte('created_at', filters.end_date);
  }

  if (filters?.table_name) {
    query = query.eq('table_name', filters.table_name);
  }

  if (filters?.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as AuditLog[];
};

// Get moderation queue (e.g., pending resources or content for approval)
export const getModerationQueue = async () => {
  const { data, error } = await supabase
    .from('resources')
    .select(`
      *,
      creator:created_by (full_name, email)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Approve/resolve moderation item
export const approveModeration = async (resourceId: string, approved: boolean) => {
  const status = approved ? 'approved' : 'rejected';
  const { data, error } = await supabase
    .from('resources')
    .update({ status })
    .eq('id', resourceId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get support tickets (if support_tickets table exists)
export const getSupportTickets = async (filters?: {
  status?: 'open' | 'in_progress' | 'resolved';
  user_id?: string;
}) => {
  let query = supabase
    .from('support_tickets')
    .select(`
      *,
      user:users!user_id(full_name, email),
      assignee:users!assignee_id(full_name, role)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Create support ticket
export const createSupportTicket = async (ticketData: {
  user_id: string;
  subject: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
}) => {
  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      ...ticketData,
      status: 'open',
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update support ticket (e.g., assign, change status)
export const updateSupportTicket = async (id: string, updates: Partial<any>) => {
  const { data, error } = await supabase
    .from('support_tickets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
