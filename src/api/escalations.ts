import { supabase } from '../utils/supabase';
import { Escalation, EscalationActivity } from '../types';

// Escalation API functions
export const getCountryEscalations = async (countryCode: string) => {
  // First get the relevant IDs
  const [schoolsResult, usersResult, teamsResult] = await Promise.all([
    supabase.from('schools').select('id').eq('country_code', countryCode),
    supabase.from('users').select('id').eq('country_code', countryCode),
    supabase.from('teams').select('id').eq('country_code', countryCode)
  ]);

  const schoolIds = schoolsResult.data?.map(s => s.id) || [];
  const userIds = usersResult.data?.map(u => u.id) || [];
  const teamIds = teamsResult.data?.map(t => t.id) || [];

  const { data, error } = await supabase
    .from('escalations')
    .select(`
      *,
      reporter:users!reporter_id(full_name, email, country_code),
      assignee:users!assignee_id(full_name, email),
      schools!school_id(name, location, country_code),
      teams!team_id(name)
    `)
    .or(`school_id.in.(${schoolIds.map(id => `"${id}"`).join(',')}),reporter_id.in.(${userIds.map(id => `"${id}"`).join(',')}),team_id.in.(${teamIds.map(id => `"${id}"`).join(',')})`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Escalation[];
};

export const getEscalationStats = async (countryCode: string) => {
  // First get the relevant IDs
  const [schoolsResult, usersResult, teamsResult] = await Promise.all([
    supabase.from('schools').select('id').eq('country_code', countryCode),
    supabase.from('users').select('id').eq('country_code', countryCode),
    supabase.from('teams').select('id').eq('country_code', countryCode)
  ]);

  const schoolIds = schoolsResult.data?.map(s => s.id) || [];
  const userIds = usersResult.data?.map(u => u.id) || [];
  const teamIds = teamsResult.data?.map(t => t.id) || [];

  const filterClause = `school_id.in.(${schoolIds.map(id => `"${id}"`).join(',')}),reporter_id.in.(${userIds.map(id => `"${id}"`).join(',')}),team_id.in.(${teamIds.map(id => `"${id}"`).join(',')})`;

  // Get total escalations in country
  const { count: totalEscalations, error: totalError } = await supabase
    .from('escalations')
    .select('id', { count: 'exact', head: true })
    .or(filterClause);

  if (totalError) throw totalError;

  // Get open escalations
  const { count: openEscalations, error: openError } = await supabase
    .from('escalations')
    .select('id', { count: 'exact', head: true })
    .in('status', ['new', 'assigned', 'in_progress', 'escalated'])
    .or(filterClause);

  if (openError) throw openError;

  // Get resolved this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const { count: resolvedThisMonth, error: resolvedError } = await supabase
    .from('escalations')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'resolved')
    .gte('resolved_at', startOfMonth.toISOString())
    .or(filterClause);

  if (resolvedError) throw resolvedError;

  // Get average resolution time
  const { data: resolvedData, error: avgError } = await supabase
    .from('escalations')
    .select('time_to_resolve, created_at, resolved_at')
    .eq('status', 'resolved')
    .not('resolved_at', 'is', null)
    .or(filterClause);

  if (avgError) throw avgError;

  const avgResolutionTime = resolvedData && resolvedData.length > 0
    ? Math.round(resolvedData.reduce((sum, esc) => {
        if (esc.resolved_at && esc.created_at) {
          const diffMs = new Date(esc.resolved_at).getTime() - new Date(esc.created_at).getTime();
          return sum + (diffMs / (1000 * 60 * 60)); // Convert to hours
        }
        return sum;
      }, 0) / resolvedData.length)
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
      reporter_id: (await supabase.auth.getUser()).data.user?.id,
      status: 'new'
    })
    .select(`
      *,
      reporter:users!reporter_id(full_name, email, country_code),
      assignee:users!assignee_id(full_name, email),
      schools!school_id(name, location, country_code),
      teams!team_id(name)
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
      reporter:users!reporter_id(full_name, email, country_code),
      assignee:users!assignee_id(full_name, email),
      schools!school_id(name, location, country_code),
      teams!team_id(name)
    `)
    .single();

  if (error) throw error;
  return data as Escalation;
};

export const assignEscalation = async (id: string, assignedTo: string) => {
  const { data, error } = await supabase
    .from('escalations')
    .update({
      assignee_id: assignedTo,
      status: 'assigned',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      reporter:users!reporter_id(full_name, email, country_code),
      assignee:users!assignee_id(full_name, email),
      schools!school_id(name, location, country_code),
      teams!team_id(name)
    `)
    .single();

  if (error) throw error;
  return data as Escalation;
};

export const resolveEscalation = async (id: string, resolutionNotes: string, customerSatisfaction?: number) => {
  const { data, error } = await supabase
    .from('escalations')
    .update({
      status: 'resolved',
      resolution_notes: resolutionNotes,
      customer_satisfaction: customerSatisfaction,
      resolved_at: new Date().toISOString(),
      closed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      reporter:users!reporter_id(full_name, email, country_code),
      assignee:users!assignee_id(full_name, email),
      schools!school_id(name, location, country_code),
      teams!team_id(name)
    `)
    .single();

  if (error) throw error;
  return data as Escalation;
};

export const getEscalationActivities = async (countryCode: string, limit: number = 20) => {
  // First get the relevant IDs
  const [schoolsResult, usersResult, teamsResult] = await Promise.all([
    supabase.from('schools').select('id').eq('country_code', countryCode),
    supabase.from('users').select('id').eq('country_code', countryCode),
    supabase.from('teams').select('id').eq('country_code', countryCode)
  ]);

  const schoolIds = schoolsResult.data?.map(s => s.id) || [];
  const userIds = usersResult.data?.map(u => u.id) || [];
  const teamIds = teamsResult.data?.map(t => t.id) || [];

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
      reporter:users!reporter_id(full_name, email)
    `)
    .or(`school_id.in.(${schoolIds.map(id => `"${id}"`).join(',')}),reporter_id.in.(${userIds.map(id => `"${id}"`).join(',')}),team_id.in.(${teamIds.map(id => `"${id}"`).join(',')})`)
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
        name: (escalation.reporter as any)?.full_name || 'Unknown User'
      },
      escalation_id: escalation.id
    });

    // Status change activities
    if (escalation.status === 'resolved' && escalation.resolved_at) {
      activities.push({
        id: `resolved-${escalation.id}`,
        type: 'escalation_resolved',
        title: `Escalation Resolved: ${escalation.title}`,
        description: `Escalation was marked as resolved`,
        timestamp: escalation.resolved_at,
        user: {
          name: (escalation.reporter as any)?.full_name || 'Unknown User'
        },
        escalation_id: escalation.id
      });
    }
  });

  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};
