import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

// Types for dashboard data
export interface DashboardKPIs {
  activePipeline?: any;
  newPartners?: any;
  newPartnersThisMonth?: number;
  pipelineValue?: number;
  leadsGenerated: number;
  tasksCompleted: number;
  schoolsVisited: number;
  impactScore: number;
  dailyStreak?: number;
  conversionRate?: number;
  activeAmbassadors?: number;
  partnerships?: number;
}

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  due_date: string;
  progress: number;
  school_id?: string;
  school_name?: string;
}

export interface SchoolData {
  id: string;
  name: string;
  location: string;
  country_code: string;
  status: 'prospect' | 'contacted' | 'visited' | 'partnered' | 'inactive';
  leads: number;
  last_visit?: string;
  ambassador_id?: string;
  ambassador_name?: string;
}

export interface AmbassadorData {
  id: string;
  full_name: string;
  email: string;
  status: 'active' | 'inactive' | 'training' | 'suspended';
  performance_score: number;
  schools_count: number;
  leads_generated: number;
  last_activity: string;
  country_code: string;
}

export interface ActivityData {
  id: string;
  type: 'visit' | 'partnership' | 'task' | 'note';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
  };
  status?: 'completed' | 'pending';
}

// Generic hook for dashboard data with loading and error states
export const useDashboardData = <T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Ambassador Dashboard Data Hook
export const useAmbassadorKPIs = (ambassadorId: string) => {
  return useDashboardData<DashboardKPIs>(
    async () => {
      // First check if the ambassador exists
      let { data: ambassadorExists, error: ambassadorError } = await supabase
        .from('users')
        .select('id, performance_score, role')
        .eq('id', ambassadorId)
        .maybeSingle(); // Use maybeSingle instead of single to handle non-existent records

      if (ambassadorError) {
        console.error('Error checking ambassador:', ambassadorError);
        throw new Error(`Ambassador not found: ${ambassadorError.message}`);
      }

      // If ambassador doesn't exist in database, try to create the user row
      if (!ambassadorExists) {
        console.log('Ambassador not found in database, attempting to create user row...');
        try {
          // Get current user data from auth
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            throw new Error('User not authenticated');
          }

          // Create user data object
          const userData = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            role: user.user_metadata?.role || 'ambassador',
            country_code: user.user_metadata?.country_code
          };

          // Ensure user exists in database
          console.log('Calling ensure_user_in_database with:', {
            user_id: userData.id,
            user_email: userData.email,
            user_full_name: userData.full_name,
            user_role: userData.role,
            user_country_code: userData.country_code,
          });

          const { data: ensureData, error: ensureError } = await supabase.rpc('ensure_user_in_database', {
            user_id: userData.id,
            user_email: userData.email,
            user_full_name: userData.full_name,
            user_role: userData.role,
            user_country_code: userData.country_code,
          });

          console.log('ensure_user_in_database result:', { data: ensureData, error: ensureError });

          if (ensureError) {
            console.error('Error ensuring user in database:', ensureError);
            throw new Error(`Failed to create user record: ${ensureError.message}`);
          }

          // Re-check if ambassador now exists
          const { data: recheckData, error: recheckError } = await supabase
            .from('users')
            .select('id, performance_score, role')
            .eq('id', ambassadorId)
            .maybeSingle();

          if (recheckError || !recheckData) {
            throw new Error('Failed to create ambassador record');
          }

          ambassadorExists = recheckData;
        } catch (createError) {
          console.error('Error creating ambassador record:', createError);
          throw new Error('Ambassador not found in database');
        }
      }

      if (ambassadorExists.role !== 'ambassador') {
        throw new Error('User is not an ambassador');
      }

      // Get total leads generated by this ambassador
      const { data: visitsData, error: visitsError } = await supabase
        .from('visits')
        .select('leads_generated')
        .eq('ambassador_id', ambassadorId);

      if (visitsError) {
        console.error('Error fetching visits:', visitsError);
      }

      const totalLeads = visitsData?.reduce((sum, visit) => sum + (visit.leads_generated || 0), 0) || 0;

      // Get completed tasks
      const { count: tasksCount, error: tasksError } = await supabase
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('ambassador_id', ambassadorId)
        .eq('status', 'Completed');

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
      }

      // Get schools assigned to this ambassador
      const { count: schoolsCount, error: schoolsError } = await supabase
        .from('schools')
        .select('id', { count: 'exact', head: true })
        .eq('ambassador_id', ambassadorId);

      if (schoolsError) {
        console.error('Error fetching schools:', schoolsError);
      }

      // Calculate daily streak (placeholder logic - would need visit patterns)
      const dailyStreak = 7; // Would calculate from actual visit dates

      return {
        leadsGenerated: totalLeads,
        tasksCompleted: tasksCount || 0,
        schoolsVisited: schoolsCount || 0,
        impactScore: ambassadorExists.performance_score || 0,
        dailyStreak: dailyStreak
      };
    },
    [ambassadorId]
  );
};

export const useAmbassadorTasks = (ambassadorId: string) => {
  return useDashboardData<TaskData[]>(
    async () => {
      // First verify ambassador exists
      const { data: ambassadorExists, error: ambassadorError } = await supabase
        .from('users')
        .select('id')
        .eq('id', ambassadorId)
        .maybeSingle();

      if (ambassadorError || !ambassadorExists) {
        return []; // Return empty array if ambassador doesn't exist
      }

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          priority,
          status,
          due_date,
          progress,
          school_id,
          schools:school_id (name)
        `)
        .eq('ambassador_id', ambassadorId)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }

      return data?.map(task => ({
        ...task,
        school_name: Array.isArray(task.schools) ? (task.schools[0] as any)?.name : (task.schools as any)?.name || undefined
      })) || [];
    },
    [ambassadorId]
  );
};

export const useAmbassadorSchools = (ambassadorId: string) => {
  return useDashboardData<SchoolData[]>(
    async () => {
      // First verify ambassador exists
      const { data: ambassadorExists, error: ambassadorError } = await supabase
        .from('users')
        .select('id')
        .eq('id', ambassadorId)
        .maybeSingle();

      if (ambassadorError || !ambassadorExists) {
        return []; // Return empty array if ambassador doesn't exist
      }

      const { data, error } = await supabase
        .from('schools')
        .select(`
          id,
          name,
          location,
          country_code,
          status,
          created_at,
          visits (
            id,
            visit_date,
            leads_generated
          )
        `)
        .eq('ambassador_id', ambassadorId)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching schools:', error);
        return [];
      }

      return data?.map(school => {
        const totalLeads = school.visits?.reduce((sum, visit) => sum + (visit.leads_generated || 0), 0) || 0;
        const lastVisit = school.visits?.sort((a, b) =>
          new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
        )[0]?.visit_date;

        return {
          id: school.id,
          name: school.name,
          location: school.location,
          country_code: school.country_code,
          status: school.status,
          leads: totalLeads,
          last_visit: lastVisit ? new Date(lastVisit).toLocaleDateString() : 'Never'
        };
      }) || [];
    },
    [ambassadorId]
  );
};

// Country Lead Dashboard Data Hook
export const useCountryLeadKPIs = (countryCode: string) => {
  return useDashboardData<DashboardKPIs>(
    async () => {
      // Validate country code
      if (!countryCode || countryCode.trim() === '') {
        throw new Error('Invalid country code provided');
      }

      // Get team members count
      const { count: teamCount, error: teamError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('country_code', countryCode)
        .eq('role', 'ambassador')
        .eq('status', 'active');

      if (teamError) {
        console.error('Error fetching team count:', teamError);
      }

      // Get total leads from this country
      const { data: leadsData, error: leadsError } = await supabase
        .from('visits')
        .select('leads_generated, users!ambassador_id(country_code)')
        .eq('users.country_code', countryCode);

      if (leadsError) {
        console.error('Error fetching leads data:', leadsError);
      }

      const totalLeads = leadsData?.reduce((sum, visit) => sum + (visit.leads_generated || 0), 0) || 0;

      // Get schools in this country
      const { count: schoolsCount, error: schoolsError } = await supabase
        .from('schools')
        .select('id', { count: 'exact', head: true })
        .eq('country_code', countryCode);

      if (schoolsError) {
        console.error('Error fetching schools:', schoolsError);
      }

      // Get completed tasks this month for country ambassadors
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      
      const { count: tasksCount, error: tasksError } = await supabase
        .from('tasks')
        .select('id, users!ambassador_id(country_code)', { count: 'exact', head: true })
        .eq('users.country_code', countryCode)
        .eq('status', 'Completed')
        .gte('updated_at', startOfMonth.toISOString());

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
      }

      // Calculate goal progress (example: schools visited vs target)
      const targetSchools = 50; // This could be configurable per country
      const goalProgress = Math.min(100, Math.floor((schoolsCount || 0) / targetSchools * 100));

      // Calculate conversion rate (partnered schools / total schools)
      const { count: partneredSchools, error: partneredError } = await supabase
        .from('schools')
        .select('id', { count: 'exact', head: true })
        .eq('country_code', countryCode)
        .eq('status', 'partnered');

      if (partneredError) {
        console.error('Error fetching partnered schools:', partneredError);
      }

      const conversionRate = schoolsCount && schoolsCount > 0 
        ? Math.round((partneredSchools || 0) / schoolsCount * 100) 
        : 0;

      return {
        leadsGenerated: totalLeads,
        activeAmbassadors: teamCount || 0,
        schoolsVisited: schoolsCount || 0,
        tasksCompleted: tasksCount || 0,
        impactScore: goalProgress,
        conversionRate: conversionRate
      };
    },
    [countryCode]
  );
};

export const useCountryAmbassadors = (countryCode: string) => {
  return useDashboardData<AmbassadorData[]>(
    async () => {
      if (!countryCode || countryCode.trim() === '') {
        return [];
      }

      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          email,
          status,
          performance_score,
          created_at,
          updated_at
        `)
        .eq('country_code', countryCode)
        .eq('role', 'ambassador')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Error fetching ambassadors:', error);
        return [];
      }

      // Get additional data for each ambassador
      const ambassadorIds = data?.map(amb => amb.id) || [];
      
      // Get schools count for each ambassador
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('id, ambassador_id')
        .in('ambassador_id', ambassadorIds);

      if (schoolsError) {
        console.error('Error fetching schools data:', schoolsError);
      }

      // Get leads data for each ambassador
      const { data: visitsData, error: visitsError } = await supabase
        .from('visits')
        .select('ambassador_id, leads_generated')
        .in('ambassador_id', ambassadorIds);

      if (visitsError) {
        console.error('Error fetching visits data:', visitsError);
      }

      return data?.map(ambassador => {
        const schoolsCount = schoolsData?.filter(school => school.ambassador_id === ambassador.id).length || 0;
        const leadsGenerated = visitsData
          ?.filter(visit => visit.ambassador_id === ambassador.id)
          ?.reduce((sum, visit) => sum + (visit.leads_generated || 0), 0) || 0;
        
        const lastActivity = ambassador.updated_at || ambassador.created_at;

        return {
          id: ambassador.id,
          full_name: ambassador.full_name,
          email: ambassador.email,
          status: ambassador.status as 'active' | 'inactive' | 'training' | 'suspended',
          performance_score: ambassador.performance_score || 0,
          schools_count: schoolsCount,
          leads_generated: leadsGenerated,
          last_activity: new Date(lastActivity).toLocaleDateString(),
          country_code: countryCode
        };
      }) || [];
    },
    [countryCode]
  );
};

// Management Dashboard Data Hook
export const useManagementKPIs = () => {
  return useDashboardData<DashboardKPIs>(
    async () => {
      // Get total students reached from all visits
      const { data: visitsData, error: visitsError } = await supabase
        .from('visits')
        .select('students_reached, leads_generated');

      if (visitsError) {
        console.error('Error fetching visits data:', visitsError);
      }

      const studentsReached = visitsData?.reduce((sum, visit) => sum + (visit.students_reached || 0), 0) || 0;
      const totalLeads = visitsData?.reduce((sum, visit) => sum + (visit.leads_generated || 0), 0) || 0;

      // Get partnerships count
      const { count: partnershipsCount, error: partnershipsError } = await supabase
        .from('schools')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'partnered');

      if (partnershipsError) {
        console.error('Error fetching partnerships:', partnershipsError);
      }

      // Get active ambassadors
      const { count: ambassadorsCount, error: ambassadorsError } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'ambassador')
        .eq('status', 'active');

      if (ambassadorsError) {
        console.error('Error fetching ambassadors:', ambassadorsError);
      }

      // Get total schools
      const { count: totalSchoolsCount, error: schoolsError } = await supabase
        .from('schools')
        .select('id', { count: 'exact', head: true });

      if (schoolsError) {
        console.error('Error fetching total schools:', schoolsError);
      }

      // Get completed tasks (global)
      const { count: completedTasksCount, error: tasksError } = await supabase
        .from('tasks')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'Completed');

      if (tasksError) {
        console.error('Error fetching completed tasks:', tasksError);
      }

      // Calculate conversion rate
      const conversionRate = totalSchoolsCount && totalSchoolsCount > 0 
        ? Math.round((partnershipsCount || 0) / totalSchoolsCount * 100) 
        : 0;

      return {
        leadsGenerated: totalLeads || studentsReached, // Use leads if available, fallback to students reached
        partnerships: partnershipsCount || 0,
        activeAmbassadors: ambassadorsCount || 0,
        conversionRate,
        tasksCompleted: completedTasksCount || 0,
        schoolsVisited: totalSchoolsCount || 0,
        impactScore: conversionRate
      };
    },
    []
  );
};

export const useAllSchools = () => {
  return useDashboardData<SchoolData[]>(
    async () => {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          id,
          name,
          location,
          country_code,
          status,
          ambassador_id,
          created_at
        `)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching schools:', error);
        return [];
      }

      // Get visit data separately to avoid complex joins
      const schoolIds = data?.map(school => school.id) || [];
      const { data: visitsData, error: visitsError } = await supabase
        .from('visits')
        .select('school_id, leads_generated, visit_date')
        .in('school_id', schoolIds);

      if (visitsError) {
        console.error('Error fetching visits:', visitsError);
      }

      // Get ambassador names
      const ambassadorIds = [...new Set(data?.map(school => school.ambassador_id).filter(Boolean))] as string[];
      const { data: ambassadorsData, error: ambassadorsError } = await supabase
        .from('users')
        .select('id, full_name')
        .in('id', ambassadorIds);

      if (ambassadorsError) {
        console.error('Error fetching ambassadors:', ambassadorsError);
      }

      return data?.map(school => {
        const schoolVisits = visitsData?.filter(visit => visit.school_id === school.id) || [];
        const totalLeads = schoolVisits.reduce((sum, visit) => sum + (visit.leads_generated || 0), 0);
        
        const lastVisit = schoolVisits
          .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())[0]?.visit_date;

        const ambassador = ambassadorsData?.find(amb => amb.id === school.ambassador_id);

        return {
          id: school.id,
          name: school.name,
          location: school.location,
          country_code: school.country_code,
          status: school.status,
          leads: totalLeads,
          last_visit: lastVisit ? new Date(lastVisit).toLocaleDateString() : 'Never',
          ambassador_id: school.ambassador_id,
          ambassador_name: ambassador?.full_name
        };
      }) || [];
    },
    []
  );
};

// Chart data hooks
export const useLeadGenerationTrends = () => {
  return useDashboardData(
    async () => {
      const { data, error } = await supabase
        .from('visits')
        .select('leads_generated, visit_date')
        .order('visit_date', { ascending: true });

      if (error) throw error;

      // Group by month
      const monthlyData = data?.reduce((acc: any, visit) => {
        const month = new Date(visit.visit_date).toLocaleDateString('en-US', { month: 'short' });
        acc[month] = (acc[month] || 0) + (visit.leads_generated || 0);
        return acc;
      }, {});

      return {
        labels: Object.keys(monthlyData || {}),
        datasets: [{
          label: 'Leads Generated',
          data: Object.values(monthlyData || {}),
          borderColor: '#1A5F7A',
          backgroundColor: 'rgba(26, 95, 122, 0.1)'
        }]
      };
    },
    []
  );
};

export const useCountryDistribution = () => {
  return useDashboardData(
    async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('country_code')
        .eq('status', 'partnered');

      if (error) throw error;

      const countryData = data?.reduce((acc: any, school) => {
        acc[school.country_code] = (acc[school.country_code] || 0) + 1;
        return acc;
      }, {});

      return {
        labels: Object.keys(countryData || {}),
        datasets: [{
          data: Object.values(countryData || {}),
          backgroundColor: [
            'rgba(26, 95, 122, 0.8)',
            'rgba(244, 196, 48, 0.8)',
            'rgba(38, 162, 105, 0.8)',
            'rgba(108, 92, 231, 0.8)',
            'rgba(225, 112, 85, 0.8)'
          ]
        }]
      };
    },
    []
  );
};

export const useAmbassadorPerformance = () => {
  return useDashboardData(
    async () => {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, performance_score')
        .eq('role', 'ambassador')
        .eq('status', 'active')
        .order('performance_score', { ascending: false })
        .limit(10);

      if (error) throw error;

      return {
        labels: data?.map(user => user.full_name.split(' ')[0]) || [],
        datasets: [{
          label: 'Performance Score',
          data: data?.map(user => user.performance_score || 0) || [],
          backgroundColor: 'rgba(26, 95, 122, 0.8)'
        }]
      };
    },
    []
  );
};

// Activity feed hook
export const useRecentActivities = (limit: number = 10) => {
  return useDashboardData<ActivityData[]>(
    async () => {
      // Get recent visits
      const { data: visitsData, error: visitsError } = await supabase
        .from('visits')
        .select(`
          id,
          visit_date,
          notes,
          schools(name),
          users!ambassador_id(full_name)
        `)
        .order('visit_date', { ascending: false })
        .limit(limit);

      if (visitsError) {
        console.error('Error fetching recent visits:', visitsError);
      }

      // Get recent task completions
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          updated_at,
          status,
          users!ambassador_id(full_name)
        `)
        .eq('status', 'Completed')
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (tasksError) {
        console.error('Error fetching recent tasks:', tasksError);
      }

      const activities: ActivityData[] = [];

      // Add visit activities
      visitsData?.forEach(visit => {
        activities.push({
          id: `visit-${visit.id}`,
          type: 'visit',
          title: `School Visit: ${(visit.schools as any)?.name || 'Unknown School'}`,
          description: visit.notes || 'School visit completed',
          timestamp: visit.visit_date,
          user: {
            name: (visit.users as any)?.full_name || 'Unknown User'
          },
          status: 'completed'
        });
      });

      // Add task activities
      tasksData?.forEach(task => {
        activities.push({
          id: `task-${task.id}`,
          type: 'task',
          title: `Task Completed: ${task.title}`,
          description: task.title,
          timestamp: task.updated_at,
          user: {
            name: (task.users as any)?.full_name || 'Unknown User'
          },
          status: 'completed'
        });
      });

      // Sort all activities by timestamp and limit
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    },
    [limit]
  );
};
