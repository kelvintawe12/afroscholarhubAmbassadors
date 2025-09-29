import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { DataTable } from '../../ui/widgets/DataTable';
import { BarChart } from '../../ui/widgets/BarChart';
import { LoadingSpinner } from '../../LoadingSpinner';
import { CheckSquareIcon, SchoolIcon, ClipboardIcon, TrophyIcon, PlusIcon, CalendarIcon, ClockIcon, FlagIcon, UsersIcon } from 'lucide-react';
import { useAmbassadorKPIs, useAmbassadorTasks, useAmbassadorSchools } from '../../../hooks/useDashboardData';
import { getAmbassadorImpactMetrics, getResources } from '../../../api/ambassador';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../utils/supabase';

export const AmbassadorDashboard = () => {
  const { user, loading: authLoading } = useAuth();

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const { data: kpiData, loading: kpisLoading, error: kpisError } = useAmbassadorKPIs(user.id);
  const { data: taskData, loading: tasksLoading, error: tasksError } = useAmbassadorTasks(user.id);
  const { data: schoolData, loading: schoolsLoading, error: schoolsError } = useAmbassadorSchools(user.id);

  const [impactMetrics, setImpactMetrics] = useState<{ totalStudents: number; schoolCount: number; partnershipCount: number } | null>(null);
  const [impactLoading, setImpactLoading] = useState(true);
  const [badges, setBadges] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [lastSignIn, setLastSignIn] = useState<string | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const welcomeMessages = [
    `Welcome back, ${user.full_name?.split(' ')[0] || 'Ambassador'}! Ready to make an impact?`,
    `Great job, ${user.full_name?.split(' ')[0] || 'Ambassador'}! Let's continue building the future of education.`,
    user.country_code ? `Hello from ${user.country_code}, ${user.full_name?.split(' ')[0] || 'Ambassador'}! Your work matters.` : `Hello, ${user.full_name?.split(' ')[0] || 'Ambassador'}! Your dedication inspires change.`,
    `Welcome, ${user.full_name?.split(' ')[0] || 'Ambassador'}! Every school visit creates ripples of change.`,
    `Hi ${user.full_name?.split(' ')[0] || 'Ambassador'}! Let's turn potential into progress today.`
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % welcomeMessages.length);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, [welcomeMessages.length]);

  useEffect(() => {
    const fetchImpactMetrics = async () => {
      try {
        setImpactLoading(true);
        const data = await getAmbassadorImpactMetrics(user.id);
        setImpactMetrics(data);
      } catch (error) {
        console.error('Error fetching impact metrics:', error);
      } finally {
        setImpactLoading(false);
      }
    };
    fetchImpactMetrics();
  }, [user.id]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await getResources(user.id);
        setResources(res || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    fetchResources();
  }, [user.id]);

  useEffect(() => {
    const fetchLastSignIn = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('last_activity')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error('Error fetching last sign-in:', error);
          return;
        }
        if (data?.last_activity) {
          setLastSignIn(new Date(data.last_activity).toLocaleString());
        }
      } catch (err) {
        console.error('Error fetching last sign-in:', err);
      }
    };
    fetchLastSignIn();
  }, [user.id]);

  // Show loading state
  if (kpisLoading || tasksLoading || schoolsLoading || impactLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (kpisError || tasksError || schoolsError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard data</p>
          <p className="text-sm text-gray-500">
            {kpisError || tasksError || schoolsError}
          </p>
        </div>
      </div>
    );
  }

  // Transform KPI data for display
  const displayKpiData = kpiData ? [{
    title: 'Leads Generated',
    value: kpiData.leadsGenerated.toString(),
    trend: 'up' as const, // Would calculate from historical data
    icon: <SchoolIcon size={20} />,
    color: 'bg-ash-teal'
  }, {
    title: 'Tasks Completed',
    value: kpiData.tasksCompleted.toString(),
    trend: 'up' as const, // Would calculate from historical data
    icon: <CheckSquareIcon size={20} />,
    color: 'bg-ash-gold'
  }, {
    title: 'Daily Streak',
    value: `${kpiData.dailyStreak || 0} days`,
    icon: <CalendarIcon size={20} />,
    color: 'bg-blue-400'
  }, {
    title: 'Impact Score',
    value: `${kpiData.impactScore}/100`,
    trend: 'up' as const, // Would calculate from historical data
    icon: <TrophyIcon size={20} />,
    color: 'bg-green-400'
  }] : [];

  // Prepare impact chart data
  const impactChartData = impactMetrics
    ? {
        labels: ['Students Reached', 'Schools', 'Partnerships'],
        datasets: [
          {
            label: 'Impact',
            data: [impactMetrics.totalStudents, impactMetrics.schoolCount, impactMetrics.partnershipCount],
            backgroundColor: ['#34D399', '#60A5FA', '#FBBF24']
          }
        ]
      }
    : null;

  // Transform task data for display
  const displayTaskData = taskData ? taskData.map(task => ({
    id: task.id,
    priority: task.priority,
    title: task.title,
    school: task.school_name || 'No School',
    progress: task.progress,
    dueDate: new Date(task.due_date).toLocaleDateString(),
    status: task.status
  })) : [];

  // Transform school data for display
  const displaySchoolData = schoolData ? schoolData.map(school => ({
    id: school.id,
    name: school.name,
    location: school.location,
    status: school.status,
    leads: school.leads,
    lastVisit: school.last_visit
  })) : [];



  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Ambassador Dashboard
        </h1>
        <p className="text-sm text-gray-500 transition-opacity duration-500 ease-in-out">
          {welcomeMessages[currentMessageIndex]}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayKpiData.map((kpi, index) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Impact Summary */}
      {impactMetrics && (
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Impact Overview</h2>
            <Link
              to="/dashboard/ambassador/impact"
              className="text-sm font-medium text-ash-teal hover:text-ash-teal/80"
            >
              View Full Impact →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center">
                <UsersIcon size={20} className="text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Students Reached</p>
                  <p className="text-2xl font-bold text-gray-900">{impactMetrics.totalStudents}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center">
                <SchoolIcon size={20} className="text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Schools Engaged</p>
                  <p className="text-2xl font-bold text-gray-900">{impactMetrics.schoolCount}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center">
                <TrophyIcon size={20} className="text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Partnerships</p>
                  <p className="text-2xl font-bold text-gray-900">{impactMetrics.partnershipCount}</p>
                </div>
              </div>
            </div>
          </div>
          {impactChartData && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <BarChart title="Impact Breakdown" data={impactChartData} height={200} />
            </div>
          )}
        </div>
      )}

      {/* Quick Log Button */}
      <div className="mb-6 flex justify-end space-x-3">
        <Link
          to="/dashboard/ambassador/activity"
          className="flex items-center rounded-md bg-ash-teal px-4 py-2 font-medium text-white shadow-sm hover:bg-ash-teal/90"
        >
          <PlusIcon size={18} className="mr-2" />
          Log Activity
        </Link>
        <Link
          to="/dashboard/ambassador/schools"
          className="flex items-center rounded-md bg-ash-gold px-4 py-2 font-medium text-ash-dark shadow-sm hover:bg-yellow-400"
        >
          <SchoolIcon size={18} className="mr-2" />
          Add School Visit
        </Link>
      </div>

      {/* Tasks */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
          <div className="flex space-x-2">
            <Link
              to="/dashboard/ambassador/tasks"
              className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ClockIcon size={16} className="mr-1" />
              Due Soon
            </Link>
            <Link
              to="/dashboard/ambassador/tasks"
              className="flex items-center rounded-md bg-ash-teal px-3 py-1.5 text-sm font-medium text-white hover:bg-ash-teal/90"
            >
              <PlusIcon size={16} className="mr-1" />
              Manage Tasks
            </Link>
          </div>
        </div>
        {displayTaskData.length > 0 ? (
          <DataTable
            columns={taskColumns}
            data={displayTaskData.slice(0, 5)} // Show top 5 recent tasks
            keyField="id"
            pagination={false}
          />
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <CheckSquareIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-sm text-gray-500 mb-4">Get started by adding your first task.</p>
            <Link
              to="/dashboard/ambassador/tasks"
              className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
            >
              Add Task
            </Link>
          </div>
        )}
      </div>

      {/* Schools */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Schools</h2>
          <Link
            to="/dashboard/ambassador/schools"
            className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FlagIcon size={16} className="mr-1" />
            View All Schools
          </Link>
        </div>
        {displaySchoolData.length > 0 ? (
          <DataTable
            columns={schoolColumns}
            data={displaySchoolData.slice(0, 5)} // Show top 5 recent schools
            keyField="id"
            rowsPerPage={5}
          />
        ) : (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <SchoolIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools yet</h3>
            <p className="text-sm text-gray-500 mb-4">Start building your school pipeline.</p>
            <Link
              to="/dashboard/ambassador/schools"
              className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
            >
              Add School
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Badges */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-base font-medium text-gray-700">
            My Achievements
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {badges.map(badge => (
              <div key={badge.id} className={`flex flex-col items-center rounded-lg p-3 text-center ${badge.unlocked ? 'bg-ash-gold/10' : 'bg-gray-100'}`}>
                <div className="text-3xl">{badge.icon}</div>
                <h4 className="mt-2 text-sm font-medium text-gray-900">
                  {badge.name}
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  {badge.description}
                </p>
                {!badge.unlocked && (
                  <span className="mt-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                    Locked
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-base font-medium text-gray-700">
            Quick Resources
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {resources.map(resource => (
              <div key={resource.id} className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-ash-teal/10 text-xl text-ash-teal">
                  {resource.icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {resource.title}
                  </h4>
                  <p className="text-xs text-gray-500">{resource.type}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-md border border-ash-teal px-3 py-1.5 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            View All Resources
          </button>
        </div>
      </div>
    </div>
  );
};

// Task columns configuration
const taskColumns = [{
  header: 'Priority',
  accessor: (row: any) => (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
      row.priority === 'High' ? 'bg-red-100 text-red-800' :
      row.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
      'bg-green-100 text-green-800'
    }`}>
      {row.priority}
    </span>
  )
}, {
  header: 'Task',
  accessor: 'title'
}, {
  header: 'School',
  accessor: 'school'
}, {
  header: 'Progress',
  accessor: (row: any) => (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{row.progress}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
        <div className="h-1.5 rounded-full bg-ash-teal" style={{
          width: `${row.progress}%`
        }}></div>
      </div>
    </div>
  )
}, {
  header: 'Due Date',
  accessor: 'dueDate'
}, {
  header: 'Status',
  accessor: (row: any) => (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
      row.status === 'Completed' ? 'bg-green-100 text-green-800' :
      row.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
      'bg-gray-100 text-gray-800'
    }`}>
      {row.status}
    </span>
  )
}];

// School columns configuration
const schoolColumns = [{
  header: 'School Name',
  accessor: 'name'
}, {
  header: 'Location',
  accessor: 'location'
}, {
  header: 'Status',
  accessor: (row: any) => (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
      row.status === 'Partnered' ? 'bg-green-100 text-green-800' :
      row.status === 'Prospect' ? 'bg-blue-100 text-blue-800' :
      row.status === 'Visited' ? 'bg-yellow-100 text-yellow-800' :
      'bg-gray-100 text-gray-800'
    }`}>
      {row.status}
    </span>
  )
}, {
  header: 'Leads',
  accessor: 'leads',
  sortable: true
}, {
  header: 'Last Visit',
  accessor: 'lastVisit'
}, {
  header: 'Actions',
  accessor: (row: any) => (
    <button className="rounded-md bg-ash-teal p-1 text-white hover:bg-ash-teal/90">
      <ClipboardIcon size={16} />
    </button>
  )
}];
