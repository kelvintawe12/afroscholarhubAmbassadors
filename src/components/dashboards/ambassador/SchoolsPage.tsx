import { useEffect, useState } from 'react';
import { SchoolIcon, MapPinIcon, UsersIcon, CalendarIcon, EyeIcon, PhoneIcon, MailIcon, AlertCircleIcon, TrendingUpIcon, Clock, CheckCircle } from 'lucide-react';
import { getAmbassadorSchools } from '../../../api/ambassador';
import { useAuth } from '../../../contexts/AuthContext';
import { LoadingSpinner } from '../../LoadingSpinner';

const getDefaultNextAction = (status: 'prospect' | 'contacted' | 'visited' | 'partnered' | 'inactive'): string => {
  switch (status) {
    case 'prospect':
      return 'Initial contact';
    case 'contacted':
      return 'Schedule visit';
    case 'visited':
      return 'Follow-up';
    case 'partnered':
      return 'Maintain relationship';
    case 'inactive':
      return 'Re-engage';
    default:
      return 'Review status';
  }
};

interface School {
  id: string;
  name: string;
  location: string;
  country_code: string;
  status: 'prospect' | 'contacted' | 'visited' | 'partnered' | 'inactive';
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  students_count?: number;
  last_visit?: string;
  visit_count: number;
  students_reached: number;
  leads_generated: number;
  partnership_score?: number;
  notes?: string;
  next_action?: string;
  created_at: string;
}

export const SchoolsPage = () => {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'prospect' | 'contacted' | 'visited' | 'partnered' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);
        const data = await getAmbassadorSchools(user.id);

        const transformedSchools: School[] = data.map((school: any) => ({
          id: String(school.id),
          name: school.name,
          location: school.location,
          country_code: school.country_code,
          status: school.status,
          contact_person: school.contact_person,
          contact_email: school.contact_email,
          contact_phone: school.contact_phone,
          students_count: school.students_count,
          last_visit: school.last_visit,
          visit_count: school.visit_count || 0,
          students_reached: school.students_reached || 0,
          leads_generated: school.leads_generated ?? 0,
          partnership_score: school.partnership_score,
          notes: school.notes || '',
          next_action: school.next_action || getDefaultNextAction(school.status),
          created_at: school.created_at
        }));

        setSchools(transformedSchools);
        setFilteredSchools(transformedSchools);
      } catch (error) {
        console.error('Error fetching schools:', error);
        setError('Failed to load schools data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, [user?.id]);

  useEffect(() => {
    let filtered = [...schools];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(school => school.status === filterStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(query) ||
        school.location.toLowerCase().includes(query) ||
        (school.contact_person && school.contact_person.toLowerCase().includes(query))
      );
    }

    setFilteredSchools(filtered);
  }, [schools, filterStatus, searchQuery]);

  const getStatusColor = (status: School['status']) => {
    switch (status) {
      case 'prospect':
        return 'bg-gray-100 text-gray-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'visited':
        return 'bg-yellow-100 text-yellow-800';
      case 'partnered':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: School['status']) => {
    switch (status) {
      case 'prospect':
        return <Clock size={16} className="text-gray-500" />;
      case 'contacted':
        return <MailIcon size={16} className="text-blue-500" />;
      case 'visited':
        return <CalendarIcon size={16} className="text-yellow-500" />;
      case 'partnered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'inactive':
        return <AlertCircleIcon size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const calculateDaysSinceLastVisit = (lastVisit?: string): number | null => {
    if (!lastVisit) return null;
    const visitDate = new Date(lastVisit);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - visitDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleScheduleVisit = (school: School) => {
    setSelectedSchool(school);
    setIsVisitModalOpen(true);
  };

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

  // Calculate stats
  const stats = {
    total: schools.length,
    partnered: schools.filter(s => s.status === 'partnered').length,
    visited: schools.filter(s => s.status === 'visited').length,
    contacted: schools.filter(s => s.status === 'contacted').length,
    totalStudentsReached: schools.reduce((sum, s) => sum + s.students_reached, 0),
    totalLeads: schools.reduce((sum, s) => sum + s.leads_generated, 0),
    avgPartnershipScore: schools.length > 0 
      ? Math.round(schools.reduce((sum, s) => sum + (s.partnership_score || 0), 0) / schools.length)
      : 0
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Schools</h1>
        <p className="text-sm text-gray-500">
          Manage your assigned schools and track partnership progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <SchoolIcon size={20} className="text-ash-teal" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Schools</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <CheckCircle size={20} className="text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Partnerships</p>
              <p className="text-2xl font-bold text-gray-900">{stats.partnered}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <UsersIcon size={20} className="text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Students Reached</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudentsReached}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <TrendingUpIcon size={20} className="text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Leads Generated</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterStatus === 'all' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterStatus('all')}
          >
            All Schools ({stats.total})
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterStatus === 'partnered' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterStatus('partnered')}
          >
            Partnered ({stats.partnered})
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterStatus === 'visited' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterStatus('visited')}
          >
            Visited ({stats.visited})
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterStatus === 'contacted' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterStatus('contacted')}
          >
            Contacted ({stats.contacted})
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search schools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ash-teal"
          />
        </div>
      </div>

      {/* Schools Grid */}
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchools.map((school) => {
            const daysSinceLastVisit = calculateDaysSinceLastVisit(school.last_visit);
            const needsAttention = daysSinceLastVisit !== null && daysSinceLastVisit > 30;

            return (
              <div key={school.id} className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow ${
                needsAttention ? 'border-orange-200 bg-orange-50' : ''
              }`}>
                {/* School Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{school.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPinIcon size={14} className="mr-1" />
                      {school.location} ({school.country_code.toUpperCase()})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(school.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(school.status)}`}>
                      {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                {school.contact_person && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">{school.contact_person}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                      {school.contact_email && (
                        <span className="flex items-center gap-1">
                          <MailIcon size={12} /> {school.contact_email}
                        </span>
                      )}
                      {school.contact_phone && (
                        <span className="flex items-center gap-1">
                          <PhoneIcon size={12} /> {school.contact_phone}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-ash-teal">{school.visit_count}</div>
                    <div className="text-xs text-gray-500">Visits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-700">{school.students_reached}</div>
                    <div className="text-xs text-gray-500">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-700">{school.leads_generated}</div>
                    <div className="text-xs text-gray-500">Leads</div>
                  </div>
                </div>

                {/* Last Visit */}
                <div className="mb-4 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>
                      Last Visit:{' '}
                      {school.last_visit
                        ? new Date(school.last_visit).toLocaleDateString()
                        : 'Never'}
                    </span>
                    {daysSinceLastVisit !== null && (
                      <span>
                        {daysSinceLastVisit} day{daysSinceLastVisit !== 1 ? 's' : ''} ago
                      </span>
                    )}
                  </div>
                  {needsAttention && (
                    <div className="mt-1 text-xs text-orange-600 font-semibold">
                      Needs attention: No visit in over 30 days
                    </div>
                  )}
                </div>

                {/* Next Action */}
                <div className="mb-4 p-2 bg-blue-50 rounded text-sm">
                  <div className="font-medium text-blue-900">Next Action:</div>
                  <div className="text-blue-700">{school.next_action}</div>
                </div>

                {/* Notes */}
                {school.notes && (
                  <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <div className="font-medium text-gray-900 mb-1">Notes:</div>
                    <div className="line-clamp-2">{school.notes}</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleScheduleVisit(school)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-ash-teal text-white rounded-lg hover:bg-ash-teal/90 text-sm"
                  >
                    <CalendarIcon size={14} />
                    Visit
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <EyeIcon size={14} />
                  </button>
                  {school.contact_phone && (
                    <a
                      href={`tel:${school.contact_phone}`}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                      title="Call contact"
                    >
                      <PhoneIcon size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <SchoolIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {schools.length === 0 ? 'No schools assigned' : 'No schools match your filters'}
          </h3>
          <p className="text-gray-500">
            {schools.length === 0 
              ? 'Schools will be assigned to you by your country lead.'
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
        </div>
      )}

      {/* Visit Modal */}
      {isVisitModalOpen && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Schedule Visit - {selectedSchool.name}</h2>
            <p className="text-gray-600 mb-4">Visit scheduling functionality would go here.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsVisitModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsVisitModalOpen(false);
                  // Implement visit scheduling logic
                }}
                className="px-4 py-2 bg-ash-teal text-white rounded-lg hover:bg-ash-teal/90"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
