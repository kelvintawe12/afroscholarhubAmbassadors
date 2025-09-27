import React, { useEffect, useState } from 'react';
import { SearchIcon, FilterIcon, PlusIcon, MapPinIcon, PhoneIcon, MailIcon, UserIcon, ClockIcon, AlertCircleIcon, MoreHorizontalIcon, EyeIcon, EditIcon, TrashIcon, CheckCircleIcon, XCircleIcon, CalendarIcon, TrendingUpIcon, BarChart3Icon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { DataTable } from '../../../ui/widgets/DataTable';
import { LineChart } from '../../../ui/widgets/LineChart';
import { BarChart } from '../../../ui/widgets/BarChart';
import { supabase } from '../../../../utils/supabase';
import { getAllAmbassadors } from '../../../../api/ambassador';

type Country = {
  code: string;
  name: string;
};

type School = {
  id: string;
  name: string;
  location: string;
  address?: string;
  country_code: string;
  region?: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  student_count: number;
  priority: string;
  status: string;
  potential_value?: string;
  assigned_to?: string;
  next_action?: string;
  next_action_date?: string;
  last_contact?: string;
  // Add other fields as needed
};

export const SchoolProspectsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [prospects, setProspects] = useState<any[]>([]);
  const [filteredProspects, setFilteredProspects] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState('quarter');
  const [countries, setCountries] = useState<Country[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  type User = {
    id: number;
    name: string;
    // Add other fields as needed
  };
  const [ambassadors, setAmbassadors] = useState<User[]>([]);
  const [showAddProspectModal, setShowAddProspectModal] = useState(false);
  const [showScheduleFollowupModal, setShowScheduleFollowupModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);

  // Add Prospect form state
  const [newProspect, setNewProspect] = useState<Partial<School>>({
    name: '',
    location: '',
    address: '',
    country_code: '',
    region: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    student_count: 0,
    priority: 'medium',
    status: 'prospect',
  });

  // Reassign state
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null);
  const [selectedAmbassadorId, setSelectedAmbassadorId] = useState<string>('');

  useEffect(() => {
    const fetchProspects = async () => {
      setIsLoading(true);
      // Fetch only schools with status 'prospect' or similar
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .in('status', ['prospect', 'contacted', 'meeting_scheduled', 'proposal_sent', 'new']) // adjust as needed
        .order('created_at', { ascending: false });
      if (!error && data) {
        setProspects(data);
        setFilteredProspects(data);
      }
      setIsLoading(false);
    };
    fetchProspects();
  }, []);
  useEffect(() => {
    if (prospects.length > 0) {
      let filtered = [...prospects];
      // Apply country filter
      if (filterCountry !== 'all') {
        filtered = filtered.filter(prospect => prospect.country === filterCountry);
      }
      // Apply priority filter
      if (filterPriority !== 'all') {
        filtered = filtered.filter(prospect => prospect.priority === filterPriority);
      }
      // Apply search
      if (searchQuery) {
        filtered = filtered.filter(prospect => prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) || prospect.location.toLowerCase().includes(searchQuery.toLowerCase()) || prospect.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      setFilteredProspects(filtered);
    }
  }, [prospects, filterCountry, filterPriority, searchQuery]);
  // Calculate metrics
  const totalProspects = prospects.length;
  const highPriorityProspects = prospects.filter(p => p.priority === 'high').length;
  const meetingsScheduled = prospects.filter(p => p.status === 'meeting_scheduled').length;
  const proposalsSent = prospects.filter(p => p.status === 'proposal_sent').length;
  const totalPotentialStudents = prospects.reduce((sum, prospect) => sum + prospect.studentCount, 0);
  // Prospect metrics for KPI cards
  const prospectMetrics = [{
    title: 'Total Prospects',
    value: totalProspects.toString(),
    change: 4,
    icon: <AlertCircleIcon size={20} />
  }, {
    title: 'High Priority',
    value: highPriorityProspects.toString(),
    change: 2,
    icon: <TrendingUpIcon size={20} />
  }, {
    title: 'Meetings Scheduled',
    value: meetingsScheduled.toString(),
    change: 3,
    icon: <CalendarIcon size={20} />
  }, {
    title: 'Potential Students',
    value: totalPotentialStudents.toLocaleString(),
    icon: <BarChart3Icon size={20} />
  }];
  // Generate pipeline trend data dynamically from prospects
  const pipelineTrendData = React.useMemo(() => {
    // Group prospects by month (created_at)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return { label: months[d.getMonth()], year: d.getFullYear(), month: d.getMonth() };
    });

    const newProspects = last6Months.map(({ year, month }) =>
      prospects.filter(p => {
        const created = p.created_at ? new Date(p.created_at) : null;
        return created && created.getFullYear() === year && created.getMonth() === month;
      }).length
    );

    const conversions = last6Months.map(({ year, month }) =>
      prospects.filter(p => {
        // Conversion: status changed to 'proposal_sent' or similar in this month
        if (!p.status_history || !Array.isArray(p.status_history)) return false;
        return p.status_history.some((h: any) => {
          if (!h.status || !h.changed_at) return false;
          const changed = new Date(h.changed_at);
          return (
            (h.status === 'proposal_sent' || h.status === 'won') &&
            changed.getFullYear() === year &&
            changed.getMonth() === month
          );
        });
      }).length
    );

    return {
      labels: last6Months.map(m => m.label),
      datasets: [
        {
          label: 'New Prospects',
          data: newProspects,
          borderColor: '#1A5F7A',
          backgroundColor: 'rgba(26, 95, 122, 0.1)',
          fill: true
        },
        {
          label: 'Conversions',
          data: conversions,
          borderColor: '#26A269',
          backgroundColor: 'rgba(38, 162, 105, 0.1)',
          fill: true
        }
      ]
    };
  }, [prospects]);

  // Prospects by country chart data (dynamic)
  const prospectsByCountryData = React.useMemo(() => {
    const countryCounts: Record<string, number> = {};
    prospects.forEach(p => {
      const code = p.country_code || p.country || 'Unknown';
      countryCounts[code] = (countryCounts[code] || 0) + 1;
    });
    const labels = Object.keys(countryCounts).map(code => {
      const country = countries.find(c => c.code === code);
      return country ? country.name : code;
    });
    const data = Object.values(countryCounts);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Prospects',
          data,
          backgroundColor: 'rgba(26, 95, 122, 0.8)'
        }
      ]
    };
  }, [prospects, countries]);
  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <AlertCircleIcon size={12} className="mr-1" />
            New
          </span>;
      case 'contacted':
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <CheckCircleIcon size={12} className="mr-1" />
            Contacted
          </span>;
      case 'meeting_scheduled':
        return <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
            <CalendarIcon size={12} className="mr-1" />
            Meeting Scheduled
          </span>;
      case 'proposal_sent':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon size={12} className="mr-1" />
            Proposal Sent
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
  // Priority badge component
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <ArrowUpIcon size={12} className="mr-1" />
            High
          </span>;
      case 'medium':
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            Medium
          </span>;
      case 'low':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <ArrowDownIcon size={12} className="mr-1" />
            Low
          </span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {priority}
          </span>;
    }
  };
  // Prospect table columns
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
    header: 'Priority',
    accessor: (row: any) => getPriorityBadge(row.priority)
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
    header: 'Last Contact',
    accessor: 'lastContact'
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
                Edit Prospect
              </button>
              <button className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50">
                <CalendarIcon size={14} className="mr-2 text-gray-500" />
                Schedule Meeting
              </button>
              <button className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                <TrashIcon size={14} className="mr-2" />
                Remove Prospect
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
  // Fetch countries from Supabase
  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('code, name')
        .order('name', { ascending: true });
      if (!error && data) setCountries(data);
    };
    fetchCountries();
  }, []);
  // Fetch ambassadors
  useEffect(() => {
      getAllAmbassadors().then((usersFromApi) => {
        // Map or transform users to match the local User type
        const mappedUsers = usersFromApi.map((user: any) => ({
          id: user.id,
          name: user.name || user.full_name || user.email || 'Unknown', // Adjust as needed
          // Add other fields if necessary
        }));
        setAmbassadors(mappedUsers);
      });
    }, []);
  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .in('status', ['prospect', 'contacted', 'meeting_scheduled', 'proposal_sent', 'new']) // adjust as needed
        .order('created_at', { ascending: false });
      if (!error && data) {
        setProspects(data);
        setFilteredProspects(data);
      }
      setIsLoading(false);
    };
    fetchSchools();
  }, []);
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">School Prospects</h1>
        <p className="text-sm text-gray-500">
          Track and manage potential school partnerships in the pipeline
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

      {/* Prospect metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {prospectMetrics.map((metric, index) => <KpiCard key={index} title={metric.title} value={metric.value} change={metric.change} icon={metric.icon} />)}
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChart title="Pipeline Trend" subtitle="New prospects and conversions over time" data={pipelineTrendData} />
        <BarChart title="Prospects by Country" subtitle="Distribution of prospects by country" data={prospectsByCountryData} />
      </div>

      {/* Filters and search */}
      <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex w-full flex-wrap items-center space-x-2 sm:w-auto">
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => setShowFilters(!showFilters)}>
            <FilterIcon size={16} className="mr-2" />
            Filter
          </button>
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="relative">
            <select
  value={filterCountry}
  onChange={e => setFilterCountry(e.target.value)}
  className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50"
>
  <option value="all">All Countries</option>
  {countries.map(country => (
    <option key={country.code} value={country.code}>
      {country.name}
    </option>
  ))}
</select>
          </div>
        </div>
        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input type="search" placeholder="Search prospects..." className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="flex items-center rounded-md bg-ash-teal px-3 py-2 text-sm font-medium text-white hover:bg-ash-teal/90" onClick={() => setShowAddProspectModal(true)}>
            <PlusIcon size={16} className="mr-2" />
            Add Prospect
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
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="meeting_scheduled">Meeting Scheduled</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Assigned To
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Ambassadors</option>
                {ambassadors.map(ambassador => <option key={ambassador.id} value={ambassador.name}>{ambassador.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Last Contact
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">Any Time</option>
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="never">Never contacted</option>
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

      {/* Prospects table */}
      {isLoading ? <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
        </div> : <div className="mb-6">
          <DataTable columns={columns} data={filteredProspects} keyField="id" rowsPerPage={10} showSearch={false} />
        </div>}

      {/* Quick actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-medium text-gray-700">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
  className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-3 text-sm font-medium text-ash-teal hover:bg-ash-teal/10"
  onClick={() => setShowAddProspectModal(true)}
>
  <PlusIcon size={16} className="mr-2" />
  Add New Prospect
</button>
<button
  className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-3 text-sm font-medium text-ash-teal hover:bg-ash-teal/10"
  onClick={() => setShowScheduleFollowupModal(true)}
>
  <CalendarIcon size={16} className="mr-2" />
  Schedule Follow-ups
</button>
<button
  className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-3 text-sm font-medium text-ash-teal hover:bg-ash-teal/10"
  onClick={() => setShowReassignModal(true)}
>
  <UserIcon size={16} className="mr-2" />
  Reassign Prospects
</button>
        </div>
      </div>

      {/* Add New Prospect Modal */}
      {showAddProspectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
          <div className="w-full max-w-md sm:max-w-lg rounded-lg bg-white p-2 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Add New Prospect</h3>
              <button
                onClick={() => setShowAddProspectModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <XCircleIcon size={20} />
              </button>
            </div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                const payload = {
                  ...newProspect,
                  student_count: Number(newProspect.student_count) || 0,
                  created_at: new Date().toISOString(),
                };
                const { data, error } = await supabase
                  .from('schools')
                  .insert([payload])
                  .select()
                  .single();
                if (error) {
                  alert('Failed to add prospect: ' + error.message);
                  return;
                }
                if (data) {
                  setProspects(prev => [data, ...prev]);
                  setFilteredProspects(prev => [data, ...prev]);
                  setShowAddProspectModal(false);
                  setNewProspect({
                    name: '',
                    location: '',
                    address: '',
                    country_code: '',
                    region: '',
                    contact_person: '',
                    contact_email: '',
                    contact_phone: '',
                    student_count: 0,
                    priority: 'medium',
                    status: 'prospect',
                  });
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">School Name</label>
                <input
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  required
                  value={newProspect.name}
                  onChange={e => setNewProspect({ ...newProspect, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                <input
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  required
                  value={newProspect.location}
                  onChange={e => setNewProspect({ ...newProspect, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                <input
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  value={newProspect.address}
                  onChange={e => setNewProspect({ ...newProspect, address: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
                  <select
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    required
                    value={newProspect.country_code}
                    onChange={e => setNewProspect({ ...newProspect, country_code: e.target.value })}
                  >
                    <option value="">Select country</option>
                    {countries.map(country =>
                      <option key={country.code} value={country.code}>{country.name}</option>
                    )}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Region</label>
                  <input
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newProspect.region}
                    onChange={e => setNewProspect({ ...newProspect, region: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contact Person</label>
                  <input
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newProspect.contact_person}
                    onChange={e => setNewProspect({ ...newProspect, contact_person: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contact Email</label>
                  <input
                    type="email"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newProspect.contact_email}
                    onChange={e => setNewProspect({ ...newProspect, contact_email: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Contact Phone</label>
                  <input
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newProspect.contact_phone}
                    onChange={e => setNewProspect({ ...newProspect, contact_phone: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Student Count</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newProspect.student_count}
                    onChange={e => setNewProspect({ ...newProspect, student_count: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
                  <select
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newProspect.priority}
                    onChange={e => setNewProspect({ ...newProspect, priority: e.target.value as 'high' | 'medium' | 'low' })}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                  <select
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                    value={newProspect.status}
                    onChange={e => setNewProspect({ ...newProspect, status: e.target.value })}
                  >
                    <option value="prospect">Prospect</option>
                    <option value="contacted">Contacted</option>
                    <option value="meeting_scheduled">Meeting Scheduled</option>
                    <option value="proposal_sent">Proposal Sent</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowAddProspectModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
                >
                  Add Prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Follow-ups Modal */}
      {showScheduleFollowupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
          <div className="w-full max-w-md sm:max-w-lg rounded-lg bg-white p-2 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Schedule Follow-ups</h3>
              <button
                onClick={() => setShowScheduleFollowupModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <XCircleIcon size={20} />
              </button>
            </div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                // Implement your follow-up scheduling logic here
                alert('Follow-up scheduling logic goes here.');
                setShowScheduleFollowupModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Select Prospect</label>
                <select
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  value={selectedProspectId || ''}
                  onChange={e => setSelectedProspectId(e.target.value)}
                >
                  <option value="">Select a prospect</option>
                  {prospects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowScheduleFollowupModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Prospects Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
          <div className="w-full max-w-md sm:max-w-lg rounded-lg bg-white p-2 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Reassign Prospect</h3>
              <button
                onClick={() => setShowReassignModal(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <XCircleIcon size={20} />
              </button>
            </div>
            <form
              onSubmit={async e => {
                e.preventDefault();
                if (!selectedProspectId || !selectedAmbassadorId) {
                  alert('Please select a prospect and an ambassador.');
                  return;
                }
                // Update the prospect's ambassador_id in Supabase
                const { error } = await supabase
                  .from('schools')
                  .update({ ambassador_id: selectedAmbassadorId })
                  .eq('id', selectedProspectId);
                if (error) {
                  alert('Failed to reassign prospect: ' + error.message);
                  return;
                }
                setShowReassignModal(false);
                setSelectedProspectId(null);
                setSelectedAmbassadorId('');
                // Optionally, refresh prospects list here
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Select Prospect</label>
                <select
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  value={selectedProspectId || ''}
                  onChange={e => setSelectedProspectId(e.target.value)}
                >
                  <option value="">Select a prospect</option>
                  {prospects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Select Ambassador</label>
                <select
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  value={selectedAmbassadorId}
                  onChange={e => setSelectedAmbassadorId(e.target.value)}
                >
                  <option value="">Select ambassador</option>
                  {ambassadors.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowReassignModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
                >
                  Reassign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>;
};