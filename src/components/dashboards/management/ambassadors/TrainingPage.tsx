import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BookOpenIcon, CalendarIcon, CheckCircleIcon, ClockIcon, DownloadIcon, FilterIcon, PlayIcon, PlusIcon, SearchIcon, UsersIcon, XIcon, FileTextIcon, BarChart3Icon, Save } from 'lucide-react';
import { supabase } from '../../../../utils/supabase';
import { createTrainingModule } from '../../../../api/management';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { DataTable } from '../../../ui/widgets/DataTable';
import { PieChart } from '../../../ui/widgets/PieChart';
import { BarChart } from '../../../ui/widgets/BarChart';

interface TrainingMetric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'Required' | 'Optional';
  format: 'Video' | 'Interactive' | 'Document' | 'Video + Quiz' | 'Document + Quiz';
  duration: string;
  completion_rate: number;
  last_updated: string;
  target_audience: 'All Ambassadors' | 'New Ambassadors' | 'Senior Ambassadors';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  learning_objectives: string[];
  resource_id?: string;
  resource?: { file_url: string; file_type: string; title: string } | null;
}

interface AmbassadorProgress {
  id: string;
  name: string;
  email: string;
  country: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Behind';
  last_activity: string;
  avatar: string;
}

interface TrainingSession {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  format: 'Virtual' | 'In-Person';
  registered_count: number;
  location?: string;
  meeting_link?: string;
  status: 'planned' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}

interface FormData {
  title: string;
  description: string;
  type: 'Required' | 'Optional';
  format: 'Video' | 'Interactive' | 'Document' | 'Video + Quiz' | 'Document + Quiz';
  duration: string;
  target_audience: 'All Ambassadors' | 'New Ambassadors' | 'Senior Ambassadors';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  learning_objectives: string[];
  applicable_countries: string[];
  materials?: FileList;
}

export const AmbassadorTrainingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetric[]>([]);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [ambassadorProgress, setAmbassadorProgress] = useState<AmbassadorProgress[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'Required',
    format: 'Video',
    duration: '',
    target_audience: 'All Ambassadors',
    difficulty_level: 'beginner',
    learning_objectives: [],
    applicable_countries: [],
    materials: undefined,
  });
  const [formErrors, setFormErrors] = useState<Record<keyof FormData, string | undefined>>({
    title: undefined,
    description: undefined,
    type: undefined,
    format: undefined,
    duration: undefined,
    target_audience: undefined,
    difficulty_level: undefined,
    learning_objectives: undefined,
    applicable_countries: undefined,
    materials: undefined,
  });
  const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);

  // Fetch countries for applicable_countries dropdown
  useEffect(() => {
    const fetchCountries = async () => {
      const { data } = await supabase.from('countries').select('code, name');
      setCountries(data || []);
    };
    fetchCountries();
  }, []);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch training metrics
        const { data: metricsData } = await supabase.from('training_metrics').select('*');
        const mappedMetrics = metricsData?.map(metric => ({
          title: metric.title,
          value: metric.value,
          change: metric.change,
          icon: metric.title === 'Completion Rate' ? <CheckCircleIcon size={20} /> :
                metric.title === 'Active Modules' ? <BookOpenIcon size={20} /> :
                metric.title === 'Ambassadors in Training' ? <UsersIcon size={20} /> :
                <ClockIcon size={20} />
        })) || [];
        setTrainingMetrics(mappedMetrics);

        // Fetch training modules with resources
        const { data: modulesData } = await supabase
          .from('training_modules')
          .select(`
            *,
            resources (file_url, file_type, title)
          `);
        const mappedModules = modulesData?.map(module => ({
          id: module.id,
          title: module.title,
          description: module.description,
          type: module.type as 'Required' | 'Optional',
          format: module.format as 'Video' | 'Interactive' | 'Document' | 'Video + Quiz' | 'Document + Quiz',
          duration: module.duration,
          completion_rate: module.completion_rate,
          last_updated: new Date(module.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          target_audience: module.target_audience,
          difficulty_level: module.difficulty_level,
          learning_objectives: module.learning_objectives || [],
          resource_id: module.resource_id,
          resource: module.resources
        })) || [];
        setTrainingModules(mappedModules);

        // Fetch ambassador progress with user details
        const { data: progressData } = await supabase
          .from('ambassador_training_progress')
          .select(`
            id,
            user_id,
            training_module_id,
            status,
            progress,
            last_activity,
            users (full_name, email, country_code, avatar_url, countries (name))
          `);
        const mappedProgress = progressData?.map(progress => ({
          id: progress.id,
          name: progress.users[0]?.full_name,
          email: progress.users[0]?.email,
          country: progress.users[0]?.countries?.[0]?.name || progress.users[0]?.country_code,
          progress: progress.progress,
          status: progress.status as 'Not Started' | 'In Progress' | 'Completed' | 'Behind',
          last_activity: new Date(progress.last_activity).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          avatar: progress.users[0]?.avatar_url || 'https://via.placeholder.com/40'
        })) || [];
        setAmbassadorProgress(mappedProgress);

        // Fetch upcoming training sessions
        const { data: sessionsData } = await supabase
          .from('training_sessions')
          .select('*')
          .gte('event_date', new Date().toISOString().split('T')[0]);
        const mappedSessions = sessionsData?.map(session => ({
          id: session.id,
          title: session.title,
          description: session.description,
          date: new Date(session.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          start_time: session.start_time,
          end_time: session.end_time,
          format: session.format as 'Virtual' | 'In-Person',
          registered_count: session.registered_count,
          location: session.location,
          meeting_link: session.meeting_link,
          status: session.status
        })) || [];
        setTrainingSessions(mappedSessions);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter ambassadors based on search query and status
  const filteredAmbassadors = useCallback(() => {
    return ambassadorProgress.filter(ambassador => {
      const matchesSearch = searchQuery === '' ||
        ambassador.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ambassador.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ambassador.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || ambassador.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [ambassadorProgress, searchQuery, filterStatus]);

  // Chart data
  const moduleCompletionByCountryData = useMemo(() => {
    const countryData = ambassadorProgress.reduce((acc: Record<string, { total: number; sum: number }>, ambassador) => {
      if (!acc[ambassador.country]) {
        acc[ambassador.country] = { total: 0, sum: 0 };
      }
      acc[ambassador.country].total += 1;
      acc[ambassador.country].sum += ambassador.progress;
      return acc;
    }, {});
    return {
      labels: Object.keys(countryData),
      datasets: [{
        label: 'Average Completion Rate (%)',
        data: Object.values(countryData).map(data => Math.round(data.sum / data.total) || 0),
        backgroundColor: 'rgba(26, 95, 122, 0.8)'
      }]
    };
  }, [ambassadorProgress]);

  const completionStatusData = useMemo(() => {
    const statusCounts = ambassadorProgress.reduce((acc: Record<string, number>, ambassador) => {
      acc[ambassador.status] = (acc[ambassador.status] || 0) + 1;
      return acc;
    }, {});
    return {
      labels: ['Completed', 'In Progress', 'Behind', 'Not Started'],
      datasets: [{
        data: [
          statusCounts['Completed'] || 0,
          statusCounts['In Progress'] || 0,
          statusCounts['Behind'] || 0,
          statusCounts['Not Started'] || 0
        ],
        backgroundColor: ['rgba(38, 162, 105, 0.8)', 'rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(225, 112, 85, 0.8)']
      }]
    };
  }, [ambassadorProgress]);

  // Columns for training modules table
  const moduleColumns = [
    {
      header: 'Module',
      accessor: (row: TrainingModule) => (
        <div>
          <div className="font-medium text-gray-900">{row.title}</div>
          <div className="text-xs text-gray-500">{row.description}</div>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: (row: TrainingModule) => (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${row.type === 'Required' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.type}
        </span>
      )
    },
    { header: 'Format', accessor: 'format' },
    { header: 'Duration', accessor: 'duration' },
    {
      header: 'Completion Rate',
      accessor: (row: TrainingModule) => (
        <div className="w-full max-w-[150px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{row.completion_rate}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
            <div
              className={`h-1.5 rounded-full ${row.completion_rate >= 80 ? 'bg-green-500' : row.completion_rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${row.completion_rate}%` }}
            ></div>
          </div>
        </div>
      )
    },
    { header: 'Last Updated', accessor: 'last_updated' },
    {
      header: 'Actions',
      accessor: (row: TrainingModule) => (
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedModule(row)}
            className="rounded-md bg-ash-teal p-1.5 text-white hover:bg-ash-teal/90"
            title="View Module"
          >
            <PlayIcon size={14} />
          </button>
          <button
            className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
            title="Download"
          >
            <DownloadIcon size={14} />
          </button>
        </div>
      )
    }
  ];

  // Columns for ambassador progress table
  const ambassadorColumns = [
    {
      header: 'Ambassador',
      accessor: (row: AmbassadorProgress) => (
        <div className="flex items-center">
          <img src={row.avatar} alt={row.name} className="h-8 w-8 rounded-full object-cover" />
          <div className="ml-3">
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    { header: 'Country', accessor: 'country' },
    {
      header: 'Progress',
      accessor: (row: AmbassadorProgress) => (
        <div className="w-full max-w-[150px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{row.progress}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
            <div
              className={`h-1.5 rounded-full ${row.progress === 100 ? 'bg-green-500' : row.progress >= 60 ? 'bg-ash-teal' : 'bg-yellow-500'}`}
              style={{ width: `${row.progress}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (row: AmbassadorProgress) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === 'Completed' ? 'bg-green-100 text-green-800' : row.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : row.status === 'Behind' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.status === 'Completed' && <CheckCircleIcon size={12} className="mr-1" />}
          {row.status === 'In Progress' && <ClockIcon size={12} className="mr-1" />}
          {row.status === 'Behind' && <ClockIcon size={12} className="mr-1" />}
          {row.status === 'Not Started' && <ClockIcon size={12} className="mr-1" />}
          {row.status}
        </span>
      )
    },
    { header: 'Last Activity', accessor: 'last_activity' },
    {
      header: 'Actions',
      accessor: (row: AmbassadorProgress) => (
        <div className="flex space-x-2">
          <button
            className="rounded-md bg-ash-teal p-1.5 text-white hover:bg-ash-teal/90"
            title="View Progress"
          >
            <BarChart3Icon size={14} />
          </button>
          <button
            className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
            title="Send Reminder"
          >
            <CalendarIcon size={14} />
          </button>
        </div>
      )
    }
  ];

  // Handle form input changes
  const handleFormChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<keyof FormData, string | undefined> = {
      title: undefined,
      description: undefined,
      type: undefined,
      format: undefined,
      duration: undefined,
      target_audience: undefined,
      difficulty_level: undefined,
      learning_objectives: undefined,
      applicable_countries: undefined,
      materials: undefined,
    };
    if (!formData.title) errors.title = 'Module title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.duration) errors.duration = 'Duration is required';
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.format) errors.format = 'Format is required';
    if (!formData.target_audience) errors.target_audience = 'Target audience is required';
    if (!formData.difficulty_level) errors.difficulty_level = 'Difficulty level is required';
    setFormErrors(errors);
    return Object.values(errors).every(v => v === undefined);
  };
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      let resource_id: string | undefined;
      if (formData.materials && formData.materials.length > 0) {
        const file = formData.materials[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${formData.title}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('training-materials')
          .upload(fileName, file);
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage
          .from('training-materials')
          .getPublicUrl(fileName);
        const { data: resourceData } = await supabase
          .from('resources')
          .insert({
            title: formData.title,
            description: formData.description,
            category: 'Training',
            type: formData.format.toLowerCase().includes('video') ? 'video' : 'document',
            file_url: publicUrlData.publicUrl,
            file_type: fileExt,
            file_size: file.size,
            created_by: (await supabase.auth.getUser()).data.user?.id || '',
            access_level: 'ambassadors',
            language: 'en'
          })
          .select('id')
          .single();
        resource_id = resourceData?.id;
      }

      const moduleData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        format: formData.format,
        duration: formData.duration,
        target_audience: formData.target_audience,
        difficulty_level: formData.difficulty_level,
        learning_objectives: formData.learning_objectives,
        applicable_countries: formData.applicable_countries,
        resource_id,
        created_by: (await supabase.auth.getUser()).data.user?.id || '',
        completion_rate: 0,
        last_updated: new Date().toISOString()
      };
      await createTrainingModule(moduleData);

      // Refresh modules
      const { data: modulesData } = await supabase
        .from('training_modules')
        .select(`
          *,
          resources (file_url, file_type, title)
        `);
      const mappedModules = modulesData?.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        type: module.type as 'Required' | 'Optional',
        format: module.format as 'Video' | 'Interactive' | 'Document' | 'Video + Quiz' | 'Document + Quiz',
        duration: module.duration,
        completion_rate: module.completion_rate,
        last_updated: new Date(module.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        target_audience: module.target_audience,
        difficulty_level: module.difficulty_level,
        learning_objectives: module.learning_objectives || [],
        resource_id: module.resource_id,
        resource: module.resources
      })) || [];
      setTrainingModules(mappedModules);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        type: 'Required',
        format: 'Video',
        duration: '',
        target_audience: 'All Ambassadors',
        difficulty_level: 'beginner',
        learning_objectives: [],
        applicable_countries: [],
        materials: undefined
      });
    } catch (error: any) {
      alert(`Failed to create module: ${error.message}`);
    }
  };

  return (
    <div className="px-2 sm:px-4 lg:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Ambassador Training
        </h1>
        <p className="text-sm text-gray-500">
          Manage training modules, track ambassador progress, and schedule training sessions
        </p>
      </div>

      {/* Training metrics */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trainingMetrics.map((metric, index) => (
              <KpiCard key={index} title={metric.title} value={metric.value} change={metric.change} icon={metric.icon} />
            ))}
          </div>

          {/* Training modules section */}
          <div className="mb-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Training Modules
              </h2>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
                <button
                  className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => {}}
                >
                  <FilterIcon size={16} className="mr-2" />
                  Filter
                </button>
                <button
                  className="flex items-center rounded-md bg-ash-teal px-3 py-1.5 text-sm font-medium text-white hover:bg-ash-teal/90"
                  onClick={() => setShowAddModal(true)}
                >
                  <PlusIcon size={16} className="mr-2" />
                  Add Module
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <DataTable columns={moduleColumns} data={trainingModules} keyField="id" rowsPerPage={6} />
            </div>
          </div>

          {/* Charts */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BarChart title="Module Completion by Country" data={moduleCompletionByCountryData} height={300} />
            <PieChart title="Ambassador Training Status" data={completionStatusData} height={300} />
          </div>

          {/* Ambassador progress section */}
          <div className="mb-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Ambassador Training Progress
              </h2>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2">
                <div className="relative w-full sm:w-auto">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search ambassadors..."
                    className="w-full sm:w-64 rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm w-full sm:w-auto"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Behind">Behind</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <DataTable columns={ambassadorColumns} data={filteredAmbassadors()} keyField="id" rowsPerPage={5} showSearch={false} />
            </div>
          </div>

          {/* Upcoming training sessions */}
          <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-4 shadow-sm">
            <h3 className="mb-4 text-base font-medium text-gray-700">
              Upcoming Training Sessions
            </h3>
            <div className="overflow-x-auto">
              <div className="flex flex-col gap-4 min-w-[320px] sm:flex-row sm:gap-4">
                {trainingSessions.map(session => (
                  <div key={session.id} className="flex min-w-[320px] flex-1 items-start rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${session.format === 'Virtual' ? 'bg-ash-teal' : 'bg-ash-gold'} text-white`}>
                      <CalendarIcon size={20} />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{session.title}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${session.format === 'Virtual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {session.format}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{session.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <CalendarIcon size={12} className="mr-1" />
                            {session.date}
                          </span>
                          <span className="flex items-center">
                            <ClockIcon size={12} className="mr-1" />
                            {session.start_time} - {session.end_time}
                          </span>
                          <span className="flex items-center">
                            <UsersIcon size={12} className="mr-1" />
                            {session.registered_count} Registered
                          </span>
                        </div>
                        <button className="rounded-md border border-ash-teal bg-white px-3 py-1 text-xs font-medium text-ash-teal hover:bg-ash-teal/10">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button className="flex items-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
                <CalendarIcon size={16} className="mr-2" />
                Schedule New Training
              </button>
            </div>
          </div>

          {/* Module details modal */}
          {selectedModule && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedModule.title}</h3>
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XIcon size={24} />
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-600">{selectedModule.description}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Type</p>
                        <p className="text-sm font-medium text-gray-900">{selectedModule.type}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Format</p>
                        <p className="text-sm font-medium text-gray-900">{selectedModule.format}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Duration</p>
                        <p className="text-sm font-medium text-gray-900">{selectedModule.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Completion Rate</p>
                        <p className="text-sm font-medium text-gray-900">{selectedModule.completion_rate}%</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Target Audience</p>
                        <p className="text-sm font-medium text-gray-900">{selectedModule.target_audience}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Difficulty Level</p>
                        <p className="text-sm font-medium text-gray-900">{selectedModule.difficulty_level}</p>
                      </div>
                    </div>
                    {selectedModule.learning_objectives.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-gray-500">Learning Objectives</p>
                        <ul className="list-disc pl-5 text-sm text-gray-900">
                          {selectedModule.learning_objectives.map((objective, index) => (
                            <li key={index}>{objective}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {selectedModule.resource && (
                    <div className="rounded-lg bg-gray-100 p-4">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ash-teal text-white">
                          <PlayIcon size={20} />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-900">Module Content</h4>
                          <p className="text-sm text-gray-500">Click to view or download the training materials</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2">
                          <div className="flex items-center">
                            {selectedModule.resource.file_type === 'mp4' ? (
                              <PlayIcon size={16} className="mr-2 text-ash-teal" />
                            ) : (
                              <FileTextIcon size={16} className="mr-2 text-ash-teal" />
                            )}
                            <span className="text-sm">{selectedModule.resource.title}</span>
                          </div>
                          <a
                            href={selectedModule.resource.file_url}
                            download
                            className="rounded-md bg-gray-100 p-1 text-gray-600 hover:bg-gray-200"
                          >
                            <DownloadIcon size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
                  >
                    Edit Module
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add module modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Training Module</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XIcon size={24} />
                  </button>
                </div>
                <form onSubmit={handleCreateModule} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Module Title</label>
                    <input
                      type="text"
                      className={`w-full mt-1 p-3 border ${formErrors.title ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-ash-teal focus:border-ash-teal transition-all`}
                      placeholder="Enter module title"
                      value={formData.title}
                      onChange={e => handleFormChange('title', e.target.value)}
                    />
                    {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      className={`w-full mt-1 p-3 border ${formErrors.description ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-ash-teal focus:border-ash-teal transition-all`}
                      rows={3}
                      placeholder="Enter module description"
                      value={formData.description}
                      onChange={e => handleFormChange('description', e.target.value)}
                    ></textarea>
                    {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        className={`w-full mt-1 p-3 border ${formErrors.type ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-ash-teal focus:border-ash-teal`}
                        value={formData.type}
                        onChange={e => handleFormChange('type', e.target.value as 'Required' | 'Optional')}
                      >
                        <option value="Required">Required</option>
                        <option value="Optional">Optional</option>
                      </select>
                      {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Format</label>
                      <select
                        className={`w-full mt-1 p-3 border ${formErrors.format ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-ash-teal focus:border-ash-teal`}
                        value={formData.format}
                        onChange={e => handleFormChange('format', e.target.value as 'Video' | 'Interactive' | 'Document' | 'Video + Quiz' | 'Document + Quiz')}
                      >
                        <option value="Video">Video</option>
                        <option value="Interactive">Interactive</option>
                        <option value="Document">Document</option>
                        <option value="Video + Quiz">Video + Quiz</option>
                        <option value="Document + Quiz">Document + Quiz</option>
                      </select>
                      {formErrors.format && <p className="text-red-500 text-xs mt-1">{formErrors.format}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        className={`w-full mt-1 p-3 border ${formErrors.duration ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-ash-teal focus:border-ash-teal`}
                        placeholder="e.g. 45 min"
                        value={formData.duration}
                        onChange={e => handleFormChange('duration', e.target.value)}
                      />
                      {formErrors.duration && <p className="text-red-500 text-xs mt-1">{formErrors.duration}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                      <select
                        className={`w-full mt-1 p-3 border ${formErrors.target_audience ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-ash-teal focus:border-ash-teal`}
                        value={formData.target_audience}
                        onChange={e => handleFormChange('target_audience', e.target.value as 'All Ambassadors' | 'New Ambassadors' | 'Senior Ambassadors')}
                      >
                        <option value="All Ambassadors">All Ambassadors</option>
                        <option value="New Ambassadors">New Ambassadors</option>
                        <option value="Senior Ambassadors">Senior Ambassadors</option>
                      </select>
                      {formErrors.target_audience && <p className="text-red-500 text-xs mt-1">{formErrors.target_audience}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
                      <select
                        className={`w-full mt-1 p-3 border ${formErrors.difficulty_level ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-ash-teal focus:border-ash-teal`}
                        value={formData.difficulty_level}
                        onChange={e => handleFormChange('difficulty_level', e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                      {formErrors.difficulty_level && <p className="text-red-500 text-xs mt-1">{formErrors.difficulty_level}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Learning Objectives (one per line)</label>
                    <textarea
                      className={`w-full mt-1 p-3 border ${formErrors.learning_objectives ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-ash-teal focus:border-ash-teal`}
                      rows={4}
                      placeholder="Enter learning objectives, one per line"
                      value={formData.learning_objectives.join('\n')}
                      onChange={e => handleFormChange('learning_objectives', e.target.value.split('\n').filter(obj => obj.trim()))}
                    ></textarea>
                    {formErrors.learning_objectives && <p className="text-red-500 text-xs mt-1">{formErrors.learning_objectives}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Applicable Countries</label>
                    <select
                      multiple
                      className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ash-teal focus:border-ash-teal"
                      value={formData.applicable_countries}
                      onChange={e => handleFormChange('applicable_countries', Array.from(e.target.selectedOptions, option => option.value))}
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Materials</label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-4">
                      <div className="space-y-1 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <PlusIcon size={24} className="text-gray-400" />
                        </div>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-ash-teal hover:text-ash-teal/80">
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              multiple
                              accept=".pdf,.ppt,.pptx,.mp4,.docx"
                              onChange={e => handleFormChange('materials', e.target.files || undefined)}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, PPT, MP4, DOCX up to 50MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90 flex items-center gap-2"
                    >
                      <Save size={16} /> Create Module
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AmbassadorTrainingPage;