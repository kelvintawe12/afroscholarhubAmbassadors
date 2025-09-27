import React, { useEffect, useState } from 'react';
import { SearchIcon, FilterIcon, DownloadIcon, PlusIcon, MapPinIcon, PhoneIcon, MailIcon, UserIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, XCircleIcon, MoreHorizontalIcon, EyeIcon, EditIcon, TrashIcon, BarChart3Icon, UsersIcon, SchoolIcon, XIcon } from 'lucide-react';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { DataTable } from '../../../ui/widgets/DataTable';
import { PieChart } from '../../../ui/widgets/PieChart';
import { supabase } from '../../../../utils/supabase';
export const SchoolsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [schools, setSchools] = useState<any[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [showAssignAmbassadorsModal, setShowAssignAmbassadorsModal] = useState(false);

  // Add School form state
  const [newSchool, setNewSchool] = useState({
    name: '',
    location: '',
    country: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    studentCount: '',
    ambassador: '',
    address: '',
    type: '',
    status: 'prospect',
    city: '',
    region: '',
  });

  // Assign Ambassadors form state
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [selectedAmbassador, setSelectedAmbassador] = useState('');

  // Fetch schools from API (replace with your real API)
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/schools') // Replace with your actual endpoint
      .then(res => res.json())
      .then(data => {
        setSchools(data);
        setFilteredSchools(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (schools.length > 0) {
      let filtered = [...schools];
      if (filterCountry !== 'all') {
        filtered = filtered.filter(school => school.country === filterCountry);
      }
      if (filterStatus !== 'all') {
        filtered = filtered.filter(school => school.status === filterStatus);
      }
      if (searchQuery) {
        filtered = filtered.filter(school =>
          school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          school.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          school.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
        );
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

  // Add School submit handler (replace with your API logic)
  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare payload matching your SQL schema
    const payload = {
      name: newSchool.name,
      location: newSchool.location,
      address: newSchool.address,
      city: newSchool.city,
      region: newSchool.region,
      country_code: newSchool.country,
      type: newSchool.type,
      status: newSchool.status,
      contact_person: newSchool.contactPerson,
      contact_email: newSchool.contactEmail,
      contact_phone: newSchool.contactPhone,
      student_count: Number(newSchool.studentCount) || 0,
      ambassador: newSchool.ambassador,
    };

    const { data, error } = await supabase
      .from('schools')
      .insert([payload])
      .select()
      .single();

    if (error) {
      alert('Failed to add school: ' + error.message);
      return;
    }

    if (data) {
      setSchools(prev => [...prev, data]);
      setFilteredSchools(prev => [...prev, data]);
      setShowAddSchoolModal(false);
      setNewSchool({
        name: '',
        location: '',
        country: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        studentCount: '',
        ambassador: '',
        address: '',
        type: '',
        status: 'prospect',
        city: '',
        region: '',
      });
    }
  };

  // Assign Ambassador submit handler (replace with your API logic)
  const handleAssignAmbassador = (e: React.FormEvent) => {
    e.preventDefault();
    // Example: POST to API, then refresh list
    setShowAssignAmbassadorsModal(false);
    setSelectedAmbassador('');
    setSelectedSchoolId(null);
  };

  return (
    <div className="px-2 sm:px-4 lg:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Master School Sheet
        </h1>
        <p className="text-sm text-gray-500">
          Comprehensive database of all schools, partnerships, and ambassador assignments
        </p>
      </div>

      {/* School metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {schoolMetrics.map((metric, index) => (
          <KpiCard key={index} title={metric.title} value={metric.value} change={metric.change} icon={metric.icon} />
        ))}
      </div>

      {/* Filters and search */}
      <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
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
              {/* Dynamically generate country options */}
              {[...new Set(schools.map(s => s.country))].map(country =>
                <option key={country} value={country}>{country}</option>
              )}
            </select>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-2">
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
          <button
            className="flex items-center rounded-md bg-ash-teal px-3 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
            onClick={() => setShowAddSchoolModal(true)}
          >
            <PlusIcon size={16} className="mr-2" />
            Add School
          </button>
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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
                <option value="small">Small ( &lt; 500)</option>
                <option value="medium">Medium (500-1000)</option>
                <option value="large">Large (&gt; 1000)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Ambassador
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Ambassadors</option>
                {[...new Set(schools.map(s => s.ambassador))].map(amb =>
                  <option key={amb} value={amb}>{amb}</option>
                )}
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
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end sm:space-x-2">
            <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
              Reset Filters
            </button>
            <button className="rounded-md bg-ash-teal px-3 py-1.5 text-xs font-medium text-white hover:bg-ash-teal/90">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* School status distribution chart and table */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
              </div>
            ) : (
              <DataTable columns={columns} data={filteredSchools} keyField="id" rowsPerPage={10} showSearch={false} />
            )}
          </div>
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
          <button
            className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-3 text-sm font-medium text-ash-teal hover:bg-ash-teal/10"
            onClick={() => setShowAddSchoolModal(true)}
          >
            <PlusIcon size={16} className="mr-2" />
            Add New School
          </button>
          <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-3 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <DownloadIcon size={16} className="mr-2" />
            Export to Excel
          </button>
          <button
            className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-3 text-sm font-medium text-ash-teal hover:bg-ash-teal/10"
            onClick={() => setShowAssignAmbassadorsModal(true)}
          >
            <UsersIcon size={16} className="mr-2" />
            Assign Ambassadors
          </button>
        </div>
      </div>

      {/* Add New School Modal */}
      {showAddSchoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
          <div className="w-full max-w-md sm:max-w-lg rounded-lg bg-white p-2 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Add New School</h3>
              <button
                onClick={() => setShowAddSchoolModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <XIcon size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSchool} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">School Name</label>
                <input
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  required
                  value={newSchool.name}
                  onChange={e => setNewSchool({ ...newSchool, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                  <select
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newSchool.type || ''}
                    onChange={e => setNewSchool({ ...newSchool, type: e.target.value })}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="tertiary">Tertiary</option>
                    <option value="university">University</option>
                    <option value="polytechnic">Polytechnic</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                  <select
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newSchool.status || ''}
                    onChange={e => setNewSchool({ ...newSchool, status: e.target.value })}
                  >
                    <option value="prospect">Prospect</option>
                    <option value="contacted">Contacted</option>
                    <option value="visited">Visited</option>
                    <option value="proposal">Proposal</option>
                    <option value="partnered">Partnered</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                <input
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  value={newSchool.address || ''}
                  onChange={e => setNewSchool({ ...newSchool, address: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                  <input
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newSchool.city || ''}
                    onChange={e => setNewSchool({ ...newSchool, city: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Region</label>
                  <input
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newSchool.region || ''}
                    onChange={e => setNewSchool({ ...newSchool, region: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
                <select
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  value={newSchool.country}
                  onChange={e => setNewSchool({ ...newSchool, country: e.target.value })}
                  required
                >
                  <option value="">Select country</option>
                  {[...new Set(schools.map(s => s.country))].map(country =>
                    <option key={country} value={country}>{country}</option>
                  )}
                </select>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contact Person</label>
                  <input
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    required
                    value={newSchool.contactPerson}
                    onChange={e => setNewSchool({ ...newSchool, contactPerson: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contact Email</label>
                  <input
                    type="email"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newSchool.contactEmail}
                    onChange={e => setNewSchool({ ...newSchool, contactEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contact Phone</label>
                  <input
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newSchool.contactPhone}
                    onChange={e => setNewSchool({ ...newSchool, contactPhone: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Student Count</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newSchool.studentCount}
                    onChange={e => setNewSchool({ ...newSchool, studentCount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Ambassador</label>
                <input
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  value={newSchool.ambassador}
                  onChange={e => setNewSchool({ ...newSchool, ambassador: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowAddSchoolModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
                >
                  Add School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Ambassadors Modal */}
      {showAssignAmbassadorsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
          <div className="w-full max-w-md sm:max-w-lg rounded-lg bg-white p-2 sm:p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Assign Ambassador</h3>
              <button
                onClick={() => setShowAssignAmbassadorsModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <XIcon size={20} />
              </button>
            </div>
            <form onSubmit={handleAssignAmbassador} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Select School</label>
                <select
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  required
                  value={selectedSchoolId || ''}
                  onChange={e => setSelectedSchoolId(e.target.value)}
                >
                  <option value="">Select a school</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Ambassador Name</label>
                <input
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  required
                  value={selectedAmbassador}
                  onChange={e => setSelectedAmbassador(e.target.value)}
                  placeholder="Enter ambassador name"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowAssignAmbassadorsModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};