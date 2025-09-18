import { supabase, Task, School, Visit, User } from '../utils/supabase';
// Ambassador API functions
export const getAmbassadorTasks = async (ambassadorId: string) => {
  const {
    data,
    error
  } = await supabase.from('tasks').select('*').eq('ambassador_id', ambassadorId).order('due_date', {
    ascending: true
  });
  if (error) throw error;
  return data as Task[];
};
export const getAmbassadorSchools = async (ambassadorId: string) => {
  const {
    data,
    error
  } = await supabase.from('schools').select('*').eq('ambassador_id', ambassadorId).order('name', {
    ascending: true
  });
  if (error) throw error;
  return data as School[];
};
export const getAmbassadorVisits = async (ambassadorId: string) => {
  const {
    data,
    error
  } = await supabase.from('visits').select(`
      *,
      schools:school_id (name, location)
    `).eq('ambassador_id', ambassadorId).order('visit_date', {
    ascending: false
  });
  if (error) throw error;
  return data;
};
export const createSchoolVisit = async (visit: Omit<Visit, 'id' | 'created_at'>) => {
  const {
    data,
    error
  } = await supabase.from('visits').insert([visit]).select();
  if (error) throw error;
  return data[0] as Visit;
};
export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  const {
    data,
    error
  } = await supabase.from('tasks').update(updates).eq('id', taskId).select();
  if (error) throw error;
  return data[0] as Task;
};
export const getAmbassadorImpactMetrics = async (ambassadorId: string) => {
  // Get total students reached
  const {
    data: visitData,
    error: visitError
  } = await supabase.from('visits').select('students_reached').eq('ambassador_id', ambassadorId);
  if (visitError) throw visitError;
  const totalStudents = visitData.reduce((sum, visit) => sum + visit.students_reached, 0);
  // Get total schools
  const {
    count: schoolCount,
    error: schoolError
  } = await supabase.from('schools').select('id', {
    count: 'exact',
    head: true
  }).eq('ambassador_id', ambassadorId);
  if (schoolError) throw schoolError;
  // Get total partnerships
  const {
    count: partnershipCount,
    error: partnershipError
  } = await supabase.from('schools').select('id', {
    count: 'exact',
    head: true
  }).eq('ambassador_id', ambassadorId).eq('status', 'partnered');
  if (partnershipError) throw partnershipError;
  return {
    totalStudents,
    schoolCount: schoolCount || 0,
    partnershipCount: partnershipCount || 0
  };
};

export const getAllAmbassadors = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'ambassador')
    .order('full_name', { ascending: true });

  if (error) throw error;
  return data as User[];
};
