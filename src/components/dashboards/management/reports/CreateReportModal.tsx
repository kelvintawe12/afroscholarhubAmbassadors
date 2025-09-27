import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { createReport } from '../../../../api/reports';
import { LoadingSpinner } from '../../../LoadingSpinner';
import toast from 'react-hot-toast';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  type: 'weekly' | 'monthly' | 'custom';
  start_date: string;
  end_date: string;
  metrics: string[];
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: 'custom',
    start_date: '',
    end_date: '',
    metrics: ['leadsGenerated', 'schoolsVisited']
  });

  const [loading, setLoading] = useState(false);

  const availableMetrics = [
    { value: 'leadsGenerated', label: 'Leads Generated' },
    { value: 'schoolsVisited', label: 'Schools Visited' },
    { value: 'tasksCompleted', label: 'Tasks Completed' },
    { value: 'activeAmbassadors', label: 'Active Ambassadors' },
    { value: 'partnerships', label: 'Partnerships' },
    { value: 'conversionRate', label: 'Conversion Rate' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.start_date || !formData.end_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast.error('Start date must be before end date');
      return;
    }

    setLoading(true);
    try {
      await createReport({
        name: formData.name,
        type: formData.type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        metrics: formData.metrics,
      });

      toast.success('Report created successfully!');
      onSuccess?.();
      handleClose();
    } catch (error: any) {
      console.error('Error creating report:', error);
      toast.error(error.message || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'custom',
      start_date: '',
      end_date: '',
      metrics: ['leadsGenerated', 'schoolsVisited']
    });
    onClose();
  };

  const toggleMetric = (metricValue: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricValue)
        ? prev.metrics.filter(m => m !== metricValue)
        : [...prev.metrics, metricValue]
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Create New Report</h3>
                  <p className="text-sm text-gray-600">Generate custom reports with selected metrics</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Report Name */}
              <div>
                <Input
                  label="Report Name *"
                  placeholder="Enter report name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  fullWidth
                />
              </div>

              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type *
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    required
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    required
                    fullWidth
                  />
                </div>
              </div>

              {/* Metrics Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Metrics to Include
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableMetrics.map((metric) => (
                    <div key={metric.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={metric.value}
                        checked={formData.metrics.includes(metric.value)}
                        onChange={() => toggleMetric(metric.value)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={metric.value} className="text-sm font-medium text-gray-700">
                        {metric.label}
                      </label>
                    </div>
                  ))}
                </div>
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
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Creating...</span>
                    </>
                  ) : (
                    'Create Report'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReportModal;
