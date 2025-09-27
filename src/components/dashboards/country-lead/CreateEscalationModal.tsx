import React, { useState, useEffect } from 'react';
import { X, Upload, AlertTriangle, Clock, Users, Building, Tag, Calendar, FileText } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { supabase } from '../../../utils/supabase';
import { createEscalation } from '../../../api/escalations';
import { LoadingSpinner } from '../../LoadingSpinner';

interface CreateEscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'scholarship' | 'compliance' | 'technical' | 'ambassador' | 'partner' | 'system' | 'finance';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  impact: 'single_student' | 'multiple_students' | 'regional' | 'national' | 'system_wide';
  school_id?: string;
  task_id?: string;
  team_id?: string;
  due_date?: string;
  tags: string[];
  watchers: string[];
}

const CreateEscalationModal: React.FC<CreateEscalationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'technical',
    urgency: 'medium',
    impact: 'single_student',
    tags: [],
    watchers: []
  });

  const [tagInput, setTagInput] = useState('');
  const [watcherInput, setWatcherInput] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Load options on mount
  useEffect(() => {
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const [schoolsRes, tasksRes, teamsRes, usersRes] = await Promise.all([
        supabase.from('schools').select('id, name, location').limit(50),
        supabase.from('tasks').select('id, title').eq('status', 'in_progress').limit(50),
        supabase.from('teams').select('id, name').limit(50),
        supabase.from('users').select('id, full_name, email').limit(100)
      ]);

      setSchools(schoolsRes.data || []);
      setTasks(tasksRes.data || []);
      setTeams(teamsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error('Error loading options:', error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createEscalation({
        ...formData,
        tags: formData.tags.filter(tag => tag.trim()),
        watchers: formData.watchers.filter(watcher => watcher.trim())
      });

      alert('Escalation created successfully!');
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      console.error('Error creating escalation:', error);
      alert(error.message || 'Failed to create escalation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'technical',
      urgency: 'medium',
      impact: 'single_student',
      tags: [],
      watchers: []
    });
    setTagInput('');
    setWatcherInput('');
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addWatcher = () => {
    if (watcherInput.trim() && !formData.watchers.includes(watcherInput.trim())) {
      setFormData(prev => ({
        ...prev,
        watchers: [...prev.watchers, watcherInput.trim()]
      }));
      setWatcherInput('');
    }
  };

  const removeWatcher = (watcherToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      watchers: prev.watchers.filter(watcher => watcher !== watcherToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Create New Escalation</h3>
                  <p className="text-sm text-gray-600">Escalate critical issues that need immediate attention</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingOptions ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
                <span className="ml-2 text-gray-600">Loading form options...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="Title *"
                      placeholder="Brief description of the issue"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      fullWidth
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                      rows={4}
                      placeholder="Detailed description of the issue, including steps to reproduce, impact, and any relevant context"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  {/* Priority and Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority *
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    >
                      <option value="scholarship">Scholarship</option>
                      <option value="compliance">Compliance</option>
                      <option value="technical">Technical</option>
                      <option value="ambassador">Ambassador</option>
                      <option value="partner">Partner</option>
                      <option value="system">System</option>
                      <option value="finance">Finance</option>
                    </select>
                  </div>

                  {/* Urgency and Impact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency *
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={formData.urgency}
                      onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as any }))}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impact *
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={formData.impact}
                      onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value as any }))}
                    >
                      <option value="single_student">Single Student</option>
                      <option value="multiple_students">Multiple Students</option>
                      <option value="regional">Regional</option>
                      <option value="national">National</option>
                      <option value="system_wide">System Wide</option>
                    </select>
                  </div>
                </div>

                {/* Related Entities */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related School
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={formData.school_id || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, school_id: e.target.value || undefined }))}
                    >
                      <option value="">Select School (Optional)</option>
                      {schools.map(school => (
                        <option key={school.id} value={school.id}>
                          {school.name} - {school.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Task
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={formData.task_id || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, task_id: e.target.value || undefined }))}
                    >
                      <option value="">Select Task (Optional)</option>
                      {tasks.map(task => (
                        <option key={task.id} value={task.id}>
                          {task.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Team
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={formData.team_id || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, team_id: e.target.value || undefined }))}
                    >
                      <option value="">Select Team (Optional)</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <Input
                    type="datetime-local"
                    placeholder="Select due date (optional)"
                    value={formData.due_date || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value || undefined }))}
                    fullWidth
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      className="px-4"
                    >
                      Add
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Watchers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Watchers
                  </label>
                  <div className="flex gap-2 mb-2">
                    <select
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={watcherInput}
                      onChange={(e) => setWatcherInput(e.target.value)}
                    >
                      <option value="">Select user to add as watcher</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.full_name} ({user.email})
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      onClick={addWatcher}
                      variant="outline"
                      className="px-4"
                    >
                      Add
                    </Button>
                  </div>
                  {formData.watchers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.watchers.map((watcherId, index) => {
                        const user = users.find(u => u.id === watcherId);
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            <Users className="h-3 w-3" />
                            {user?.full_name || watcherId}
                            <button
                              type="button"
                              onClick={() => removeWatcher(watcherId)}
                              className="ml-1 text-green-600 hover:text-green-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={loading}
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
                  >
                    {loading ? 'Creating...' : 'Create Escalation'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEscalationModal;
