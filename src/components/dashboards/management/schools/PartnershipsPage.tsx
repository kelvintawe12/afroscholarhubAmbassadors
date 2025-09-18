import React, { useEffect, useState } from 'react';
import { SchoolIcon, PlusIcon, FilterIcon, MapPinIcon, UsersIcon, PhoneIcon, MailIcon, EditIcon, TrashIcon, DownloadIcon, ClipboardIcon, ChevronDownIcon, SearchIcon } from 'lucide-react';
import { getSchoolsByStatus } from '../../../../api/management';
export const SchoolPartnershipsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState<any[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would use the API client
        // const data = await getSchoolsByStatus('partnered')
        // For now, use mock data
        const mockData = [{
          id: '1',
          name: 'Lagos Model School',
          location: 'Lagos',
          address: '123 Main Street, Lagos',
          country_code: 'ng',
          region: 'Southwest',
          contact_person: 'Adebayo Johnson',
          contact_email: 'adebayo@lagosmodel.edu',
          contact_phone: '+234 123 456 7890',
          student_count: 1250,
          status: 'partnered',
          created_at: '2023-05-15',
          ambassador: {
            id: '101',
            full_name: 'Aisha Mohammed',
            email: 'aisha@afroscholarhub.org'
          },
          partnership_date: '2023-06-01',
          partnership_strength: 'strong',
          last_visit: '2024-03-15',
          upcoming_activities: ['Career Fair', 'Scholarship Workshop']
        }, {
          id: '2',
          name: 'Accra International Academy',
          location: 'Accra',
          address: '456 Independence Ave, Accra',
          country_code: 'gh',
          region: 'Greater Accra',
          contact_person: 'Kwame Mensah',
          contact_email: 'kmensah@aia.edu.gh',
          contact_phone: '+233 987 654 3210',
          student_count: 980,
          status: 'partnered',
          created_at: '2023-07-22',
          ambassador: {
            id: '102',
            full_name: 'Daniel Osei',
            email: 'daniel@afroscholarhub.org'
          },
          partnership_date: '2023-08-15',
          partnership_strength: 'medium',
          last_visit: '2024-02-28',
          upcoming_activities: ['STEM Workshop']
        }, {
          id: '3',
          name: 'Nairobi Secondary School',
          location: 'Nairobi',
          address: '789 Uhuru Highway, Nairobi',
          country_code: 'ke',
          region: 'Nairobi County',
          contact_person: 'Grace Wanjiku',
          contact_email: 'grace@nairobisec.ac.ke',
          contact_phone: '+254 712 345 678',
          student_count: 1100,
          status: 'partnered',
          created_at: '2023-09-10',
          ambassador: {
            id: '103',
            full_name: 'James Mwangi',
            email: 'james@afroscholarhub.org'
          },
          partnership_date: '2023-10-01',
          partnership_strength: 'strong',
          last_visit: '2024-04-02',
          upcoming_activities: ['University Applications Workshop', 'Alumni Talk']
        }, {
          id: '4',
          name: 'Cape Town High School',
          location: 'Cape Town',
          address: '101 Long Street, Cape Town',
          country_code: 'za',
          region: 'Western Cape',
          contact_person: 'Sarah van der Merwe',
          contact_email: 'sarah@capetownhigh.co.za',
          contact_phone: '+27 21 987 6543',
          student_count: 850,
          status: 'partnered',
          created_at: '2023-11-05',
          ambassador: {
            id: '104',
            full_name: 'Thabo Ndlovu',
            email: 'thabo@afroscholarhub.org'
          },
          partnership_date: '2023-12-01',
          partnership_strength: 'new',
          last_visit: '2024-03-20',
          upcoming_activities: ['Scholarship Info Session']
        }, {
          id: '5',
          name: 'Abuja Grammar School',
          location: 'Abuja',
          address: '202 Independence Ave, Abuja',
          country_code: 'ng',
          region: 'Federal Capital Territory',
          contact_person: 'Ibrahim Suleiman',
          contact_email: 'ibrahim@abujagrammer.edu.ng',
          contact_phone: '+234 801 234 5678',
          student_count: 920,
          status: 'partnered',
          created_at: '2024-01-15',
          ambassador: {
            id: '105',
            full_name: 'Ngozi Okafor',
            email: 'ngozi@afroscholarhub.org'
          },
          partnership_date: '2024-02-01',
          partnership_strength: 'medium',
          last_visit: '2024-04-10',
          upcoming_activities: ['Career Day', 'Parent Information Session']
        }, {
          id: '6',
          name: 'Kumasi Academy',
          location: 'Kumasi',
          address: '303 Asante Road, Kumasi',
          country_code: 'gh',
          region: 'Ashanti',
          contact_person: 'Akosua Boateng',
          contact_email: 'aboateng@kumasiacademy.edu.gh',
          contact_phone: '+233 24 567 8901',
          student_count: 760,
          status: 'partnered',
          created_at: '2024-02-20',
          ambassador: {
            id: '102',
            full_name: 'Daniel Osei',
            email: 'daniel@afroscholarhub.org'
          },
          partnership_date: '2024-03-15',
          partnership_strength: 'new',
          last_visit: '2024-04-05',
          upcoming_activities: ['Mentorship Program Launch']
        }];
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
    // Filter schools based on search query and filters
    let filtered = [...schools];
    if (searchQuery) {
      filtered = filtered.filter(school => school.name.toLowerCase().includes(searchQuery.toLowerCase()) || school.location.toLowerCase().includes(searchQuery.toLowerCase()) || school.contact_person.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(school => school.country_code === selectedCountry);
    }
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(school => school.region === selectedRegion);
    }
    setFilteredSchools(filtered);
  }, [searchQuery, selectedCountry, selectedRegion, schools]);
  // Get unique countries and regions for filters
  const countries = [{
    code: 'ng',
    name: 'Nigeria'
  }, {
    code: 'gh',
    name: 'Ghana'
  }, {
    code: 'ke',
    name: 'Kenya'
  }, {
    code: 'za',
    name: 'South Africa'
  }];
  const regions = Array.from(new Set(schools.map(school => school.region)));
  // Helper function to get country name from code
  const getCountryName = (code: string) => {
    const country = countries.find(c => c.code === code);
    return country ? country.name : code;
  };
  // Helper function to get partnership strength badge color
  const getStrengthBadge = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'new':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          School Partnerships
        </h1>
        <p className="text-sm text-gray-500">
          Manage and monitor established school partnerships across Africa
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ash-teal/10 text-ash-teal">
              <SchoolIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Partnerships
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {schools.length}
              </h3>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ash-gold/10 text-ash-gold">
              <MapPinIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Countries</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {new Set(schools.map(s => s.country_code)).size}
              </h3>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <UsersIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Students Reached
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {schools.reduce((sum, school) => sum + school.student_count, 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <ClipboardIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Planned Activities
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {schools.reduce((sum, school) => sum + (school.upcoming_activities?.length || 0), 0)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex w-full flex-1 flex-wrap items-center space-x-2 sm:w-auto">
          <div className="relative">
            <button className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FilterIcon size={16} className="mr-2" />
              Filter
              <ChevronDownIcon size={16} className="ml-2" />
            </button>
          </div>
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50" value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
              <option value="all">All Countries</option>
              {countries.map(country => <option key={country.code} value={country.code}>
                  {country.name}
                </option>)}
            </select>
          </div>
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}>
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
            <input type="search" placeholder="Search schools..." className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex rounded-md border border-gray-300 bg-white">
            <button className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => setViewMode('grid')} aria-label="Grid view">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`} onClick={() => setViewMode('list')} aria-label="List view">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 4.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1.5 8H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M1.5 11.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <button className="flex items-center rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90">
            <PlusIcon size={16} className="mr-2" />
            Add School
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
        </div>}

      {/* No Results */}
      {!isLoading && filteredSchools.length === 0 && <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <SchoolIcon size={48} className="mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No partnerships found
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery || selectedCountry !== 'all' || selectedRegion !== 'all' ? 'Try adjusting your search or filters' : 'Add your first school partnership to get started'}
          </p>
          {(searchQuery || selectedCountry !== 'all' || selectedRegion !== 'all') && <button className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {
        setSearchQuery('');
        setSelectedCountry('all');
        setSelectedRegion('all');
      }}>
              Clear filters
            </button>}
        </div>}

      {/* Grid View */}
      {!isLoading && filteredSchools.length > 0 && viewMode === 'grid' && <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSchools.map(school => <div key={school.id} className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              <div className="border-b border-gray-200 bg-gradient-to-r from-ash-teal/10 to-ash-teal/5 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{school.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPinIcon size={14} className="mr-1" />
                      <span>
                        {school.location}, {getCountryName(school.country_code)}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStrengthBadge(school.partnership_strength)}`}>
                    {school.partnership_strength.charAt(0).toUpperCase() + school.partnership_strength.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <div className="mb-2 text-xs font-medium uppercase text-gray-500">
                    Contact Person
                  </div>
                  <div className="text-sm font-medium">
                    {school.contact_person}
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <a href={`mailto:${school.contact_email}`} className="flex items-center hover:text-ash-teal">
                      <MailIcon size={14} className="mr-1" />
                      <span>Email</span>
                    </a>
                    <a href={`tel:${school.contact_phone}`} className="flex items-center hover:text-ash-teal">
                      <PhoneIcon size={14} className="mr-1" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="mb-2 text-xs font-medium uppercase text-gray-500">
                    Ambassador
                  </div>
                  <div className="text-sm font-medium">
                    {school.ambassador.full_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {school.ambassador.email}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="mb-2 text-xs font-medium uppercase text-gray-500">
                    Partnership Details
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Since:</span>
                    <span className="font-medium">
                      {new Date(school.partnership_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last Visit:</span>
                    <span className="font-medium">
                      {new Date(school.last_visit).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Students:</span>
                    <span className="font-medium">
                      {school.student_count.toLocaleString()}
                    </span>
                  </div>
                </div>
                {school.upcoming_activities && school.upcoming_activities.length > 0 && <div>
                      <div className="mb-2 text-xs font-medium uppercase text-gray-500">
                        Upcoming Activities
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {school.upcoming_activities.map((activity: string, index: number) => <span key={index} className="rounded-full bg-ash-teal/10 px-2 py-1 text-xs font-medium text-ash-teal">
                              {activity}
                            </span>)}
                      </div>
                    </div>}
              </div>
              <div className="flex border-t border-gray-200 bg-gray-50">
                <button className="flex flex-1 items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <EditIcon size={16} className="mr-1" />
                  Edit
                </button>
                <div className="border-l border-gray-200"></div>
                <button className="flex flex-1 items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <DownloadIcon size={16} className="mr-1" />
                  Report
                </button>
              </div>
            </div>)}
        </div>}

      {/* List View */}
      {!isLoading && filteredSchools.length > 0 && viewMode === 'list' && <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  School
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ambassador
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Students
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredSchools.map(school => <tr key={school.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {school.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Since{' '}
                      {new Date(school.partnership_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {school.location}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getCountryName(school.country_code)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {school.contact_person}
                    </div>
                    <div className="text-sm text-gray-500">
                      {school.contact_email}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {school.ambassador.full_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Last visit:{' '}
                      {new Date(school.last_visit).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStrengthBadge(school.partnership_strength)}`}>
                      {school.partnership_strength.charAt(0).toUpperCase() + school.partnership_strength.slice(1)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {school.student_count.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="mr-3 text-ash-teal hover:text-ash-teal/80">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}

      {/* Pagination */}
      {!isLoading && filteredSchools.length > 0 && <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
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
                <span className="font-medium">{filteredSchools.length}</span> of{' '}
                <span className="font-medium">{filteredSchools.length}</span>{' '}
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
    </div>;
};