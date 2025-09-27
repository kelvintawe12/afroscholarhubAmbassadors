import { supabase } from '../utils/supabase';
import { Report } from '../types';

// Fetch countries from database
export const getCountries = async () => {
  const { data, error } = await supabase
    .from('countries')
    .select('code, name, flag_emoji')
    .eq('active', true)
    .order('name');

  if (error) throw error;
  return data || [];
};

// Report API functions
export const createReport = async (reportData: {
  name: string;
  type: 'weekly' | 'monthly' | 'quarterly' | 'custom';
  start_date: string;
  end_date: string;
  metrics: string[];
}) => {
  const { data, error } = await supabase
    .from('reports')
    .insert({
      ...reportData,
      created_by: (await supabase.auth.getUser()).data.user?.id,
      status: 'draft'
    })
    .select(`
      *,
      creator:users!created_by(full_name, email)
    `)
    .single();

  if (error) throw error;
  return data;
};

export const getReports = async (userId?: string) => {
  let query = supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('created_by', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getReportById = async (id: string) => {
  const { data, error } = await supabase
    .from('reports')
    .select(`
      *,
      creator:users!created_by(full_name, email)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const updateReport = async (id: string, updates: Partial<{
  name: string;
  status: string;
  data: any;
}>) => {
  const { data, error } = await supabase
    .from('reports')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      creator:users!created_by(full_name, email)
    `)
    .single();

  if (error) throw error;
  return data;
};

export const deleteReport = async (id: string) => {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const generateReportMetrics = async (filters: {
  start_date: string;
  end_date: string;
  country_code?: string;
  metrics: string[];
}) => {
  const { start_date, end_date, country_code, metrics } = filters;
  const results: Record<string, any> = {};

  // Students reached from visits
  if (metrics.includes('students_reached')) {
    let visitsQuery = supabase
      .from('visits')
      .select('students_reached, visit_date')
      .gte('visit_date', start_date)
      .lte('visit_date', end_date);

    if (country_code) {
      visitsQuery = visitsQuery.eq('schools.country_code', country_code);
    }

    const { data: visitsData, error: visitsError } = await visitsQuery;
    if (visitsError) throw visitsError;

    results.students_reached = visitsData?.reduce((sum, visit) => sum + (visit.students_reached || 0), 0) || 0;
  }

  // Partnerships from schools
  if (metrics.includes('partnerships')) {
    let schoolsQuery = supabase
      .from('schools')
      .select('id, status, partnership_date')
      .eq('status', 'partnered')
      .gte('partnership_date', start_date)
      .lte('partnership_date', end_date);

    if (country_code) {
      schoolsQuery = schoolsQuery.eq('country_code', country_code);
    }

    const { count: partnershipsCount, error: partnershipsError } = await schoolsQuery;
    if (partnershipsError) throw partnershipsError;

    results.partnerships = partnershipsCount || 0;
  }

  // Active ambassadors
  if (metrics.includes('active_ambassadors')) {
    let ambassadorsQuery = supabase
      .from('users')
      .select('id')
      .eq('role', 'ambassador')
      .eq('status', 'active');

    if (country_code) {
      ambassadorsQuery = ambassadorsQuery.eq('country_code', country_code);
    }

    const { count: ambassadorsCount, error: ambassadorsError } = await ambassadorsQuery;
    if (ambassadorsError) throw ambassadorsError;

    results.active_ambassadors = ambassadorsCount || 0;
  }

  // Total schools
  if (metrics.includes('total_schools')) {
    let schoolsQuery = supabase
      .from('schools')
      .select('id');

    if (country_code) {
      schoolsQuery = schoolsQuery.eq('country_code', country_code);
    }

    const { count: schoolsCount, error: schoolsError } = await schoolsQuery;
    if (schoolsError) throw schoolsError;

    results.total_schools = schoolsCount || 0;
  }

  // Visits count
  if (metrics.includes('visits_count')) {
    let visitsQuery = supabase
      .from('visits')
      .select('id')
      .gte('visit_date', start_date)
      .lte('visit_date', end_date);

    if (country_code) {
      visitsQuery = visitsQuery.eq('schools.country_code', country_code);
    }

    const { count: visitsCount, error: visitsError } = await visitsQuery;
    if (visitsError) throw visitsError;

    results.visits_count = visitsCount || 0;
  }

  // Tasks completed
  if (metrics.includes('tasks_completed')) {
    let tasksQuery = supabase
      .from('tasks')
      .select('id')
      .eq('status', 'completed')
      .gte('completed_date', start_date)
      .lte('completed_date', end_date);

    if (country_code) {
      tasksQuery = tasksQuery.eq('users.country_code', country_code);
    }

    const { count: tasksCount, error: tasksError } = await tasksQuery;
    if (tasksError) throw tasksError;

    results.tasks_completed = tasksCount || 0;
  }

  // Events organized
  if (metrics.includes('events_organized')) {
    let eventsQuery = supabase
      .from('events')
      .select('id')
      .eq('status', 'completed')
      .gte('event_date', start_date)
      .lte('event_date', end_date);

    if (country_code) {
      eventsQuery = eventsQuery.eq('country_code', country_code);
    }

    const { count: eventsCount, error: eventsError } = await eventsQuery;
    if (eventsError) throw eventsError;

    results.events_organized = eventsCount || 0;
  }

  return results;
};

export const generateWeeklyReport = async (weekStart: string, countryCode?: string) => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const metrics = [
    'students_reached',
    'partnerships',
    'active_ambassadors',
    'visits_count',
    'tasks_completed'
  ];

  const data = await generateReportMetrics({
    start_date: weekStart,
    end_date: weekEnd.toISOString().split('T')[0],
    country_code: countryCode,
    metrics
  });

  return data;
};

export const generateMonthlyReport = async (month: string, year: number, countryCode?: string) => {
  const startDate = new Date(year, parseInt(month) - 1, 1);
  const endDate = new Date(year, parseInt(month), 0);

  const metrics = [
    'students_reached',
    'partnerships',
    'active_ambassadors',
    'total_schools',
    'visits_count',
    'tasks_completed',
    'events_organized'
  ];

  const data = await generateReportMetrics({
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    country_code: countryCode,
    metrics
  });

  // Calculate countries covered
  if (countryCode && countryCode !== 'all') {
    data.countries_covered = 1;
  } else {
    // Count distinct countries with visits in the selected month
    const { data: visitsData, error } = await supabase
      .from('visits')
      .select(`
        schools!inner(country_code)
      `)
      .gte('visit_date', startDate.toISOString().split('T')[0])
      .lte('visit_date', endDate.toISOString().split('T')[0]);

    if (error) {
      console.error('Error fetching countries covered:', error);
      data.countries_covered = 0;
    } else {
      // Get unique country codes from the visits
      const uniqueCountries = new Set(visitsData?.map((visit: any) => visit.schools?.country_code).filter(Boolean));
      data.countries_covered = uniqueCountries.size;
    }
  }

  return data;
};

export const generateQuarterlyReport = async (quarter: number, year: number, countryCode?: string) => {
  const startMonth = (quarter - 1) * 3;
  const startDate = new Date(year, startMonth, 1);
  const endDate = new Date(year, startMonth + 3, 0);

  const metrics = [
    'students_reached',
    'partnerships',
    'active_ambassadors',
    'total_schools',
    'visits_count',
    'tasks_completed',
    'events_organized'
  ];

  const data = await generateReportMetrics({
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    country_code: countryCode,
    metrics
  });

  return data;
};
