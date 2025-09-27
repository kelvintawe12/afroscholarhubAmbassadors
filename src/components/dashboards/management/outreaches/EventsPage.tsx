import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon, MapPinIcon, UsersIcon, FilterIcon, PlusIcon, SearchIcon,
  MoreHorizontalIcon, EyeIcon, EditIcon, TrashIcon, CheckCircleIcon,
  ClockIcon, AlertCircleIcon, XCircleIcon, UserIcon, DollarSignIcon,
  BarChart3Icon, X, Save, Plus
} from 'lucide-react';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { DataTable } from '../../../ui/widgets/DataTable';
import { LineChart } from '../../../ui/widgets/LineChart';
import { PieChart } from '../../../ui/widgets/PieChart';
import { supabase } from '../../../../utils/supabase';
import { createEvent } from '../../../../api/management';

interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  event_type: string;
  location: string;
  country: string;
  country_code: string;
  region: string;
  expected_attendance: number;
  actual_attendance: number | null;
  budget: number;
  status: string;
  organizer: string;
  schools: string[];
  partners_involved: string[];
}

interface FormData {
  name: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  address: string;
  country_code: string;
  region: string;
  event_type: string;
  expected_attendance: number;
  budget: number;
  status: string;
  priority: string;
}

interface Country {
  code: string;
  name: string;
  flag_emoji?: string;
}

// Add this type above your component
type FormErrors = {
  [K in keyof FormData]?: string;
};

export const OutreachEventsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('upcoming');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [reportEvent, setReportEvent] = useState<Event | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    address: '',
    country_code: '',
    region: '',
    event_type: 'outreach',
    expected_attendance: 0,
    budget: 0,
    status: 'planned',
    priority: 'low'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [countries, setCountries] = useState<Country[]>([]);

  // Fetch countries from Supabase
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data, error } = await supabase.from('countries').select('code, name, flag_emoji');
        if (error) throw error;
        setCountries(data || []);
      } catch (error: any) {
        console.error('Error fetching countries:', error.message);
      }
    };
    fetchCountries();
  }, []);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (error) throw error;
        setEvents(data || []);
        setFilteredEvents(data || []);
      } catch (error: any) {
        console.error('Error fetching events:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter events
  useEffect(() => {
    let filtered = [...events];
    if (filterCountry !== 'all') {
      filtered = filtered.filter(event => event.country_code === filterCountry);
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    const today = new Date();
    if (timeRange === 'upcoming') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.event_date);
        return eventDate >= today;
      });
    } else if (timeRange === 'past') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.event_date);
        return eventDate < today || event.status === 'completed';
      });
    }
    setFilteredEvents(filtered);
  }, [events, filterCountry, filterStatus, searchQuery, timeRange]);

  // Calculate metrics
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date()).length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const totalBudget = events.reduce((sum, event) => sum + event.budget, 0);
  const totalAttendance = events.reduce((sum, event) => sum + (event.actual_attendance || event.expected_attendance), 0);

  // Event metrics for KPI cards
  const eventMetrics = [
    { title: 'Total Events', value: totalEvents.toString(), icon: <CalendarIcon size={20} /> },
    { title: 'Upcoming Events', value: upcomingEvents.toString(), change: 0, icon: <ClockIcon size={20} /> },
    { title: 'Expected Reach', value: totalAttendance.toLocaleString(), icon: <UsersIcon size={20} /> },
    { title: 'Total Budget', value: `$${totalBudget.toLocaleString()}`, icon: <DollarSignIcon size={20} /> }
  ];

  // Events by country data for pie chart
  const uniqueCountryCodes = Array.from(new Set(events.map(e => e.country_code)));
  const eventsByCountryData = {
    labels: uniqueCountryCodes.map(code => {
      const country = countries.find(c => c.code === code);
      return country ? country.name : code;
    }),
    datasets: [{
      data: uniqueCountryCodes.map(code => events.filter(e => e.country_code === code).length),
      backgroundColor: ['#8a8a8a', '#c2b84b', '#6c5a91', '#de734c', '#3b82f6']
    }]
  };

  // Attendance trend chart data (simplified for real data)
  const attendanceTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Expected Attendance',
        data: events.reduce((acc, event) => {
          const month = new Date(event.event_date).getMonth();
          acc[month] = (acc[month] || 0) + event.expected_attendance;
          return acc;
        }, Array(8).fill(0)),
        borderColor: '#1A5F7A',
        backgroundColor: '#8a8a8a',
        fill: false
      },
      {
        label: 'Actual Attendance',
        data: events.reduce((acc, event) => {
          const month = new Date(event.event_date).getMonth();
          if (event.actual_attendance) {
            acc[month] = (acc[month] || 0) + event.actual_attendance;
          }
          return acc;
        }, Array(8).fill(0)),
        borderColor: '#26A269',
        backgroundColor: '#32a852',
        fill: false
      }
    ]
  };

  // Update validateForm to use FormErrors
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name) newErrors.name = 'Event name is required';
    if (!formData.event_date) newErrors.event_date = 'Event date is required';
    if (!formData.start_time) newErrors.start_time = 'Start time is required';
    if (!formData.event_type) newErrors.event_type = 'Event type is required';
    if (!formData.country_code) newErrors.country_code = 'Country code is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.expected_attendance < 0) newErrors.expected_attendance = 'Attendance cannot be negative';
    if (formData.budget < 0) newErrors.budget = 'Budget cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Create event
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const statusMap: Record<string, "planned" | "in-progress" | "completed" | "cancelled"> = {
        planned: "planned",
        confirmed: "planned",
        in_progress: "in-progress",
        completed: "completed",
        cancelled: "cancelled"
      };
      const eventToCreate = {
        ...formData,
        expected_attendance: Number(formData.expected_attendance) || 0,
        budget: Number(formData.budget) || 0,
        created_by: (await supabase.auth.getUser()).data.user?.id || '',
        status: statusMap[formData.status] || "planned"
      };
      await createEvent(eventToCreate);
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
        address: '',
        country_code: '',
        region: '',
        event_type: 'outreach',
        expected_attendance: 0,
        budget: 0,
        status: 'planned',
        priority: 'low'
      });
      // Refresh events
      const { data } = await supabase.from('events').select('*');
      setEvents(data || []);
    } catch (error: any) {
      alert(`Failed to create event: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Open report modal
  const openReportModal = async (eventId: string) => {
    setShowReportModal(true);
    setReportLoading(true);
    setReportEvent(null);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      if (error) throw error;
      setReportEvent(data);
    } catch (error: any) {
      console.error('Error fetching event:', error.message);
    } finally {
      setReportLoading(false);
    }
  };

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          <AlertCircleIcon size={12} className="mr-1" /> Planned
        </span>;
      case 'planning':
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          <ClockIcon size={12} className="mr-1" /> Planning
        </span>;
      case 'confirmed':
        return <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
          <CheckCircleIcon size={12} className="mr-1" /> Confirmed
        </span>;
      case 'completed':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          <CheckCircleIcon size={12} className="mr-1" /> Completed
        </span>;
      case 'cancelled':
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          <XCircleIcon size={12} className="mr-1" /> Cancelled
        </span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          {status}
        </span>;
    }
  };

  // Helper to get country name/flag from code
  const getCountryDisplay = (code: string) => {
    const country = countries.find(c => c.code === code);
    if (!country) return code;
    return (
      <span>
        {country.flag_emoji && <span className="mr-1">{country.flag_emoji}</span>}
        {country.name}
      </span>
    );
  };

  // Event table columns
  const columns = [
    {
      header: 'Event Name',
      accessor: (row: Event) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.description}</div>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Date & Location',
      accessor: (row: Event) => (
        <div>
          <div className="flex items-center font-medium">
            <CalendarIcon size={12} className="mr-1 text-gray-500" /> {row.event_date}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <MapPinIcon size={12} className="mr-1" /> {row.location}
          </div>
        </div>
      )
    },
    {
      header: 'Country',
      accessor: (row: Event) => getCountryDisplay(row.country_code)
    },
    { header: 'Status', accessor: (row: Event) => getStatusBadge(row.status) },
    {
      header: 'Attendance',
      accessor: (row: Event) => (
        <div>
          <div className="font-medium">
            {row.actual_attendance ? row.actual_attendance : `${row.expected_attendance} (est.)`}
          </div>
          {row.actual_attendance && row.expected_attendance && (
            <div className="text-xs text-gray-500">
              {Math.round(row.actual_attendance / row.expected_attendance * 100)}% of target
            </div>
          )}
        </div>
      ),
      sortable: true
    },
    {
      header: 'Budget',
      accessor: (row: Event) => `$${row.budget.toLocaleString()}`,
      sortable: true
    },
    {
      header: 'Organizer',
      accessor: (row: Event) => (
        <div className="flex items-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ash-teal/20 text-ash-teal">
            <UserIcon size={12} />
          </div>
          <span className="ml-2 text-sm">{row.organizer}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (row: Event) => (
        <div className="relative">
          <button
            onClick={() => setShowMenu(showMenu === row.id ? null : row.id)}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <MoreHorizontalIcon size={16} />
          </button>
          {showMenu === row.id && (
            <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              <button
                className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => openReportModal(row.id)}
              >
                <EyeIcon size={14} className="mr-2 text-gray-500" /> View Details
              </button>
              <button
                className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => navigate(`/dashboard/management/outreaches/edit/${row.id}`)}
              >
                <EditIcon size={14} className="mr-2 text-gray-500" /> Edit Event
              </button>
              <button className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                <TrashIcon size={14} className="mr-2" /> Cancel Event
              </button>
            </div>
          )}
        </div>
      )
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Outreach Events</h1>
          <p className="text-sm text-gray-500">Plan, manage, and track all outreach events across countries</p>
        </div>

        {/* Event metrics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {eventMetrics.map((metric, index) => (
            <KpiCard key={index} title={metric.title} value={metric.value} change={metric.change} icon={metric.icon} />
          ))}
        </div>

        {/* Charts */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LineChart title="Event Attendance" subtitle="Expected vs actual attendance" data={attendanceTrendData} />
          <div className="flex flex-col">
            <PieChart title="Events by Country" data={eventsByCountryData} height={250} />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="text-2xl font-bold text-ash-teal">{completedEvents}</div>
                <div className="text-sm text-gray-500">Completed Events</div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="text-2xl font-bold text-ash-teal">{upcomingEvents}</div>
                <div className="text-sm text-gray-500">Upcoming Events</div>
              </div>
            </div>
          </div>
        </div>

        {/* Time range selector */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${timeRange === 'all' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('all')}
            >
              All Events
            </button>
            <button
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${timeRange === 'upcoming' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${timeRange === 'past' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setTimeRange('past')}
            >
              Past Events
            </button>
          </div>
          <div className="flex w-full sm:w-auto">
            <button
              className="flex w-full sm:w-auto items-center justify-center rounded-md bg-ash-teal px-3 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusIcon size={16} className="mr-2" />
              Create Event
            </button>
          </div>
        </div>

        {/* Filters and search */}
        <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          <div className="flex w-full flex-wrap items-center space-x-2 sm:w-auto">
            <button
              className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon size={16} className="mr-2" /> Filter
            </button>
            <div className="relative">
              <select
                className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="planned">Planned</option>
                <option value="planning">Planning</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="relative">
              <select
                className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50"
                value={filterCountry}
                onChange={e => setFilterCountry(e.target.value)}
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag_emoji ? `${country.flag_emoji} ` : ''}{country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search events..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-medium text-gray-700">Advanced Filters</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Event Size</label>
                <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                  <option value="all">All Sizes</option>
                  <option value="small">Small ( 200)</option>
                  <option value="medium">Medium (200-500)</option>
                  <option value="large">Large ({'>'} 500)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Organizer</label>
                <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                  <option value="all">All Organizers</option>
                  {Array.from(new Set(events.map(e => e.organizer))).map(organizer => (
                    <option key={organizer} value={organizer}>{organizer}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Date Range</label>
                <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                  <option value="all">All Dates</option>
                  <option value="month">Next 30 days</option>
                  <option value="quarter">Next 90 days</option>
                  <option value="past">Past events</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end spacex-2">
              <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                Reset Filters
              </button>
              <button className="rounded-md bg-ash-teal px-3 py-1.5 text-xs font-medium text-white hover:bg-ash-teal/90">
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Events table */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
          </div>
        ) : (
          <div className="mb-6">
            <DataTable columns={columns} data={filteredEvents} keyField="id" rowsPerPage={10} showSearch={false} />
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-base font-medium text-gray-700">Upcoming Events</h3>
            <div className="space-y-3">
              {events
                .filter(event => new Date(event.event_date) >= new Date() && event.status !== 'cancelled')
                .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
                .slice(0, 3)
                .map(event => (
                  <div key={event.id} className="flex items-start rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-ash-teal text-white">
                      <CalendarIcon size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.name}</h4>
                      <div className="mt-1 flex items-center text-xs text-gray-500">
                        <CalendarIcon size={12} className="mr-1" /> {event.event_date}
                      </div>
                      <div className="mt-0.5 flex items-center text-xs text-gray-500">
                        <MapPinIcon size={12} className="mr-1" /> {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              {events.filter(event => new Date(event.event_date) >= new Date() && event.status !== 'cancelled').length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                  <p className="text-sm text-gray-500">No upcoming events</p>
                </div>
              )}
              <div className="pt-2 text-center">
                <button
                  className="text-sm font-medium text-ash-teal hover:text-ash-teal/80"
                  onClick={() => setTimeRange('upcoming')}
                >
                  View All Events
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-base font-medium text-gray-700">Event Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                  <span className="text-sm font-medium text-gray-900">
                    {events.filter(e => e.actual_attendance && e.expected_attendance).length > 0
                      ? Math.round(
                          events.reduce((sum, e) => sum + (e.actual_attendance || 0), 0) /
                            events.reduce((sum, e) => sum + (e.expected_attendance || 0), 0) * 100
                        ) + '%'
                      : 'N/A'}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-ash-teal"
                    style={{
                      width: events.filter(e => e.actual_attendance && e.expected_attendance).length > 0
                        ? Math.round(
                            events.reduce((sum, e) => sum + (e.actual_attendance || 0), 0) /
                              events.reduce((sum, e) => sum + (e.expected_attendance || 0), 0) * 100
                          ) + '%'
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
                  <span className="text-sm font-medium text-gray-900">N/A</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-ash-gold" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Lead Conversion</span>
                  <span className="text-sm font-medium text-gray-900">N/A</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div className="pt-2 text-center">
                <button className="text-sm font-medium text-ash-teal hover:text-ash-teal/80">
                  View Detailed Analytics
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-base font-medium text-gray-700">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon size={16} className="mr-2" /> Create New Event
              </button>
              <button
                className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10"
                onClick={() => navigate('/dashboard/management/outreaches/calendar')}
              >
                <CalendarIcon size={16} className="mr-2" /> View Calendar
              </button>
              <button
                className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10"
                onClick={() => setShowReportModal(true)}
              >
                <BarChart3Icon size={16} className="mr-2" /> Event Reports
              </button>
            </div>
          </div>
        </div>

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Event</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input
                    className={`w-full mt-1 p-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    placeholder="e.g. School Outreach"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      className={`w-full mt-1 p-3 border ${errors.event_date ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={formData.event_date}
                      onChange={e => handleInputChange('event_date', e.target.value)}
                      required
                    />
                    {errors.event_date && <p className="text-red-500 text-xs mt-1">{errors.event_date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                      type="time"
                      className={`w-full mt-1 p-3 border ${errors.start_time ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={formData.start_time}
                      onChange={e => handleInputChange('start_time', e.target.value)}
                      required
                    />
                    {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.end_time}
                    onChange={e => handleInputChange('end_time', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Type</label>
                  <select
                    className={`w-full mt-1 p-3 border ${errors.event_type ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    value={formData.event_type}
                    onChange={e => handleInputChange('event_type', e.target.value)}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="outreach">School Visit</option>
                    <option value="meeting">Meeting</option>
                    <option value="workshop">Workshop</option>
                    <option value="webinar">Webinar</option>
                    <option value="training">Training</option>
                    <option value="milestone">Milestone</option>
                  </select>
                  {errors.event_type && <p className="text-red-500 text-xs mt-1">{errors.event_type}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.priority}
                      onChange={e => handleInputChange('priority', e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.status}
                      onChange={e => handleInputChange('status', e.target.value)}
                    >
                      <option value="planned">Planned</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <select
                      className={`w-full mt-1 p-3 border ${errors.country_code ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={formData.country_code}
                      onChange={e => handleInputChange('country_code', e.target.value)}
                      required
                    >
                      <option value="">Select country</option>
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.flag_emoji ? `${country.flag_emoji} ` : ''}{country.name}
                        </option>
                      ))}
                    </select>
                    {errors.country_code && <p className="text-red-500 text-xs mt-1">{errors.country_code}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Region</label>
                    <input
                      className={`w-full mt-1 p-3 border ${errors.region ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="e.g. South West"
                      value={formData.region}
                      onChange={e => handleInputChange('region', e.target.value)}
                      required
                    />
                    {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    className={`w-full mt-1 p-3 border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter event location"
                    value={formData.location}
                    onChange={e => handleInputChange('location', e.target.value)}
                    required
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={e => handleInputChange('address', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Attendance</label>
                    <input
                      type="number"
                      className={`w-full mt-1 p-3 border ${errors.expected_attendance ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="e.g. 100"
                      value={formData.expected_attendance}
                      onChange={e => handleInputChange('expected_attendance', Number(e.target.value))}
                      min={0}
                      required
                    />
                    {errors.expected_attendance && <p className="text-red-500 text-xs mt-1">{errors.expected_attendance}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget (₦)</label>
                    <input
                      type="number"
                      className={`w-full mt-1 p-3 border ${errors.budget ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="e.g. 50000"
                      value={formData.budget}
                      onChange={e => handleInputChange('budget', Number(e.target.value))}
                      min={0}
                      required
                    />
                    {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter event description"
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                    onClick={() => setShowCreateModal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                    disabled={isLoading}
                  >
                    <Save size={18} /> {isLoading ? 'Creating...' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Event Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Event Report</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Event</label>
                <select
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedEventId || ''}
                  onChange={e => {
                    setSelectedEventId(e.target.value);
                    if (e.target.value) openReportModal(e.target.value);
                  }}
                >
                  <option value="">Select an event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
              </div>
              {reportLoading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : reportEvent ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">{reportEvent.name}</h3>
                  <p className="text-gray-600">{reportEvent.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><span className="font-medium text-gray-700">Date:</span> {reportEvent.event_date}</div>
                    <div><span className="font-medium text-gray-700">Location:</span> {reportEvent.location}</div>
                    <div><span className="font-medium text-gray-700">Type:</span> {reportEvent.event_type}</div>
                    <div><span className="font-medium text-gray-700">Expected Attendance:</span> {reportEvent.expected_attendance}</div>
                    <div><span className="font-medium text-gray-700">Actual Attendance:</span> {reportEvent.actual_attendance || 'N/A'}</div>
                    <div><span className="font-medium text-gray-700">Budget:</span> ₦{reportEvent.budget}</div>
                    <div><span className="font-medium text-gray-700">Status:</span> {reportEvent.status}</div>
                    <div><span className="font-medium text-gray-700">Organizer:</span> {reportEvent.organizer}</div>
                    <div><span className="font-medium text-gray-700">Schools:</span> {reportEvent.schools?.join(', ') || 'N/A'}</div>
                    <div><span className="font-medium text-gray-700">Partners:</span> {reportEvent.partners_involved?.join(', ') || 'N/A'}</div>
                  </div>
                </div>
              ) : (
                <div className="text-red-500 text-center">Please select an event.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutreachEventsPage;