import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Download,
  Zap,
  GraduationCap,
  Activity,
  List,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../utils/supabase';

interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  type: 'visit' | 'meeting' | 'workshop' | 'webinar' | 'training' | 'milestone';
  location?: string;
  ambassador: {
    name: string;
    avatar?: string;
    role: string;
  };
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  attendees?: number;
  leadsGenerated?: number;
  country?: string;
  flag?: string;
  color: string;
  tags?: string[];
}

interface Country {
  code: string;
  name: string;
  flag_emoji?: string;
  // ...other fields if needed
}

interface EventTypeConfig {
  [key: string]: {
    color: string;
    icon: React.ReactNode;
    label: string;
  };
}

interface ViewMode {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface DayViewProps {
  selectedDate: Date;
  events: Event[];
  eventTypeConfig: EventTypeConfig;
  navigateToDate: (date: Date) => void;
  viewEventDetails: (event: Event) => void;
  getEventColor: (eventType: string) => string;
  createNewEvent: () => void;
  formatDate: (date: Date) => string;
}

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  navigateToDate: (date: Date) => void;
  events: Event[];
  eventTypeConfig: EventTypeConfig;
  navigateMonth: (direction: 'prev' | 'next') => void;
  viewEventDetails: (event: Event) => void;
  getEventColor: (eventType: string) => string;
  formatDate: (date: Date) => string;
  calendarDays: CalendarDay[];
  currentMonthEvents: Event[];
  todayEvents: Event[];
}

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  eventTypeConfig: EventTypeConfig;
  navigateToDate: (date: Date) => void;
  setCurrentDate: (date: Date) => void;
  viewEventDetails: (event: Event) => void;
  getEventColor: (eventType: string) => string;
  formatDate: (date: Date) => string;
}

interface AgendaViewProps {
  events: Event[];
  eventTypeConfig: EventTypeConfig;
  navigateToDate: (date: Date) => void;
  viewEventDetails: (event: Event) => void;
  createNewEvent: () => void;
}

interface EventModalProps {
  event: Event;
  eventTypeConfig: EventTypeConfig;
  onClose: () => void;
  onEdit: () => void;
  getEventColor: (eventType: string) => string;
}

const VIEW_MODES: ViewMode[] = [
  { id: 'month', label: 'Month', icon: <Calendar size={18} /> },
  { id: 'week', label: 'Week', icon: <Activity size={18} /> },
  { id: 'day', label: 'Day', icon: <Clock size={18} /> },
  { id: 'agenda', label: 'Agenda', icon: <List size={18} /> }
];

const EVENT_TYPE_CONFIG: EventTypeConfig = {
  visit: { color: '#3B82F6', icon: <MapPin size={16} />, label: 'School Visit' },
  meeting: { color: '#10B981', icon: <Users size={16} />, label: 'Meeting' },
  workshop: { color: '#8B5CF6', icon: <GraduationCap size={16} />, label: 'Workshop' },
  webinar: { color: '#F59E0B', icon: <Zap size={16} />, label: 'Webinar' },
  training: { color: '#6366F1', icon: <Award size={16} />, label: 'Training' },
  milestone: { color: '#EC4899', icon: <CheckCircle size={16} />, label: 'Milestone' }
};

const PRIORITY_CONFIG = {
  low: { color: 'bg-gray-100 text-gray-700', label: 'Low' },
  medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-800', label: 'High' },
  critical: { color: 'bg-red-100 text-red-800', label: 'Critical' }
};

const STATUS_CONFIG = {
  scheduled: { color: 'bg-gray-100 text-gray-700', label: 'Scheduled' },
  confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
  completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
  cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
};

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Lagos Model College - STEM Workshop',
    date: '2024-12-18',
    startTime: '09:00',
    endTime: '12:00',
    type: 'workshop',
    location: 'Lagos Model College, Ikeja',
    ambassador: {
      name: 'Aisha Bello',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      role: 'Lead Ambassador'
    },
    status: 'confirmed',
    priority: 'high',
    description: 'Interactive STEM workshop for 45 high school students',
    attendees: 45,
    leadsGenerated: 28,
    country: 'NG',
    flag: '🇳🇬',
    color: '#8B5CF6',
    tags: ['STEM', 'Workshop', 'High School']
  },
  {
    id: '2',
    title: 'Partnership Meeting - Accra Technical University',
    date: '2024-12-20',
    startTime: '14:00',
    endTime: '16:30',
    type: 'meeting',
    location: 'Virtual (Zoom)',
    ambassador: {
      name: 'Kwame Mensah',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      role: 'Country Coordinator'
    },
    status: 'scheduled',
    priority: 'critical',
    description: 'Finalizing engineering scholarship partnership agreement',
    attendees: 8,
    leadsGenerated: 0,
    country: 'GH',
    flag: '🇬🇭',
    color: '#10B981',
    tags: ['Partnership', 'Engineering', 'University']
  },
  {
    id: '3',
    title: 'Women in Tech Webinar',
    date: '2024-12-22',
    startTime: '18:00',
    endTime: '19:30',
    type: 'webinar',
    location: 'YouTube Live',
    ambassador: {
      name: 'Fatima Ali',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      role: 'Field Ambassador'
    },
    status: 'confirmed',
    priority: 'medium',
    description: 'Virtual event for female STEM students across East Africa',
    attendees: 120,
    leadsGenerated: 67,
    country: 'multi',
    flag: '🌍',
    color: '#F59E0B',
    tags: ['Webinar', 'Women in Tech', 'STEM']
  },
  {
    id: '4',
    title: 'Q4 Ambassador Training Bootcamp',
    date: '2024-12-28',
    startTime: '09:00',
    endTime: '17:00',
    type: 'training',
    location: 'Hybrid (Lagos & Virtual)',
    ambassador: {
      name: 'Thabo Mthembu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      role: 'Regional Lead'
    },
    status: 'scheduled',
    priority: 'high',
    description: 'Comprehensive training for new and existing ambassadors',
    attendees: 89,
    leadsGenerated: 0,
    country: 'NG',
    flag: '🇳🇬',
    color: '#6366F1',
    tags: ['Training', 'Bootcamp', 'Professional Development']
  },
  {
    id: '5',
    title: 'Scholarship Fair - University of Nairobi',
    date: '2024-12-15',
    startTime: '10:00',
    endTime: '15:00',
    type: 'visit',
    location: 'University of Nairobi, Kikuyu Campus',
    ambassador: {
      name: 'James Otieno',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      role: 'Field Ambassador'
    },
    status: 'completed',
    priority: 'medium',
    description: 'Annual scholarship fair with 200+ student attendees',
    attendees: 200,
    leadsGenerated: 156,
    country: 'KE',
    flag: '🇰🇪',
    color: '#3B82F6',
    tags: ['Scholarship Fair', 'University', 'Student Outreach']
  }
];

// Utility Functions
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const generateCalendarDays = (date: Date): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: CalendarDay[] = [];

  // Previous month days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month, -(i + 1)),
      isCurrentMonth: false,
      isToday: false
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    days.push({
      date: currentDate,
      isCurrentMonth: true,
      isToday: formatDate(currentDate) === formatDate(new Date())
    });
  }

  // Next month days to fill grid
  const remainingDays = 42 - days.length; // 6 rows × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      isToday: false
    });
  }

  return days;
};

const getEventsForView = (events: Event[], startDate: Date, endDate: Date): Event[] => {
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });
};

const getEventColor = (eventType: string, eventTypeConfig: EventTypeConfig): string => {
  return eventTypeConfig[eventType as keyof typeof EVENT_TYPE_CONFIG]?.color || '#6B7280';
};

// Main Calendar Component
export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    country: 'all',
    priority: 'all'
  });
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const navigate = useNavigate();

  // Fetch countries from Supabase
  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('code, name, flag_emoji');
      if (!error && data) setCountries(data);
    };
    fetchCountries();
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const matchesType = filters.type === 'all' || event.type === filters.type;
      const matchesStatus = filters.status === 'all' || event.status === filters.status;
      const matchesCountry = filters.country === 'all' || 
        (event.country === filters.country);
      const matchesPriority = filters.priority === 'all' || event.priority === filters.priority;
      
      return matchesType && matchesStatus && matchesCountry && matchesPriority;
    });
  }, [filters]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    return generateCalendarDays(currentDate);
  }, [currentDate]);

  // Get events for today
  const todayEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getEventsForView(filteredEvents, today, tomorrow);
  }, [filteredEvents]);

  // Month events
  const currentMonthEvents = useMemo(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    return getEventsForView(filteredEvents, firstDay, lastDay);
  }, [currentDate, filteredEvents]);

  // Event handlers
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  }, []);

  const navigateToDate = useCallback((date: Date) => {
    setCurrentDate(date);
    setSelectedDate(date);
    setViewMode('day');
  }, []);

  const createNewEvent = useCallback(() => {
    navigate('/dashboard/management/outreaches/events/new');
  }, [navigate]);

  const viewEventDetails = useCallback((event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  }, []);

  // Helper to get country display (flag + name) from code
  const getCountryDisplay = useCallback(
    (code?: string) => {
      if (!code) return '';
      const country = countries.find(c => c.code === code);
      if (!country) return code;
      return (
        <>
          {country.flag_emoji && <span>{country.flag_emoji} </span>}
          {country.name}
        </>
      );
    },
    [countries]
  );

  return (
    <div className="space-y-6 p-2 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
            Outreach Calendar
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {currentMonthEvents.length} events • {todayEvents.length} today
          </p>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1 w-full sm:w-auto">
            {VIEW_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`
                  flex items-center gap-2 px-2 py-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all w-full sm:w-auto
                  ${viewMode === mode.id 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {mode.icon}
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={createNewEvent}
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all w-full sm:w-auto"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Event</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3 items-stretch sm:items-center">
          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Type:</span>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {Object.entries(EVENT_TYPE_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Status:</span>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Country:</span>
            <select
              value={filters.country}
              onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag_emoji ? `${country.flag_emoji} ` : ''}{country.name}
                </option>
              ))}
              <option value="multi">Multi-country 🌍</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Priority:</span>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="text-xs sm:text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => setFilters({ type: 'all', status: 'all', country: 'all', priority: 'all' })}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Calendar Views */}
      <div className="space-y-6">
        {viewMode === 'month' && (
          <MonthView
            currentDate={currentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            navigateToDate={navigateToDate}
            events={filteredEvents}
            eventTypeConfig={EVENT_TYPE_CONFIG}
            navigateMonth={navigateMonth}
            viewEventDetails={viewEventDetails}
            getEventColor={(type) => getEventColor(type, EVENT_TYPE_CONFIG)}
            formatDate={formatDate}
            calendarDays={calendarDays}
            currentMonthEvents={currentMonthEvents}
            todayEvents={todayEvents}
          />
        )}
        
        {viewMode === 'week' && (
          <WeekView
            currentDate={currentDate}
            events={filteredEvents}
            eventTypeConfig={EVENT_TYPE_CONFIG}
            navigateToDate={navigateToDate}
            setCurrentDate={setCurrentDate}
            viewEventDetails={viewEventDetails}
            getEventColor={(type) => getEventColor(type, EVENT_TYPE_CONFIG)}
            formatDate={formatDate}
          />
        )}
        
        {viewMode === 'day' && (
          <DayView
            selectedDate={selectedDate}
            events={getEventsForView(filteredEvents, selectedDate, selectedDate)}
            eventTypeConfig={EVENT_TYPE_CONFIG}
            navigateToDate={navigateToDate}
            viewEventDetails={viewEventDetails}
            getEventColor={(type) => getEventColor(type, EVENT_TYPE_CONFIG)}
            createNewEvent={createNewEvent}
            formatDate={formatDate}
          />
        )}
        
        {viewMode === 'agenda' && (
          <AgendaView 
            events={currentMonthEvents}
            eventTypeConfig={EVENT_TYPE_CONFIG}
            navigateToDate={navigateToDate}
            viewEventDetails={viewEventDetails}
            createNewEvent={createNewEvent}
          />
        )}
      </div>

      {/* Event Modal */}
      {showEventModal && selectedEvent && (
        <EventModal 
          event={selectedEvent}
          eventTypeConfig={EVENT_TYPE_CONFIG}
          onClose={() => setShowEventModal(false)}
          onEdit={() => {
            setShowEventModal(false);
            if (selectedEvent) {
              navigate(`/dashboard/management/outreaches/events/${selectedEvent.id}/edit`);
            }
          }}
          getEventColor={(type) => getEventColor(type, EVENT_TYPE_CONFIG)}
        />
      )}

      {/* Create Event Modal (Newly Added) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Create New Event</h2>
            <p className="text-gray-600 text-sm">Plan and schedule your next outreach event</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={() => {
                setShowEventModal(true);
                // Additional logic for creating a new event can be added here
              }}
            >
              Create Event
            </button>
            <button
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
              onClick={() => {
                // Logic for viewing a sample report can be added here
              }}
            >
              View Sample Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Month View Component
const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  navigateToDate,
  events,
  eventTypeConfig,
  navigateMonth,
  viewEventDetails,
  getEventColor,
  formatDate,
  calendarDays,
  currentMonthEvents,
  todayEvents
}) => {
  const getEventsForDay = useCallback((date: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  }, [events]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-0 min-w-0">
        <button
          onClick={() => navigateMonth('prev')}
          className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex-shrink-0"
        >
          <ChevronLeft size={20} className="group-hover:text-blue-500 transition-colors" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-500">
            Previous
          </span>
        </button>
        
        <div className="flex-1 min-w-0 text-center">
          <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-1">
            <span>{currentMonthEvents.length} events</span>
            <span>•</span>
            <span>{todayEvents.length} today</span>
          </div>
        </div>
        
        <button
          onClick={() => navigateMonth('next')}
          className="group flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex-shrink-0"
        >
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-500">
            Next
          </span>
          <ChevronRight size={20} className="group-hover:text-blue-500 transition-colors" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(eventTypeConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: config.color }} />
            <span className="text-xs text-gray-600">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-200">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 min-w-[560px] bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{day}</div>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 min-w-[560px]">
          {calendarDays.map((dayObj, index) => {
            const { date, isCurrentMonth, isToday } = dayObj;
            const dayEvents = date ? getEventsForDay(date) : [];
            const isSelected = date && formatDate(date) === formatDate(selectedDate);
            const hasEvents = dayEvents.length > 0;

            return (
              <div
                key={index}
                className={`
                  relative group min-h-[100px] p-2 border-r border-b border-gray-200
                  transition-all duration-200 hover:bg-gray-50
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                  ${isToday ? 'bg-yellow-50 border-l-2 border-yellow-400' : ''}
                  ${isSelected ? 'bg-blue-50 border-2 border-blue-200 ring-1 ring-blue-200/20' : ''}
                  ${hasEvents ? 'cursor-pointer' : ''}
                `}
                onClick={() => date && setSelectedDate(date)}
              >
                {date && (
                  <>
                    {/* Day Number */}
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday ? 'text-yellow-600' : 
                      isSelected ? 'text-blue-600' : 
                      hasEvents ? 'text-gray-900 font-medium' : 'text-gray-700'
                    }`}>
                      {date.getDate()}
                    </div>

                    {/* Events */}
                    <div className="space-y-1 min-h-[60px]">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className="group/event relative h-4 rounded overflow-hidden cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewEventDetails(event);
                          }}
                        >
                          <div 
                            className="absolute inset-0 rounded opacity-80 group-hover/event:opacity-100 transition-opacity"
                            style={{ backgroundColor: getEventColor(event.type) }}
                          />
                          <div className="relative flex items-center h-full px-1">
                            <div className="flex-shrink-0 w-2 h-2 rounded-full border-2 border-white" />
                            <span className="ml-1.5 text-xs font-medium text-white truncate leading-none">
                              {event.title.length > 20 
                                ? `${event.title.substring(0, 17)}...` 
                                : event.title
                              }
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {/* More indicator */}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-400 text-center">
                          +{dayEvents.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Event count badge */}
                    {hasEvents && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">
                        {dayEvents.length}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Week View Component
const WeekView: React.FC<WeekViewProps> = ({ 
  currentDate, 
  events, 
  eventTypeConfig, 
  navigateToDate, 
  setCurrentDate, 
  viewEventDetails, 
  getEventColor, 
  formatDate 
}) => {
  const startOfWeek = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return start;
  }, [currentDate]);
  
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  }, [startOfWeek]);

  const weekEvents = useMemo(() => {
    return days.map(day => ({
      day,
      events: events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === day.toDateString();
      })
    }));
  }, [days, events]);

  const navigateWeek = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  }, [currentDate, setCurrentDate]);

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateWeek('prev')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Previous Week</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Week of {days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {days[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </h2>
          <div className="text-sm text-gray-600 mt-1">
            {weekEvents.reduce((total, day) => total + day.events.length, 0)} events
          </div>
        </div>
        
        <button
          onClick={() => navigateWeek('next')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50"
        >
          <span className="text-sm">Next Week</span>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-200">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 min-w-[560px] bg-gray-50 border-b border-gray-200">
          {days.map((day, index) => (
            <div key={index} className="p-3 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-sm font-semibold ${
                formatDate(day) === formatDate(new Date()) 
                  ? 'text-yellow-600' 
                  : 'text-gray-900'
              }`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Events */}
        <div className="grid grid-cols-7 min-w-[560px] h-96 overflow-y-auto">
          {weekEvents.map((dayEvents, index) => (
            <div 
              key={index}
              className="p-3 border-r border-b border-gray-200 last:border-r-0 hover:bg-gray-50 h-full flex flex-col"
              onClick={() => navigateToDate(dayEvents.day)}
            >
              <div className="space-y-2 flex-1">
                {dayEvents.events.map(event => (
                  <div
                    key={event.id}
                    className="group relative p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewEventDetails(event);
                    }}
                  >
                    <div 
                      className="absolute inset-0 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity"
                      style={{ backgroundColor: getEventColor(event.type) }}
                    />
                    <div className="relative flex items-start gap-2">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1 ${
                        event.priority === 'critical' ? 'bg-red-500' :
                        event.priority === 'high' ? 'bg-orange-500' :
                        event.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {event.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {event.startTime} - {event.endTime || 'TBD'}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: getEventColor(event.type) }} />
                          <span className="text-xs text-gray-500 capitalize">{event.type}</span>
                        </div>
                      </div>
                      <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        STATUS_CONFIG[event.status].color
                      }`}>
                        {STATUS_CONFIG[event.status].label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add event button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToDate(dayEvents.day);
                  // This would open a create event modal for this specific day
                }}
                className="mt-auto w-full flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <Plus size={12} />
                Add Event
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Day View Component
const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  events,
  eventTypeConfig,
  navigateToDate,
  viewEventDetails,
  getEventColor,
  createNewEvent,
  formatDate
}) => {
  const navigateToPreviousDay = useCallback(() => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    navigateToDate(prevDay);
  }, [selectedDate, navigateToDate]);

  const navigateToNextDay = useCallback(() => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    navigateToDate(nextDay);
  }, [selectedDate, navigateToDate]);

  const timeSlots = useMemo(() => {
    const slots: Date[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date(selectedDate);
        time.setHours(hour, minute, 0, 0);
        slots.push(time);
      }
    }
    return slots;
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      {/* Day Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={navigateToPreviousDay}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Previous Day</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric' 
            })}
          </h2>
          <div className="text-sm text-gray-600 mt-1">
            {events.length} events • {formatDate(selectedDate)} 
          </div>
        </div>
        
        <button
          onClick={navigateToNextDay}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50"
        >
          <span className="text-sm">Next Day</span>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-200">
        {/* Time Slots */}
        <div className="grid grid-cols-[60px_1fr] min-w-[340px] h-[600px]">
          {/* Time Column */}
          <div className="border-r border-gray-200 bg-gray-50">
            {timeSlots.map((time, index) => (
              <div key={index} className="flex items-center h-12 border-b border-gray-100 px-2">
                <span className="text-xs text-gray-500">
                  {time.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
            ))}
          </div>

          {/* Events Column */}
          <div className="relative">
            {/* Grid lines */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(to right, transparent 49%, rgba(0,0,0,0.05) 49%, rgba(0,0,0,0.05) 51%, transparent 51%),
                                linear-gradient(to bottom, transparent 49%, rgba(0,0,0,0.05) 49%, rgba(0,0,0,0.05) 51%, transparent 51%)`
              }}
            />
            
            {/* Events */}
            {events.map(event => {
              const startTime = new Date(`${event.date}T${event.startTime}`);
              const endTime = event.endTime ? new Date(`${event.date}T${event.endTime}`) : undefined;
              
              const startHour = startTime.getHours();
              const startMinute = startTime.getMinutes();
              const startSlot = startHour * 2 + (startMinute / 30);
              
              const durationHours = endTime 
                ? ((endTime.getHours() * 60 + endTime.getMinutes()) - (startTime.getHours() * 60 + startTime.getMinutes())) / 60
                : 1;
              const durationSlots = durationHours * 2;

              const topPosition = (startSlot / timeSlots.length) * 100;
              const height = Math.min((durationSlots / timeSlots.length) * 100, 100);

              return (
                <div
                  key={event.id}
                  className="group relative cursor-pointer"
                  style={{ top: `${topPosition}%` }}
                  onClick={() => viewEventDetails(event)}
                >
                  <div 
                    className="absolute rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-200"
                    style={{ 
                      left: '8px',
                      right: '8px',
                      height: `${height}%`,
                      backgroundColor: getEventColor(event.type),
                      borderLeft: `4px solid ${getEventColor(event.type)}`
                    }}
                  >
                    {/* Event Content */}
                    <div className="relative h-full flex flex-col p-3 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold truncate">{event.title}</h4>
                        <div className={`text-xs px-2 py-0.5 rounded-full ${
                          STATUS_CONFIG[event.status].color.replace('text-', 'bg-').replace('800', '100')
                        } text-gray-800`}>
                          {STATUS_CONFIG[event.status].label}
                        </div>
                      </div>
                      
                      {event.startTime && (
                        <div className="text-xs opacity-90 mb-2">
                          {event.startTime} - {event.endTime || 'TBD'}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs opacity-90">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
                          <img 
                            src={event.ambassador.avatar || 'https://via.placeholder.com/24'} 
                            alt={event.ambassador.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="truncate">{event.ambassador.name}</span>
                      </div>
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Add Event */}
      <div className="flex justify-center">
        <button
          onClick={createNewEvent}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <Plus size={16} />
          <span>Create Event for {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}</span>
        </button>
      </div>
    </div>
  );
};

// Agenda View Component
const AgendaView: React.FC<AgendaViewProps> = ({ 
  events, 
  eventTypeConfig, 
  navigateToDate, 
  viewEventDetails, 
  createNewEvent 
}) => {
  const groupedEvents = useMemo(() => {
    const groups = events.reduce((acc, event) => {
      const dateKey = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, Event[]>);

    return Object.entries(groups)
      .map(([date, dayEvents]) => ({
        date: new Date(events.find(e => 
          new Date(e.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          }) === date 
        )?.date || Date.now()),
        events: dayEvents.sort((a, b) => {
          const timeA = new Date(`${a.date}T${a.startTime}`).getTime();
          const timeB = new Date(`${b.date}T${b.startTime}`).getTime();
          return timeA - timeB;
        })
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events]);

  const getEventColor = useCallback((eventType: string) => {
    return eventTypeConfig[eventType as keyof typeof eventTypeConfig]?.color || '#6B7280';
  }, [eventTypeConfig]);

  const formatDate = useCallback((date: Date) => {
    return date.toISOString().split('T')[0];
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 overflow-x-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Activity size={20} className="text-blue-600" />
          Agenda View
        </h3>
        
        <div className="space-y-6">
          {groupedEvents.map(({ date, events: dayEvents }) => (
            <div key={formatDate(date)} className="space-y-3">
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 first:pt-0 first:border-t-0">
                <div className={`w-2 h-2 rounded-full ${
                  formatDate(date) === formatDate(new Date()) 
                    ? 'bg-yellow-500' 
                    : 'bg-gray-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold ${
                    formatDate(date) === formatDate(new Date()) 
                      ? 'text-yellow-600' 
                      : 'text-gray-900'
                  }`}>
                    {date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                  </p>
                </div>
                <button
                  onClick={() => navigateToDate(date)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Day
                </button>
              </div>
              
              <div className="grid gap-3">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className="group relative flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                    onClick={() => viewEventDetails(event)}
                  >
                    <div 
                      className="flex-shrink-0 w-2 h-10 rounded-l-lg"
                      style={{ backgroundColor: getEventColor(event.type) }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xs font-medium text-gray-900 truncate flex-1">
                          {event.title}
                        </div>
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                          PRIORITY_CONFIG[event.priority].color
                        }`}>
                          {PRIORITY_CONFIG[event.priority].label}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{event.startTime} - {event.endTime || 'TBD'}</span>
                        <span>{event.ambassador.name}</span>
                        {event.location && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={12} />
                            <span className="truncate">{event.location}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        STATUS_CONFIG[event.status].color
                      }`}>
                        {STATUS_CONFIG[event.status].label}
                      </div>
                      <MessageSquare size={16} className="text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {groupedEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events scheduled</h3>
            <p className="text-gray-500 mb-6">Your outreach calendar is looking pretty empty</p>
            <button 
              onClick={createNewEvent}
              className="flex items-center gap-2 px-4 py-2 mx-auto bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              <Plus size={16} />
              Schedule Your First Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Event Modal Component
const EventModal: React.FC<EventModalProps> = ({ 
  event, 
  eventTypeConfig, 
  onClose, 
  onEdit, 
  getEventColor 
}) => {
  const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
  const statusConfig = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG];
  const priorityConfig = PRIORITY_CONFIG[event.priority as keyof typeof PRIORITY_CONFIG];

  function getCountryDisplay(code?: string): React.ReactNode {
    if (!code) return '';
    // Try to find the country in the eventTypeConfig (not available), fallback to emoji for multi, else show code
    if (code === 'multi') return <>🌍 Multi-country</>;
    // Common flags for demo, you may want to pass countries as prop for real data
    const FLAGS: Record<string, string> = {
      NG: '🇳🇬',
      GH: '🇬🇭',
      KE: '🇰🇪',
      // Add more as needed
    };
    const NAMES: Record<string, string> = {
      NG: 'Nigeria',
      GH: 'Ghana',
      KE: 'Kenya',
      // Add more as needed
    };
    return (
      <>
        {FLAGS[code] && <span>{FLAGS[code]} </span>}
        {NAMES[code] || code}
      </>
    );
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-xl"
                style={{ backgroundColor: getEventColor(event.type) }}
              >
                {config?.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{event.startTime} - {event.endTime || 'TBD'}</span>
                  <span>•</span>
                  <span>{event.ambassador.role}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MessageSquare size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Priority */}
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${priorityConfig.color}`}>
              {priorityConfig.label}
            </div>
            {event.country && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                {getCountryDisplay(event.country)}
              </span>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">{event.location}</span>
            </div>
          )}

          {/* Ambassador */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              <img 
                src={event.ambassador.avatar || 'https://via.placeholder.com/40'} 
                alt={event.ambassador.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{event.ambassador.name}</div>
              <div className="text-xs text-gray-600">{event.ambassador.role}</div>
            </div>
          </div>

          {/* Stats */}
          {(event.attendees || event.leadsGenerated) && (
            <div className="grid grid-cols-2 gap-4">
              {event.attendees && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{event.attendees}</div>
                  <div className="text-xs text-blue-700 uppercase tracking-wide">Attendees</div>
                </div>
              )}
              {event.leadsGenerated && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{event.leadsGenerated}</div>
                  <div className="text-xs text-green-700 uppercase tracking-wide">Leads</div>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Created {new Date(event.date).toLocaleDateString()}</span>
            <span>Last updated {new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="flex gap-3 pt-3">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <MessageSquare size={16} />
              Edit Event
            </button>
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              <X size={16} />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;