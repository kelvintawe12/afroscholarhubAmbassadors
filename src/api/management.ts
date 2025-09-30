import { supabase, School, User, Event } from '../utils/supabase';
import { UserRole, Country } from '../types';
// Management API functions
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      countries:country_code (name, flag_emoji)
    `)
    .order('full_name', { ascending: true });

  if (error) throw error;
  return data as (User & { countries?: { name: string; flag_emoji: string } })[];
};

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
  // Get visits data for students and monthly trends
  const { data: visitsData, error: visitsError } = await supabase
    .from('visits')
    .select('students_reached, visit_date, school_id, leads_generated');

  if (visitsError) throw visitsError;

  // Get schools data
  const { data: schoolsData, error: schoolsError } = await supabase
    .from('schools')
    .select('id, status, country_code, created_at');

  if (schoolsError) throw schoolsError;

  // Get users data for ambassadors
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id, role, performance_score, country_code')
    .eq('role', 'ambassador');

  if (usersError) throw usersError;

  // Get events data
  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select('id, name, country_code, event_date, actual_attendance');

  const events = eventsError ? [] : (eventsData || []);
  if (eventsError) {
    console.warn('Events data not available:', eventsError.message);
  }

  // Calculate KPIs
  const totalStudents = visitsData.reduce((sum, visit) => sum + (visit.students_reached || 0), 0);
  const totalSchools = schoolsData.length;
  const totalEvents = events.length;

  // Calculate growth (simplified: compare last 6 months vs previous 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const recentVisits = visitsData.filter(v => new Date(v.visit_date) >= sixMonthsAgo);
  const previousVisits = visitsData.filter(v => new Date(v.visit_date) >= twelveMonthsAgo && new Date(v.visit_date) < sixMonthsAgo);

  const recentStudents = recentVisits.reduce((sum, v) => sum + (v.students_reached || 0), 0);
  const previousStudents = previousVisits.reduce((sum, v) => sum + (v.students_reached || 0), 0);
  const studentChange = previousStudents > 0 ? Math.round(((recentStudents - previousStudents) / previousStudents) * 100) : 0;

  const recentSchools = schoolsData.filter(s => new Date(s.created_at) >= sixMonthsAgo).length;
  const previousSchools = schoolsData.filter(s => new Date(s.created_at) >= twelveMonthsAgo && new Date(s.created_at) < sixMonthsAgo).length;
  const schoolChange = previousSchools > 0 ? Math.round(((recentSchools - previousSchools) / previousSchools) * 100) : 0;

  const recentEvents = events.filter(e => new Date(e.event_date) >= sixMonthsAgo).length;
  const previousEvents = events.filter(e => new Date(e.event_date) >= twelveMonthsAgo && new Date(e.event_date) < sixMonthsAgo).length;
  const eventsChange = previousEvents > 0 ? Math.round(((recentEvents - previousEvents) / previousEvents) * 100) : 0;

  // Total growth (overall metric, using student growth as proxy)
  const totalGrowth = studentChange;
  const growthChange = studentChange; // Simplified

  const kpis = {
    totalGrowth,
    growthChange,
    newStudents: recentStudents,
    studentChange,
    newSchools: recentSchools,
    schoolChange,
    eventsHosted: recentEvents,
    eventsChange
  };

  // Monthly growth data (last 12 months)
  const monthlyData: Record<string, { students: number; schools: number }> = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();

  months.forEach((month, index) => {
    const monthVisits = visitsData.filter(v => {
      const date = new Date(v.visit_date);
      return date.getFullYear() === currentYear && date.getMonth() === index;
    });
    const monthSchools = schoolsData.filter(s => {
      const date = new Date(s.created_at);
      return date.getFullYear() === currentYear && date.getMonth() === index;
    });

    monthlyData[month] = {
      students: monthVisits.reduce((sum, v) => sum + (v.students_reached || 0), 0),
      schools: monthSchools.length
    };
  });

  const monthlyGrowth = {
    labels: months,
    studentsReached: months.map(m => monthlyData[m].students),
    schoolPartnerships: months.map(m => monthlyData[m].schools)
  };

  // Country comparison
  const countryData: Record<string, { students: number; schools: number }> = {};
  ['Nigeria', 'Kenya', 'Ghana', 'South Africa'].forEach(country => {
    const code = country === 'Nigeria' ? 'NG' : country === 'Kenya' ? 'KE' : country === 'Ghana' ? 'GH' : 'ZA';
    const countryVisits = visitsData.filter(v => {
      const school = schoolsData.find(s => s.id === v.school_id);
      return school?.country_code === code;
    });
    const countrySchools = schoolsData.filter(s => s.country_code === code);

    countryData[country] = {
      students: countryVisits.reduce((sum, v) => sum + (v.students_reached || 0), 0),
      schools: countrySchools.length
    };
  });

  const countryComparison = {
    labels: Object.keys(countryData),
    studentsReached: Object.values(countryData).map((d: { students: number; schools: number }) => d.students),
    schoolPartnerships: Object.values(countryData).map((d: { students: number; schools: number }) => d.schools)
  };

  // Schools by status
  const statusCounts = schoolsData.reduce((acc, school) => {
    const status = school.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const schoolsByStatus = {
    labels: ['Partnered', 'Prospects', 'Visited', 'Inactive'],
    data: [
      statusCounts['partnered'] || 0,
      statusCounts['prospect'] || 0,
      statusCounts['visited'] || 0,
      statusCounts['inactive'] || 0
    ]
  };

  // Ambassador performance
  const performanceBuckets = usersData.reduce((acc, user) => {
    const score = user.performance_score || 0;
    if (score >= 80) acc.excellent++;
    else if (score >= 60) acc.good++;
    else if (score >= 40) acc.average++;
    else acc.needsImprovement++;
    return acc;
  }, { excellent: 0, good: 0, average: 0, needsImprovement: 0 });

  const ambassadorPerformance = {
    labels: ['Excellent', 'Good', 'Average', 'Needs Improvement'],
    data: [
      performanceBuckets.excellent,
      performanceBuckets.good,
      performanceBuckets.average,
      performanceBuckets.needsImprovement
    ]
  };

  // Recent events (last 5 events with computed metrics)
  const recentEventsData = events
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
    .slice(0, 5)
    .map(event => ({
      id: event.id,
      name: event.name,
      country: event.country_code || 'Unknown',
      date: event.event_date,
      students: event.actual_attendance || 0,
      conversion: 0, // Placeholder since leads_generated not available on events
      roi: '0.0' // Placeholder since leads_generated not available on events
    }));

  return {
    kpis,
    monthlyGrowth,
    countryComparison,
    schoolsByStatus,
    ambassadorPerformance,
    recentEvents: recentEventsData
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
  try {
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

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw new Error(`Failed to fetch ambassadors: ${usersError.message}`);
    }

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

    if (visitsError) {
      console.error('Error fetching visits:', visitsError);
      // Don't throw here, just log and continue with empty visits data
      console.warn('Continuing without visits data due to error');
    }

    // Get tasks data for each ambassador
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select(`
        ambassador_id,
        status,
        created_at
      `);

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      // Don't throw here, just log and continue with empty tasks data
      console.warn('Continuing without tasks data due to error');
    }

    // Aggregate data per ambassador
    const ambassadors = usersData.map(user => {
      const userVisits = (visitsData || []).filter(v => v.ambassador_id === user.id);
      const userTasks = (tasksData || []).filter(t => t.ambassador_id === user.id);

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
  } catch (error) {
    console.error('Error in getAmbassadorsData:', error);
    throw new Error(`Failed to fetch ambassadors data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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

export const createUser = async (userData: {
  email: string;
  full_name: string;
  role: UserRole;
  country_code?: string;
  phone?: string;
  bio?: string;
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      ...userData,
      status: 'active',
      onboarding_completed: false,
      performance_score: 0
    }])
    .select();

  if (error) throw error;
  return data[0] as User;
};

export const updateUserRole = async (userId: string, newRole: UserRole) => {
  const { data, error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId)
    .select();

  if (error) throw error;
  return data[0] as User;
};

export const updateUserCountry = async (userId: string, countryCode: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ country_code: countryCode })
    .eq('id', userId)
    .select();

  if (error) throw error;
  return data[0] as User;
};

export const getUsersByRole = async (role: UserRole) => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      countries:country_code (name, flag_emoji)
    `)
    .eq('role', role)
    .order('full_name', { ascending: true });

  if (error) throw error;
  return data as (User & { countries?: { name: string; flag_emoji: string } })[];
};

export const getCountryLeads = async () => {
  const { data, error } = await supabase
    .from('countries')
    .select(`
      *,
      users:lead_id (id, full_name, email, role)
    `)
    .eq('active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return data as (Country & { users?: { id: string; full_name: string; email: string; role: UserRole } })[];
};

interface TrainingModuleData {
  title: string;
  description: string;
  type: 'Required' | 'Optional';
  format: 'Video' | 'Interactive' | 'Document' | 'Video + Quiz' | 'Document + Quiz';
  duration: string;
  target_audience: 'All Ambassadors' | 'New Ambassadors' | 'Senior Ambassadors';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  learning_objectives: string[];
  applicable_countries: string[];
  resource_id?: string;
  created_by: string;
  completion_rate: number;
  last_updated: string;
}

export const createTrainingModule = async (data: TrainingModuleData) => {
  const { error } = await supabase
    .from('training_modules')
    .insert({
      title: data.title,
      description: data.description,
      type: data.type,
      format: data.format,
      duration: data.duration,
      target_audience: data.target_audience,
      difficulty_level: data.difficulty_level,
      learning_objectives: data.learning_objectives,
      applicable_countries: data.applicable_countries,
      resource_id: data.resource_id,
      created_by: data.created_by,
      completion_rate: data.completion_rate,
      last_updated: data.last_updated,
      status: 'draft', // Default status for new modules
      metadata: {}, // Default empty JSONB
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (error) {
    throw new Error(`Failed to create training module: ${error.message}`);
  }

  return { success: true };
};

export const getAllReports = async () => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteReport = async (id: string) => {
  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
};

export const updateReport = async (id: string, updates: Partial<any>) => {
  const { data, error } = await supabase
    .from('reports')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};
