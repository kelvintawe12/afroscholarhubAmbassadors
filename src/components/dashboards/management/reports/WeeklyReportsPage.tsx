import React, { useEffect, useState } from 'react';
import { CalendarIcon, DownloadIcon, FilterIcon, BarChart3Icon, TrendingUpIcon, UsersIcon, SchoolIcon, CheckCircleIcon, ArrowUpIcon, ArrowDownIcon, ChevronDownIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { LineChart } from '../../../ui/widgets/LineChart';
import { BarChart } from '../../../ui/widgets/BarChart';
import { DataTable } from '../../../ui/widgets/DataTable';
import { generateWeeklyReport } from '../../../../api/reports';
import toast from 'react-hot-toast';
export const WeeklyReportsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const [reportData, setReportData] = useState<any>(null);
  useEffect(() => {
    const fetchWeeklyData = async () => {
      setIsLoading(true);
      try {
        // Calculate week start (Monday of current week for 'current')
        const now = new Date();
        const dayOfWeek = now.getDay();
        const monday = new Date(now);
        monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const weekStart = monday.toISOString().split('T')[0];

        const countryCode = selectedCountry === 'all' ? undefined : selectedCountry.toLowerCase().slice(0,2); // Simple mapping, e.g., 'Nigeria' -> 'ng'

        const metrics = await generateWeeklyReport(weekStart, countryCode);

        // Transform metrics to match component structure
        const reportData = {
          weekNumber: getWeekNumber(now),
          dateRange: `${weekStart} - ${new Date(weekStart).setDate(monday.getDate() + 6)}`, // Approximate
          overview: {
            newSchoolContacts: metrics.partnerships || 0,
            newSchoolContactsTrend: 0, // Would need previous week comparison
            schoolVisits: metrics.visits_count || 0,
            schoolVisitsTrend: 0,
            studentsReached: metrics.students_reached || 0,
            studentsReachedTrend: 0,
            leadsGenerated: metrics.tasks_completed || 0, // Approximate
            leadsGeneratedTrend: 0
          },
          ambassadorActivity: {
            activeAmbassadors: metrics.active_ambassadors || 0,
            activeAmbassadorsTrend: 0,
            taskCompletion: 85, // Would need calculation
            taskCompletionTrend: 0,
            totalTasks: 120, // Mock for now
            completedTasks: Math.round(120 * 0.85)
          },
          topPerformers: [],
          countryPerformance: [],
          schoolVisits: [],
          weeklyTrends: {
            schoolVisits: [],
            studentsReached: [],
            leadsGenerated: []
          }
        };

        setReportData(reportData);
      } catch (error) {
        console.error('Error fetching weekly data:', error);
        toast.error('Failed to load weekly report data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyData();
  }, [selectedWeek, selectedCountry]);

  // Helper function to get week number
  const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };
  // Weekly trends chart data
  const weeklyTrendsData = reportData?.weeklyTrends ? {
    labels: ['Week 18', 'Week 19', 'Week 20', 'Week 21', 'Week 22', 'Week 23', 'Week 24'],
    datasets: [{
      label: 'School Visits',
      data: reportData.weeklyTrends.schoolVisits,
      borderColor: '#1A5F7A',
      backgroundColor: 'rgba(26, 95, 122, 0.1)',
      fill: false
    }]
  } : null;
  // Students reached chart data
  const studentsReachedData = reportData?.weeklyTrends ? {
    labels: ['Week 18', 'Week 19', 'Week 20', 'Week 21', 'Week 22', 'Week 23', 'Week 24'],
    datasets: [{
      label: 'Students Reached',
      data: reportData.weeklyTrends.studentsReached,
      borderColor: '#26A269',
      backgroundColor: 'rgba(38, 162, 105, 0.1)',
      fill: true
    }]
  } : null;
  // Leads generated chart data
  const leadsGeneratedData = reportData?.weeklyTrends ? {
    labels: ['Week 18', 'Week 19', 'Week 20', 'Week 21', 'Week 22', 'Week 23', 'Week 24'],
    datasets: [{
      label: 'Leads Generated',
      data: reportData.weeklyTrends.leadsGenerated,
      borderColor: '#F4C430',
      backgroundColor: 'rgba(244, 196, 48, 0.1)',
      fill: true
    }]
  } : null;
  // Country performance chart data
  const countryPerformanceData = reportData?.countryPerformance ? {
    labels: reportData.countryPerformance.map((item: any) => item.country),
    datasets: [{
      label: 'Students Reached',
      data: reportData.countryPerformance.map((item: any) => item.studentsReached),
      backgroundColor: 'rgba(26, 95, 122, 0.8)'
    }]
  } : null;
  // Leads by country chart data
  const leadsByCountryData = reportData?.countryPerformance ? {
    labels: reportData.countryPerformance.map((item: any) => item.country),
    datasets: [{
      label: 'Leads Generated',
      data: reportData.countryPerformance.map((item: any) => item.leadsGenerated),
      backgroundColor: 'rgba(244, 196, 48, 0.8)'
    }]
  } : null;
  // School visits table columns
  const schoolVisitsColumns = [{
    header: 'School',
    accessor: (row: any) => <div>
          <div className="font-medium text-gray-900">{row.schoolName}</div>
          <div className="flex items-center text-xs text-gray-500">
            <MapPinIcon size={12} className="mr-1" />
            {row.location}
          </div>
        </div>
  }, {
    header: 'Ambassador',
    accessor: 'ambassador'
  }, {
    header: 'Visit Date',
    accessor: 'date'
  }, {
    header: 'Students Reached',
    accessor: 'studentsReached',
    sortable: true
  }, {
    header: 'Leads Generated',
    accessor: 'leadsGenerated',
    sortable: true
  }, {
    header: 'Notes',
    accessor: 'notes'
  }];
  // Top performers table columns
  const topPerformersColumns = [{
    header: 'Ambassador',
    accessor: 'name'
  }, {
    header: 'Country',
    accessor: 'country'
  }, {
    header: 'Schools Visited',
    accessor: 'schoolsVisited',
    sortable: true
  }, {
    header: 'Students Reached',
    accessor: 'studentsReached',
    sortable: true
  }, {
    header: 'Leads Generated',
    accessor: 'leadsGenerated',
    sortable: true
  }, {
    header: 'Performance Score',
    accessor: (row: any) => <div className="w-full max-w-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{row.performance}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
            <div className="h-1.5 rounded-full bg-green-500" style={{
          width: `${row.performance}%`
        }}></div>
          </div>
        </div>,
    sortable: true
  }];
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Weekly Reports</h1>
        <p className="text-sm text-gray-500">
          Comprehensive weekly performance metrics across all countries
        </p>
      </div>

      {/* Report controls */}
      <div className="mb-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <div className="relative">
            <div className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700">
              <CalendarIcon size={16} className="mr-2 text-gray-400" />
              <span>
                Week {reportData?.weekNumber}: {reportData?.dateRange}
              </span>
              <ChevronDownIcon size={16} className="ml-2 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <select className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50" value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
              <option value="all">All Countries</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="Ghana">Ghana</option>
              <option value="South Africa">South Africa</option>
            </select>
          </div>
        </div>
        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {}}>
            <FilterIcon size={16} className="mr-2" />
            Customize
          </button>
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {}}>
            <DownloadIcon size={16} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {isLoading ? <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
        </div> : <>
          {/* Weekly Overview Section */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4" onClick={() => toggleSection('overview')}>
              <h2 className="text-lg font-medium text-gray-900">
                Weekly Overview
              </h2>
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-ash-teal/10 px-2 py-1 text-xs font-medium text-ash-teal">
                  Week {reportData.weekNumber}
                </span>
                {expandedSection === 'overview' ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
              </div>
            </div>
            {expandedSection === 'overview' && <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <KpiCard title="New School Contacts" value={reportData.overview.newSchoolContacts.toString()} change={reportData.overview.newSchoolContactsTrend} icon={<SchoolIcon size={20} />} />
                  <KpiCard title="School Visits" value={reportData.overview.schoolVisits.toString()} change={reportData.overview.schoolVisitsTrend} icon={<MapPinIcon size={20} />} />
                  <KpiCard title="Students Reached" value={reportData.overview.studentsReached.toLocaleString()} change={reportData.overview.studentsReachedTrend} icon={<UsersIcon size={20} />} />
                  <KpiCard title="Leads Generated" value={reportData.overview.leadsGenerated.toString()} change={reportData.overview.leadsGeneratedTrend} icon={<TrendingUpIcon size={20} />} />
                </div>
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <LineChart title="Weekly Trends - School Visits" data={weeklyTrendsData} />
                  <LineChart title="Weekly Trends - Students Reached" data={studentsReachedData} />
                </div>
              </div>}
          </div>

          {/* Ambassador Activity Section */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4" onClick={() => toggleSection('ambassador')}>
              <h2 className="text-lg font-medium text-gray-900">
                Ambassador Activity
              </h2>
              {expandedSection === 'ambassador' ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
            </div>
            {expandedSection === 'ambassador' && <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <KpiCard title="Active Ambassadors" value={reportData.ambassadorActivity.activeAmbassadors.toString()} change={reportData.ambassadorActivity.activeAmbassadorsTrend} icon={<UsersIcon size={20} />} />
                  <KpiCard title="Task Completion Rate" value={`${reportData.ambassadorActivity.taskCompletion}%`} change={reportData.ambassadorActivity.taskCompletionTrend} icon={<CheckCircleIcon size={20} />} />
                  <div className="col-span-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-2 text-sm font-medium text-gray-700">
                      Task Completion
                    </h3>
                    <div className="flex items-end">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Completed vs Total
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {reportData.ambassadorActivity.completedTasks} /{' '}
                            {reportData.ambassadorActivity.totalTasks}
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-gray-200">
                          <div className="h-2.5 rounded-full bg-ash-teal" style={{
                      width: `${reportData.ambassadorActivity.completedTasks / reportData.ambassadorActivity.totalTasks * 100}%`
                    }}></div>
                        </div>
                      </div>
                      <div className="ml-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-4 border-ash-teal bg-white text-center">
                        <div>
                          <div className="text-lg font-bold text-ash-teal">
                            {reportData.ambassadorActivity.taskCompletion}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="mb-3 text-base font-medium text-gray-700">
                    Top Performers
                  </h3>
                  <DataTable columns={topPerformersColumns} data={reportData.topPerformers} keyField="id" rowsPerPage={5} showSearch={false} />
                </div>
              </div>}
          </div>

          {/* Country Performance Section */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4" onClick={() => toggleSection('country')}>
              <h2 className="text-lg font-medium text-gray-900">
                Country Performance
              </h2>
              {expandedSection === 'country' ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
            </div>
            {expandedSection === 'country' && <div className="p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <BarChart title="Students Reached by Country" data={countryPerformanceData} />
                  <BarChart title="Leads Generated by Country" data={leadsByCountryData} />
                </div>
                <div className="mt-6">
                  <h3 className="mb-3 text-base font-medium text-gray-700">
                    Country Metrics
                  </h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Country
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Schools Visited
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Students Reached
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Leads Generated
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Conversion Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {reportData.countryPerformance.map((country: any, index: number) => <tr key={index}>
                              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                {country.country}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {country.schoolsVisited}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {country.studentsReached}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                {country.leadsGenerated}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-900">
                                    {country.conversionRate}%
                                  </span>
                                  <div className="ml-2 h-1.5 w-16 rounded-full bg-gray-200">
                                    <div className="h-1.5 rounded-full bg-ash-teal" style={{
                            width: `${country.conversionRate * 2}%`
                          }}></div>
                                  </div>
                                </div>
                              </td>
                            </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>}
          </div>

          {/* School Visits Section */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4" onClick={() => toggleSection('visits')}>
              <h2 className="text-lg font-medium text-gray-900">
                School Visits
              </h2>
              {expandedSection === 'visits' ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
            </div>
            {expandedSection === 'visits' && <div className="p-6">
                <LineChart title="Leads Generated Trend" data={leadsGeneratedData} />
                <div className="mt-6">
                  <h3 className="mb-3 text-base font-medium text-gray-700">
                    Visit Details
                  </h3>
                  <DataTable columns={schoolVisitsColumns} data={reportData.schoolVisits} keyField="id" rowsPerPage={5} showSearch={false} />
                </div>
              </div>}
          </div>

          {/* Report Actions */}
          <div className="flex justify-between">
            <button className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ArrowDownIcon size={16} className="mr-2" />
              Previous Week
            </button>
            <div className="space-x-3">
              <button className="rounded-md border border-ash-teal bg-white px-4 py-2 text-sm font-medium text-ash-teal hover:bg-ash-teal/10">
                Save Report
              </button>
              <button className="rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90">
                Share Report
              </button>
            </div>
            <button className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next Week
              <ArrowUpIcon size={16} className="ml-2" />
            </button>
          </div>
        </>}
    </div>;
};