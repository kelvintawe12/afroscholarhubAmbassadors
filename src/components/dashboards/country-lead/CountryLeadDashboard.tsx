import React from 'react';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { PieChart } from '../../ui/widgets/PieChart';
import { DataTable } from '../../ui/widgets/DataTable';
import { ActivityFeed } from '../../ui/widgets/ActivityFeed';
import { UsersIcon, SchoolIcon, CalendarIcon, CheckCircleIcon, PlusIcon, MessageSquareIcon } from 'lucide-react';
export const CountryLeadDashboard = () => {
  // Mock data for KPI cards
  const kpiData = [{
    title: 'Team Members',
    value: '15',
    icon: <UsersIcon size={20} />
  }, {
    title: 'Schools Pipeline',
    value: '30',
    icon: <SchoolIcon size={20} />
  }, {
    title: 'Events This Month',
    value: '8',
    icon: <CalendarIcon size={20} />
  }, {
    title: 'Goal Progress',
    value: '75%',
    icon: <CheckCircleIcon size={20} />
  }];
  // Mock data for charts
  const impactMetricsData = {
    labels: ['Urban Schools', 'Rural Schools', 'Semi-Urban Schools'],
    datasets: [{
      data: [60, 25, 15],
      backgroundColor: ['rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(38, 162, 105, 0.8)']
    }]
  };
  // Mock data for ambassador table
  const ambassadorColumns = [{
    header: 'Name',
    accessor: (row: any) => <div className="flex items-center">
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-ash-teal/20 text-ash-teal">
            <div className="flex h-full w-full items-center justify-center">
              {row.name.charAt(0)}
            </div>
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
  }, {
    header: 'Status',
    accessor: (row: any) => <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${row.status === 'Active' ? 'bg-green-100 text-green-800' : row.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {row.status}
        </span>
  }, {
    header: 'Performance',
    accessor: (row: any) => <div className="w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{row.score}/100</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
            <div className={`h-1.5 rounded-full ${row.score >= 80 ? 'bg-green-500' : row.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
          width: `${row.score}%`
        }}></div>
          </div>
        </div>,
    sortable: true
  }, {
    header: 'Schools',
    accessor: 'schoolsCount',
    sortable: true
  }, {
    header: 'Recent Activity',
    accessor: 'lastActivity'
  }, {
    header: 'Actions',
    accessor: (row: any) => <div className="flex space-x-2">
          <button className="rounded-md bg-ash-teal p-1 text-white hover:bg-ash-teal/90">
            <MessageSquareIcon size={16} />
          </button>
          <button className="rounded-md bg-ash-gold p-1 text-ash-dark hover:bg-ash-gold/90">
            <PlusIcon size={16} />
          </button>
        </div>
  }];
  const ambassadorData = [{
    id: 1,
    name: 'Jamal Ibrahim',
    email: 'jamal@afroscholarhub.org',
    status: 'Active',
    score: 88,
    schoolsCount: 5,
    lastActivity: '2 hours ago'
  }, {
    id: 2,
    name: 'Amina Yusuf',
    email: 'amina@afroscholarhub.org',
    status: 'Active',
    score: 92,
    schoolsCount: 7,
    lastActivity: 'Yesterday'
  }, {
    id: 3,
    name: 'Kwame Osei',
    email: 'kwame@afroscholarhub.org',
    status: 'Training',
    score: 65,
    schoolsCount: 2,
    lastActivity: '3 days ago'
  }, {
    id: 4,
    name: 'Fatima Mohammed',
    email: 'fatima@afroscholarhub.org',
    status: 'Active',
    score: 75,
    schoolsCount: 4,
    lastActivity: 'Today'
  }, {
    id: 5,
    name: 'Chidi Okonkwo',
    email: 'chidi@afroscholarhub.org',
    status: 'Inactive',
    score: 45,
    schoolsCount: 3,
    lastActivity: '2 weeks ago'
  }];
  // Mock data for activity feed
  const activities = [{
    id: 1,
    type: 'visit',
    title: 'School Visit: Lagos Model School',
    description: 'Jamal conducted a visit and generated 40 leads',
    timestamp: '2 hours ago',
    user: {
      name: 'Jamal Ibrahim'
    }
  }, {
    id: 2,
    type: 'partnership',
    title: 'New Partnership: Abuja Grammar School',
    description: 'Amina finalized partnership agreement',
    timestamp: 'Yesterday',
    user: {
      name: 'Amina Yusuf'
    }
  }, {
    id: 3,
    type: 'task',
    title: 'Training Session Completed',
    description: 'Kwame completed the required training modules',
    timestamp: '3 days ago',
    user: {
      name: 'Kwame Osei'
    },
    status: 'completed'
  }, {
    id: 4,
    type: 'note',
    title: 'Resource Request: Flyers for Lagos Tour',
    description: 'Fatima requested marketing materials',
    timestamp: '1 week ago',
    user: {
      name: 'Fatima Mohammed'
    },
    status: 'pending'
  }];
  // School pipeline data
  const pipelineStages = [{
    name: 'Prospect',
    count: 12
  }, {
    name: 'Contacted',
    count: 10
  }, {
    name: 'Visited',
    count: 5
  }, {
    name: 'Partnered',
    count: 3
  }, {
    name: 'Inactive',
    count: 0
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nigeria Operations</h1>
        <p className="text-sm text-gray-500">
          Aisha, your Nigeria team is crushing it—75% goal met!
        </p>
      </div>
      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => <KpiCard key={index} title={kpi.title} value={kpi.value} icon={kpi.icon} />)}
      </div>
      {/* Team Roster */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Team Roster</h2>
          <button className="flex items-center rounded-md bg-ash-teal px-3 py-1.5 text-sm font-medium text-white hover:bg-ash-teal/90">
            <PlusIcon size={16} className="mr-1" />
            Add Ambassador
          </button>
        </div>
        <DataTable columns={ambassadorColumns} data={ambassadorData} keyField="id" rowsPerPage={5} />
      </div>
      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* School Pipeline */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-base font-medium text-gray-700">
            School Pipeline
          </h3>
          <div className="space-y-4">
            {pipelineStages.map(stage => <div key={stage.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {stage.name}
                  </span>
                  <span className="text-sm text-gray-500">{stage.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-ash-teal" style={{
                width: `${stage.count / 30 * 100}%`
              }}></div>
                </div>
              </div>)}
          </div>
          <button className="mt-4 w-full rounded-md border border-ash-teal px-3 py-1.5 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            View Full Pipeline
          </button>
        </div>
        <PieChart title="Leads by School Type" data={impactMetricsData} />
        <ActivityFeed title="Recent Activity" activities={activities} maxItems={4} />
      </div>
    </div>;
};