import React, { useEffect, useState } from 'react';
import { CalendarIcon, MapPinIcon, UsersIcon, FilterIcon, PlusIcon, SearchIcon, MoreHorizontalIcon, EyeIcon, EditIcon, TrashIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, XCircleIcon, UserIcon, DollarSignIcon, BarChart3Icon } from 'lucide-react';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { DataTable } from '../../../ui/widgets/DataTable';
import { LineChart } from '../../../ui/widgets/LineChart';
import { PieChart } from '../../../ui/widgets/PieChart';
export const OutreachEventsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState('upcoming');
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockEvents = [{
        id: 1,
        name: 'Career Fair 2025',
        description: 'Annual career fair showcasing opportunities for high school students',
        eventDate: 'June 25, 2025',
        location: 'Lagos Convention Center',
        country: 'Nigeria',
        region: 'Lagos',
        expectedAttendance: 500,
        actualAttendance: null,
        budget: 2500,
        status: 'planned',
        organizer: 'Aisha Mohammed',
        schools: ['Lagos Model School', 'Abuja Grammar School', 'Ibadan High School'],
        partnersInvolved: ['Tech Nigeria', 'EduFirst']
      }, {
        id: 2,
        name: 'STEM Workshop',
        description: 'Interactive workshop focusing on science and technology careers',
        eventDate: 'July 10, 2025',
        location: 'Nairobi Science Center',
        country: 'Kenya',
        region: 'Nairobi',
        expectedAttendance: 200,
        actualAttendance: null,
        budget: 1800,
        status: 'planning',
        organizer: 'John Kamau',
        schools: ['Nairobi Academy', 'Mombasa International School'],
        partnersInvolved: ['Kenya Science Foundation', 'Microsoft Africa']
      }, {
        id: 3,
        name: 'Education Summit',
        description: 'Summit bringing together educators and students to discuss future of education',
        eventDate: 'July 5, 2025',
        location: 'Accra Conference Hall',
        country: 'Ghana',
        region: 'Accra',
        expectedAttendance: 350,
        actualAttendance: null,
        budget: 3000,
        status: 'confirmed',
        organizer: 'Grace Osei',
        schools: ['Accra High School', 'Tema International School', 'Kumasi Academy'],
        partnersInvolved: ['Ghana Education Service', 'AfriLearn']
      }, {
        id: 4,
        name: 'University Fair',
        description: 'Showcase of university opportunities for high school students',
        eventDate: 'August 15, 2025',
        location: 'Cape Town Exhibition Center',
        country: 'South Africa',
        region: 'Cape Town',
        expectedAttendance: 600,
        actualAttendance: null,
        budget: 4000,
        status: 'planning',
        organizer: 'Samuel Dlamini',
        schools: ['Cape Town Secondary', 'Pretoria Boys High School'],
        partnersInvolved: ['University of Cape Town', 'Stellenbosch University']
      }, {
        id: 5,
        name: 'Scholarship Workshop',
        description: 'Information session about available scholarships and application process',
        eventDate: 'May 20, 2025',
        location: 'Virtual Event',
        country: 'Multiple',
        region: 'Online',
        expectedAttendance: 800,
        actualAttendance: 750,
        budget: 1000,
        status: 'completed',
        organizer: 'Management Team',
        schools: ['Multiple Schools'],
        partnersInvolved: ['AfroScholarHub Foundation', 'Global Education Fund']
      }, {
        id: 6,
        name: 'Tech Career Day',
        description: 'Focused event on technology career paths and opportunities',
        eventDate: 'April 15, 2025',
        location: 'Kano Tech Hub',
        country: 'Nigeria',
        region: 'Kano',
        expectedAttendance: 250,
        actualAttendance: 280,
        budget: 1500,
        status: 'completed',
        organizer: 'Fatima Abdullahi',
        schools: ['Kano Model College', 'Kaduna International School'],
        partnersInvolved: ['Nigerian Tech Association', 'Google Developer Groups']
      }];
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);
  useEffect(() => {
    if (events.length > 0) {
      let filtered = [...events];
      // Apply country filter
      if (filterCountry !== 'all') {
        filtered = filtered.filter(event => event.country === filterCountry);
      }
      // Apply status filter
      if (filterStatus !== 'all') {
        filtered = filtered.filter(event => event.status === filterStatus);
      }
      // Apply search
      if (searchQuery) {
        filtered = filtered.filter(event => event.name.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase()) || event.location.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      // Apply time range filter
      const today = new Date();
      if (timeRange === 'upcoming') {
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.eventDate);
          return eventDate >= today;
        });
      } else if (timeRange === 'past') {
        filtered = filtered.filter(event => {
          const eventDate = new Date(event.eventDate);
          return eventDate < today || event.status === 'completed';
        });
      }
      setFilteredEvents(filtered);
    }
  }, [events, filterCountry, filterStatus, searchQuery, timeRange]);
  // Calculate metrics
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.eventDate) >= new Date()).length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const totalBudget = events.reduce((sum, event) => sum + event.budget, 0);
  const totalAttendance = events.reduce((sum, event) => sum + (event.actualAttendance || event.expectedAttendance), 0);
  // Event metrics for KPI cards
  const eventMetrics = [{
    title: 'Total Events',
    value: totalEvents.toString(),
    icon: <CalendarIcon size={20} />
  }, {
    title: 'Upcoming Events',
    value: upcomingEvents.toString(),
    change: 2,
    icon: <ClockIcon size={20} />
  }, {
    title: 'Expected Reach',
    value: totalAttendance.toLocaleString(),
    icon: <UsersIcon size={20} />
  }, {
    title: 'Total Budget',
    value: `$${totalBudget.toLocaleString()}`,
    icon: <DollarSignIcon size={20} />
  }];
  // Events by country data for pie chart
  const eventsByCountryData = {
    labels: ['Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Multiple'],
    datasets: [{
      data: [events.filter(e => e.country === 'Nigeria').length, events.filter(e => e.country === 'Kenya').length, events.filter(e => e.country === 'Ghana').length, events.filter(e => e.country === 'South Africa').length, events.filter(e => e.country === 'Multiple').length],
      backgroundColor: ['red #8a8a8a', 'red #8a8a8a', 'yellow #c2b84b', 'indigo #6c5a91', 'tomato #de734c']
    }]
  };
  // Attendance trend chart data
  const attendanceTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [{
      label: 'Expected Attendance',
      data: [0, 0, 0, 250, 800, 500, 550, 600],
      borderColor: '#1A5F7A',
      backgroundColor: 'red #8a8a8a',
      fill: false
    }, {
      label: 'Actual Attendance',
      data: [0, 0, 0, 280, 750, 0, 0, 0],
      borderColor: '#26A269',
      backgroundColor: 'green #32a852',
      fill: false
    }]
  };
  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <AlertCircleIcon size={12} className="mr-1" />
            Planned
          </span>;
      case 'planning':
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <ClockIcon size={12} className="mr-1" />
            Planning
          </span>;
      case 'confirmed':
        return <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
            <CheckCircleIcon size={12} className="mr-1" />
            Confirmed
          </span>;
      case 'completed':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon size={12} className="mr-1" />
            Completed
          </span>;
      case 'cancelled':
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircleIcon size={12} className="mr-1" />
            Cancelled
          </span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>;
    }
  };
  // Event table columns
  const columns = [{
    header: 'Event Name',
    accessor: (row: any) => <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.description}</div>
        </div>,
    sortable: true
  }, {
    header: 'Date & Location',
    accessor: (row: any) => <div>
          <div className="flex items-center font-medium">
            <CalendarIcon size={12} className="mr-1 text-gray-500" />
            {row.eventDate}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <MapPinIcon size={12} className="mr-1" />
            {row.location}
          </div>
        </div>
  }, {
    header: 'Country',
    accessor: 'country'
  }, {
    header: 'Status',
    accessor: (row: any) => getStatusBadge(row.status)
  }, {
    header: 'Attendance',
    accessor: (row: any) => <div>
          <div className="font-medium">
            {row.actualAttendance ? row.actualAttendance : `${row.expectedAttendance} (est.)`}
          </div>
          {row.actualAttendance && row.expectedAttendance && <div className="text-xs text-gray-500">
              {Math.round(row.actualAttendance / row.expectedAttendance * 100)}
              % of target
            </div>}
        </div>,
    sortable: true
  }, {
    header: 'Budget',
    accessor: (row: any) => `$${row.budget.toLocaleString()}`,
    sortable: true
  }, {
    header: 'Organizer',
    accessor: (row: any) => <div className="flex items-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ash-teal/20 text-ash-teal">
            <UserIcon size={12} />
          </div>
          <span className="ml-2 text-sm">{row.organizer}</span>
        </div>
  }, {
    header: 'Actions',
    accessor: (row: any) => <div className="relative">
          <button onClick={() => setShowMenu(showMenu === row.id ? null : row.id)} className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
            <MoreHorizontalIcon size={16} />
          </button>
          {showMenu === row.id && <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              <button className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50">
                <EyeIcon size={14} className="mr-2 text-gray-500" />
                View Details
              </button>
              <button className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50">
                <EditIcon size={14} className="mr-2 text-gray-500" />
                Edit Event
              </button>
              <button className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50">
                <TrashIcon size={14} className="mr-2" />
                Cancel Event
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
        <h1 className="text-2xl font-bold text-gray-900">Outreach Events</h1>
        <p className="text-sm text-gray-500">
          Plan, manage, and track all outreach events across countries
        </p>
      </div>

      {/* Event metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {eventMetrics.map((metric, index) => <KpiCard key={index} title={metric.title} value={metric.value} change={metric.change} icon={metric.icon} />)}
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChart title="Event Attendance" subtitle="Expected vs actual attendance" data={attendanceTrendData} />
        <div className="flex flex-col">
          <PieChart title="Events by Country" data={eventsByCountryData} height={250} />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-2xl font-bold text-ash-teal">
                {completedEvents}
              </div>
              <div className="text-sm text-gray-500">Completed Events</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-2xl font-bold text-ash-teal">
                {upcomingEvents}
              </div>
              <div className="text-sm text-gray-500">Upcoming Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Time range selector */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className={`rounded-md px-3 py-1.5 text-sm font-medium ${timeRange === 'all' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setTimeRange('all')}>
            All Events
          </button>
          <button className={`rounded-md px-3 py-1.5 text-sm font-medium ${timeRange === 'upcoming' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setTimeRange('upcoming')}>
            Upcoming
          </button>
          <button className={`rounded-md px-3 py-1.5 text-sm font-medium ${timeRange === 'past' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setTimeRange('past')}>
            Past Events
          </button>
        </div>
        <button className="flex items-center rounded-md bg-ash-teal px-3 py-2 text-sm font-medium text-white hover:bg-ash-teal/90" onClick={() => {}}>
          <PlusIcon size={16} className="mr-2" />
          Create Event
        </button>
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
              <option value="planned">Planned</option>
              <option value="planning">Planning</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50" value={filterCountry} onChange={e => setFilterCountry(e.target.value)}>
              <option value="all">All Countries</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="Ghana">Ghana</option>
              <option value="South Africa">South Africa</option>
              <option value="Multiple">Multiple</option>
            </select>
          </div>
        </div>
        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon size={16} className="text-gray-400" />
          </div>
          <input type="search" placeholder="Search events..." className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                Event Size
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Sizes</option>
                <option value="small">Small ( 200)</option>
                <option value="medium">Medium (200-500)</option>
                <option value="large">Large ({'>'} 500)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Organizer
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Organizers</option>
                <option value="Aisha Mohammed">Aisha Mohammed</option>
                <option value="John Kamau">John Kamau</option>
                <option value="Grace Osei">Grace Osei</option>
                <option value="Samuel Dlamini">Samuel Dlamini</option>
                <option value="Fatima Abdullahi">Fatima Abdullahi</option>
                <option value="Management Team">Management Team</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Date Range
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Dates</option>
                <option value="month">Next 30 days</option>
                <option value="quarter">Next 90 days</option>
                <option value="past">Past events</option>
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

      {/* Events table */}
      {isLoading ? <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
        </div> : <div className="mb-6">
          <DataTable columns={columns} data={filteredEvents} keyField="id" rowsPerPage={10} showSearch={false} />
        </div>}

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-medium text-gray-700">
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {events.filter(event => new Date(event.eventDate) >= new Date() && event.status !== 'cancelled').sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()).slice(0, 3).map(event => <div key={event.id} className="flex items-start rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-ash-teal text-white">
                    <CalendarIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{event.name}</h4>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <CalendarIcon size={12} className="mr-1" />
                      {event.eventDate}
                    </div>
                    <div className="mt-0.5 flex items-center text-xs text-gray-500">
                      <MapPinIcon size={12} className="mr-1" />
                      {event.location}
                    </div>
                  </div>
                </div>)}
            {events.filter(event => new Date(event.eventDate) >= new Date() && event.status !== 'cancelled').length === 0 && <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-500">No upcoming events</p>
              </div>}
            <div className="pt-2 text-center">
              <button className="text-sm font-medium text-ash-teal hover:text-ash-teal/80">
                View All Events
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-medium text-gray-700">
            Event Performance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Attendance Rate
                </span>
                <span className="text-sm font-medium text-gray-900">93.8%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-ash-teal" style={{
                width: '93.8%'
              }}></div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Budget Utilization
                </span>
                <span className="text-sm font-medium text-gray-900">87.5%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-ash-gold" style={{
                width: '87.5%'
              }}></div>
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Lead Conversion
                </span>
                <span className="text-sm font-medium text-gray-900">42.3%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 rounded-full bg-green-500" style={{
                width: '42.3%'
              }}></div>
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
          <h3 className="mb-3 text-base font-medium text-gray-700">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
              <PlusIcon size={16} className="mr-2" />
              Create New Event
            </button>
            <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
              <CalendarIcon size={16} className="mr-2" />
              View Calendar
            </button>
            <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
              <BarChart3Icon size={16} className="mr-2" />
              Event Reports
            </button>
          </div>
        </div>
      </div>
    </div>;
};