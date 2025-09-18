import React from 'react';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { LineChart } from '../../ui/widgets/LineChart';
import { PieChart } from '../../ui/widgets/PieChart';
import { BarChart } from '../../ui/widgets/BarChart';
import { DataTable } from '../../ui/widgets/DataTable';
import { ActivityFeed } from '../../ui/widgets/ActivityFeed';
import { UsersIcon, SchoolIcon, TrendingUpIcon, PercentIcon, BellIcon, DownloadIcon, PlusIcon, FilterIcon } from 'lucide-react';
export const ManagementDashboard = () => {
  // Mock data for KPI cards
  const kpiData = [{
    title: 'Students Reached',
    value: '1,200',
    change: 15,
    icon: <UsersIcon size={20} />
  }, {
    title: 'Partnerships',
    value: '45',
    change: 8,
    icon: <SchoolIcon size={20} />
  }, {
    title: 'Active Ambassadors',
    value: '52',
    change: -3,
    icon: <UsersIcon size={20} />
  }, {
    title: 'Conversion Rate',
    value: '18%',
    change: 5,
    icon: <PercentIcon size={20} />
  }];
  // Mock data for charts
  const leadsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Leads Generated',
      data: [450, 520, 500, 700, 800, 1200],
      borderColor: '#1A5F7A',
      backgroundColor: 'rgba(26, 95, 122, 0.1)'
    }]
  };
  const countryDistributionData = {
    labels: ['Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Others'],
    datasets: [{
      data: [40, 25, 15, 12, 8],
      backgroundColor: ['rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(38, 162, 105, 0.8)', 'rgba(108, 92, 231, 0.8)', 'rgba(225, 112, 85, 0.8)']
    }]
  };
  const ambassadorPerformanceData = {
    labels: ['Aisha N.', 'John K.', 'Grace M.', 'Samuel O.', 'Elizabeth A.', 'David M.', 'Sarah J.', 'Michael O.', 'Faith N.', 'Daniel A.'],
    datasets: [{
      label: 'Leads Generated',
      data: [150, 120, 110, 95, 85, 80, 75, 70, 65, 60],
      backgroundColor: 'rgba(26, 95, 122, 0.8)'
    }]
  };
  // Mock data for school table
  const schoolColumns = [{
    header: 'School Name',
    accessor: 'name'
  }, {
    header: 'Country',
    accessor: 'country'
  }, {
    header: 'Status',
    accessor: (row: any) => <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${row.status === 'Partnered' ? 'bg-green-100 text-green-800' : row.status === 'Prospect' ? 'bg-blue-100 text-blue-800' : row.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.status}
        </span>
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
  const schoolData = [{
    id: 1,
    name: 'Lagos Model School',
    country: 'Nigeria',
    status: 'Partnered',
    leads: 120,
    assignedTo: 'Aisha N.',
    lastActivity: '2 days ago'
  }, {
    id: 2,
    name: 'Nairobi Academy',
    country: 'Kenya',
    status: 'Partnered',
    leads: 95,
    assignedTo: 'John K.',
    lastActivity: '1 week ago'
  }, {
    id: 3,
    name: 'Accra High School',
    country: 'Ghana',
    status: 'Contacted',
    leads: 45,
    assignedTo: 'Grace M.',
    lastActivity: '3 days ago'
  }, {
    id: 4,
    name: 'Cape Town Secondary',
    country: 'South Africa',
    status: 'Prospect',
    leads: 0,
    assignedTo: 'Samuel O.',
    lastActivity: 'Today'
  }, {
    id: 5,
    name: 'Abuja Grammar School',
    country: 'Nigeria',
    status: 'Partnered',
    leads: 75,
    assignedTo: 'Aisha N.',
    lastActivity: '5 days ago'
  }];
  // Mock data for activity feed
  const activities = [{
    id: 1,
    type: 'partnership',
    title: 'New Partnership: Lagos Model School',
    description: 'Aisha completed the partnership agreement with Lagos Model School',
    timestamp: '2 hours ago',
    user: {
      name: 'Aisha N.'
    }
  }, {
    id: 2,
    type: 'visit',
    title: 'School Visit: Nairobi Academy',
    description: 'John conducted a follow-up visit and collected 20 new leads',
    timestamp: 'Yesterday',
    user: {
      name: 'John K.'
    }
  }, {
    id: 3,
    type: 'task',
    title: 'Monthly Report Submitted',
    timestamp: '3 days ago',
    user: {
      name: 'Grace M.'
    },
    status: 'completed'
  }, {
    id: 4,
    type: 'note',
    title: 'Low Activity Alert: South Africa',
    description: 'Ambassador inactive for 14 days. Follow up required.',
    timestamp: '1 week ago',
    status: 'pending'
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Management Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome, COO! 🚀 Quick Win: Nigeria hit 100 partnerships—share on
          LinkedIn?
        </p>
      </div>
      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => <KpiCard key={index} title={kpi.title} value={kpi.value} change={kpi.change} icon={kpi.icon} />)}
      </div>
      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <LineChart title="Quarterly Lead Generation Trends" data={leadsChartData} className="lg:col-span-2" />
        <PieChart title="Country Distribution" data={countryDistributionData} />
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
        <DataTable columns={schoolColumns} data={schoolData} keyField="id" rowsPerPage={5} />
      </div>
      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BarChart title="Ambassador Performance Leaderboard" data={ambassadorPerformanceData} horizontal={true} className="lg:col-span-2" />
        <ActivityFeed title="Alerts & Recent Activity" activities={activities} maxItems={4} />
      </div>
    </div>;
};