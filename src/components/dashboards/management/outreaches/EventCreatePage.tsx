import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Plus, ArrowLeft, Save, X
} from 'lucide-react';
import { createEvent } from '../../../../api/management';
import { supabase } from '../../../../utils/supabase';

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
  expected_attendance: string;
  budget: string;
  status: string;
  priority: string;
}

export const EventCreatePage: React.FC = () => {
  const navigate = useNavigate();
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
    expected_attendance: '',
    budget: '',
    status: 'planned',
    priority: 'low'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [reportEvent, setReportEvent] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const user = supabase.auth.getUser();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = 'Event name is required';
    if (!formData.event_date) newErrors.event_date = 'Event date is required';
    if (!formData.start_time) newErrors.start_time = 'Start time is required';
    if (!formData.event_type) newErrors.event_type = 'Event type is required';
    if (!formData.country_code) newErrors.country_code = 'Country code is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (Number(formData.expected_attendance) < 0) newErrors.expected_attendance = 'Attendance cannot be negative';
    if (Number(formData.budget) < 0) newErrors.budget = 'Budget cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

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

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
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
        created_by: (await user).data.user?.id || '',
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
        expected_attendance: '',
        budget: '',
        status: 'planned',
        priority: 'low'
      });
      navigate('/dashboard/management/outreaches/calendar');
    } catch (error: any) {
      alert(`Failed to create event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard/management/outreaches/calendar')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            <ArrowLeft size={18} />
            Back to Calendar
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Plus className="h-8 w-8 text-blue-500" />
              Create New Event
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Plan and schedule your next outreach event
            </p>
          </div>
        </div>

        {/* Trigger Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            Create Event
          </button>
          <button
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm"
            onClick={() => openReportModal('YOUR_EVENT_ID_HERE')}
          >
            <Calendar size={18} />
            View Sample Report
          </button>
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
                    <label className="block text-sm font-medium text-gray-700">Country Code</label>
                    <input
                      className={`w-full mt-1 p-3 border ${errors.country_code ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="e.g. NG"
                      value={formData.country_code}
                      onChange={e => handleInputChange('country_code', e.target.value)}
                      required
                    />
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
                      onChange={e => handleInputChange('expected_attendance', e.target.value)}
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
                      onChange={e => handleInputChange('budget', e.target.value)}
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
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                    disabled={loading}
                  >
                    <Save size={18} />
                    {loading ? 'Creating...' : 'Create Event'}
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
              {reportLoading ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : reportEvent ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">{reportEvent.name}</h3>
                  <p className="text-gray-600">{reportEvent.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">Date:</span> {reportEvent.event_date}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Location:</span> {reportEvent.location}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Type:</span> {reportEvent.event_type}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Expected Attendance:</span> {reportEvent.expected_attendance}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Budget:</span> ₦{reportEvent.budget}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span> {reportEvent.status}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-red-500 text-center">Event not found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCreatePage;