import React, { useState } from 'react';
import { BookOpenIcon, CalendarIcon, CheckCircleIcon, ClockIcon, DownloadIcon, FilterIcon, PlayIcon, PlusIcon, SearchIcon, UsersIcon, XIcon, FileTextIcon, BarChart3Icon, UserIcon } from 'lucide-react';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { DataTable } from '../../../ui/widgets/DataTable';
import { PieChart } from '../../../ui/widgets/PieChart';
import { BarChart } from '../../../ui/widgets/BarChart';
export const AmbassadorTrainingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  // Mock data for KPI cards
  const trainingMetrics = [{
    title: 'Completion Rate',
    value: '78%',
    change: 5,
    icon: <CheckCircleIcon size={20} />
  }, {
    title: 'Active Modules',
    value: '12',
    change: 2,
    icon: <BookOpenIcon size={20} />
  }, {
    title: 'Ambassadors in Training',
    value: '24',
    change: -3,
    icon: <UsersIcon size={20} />
  }, {
    title: 'Avg. Completion Time',
    value: '3.2 days',
    change: -1,
    subtitle: 'per module',
    icon: <ClockIcon size={20} />
  }];
  // Mock data for training modules
  const trainingModules = [{
    id: 1,
    title: 'Onboarding Essentials',
    description: 'Introduction to AfroScholarHub and ambassador responsibilities',
    type: 'Required',
    format: 'Video',
    duration: '45 min',
    completionRate: 92,
    lastUpdated: '2 weeks ago'
  }, {
    id: 2,
    title: 'School Partnership Development',
    description: 'How to approach schools and build lasting partnerships',
    type: 'Required',
    format: 'Interactive',
    duration: '1.5 hours',
    completionRate: 85,
    lastUpdated: '1 month ago'
  }, {
    id: 3,
    title: 'Student Engagement Strategies',
    description: 'Best practices for engaging with students and creating impact',
    type: 'Required',
    format: 'Video + Quiz',
    duration: '1 hour',
    completionRate: 78,
    lastUpdated: '3 weeks ago'
  }, {
    id: 4,
    title: 'Data Collection & Reporting',
    description: 'How to collect, organize, and report impact data',
    type: 'Required',
    format: 'Interactive',
    duration: '1 hour',
    completionRate: 65,
    lastUpdated: '1 month ago'
  }, {
    id: 5,
    title: 'Advanced Presentation Skills',
    description: 'Techniques for effective school presentations',
    type: 'Optional',
    format: 'Video',
    duration: '50 min',
    completionRate: 45,
    lastUpdated: '2 months ago'
  }, {
    id: 6,
    title: 'Event Management',
    description: 'Planning and executing successful school events',
    type: 'Optional',
    format: 'Document + Quiz',
    duration: '1.5 hours',
    completionRate: 38,
    lastUpdated: '3 months ago'
  }];
  // Mock data for ambassador training progress
  const ambassadorProgress = [{
    id: 1,
    name: 'Aisha Mohammed',
    email: 'aisha@afroscholarhub.org',
    country: 'Nigeria',
    completedModules: 12,
    totalModules: 12,
    progress: 100,
    status: 'Completed',
    lastActivity: '3 days ago',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  }, {
    id: 2,
    name: 'John Kamau',
    email: 'john@afroscholarhub.org',
    country: 'Kenya',
    completedModules: 10,
    totalModules: 12,
    progress: 83,
    status: 'In Progress',
    lastActivity: '1 day ago',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  }, {
    id: 3,
    name: 'Grace Osei',
    email: 'grace@afroscholarhub.org',
    country: 'Ghana',
    completedModules: 8,
    totalModules: 12,
    progress: 67,
    status: 'In Progress',
    lastActivity: 'Yesterday',
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
  }, {
    id: 4,
    name: 'Samuel Dlamini',
    email: 'samuel@afroscholarhub.org',
    country: 'South Africa',
    completedModules: 5,
    totalModules: 12,
    progress: 42,
    status: 'Behind',
    lastActivity: '1 week ago',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
  }, {
    id: 5,
    name: 'Fatima Abdullahi',
    email: 'fatima@afroscholarhub.org',
    country: 'Nigeria',
    completedModules: 12,
    totalModules: 12,
    progress: 100,
    status: 'Completed',
    lastActivity: '5 days ago',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
  }];
  // Filter ambassadors based on search query and status
  const filteredAmbassadors = ambassadorProgress.filter(ambassador => {
    const matchesSearch = searchQuery === '' || ambassador.name.toLowerCase().includes(searchQuery.toLowerCase()) || ambassador.email.toLowerCase().includes(searchQuery.toLowerCase()) || ambassador.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ambassador.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  // Module completion by country data for chart
  const moduleCompletionByCountryData = {
    labels: ['Nigeria', 'Kenya', 'Ghana', 'South Africa'],
    datasets: [{
      label: 'Completion Rate (%)',
      data: [92, 85, 78, 65],
      backgroundColor: 'rgba(26, 95, 122, 0.8)'
    }]
  };
  // Module completion status data for pie chart
  const completionStatusData = {
    labels: ['Completed', 'In Progress', 'Behind', 'Not Started'],
    datasets: [{
      data: [40, 35, 15, 10],
      backgroundColor: ['rgba(38, 162, 105, 0.8)', 'rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(225, 112, 85, 0.8)']
    }]
  };
  // Columns for training modules table
  const moduleColumns = [{
    header: 'Module',
    accessor: (row: any) => <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-xs text-gray-500">{row.description}</div>
        </div>
  }, {
    header: 'Type',
    accessor: (row: any) => <span className={`rounded-full px-2 py-1 text-xs font-medium ${row.type === 'Required' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.type}
        </span>
  }, {
    header: 'Format',
    accessor: 'format'
  }, {
    header: 'Duration',
    accessor: 'duration'
  }, {
    header: 'Completion Rate',
    accessor: (row: any) => <div className="w-full max-w-[150px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{row.completionRate}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
            <div className={`h-1.5 rounded-full ${row.completionRate >= 80 ? 'bg-green-500' : row.completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
          width: `${row.completionRate}%`
        }}></div>
          </div>
        </div>
  }, {
    header: 'Last Updated',
    accessor: 'lastUpdated'
  }, {
    header: 'Actions',
    accessor: (row: any) => <div className="flex space-x-2">
          <button onClick={() => setSelectedModule(row)} className="rounded-md bg-ash-teal p-1.5 text-white hover:bg-ash-teal/90" title="View Module">
            <PlayIcon size={14} />
          </button>
          <button className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200" title="Download">
            <DownloadIcon size={14} />
          </button>
        </div>
  }];
  // Columns for ambassador progress table
  const ambassadorColumns = [{
    header: 'Ambassador',
    accessor: (row: any) => <div className="flex items-center">
          <img src={row.avatar} alt={row.name} className="h-8 w-8 rounded-full object-cover" />
          <div className="ml-3">
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
  }, {
    header: 'Country',
    accessor: 'country'
  }, {
    header: 'Progress',
    accessor: (row: any) => <div className="w-full max-w-[150px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">
              {row.completedModules}/{row.totalModules} modules
            </span>
            <span className="text-xs font-medium">{row.progress}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
            <div className={`h-1.5 rounded-full ${row.progress === 100 ? 'bg-green-500' : row.progress >= 60 ? 'bg-ash-teal' : 'bg-yellow-500'}`} style={{
          width: `${row.progress}%`
        }}></div>
          </div>
        </div>
  }, {
    header: 'Status',
    accessor: (row: any) => <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === 'Completed' ? 'bg-green-100 text-green-800' : row.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {row.status === 'Completed' && <CheckCircleIcon size={12} className="mr-1" />}
          {row.status === 'In Progress' && <ClockIcon size={12} className="mr-1" />}
          {row.status === 'Behind' && <ClockIcon size={12} className="mr-1" />}
          {row.status}
        </span>
  }, {
    header: 'Last Activity',
    accessor: 'lastActivity'
  }, {
    header: 'Actions',
    accessor: (row: any) => <div className="flex space-x-2">
          <button className="rounded-md bg-ash-teal p-1.5 text-white hover:bg-ash-teal/90" title="View Progress">
            <BarChart3Icon size={14} />
          </button>
          <button className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200" title="Send Reminder">
            <CalendarIcon size={14} />
          </button>
        </div>
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Ambassador Training
        </h1>
        <p className="text-sm text-gray-500">
          Manage training modules, track ambassador progress, and schedule
          training sessions
        </p>
      </div>

      {/* Training metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trainingMetrics.map((metric, index) => <KpiCard key={index} title={metric.title} value={metric.value} change={metric.change} subtitle={metric.subtitle} icon={metric.icon} />)}
      </div>

      {/* Training modules section */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Training Modules
          </h2>
          <div className="flex items-center space-x-2">
            <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {}}>
              <FilterIcon size={16} className="mr-2" />
              Filter
            </button>
            <button className="flex items-center rounded-md bg-ash-teal px-3 py-1.5 text-sm font-medium text-white hover:bg-ash-teal/90" onClick={() => setShowAddModal(true)}>
              <PlusIcon size={16} className="mr-2" />
              Add Module
            </button>
          </div>
        </div>
        <DataTable columns={moduleColumns} data={trainingModules} keyField="id" rowsPerPage={6} />
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChart title="Module Completion by Country" data={moduleCompletionByCountryData} height={300} />
        <PieChart title="Ambassador Training Status" data={completionStatusData} height={300} />
      </div>

      {/* Ambassador progress section */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Ambassador Training Progress
          </h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon size={16} className="text-gray-400" />
              </div>
              <input type="search" placeholder="Search ambassadors..." className="w-64 rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Behind">Behind</option>
            </select>
          </div>
        </div>
        <DataTable columns={ambassadorColumns} data={filteredAmbassadors} keyField="id" rowsPerPage={5} showSearch={false} />
      </div>

      {/* Upcoming training sessions */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-base font-medium text-gray-700">
          Upcoming Training Sessions
        </h3>
        <div className="space-y-4">
          <div className="flex items-start rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ash-teal text-white">
              <CalendarIcon size={20} />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  New Ambassador Onboarding
                </h4>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                  Virtual
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Introduction to AfroScholarHub platform and ambassador
                responsibilities
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <CalendarIcon size={12} className="mr-1" />
                    June 15, 2025
                  </span>
                  <span className="flex items-center">
                    <ClockIcon size={12} className="mr-1" />
                    10:00 AM - 12:00 PM
                  </span>
                  <span className="flex items-center">
                    <UsersIcon size={12} className="mr-1" />
                    12 Registered
                  </span>
                </div>
                <button className="rounded-md border border-ash-teal bg-white px-3 py-1 text-xs font-medium text-ash-teal hover:bg-ash-teal/10">
                  View Details
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-start rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ash-gold text-white">
              <CalendarIcon size={20} />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  Advanced Partnership Development
                </h4>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  In-Person
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Strategies for building and maintaining school partnerships
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <CalendarIcon size={12} className="mr-1" />
                    June 22, 2025
                  </span>
                  <span className="flex items-center">
                    <ClockIcon size={12} className="mr-1" />
                    9:00 AM - 4:00 PM
                  </span>
                  <span className="flex items-center">
                    <UsersIcon size={12} className="mr-1" />8 Registered
                  </span>
                </div>
                <button className="rounded-md border border-ash-teal bg-white px-3 py-1 text-xs font-medium text-ash-teal hover:bg-ash-teal/10">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button className="flex items-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <CalendarIcon size={16} className="mr-2" />
            Schedule New Training
          </button>
        </div>
      </div>

      {/* Module details modal */}
      {selectedModule && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedModule.title}
              </h3>
              <button onClick={() => setSelectedModule(null)} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                <XIcon size={20} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {selectedModule.description}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Type</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedModule.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Format</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedModule.format}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Duration</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedModule.duration}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Completion Rate
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedModule.completionRate}%
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-4 rounded-lg bg-gray-100 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ash-teal text-white">
                  <PlayIcon size={20} />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">Module Content</h4>
                  <p className="text-sm text-gray-500">
                    Click to view or download the training materials
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2">
                  <div className="flex items-center">
                    <FileTextIcon size={16} className="mr-2 text-ash-teal" />
                    <span className="text-sm">Module Presentation</span>
                  </div>
                  <button className="rounded-md bg-gray-100 p-1 text-gray-600 hover:bg-gray-200">
                    <DownloadIcon size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2">
                  <div className="flex items-center">
                    <PlayIcon size={16} className="mr-2 text-ash-teal" />
                    <span className="text-sm">Training Video</span>
                  </div>
                  <button className="rounded-md bg-gray-100 p-1 text-gray-600 hover:bg-gray-200">
                    <DownloadIcon size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2">
                  <div className="flex items-center">
                    <FileTextIcon size={16} className="mr-2 text-ash-teal" />
                    <span className="text-sm">Workbook</span>
                  </div>
                  <button className="rounded-md bg-gray-100 p-1 text-gray-600 hover:bg-gray-200">
                    <DownloadIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setSelectedModule(null)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Close
              </button>
              <button className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90">
                Edit Module
              </button>
            </div>
          </div>
        </div>}

      {/* Add module modal */}
      {showAddModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Training Module
              </h3>
              <button onClick={() => setShowAddModal(false)} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                <XIcon size={20} />
              </button>
            </div>
            <div className="mb-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Module Title
                </label>
                <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" placeholder="Enter module title" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" rows={3} placeholder="Enter module description"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal">
                    <option value="Required">Required</option>
                    <option value="Optional">Optional</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Format
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal">
                    <option value="Video">Video</option>
                    <option value="Interactive">Interactive</option>
                    <option value="Document">Document</option>
                    <option value="Video + Quiz">Video + Quiz</option>
                    <option value="Document + Quiz">Document + Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" placeholder="e.g. 45 min" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Target Audience
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal">
                    <option value="All Ambassadors">All Ambassadors</option>
                    <option value="New Ambassadors">New Ambassadors</option>
                    <option value="Senior Ambassadors">
                      Senior Ambassadors
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Upload Materials
                </label>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-4">
                  <div className="space-y-1 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <PlusIcon size={24} className="text-gray-400" />
                    </div>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-ash-teal hover:text-ash-teal/80">
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PPT, MP4, DOCX up to 50MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowAddModal(false)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => setShowAddModal(false)} className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90">
                Create Module
              </button>
            </div>
          </div>
        </div>}
    </div>;
};