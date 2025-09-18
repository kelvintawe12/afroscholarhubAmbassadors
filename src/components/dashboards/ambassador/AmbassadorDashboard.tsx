import React from 'react';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { DataTable } from '../../ui/widgets/DataTable';
import { CheckSquareIcon, SchoolIcon, ClipboardIcon, TrophyIcon, PlusIcon, CalendarIcon, ClockIcon, FlagIcon } from 'lucide-react';
export const AmbassadorDashboard = () => {
  // Mock data for KPI cards
  const kpiData = [{
    title: 'Leads Generated',
    value: '150',
    change: 12,
    icon: <SchoolIcon size={20} />,
    color: 'bg-ash-teal'
  }, {
    title: 'Tasks Completed',
    value: '28',
    change: 5,
    icon: <CheckSquareIcon size={20} />,
    color: 'bg-ash-gold'
  }, {
    title: 'Daily Streak',
    value: '7 days',
    icon: <CalendarIcon size={20} />,
    color: 'bg-blue-400'
  }, {
    title: 'Impact Score',
    value: '92/100',
    change: 8,
    icon: <TrophyIcon size={20} />,
    color: 'bg-green-400'
  }];
  // Mock data for tasks
  const taskColumns = [{
    header: 'Priority',
    accessor: (row: any) => <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${row.priority === 'High' ? 'bg-red-100 text-red-800' : row.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
          {row.priority}
        </span>
  }, {
    header: 'Task',
    accessor: 'title'
  }, {
    header: 'School',
    accessor: 'school'
  }, {
    header: 'Progress',
    accessor: (row: any) => <div className="w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{row.progress}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
            <div className="h-1.5 rounded-full bg-ash-teal" style={{
          width: `${row.progress}%`
        }}></div>
          </div>
        </div>
  }, {
    header: 'Due Date',
    accessor: 'dueDate'
  }, {
    header: 'Status',
    accessor: (row: any) => <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${row.status === 'Completed' ? 'bg-green-100 text-green-800' : row.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.status}
        </span>
  }];
  const taskData = [{
    id: 1,
    priority: 'High',
    title: 'Pitch to XYZ High School',
    school: 'XYZ High School',
    progress: 25,
    dueDate: 'Tomorrow',
    status: 'In Progress'
  }, {
    id: 2,
    priority: 'Medium',
    title: 'Follow up with ABC Academy',
    school: 'ABC Academy',
    progress: 50,
    dueDate: 'Next week',
    status: 'In Progress'
  }, {
    id: 3,
    priority: 'Low',
    title: 'Submit visit report',
    school: 'Lagos Model School',
    progress: 100,
    dueDate: 'Yesterday',
    status: 'Completed'
  }];
  // Mock data for schools
  const schoolColumns = [{
    header: 'School Name',
    accessor: 'name'
  }, {
    header: 'Location',
    accessor: 'location'
  }, {
    header: 'Status',
    accessor: (row: any) => <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${row.status === 'Partnered' ? 'bg-green-100 text-green-800' : row.status === 'Prospect' ? 'bg-blue-100 text-blue-800' : row.status === 'Visited' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.status}
        </span>
  }, {
    header: 'Leads',
    accessor: 'leads',
    sortable: true
  }, {
    header: 'Last Visit',
    accessor: 'lastVisit'
  }, {
    header: 'Actions',
    accessor: (row: any) => <button className="rounded-md bg-ash-teal p-1 text-white hover:bg-ash-teal/90">
          <ClipboardIcon size={16} />
        </button>
  }];
  const schoolData = [{
    id: 1,
    name: 'Lagos Model School',
    location: 'Lagos, Nigeria',
    status: 'Partnered',
    leads: 45,
    lastVisit: '1 week ago'
  }, {
    id: 2,
    name: 'ABC Academy',
    location: 'Abuja, Nigeria',
    status: 'Visited',
    leads: 30,
    lastVisit: '2 days ago'
  }, {
    id: 3,
    name: 'XYZ High School',
    location: 'Lagos, Nigeria',
    status: 'Prospect',
    leads: 0,
    lastVisit: 'Never'
  }, {
    id: 4,
    name: 'Unity College',
    location: 'Ibadan, Nigeria',
    status: 'Partnered',
    leads: 75,
    lastVisit: '1 month ago'
  }];
  // Mock data for badges
  const badges = [{
    id: 1,
    name: 'School Closer',
    description: '5 Partnerships',
    icon: '🏆',
    unlocked: true
  }, {
    id: 2,
    name: 'Lead Generator',
    description: '100+ Leads',
    icon: '🚀',
    unlocked: true
  }, {
    id: 3,
    name: 'Outreach Hero',
    description: 'Consistent Activity',
    icon: '⭐',
    unlocked: true
  }, {
    id: 4,
    name: 'Top Performer',
    description: 'Regional Recognition',
    icon: '🥇',
    unlocked: false
  }];
  // Mock data for resources
  const resources = [{
    id: 1,
    title: 'Partnership Pitch Deck',
    type: 'PDF',
    icon: '📊'
  }, {
    id: 2,
    title: 'Branded Flyer Template',
    type: 'DOCX',
    icon: '📄'
  }, {
    id: 3,
    title: '5-min Essay Workshop',
    type: 'VIDEO',
    icon: '🎥'
  }, {
    id: 4,
    title: 'Scholarship Application Guide',
    type: 'PDF',
    icon: '📚'
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Ambassador Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Great job, John! Your last visit generated 20 sign-ups. 🎉
        </p>
        {kpiData.map((kpi, index) => <KpiCard key={index} title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} />)}
      </div>
      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => <KpiCard key={index} title={kpi.title} value={kpi.value} icon={kpi.icon} color={kpi.color} />)}
      </div>
      {/* Quick Log Button */}
      <div className="mb-6 flex justify-end">
        <button className="flex items-center rounded-md bg-ash-gold px-4 py-2 font-medium text-ash-dark shadow-sm hover:bg-yellow-400">
          <PlusIcon size={18} className="mr-2" />
          Quick Log Activity
        </button>
      </div>
      {/* Tasks */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">My Tasks</h2>
          <div className="flex space-x-2">
            <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ClockIcon size={16} className="mr-1" />
              Due Soon
            </button>
            <button className="flex items-center rounded-md bg-ash-teal px-3 py-1.5 text-sm font-medium text-white hover:bg-ash-teal/90">
              <PlusIcon size={16} className="mr-1" />
              Add Task
            </button>
          </div>
        </div>
        <DataTable columns={taskColumns} data={taskData} keyField="id" pagination={false} />
      </div>
      {/* Schools */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">My Schools</h2>
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FlagIcon size={16} className="mr-1" />
            View All
          </button>
        </div>
        <DataTable columns={schoolColumns} data={schoolData} keyField="id" rowsPerPage={4} />
      </div>
      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Badges */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-base font-medium text-gray-700">
            My Achievements
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {badges.map(badge => <div key={badge.id} className={`flex flex-col items-center rounded-lg p-3 text-center ${badge.unlocked ? 'bg-ash-gold/10' : 'bg-gray-100'}`}>
                <div className="text-3xl">{badge.icon}</div>
                <h4 className="mt-2 text-sm font-medium text-gray-900">
                  {badge.name}
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  {badge.description}
                </p>
                {!badge.unlocked && <span className="mt-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                    Locked
                  </span>}
              </div>)}
          </div>
        </div>
        {/* Resources */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-base font-medium text-gray-700">
            Quick Resources
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {resources.map(resource => <div key={resource.id} className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-ash-teal/10 text-xl text-ash-teal">
                  {resource.icon}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {resource.title}
                  </h4>
                  <p className="text-xs text-gray-500">{resource.type}</p>
                </div>
              </div>)}
          </div>
          <button className="mt-4 w-full rounded-md border border-ash-teal px-3 py-1.5 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            View All Resources
          </button>
        </div>
      </div>
    </div>;
};