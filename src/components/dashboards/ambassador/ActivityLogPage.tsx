import React, { useEffect, useState } from 'react';
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, SearchIcon, FilterIcon, EyeIcon, DownloadIcon, AlertCircleIcon, XIcon, EditIcon } from 'lucide-react';
import { DataTable } from '../../ui/widgets/DataTable';
import { getAmbassadorVisits, getAmbassadorTasks, updateTask, updateVisit } from '../../../api/ambassador';
import { useAuth } from '../../../hooks/useAuth';
import { LoadingSpinner } from '../../LoadingSpinner';

interface Activity {
  id: string;
  type: 'School Visit' | 'Task Completion' | 'Follow-up Call' | 'Email Outreach' | 'Virtual Meeting';
  school: string;
  location: string;
  date: string;
  duration: string;
  studentsReached: number;
  activities: string[];
  notes: string;
  status: string;
  leadsGenerated?: number;
  rawData?: any; // For storing original data
}

export const ActivityLogPage = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('all'); // New filter for date range

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch visits and tasks in parallel
        const [visitsData, tasksData] = await Promise.all([
          getAmbassadorVisits(user.id),
          getAmbassadorTasks(user.id)
        ]);

        const combinedActivities: Activity[] = [];

        // Transform visits data
        if (visitsData) {
          visitsData.forEach(visit => {
            combinedActivities.push({
              id: `visit-${visit.id}`,
              type: 'School Visit',
              school: visit.school_name || 'Unknown School',
              location: visit.school_location || 'Unknown Location',
              date: visit.visit_date,
              duration: visit.duration ? `${visit.duration} minutes` : 'Not recorded',
              studentsReached: visit.students_reached || 0,
              leadsGenerated: visit.leads_generated || 0,
              activities: [
                ...(visit.workshop_conducted ? ['Workshop'] : []),
                ...(visit.presentation_given ? ['Presentation'] : []),
                ...(visit.materials_distributed ? ['Material Distribution'] : []),
                ...(visit.follow_up_scheduled ? ['Follow-up Scheduled'] : [])
              ],
              notes: visit.notes || 'No notes provided',
              status: visit.status || 'Completed',
              rawData: visit
            });
          });
        }

        // Transform completed tasks data
        if (tasksData) {
          tasksData
            .filter(task => task.status === 'Completed')
            .forEach(task => {
              combinedActivities.push({
                id: `task-${task.id}`,
                type: 'Task Completion',
                school: task.school_id ? 'Assigned School' : 'General Task',
                location: 'N/A',
                date: task.updated_at,
                duration: 'N/A',
                studentsReached: 0,
                activities: [task.title],
                notes: task.description || 'Task completed',
                status: 'Completed',
                rawData: task
              });
            });
        }

        // Sort by date (most recent first)
        combinedActivities.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setActivities(combinedActivities);
        setFilteredActivities(combinedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to load activity data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [user?.id]);

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setEditedNotes(activity.notes);
    setIsEditModalOpen(true);
  };

  const handleUpdateNotes = async () => {
    if (!selectedActivity || !editedNotes.trim()) return;

    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const rawData = selectedActivity.rawData;

      if (selectedActivity.type === 'Task Completion' && rawData && 'id' in rawData && rawData.id) {
        // Update task
        await updateTask(rawData.id, { description: editedNotes });
        setUpdateMessage('Task notes updated successfully');
      } else if (selectedActivity.type === 'School Visit' && rawData && 'id' in rawData && rawData.id) {
        // Update visit
        await updateVisit(rawData.id, { notes: editedNotes });
        setUpdateMessage('Visit notes updated successfully');
      } else {
        setUpdateMessage('Unsupported activity type for editing');
        return;
      }

      // Refresh activities after update
      const fetchActivities = async () => {
        if (!user?.id) return;

        try {
          setIsLoading(true);
          const [visitsData, tasksData] = await Promise.all([
            getAmbassadorVisits(user.id),
            getAmbassadorTasks(user.id)
          ]);

          const combinedActivities: Activity[] = [];

          // Transform visits data
          if (visitsData) {
            visitsData.forEach(visit => {
              combinedActivities.push({
                id: `visit-${visit.id}`,
                type: 'School Visit',
                school: visit.school_name || 'Unknown School',
                location: visit.school_location || 'Unknown Location',
                date: visit.visit_date,
                duration: visit.duration ? `${visit.duration} minutes` : 'Not recorded',
                studentsReached: visit.students_reached || 0,
                leadsGenerated: visit.leads_generated || 0,
                activities: [
                  ...(visit.workshop_conducted ? ['Workshop'] : []),
                  ...(visit.presentation_given ? ['Presentation'] : []),
                  ...(visit.materials_distributed ? ['Material Distribution'] : []),
                  ...(visit.follow_up_scheduled ? ['Follow-up Scheduled'] : [])
                ],
                notes: visit.notes || 'No notes provided',
                status: visit.status || 'Completed',
                rawData: visit
              });
            });
          }

          // Transform completed tasks data
          if (tasksData) {
            tasksData
              .filter(task => task.status === 'Completed')
              .forEach(task => {
                combinedActivities.push({
                  id: `task-${task.id}`,
                  type: 'Task Completion',
                  school: task.school_id ? 'Assigned School' : 'General Task',
                  location: 'N/A',
                  date: task.updated_at,
                  duration: 'N/A',
                  studentsReached: 0,
                  activities: [task.title],
                  notes: task.description || 'Task completed',
                  status: 'Completed',
                  rawData: task
                });
              });
          }

          // Sort by date (most recent first)
          combinedActivities.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          setActivities(combinedActivities);
          setFilteredActivities(combinedActivities);
        } catch (error) {
          console.error('Error fetching activities:', error);
          setError('Failed to load activity data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchActivities();

      // Close modal after a short delay
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSelectedActivity(null);
      }, 1500);

    } catch (error) {
      console.error('Error updating notes:', error);
      setUpdateMessage('Failed to update notes. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const escapeCsvValue = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  useEffect(() => {
    let filtered = [...activities];

    // Apply type filter
    if (filterType !== 'all') {
      const filterMap: { [key: string]: string } = {
        schoolvisit: 'School Visit',
        taskcompletion: 'Task Completion',
        followup: 'Follow-up Call',
        outreach: 'Email Outreach',
        virtual: 'Virtual Meeting'
      };
      filtered = filtered.filter(activity => 
        activity.type === filterMap[filterType]
      );
    }

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(activity => 
        new Date(activity.date) >= filterDate
      );
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.school.toLowerCase().includes(query) ||
        activity.location.toLowerCase().includes(query) ||
        activity.notes.toLowerCase().includes(query) ||
        activity.activities.some(act => act.toLowerCase().includes(query))
      );
    }

    setFilteredActivities(filtered);
  }, [activities, filterType, searchQuery, dateRange]);

  // Calculate metrics
  const totalActivities = activities.length;
  const totalStudentsReached = activities.reduce((sum, activity) => sum + activity.studentsReached, 0);
  const totalLeadsGenerated = activities.reduce((sum, activity) => sum + (activity.leadsGenerated || 0), 0);
  const schoolVisits = activities.filter(activity => activity.type === 'School Visit').length;
  const thisMonthActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    const now = new Date();
    return activityDate.getMonth() === now.getMonth() && 
           activityDate.getFullYear() === now.getFullYear();
  }).length;

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'School Visit':
        return 'bg-green-100 text-green-800';
      case 'Task Completion':
        return 'bg-blue-100 text-blue-800';
      case 'Follow-up Call':
        return 'bg-yellow-100 text-yellow-800';
      case 'Email Outreach':
        return 'bg-purple-100 text-purple-800';
      case 'Virtual Meeting':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const activityColumns = [
    {
      header: 'Date',
      accessor: (row: Activity) => formatRelativeDate(row.date),
      sortable: true
    },
    {
      header: 'Type',
      accessor: (row: Activity) => (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getActivityTypeColor(row.type)}`}>
          {row.type}
        </span>
      )
    },
    {
      header: 'School',
      accessor: 'school',
      sortable: true
    },
    {
      header: 'Location',
      accessor: (row: Activity) => (
        <div className="flex items-center">
          <MapPinIcon size={14} className="mr-1 text-gray-400" />
          {row.location}
        </div>
      )
    },
    {
      header: 'Duration',
      accessor: (row: Activity) => (
        <div className="flex items-center">
          <ClockIcon size={14} className="mr-1 text-gray-400" />
          {row.duration}
        </div>
      )
    },
    {
      header: 'Impact',
      accessor: (row: Activity) => (
        <div className="text-sm">
          {row.studentsReached > 0 && (
            <div className="flex items-center">
              <UsersIcon size={14} className="mr-1 text-gray-400" />
              {row.studentsReached} students
            </div>
          )}
          {row.leadsGenerated && row.leadsGenerated > 0 && (
            <div className="flex items-center text-green-600">
              <span className="mr-1">🎯</span>
              {row.leadsGenerated} leads
            </div>
          )}
        </div>
      ),
      sortable: true
    },
    {
      header: 'Activities',
      accessor: (row: Activity) => (
        <div className="max-w-xs">
          <div className="flex flex-wrap gap-1">
            {row.activities.slice(0, 2).map((activity: string, index: number) => (
              <span key={index} className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {activity}
              </span>
            ))}
            {row.activities.length > 2 && (
              <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                +{row.activities.length - 2}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (row: Activity) => (
        <div className="flex space-x-2">
          <button 
            className="rounded-md bg-ash-teal p-1 text-white hover:bg-ash-teal/90" 
            title="Edit Activity"
            onClick={() => handleViewDetails(row)}
          >
            <EditIcon size={14} />
          </button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-ash-teal text-white rounded-lg hover:bg-ash-teal/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-sm text-gray-500">
          Track your ambassador activities and school visits
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <CalendarIcon size={20} className="text-ash-teal" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <UsersIcon size={20} className="text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Students Reached</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudentsReached}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <MapPinIcon size={20} className="text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">School Visits</p>
              <p className="text-2xl font-bold text-gray-900">{schoolVisits}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <ClockIcon size={20} className="text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{thisMonthActivities}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterType === 'all' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterType('all')}
          >
            All Activities
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterType === 'schoolvisit' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterType('schoolvisit')}
          >
            School Visits
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterType === 'taskcompletion' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterType('taskcompletion')}
          >
            Tasks
          </button>
          
          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm bg-white text-gray-700 hover:bg-gray-50"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search activities..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="flex items-center rounded-md bg-ash-teal px-3 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
            onClick={() => {
              // Export functionality
              const headers = ["Date", "Type", "School", "Location", "Duration", "Students Reached", "Leads Generated", "Activities", "Notes"];
              const csvContent = "data:text/csv;charset=utf-8," +
                headers.map(escapeCsvValue).join(",") + "\n" +
                filteredActivities.map(activity =>
                  [
                    escapeCsvValue(new Date(activity.date).toLocaleDateString()),
                    escapeCsvValue(activity.type),
                    escapeCsvValue(activity.school),
                    escapeCsvValue(activity.location),
                    escapeCsvValue(activity.duration),
                    escapeCsvValue(activity.studentsReached.toString()),
                    escapeCsvValue((activity.leadsGenerated || 0).toString()),
                    escapeCsvValue(activity.activities.join('; ')),
                    escapeCsvValue(activity.notes)
                  ].join(",")
                ).join("\n");

              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `activity_log_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <DownloadIcon size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* No Results */}
      {filteredActivities.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <CalendarIcon size={48} className="mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No activities found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery || filterType !== 'all' || dateRange !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'No activities logged yet. Start by visiting schools or completing tasks.'}
          </p>
          {(searchQuery || filterType !== 'all' || dateRange !== 'all') && (
            <button
              className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setDateRange('all');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Activities Table */}
      {filteredActivities.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <DataTable
            columns={activityColumns}
            data={filteredActivities}
            keyField="id"
            rowsPerPage={15}
          />
        </div>
      )}

      {/* Activity Summary */}
      {activities.length > 0 && (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Activity Summary</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-ash-teal">
                {activities.filter(a => a.type === 'School Visit').length}
              </div>
              <div className="text-sm text-gray-500">School Visits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {activities.filter(a => a.type === 'Task Completion').length}
              </div>
              <div className="text-sm text-gray-500">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalStudentsReached}
              </div>
              <div className="text-sm text-gray-500">Students Reached</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalLeadsGenerated}
              </div>
              <div className="text-sm text-gray-500">Leads Generated</div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Edit Activity</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="mb-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Activity Type</div>
              <div className="text-sm text-gray-500">{selectedActivity.type}</div>
            </div>

            <div className="mb-4">
              <div className="mb-2 text-sm font-medium text-gray-700">School</div>
              <div className="text-sm text-gray-500">{selectedActivity.school}</div>
            </div>

            <div className="mb-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Date</div>
              <div className="text-sm text-gray-500">{new Date(selectedActivity.date).toLocaleDateString()}</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal"
                rows={4}
                placeholder="Enter notes..."
              />
            </div>

            {updateMessage && (
              <div className={`mb-4 text-sm ${updateMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {updateMessage}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNotes}
                disabled={isUpdating || !editedNotes.trim()}
                className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90 disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
