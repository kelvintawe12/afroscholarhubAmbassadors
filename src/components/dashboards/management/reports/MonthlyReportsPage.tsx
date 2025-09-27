import React, { useState, useEffect } from 'react';
import { CalendarIcon, DownloadIcon, FilterIcon, TrendingUpIcon, UsersIcon, SchoolIcon, MapPinIcon, BarChart3Icon, PieChartIcon, FileTextIcon } from 'lucide-react';
import { LineChart } from '../../../ui/widgets/LineChart';
import { BarChart } from '../../../ui/widgets/BarChart';
import { PieChart } from '../../../ui/widgets/PieChart';
import { DataTable } from '../../../ui/widgets/DataTable';
import { generateReportMetrics, generateMonthlyReport, getCountries } from '../../../../api/reports';
import { LoadingSpinner } from '../../../LoadingSpinner';
import toast from 'react-hot-toast';

export const MonthlyReportsPage = () => {
  // Generate array of last 3 months (current and previous 2)
  const generateMonthsArray = () => {
    const months = [];
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1;

    // Add current month
    const currentMonthStr = currentMonth.toString().padStart(2, '0');
    const currentValue = `${currentYear}-${currentMonthStr}`;
    const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
    months.push({ value: currentValue, label: `${currentMonthName} ${currentYear}` });

    // Add previous month
    currentMonth--;
    if (currentMonth === 0) {
      currentMonth = 12;
      currentYear--;
    }
    const prevMonthStr = currentMonth.toString().padStart(2, '0');
    const prevValue = `${currentYear}-${prevMonthStr}`;
    const prevMonthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' });
    months.push({ value: prevValue, label: `${prevMonthName} ${currentYear}` });

    // Add month before previous
    currentMonth--;
    if (currentMonth === 0) {
      currentMonth = 12;
      currentYear--;
    }
    const prev2MonthStr = currentMonth.toString().padStart(2, '0');
    const prev2Value = `${currentYear}-${prev2MonthStr}`;
    const prev2MonthName = new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' });
    months.push({ value: prev2Value, label: `${prev2MonthName} ${currentYear}` });

    return months;
  };

  const monthsArray = generateMonthsArray();
  const [selectedMonth, setSelectedMonth] = useState(monthsArray[0]?.value || '2024-01');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [loading, setLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = await getCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast.error('Failed to load countries');
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setLoading(true);
      try {
        const [year, month] = selectedMonth.split('-');
        const countryCode = selectedCountry === 'all' ? undefined : selectedCountry;

        const data = await generateMonthlyReport(month, parseInt(year), countryCode);
        setMonthlyData(data);
      } catch (error) {
        console.error('Error fetching monthly data:', error);
        toast.error('Failed to load monthly report data');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [selectedMonth, selectedCountry]);

  // Calculate metrics from real data
  const monthlyMetrics = monthlyData ? {
    totalStudents: monthlyData.students_reached || 0,
    newPartnerships: monthlyData.partnerships || 0,
    activeAmbassadors: monthlyData.active_ambassadors || 0,
    totalVisits: monthlyData.visits_count || 0,
    countriesCovered: monthlyData.countries_covered || 0,
    avgStudentsPerVisit: monthlyData.visits_count ? Math.round((monthlyData.students_reached || 0) / monthlyData.visits_count) : 0
  } : {
    totalStudents: 0,
    newPartnerships: 0,
    activeAmbassadors: 0,
    totalVisits: 0,
    countriesCovered: 0,
    avgStudentsPerVisit: 0
  };

  const monthlyTrends = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Students Reached',
      data: [],
      borderColor: '#1A5F7A',
      backgroundColor: 'rgba(26, 95, 122, 0.1)'
    }]
  };

  const countryPerformance = {
    labels: [],
    datasets: [{
      label: 'Students Reached',
      data: [],
      backgroundColor: []
    }]
  };

  const ambassadorLeaderboard = {
    labels: [],
    datasets: [{
      label: 'Students Reached',
      data: [],
      backgroundColor: 'rgba(26, 95, 122, 0.8)'
    }]
  };

  const recentActivities: any[] = [];

  const activityColumns = [
    { header: 'Activity', accessor: 'activity' },
    { header: 'School', accessor: 'school' },
    { header: 'Ambassador', accessor: 'ambassador' },
    { header: 'Date', accessor: 'date' }
  ];

  const exportReport = async (format: string) => {
    try {
      if (format === 'pdf') {
        // For now, just show a message. In a real implementation, you'd call a PDF generation service
        toast.success('PDF export feature coming soon!');
      } else {
        // For Excel, you could use a library like xlsx
        toast.success('Excel export feature coming soon!');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
        <span className="ml-2 text-sm text-gray-600">Loading monthly report...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Reports</h1>
          <p className="text-sm text-gray-500">Comprehensive overview of monthly performance and activities</p>
        </div>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <select
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm min-w-0"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {monthsArray.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm min-w-0"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              disabled={countriesLoading}
            >
              <option value="all">All Countries</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag_emoji} {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <button
              onClick={() => exportReport('pdf')}
              className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <DownloadIcon size={16} className="mr-2" />
              Export PDF
            </button>
            <button
              onClick={() => exportReport('excel')}
              className="flex items-center justify-center rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
            >
              <DownloadIcon size={16} className="mr-2" />
              Export Excel
            </button>
          </div>
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


    </div>
  );
};
