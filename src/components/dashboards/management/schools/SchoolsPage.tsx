import React, { useEffect, useState } from 'react';
import { SearchIcon, FilterIcon, DownloadIcon, PlusIcon, MapPinIcon, PhoneIcon, MailIcon, UserIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, XCircleIcon, MoreHorizontalIcon, EyeIcon, EditIcon, TrashIcon, BarChart3Icon, UsersIcon, SchoolIcon } from 'lucide-react';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { DataTable } from '../../../ui/widgets/DataTable';
import { PieChart } from '../../../ui/widgets/PieChart';
export const SchoolsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [schools, setSchools] = useState<any[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockSchools = [{
        id: 1,
        name: 'Lagos Model School',
        location: 'Lagos, Nigeria',
        country: 'Nigeria',
        contactPerson: 'Adebayo Johnson',
        contactEmail: 'adebayo@lagosmodel.edu.ng',
        contactPhone: '+234 801 234 5678',
        studentCount: 850,
        status: 'partnered',
        ambassador: 'Aisha Mohammed',
        lastVisit: '3 days ago',
        nextVisit: 'July 15, 2025',
        leadsGenerated: 120,
        conversionRate: 35
      }, {
        id: 2,
        name: 'Nairobi Academy',
        location: 'Nairobi, Kenya',
        country: 'Kenya',
        contactPerson: 'Grace Mwangi',
        contactEmail: 'grace@nairobiacademy.ac.ke',
        contactPhone: '+254 712 345 678',
        studentCount: 720,
        status: 'partnered',
        ambassador: 'John Kamau',
        lastVisit: '1 week ago',
        nextVisit: 'June 28, 2025',
        leadsGenerated: 95,
        conversionRate: 28
      }, {
        id: 3,
        name: 'Accra High School',
        location: 'Accra, Ghana',
        country: 'Ghana',
        contactPerson: 'Kwame Osei',
        contactEmail: 'kwame@accrahigh.edu.gh',
        contactPhone: '+233 24 123 4567',
        studentCount: 650,
        status: 'visited',
        ambassador: 'Grace Osei',
        lastVisit: '2 weeks ago',
        nextVisit: 'July 5, 2025',
        leadsGenerated: 45,
        conversionRate: 0
      }, {
        id: 4,
        name: 'Cape Town Secondary',
        location: 'Cape Town, South Africa',
        country: 'South Africa',
        contactPerson: 'Thabo Mbeki',
        contactEmail: 'thabo@ctownhigh.ac.za',
        contactPhone: '+27 82 123 4567',
        studentCount: 580,
        status: 'prospect',
        ambassador: 'Samuel Dlamini',
        lastVisit: 'Never',
        nextVisit: 'June 20, 2025',
        leadsGenerated: 0,
        conversionRate: 0
      }, {
        id: 5,
        name: 'Abuja Grammar School',
        location: 'Abuja, Nigeria',
        country: 'Nigeria',
        contactPerson: 'Fatima Ibrahim',
        contactEmail: 'fatima@abujaschool.edu.ng',
        contactPhone: '+234 802 345 6789',
        studentCount: 700,
        status: 'partnered',
        ambassador: 'Fatima Abdullahi',
        lastVisit: '5 days ago',
        nextVisit: 'July 10, 2025',
        leadsGenerated: 75,
        conversionRate: 22
      }, {
        id: 6,
        name: 'Mombasa International School',
        location: 'Mombasa, Kenya',
        country: 'Kenya',
        contactPerson: 'David Ochieng',
        contactEmail: 'david@mombasaschool.ac.ke',
        contactPhone: '+254 722 345 678',
        studentCount: 450,
        status: 'visited',
        ambassador: 'John Kamau',
        lastVisit: '1 month ago',
        nextVisit: 'July 8, 2025',
        leadsGenerated: 30,
        conversionRate: 0
      }, {
        id: 7,
        name: 'Kumasi Academy',
        location: 'Kumasi, Ghana',
        country: 'Ghana',
        contactPerson: 'Akua Mensah',
        contactEmail: 'akua@kumasiacademy.edu.gh',
        contactPhone: '+233 54 987 6543',
        studentCount: 520,
        status: 'inactive',
        ambassador: 'Unassigned',
        lastVisit: '6 months ago',
        nextVisit: 'Not scheduled',
        leadsGenerated: 15,
        conversionRate: 0
      }];
      setSchools(mockSchools);
      setFilteredSchools(mockSchools);
      setIsLoading(false);
    }, 1000);
  }, []);
  useEffect(() => {
    if (schools.length > 0) {
      let filtered = [...schools];
      // Apply country filter
      if (filterCountry !== 'all') {
        filtered = filtered.filter(school => school.country === filterCountry);
      }
      // Apply status filter
      if (filterStatus !== 'all') {
        filtered = filtered.filter(school => school.status === filterStatus);
      }
      // Apply search
      if (searchQuery) {
        filtered = filtered.filter(school => school.name.toLowerCase().includes(searchQuery.toLowerCase()) || school.location.toLowerCase().includes(searchQuery.toLowerCase()) || school.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      setFilteredSchools(filtered);
    }
  }, [schools, filterCountry, filterStatus, searchQuery]);
  // Calculate metrics
  const totalSchools = schools.length;
  const partneredSchools = schools.filter(s => s.status === 'partnered').length;
  const visitedSchools = schools.filter(s => s.status === 'visited').length;
  const prospectSchools = schools.filter(s => s.status === 'prospect').length;
  const inactiveSchools = schools.filter(s => s.status === 'inactive').length;
  const totalStudents = schools.reduce((sum, school) => sum + school.studentCount, 0);
  const totalLeads = schools.reduce((sum, school) => sum + school.leadsGenerated, 0);
  // School status distribution data for pie chart
  const schoolStatusData = {
    labels: ['Partnered', 'Visited', 'Prospect', 'Inactive'],
    datasets: [{
      data: [partneredSchools, visitedSchools, prospectSchools, inactiveSchools],
      backgroundColor: ['rgba(38, 162, 105, 0.8)', 'rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(225, 112, 85, 0.8)']
    }]
  };
  // School metrics for KPI cards
  const schoolMetrics = [{
    title: 'Total Schools',
    value: totalSchools.toString(),
    icon: <SchoolIcon size={20} />
  }, {
    title: 'Partnered Schools',
    value: partneredSchools.toString(),
    change: 3,
    icon: <CheckCircleIcon size={20} />
  }, {
    title: 'Total Students',
    value: totalStudents.toLocaleString(),
    icon: <UsersIcon size={20} />
  }, {
    title: 'Leads Generated',
    value: totalLeads.toLocaleString(),
    change: 15,
    icon: <BarChart3Icon size={20} />
  }];
  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'partnered':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon size={12} className="mr-1" />
            Partnered
          </span>;
      case 'visited':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <ClockIcon size={12} className="mr-1" />
            Visited
          </span>;
      case 'prospect':
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <AlertCircleIcon size={12} className="mr-1" />
            Prospect
          </span>;
      case 'inactive':
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircleIcon size={12} className="mr-1" />
            Inactive
          </span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>;
    }
  };
  // School table columns
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
    header: 'Status',
    accessor: (row: any) => getStatusBadge(row.status)
  }, {
    header: 'Ambassador',
    accessor: (row: any) => <div className="flex items-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ash-teal/20 text-ash-teal">
            <UserIcon size={12} />
          </div>
          <span className="ml-2 text-sm">{row.ambassador}</span>
        </div>
  }, {
    header: 'Students',
    accessor: 'studentCount',
    sortable: true
  }, {
    header: 'Leads',
    accessor: 'leadsGenerated',
    sortable: true
  }, {
    header: 'Last Visit',
    accessor: 'lastVisit'
  }, {
    header: 'Next Visit',
    accessor: 'nextVisit'
  }, {
    header: 'Actions',
    accessor: (row: any) => <div className="relative">
          <button onClick={() => setShowMenu(showMenu === row.id ? null : row.id)} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
            <MoreHorizontalIcon size={16} />
          </button>
          {showMenu === row.id && <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              <button className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50">
                <EyeIcon size={14} className="mr-2 text-gray-500" />
                View Details
              </button>
              <button className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50">
                <EditIcon size={14} className="mr-2 text-gray-500" />
                Edit School
              </button>
              <button className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                <TrashIcon size={14} className="mr-2" />
                Remove School
              </button>
            </div>}
        </div>
  }];
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu !== null) {
        setShowMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Master School Sheet
        </h1>
        <p className="text-sm text-gray-500">
          Comprehensive database of all schools, partnerships, and ambassador
          assignments
        </p>
      </div>

      {/* School metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {schoolMetrics.map((metric, index) => <KpiCard key={index} title={metric.title} value={metric.value} change={metric.change} icon={metric.icon} />)}
      </div>

      {/* Filters and search */}
      <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex w-full flex-wrap items-center space-x-2 sm:w-auto">
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setShowFilters(!showFilters)}>
            <FilterIcon size={16} className="mr-2" />
            Filter
          </button>
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="partnered">Partnered</option>
              <option value="visited">Visited</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactive</option>
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
            <input type="search" placeholder="Search schools..." className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <DownloadIcon size={16} className="mr-2" />
            Export
          </button>
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
                Student Count
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Sizes</option>
                <option value="small">Small ( 500)</option>
                <option value="medium">Medium (500-1000)</option>
                <option value="large">Large ({'>'} 1000)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Ambassador
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Ambassadors</option>
                <option value="Aisha Mohammed">Aisha Mohammed</option>
                <option value="John Kamau">John Kamau</option>
                <option value="Grace Osei">Grace Osei</option>
                <option value="Samuel Dlamini">Samuel Dlamini</option>
                <option value="Fatima Abdullahi">Fatima Abdullahi</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Last Visit
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">Any Time</option>
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="quarter">Last 90 days</option>
                <option value="never">Never visited</option>
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

      {/* School status distribution chart */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          {isLoading ? <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
            </div> : <DataTable columns={columns} data={filteredSchools} keyField="id" rowsPerPage={10} showSearch={false} />}
        </div>
        <div className="lg:col-span-1">
          <div className="h-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-base font-medium text-gray-700">
              School Distribution
            </h3>
            <PieChart title="School Status Distribution" data={schoolStatusData} height={250} showLegend={true} />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-xs text-gray-600">Partnered</span>
                </div>
                <span className="text-xs font-medium">{partneredSchools}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-[rgba(26,95,122,0.8)]"></div>
                  <span className="ml-2 text-xs text-gray-600">Visited</span>
                </div>
                <span className="text-xs font-medium">{visitedSchools}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="ml-2 text-xs text-gray-600">Prospect</span>
                </div>
                <span className="text-xs font-medium">{prospectSchools}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="ml-2 text-xs text-gray-600">Inactive</span>
                </div>
                <span className="text-xs font-medium">{inactiveSchools}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <DownloadIcon size={16} className="mr-2" />
            Export to Excel
          </button>
          <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-3 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <UsersIcon size={16} className="mr-2" />
            Assign Ambassadors
          </button>
        </div>
      </div>
    </div>;
};