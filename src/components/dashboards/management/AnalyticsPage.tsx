import React, { useEffect, useState } from 'react';
import { LineChart } from '../../ui/widgets/LineChart';
import { BarChart } from '../../ui/widgets/BarChart';
import { PieChart } from '../../ui/widgets/PieChart';
import { DataTable } from '../../ui/widgets/DataTable';
import { TrendingUpIcon, UsersIcon, SchoolIcon, CalendarIcon, DownloadIcon, FilterIcon, ChevronDownIcon, MapPinIcon, GlobeIcon, ArrowUpRightIcon, ArrowDownRightIcon } from 'lucide-react';
export const AnalyticsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('quarter');
  const [selectedCountry, setSelectedCountry] = useState('all');
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would use the API client
        // const data = await getAnalyticsData()
        // For now, use mock data
        const mockData = {
          kpis: {
            totalGrowth: 32,
            growthChange: 8,
            newStudents: 458,
            studentChange: 12,
            newSchools: 17,
            schoolChange: 5,
            eventsHosted: 28,
            eventsChange: -3
          },
          monthlyGrowth: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            studentsReached: [450, 520, 500, 700, 800, 950, 1000, 1200, 1350, 1500, 1700, 1850],
            schoolPartnerships: [12, 15, 18, 20, 22, 25, 28, 30, 35, 38, 42, 45]
          },
          countryComparison: {
            labels: ['Nigeria', 'Kenya', 'Ghana', 'South Africa'],
            studentsReached: [800, 450, 320, 280],
            schoolPartnerships: [20, 12, 8, 5]
          },
          schoolsByStatus: {
            labels: ['Partnered', 'Prospects', 'Visited', 'Inactive'],
            data: [45, 63, 28, 12]
          },
          ambassadorPerformance: {
            labels: ['Excellent', 'Good', 'Average', 'Needs Improvement'],
            data: [18, 24, 8, 2]
          },
          recentEvents: [{
            id: 1,
            name: 'Lagos Career Fair',
            country: 'Nigeria',
            date: '2025-03-15',
            students: 250,
            conversion: 75,
            roi: 4.2
          }, {
            id: 2,
            name: 'Nairobi Tech Summit',
            country: 'Kenya',
            date: '2025-02-28',
            students: 180,
            conversion: 62,
            roi: 3.1
          }, {
            id: 3,
            name: 'Accra Education Expo',
            country: 'Ghana',
            date: '2025-04-10',
            students: 120,
            conversion: 45,
            roi: 2.3
          }, {
            id: 4,
            name: 'Cape Town Workshop',
            country: 'South Africa',
            date: '2025-03-22',
            students: 90,
            conversion: 38,
            roi: 1.8
          }, {
            id: 5,
            name: 'Abuja School Tour',
            country: 'Nigeria',
            date: '2025-05-05',
            students: 200,
            conversion: 68,
            roi: 3.5
          }]
        };
        setAnalyticsData(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setIsLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);
  // Format chart data based on analytics data
  const getMonthlyGrowthData = () => {
    if (!analyticsData) return null;
    return {
      labels: analyticsData.monthlyGrowth.labels,
      datasets: [{
        label: 'Students Reached',
        data: analyticsData.monthlyGrowth.studentsReached,
        borderColor: '#1A5F7A',
        backgroundColor: 'rgba(26, 95, 122, 0.1)'
      }, {
        label: 'School Partnerships',
        data: analyticsData.monthlyGrowth.schoolPartnerships,
        borderColor: '#F4C430',
        backgroundColor: 'rgba(244, 196, 48, 0.1)'
      }]
    };
  };
  const getCountryComparisonData = () => {
    if (!analyticsData) return null;
    return {
      labels: analyticsData.countryComparison.labels,
      datasets: [{
        label: 'Students Reached',
        data: analyticsData.countryComparison.studentsReached,
        backgroundColor: 'rgba(26, 95, 122, 0.8)'
      }, {
        label: 'School Partnerships',
        data: analyticsData.countryComparison.schoolPartnerships,
        backgroundColor: 'rgba(244, 196, 48, 0.8)'
      }]
    };
  };
  const getSchoolsByStatusData = () => {
    if (!analyticsData) return null;
    return {
      labels: analyticsData.schoolsByStatus.labels,
      datasets: [{
        data: analyticsData.schoolsByStatus.data,
        backgroundColor: ['rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(38, 162, 105, 0.8)', 'rgba(225, 112, 85, 0.8)']
      }]
    };
  };
  const getAmbassadorPerformanceData = () => {
    if (!analyticsData) return null;
    return {
      labels: analyticsData.ambassadorPerformance.labels,
      datasets: [{
        data: analyticsData.ambassadorPerformance.data,
        backgroundColor: ['rgba(38, 162, 105, 0.8)', 'rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(225, 112, 85, 0.8)']
      }]
    };
  };
  // Table columns for events
  const eventsColumns = [{
    header: 'Event Name',
    accessor: 'name'
  }, {
    header: 'Country',
    accessor: 'country'
  }, {
    header: 'Date',
    accessor: 'date'
  }, {
    header: 'Students',
    accessor: 'students',
    sortable: true
  }, {
    header: 'Conversion',
    accessor: (row: any) => <div className="flex items-center">
          <div className="mr-2 h-2 w-full max-w-[100px] rounded-full bg-gray-200">
            <div className={`h-2 rounded-full ${row.conversion >= 70 ? 'bg-green-500' : row.conversion >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
          width: `${row.conversion}%`
        }}></div>
          </div>
          <span>{row.conversion}%</span>
        </div>,
    sortable: true
  }, {
    header: 'ROI',
    accessor: (row: any) => <span className={`${row.roi >= 3 ? 'text-green-600' : row.roi >= 1.5 ? 'text-yellow-600' : 'text-red-600'}`}>
          {row.roi}x
        </span>,
    sortable: true
  }];
  return <div>
      <div className="mb-6 flex flex-col justify-between sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            In-depth metrics and performance indicators for all operations
          </p>
        </div>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700" value={timeRange} onChange={e => setTimeRange(e.target.value)}>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700" value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
              <option value="all">All Countries</option>
              <option value="ng">Nigeria</option>
              <option value="ke">Kenya</option>
              <option value="gh">Ghana</option>
              <option value="za">South Africa</option>
            </select>
          </div>
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <DownloadIcon size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
        </div>}

      {/* Dashboard Content */}
      {!isLoading && analyticsData && <>
          {/* KPI Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ash-teal/10 text-ash-teal">
                  <TrendingUpIcon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Growth
                  </p>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {analyticsData.kpis.totalGrowth}%
                    </h3>
                    <span className={`ml-2 flex items-center text-sm ${analyticsData.kpis.growthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analyticsData.kpis.growthChange >= 0 ? <>
                          <ArrowUpRightIcon size={14} className="mr-0.5" />+
                          {analyticsData.kpis.growthChange}%
                        </> : <>
                          <ArrowDownRightIcon size={14} className="mr-0.5" />
                          {analyticsData.kpis.growthChange}%
                        </>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ash-gold/10 text-ash-gold">
                  <UsersIcon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    New Students
                  </p>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {analyticsData.kpis.newStudents}
                    </h3>
                    <span className={`ml-2 flex items-center text-sm ${analyticsData.kpis.studentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analyticsData.kpis.studentChange >= 0 ? <>
                          <ArrowUpRightIcon size={14} className="mr-0.5" />+
                          {analyticsData.kpis.studentChange}%
                        </> : <>
                          <ArrowDownRightIcon size={14} className="mr-0.5" />
                          {analyticsData.kpis.studentChange}%
                        </>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <SchoolIcon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    New Schools
                  </p>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {analyticsData.kpis.newSchools}
                    </h3>
                    <span className={`ml-2 flex items-center text-sm ${analyticsData.kpis.schoolChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analyticsData.kpis.schoolChange >= 0 ? <>
                          <ArrowUpRightIcon size={14} className="mr-0.5" />+
                          {analyticsData.kpis.schoolChange}%
                        </> : <>
                          <ArrowDownRightIcon size={14} className="mr-0.5" />
                          {analyticsData.kpis.schoolChange}%
                        </>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Events Hosted
                  </p>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {analyticsData.kpis.eventsHosted}
                    </h3>
                    <span className={`ml-2 flex items-center text-sm ${analyticsData.kpis.eventsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {analyticsData.kpis.eventsChange >= 0 ? <>
                          <ArrowUpRightIcon size={14} className="mr-0.5" />+
                          {analyticsData.kpis.eventsChange}%
                        </> : <>
                          <ArrowDownRightIcon size={14} className="mr-0.5" />
                          {analyticsData.kpis.eventsChange}%
                        </>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LineChart title="Monthly Growth Trends" data={getMonthlyGrowthData()} />
            <BarChart title="Country Comparison" data={getCountryComparisonData()} />
          </div>

          {/* Pie Charts Row */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PieChart title="Schools by Status" data={getSchoolsByStatusData()} />
            <PieChart title="Ambassador Performance" data={getAmbassadorPerformanceData()} />
          </div>

          {/* Events Table */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Events Performance
              </h2>
              <div className="flex space-x-2">
                <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <FilterIcon size={16} className="mr-1" />
                  Filter
                </button>
                <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <DownloadIcon size={16} className="mr-1" />
                  Export
                </button>
              </div>
            </div>
            <DataTable columns={eventsColumns} data={analyticsData.recentEvents} keyField="id" rowsPerPage={5} showSearch={true} />
          </div>

          {/* Geographic Insights */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Geographic Insights
              </h2>
              <button className="text-sm font-medium text-ash-teal hover:text-ash-teal/80">
                View All Countries
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-ash-teal/10 text-ash-teal">
                    <MapPinIcon size={14} />
                  </div>
                  <h3 className="font-medium">Nigeria</h3>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Students:</span>
                    <span className="font-medium">800</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Schools:</span>
                    <span className="font-medium">20</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Growth:</span>
                    <span className="flex items-center font-medium text-green-600">
                      <ArrowUpRightIcon size={14} className="mr-0.5" />
                      15%
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-ash-teal/10 text-ash-teal">
                    <MapPinIcon size={14} />
                  </div>
                  <h3 className="font-medium">Kenya</h3>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Students:</span>
                    <span className="font-medium">450</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Schools:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Growth:</span>
                    <span className="flex items-center font-medium text-green-600">
                      <ArrowUpRightIcon size={14} className="mr-0.5" />
                      8%
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-ash-teal/10 text-ash-teal">
                    <MapPinIcon size={14} />
                  </div>
                  <h3 className="font-medium">Ghana</h3>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Students:</span>
                    <span className="font-medium">320</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Schools:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Growth:</span>
                    <span className="flex items-center font-medium text-green-600">
                      <ArrowUpRightIcon size={14} className="mr-0.5" />
                      12%
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-ash-teal/10 text-ash-teal">
                    <MapPinIcon size={14} />
                  </div>
                  <h3 className="font-medium">South Africa</h3>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Students:</span>
                    <span className="font-medium">280</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Schools:</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Growth:</span>
                    <span className="flex items-center font-medium text-red-600">
                      <ArrowDownRightIcon size={14} className="mr-0.5" />
                      2%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <button className="flex items-center rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
                <GlobeIcon size={16} className="mr-2" />
                Expand to New Countries
              </button>
            </div>
          </div>
        </>}
    </div>;
};