import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { UsersIcon, PlusIcon, FilterIcon, SearchIcon, MailIcon, PhoneIcon, CheckCircleIcon, XCircleIcon, ClockIcon, MoreHorizontalIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, MessageSquareIcon, FileTextIcon, MapPinIcon, AlertTriangleIcon } from 'lucide-react';
import { useCountryAmbassadors } from '../../../hooks/useDashboardData';
import { useAuth } from '../../../contexts/AuthContext';
const AddAmbassadorModal: React.FC<{ onClose: () => void; onAdd?: (ambassador: any) => void }> = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    role: 'Ambassador'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Call your API to add ambassador here
    setTimeout(() => {
      setSubmitting(false);
      if (onAdd) onAdd(form);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width={20} height={20} fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l8 8M6 14L14 6" /></svg>
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Ambassador</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:ring-ash-teal"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:ring-ash-teal"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:ring-ash-teal"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Region</label>
            <input
              type="text"
              name="region"
              value={form.region}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:ring-ash-teal"
              placeholder="Enter region"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:ring-ash-teal"
            >
              <option value="Ambassador">Ambassador</option>
              <option value="Lead">Lead</option>
              <option value="Coordinator">Coordinator</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-ash-teal px-4 py-2 text-white font-medium hover:bg-ash-teal/90 transition"
          >
            {submitting ? 'Adding...' : 'Add Ambassador'}
          </button>
        </form>
      </div>
    </div>
  );
};
export const TeamPage = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const { user } = useAuth();

  // Use the country code from URL params, fallback to user's country or 'ng'
  const currentCountryCode = countryCode || user?.country_code || 'ng';

  const { data: ambassadorData, loading: ambassadorsLoading, error: ambassadorsError } = useCountryAmbassadors(currentCountryCode);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAddAmbassador, setShowAddAmbassador] = useState(false);

  // Transform ambassador data for display
  const ambassadors = useMemo(() => {
    return ambassadorData ? ambassadorData.map(ambassador => ({
      id: ambassador.id,
      name: ambassador.full_name,
      email: ambassador.email,
      phone: '', // Not available in the hook data
      region: ambassador.country_code,
      status: ambassador.status,
      role: 'Ambassador',
      joinDate: new Date().toISOString().split('T')[0], // Placeholder
      performance: ambassador.performance_score,
      schoolsCount: ambassador.schools_count,
      studentsReached: ambassador.leads_generated,
      lastActivity: ambassador.last_activity,
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg', // Placeholder
      bio: '',
      skills: []
    })) : [];
  }, [ambassadorData]);


  // Get unique regions for filter
  const regions = Array.from(new Set(ambassadors.map(ambassador => ambassador.region)));
  // Get team metrics
  const totalAmbassadors = ambassadors.length;
  const activeAmbassadors = ambassadors.filter(ambassador => ambassador.status === 'active').length;
  const totalSchools = ambassadors.reduce((sum, ambassador) => sum + ambassador.schoolsCount, 0);
  const totalStudents = ambassadors.reduce((sum, ambassador) => sum + ambassador.studentsReached, 0);
  const averagePerformance = Math.round(ambassadors.reduce((sum, ambassador) => sum + ambassador.performance, 0) / ambassadors.length);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircleIcon size={12} className="mr-1" /> Active
          </span>;
      case 'inactive':
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <XCircleIcon size={12} className="mr-1" /> Inactive
          </span>;
      case 'training':
        return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <ClockIcon size={12} className="mr-1" /> Training
          </span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>;
    }
  };
  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  // Add this handler to update ambassadors list after adding
  const [localAddedAmbassadors, setLocalAddedAmbassadors] = useState<any[]>([]);

  const handleAddAmbassador = (newAmbassador: any) => {
    setLocalAddedAmbassadors((prev: any[]) => [
      {
        ...newAmbassador,
        id: Date.now(), // Temporary ID for demo
        performance: 0,
        schoolsCount: 0,
        studentsReached: 0,
        lastActivity: 'Just now',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        status: 'active',
        bio: '',
        skills: []
      },
      ...prev
    ]);
  };

  // Combine fetched ambassadors with locally added ambassadors
  const combinedAmbassadors = useMemo(() => {
    return [...localAddedAmbassadors, ...ambassadors];
  }, [localAddedAmbassadors, ambassadors]);

  // Use combinedAmbassadors for filtering and sorting
  const filteredAmbassadors = useMemo(() => {
    let filtered = [...combinedAmbassadors];
    if (filterStatus !== 'all') {
      filtered = filtered.filter(ambassador => ambassador.status === filterStatus);
    }
    if (filterRegion !== 'all') {
      filtered = filtered.filter(ambassador => ambassador.region === filterRegion);
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(ambassador =>
        ambassador.name.toLowerCase().includes(lowerQuery) ||
        ambassador.email.toLowerCase().includes(lowerQuery) ||
        ambassador.region.toLowerCase().includes(lowerQuery)
      );
    }
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'performance':
          comparison = a.performance - b.performance;
          break;
        case 'schoolsCount':
          comparison = a.schoolsCount - b.schoolsCount;
          break;
        case 'studentsReached':
          comparison = a.studentsReached - b.studentsReached;
          break;
        case 'joinDate':
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return filtered;
  }, [combinedAmbassadors, filterStatus, filterRegion, searchQuery, sortField, sortDirection]);
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <p className="text-sm text-gray-500">
          Manage your ambassador team, track performance, and assign tasks
        </p>
      </div>

      {/* Team Overview Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ash-teal/10 text-ash-teal">
              <UsersIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Team Size</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {totalAmbassadors}
              </h3>
              <p className="text-xs text-gray-500">
                {activeAmbassadors} active
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <MapPinIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Regions</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {regions.length}
              </h3>
              <p className="text-xs text-gray-500">Coverage areas</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FileTextIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Schools</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {totalSchools}
              </h3>
              <p className="text-xs text-gray-500">Total partnerships</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <UsersIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Students</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {totalStudents}
              </h3>
              <p className="text-xs text-gray-500">Total reached</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <CheckCircleIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Performance</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {averagePerformance}%
              </h3>
              <p className="text-xs text-gray-500">Team average</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex w-full flex-wrap items-center space-x-2 sm:w-auto">
          <div className="relative">
            <button className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FilterIcon size={16} className="mr-2" />
              Filter
            </button>
          </div>
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="training">Training</option>
            </select>
          </div>
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50" value={filterRegion} onChange={e => setFilterRegion(e.target.value)}>
              <option value="all">All Regions</option>
              {regions.map(region => <option key={region} value={region}>
                  {region}
                </option>)}
            </select>
          </div>
        </div>
        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input type="search" placeholder="Search ambassadors..." className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="flex items-center rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90" onClick={() => setShowAddAmbassador(true)}>
            <PlusIcon size={16} className="mr-2" />
            Add Ambassador
          </button>
        </div>
      </div>

      {/* Loading State */}
      {ambassadorsLoading && <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
        </div>}

      {/* No Results */}
      {!ambassadorsLoading && filteredAmbassadors.length === 0 && <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <UsersIcon size={48} className="mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No ambassadors found
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery || filterStatus !== 'all' || filterRegion !== 'all' ? 'Try adjusting your search or filters' : 'Add your first ambassador to get started'}
          </p>
          {(searchQuery || filterStatus !== 'all' || filterRegion !== 'all') && <button className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {
        setSearchQuery('');
        setFilterStatus('all');
        setFilterRegion('all');
      }}>
              Clear filters
            </button>}
        </div>}

      {/* Ambassador List */}
      {!ambassadorsLoading && filteredAmbassadors.length > 0 && <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <button className="flex items-center" onClick={() => handleSort('name')}>
                      Ambassador
                      {sortField === 'name' && <span className="ml-1">
                          {sortDirection === 'asc' ? <ArrowUpCircleIcon size={14} /> : <ArrowDownCircleIcon size={14} />}
                        </span>}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Region
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <button className="flex items-center" onClick={() => handleSort('performance')}>
                      Performance
                      {sortField === 'performance' && <span className="ml-1">
                          {sortDirection === 'asc' ? <ArrowUpCircleIcon size={14} /> : <ArrowDownCircleIcon size={14} />}
                        </span>}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <button className="flex items-center" onClick={() => handleSort('schoolsCount')}>
                      Schools
                      {sortField === 'schoolsCount' && <span className="ml-1">
                          {sortDirection === 'asc' ? <ArrowUpCircleIcon size={14} /> : <ArrowDownCircleIcon size={14} />}
                        </span>}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <button className="flex items-center" onClick={() => handleSort('studentsReached')}>
                      Students
                      {sortField === 'studentsReached' && <span className="ml-1">
                          {sortDirection === 'asc' ? <ArrowUpCircleIcon size={14} /> : <ArrowDownCircleIcon size={14} />}
                        </span>}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Activity
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAmbassadors.map(ambassador => <tr key={ambassador.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-full object-cover" src={ambassador.avatar} alt={ambassador.name} />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {ambassador.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {ambassador.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <a href={`mailto:${ambassador.email}`} className="flex items-center text-sm text-ash-teal hover:underline">
                          <MailIcon size={14} className="mr-1" />
                          <span>{ambassador.email}</span>
                        </a>
                        <a href={`tel:${ambassador.phone}`} className="flex items-center text-sm text-gray-600 hover:underline">
                          <PhoneIcon size={14} className="mr-1" />
                          <span>{ambassador.phone}</span>
                        </a>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <MapPinIcon size={14} className="mr-1 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {ambassador.region}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {getStatusBadge(ambassador.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">
                            {ambassador.performance}%
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                          <div className={`h-1.5 rounded-full ${getPerformanceColor(ambassador.performance)}`} style={{
                      width: `${ambassador.performance}%`
                    }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {ambassador.schoolsCount}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {ambassador.studentsReached}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {ambassador.lastActivity}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="rounded-md bg-ash-teal p-1 text-white hover:bg-ash-teal/90" title="Message">
                          <MessageSquareIcon size={16} />
                        </button>
                        <button className="rounded-md bg-ash-gold p-1 text-ash-dark hover:bg-ash-gold/90" title="Assign Task">
                          <PlusIcon size={16} />
                        </button>
                        <button className="rounded-md bg-gray-200 p-1 text-gray-600 hover:bg-gray-300" title="More Options">
                          <MoreHorizontalIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{' '}
                  <span className="font-medium">
                    {filteredAmbassadors.length}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">
                    {filteredAmbassadors.length}
                  </span>{' '}
                  ambassadors
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
                <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>}

      {/* Action Items */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-base font-medium text-gray-900">
          Team Action Items
        </h3>
        <div className="divide-y divide-gray-200">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <AlertTriangleIcon size={16} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Performance Review
                </p>
                <p className="text-xs text-gray-500">
                  3 ambassadors need performance reviews
                </p>
              </div>
            </div>
            <button className="rounded-md border border-ash-teal bg-white px-3 py-1.5 text-xs font-medium text-ash-teal hover:bg-ash-teal/10">
              Schedule Reviews
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircleIcon size={16} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Training Session
                </p>
                <p className="text-xs text-gray-500">
                  Schedule monthly training for new ambassadors
                </p>
              </div>
            </div>
            <button className="rounded-md border border-ash-teal bg-white px-3 py-1.5 text-xs font-medium text-ash-teal hover:bg-ash-teal/10">
              Schedule Training
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-start">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <FileTextIcon size={16} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Quarterly Reports
                </p>
                <p className="text-xs text-gray-500">
                  Review and submit Q1 ambassador performance reports
                </p>
              </div>
            </div>
            <button className="rounded-md border border-ash-teal bg-white px-3 py-1.5 text-xs font-medium text-ash-teal hover:bg-ash-teal/10">
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Add this just before the closing </div> of your main return */}
      {showAddAmbassador && (
        <AddAmbassadorModal
          onClose={() => setShowAddAmbassador(false)}
          onAdd={handleAddAmbassador}
        />
      )}
    </div>;
};