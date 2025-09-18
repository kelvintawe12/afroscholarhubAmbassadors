import React from 'react';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { DataTable } from '../../ui/widgets/DataTable';
import { BarChart } from '../../ui/widgets/BarChart';
import { InboxIcon, CheckIcon, XIcon, FolderIcon, FilterIcon, ThumbsUpIcon, ThumbsDownIcon, EditIcon } from 'lucide-react';
export const SupportDashboard = () => {
  // Mock data for KPI cards
  const kpiData = [{
    title: 'Pending Items',
    value: '8',
    icon: <InboxIcon size={20} />
  }, {
    title: 'Processed Today',
    value: '15',
    change: 20,
    icon: <CheckIcon size={20} />
  }, {
    title: 'Resources',
    value: '124',
    icon: <FolderIcon size={20} />
  }, {
    title: 'Response Rate',
    value: '98%',
    change: 3,
    icon: <div size={20} />
  }];
  // Mock data for workflow queue
  const queueColumns = [{
    header: 'Item',
    accessor: (row: any) => <div className="flex items-center">
          {row.thumbnail ? <div className="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
              <img src={row.thumbnail} alt={row.title} className="h-full w-full object-cover" />
            </div> : <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gray-100">
              <FolderIcon size={16} className="text-gray-500" />
            </div>}
          <div>
            <div className="font-medium text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-500">{row.submitter}</div>
          </div>
        </div>
  }, {
    header: 'Type',
    accessor: (row: any) => <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${row.type === 'Photo' ? 'bg-blue-100 text-blue-800' : row.type === 'Document' ? 'bg-purple-100 text-purple-800' : row.type === 'Post' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.type}
        </span>
  }, {
    header: 'Priority',
    accessor: (row: any) => <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${row.priority === 'High' ? 'bg-red-100 text-red-800' : row.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
          {row.priority}
        </span>
  }, {
    header: 'Submitted',
    accessor: 'submitted'
  }, {
    header: 'Actions',
    accessor: (row: any) => <div className="flex space-x-2">
          <button className="rounded-md bg-green-500 p-1 text-white hover:bg-green-600">
            <CheckIcon size={16} />
          </button>
          <button className="rounded-md bg-red-500 p-1 text-white hover:bg-red-600">
            <XIcon size={16} />
          </button>
          <button className="rounded-md bg-ash-teal p-1 text-white hover:bg-ash-teal/90">
            <EditIcon size={16} />
          </button>
        </div>
  }];
  const queueData = [{
    id: 1,
    title: 'School Visit Photo',
    submitter: 'Jamal Ibrahim',
    type: 'Photo',
    priority: 'Medium',
    submitted: '2 hours ago',
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  }, {
    id: 2,
    title: 'Partnership Agreement',
    submitter: 'Aisha Mohammed',
    type: 'Document',
    priority: 'High',
    submitted: 'Yesterday'
  }, {
    id: 3,
    title: 'Success Story Post',
    submitter: 'John Kimani',
    type: 'Post',
    priority: 'Low',
    submitted: '3 days ago'
  }, {
    id: 4,
    title: 'Event Photos',
    submitter: 'Grace Mensah',
    type: 'Photo',
    priority: 'Medium',
    submitted: '1 week ago',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  }];
  // Mock data for audit log
  const auditColumns = [{
    header: 'User',
    accessor: (row: any) => <div className="flex items-center">
          <div className="h-6 w-6 flex-shrink-0 rounded-full bg-ash-teal/20 text-ash-teal">
            <div className="flex h-full w-full items-center justify-center text-xs">
              {row.user.charAt(0)}
            </div>
          </div>
          <span className="ml-2 text-sm font-medium">{row.user}</span>
        </div>
  }, {
    header: 'Action',
    accessor: 'action'
  }, {
    header: 'Item',
    accessor: 'item'
  }, {
    header: 'Timestamp',
    accessor: 'timestamp'
  }, {
    header: 'IP Address',
    accessor: 'ip'
  }, {
    header: 'View',
    accessor: (row: any) => <button className="text-xs font-medium text-ash-teal hover:text-ash-teal/80">
          View Changes
        </button>
  }];
  const auditData = [{
    id: 1,
    user: 'Aisha Mohammed',
    action: 'Updated school status',
    item: 'Lagos Model School',
    timestamp: 'Today 10:45',
    ip: '102.89.22.45'
  }, {
    id: 2,
    user: 'John Kimani',
    action: 'Logged in',
    item: 'Account',
    timestamp: 'Today 09:30',
    ip: '41.90.192.78'
  }, {
    id: 3,
    user: 'Jamal Ibrahim',
    action: 'Uploaded photo',
    item: 'School Visit',
    timestamp: 'Yesterday 15:20',
    ip: '102.89.22.46'
  }, {
    id: 4,
    user: 'Grace Mensah',
    action: 'Created event',
    item: 'Workshop',
    timestamp: '2 days ago',
    ip: '154.160.1.23'
  }, {
    id: 5,
    user: 'Samuel Okafor',
    action: 'Approved document',
    item: 'Partnership Agreement',
    timestamp: '3 days ago',
    ip: '105.112.24.56'
  }];
  // Mock data for charts
  const uploadsChartData = {
    labels: ['Photos', 'Documents', 'Posts', 'Videos', 'Others'],
    datasets: [{
      label: 'Uploads by Type',
      data: [45, 32, 18, 7, 5],
      backgroundColor: ['rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(38, 162, 105, 0.8)', 'rgba(108, 92, 231, 0.8)', 'rgba(225, 112, 85, 0.8)']
    }]
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Support Operations</h1>
        <p className="text-sm text-gray-500">
          8 Items in Queue—Start Approving!
        </p>
      </div>
      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => <KpiCard key={index} title={kpi.title} value={kpi.value} change={kpi.change} icon={kpi.icon} />)}
      </div>
      {/* Workflow Queue */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Workflow Queue</h2>
          <div className="flex space-x-2">
            <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FilterIcon size={16} className="mr-1" />
              Filter
            </button>
            <button className="flex items-center rounded-md bg-ash-teal px-3 py-1.5 text-sm font-medium text-white hover:bg-ash-teal/90">
              <div size={16} className="mr-1" />
              Refresh
            </button>
          </div>
        </div>
        <DataTable columns={queueColumns} data={queueData} keyField="id" rowsPerPage={4} />
      </div>
      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BarChart title="Uploads by Type" data={uploadsChartData} className="lg:col-span-1" />
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Audit Log</h2>
            <button className="text-sm font-medium text-ash-teal hover:text-ash-teal/80">
              View Full Log
            </button>
          </div>
          <DataTable columns={auditColumns} data={auditData} keyField="id" rowsPerPage={5} />
        </div>
      </div>
    </div>;
};