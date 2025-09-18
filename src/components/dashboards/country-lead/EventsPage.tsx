import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone,
  MessageSquare,
  Zap,
  CheckCircle,
  X,
  TrendingUp
} from 'lucide-react';
import { DataTable } from '../../ui/widgets/DataTable';
import { ActivityFeed } from '../../ui/widgets/ActivityFeed';
import { KpiCard } from '../../ui/widgets/KpiCard';

// Types
interface Event {
  id: string;
  title: string;
  type: 'workshop' | 'training' | 'school_visit' | 'webinar' | 'community' | 'milestone';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  country: string;
  flag: string;
  status: 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
  attendees: number;
  capacity: number;
  rsvps: number;
  leads: number;
  organizer: string;
  contact: string;
  color: string;
}

interface QuickEventStat {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}

// Mock Data
const quickStats: QuickEventStat[] = [
  {
    title: 'Total Events',
    value: '127',
    icon: <Calendar className="h-5 w-5 text-blue-600" />,
    trend: '+8 this month',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Upcoming',
    value: '23',
    icon: <Clock className="h-5 w-5 text-yellow-500" />,
    trend: '12 this week',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    title: 'Attendees',
    value: '4,892',
    icon: <Users className="h-5 w-5 text-green-600" />,
    trend: '+15% from last month',
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Leads Generated',
    value: '1,234',
    icon: <Award className="h-5 w-5 text-purple-600" />,
    trend: 'Conversion: 28%',
    color: 'from-purple-500 to-pink-500'
  }
];

const eventsData: Event[] = [
  {
    id: '1',
    title: 'STEM Excellence Workshop - Lagos',
    type: 'workshop',
    date: '2024-12-18',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    location: 'Lagos Model College, Ikeja',
    country: 'Nigeria',
    flag: '🇳🇬',
    status: 'published',
    attendees: 45,
    capacity: 60,
    rsvps: 52,
    leads: 28,
    organizer: 'Aisha Bello',
    contact: 'aisha@afroscholarhub.org',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    id: '2',
    title: 'Ambassador Training Bootcamp',
    type: 'training',
    date: '2024-12-20',
    startTime: '02:00 PM',
    endTime: '05:30 PM',
    location: 'Virtual (Zoom)',
    country: 'Multi-country',
    flag: '🌍',
    status: 'live',
    attendees: 89,
    capacity: 120,
    rsvps: 112,
    leads: 67,
    organizer: 'Fatima Ahmed',
    contact: '+234 801 234 5678',
    color: 'bg-green-50 border-green-200'
  },
  {
    id: '3',
    title: 'Scholarship Fair - Accra',
    type: 'school_visit',
    date: '2024-12-15',
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    location: 'Accra Technical University',
    country: 'Ghana',
    flag: '🇬🇭',
    status: 'completed',
    attendees: 156,
    capacity: 200,
    rsvps: 178,
    leads: 89,
    organizer: 'Kwame Mensah',
    contact: 'kwame@afroscholarhub.org',
    color: 'bg-purple-50 border-purple-200'
  },
  {
    id: '4',
    title: 'Women in Tech Webinar',
    type: 'webinar',
    date: '2024-12-22',
    startTime: '06:00 PM',
    endTime: '07:30 PM',
    location: 'Virtual (YouTube Live)',
    country: 'Pan-Africa',
    flag: '🌍',
    status: 'draft',
    attendees: 0,
    capacity: 500,
    rsvps: 34,
    leads: 0,
    organizer: 'Sarah Nakato',
    contact: 'sarah@afroscholarhub.org',
    color: 'bg-gray-50 border-gray-200'
  },
  {
    id: '5',
    title: 'Community Impact Day - Nairobi',
    type: 'community',
    date: '2024-12-28',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    location: 'Kibera Community Center',
    country: 'Kenya',
    flag: '🇰🇪',
    status: 'published',
    attendees: 67,
    capacity: 100,
    rsvps: 89,
    leads: 45,
    organizer: 'James Otieno',
    contact: 'james@afroscholarhub.org',
    color: 'bg-yellow-50 border-yellow-200'
  },
  {
    id: '6',
    title: 'Q4 Milestone Celebration',
    type: 'milestone',
    date: '2024-12-31',
    startTime: '07:00 PM',
    endTime: '10:00 PM',
    location: 'Hybrid (Lagos & Virtual)',
    country: 'Nigeria',
    flag: '🇳🇬',
    status: 'published',
    attendees: 234,
    capacity: 300,
    rsvps: 267,
    leads: 156,
    organizer: 'National Team',
    contact: 'events@afroscholarhub.org',
    color: 'bg-indigo-50 border-indigo-200'
  }
];

// Event type colors and icons
const eventTypeConfig = {
  workshop: { color: 'text-blue-600', bg: 'bg-blue-100', icon: <Zap className="h-4 w-4" /> },
  training: { color: 'text-green-600', bg: 'bg-green-100', icon: <CheckCircle className="h-4 w-4" /> },
  school_visit: { color: 'text-purple-600', bg: 'bg-purple-100', icon: <MapPin className="h-4 w-4" /> },
  webinar: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <MessageSquare className="h-4 w-4" /> },
  community: { color: 'text-orange-600', bg: 'bg-orange-100', icon: <Users className="h-4 w-4" /> },
  milestone: { color: 'text-indigo-600', bg: 'bg-indigo-100', icon: <Award className="h-4 w-4" /> }
};

// Status colors
const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-700', label: 'Draft' },
  published: { color: 'bg-blue-100 text-blue-800', label: 'Published' },
  live: { color: 'bg-green-100 text-green-800', label: 'Live' },
  completed: { color: 'bg-purple-100 text-purple-800', label: 'Completed' },
  cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
};

// Components
const EventCard: React.FC<{ event: Event; onClick: () => void }> = ({ event, onClick }) => {
  const typeConfig = eventTypeConfig[event.type];
  const statusConfigItem = statusConfig[event.status];
  
  const attendanceRate = ((event.rsvps / event.capacity) * 100).toFixed(0);
  
  return (
    <div 
      className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfigItem.color}`}>
          {statusConfigItem.label}
        </span>
      </div>

      {/* Type Label */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeConfig.bg} ${typeConfig.color}`}>
          {typeConfig.icon}
          {event.type.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="relative p-6">
        {/* Event Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-ash-teal transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="flex items-center mr-4">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(event.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  weekday: 'short'
                })}
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {event.startTime} - {event.endTime}
              </span>
            </div>
          </div>
          
          {/* Country Flag */}
          <div className="flex-shrink-0 ml-3">
            <span className="text-2xl">{event.flag}</span>
          </div>
        </div>

        {/* Location */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{event.rsvps}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">RSVPs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{event.leads}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Leads</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${Number(attendanceRate) >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
              {attendanceRate}%
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Fill Rate</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium text-gray-900 mr-2">{event.organizer}</span>
            {event.contact.startsWith('+') ? (
              <Phone className="h-3 w-3" />
            ) : (
              <Mail className="h-3 w-3" />
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageSquare className="h-4 w-4" />
            </button>
            <button className="p-1.5 text-ash-teal hover:bg-ash-teal/10 rounded-lg transition-colors">
              <CheckCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventQuickAction: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; color?: string }> = ({ 
  icon, 
  title, 
  description, 
  onClick, 
  color = 'from-ash-teal to-ash-gold' 
}) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
      
      <div className="relative z-10 flex items-start space-x-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Plus className="h-4 w-4 text-white" />
      </div>
    </button>
  );
};

const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    country: 'all',
    status: 'all'
  });

  const tabs = [
    { id: 'upcoming', label: 'Upcoming (23)', icon: <Calendar className="h-4 w-4" /> },
    { id: 'live', label: 'Live (2)', icon: <Zap className="h-4 w-4" /> },
    { id: 'completed', label: 'Completed (89)', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'draft', label: 'Drafts (3)', icon: <X className="h-4 w-4" /> }
  ];

  const eventTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'training', label: 'Trainings' },
    { value: 'school_visit', label: 'School Visits' },
    { value: 'webinar', label: 'Webinars' },
    { value: 'community', label: 'Community Events' },
    { value: 'milestone', label: 'Milestones' }
  ];

  const countries = [
    { value: 'all', label: 'All Countries' },
    { value: 'NG', label: 'Nigeria 🇳🇬' },
    { value: 'GH', label: 'Ghana 🇬🇭' },
    { value: 'KE', label: 'Kenya 🇰🇪' },
    { value: 'ZA', label: 'South Africa 🇿🇦' },
    { value: 'multi', label: 'Multi-country 🌍' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Filter events based on active tab and filters
  const filteredEvents = eventsData.filter(event => {
    const matchesTab = activeTab === 'upcoming' ? event.status === 'published' :
                      activeTab === 'live' ? event.status === 'live' :
                      activeTab === 'completed' ? event.status === 'completed' :
                      activeTab === 'draft' ? event.status === 'draft' : true;
    
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type === 'all' || event.type === filters.type;
    const matchesCountry = filters.country === 'all' || 
                          (filters.country === 'multi' ? event.country === 'Multi-country' || event.country === 'Pan-Africa' : 
                          event.country === filters.country);
    const matchesStatus = filters.status === 'all' || event.status === filters.status;
    
    return matchesTab && matchesSearch && matchesType && matchesCountry && matchesStatus;
  });

  // Recent event activities
  const recentActivities = [
    {
      id: '1',
      type: 'rsvp',
      title: 'New RSVPs for STEM Workshop',
      description: '12 new students registered for Lagos event',
      timestamp: '15 minutes ago',
      user: { name: 'Aisha Bello' },
      icon: <Users className="h-4 w-4 text-green-600" />
    },
    {
      id: '2',
      type: 'update',
      title: 'Event Location Updated',
      description: 'Accra Technical University - New venue confirmed',
      timestamp: '2 hours ago',
      user: { name: 'Kwame Mensah' },
      icon: <MapPin className="h-4 w-4 text-blue-600" />
    },
    {
      id: '3',
      type: 'lead',
      title: '45 New Leads Generated',
      description: 'From yesterday\'s Scholarship Fair in Accra',
      timestamp: 'Yesterday 4:30 PM',
      user: { name: 'Event System' },
      icon: <Award className="h-4 w-4 text-yellow-500" />
    },
    {
      id: '4',
      type: 'feedback',
      title: 'Event Feedback Received',
      description: '95% satisfaction rating from STEM Workshop attendees',
      timestamp: '2 days ago',
      user: { name: 'Fatima Ahmed' },
      icon: <CheckCircle className="h-4 w-4 text-purple-600" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-ash-teal to-ash-gold rounded-xl mr-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
              <p className="text-lg text-gray-600 mt-1">Plan, promote, and track scholarship events across Africa</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export Events
          </button>
          
          {/* Create Event Button */}
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ash-teal to-ash-gold text-white rounded-lg font-semibold hover:from-ash-teal/90 hover:to-ash-gold/90 transition-all shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <KpiCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EventQuickAction
          icon={<Calendar className="h-5 w-5 text-white" />}
          title="New Workshop"
          description="STEM, career guidance, or application workshops"
          onClick={() => console.log('Create workshop')}
          color="from-blue-500 to-blue-600"
        />
        <EventQuickAction
          icon={<Users className="h-5 w-5 text-white" />}
          title="Training Session"
          description="Ambassador onboarding and skill development"
          onClick={() => console.log('Create training')}
          color="from-green-500 to-green-600"
        />
        <EventQuickAction
          icon={<MapPin className="h-5 w-5 text-white" />}
          title="School Visit"
          description="Campus tours and scholarship fairs"
          onClick={() => console.log('Create school visit')}
          color="from-purple-500 to-purple-600"
        />
        <EventQuickAction
          icon={<Zap className="h-5 w-5 text-white" />}
          title="Virtual Event"
          description="Webinars and online information sessions"
          onClick={() => console.log('Create virtual event')}
          color="from-yellow-400 to-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Events List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-ash-teal text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, locations, or organizers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ash-teal focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <Filter className="h-4 w-4 text-gray-500 mr-2" />
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  >
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                  >
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>{country.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="space-y-6">
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEvents.slice(0, 6).map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onClick={() => console.log('View event:', event.title)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-ash-teal text-white rounded-lg font-medium hover:bg-ash-teal/90 transition-colors mx-auto">
                  <Plus className="h-4 w-4" />
                  Create Your First Event
                </button>
              </div>
            )}
            
            {filteredEvents.length > 6 && (
              <div className="text-center">
                <button className="text-ash-teal hover:text-ash-teal/80 font-medium text-sm flex items-center justify-center gap-1 mx-auto">
                  Load More Events
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            Recent Activity
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              Live
            </span>
          </h2>
          
          <ActivityFeed 
            title="Recent Activity"
            activities={recentActivities} 
            maxItems={8}
          />
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 bg-gradient-to-r from-ash-teal to-ash-gold text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 md:hidden">
        <Plus className="h-6 w-6" />
      </div>
    </div>
  );
};

export default EventsPage;