import React, { useEffect, useState } from 'react';
import { SchoolIcon, FilterIcon, SearchIcon, PlusIcon, MapPinIcon, PhoneIcon, MailIcon, UserIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, XCircleIcon, ArrowRightIcon, BarChart3Icon, TrendingUpIcon, CalendarIcon } from 'lucide-react';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { DataTable } from '../../../ui/widgets/DataTable';
import { LineChart } from '../../../ui/widgets/LineChart';
import { BarChart } from '../../../ui/widgets/BarChart';
export const OutreachPipelinePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [pipelineItems, setPipelineItems] = useState<any[]>([]);
  const [filteredPipelineItems, setFilteredPipelineItems] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState('quarter');
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockPipelineItems = [{
        id: 1,
        name: "St. Mary's High School",
        location: 'Lagos, Nigeria',
        country: 'Nigeria',
        contactPerson: 'Oluwaseun Adeyemi',
        contactEmail: 'oluwaseun@stmarys.edu.ng',
        contactPhone: '+234 802 345 6789',
        studentCount: 750,
        stage: 'initial_contact',
        status: 'active',
        assignedTo: 'Aisha Mohammed',
        nextAction: 'Schedule meeting',
        nextActionDate: 'June 20, 2025',
        lastActivity: '3 days ago',
        probability: 70,
        notes: 'Principal expressed interest in our programs'
      }, {
        id: 2,
        name: 'Westlands Secondary School',
        location: 'Nairobi, Kenya',
        country: 'Kenya',
        contactPerson: 'David Kamau',
        contactEmail: 'david@westlands.ac.ke',
        contactPhone: '+254 712 345 678',
        studentCount: 680,
        stage: 'discovery',
        status: 'active',
        assignedTo: 'John Kamau',
        nextAction: 'Prepare proposal',
        nextActionDate: 'June 22, 2025',
        lastActivity: '1 week ago',
        probability: 60,
        notes: 'Had initial call, school is interested in STEM workshops'
      }, {
        id: 3,
        name: 'Tema International School',
        location: 'Tema, Ghana',
        country: 'Ghana',
        contactPerson: 'Akosua Mensah',
        contactEmail: 'akosua@tis.edu.gh',
        contactPhone: '+233 24 987 6543',
        studentCount: 520,
        stage: 'proposal',
        status: 'active',
        assignedTo: 'Grace Osei',
        nextAction: 'Follow up on proposal',
        nextActionDate: 'June 18, 2025',
        lastActivity: '5 days ago',
        probability: 80,
        notes: 'Proposal sent, awaiting feedback'
      }, {
        id: 4,
        name: 'Pretoria Boys High School',
        location: 'Pretoria, South Africa',
        country: 'South Africa',
        contactPerson: 'Johan van der Merwe',
        contactEmail: 'johan@pbhs.ac.za',
        contactPhone: '+27 82 765 4321',
        studentCount: 850,
        stage: 'negotiation',
        status: 'active',
        assignedTo: 'Samuel Dlamini',
        nextAction: 'Schedule final meeting',
        nextActionDate: 'June 25, 2025',
        lastActivity: '2 days ago',
        probability: 90,
        notes: 'Reviewing partnership agreement details'
      }, {
        id: 5,
        name: 'Kano Model College',
        location: 'Kano, Nigeria',
        country: 'Nigeria',
        contactPerson: 'Ibrahim Musa',
        contactEmail: 'ibrahim@kanomodel.edu.ng',
        contactPhone: '+234 803 456 7890',
        studentCount: 620,
        stage: 'closed_won',
        status: 'won',
        assignedTo: 'Fatima Abdullahi',
        nextAction: 'Kickoff meeting',
        nextActionDate: 'July 5, 2025',
        lastActivity: '1 day ago',
        probability: 100,
        notes: 'Partnership agreement signed'
      }, {
        id: 6,
        name: 'Kisumu Academy',
        location: 'Kisumu, Kenya',
        country: 'Kenya',
        contactPerson: 'Alice Otieno',
        contactEmail: 'alice@kisumuacademy.ac.ke',
        contactPhone: '+254 722 987 6543',
        studentCount: 480,
        stage: 'initial_contact',
        status: 'stalled',
        assignedTo: 'John Kamau',
        nextAction: 'Follow up call',
        nextActionDate: 'June 30, 2025',
        lastActivity: '2 weeks ago',
        probability: 30,
        notes: 'Initial interest but no response to follow-ups'
      }, {
        id: 7,
        name: 'Accra Grammar School',
        location: 'Accra, Ghana',
        country: 'Ghana',
        contactPerson: 'Kwame Asante',
        contactEmail: 'kwame@accra-grammar.edu.gh',
        contactPhone: '+233 50 123 4567',
        studentCount: 550,
        stage: 'closed_lost',
        status: 'lost',
        assignedTo: 'Grace Osei',
        nextAction: 'None',
        nextActionDate: 'N/A',
        lastActivity: '1 month ago',
        probability: 0,
        notes: 'School chose another partner program'
      }];
      setPipelineItems(mockPipelineItems);
      setFilteredPipelineItems(mockPipelineItems);
      setIsLoading(false);
    }, 1000);
  }, []);
  useEffect(() => {
    if (pipelineItems.length > 0) {
      let filtered = [...pipelineItems];
      // Apply country filter
      if (filterCountry !== 'all') {
        filtered = filtered.filter(item => item.country === filterCountry);
      }
      // Apply stage filter
      if (filterStage !== 'all') {
        filtered = filtered.filter(item => item.stage === filterStage);
      }
      // Apply search
      if (searchQuery) {
        filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase()) || item.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      setFilteredPipelineItems(filtered);
    }
  }, [pipelineItems, filterCountry, filterStage, searchQuery]);
  // Calculate metrics
  const totalSchools = pipelineItems.length;
  const activeDeals = pipelineItems.filter(item => item.status === 'active').length;
  const closedWon = pipelineItems.filter(item => item.stage === 'closed_won').length;
  const winRate = totalSchools > 0 ? Math.round(closedWon / totalSchools * 100) : 0;
  const totalStudents = pipelineItems.reduce((sum, item) => sum + item.studentCount, 0);
  // Pipeline metrics for KPI cards
  const pipelineMetrics = [{
    title: 'Pipeline Schools',
    value: totalSchools.toString(),
    icon: <SchoolIcon size={20} />
  }, {
    title: 'Active Deals',
    value: activeDeals.toString(),
    change: 2,
    icon: <TrendingUpIcon size={20} />
  }, {
    title: 'Win Rate',
    value: `${winRate}%`,
    icon: <BarChart3Icon size={20} />
  }, {
    title: 'Potential Students',
    value: totalStudents.toLocaleString(),
    icon: <UserIcon size={20} />
  }];
  // Pipeline trend chart data
  const pipelineTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Pipeline Items',
      data: [8, 12, 15, 18, 22, 25],
      borderColor: '#1A5F7A',
      backgroundColor: '26, 95, 122, 0.1',
      fill: true
    }, {
      label: 'Closed Won',
      data: [3, 5, 7, 8, 10, 12],
      borderColor: '#26A269',
      backgroundColor: '38, 162, 105, 0.1',
      fill: true
    }]
  };
  // Pipeline by stage chart data
  const pipelineByStageData = {
    labels: ['Initial Contact', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    datasets: [{
      label: 'Number of Schools',
      data: [pipelineItems.filter(item => item.stage === 'initial_contact').length, pipelineItems.filter(item => item.stage === 'discovery').length, pipelineItems.filter(item => item.stage === 'proposal').length, pipelineItems.filter(item => item.stage === 'negotiation').length, pipelineItems.filter(item => item.stage === 'closed_won').length, pipelineItems.filter(item => item.stage === 'closed_lost').length],
      backgroundColor: '26, 95, 122, 0.8'
    }]
  };
  // Stage badge component
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'initial_contact':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <AlertCircleIcon size={12} className="mr-1" />
            Initial Contact
          </span>;
      case 'discovery':
        return <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
            <ClockIcon size={12} className="mr-1" />
            Discovery
          </span>;
      case 'proposal':
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <ClockIcon size={12} className="mr-1" />
            Proposal
          </span>;
      case 'negotiation':
        return <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
            <ClockIcon size={12} className="mr-1" />
            Negotiation
          </span>;
      case 'closed_won':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon size={12} className="mr-1" />
            Closed Won
          </span>;
      case 'closed_lost':
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircleIcon size={12} className="mr-1" />
            Closed Lost
          </span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {stage}
          </span>;
    }
  };
  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon size={12} className="mr-1" />
            Active
          </span>;
      case 'stalled':
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <AlertCircleIcon size={12} className="mr-1" />
            Stalled
          </span>;
      case 'won':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon size={12} className="mr-1" />
            Won
          </span>;
      case 'lost':
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircleIcon size={12} className="mr-1" />
            Lost
          </span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>;
    }
  };
  // Pipeline table columns
  const columns = [{
    header: 'School Name',
    accessor: (row: any) => <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="flex items-center text-xs text-gray-500">
            <MapPinIcon size={12} className="mr-1" />
            {row.location}
          </div>
        </div>,
    sortable: true
  }, {
    header: 'Contact Person',
    accessor: (row: any) => <div>
          <div className="font-medium">{row.contactPerson}</div>
          <div className="flex items-center text-xs text-gray-500">
            <MailIcon size={12} className="mr-1" />
            {row.contactEmail}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <PhoneIcon size={12} className="mr-1" />
            {row.contactPhone}
          </div>
        </div>
  }, {
    header: 'Stage',
    accessor: (row: any) => getStageBadge(row.stage)
  }, {
    header: 'Status',
    accessor: (row: any) => getStatusBadge(row.status)
  }, {
    header: 'Assigned To',
    accessor: (row: any) => <div className="flex items-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ash-teal/20 text-ash-teal">
            <UserIcon size={12} />
          </div>
          <span className="ml-2 text-sm">{row.assignedTo}</span>
        </div>
  }, {
    header: 'Next Action',
    accessor: (row: any) => <div>
          <div className="font-medium">{row.nextAction}</div>
          <div className="flex items-center text-xs text-gray-500">
            <CalendarIcon size={12} className="mr-1" />
            {row.nextActionDate}
          </div>
        </div>
  }, {
    header: 'Probability',
    accessor: (row: any) => <div className="w-full max-w-[100px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{row.probability}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
            <div className={`h-1.5 rounded-full ${row.probability >= 80 ? 'bg-green-500' : row.probability >= 50 ? 'bg-yellow-500' : row.probability > 0 ? 'bg-orange-500' : 'bg-red-500'}`} style={{
          width: `${row.probability}%`
        }}></div>
          </div>
        </div>,
    sortable: true
  }, {
    header: 'Students',
    accessor: 'studentCount',
    sortable: true
  }, {
    header: 'Last Activity',
    accessor: 'lastActivity'
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Outreach Pipeline</h1>
        <p className="text-sm text-gray-500">
          Track and manage the entire school partnership pipeline
        </p>
      </div>

      {/* Time range selector */}
      <div className="mb-6 flex items-center">
        <div className="flex items-center space-x-2">
          <button className={`rounded-md px-3 py-1.5 text-sm font-medium ${timeRange === 'month' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setTimeRange('month')}>
            Month
          </button>
          <button className={`rounded-md px-3 py-1.5 text-sm font-medium ${timeRange === 'quarter' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setTimeRange('quarter')}>
            Quarter
          </button>
          <button className={`rounded-md px-3 py-1.5 text-sm font-medium ${timeRange === 'year' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setTimeRange('year')}>
            Year
          </button>
        </div>
      </div>

      {/* Pipeline metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm-grid-cols-2 sm-gap-4 lg-grid-cols-4 lg-gap-4">
        {pipelineMetrics.map((metric, index) => <KpiCard key={index} title={metric.title} value={metric.value} change={metric.change} icon={metric.icon} />)}
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChart title="Pipeline Trend" subtitle="New pipeline items and closed deals over time" data={pipelineTrendData} />
        <BarChart title="Pipeline by Stage" subtitle="Distribution of schools by pipeline stage" data={pipelineByStageData} />
      </div>

      {/* Pipeline stages visualization */}
      <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-base font-medium text-gray-700">
          Pipeline Stages
        </h3>
        <div className="flex flex-wrap items-center justify-between">
          <div className="mb-4 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <AlertCircleIcon size={24} />
            </div>
            <div className="mt-2 text-center">
              <div className="text-lg font-bold">
                {pipelineItems.filter(item => item.stage === 'initial_contact').length}
              </div>
              <div className="text-xs text-gray-500">Initial Contact</div>
            </div>
          </div>
          <ArrowRightIcon size={20} className="mb-4 hidden text-gray-300 sm:block" />
          <div className="mb-4 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <ClockIcon size={24} />
            </div>
            <div className="mt-2 text-center">
              <div className="text-lg font-bold">
                {pipelineItems.filter(item => item.stage === 'discovery').length}
              </div>
              <div className="text-xs text-gray-500">Discovery</div>
            </div>
          </div>
          <ArrowRightIcon size={20} className="mb-4 hidden text-gray-300 sm:block" />
          <div className="mb-4 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <ClockIcon size={24} />
            </div>
            <div className="mt-2 text-center">
              <div className="text-lg font-bold">
                {pipelineItems.filter(item => item.stage === 'proposal').length}
              </div>
              <div className="text-xs text-gray-500">Proposal</div>
            </div>
          </div>
          <ArrowRightIcon size={20} className="mb-4 hidden text-gray-300 sm:block" />
          <div className="mb-4 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <ClockIcon size={24} />
            </div>
            <div className="mt-2 text-center">
              <div className="text-lg font-bold">
                {pipelineItems.filter(item => item.stage === 'negotiation').length}
              </div>
              <div className="text-xs text-gray-500">Negotiation</div>
            </div>
          </div>
          <ArrowRightIcon size={20} className="mb-4 hidden text-gray-300 sm:block" />
          <div className="mb-4 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircleIcon size={24} />
            </div>
            <div className="mt-2 text-center">
              <div className="text-lg font-bold">
                {pipelineItems.filter(item => item.stage === 'closed_won').length}
              </div>
              <div className="text-xs text-gray-500">Closed Won</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm-flex-row sm-space-y-0">
        <div className="flex w-full flex-wrap items-center space-x-2 sm:w-auto">
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setShowFilters(!showFilters)}>
            <FilterIcon size={16} className="mr-2" />
            Filter
          </button>
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50" value={filterStage} onChange={e => setFilterStage(e.target.value)}>
              <option value="all">All Stages</option>
              <option value="initial_contact">Initial Contact</option>
              <option value="discovery">Discovery</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>
          </div>
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50" value={filterCountry} onChange={e => setFilterCountry(e.target.value)}>
              <option value="all">All Countries</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="Ghana">Ghana</option>
              <option value="South Africa">South Africa</option>
            </select>
          </div>
        </div>
        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input type="search" placeholder="Search pipeline..." className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus-border-ash-teal focus-outline-none focus-ring-1 focus-ring-ash-teal" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="flex items-center rounded-md bg-ash-teal px-3 py-2 text-sm font-medium text-white hover:bg-ash-teal/90">
            <PlusIcon size={16} className="mr-2" />
            Add School
          </button>
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-medium text-gray-700">
            Advanced Filters
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Status
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="stalled">Stalled</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Assigned To
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Ambassadors</option>
                <option value="Aisha Mohammed">Aisha Mohammed</option>
                <option value="John Kamau">John Kamau</option>
                <option value="Grace Osei">Grace Osei</option>
                <option value="Samuel Dlamini">Samuel Dlamini</option>
                <option value="Fatima Abdullahi">Fatima Abdullahi</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Probability
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Probabilities</option>
                <option value="high">High (80%+)</option>
                <option value="medium">Medium (50-79%)</option>
                <option value="low">Low ( 50%)</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
              Reset Filters
            </button>
            <button className="rounded-md bg-ash-teal px-3 py-1.5 text-xs font-medium text-white hover:bg-ash-teal/90">
              Apply Filters
            </button>
          </div>
        </div>}

      {/* Pipeline table */}
      {isLoading ? <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
        </div> : <div className="mb-6">
          <DataTable columns={columns} data={filteredPipelineItems} keyField="id" rowsPerPage={10} showSearch={false} />
        </div>}

      {/* Quick actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-medium text-gray-700">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-3 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <PlusIcon size={16} className="mr-2" />
            Add New School
          </button>
          <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-3 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <CalendarIcon size={16} className="mr-2" />
            Schedule Follow-ups
          </button>
          <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-3 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <BarChart3Icon size={16} className="mr-2" />
            Pipeline Report
          </button>
        </div>
      </div>
    </div>;
};