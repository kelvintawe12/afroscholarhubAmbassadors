import React, { useState } from 'react';
import { CalendarIcon, DownloadIcon, FilterIcon, TrendingUpIcon, UsersIcon, SchoolIcon, MapPinIcon, BarChart3Icon, PieChartIcon, FileTextIcon } from 'lucide-react';
import { LineChart } from '../../../ui/widgets/LineChart';
import { BarChart } from '../../../ui/widgets/BarChart';
import { PieChart } from '../../../ui/widgets/PieChart';
import { DataTable } from '../../../ui/widgets/DataTable';

export const MonthlyReportsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Mock data for monthly reports
  const monthlyMetrics = {
    totalStudents: 1250,
    newPartnerships: 15,
    activeAmbassadors: 52,
    totalVisits: 89,
    countriesCovered: 4,
    avgStudentsPerVisit: 14
  };

  const monthlyTrends = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Students Reached',
      data: [850, 920, 1100, 1250, 1400, 1350, 1500, 1650, 1800, 1950, 2100, 2250],
      borderColor: '#1A5F7A',
      backgroundColor: 'rgba(26, 95, 122, 0.1)'
    }]
  };

  const countryPerformance = {
    labels: ['Nigeria', 'Kenya', 'Ghana', 'South Africa'],
    datasets: [{
      label: 'Students Reached',
      data: [650, 320, 180, 100],
      backgroundColor: ['rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(38, 162, 105, 0.8)', 'rgba(108, 92, 231, 0.8)']
    }]
  };

  const ambassadorLeaderboard = {
    labels: ['Aisha N.', 'John K.', 'Grace M.', 'Samuel O.', 'Elizabeth A.'],
    datasets: [{
      label: 'Students Reached',
      data: [180, 165, 150, 140, 135],
      backgroundColor: 'rgba(26, 95, 122, 0.8)'
    }]
  };

  const recentActivities = [
    { id: 1, activity: 'New partnership signed', school: 'Lagos Model School', ambassador: 'Aisha Mohammed', date: '2024-01-15' },
    { id: 2, activity: 'School visit completed', school: 'Nairobi Secondary', ambassador: 'John Kimani', date: '2024-01-14' },
    { id: 3, activity: 'Workshop conducted', school: 'Accra Academy', ambassador: 'Grace Mensah', date: '2024-01-13' },
    { id: 4, activity: 'Student outreach', school: 'Cape Town High', ambassador: 'Samuel Okafor', date: '2024-01-12' },
    { id: 5, activity: 'Partnership renewed', school: 'Abuja Grammar', ambassador: 'Elizabeth Adebayo', date: '2024-01-11' }
  ];

  const activityColumns = [
    { header: 'Activity', accessor: 'activity' },
    { header: 'School', accessor: 'school' },
    { header: 'Ambassador', accessor: 'ambassador' },
    { header: 'Date', accessor: 'date' }
  ];

  const exportReport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting monthly report in ${format} format`);
    alert(`Monthly report exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Reports</h1>
          <p className="text-sm text-gray-500">Comprehensive overview of monthly performance and activities</p>
        </div>
        <div className="flex space-x-3">
          <select
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="2024-01">January 2024</option>
            <option value="2023-12">December 2023</option>
            <option value="2023-11">November 2023</option>
          </select>
          <select
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="all">All Countries</option>
            <option value="ng">Nigeria</option>
            <option value="ke">Kenya</option>
            <option value="gh">Ghana</option>
            <option value="za">South Africa</option>
          </select>
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <DownloadIcon size={16} className="mr-2" />
            Export PDF
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="flex items-center rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
          >
            <DownloadIcon size={16} className="mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ash-teal/10 text-ash-teal">
              <UsersIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Students Reached</p>
              <h3 className="text-2xl font-bold text-gray-900">{monthlyMetrics.totalStudents.toLocaleString()}</h3>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUpIcon size={14} className="mr-1" />
                +12% from last month
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ash-gold/10 text-ash-gold">
              <SchoolIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">New Partnerships</p>
              <h3 className="text-2xl font-bold text-gray-900">{monthlyMetrics.newPartnerships}</h3>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUpIcon size={14} className="mr-1" />
                +8% from last month
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <UsersIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Ambassadors</p>
              <h3 className="text-2xl font-bold text-gray-900">{monthlyMetrics.activeAmbassadors}</h3>
              <p className="text-sm text-gray-600">+2 new this month</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <CalendarIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Visits</p>
              <h3 className="text-2xl font-bold text-gray-900">{monthlyMetrics.totalVisits}</h3>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUpIcon size={14} className="mr-1" />
                +15% from last month
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <MapPinIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Countries Covered</p>
              <h3 className="text-2xl font-bold text-gray-900">{monthlyMetrics.countriesCovered}</h3>
              <p className="text-sm text-gray-600">All target countries</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <BarChart3Icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Students/Visit</p>
              <h3 className="text-2xl font-bold text-gray-900">{monthlyMetrics.avgStudentsPerVisit}</h3>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUpIcon size={14} className="mr-1" />
                +3 from last month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChart
          title="Monthly Student Reach Trends"
          data={monthlyTrends}
        />
        <PieChart
          title="Students Reached by Country"
          data={countryPerformance}
        />
        <BarChart
          title="Top Performing Ambassadors"
          data={ambassadorLeaderboard}
        />
      </div>

      {/* Recent Activities */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FilterIcon size={16} className="mr-1" />
            Filter
          </button>
        </div>
        <DataTable
          columns={activityColumns}
          data={recentActivities}
          keyField="id"
          rowsPerPage={5}
        />
      </div>

      {/* Report Summary */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Key Achievements</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                Successfully reached 1,250 students across 4 countries
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                Established 15 new school partnerships
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                Conducted 89 school visits with average 14 students per visit
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                Maintained 52 active ambassadors across all regions
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                South Africa region showing lower engagement - needs focus
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                Workshop attendance could be improved with better promotion
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                Ambassador training completion rate at 78% - target 85%
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
