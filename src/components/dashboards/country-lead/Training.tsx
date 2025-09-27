import React, { useState, useEffect } from 'react';
import { BookOpenIcon, CalendarIcon, CheckCircleIcon, ClockIcon, DownloadIcon, PlayIcon, XIcon, FileTextIcon } from 'lucide-react';
import { supabase } from '../../../utils/supabase';
import { updateTrainingProgress } from '../../../api/ambassador';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'Required' | 'Optional';
  format: 'Video' | 'Interactive' | 'Document' | 'Video + Quiz' | 'Document + Quiz';
  duration: string;
  target_audience: 'All Ambassadors' | 'New Ambassadors' | 'Senior Ambassadors';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  learning_objectives: string[];
  resource_id?: string;
  resource?: { file_url: string; file_type: string; title: string } | null;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Behind';
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

export const TrainingViewPage: React.FC = () => {
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; country_code: string } | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, country_code')
          .eq('id', user.id)
          .single();
        setUser(userData);
      }
    };
    fetchUser();
  }, []);

  // Fetch training modules and progress
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch training modules applicable to the user's country
        const { data: modulesData } = await supabase
          .from('training_modules')
          .select(`
            *,
            resources (file_url, file_type, title),
            ambassador_training_progress (progress, status, user_id)
          `)
          .eq('status', 'active')
          .contains('applicable_countries', [user.country_code]);

        const mappedModules = modulesData?.map(module => ({
          id: module.id,
          title: module.title,
          description: module.description,
          type: module.type as 'Required' | 'Optional',
          format: module.format as 'Video' | 'Interactive' | 'Document' | 'Video + Quiz' | 'Document + Quiz',
          duration: module.duration,
          target_audience: module.target_audience,
          difficulty_level: module.difficulty_level,
          learning_objectives: module.learning_objectives || [],
          resource_id: module.resource_id,
          resource: module.resources,
          progress: module.ambassador_training_progress.find((p: any) => p.user_id === user.id)?.progress || 0,
          status: module.ambassador_training_progress.find((p: any) => p.user_id === user.id)?.status || 'Not Started'
        })) || [];
        setTrainingModules(mappedModules);

        // Fetch upcoming training sessions
        const { data: sessionsData } = await supabase
          .from('training_sessions')
          .select('*')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true });
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
  }, [user]);

  // Handle marking a module as completed
  const handleMarkComplete = async (moduleId: string) => {
    if (!user) return;
    try {
      await updateTrainingProgress({
        user_id: user.id,
        training_module_id: moduleId,
        progress: 100,
        status: 'Completed'
      });
      setTrainingModules(prev =>
        prev.map(module =>
          module.id === moduleId
            ? { ...module, progress: 100, status: 'Completed' as 'Completed' }
            : module
        )
      );
      alert('Module marked as completed!');
    } catch (error: any) {
      alert(`Failed to mark module as completed: ${error.message}`);
    }
  };

  return (
    <div className="px-2 sm:px-4 lg:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ambassador Training</h1>
        <p className="text-sm text-gray-500">Complete your training modules and join upcoming sessions to enhance your skills.</p>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Training Modules Section */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Training Modules</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trainingModules.map(module => (
                <div key={module.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-900">{module.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${module.type === 'Required' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {module.type}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{module.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <span>{module.format}</span> • <span>{module.duration}</span> • <span>{module.difficulty_level}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${module.status === 'Completed' ? 'bg-green-100 text-green-800' : module.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : module.status === 'Behind' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {module.status === 'Completed' && <CheckCircleIcon size={12} className="mr-1" />}
                        {module.status === 'In Progress' && <ClockIcon size={12} className="mr-1" />}
                        {module.status === 'Behind' && <ClockIcon size={12} className="mr-1" />}
                        {module.status === 'Not Started' && <ClockIcon size={12} className="mr-1" />}
                        {module.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-1.5 rounded-full ${module.progress === 100 ? 'bg-green-500' : module.progress >= 60 ? 'bg-ash-teal' : 'bg-yellow-500'}`}
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button
                      onClick={() => setSelectedModule(module)}
                      className="rounded-md bg-ash-teal p-2 text-white hover:bg-ash-teal/90"
                      title="View Module"
                    >
                      <PlayIcon size={14} />
                    </button>
                    {module.status !== 'Completed' && (
                      <button
                        onClick={() => handleMarkComplete(module.id)}
                        className="rounded-md bg-green-600 p-2 text-white hover:bg-green-700"
                        title="Mark as Completed"
                      >
                        <CheckCircleIcon size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Training Sessions */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-base font-medium text-gray-700 mb-4">Upcoming Training Sessions</h3>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 overflow-x-auto">
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
                          {session.format === 'Virtual' && session.meeting_link ? (
                            <a href={session.meeting_link} target="_blank" rel="noopener noreferrer" className="text-ash-teal hover:underline">
                              Join Link
                            </a>
                          ) : (
                            session.location || 'TBD'
                          )}
                        </span>
                      </div>
                      <button className="rounded-md border border-ash-teal bg-white px-3 py-1 text-xs font-medium text-ash-teal hover:bg-ash-teal/10">
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module Details Modal */}
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
                        <p className="text-xs font-medium text-gray-500">Difficulty Level</p>
                        <p className="text-sm font-medium text-gray-900">{selectedModule.difficulty_level}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Target Audience</p>
                        <p className="text-sm font-medium text-gray-900">{selectedModule.target_audience}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Progress</p>
                        <p className="text-sm font-medium text-gray-900">{selectedModule.progress}%</p>
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
                          <p className="text-sm text-gray-500">Access the training materials below</p>
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
                          <div className="flex space-x-2">
                            <a
                              href={selectedModule.resource.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-md bg-ash-teal p-1.5 text-white hover:bg-ash-teal/90"
                            >
                              <PlayIcon size={14} />
                            </a>
                            <a
                              href={selectedModule.resource.file_url}
                              download
                              className="rounded-md bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
                            >
                              <DownloadIcon size={14} />
                            </a>
                          </div>
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
                  {selectedModule.status !== 'Completed' && (
                    <button
                      onClick={() => handleMarkComplete(selectedModule.id)}
                      className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrainingViewPage;