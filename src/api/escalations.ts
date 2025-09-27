import { supabase } from '../utils/supabase';
import { Escalation, EscalationActivity } from '../types';

// Escalation API functions
export const getCountryEscalations = async (countryCode: string) => {
  const { data, error } = await supabase
    .from('escalations')
    .select(`
      *,
      escalated_by_user:escalated_by(full_name, email, country_code),
      assigned_to_user:assigned_to(full_name, email),
      school:school_id(name, location, country_code),
      team:team_id(name)
    `)
    .or(`school_id.in.(select id from schools where country_code = '${countryCode}'),escalated_by.in.(select id from users where country_code = '${countryCode}'),team_id.in.(select id from teams where country_code = '${countryCode}')`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Escalation[];
};

export const getEscalationStats = async (countryCode: string) => {
  // Get total escalations in country
  const { count: totalEscalations, error: totalError } = await supabase
    .from('escalations')
    .select('id', { count: 'exact', head: true })
    .or(`school_id.in.(select id from schools where country_code = '${countryCode}'),escalated_by.in.(select id from users where country_code = '${countryCode}'),team_id.in.(select id from teams where country_code = '${countryCode}')`);

  if (totalError) throw totalError;

  // Get open escalations
  const { count: openEscalations, error: openError } = await supabase
    .from('escalations')
    .select('id', { count: 'exact', head: true })
    .in('status', ['Open', 'Assigned', 'In Progress', 'Pending'])
    .or(`school_id.in.(select id from schools where country_code = '${countryCode}'),escalated_by.in.(select id from users where country_code = '${countryCode}'),team_id.in.(select id from teams where country_code = '${countryCode}')`);

  if (openError) throw openError;

  // Get resolved this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const { count: resolvedThisMonth, error: resolvedError } = await supabase
    .from('escalations')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'Resolved')
    .gte('resolved_at', startOfMonth.toISOString())
    .or(`school_id.in.(select id from schools where country_code = '${countryCode}'),escalated_by.in.(select id from users where country_code = '${countryCode}'),team_id.in.(select id from teams where country_code = '${countryCode}')`);

  if (resolvedError) throw resolvedError;

  // Get average resolution time
  const { data: resolvedData, error: avgError } = await supabase
    .from('escalations')
    .select('resolution_time_hours')
    .not('resolution_time_hours', 'is', null)
    .or(`school_id.in.(select id from schools where country_code = '${countryCode}'),escalated_by.in.(select id from users where country_code = '${countryCode}'),team_id.in.(select id from teams where country_code = '${countryCode}')`);

  if (avgError) throw avgError;

  const avgResolutionTime = resolvedData && resolvedData.length > 0
    ? Math.round(resolvedData.reduce((sum, esc) => sum + (esc.resolution_time_hours || 0), 0) / resolvedData.length)
    : 0;

  return {
    totalEscalations: totalEscalations || 0,
    openEscalations: openEscalations || 0,
    resolvedThisMonth: resolvedThisMonth || 0,
    avgResolutionTime
  };
};

export const createEscalation = async (escalationData: {
  title: string;
  description: string;
  priority: string;
  category: string;
  urgency: string;
  impact: string;
  school_id?: string;
  task_id?: string;
  team_id?: string;
  due_date?: string;
  tags?: string[];
  attachments?: string[];
  watchers?: string[];
}) => {
  const { data, error } = await supabase
    .from('escalations')
    .insert({
      ...escalationData,
      escalated_by: (await supabase.auth.getUser()).data.user?.id,
      status: 'Open'
    })
    .select(`
      *,
      escalated_by_user:escalated_by(full_name, email, country_code),
      assigned_to_user:assigned_to(full_name, email),
      school:school_id(name, location, country_code),
      team:team_id(name)
    `)
    .single();

  if (error) throw error;
  return data as Escalation;
};

export const updateEscalation = async (id: string, updates: Partial<Escalation>) => {
  const { data, error } = await supabase
    .from('escalations')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      escalated_by_user:escalated_by(full_name, email, country_code),
      assigned_to_user:assigned_to(full_name, email),
      school:school_id(name, location, country_code),
      team:team_id(name)
    `)
    .single();

  if (error) throw error;
  return data as Escalation;
};

export const assignEscalation = async (id: string, assignedTo: string) => {
  const { data, error } = await supabase
    .from('escalations')
    .update({
      assigned_to: assignedTo,
      status: 'Assigned',
      assigned_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      escalated_by_user:escalated_by(full_name, email, country_code),
      assigned_to_user:assigned_to(full_name, email),
      school:school_id(name, location, country_code),
      team:team_id(name)
    `)
    .single();

  if (error) throw error;
  return data as Escalation;
};

export const resolveEscalation = async (id: string, resolutionNotes: string, customerSatisfaction?: number) => {
  const { data, error } = await supabase
    .from('escalations')
    .update({
      status: 'Resolved',
      resolution_notes: resolutionNotes,
      customer_satisfaction: customerSatisfaction,
      resolved_at: new Date().toISOString(),
      closed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      escalated_by_user:escalated_by(full_name, email, country_code),
      assigned_to_user:assigned_to(full_name, email),
      school:school_id(name, location, country_code),
      team:team_id(name)
    `)
    .single();

  if (error) throw error;
  return data as Escalation;
};

export const getEscalationActivities = async (countryCode: string, limit: number = 20) => {
  // Get recent escalation activities
  const { data, error } = await supabase
    .from('escalations')
    .select(`
      id,
      title,
      status,
      created_at,
      updated_at,
      resolved_at,
      escalated_by_user:escalated_by(full_name, email)
    `)
    .or(`school_id.in.(select id from schools where country_code = '${countryCode}'),escalated_by.in.(select id from users where country_code = '${countryCode}'),team_id.in.(select id from teams where country_code = '${countryCode}')`)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  const activities: EscalationActivity[] = [];

  data?.forEach(escalation => {
    // Created activity
    activities.push({
      id: `created-${escalation.id}`,
      type: 'escalation_created',
      title: `Escalation Created: ${escalation.title}`,
      description: `New escalation was created`,
      timestamp: escalation.created_at,
      user: {
        name: escalation.escalated_by_user?.full_name || 'Unknown User'
      },
      escalation_id: escalation.id
    });

    // Status change activities
    if (escalation.status === 'Resolved' && escalation.resolved_at) {
      activities.push({
        id: `resolved-${escalation.id}`,
        type: 'escalation_resolved',
        title: `Escalation Resolved: ${escalation.title}`,
        description: `Escalation was marked as resolved`,
        timestamp: escalation.resolved_at,
        user: {
          name: escalation.escalated_by_user?.full_name || 'Unknown User'
        },
        escalation_id: escalation.id
      });
    }
  });

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};
