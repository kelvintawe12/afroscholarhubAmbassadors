import React, { useEffect, useState } from 'react';
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon, SearchIcon, FilterIcon, EyeIcon, DownloadIcon } from 'lucide-react';
import { DataTable } from '../../ui/widgets/DataTable';
import { getAmbassadorVisits } from '../../../api/ambassador';

export const ActivityLogPage = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would use the API client
        // const data = await getAmbassadorVisits('current-user-id')
        // For now, use mock data
        const mockData = [
          {
            id: 1,
            type: 'School Visit',
            school: 'Lagos Model School',
            location: 'Lagos, Nigeria',
            date: '2024-04-15T10:00:00Z',
            duration: '2 hours',
            studentsReached: 45,
            activities: ['Essay Workshop', 'Career Guidance'],
            notes: 'Very engaged students. Strong interest in STEM programs.',
            status: 'Completed'
          },
          {
            id: 2,
            type: 'School Visit',
            school: 'ABC Academy',
            location: 'Abuja, Nigeria',
            date: '2024-04-10T14:30:00Z',
            duration: '1.5 hours',
            studentsReached: 30,
            activities: ['Scholarship Information Session'],
            notes: 'Discussed application deadlines and requirements.',
            status: 'Completed'
          },
          {
            id: 3,
            type: 'Follow-up Call',
            school: 'Unity College',
            location: 'Ibadan, Nigeria',
            date: '2024-04-08T11:00:00Z',
            duration: '30 minutes',
            studentsReached: 0,
            activities: ['Partnership Discussion'],
            notes: 'Principal interested in expanding our program.',
            status: 'Completed'
          },
          {
            id: 4,
            type: 'School Visit',
            school: 'Heritage Academy',
            location: 'Kano, Nigeria',
            date: '2024-04-05T09:15:00Z',
            duration: '3 hours',
            studentsReached: 20,
            activities: ['Essay Workshop', 'Mock Interviews'],
            notes: 'Great turnout. Students showed excellent preparation.',
            status: 'Completed'
          },
          {
            id: 5,
            type: 'Email Outreach',
            school: 'XYZ High School',
            location: 'Lagos, Nigeria',
            date: '2024-04-03T16:00:00Z',
            duration: '15 minutes',
            studentsReached: 0,
            activities: ['Initial Contact'],
            notes: 'Sent introduction email with program overview.',
            status: 'Completed'
          },
          {
            id: 6,
            type: 'School Visit',
            school: 'Unity College',
            location: 'Ibadan, Nigeria',
            date: '2024-03-28T13:45:00Z',
            duration: '2.5 hours',
            studentsReached: 75,
            activities: ['Full Day Workshop', 'Parent Meeting'],
            notes: 'Excellent collaboration with school administration.',
            status: 'Completed'
          },
          {
            id: 7,
            type: 'Virtual Meeting',
            school: 'ABC Academy',
            location: 'Abuja, Nigeria',
            date: '2024-03-25T15:30:00Z',
            duration: '45 minutes',
            studentsReached: 0,
            activities: ['Program Planning'],
            notes: 'Planned upcoming visit activities and timeline.',
            status: 'Completed'
          },
          {
            id: 8,
            type: 'School Visit',
            school: 'Lagos Model School',
            location: 'Lagos, Nigeria',
            date: '2024-03-20T11:00:00Z',
            duration: '1 hour',
            studentsReached: 25,
            activities: ['Quick Check-in'],
            notes: 'Follow-up on previous workshop outcomes.',
            status: 'Completed'
          }
        ];
        setActivities(mockData);
        setFilteredActivities(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    let filtered = [...activities];

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type.toLowerCase().replace(' ', '') === filterType.toLowerCase());
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.activities.some((act: string) => act.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredActivities(filtered);
  }, [activities, filterType, searchQuery]);

  // Calculate metrics
  const totalActivities = activities.length;
  const totalStudentsReached = activities.reduce((sum, activity) => sum + activity.studentsReached, 0);
  const schoolVisits = activities.filter(activity => activity.type === 'School Visit').length;
  const thisMonthActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    const now = new Date();
    return activityDate.getMonth() === now.getMonth() && activityDate.getFullYear() === now.getFullYear();
  }).length;

  const activityColumns = [
    {
      header: 'Date',
      accessor: (row: any) => {
        const date = new Date(row.date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
      },
      sortable: true
    },
    {
      header: 'Type',
      accessor: (row: any) => (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
          row.type === 'School Visit' ? 'bg-green-100 text-green-800' :
          row.type === 'Follow-up Call' ? 'bg-blue-100 text-blue-800' :
          row.type === 'Email Outreach' ? 'bg-yellow-100 text-yellow-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {row.type}
        </span>
      )
    },
    {
      header: 'School',
      accessor: 'school'
    },
    {
      header: 'Location',
      accessor: (row: any) => (
        <div className="flex items-center">
          <MapPinIcon size={14} className="mr-1 text-gray-400" />
          {row.location}
        </div>
      )
    },
    {
      header: 'Duration',
      accessor: (row: any) => (
        <div className="flex items-center">
          <ClockIcon size={14} className="mr-1 text-gray-400" />
          {row.duration}
        </div>
      )
    },
    {
      header: 'Students',
      accessor: (row: any) => (
        <div className="flex items-center">
          <UsersIcon size={14} className="mr-1 text-gray-400" />
          {row.studentsReached}
        </div>
      ),
      sortable: true
    },
    {
      header: 'Activities',
      accessor: (row: any) => (
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
      accessor: (row: any) => (
        <div className="flex space-x-2">
          <button className="rounded-md bg-ash-teal p-1 text-white hover:bg-ash-teal/90" title="View Details">
            <EyeIcon size={14} />
          </button>
        </div>
      )
    }
  ];

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
              filterType === 'follow-upcall' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterType('follow-upcall')}
          >
            Follow-ups
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterType === 'emailoutreach' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterType('emailoutreach')}
          >
            Outreach
          </button>
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
          <button className="flex items-center rounded-md bg-ash-teal px-3 py-2 text-sm font-medium text-white hover:bg-ash-teal/90">
            <DownloadIcon size={16} className="mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredActivities.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <CalendarIcon size={48} className="mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No activities found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery || filterType !== 'all' ? 'Try adjusting your search or filters' : 'No activities logged yet'}
          </p>
          {(searchQuery || filterType !== 'all') && (
            <button
              className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Activities Table */}
      {!isLoading && filteredActivities.length > 0 && (
        <DataTable
          columns={activityColumns}
          data={filteredActivities}
          keyField="id"
          rowsPerPage={15}
        />
      )}

      {/* Activity Summary */}
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
              {activities.filter(a => a.type === 'Follow-up Call').length}
            </div>
            <div className="text-sm text-gray-500">Follow-ups</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {activities.filter(a => a.type === 'Email Outreach').length}
            </div>
            <div className="text-sm text-gray-500">Outreach</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {activities.filter(a => a.type === 'Virtual Meeting').length}
            </div>
            <div className="text-sm text-gray-500">Virtual Meetings</div>
          </div>
        </div>
      </div>
    </div>
  );
};
