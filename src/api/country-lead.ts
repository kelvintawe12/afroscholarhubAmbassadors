import { supabase, User, School, Event } from '../utils/supabase';
import { Escalation, EscalationStat, EscalationActivity } from '../types';
// Country Lead API functions
export const getCountryAmbassadors = async (countryCode: string) => {
  const {
    data,
    error
  } = await supabase.from('users').select('*').eq('role', 'ambassador').eq('country_code', countryCode).order('full_name', {
    ascending: true
  });
  if (error) throw error;
  return data as User[];
};
export const getCountrySchools = async (countryCode: string) => {
  const {
    data,
    error
  } = await supabase.from('schools').select(`
      *,
      ambassadors:ambassador_id (id, full_name, email)
    `).eq('country_code', countryCode).order('name', {
    ascending: true
  });
  if (error) throw error;
  return data;
};
export const getCountryEvents = async (countryCode: string) => {
  const {
    data,
    error
  } = await supabase.from('events').select(`
    *,
    created_by_user:created_by (id, full_name)
  `).eq('country_code', countryCode).order('event_date', {
    ascending: false
  });
  if (error) throw error;
  return data;
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'created_at'>) => {
  const {
    data,
    error
  } = await supabase.from('events').insert(eventData).select().single();
  if (error) throw error;
  return data as Event;
};
export const getCountryPipeline = async (countryCode: string) => {
  const {
    data,
    error
  } = await supabase.from('schools').select(`
      *,
      ambassadors:ambassador_id (id, full_name, email)
    `).eq('country_code', countryCode).in('status', ['prospect', 'visited']).order('created_at', {
    ascending: false
  });
  if (error) throw error;
  return data;
};
export const assignSchoolToAmbassador = async (schoolId: string, ambassadorId: string) => {
  const {
    data,
    error
  } = await supabase.from('schools').update({
    ambassador_id: ambassadorId
  }).eq('id', schoolId).select();
  if (error) throw error;
  return data[0] as School;
};
export const getCountryMetrics = async (countryCode: string) => {
  // Get total students reached in country
  const {
    data: visitData,
    error: visitError
  } = await supabase.from('visits').select(`
      students_reached,
      schools:school_id (country_code)
    `).eq('schools.country_code', countryCode);
  if (visitError) throw visitError;
  const totalStudents = visitData.reduce((sum, visit) => sum + visit.students_reached, 0);
  // Get school counts by status in country
  const {
    data: schoolData,
    error: schoolError
  } = await supabase.from('schools').select('status').eq('country_code', countryCode);
  if (schoolError) throw schoolError;
  const schoolsByStatus = schoolData.reduce((acc, school) => {
    acc[school.status] = (acc[school.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  // Get ambassador count in country
  const {
    count: ambassadorCount,
    error: ambassadorError
  } = await supabase.from('users').select('id', {
    count: 'exact',
    head: true
  }).eq('role', 'ambassador').eq('country_code', countryCode);
  if (ambassadorError) throw ambassadorError;
  return {
    totalStudents,
    schoolsByStatus,
    ambassadorCount: ambassadorCount || 0
  };
};