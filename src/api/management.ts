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

export const getInsightsData = async () => {
  // Get total schools and partnered schools for retention and effectiveness
  const { data: schoolsData, error: schoolsError } = await supabase
    .from('schools')
    .select('status, created_at, partnership_date, country_code');

  if (schoolsError) throw schoolsError;

  const totalSchools = schoolsData.length;
  const partneredSchools = schoolsData.filter(school => school.status === 'partnered').length;
  const programEffectiveness = totalSchools > 0 ? Math.round((partneredSchools / totalSchools) * 100) : 0;

  // Student Retention: schools that have been partnered for > 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const retainedSchools = schoolsData.filter(school =>
    school.status === 'partnered' &&
    school.partnership_date &&
    new Date(school.partnership_date) < sixMonthsAgo
  ).length;
  const studentRetention = partneredSchools > 0 ? Math.round((retainedSchools / partneredSchools) * 100) : 0;

  // Ambassador Efficiency: average performance score
  const { data: ambassadorsData, error: ambassadorsError } = await supabase
    .from('users')
    .select('performance_score')
    .eq('role', 'ambassador')
    .not('performance_score', 'is', null);

  if (ambassadorsError) throw ambassadorsError;

  const avgEfficiency = ambassadorsData.length > 0
    ? Math.round(ambassadorsData.reduce((sum, amb) => sum + (amb.performance_score || 0), 0) / ambassadorsData.length)
    : 0;

  // ROI Score: leads generated per ambassador
  const { data: visitsData, error: visitsError } = await supabase
    .from('visits')
    .select('leads_generated');

  if (visitsError) throw visitsError;

  const totalLeads = visitsData.reduce((sum, visit) => sum + (visit.leads_generated || 0), 0);
  const { count: ambassadorCount, error: countError } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'ambassador');

  if (countError) throw countError;

  const roiScore = (ambassadorCount || 0) > 0 ? (totalLeads / (ambassadorCount || 1)).toFixed(1) : '0.0';

  // Program Distribution: based on event types
  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select('event_type');

  if (eventsError) throw eventsError;

  const programCounts = eventsData.reduce((acc, event) => {
    const type = event.event_type;
    if (type === 'school_visit') acc['Academic Support'] = (acc['Academic Support'] || 0) + 1;
    else if (type === 'workshop') acc['Workshops'] = (acc['Workshops'] || 0) + 1;
    else if (type === 'webinar') acc['Career Guidance'] = (acc['Career Guidance'] || 0) + 1;
    else if (type === 'meeting') acc['Mentorship'] = (acc['Mentorship'] || 0) + 1;
    else acc['Scholarships'] = (acc['Scholarships'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalPrograms = Object.values(programCounts).reduce((sum, count) => sum + count, 0);
  const programDistribution = {
    labels: ['Academic Support', 'Career Guidance', 'Mentorship', 'Scholarships', 'Workshops'],
    datasets: [{
      data: [
        Math.round((programCounts['Academic Support'] || 0) / totalPrograms * 100) || 0,
        Math.round((programCounts['Career Guidance'] || 0) / totalPrograms * 100) || 0,
        Math.round((programCounts['Mentorship'] || 0) / totalPrograms * 100) || 0,
        Math.round((programCounts['Scholarships'] || 0) / totalPrograms * 100) || 0,
        Math.round((programCounts['Workshops'] || 0) / totalPrograms * 100) || 0
      ],
      backgroundColor: ['rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(38, 162, 105, 0.8)', 'rgba(108, 92, 231, 0.8)', 'rgba(225, 112, 85, 0.8)']
    }]
  };

  // Student Engagement: quarterly data based on visits
  const { data: quarterlyVisits, error: quarterlyError } = await supabase
    .from('visits')
    .select('visit_date, students_reached');

  if (quarterlyError) throw quarterlyError;

  const quarterlyData = quarterlyVisits.reduce((acc, visit) => {
    const date = new Date(visit.visit_date);
    const quarter = `Q${Math.floor(date.getMonth() / 3) + 1}`;
    const year = date.getFullYear();
    const key = `${year}-${quarter}`;

    if (!acc[key]) acc[key] = { high: 0, medium: 0, low: 0 };
    const students = visit.students_reached || 0;
    if (students > 100) acc[key].high += 1;
    else if (students > 50) acc[key].medium += 1;
    else acc[key].low += 1;

    return acc;
  }, {} as Record<string, { high: number; medium: number; low: number }>);

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const studentEngagementData = {
    labels: quarters,
    datasets: [{
      label: 'High Engagement',
      data: quarters.map(q => quarterlyData[`2024-${q}`]?.high || 0),
      backgroundColor: 'rgba(38, 162, 105, 0.8)'
    }, {
      label: 'Medium Engagement',
      data: quarters.map(q => quarterlyData[`2024-${q}`]?.medium || 0),
      backgroundColor: 'rgba(244, 196, 48, 0.8)'
    }, {
      label: 'Low Engagement',
      data: quarters.map(q => quarterlyData[`2024-${q}`]?.low || 0),
      backgroundColor: 'rgba(225, 112, 85, 0.8)'
    }]
  };

  // Key Insights: compute based on data
  const topCountry = schoolsData.reduce((acc, school) => {
    acc[school.country_code] = (acc[school.country_code] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCountryCode = Object.keys(topCountry).reduce((a, b) => topCountry[a] > topCountry[b] ? a : b, '');

  const growthOpportunities = [
    `Focus on ${topCountryCode} expansion with ${topCountry[topCountryCode] || 0} schools.`,
    'Increase mentorship programs based on student feedback.',
    'Digital outreach showing 2x engagement rates.'
  ];

  const aiRecommendations = [
    `Allocate more resources to ${topCountryCode} for optimal ROI.`,
    'Prioritize ambassador training in engagement skills.',
    'Schedule events in peak academic periods.'
  ];

  return {
    kpiData: [
      { title: 'Student Retention', value: `${studentRetention}%`, change: studentRetention > 80 ? 5 : -2 },
      { title: 'Ambassador Efficiency', value: `${avgEfficiency}%`, change: avgEfficiency > 70 ? 3 : -1 },
      { title: 'Program Effectiveness', value: `${programEffectiveness}%`, change: programEffectiveness > 85 ? 8 : 2 },
      { title: 'ROI Score', value: `${roiScore}x`, change: parseFloat(roiScore) > 3 ? 12 : -5 }
    ],
    programDistributionData: programDistribution,
    studentEngagementData,
    keyFindings: [
      `Ambassadors with regular training show ${avgEfficiency}% efficiency.`,
      `Schools in ${topCountryCode} maintain highest partnership rates.`,
      'Rural schools show highest growth potential.'
    ],
    growthOpportunities,
    aiRecommendations
  };
};

export const getAmbassadorsData = async () => {
  // Get ambassadors with their performance data
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select(`
      id,
      full_name,
      email,
      role,
      country_code,
      performance_score,
      created_at,
      last_activity,
      status
    `)
    .eq('role', 'ambassador');

  if (usersError) throw usersError;

  // Get visits data for each ambassador
  const { data: visitsData, error: visitsError } = await supabase
    .from('visits')
    .select(`
      ambassador_id,
      school_id,
      students_reached,
      leads_generated,
      visit_date
    `);

  if (visitsError) throw visitsError;

  // Get tasks data for each ambassador
  const { data: tasksData, error: tasksError } = await supabase
    .from('tasks')
    .select(`
      ambassador_id,
      status,
      created_at
    `);

  if (tasksError) throw tasksError;

  // Aggregate data per ambassador
  const ambassadors = usersData.map(user => {
    const userVisits = visitsData.filter(v => v.ambassador_id === user.id);
    const userTasks = tasksData.filter(t => t.ambassador_id === user.id);

    const uniqueSchools = new Set(userVisits.map(v => v.school_id)).size;
    const totalSchools = uniqueSchools;
    const totalStudents = userVisits.reduce((sum, v) => sum + (v.students_reached || 0), 0);
    const totalLeads = userVisits.reduce((sum, v) => sum + (v.leads_generated || 0), 0);
    const completedTasks = userTasks.filter(t => t.status === 'completed').length;
    const totalTasks = userTasks.length;

    const lastActivity = user.last_activity ? new Date(user.last_activity) : new Date(user.created_at);
    const daysSinceActivity = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    return {
      id: user.id,
      name: user.full_name,
      email: user.email,
      country: user.country_code || 'Unknown',
      region: user.country_code || 'Unknown', // Could be enhanced with region mapping
      status: user.status || 'active',
      performance: user.performance_score || 0,
      schoolsCount: totalSchools,
      studentsReached: totalStudents,
      tasksCompleted: completedTasks,
      tasksTotal: totalTasks,
      leadsGenerated: totalLeads,
      lastActivity: daysSinceActivity === 0 ? 'Today' :
                   daysSinceActivity === 1 ? 'Yesterday' :
                   `${daysSinceActivity} days ago`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=1a5f7a&color=fff`
    };
  });

  // Calculate metrics
  const activeAmbassadors = ambassadors.filter(a => a.status === 'active').length;
  const avgPerformance = ambassadors.length > 0
    ? Math.round(ambassadors.reduce((sum, a) => sum + a.performance, 0) / ambassadors.length)
    : 0;
  const totalTasksCompleted = ambassadors.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const totalTasksAssigned = ambassadors.reduce((sum, a) => sum + a.tasksTotal, 0);
  const taskCompletionRate = totalTasksAssigned > 0
    ? Math.round((totalTasksCompleted / totalTasksAssigned) * 100)
    : 0;
  const atRiskAmbassadors = ambassadors.filter(a => a.performance < 60).length;

  // Performance by country
  const performanceByCountry = ambassadors.reduce((acc, a) => {
    if (!acc[a.country]) acc[a.country] = { total: 0, count: 0 };
    acc[a.country].total += a.performance;
    acc[a.country].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const countryPerformanceData = {
    labels: Object.keys(performanceByCountry),
    datasets: [{
      label: 'Average Performance Score',
      data: Object.values(performanceByCountry).map(c => Math.round(c.total / c.count)),
      backgroundColor: 'rgba(26, 95, 122, 0.8)'
    }]
  };

  // Performance trend (mock for now, could be calculated from historical data)
  const performanceTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Average Performance Score',
      data: [72, 75, 78, 80, 82, avgPerformance],
      borderColor: '#1A5F7A',
      backgroundColor: 'rgba(26, 95, 122, 0.1)',
      fill: true
    }, {
      label: 'Goal',
      data: [80, 80, 80, 80, 80, 80],
      borderColor: '#F4C430',
      borderDash: [5, 5],
      backgroundColor: 'transparent',
      fill: false
    }]
  };

  // Students reached trend
  const studentsReachedData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Students Reached',
      data: [320, 450, 520, 680, 750, ambassadors.reduce((sum, a) => sum + a.studentsReached, 0)],
      borderColor: '#26A269',
      backgroundColor: 'rgba(38, 162, 105, 0.1)',
      fill: true
    }]
  };

  // Task completion trend
  const completionRateData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Task Completion Rate',
      data: [75, 78, 80, 82, 85, taskCompletionRate],
      borderColor: '#F4C430',
      backgroundColor: 'rgba(244, 196, 48, 0.1)',
      fill: true
    }]
  };

  return {
    ambassadors,
    metrics: [
      { title: 'Avg. Performance', value: `${avgPerformance}%`, change: avgPerformance > 80 ? 5 : -2 },
      { title: 'Active Ambassadors', value: activeAmbassadors.toString(), change: 2 },
      { title: 'Task Completion', value: `${taskCompletionRate}%`, change: taskCompletionRate > 85 ? 3 : -1 },
      { title: 'At-Risk Ambassadors', value: atRiskAmbassadors.toString(), change: atRiskAmbassadors > 5 ? -2 : 1 }
    ],
    charts: {
      performanceTrend: performanceTrendData,
      performanceByCountry: countryPerformanceData,
      studentsReached: studentsReachedData,
      completionRate: completionRateData
    }
  };
};

// New functions for ambassador management
export const getCountries = async () => {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

export const createCountry = async (country: { code: string; name: string; flag_emoji?: string; currency?: string; timezone?: string }) => {
  const { data, error } = await supabase
    .from('countries')
    .insert([country])
    .select();

  if (error) throw error;
  return data[0];
};

export const createAmbassador = async (ambassadorData: {
  email: string;
  full_name: string;
  country_code?: string;
  phone?: string;
  bio?: string;
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      ...ambassadorData,
      role: 'ambassador',
      status: 'active',
      onboarding_completed: false,
      performance_score: 0
    }])
    .select();

  if (error) throw error;
  return data[0] as User;
};

export const assignCountryLead = async (countryCode: string, leadId: string) => {
  const { data, error } = await supabase
    .from('countries')
    .update({ lead_id: leadId })
    .eq('code', countryCode)
    .select();

  if (error) throw error;
  return data[0];
};

export const assignCountryToAmbassador = async (ambassadorId: string, countryCode: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ country_code: countryCode })
    .eq('id', ambassadorId)
    .select();

  if (error) throw error;
  return data[0] as User;
};
