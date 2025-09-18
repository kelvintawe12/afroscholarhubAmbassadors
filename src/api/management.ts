import { supabase, School, User, Event } from '../utils/supabase';
// Management API functions
export const getAllAmbassadors = async () => {
  const {
    data,
    error
  } = await supabase.from('users').select('*').eq('role', 'ambassador').order('full_name', {
    ascending: true
  });
  if (error) throw error;
  return data as User[];
};
export const getAllSchools = async () => {
  const {
    data,
    error
  } = await supabase.from('schools').select(`
      *,
      ambassadors:ambassador_id (id, full_name, email)
    `).order('name', {
    ascending: true
  });
  if (error) throw error;
  return data;
};
export const getSchoolsByStatus = async (status: School['status']) => {
  const {
    data,
    error
  } = await supabase.from('schools').select(`
      *,
      ambassadors:ambassador_id (id, full_name, email)
    `).eq('status', status).order('name', {
    ascending: true
  });
  if (error) throw error;
  return data;
};
export const getAnalyticsData = async () => {
  // Get total students reached
  const {
    data: visitData,
    error: visitError
  } = await supabase.from('visits').select('students_reached');
  if (visitError) throw visitError;
  const totalStudents = visitData.reduce((sum, visit) => sum + visit.students_reached, 0);
  // Get school counts by status
  const {
    data: schoolData,
    error: schoolError
  } = await supabase.from('schools').select('status');
  if (schoolError) throw schoolError;
  const schoolsByStatus = schoolData.reduce((acc, school) => {
    acc[school.status] = (acc[school.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  // Get ambassador count
  const {
    count: ambassadorCount,
    error: ambassadorError
  } = await supabase.from('users').select('id', {
    count: 'exact',
    head: true
  }).eq('role', 'ambassador');
  if (ambassadorError) throw ambassadorError;
  // Get upcoming events
  const {
    data: upcomingEvents,
    error: eventsError
  } = await supabase.from('events').select('*').gt('event_date', new Date().toISOString()).order('event_date', {
    ascending: true
  }).limit(5);
  if (eventsError) throw eventsError;
  return {
    totalStudents,
    schoolsByStatus,
    ambassadorCount: ambassadorCount || 0,
    upcomingEvents
  };
};
export const createSchool = async (school: Omit<School, 'id' | 'created_at'>) => {
  const {
    data,
    error
  } = await supabase.from('schools').insert([school]).select();
  if (error) throw error;
  return data[0] as School;
};
export const updateSchool = async (schoolId: string, updates: Partial<School>) => {
  const {
    data,
    error
  } = await supabase.from('schools').update(updates).eq('id', schoolId).select();
  if (error) throw error;
  return data[0] as School;
};
export const createEvent = async (event: Omit<Event, 'id' | 'created_at'>) => {
  const {
    data,
    error
  } = await supabase.from('events').insert([event]).select();
  if (error) throw error;
  return data[0] as Event;
};