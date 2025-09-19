import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar,
  Edit,
  ArrowLeft,
  Save,
  MapPin,
  Users,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  X,
  GraduationCap,
  Zap
} from 'lucide-react';

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

const EVENT_TYPE_CONFIG = {
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

// Mock function to get event by ID
const getEventById = (id: string): Event | null => {
  // In a real app, this would fetch from an API
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
    }
  ];

  return mockEvents.find(event => event.id === id) || null;
};

export const EventEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'visit' as keyof typeof EVENT_TYPE_CONFIG,
    location: '',
    description: '',
    priority: 'medium' as keyof typeof PRIORITY_CONFIG,
    status: 'scheduled' as keyof typeof STATUS_CONFIG,
    country: '',
    tags: [] as string[]
  });

  useEffect(() => {
    if (id) {
      const event = getEventById(id);
      if (event) {
        setFormData({
          title: event.title,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime || '',
          type: event.type,
          location: event.location || '',
          description: event.description || '',
          priority: event.priority,
          status: event.status,
          country: event.country || '',
          tags: event.tags || []
        });
      }
      setLoading(false);
    }
  }, [id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically update the event via API
    console.log('Updating event:', { id, ...formData });
    // For now, just navigate back to the calendar
    navigate('/dashboard/management/outreaches/calendar');
  };

  const handleCancel = () => {
    navigate('/dashboard/management/outreaches/calendar');
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading event...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Calendar
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Edit className="h-8 w-8 text-blue-600" />
            Edit Event
          </h1>
          <p className="text-gray-600 mt-1">
            Update event details
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event title"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(EVENT_TYPE_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Country</option>
                <option value="NG">Nigeria 🇳🇬</option>
                <option value="GH">Ghana 🇬🇭</option>
                <option value="KE">Kenya 🇰🇪</option>
                <option value="ZA">South Africa 🇿🇦</option>
                <option value="multi">Multi-country 🌍</option>
              </select>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event location"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event description"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventEditPage;
