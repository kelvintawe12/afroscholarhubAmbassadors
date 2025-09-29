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

export const logSchoolVisit = async (schoolId: string, ambassadorId: string, visitData: { visit_date: string; notes?: string }) => {
  const visit = {
    school_id: schoolId,
    ambassador_id: ambassadorId,
    visit_date: visitData.visit_date,
    notes: visitData.notes || '',
    students_reached: 0, // Default, can be updated later
    leads_generated: 0,
    duration_minutes: 60, // Default duration
    activities: [] // Default empty array
  };
  return await createSchoolVisit(visit);
};
export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  const {
    data,
    error
  } = await supabase.from('tasks').update(updates).eq('id', taskId).select();
  if (error) throw error;
  return data[0] as Task;
};

export const updateVisit = async (visitId: string, updates: Partial<Visit>) => {
  const {
    data,
    error
  } = await supabase.from('visits').update(updates).eq('id', visitId).select();
  if (error) throw error;
  return data[0] as Visit;
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

export const getAmbassadorTasksCompleted = async (ambassadorId: string) => {
  const { count, error } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('ambassador_id', ambassadorId)
    .eq('status', 'Completed');

  if (error) throw error;
  return count || 0;
};

export const getAmbassadorVisitsCount = async (ambassadorId: string) => {
  const { count, error } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('ambassador_id', ambassadorId);

  if (error) throw error;
  return count || 0;
};

export const getAmbassadorLeadsGenerated = async (ambassadorId: string) => {
  const { data, error } = await supabase
    .from('visits')
    .select('leads_generated')
    .eq('ambassador_id', ambassadorId);

  if (error) throw error;
  return data.reduce((sum, visit) => sum + visit.leads_generated, 0);
};

interface TrainingProgressData {
  user_id: string;
  training_module_id: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Behind';
}

export const updateTrainingProgress = async (data: TrainingProgressData) => {
  const { data: updatedData, error } = await supabase
    .from('ambassador_training_progress')
    .upsert({
      user_id: data.user_id,
      training_module_id: data.training_module_id,
      progress: data.progress,
      status: data.status,
      last_activity: new Date().toISOString()
    }, { onConflict: 'user_id,training_module_id' })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update training progress: ${error.message}`);
  }

  return updatedData;
};

export const getResources = async (ambassadorId: string) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .or(`access_level.eq.all,access_level.eq.ambassadors`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
