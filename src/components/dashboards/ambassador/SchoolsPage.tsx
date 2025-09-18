import React, { useEffect, useState } from 'react';
import { SchoolIcon, MapPinIcon, UsersIcon, CalendarIcon, PlusIcon, SearchIcon, FilterIcon, EyeIcon, EditIcon, MessageSquareIcon } from 'lucide-react';
import { DataTable } from '../../ui/widgets/DataTable';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { getAmbassadorSchools } from '../../../api/ambassador';

export const AmbassadorSchoolsPage = () => {
  const [schools, setSchools] = useState<any[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would use the API client
        // const data = await getAmbassadorSchools('current-user-id')
        // For now, use mock data
        const mockData = [
          {
            id: 1,
            name: 'Lagos Model School',
            location: 'Lagos, Nigeria',
            status: 'Partnered',
            leads: 45,
            lastVisit: '2024-04-15T10:00:00Z',
            principal: 'Mrs. Adebayo',
            students: 1200,
            contact: '+234 801 234 5678',
            email: 'info@lagosmodel.edu.ng',
            notes: 'Strong interest in STEM programs'
          },
          {
            id: 2,
            name: 'ABC Academy',
            location: 'Abuja, Nigeria',
            status: 'Visited',
            leads: 30,
            lastVisit: '2024-04-10T14:30:00Z',
            principal: 'Mr. Okon',
            students: 800,
            contact: '+234 802 345 6789',
            email: 'contact@abcacademy.edu.ng',
            notes: 'Needs follow-up on scholarship applications'
          },
          {
            id: 3,
            name: 'XYZ High School',
            location: 'Lagos, Nigeria',
            status: 'Prospect',
            leads: 0,
            lastVisit: null,
            principal: 'Ms. Johnson',
            students: 950,
            contact: '+234 803 456 7890',
            email: 'admin@xyzhigh.edu.ng',
            notes: 'Initial outreach completed'
          },
          {
            id: 4,
            name: 'Unity College',
            location: 'Ibadan, Nigeria',
            status: 'Partnered',
            leads: 75,
            lastVisit: '2024-03-28T09:15:00Z',
            principal: 'Dr. Adeyemi',
            students: 1500,
            contact: '+234 804 567 8901',
            email: 'principal@unitycollege.edu.ng',
            notes: 'Active partnership with multiple programs'
          },
          {
            id: 5,
            name: 'Heritage Academy',
            location: 'Kano, Nigeria',
            status: 'Visited',
            leads: 20,
            lastVisit: '2024-04-05T11:45:00Z',
            principal: 'Mr. Ibrahim',
            students: 600,
            contact: '+234 805 678 9012',
            email: 'info@heritageacademy.edu.ng',
            notes: 'Interested in career guidance workshops'
          }
        ];
        setSchools(mockData);
        setFilteredSchools(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching schools:', error);
        setIsLoading(false);
      }
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    let filtered = [...schools];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(school => school.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.principal.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSchools(filtered);
  }, [schools, statusFilter, searchQuery]);

  // Calculate metrics
  const totalSchools = schools.length;
  const partneredSchools = schools.filter(school => school.status === 'Partnered').length;
  const totalLeads = schools.reduce((sum, school) => sum + school.leads, 0);
  const visitedSchools = schools.filter(school => school.lastVisit).length;

  const schoolColumns = [
    {
      header: 'School Name',
      accessor: 'name'
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
      header: 'Status',
      accessor: (row: any) => (
        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
          row.status === 'Partnered' ? 'bg-green-100 text-green-800' :
          row.status === 'Visited' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Leads',
      accessor: (row: any) => (
        <div className="flex items-center">
          <UsersIcon size={14} className="mr-1 text-gray-400" />
          {row.leads}
        </div>
      ),
      sortable: true
    },
    {
      header: 'Last Visit',
      accessor: (row: any) => {
        if (!row.lastVisit) return 'Never';
        const date = new Date(row.lastVisit);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
      }
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex space-x-2">
          <button className="rounded-md bg-ash-teal p-1 text-white hover:bg-ash-teal/90" title="View Details">
            <EyeIcon size={14} />
          </button>
          <button className="rounded-md bg-blue-500 p-1 text-white hover:bg-blue-600" title="Edit">
            <EditIcon size={14} />
          </button>
          <button className="rounded-md bg-green-500 p-1 text-white hover:bg-green-600" title="Log Visit">
            <PlusIcon size={14} />
          </button>
          <button className="rounded-md bg-gray-500 p-1 text-white hover:bg-gray-600" title="Contact">
            <MessageSquareIcon size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Schools</h1>
        <p className="text-sm text-gray-500">
          Manage your assigned schools and track partnership progress
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Schools"
          value={totalSchools.toString()}
          icon={<SchoolIcon size={20} />}
          color="bg-ash-teal"
        />
        <KpiCard
          title="Partnered"
          value={partneredSchools.toString()}
          icon={<UsersIcon size={20} />}
          color="bg-green-400"
        />
        <KpiCard
          title="Total Leads"
          value={totalLeads.toString()}
          icon={<UsersIcon size={20} />}
          color="bg-blue-400"
        />
        <KpiCard
          title="Visited"
          value={visitedSchools.toString()}
          icon={<CalendarIcon size={20} />}
          color="bg-yellow-400"
        />
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              statusFilter === 'all' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setStatusFilter('all')}
          >
            All Schools
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              statusFilter === 'partnered' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setStatusFilter('partnered')}
          >
            Partnered
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              statusFilter === 'visited' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setStatusFilter('visited')}
          >
            Visited
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              statusFilter === 'prospect' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setStatusFilter('prospect')}
          >
            Prospects
          </button>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search schools..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center rounded-md bg-ash-teal px-3 py-2 text-sm font-medium text-white hover:bg-ash-teal/90">
            <PlusIcon size={16} className="mr-1" />
            Add School
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
      {!isLoading && filteredSchools.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <SchoolIcon size={48} className="mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No schools found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'No schools assigned yet'}
          </p>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Schools Table */}
      {!isLoading && filteredSchools.length > 0 && (
        <DataTable
          columns={schoolColumns}
          data={filteredSchools}
          keyField="id"
          rowsPerPage={10}
        />
      )}

      {/* Quick Actions */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-base font-medium text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <CalendarIcon size={16} className="mr-2" />
            Schedule Visit
          </button>
          <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <MessageSquareIcon size={16} className="mr-2" />
            Bulk Contact
          </button>
          <button className="flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
            <UsersIcon size={16} className="mr-2" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};
