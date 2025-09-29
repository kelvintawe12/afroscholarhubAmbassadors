import { useState, useEffect } from 'react';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { LineChart } from '../../ui/widgets/LineChart';
import { PieChart } from '../../ui/widgets/PieChart';
import { BarChart } from '../../ui/widgets/BarChart';
import { DataTable } from '../../ui/widgets/DataTable';
import { ActivityFeed } from '../../ui/widgets/ActivityFeed';
import { LoadingSpinner } from '../../LoadingSpinner';
import { UsersIcon, SchoolIcon, PercentIcon, DownloadIcon, PlusIcon, FilterIcon } from 'lucide-react';
import { useManagementKPIs, useAllSchools, useLeadGenerationTrends, useCountryDistribution, useAmbassadorPerformance, useRecentActivities } from '../../../hooks/useDashboardData';
import { useAuth } from '../../../contexts/AuthContext'; // Add this import

export const ManagementDashboard = () => {
  const { user } = useAuth(); // Get the current user
  const { data: kpiData, loading: kpisLoading, error: kpisError } = useManagementKPIs();
  const { data: schoolData, loading: schoolsLoading, error: schoolsError } = useAllSchools();
  const { data: leadsChartData, loading: leadsLoading } = useLeadGenerationTrends();
  const { data: countryDistributionData, loading: countryLoading } = useCountryDistribution();
  const { data: ambassadorPerformanceData, loading: performanceLoading } = useAmbassadorPerformance();
  const { data: activities, loading: activitiesLoading } = useRecentActivities(4);

  // Slideshow tips for admin
  const adminTips = [
    "View and analyze ambassador performance across all countries.",
    "Add, edit, or remove schools from the master sheet.",
    "Export school and partnership data for reporting.",
    "Monitor recent activities and alerts in real time.",
    "Use filters to find schools or ambassadors quickly.",
    "Download quarterly reports for management review."
  ];
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % adminTips.length);
    }, 5000); // Change tip every 5 seconds
    return () => clearInterval(interval);
  }, [adminTips.length]);

  // Show loading state
  if (kpisLoading || schoolsLoading || leadsLoading || countryLoading || performanceLoading || activitiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (kpisError || schoolsError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard data</p>
          <p className="text-sm text-gray-500">
            {kpisError || schoolsError}
          </p>
        </div>
      </div>
    );
  }

  // Transform KPI data for display
  const displayKpiData = kpiData ? [{
    title: 'Students Reached',
    value: kpiData.leadsGenerated?.toString() || '0',
    trend: 'up' as const,
    icon: <UsersIcon size={20} />,
    color: 'bg-ash-teal'
  }, {
    title: 'Partnerships',
    value: kpiData.partnerships?.toString() || '0',
    trend: 'up' as const,
    icon: <SchoolIcon size={20} />,
    color: 'bg-ash-gold'
  }, {
    title: 'Active Ambassadors',
    value: kpiData.activeAmbassadors?.toString() || '0',
    trend: 'up' as const,
    icon: <UsersIcon size={20} />,
    color: 'bg-blue-400'
  }, {
    title: 'Conversion Rate',
    value: `${kpiData.conversionRate || 0}%`,
    trend: 'up' as const,
    icon: <PercentIcon size={20} />,
    color: 'bg-green-400'
  }] : [];

  // Transform school data for display
  const displaySchoolData = schoolData ? schoolData.map(school => ({
    id: school.id,
    name: school.name,
    country: school.country_code,
    status: school.status,
    leads: school.leads,
    assignedTo: school.ambassador_name || 'Unassigned',
    lastActivity: school.last_visit
  })) : [];

  const safeLeadsData = leadsChartData as any || {
    labels: [],
    datasets: [{
      label: 'Leads Generated',
      data: [] as number[],
      borderColor: '#1A5F7A',
      backgroundColor: 'rgba(26, 95, 122, 0.1)'
    }]
  };

  const safeCountryData = countryDistributionData as any || {
    labels: [],
    datasets: [{
      data: [] as number[],
      backgroundColor: ['rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(38, 162, 105, 0.8)', 'rgba(108, 92, 231, 0.8)', 'rgba(225, 112, 85, 0.8)']
    }]
  };

  const safePerformanceData = ambassadorPerformanceData as any || {
    labels: [],
    datasets: [{
      label: 'Leads Generated',
      data: [] as number[],
      backgroundColor: 'rgba(26, 95, 122, 0.8)'
    }]
  };

  const safeActivities = activities as any || [];



  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Management Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome, {user?.full_name || user?.email || 'Admin'}!
        </p>
        {/* Admin tips slideshow */}
        <div className="mt-2 rounded bg-ash-teal/10 px-4 py-2 text-ash-teal transition-all duration-500 min-h-[32px]">
          <span className="font-medium">
            {adminTips[currentTip]}
          </span>
        </div>
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

      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <LineChart title="Quarterly Lead Generation Trends" data={safeLeadsData} />
        <PieChart title="Country Distribution" data={safeCountryData} />
      </div>

      {/* Schools Table */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Master School Sheet
          </h2>
          <div className="flex space-x-2">
            <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FilterIcon size={16} className="mr-1" />
              Filter
            </button>
            <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <DownloadIcon size={16} className="mr-1" />
              Export
            </button>
            <button className="flex items-center rounded-md bg-ash-teal px-3 py-1.5 text-sm font-medium text-white hover:bg-ash-teal/90">
              <PlusIcon size={16} className="mr-1" />
              Add School
            </button>
          </div>
        </div>
        <DataTable
          columns={schoolColumns}
          data={displaySchoolData}
          keyField="id"
          rowsPerPage={5}
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BarChart
          title="Ambassador Performance Leaderboard"
          data={safePerformanceData}
        />
        <ActivityFeed title="Alerts & Recent Activity" activities={safeActivities} maxItems={4} />
      </div>
    </div>
  );
};

// School columns configuration
const schoolColumns = [{
  header: 'School Name',
  accessor: 'name'
}, {
  header: 'Country',
  accessor: 'country'
}, {
  header: 'Status',
  accessor: (row: any) => (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
      row.status === 'partnered' ? 'bg-green-100 text-green-800' :
      row.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
      row.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
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
  header: 'Assigned To',
  accessor: 'assignedTo'
}, {
  header: 'Last Activity',
  accessor: 'lastActivity'
}];
