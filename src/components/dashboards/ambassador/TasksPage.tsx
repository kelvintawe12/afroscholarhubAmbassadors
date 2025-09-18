import React, { useEffect, useState } from 'react';
import { CheckSquareIcon, ClockIcon, CalendarIcon, AlertCircleIcon, PlusIcon, FilterIcon, CheckIcon, XIcon, FlagIcon, ChevronDownIcon, SearchIcon, MoreHorizontalIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { getAmbassadorTasks, updateTask } from '../../../api/ambassador';
export const TasksPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would use the API client
        // const data = await getAmbassadorTasks('current-user-id')
        // For now, use mock data
        const mockData = [{
          id: 1,
          title: 'Submit Monthly Report',
          description: 'Complete and submit the monthly activity report with metrics and outcomes',
          school: 'All Schools',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          priority: 'High',
          status: 'In Progress',
          progress: 75,
          createdAt: '2024-04-01T10:00:00Z',
          tags: ['report', 'monthly'],
          assignedBy: 'Aisha Mohammed',
          notes: 'Include details on all school visits and student engagement metrics'
        }, {
          id: 2,
          title: 'Follow up with Lagos Model School',
          description: 'Contact the principal about the partnership agreement and next steps',
          school: 'Lagos Model School',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'High',
          status: 'Pending',
          progress: 0,
          createdAt: '2024-04-02T14:30:00Z',
          tags: ['follow-up', 'partnership'],
          assignedBy: 'Aisha Mohammed',
          notes: 'Principal was interested in scholarship opportunities'
        }, {
          id: 3,
          title: 'Prepare for Career Day',
          description: 'Create presentation and materials for the upcoming career day event',
          school: 'ABC Academy',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'Medium',
          status: 'In Progress',
          progress: 30,
          createdAt: '2024-04-03T09:15:00Z',
          tags: ['event', 'presentation'],
          assignedBy: 'Self',
          notes: 'Focus on STEM careers and scholarship opportunities'
        }, {
          id: 4,
          title: 'Update School Contact Information',
          description: 'Verify and update contact details for all assigned schools in the system',
          school: 'All Schools',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'Low',
          status: 'Pending',
          progress: 0,
          createdAt: '2024-04-04T11:45:00Z',
          tags: ['admin', 'contacts'],
          assignedBy: 'System',
          notes: 'Ensure all email addresses and phone numbers are current'
        }, {
          id: 5,
          title: 'Submit Visit Report - XYZ High School',
          description: "Complete the visit report with photos and metrics from yesterday's school visit",
          school: 'XYZ High School',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'High',
          status: 'Pending',
          progress: 0,
          createdAt: '2024-04-05T08:00:00Z',
          tags: ['report', 'visit'],
          assignedBy: 'System',
          notes: 'Include student feedback and photos from the workshop',
          isOverdue: true
        }, {
          id: 6,
          title: 'Collect Student Feedback Forms',
          description: 'Gather feedback forms from the workshop participants and compile results',
          school: 'Unity College',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'Medium',
          status: 'Pending',
          progress: 0,
          createdAt: '2024-04-06T13:20:00Z',
          tags: ['feedback', 'workshop'],
          assignedBy: 'Aisha Mohammed',
          notes: 'Need to analyze responses for the quarterly report',
          isOverdue: true
        }, {
          id: 7,
          title: 'Schedule Principal Meeting',
          description: 'Arrange meeting with the new principal at Heritage Academy',
          school: 'Heritage Academy',
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'High',
          status: 'Completed',
          progress: 100,
          createdAt: '2024-04-07T10:30:00Z',
          completedAt: '2024-04-08T14:45:00Z',
          tags: ['meeting', 'principal'],
          assignedBy: 'Self',
          notes: 'Meeting scheduled for next Tuesday at 2pm'
        }, {
          id: 8,
          title: 'Order New Brochures',
          description: 'Request new marketing materials for school visits from headquarters',
          school: 'All Schools',
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'Medium',
          status: 'Completed',
          progress: 100,
          createdAt: '2024-04-08T09:00:00Z',
          completedAt: '2024-04-09T11:30:00Z',
          tags: ['materials', 'marketing'],
          assignedBy: 'System',
          notes: 'Ordered 500 brochures and 100 posters'
        }, {
          id: 9,
          title: 'Review Student Applications',
          description: 'Review and provide feedback on scholarship applications from multiple schools',
          school: 'Multiple Schools',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'Medium',
          status: 'Pending',
          progress: 0,
          createdAt: '2024-04-09T15:45:00Z',
          tags: ['scholarship', 'review'],
          assignedBy: 'Aisha Mohammed',
          notes: '15 applications need review before the committee meeting'
        }, {
          id: 10,
          title: 'Attend Weekly Team Meeting',
          description: 'Virtual team sync with country lead and other ambassadors',
          school: 'N/A',
          dueDate: new Date().toISOString(),
          priority: 'High',
          status: 'Pending',
          progress: 0,
          createdAt: '2024-04-10T08:30:00Z',
          tags: ['meeting', 'team'],
          assignedBy: 'Aisha Mohammed',
          notes: 'Meeting at 3pm via Zoom, prepare weekly updates',
          isDueToday: true
        }];
        setTasks(mockData);
        setFilteredTasks(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);
  useEffect(() => {
    // Filter and sort tasks
    let filtered = [...tasks];
    // Apply status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'overdue') {
        filtered = filtered.filter(task => task.isOverdue && task.status !== 'Completed');
      } else if (filterStatus === 'today') {
        filtered = filtered.filter(task => task.isDueToday && task.status !== 'Completed');
      } else if (filterStatus === 'completed') {
        filtered = filtered.filter(task => task.status === 'Completed');
      } else if (filterStatus === 'pending') {
        filtered = filtered.filter(task => task.status === 'Pending' && !task.isOverdue && !task.isDueToday);
      } else if (filterStatus === 'in-progress') {
        filtered = filtered.filter(task => task.status === 'In Progress');
      }
    }
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase()) || task.school.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3
          };
          comparison = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    setFilteredTasks(filtered);
  }, [tasks, filterStatus, searchQuery, sortField, sortDirection]);
  // Get task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const dueTodayTasks = tasks.filter(task => task.isDueToday && task.status !== 'Completed').length;
  const overdueTasks = tasks.filter(task => task.isOverdue && task.status !== 'Completed').length;
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      // In a real app, this would call the API
      // await updateTask(taskId, { status: newStatus })
      // For now, update locally
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status: newStatus,
            progress: newStatus === 'Completed' ? 100 : task.progress,
            completedAt: newStatus === 'Completed' ? new Date().toISOString() : undefined
          };
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusBadgeClass = (status: string, isOverdue?: boolean, isDueToday?: boolean) => {
    if (status === 'Completed') {
      return 'bg-green-100 text-green-800';
    } else if (isOverdue) {
      return 'bg-red-100 text-red-800';
    } else if (isDueToday) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (status === 'In Progress') {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusText = (status: string, isOverdue?: boolean, isDueToday?: boolean) => {
    if (status === 'Completed') {
      return 'Completed';
    } else if (isOverdue) {
      return 'Overdue';
    } else if (isDueToday) {
      return 'Due Today';
    } else {
      return status;
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    // Check if date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    // Check if date is in the past
    if (date < today) {
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        return 'Yesterday';
      } else {
        return `${diffDays} days ago`;
      }
    }
    // For future dates beyond tomorrow
    const diffTime = Math.abs(date.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) {
      return `In ${diffDays} days`;
    }
    return date.toLocaleDateString();
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-sm text-gray-500">
          Manage your tasks, track progress, and stay organized
        </p>
      </div>
      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ash-teal/10 text-ash-teal">
              <CheckSquareIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalTasks}</h3>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <CheckIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {completedTasks}
              </h3>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <ClockIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Due Today</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {dueTodayTasks}
              </h3>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <AlertCircleIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {overdueTasks}
              </h3>
            </div>
          </div>
        </div>
      </div>
      {/* Filters and Search */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button className={`rounded-md px-3 py-1.5 text-sm font-medium ${filterStatus === 'all' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setFilterStatus('all')}>
            All Tasks
          </button>
          <button className={`rounded-md px-3 py-1.5 text-sm font-medium ${filterStatus === 'today' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setFilterStatus('today')}>
            Due Today
          </button>
          <button className={`rounded-md px-3 py-1.5 text-sm font-medium ${filterStatus === 'overdue' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setFilterStatus('overdue')}>
            Overdue
          </button>
          <button className={`rounded-md px-3 py-1.5 text-sm font-medium ${filterStatus === 'completed' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => setFilterStatus('completed')}>
            Completed
          </button>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input type="search" placeholder="Search tasks..." className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="relative">
            <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FilterIcon size={16} className="mr-1" />
              Filter
              <ChevronDownIcon size={16} className="ml-1" />
            </button>
          </div>
          <button className="flex items-center rounded-md bg-ash-teal px-3 py-2 text-sm font-medium text-white hover:bg-ash-teal/90" onClick={() => setIsAddTaskModalOpen(true)}>
            <PlusIcon size={16} className="mr-1" />
            Add Task
          </button>
        </div>
      </div>
      {/* Loading State */}
      {isLoading && <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
        </div>}
      {/* No Results */}
      {!isLoading && filteredTasks.length === 0 && <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <CheckSquareIcon size={48} className="mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No tasks found
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'Add your first task to get started'}
          </p>
          {(searchQuery || filterStatus !== 'all') && <button className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {
        setSearchQuery('');
        setFilterStatus('all');
      }}>
              Clear filters
            </button>}
        </div>}
      {/* Tasks Table */}
      {!isLoading && filteredTasks.length > 0 && <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 px-6 py-3 text-center">
                  <span className="sr-only">Complete</span>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500" onClick={() => handleSort('priority')}>
                  <div className="flex cursor-pointer items-center">
                    <span>Priority</span>
                    {sortField === 'priority' && <span className="ml-1">
                        {sortDirection === 'asc' ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
                      </span>}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500" onClick={() => handleSort('title')}>
                  <div className="flex cursor-pointer items-center">
                    <span>Task</span>
                    {sortField === 'title' && <span className="ml-1">
                        {sortDirection === 'asc' ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
                      </span>}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  School
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Progress
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500" onClick={() => handleSort('dueDate')}>
                  <div className="flex cursor-pointer items-center">
                    <span>Due Date</span>
                    {sortField === 'dueDate' && <span className="ml-1">
                        {sortDirection === 'asc' ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
                      </span>}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500" onClick={() => handleSort('status')}>
                  <div className="flex cursor-pointer items-center">
                    <span>Status</span>
                    {sortField === 'status' && <span className="ml-1">
                        {sortDirection === 'asc' ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
                      </span>}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredTasks.map(task => <tr key={task.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-ash-teal focus:ring-ash-teal" checked={task.status === 'Completed'} onChange={() => handleStatusChange(task.id, task.status === 'Completed' ? 'Pending' : 'Completed')} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-medium ${task.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </div>
                    {task.description && <div className={`mt-1 text-sm ${task.status === 'Completed' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {task.description.length > 80 ? `${task.description.substring(0, 80)}...` : task.description}
                      </div>}
                    {task.tags && task.tags.length > 0 && <div className="mt-2 flex flex-wrap gap-1">
                        {task.tags.map((tag: string, index: number) => <span key={index} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            #{tag}
                          </span>)}
                      </div>}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {task.school}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full max-w-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                          {task.progress}%
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                        <div className={`h-1.5 rounded-full ${task.status === 'Completed' ? 'bg-green-500' : 'bg-ash-teal'}`} style={{
                    width: `${task.progress}%`
                  }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className={`flex items-center ${task.isOverdue && task.status !== 'Completed' ? 'text-red-600' : task.isDueToday && task.status !== 'Completed' ? 'text-yellow-600' : 'text-gray-500'}`}>
                      <CalendarIcon size={14} className="mr-1" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(task.status, task.isOverdue, task.isDueToday)}`}>
                      {getStatusText(task.status, task.isOverdue, task.isDueToday)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      {task.status !== 'Completed' && <button className="rounded-md bg-green-500 p-1 text-white hover:bg-green-600" onClick={() => handleStatusChange(task.id, 'Completed')} aria-label="Mark as completed">
                          <CheckIcon size={14} />
                        </button>}
                      {task.status === 'Pending' && <button className="rounded-md bg-blue-500 p-1 text-white hover:bg-blue-600" onClick={() => handleStatusChange(task.id, 'In Progress')} aria-label="Mark as in progress">
                          <ClockIcon size={14} />
                        </button>}
                      <button className="rounded-md bg-gray-200 p-1 text-gray-600 hover:bg-gray-300" aria-label="More options">
                        <MoreHorizontalIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}
      {/* Pagination */}
      {!isLoading && filteredTasks.length > 0 && <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">{filteredTasks.length}</span> of{' '}
                <span className="font-medium">{filteredTasks.length}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>}
      {/* Quick Actions */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-base font-medium text-gray-900">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <FlagIcon size={16} className="mr-2" />
            Flag Task for Help
          </button>
          <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <CalendarIcon size={16} className="mr-2" />
            View Task Calendar
          </button>
          <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <CheckSquareIcon size={16} className="mr-2" />
            Mark All as Read
          </button>
        </div>
      </div>
    </div>;
};