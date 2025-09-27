import React, { useState, useEffect } from 'react';
import { CalendarIcon, DownloadIcon, FilterIcon, TrendingUpIcon, TrendingDownIcon, UsersIcon, SchoolIcon, MapPinIcon, BarChart3Icon, PieChartIcon, TargetIcon, AwardIcon } from 'lucide-react';
import { LineChart } from '../../../ui/widgets/LineChart';
import { BarChart } from '../../../ui/widgets/BarChart';
import { PieChart } from '../../../ui/widgets/PieChart';
import { DataTable } from '../../../ui/widgets/DataTable';
import { generateQuarterlyReport, getCountries } from '../../../../api/reports';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../../../LoadingSpinner';

export const QuarterlyReportsPage = () => {
  const [selectedQuarter, setSelectedQuarter] = useState('Q1-2024');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [loading, setLoading] = useState(false);
  const [quarterlyData, setQuarterlyData] = useState<any>(null);
  const [previousData, setPreviousData] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countriesData = await getCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchQuarterlyData = async () => {
      setLoading(true);
      try {
        const [quarter, year] = selectedQuarter.split('-');
        const quarterNum = parseInt(quarter.replace('Q', ''));
        const countryCode = selectedCountry === 'all' ? undefined : selectedCountry;

        const data = await generateQuarterlyReport(quarterNum, parseInt(year), countryCode);

        // Fetch previous quarter data for growth calculation
        let prevQuarterNum = quarterNum - 1;
        let prevYearNum = parseInt(year);
        if (prevQuarterNum < 1) {
          prevQuarterNum = 4;
          prevYearNum -= 1;
        }
        const prevData = await generateQuarterlyReport(prevQuarterNum, prevYearNum, countryCode);

        setQuarterlyData(data);
        setPreviousData(prevData);
      } catch (error) {
        console.error('Error fetching quarterly data:', error);
        toast.error('Failed to load quarterly report data');
      } finally {
        setLoading(false);
      }
    };

    fetchQuarterlyData();
  }, [selectedQuarter, selectedCountry]);

  // Calculate metrics from real data
  const quarterlyMetrics = quarterlyData ? {
    totalStudents: quarterlyData.students_reached || 0,
    newPartnerships: quarterlyData.partnerships || 0,
    activeAmbassadors: quarterlyData.active_ambassadors || 0,
    totalVisits: quarterlyData.visits_count || 0,
    countriesCovered: selectedCountry === 'all' ? 4 : 1,
    avgStudentsPerVisit: quarterlyData.visits_count ? Math.round((quarterlyData.students_reached || 0) / quarterlyData.visits_count) : 0,
    growthRate: previousData && previousData.students_reached > 0
      ? Math.round(((quarterlyData.students_reached - previousData.students_reached) / previousData.students_reached) * 100)
      : 0,
    targetAchievement: Math.min(100, Math.round((quarterlyData.students_reached / 1000) * 100)) // Assuming target of 1000 students
  } : {
    totalStudents: 0,
    newPartnerships: 0,
    activeAmbassadors: 0,
    totalVisits: 0,
    countriesCovered: 0,
    avgStudentsPerVisit: 0,
    growthRate: 0,
    targetAchievement: 0
  };

  const quarterlyTrends = {
    labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024'],
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

  const partnershipGrowth = {
    labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024'],
    datasets: [{
      label: 'New Partnerships',
      data: [],
      backgroundColor: 'rgba(26, 95, 122, 0.8)'
    }]
  };

  const quarterlyGoals: any[] = [];

  const topSchools: any[] = [];

  const schoolColumns = [
    { header: 'School Name', accessor: 'name' },
    { header: 'Students Reached', accessor: 'students' },
    { header: 'Partnerships', accessor: 'partnerships' },
    { header: 'Region', accessor: 'region' },
    { header: 'Growth %', accessor: (row: any) => `${row.growth}%` }
  ];

  const exportReport = async (format: string) => {
    try {
      if (format === 'pdf') {
        toast.success('PDF export feature coming soon!');
      } else {
        toast.success('Excel export feature coming soon!');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  // Generate strategic recommendations based on real data
  const generateStrategicRecommendations = (metrics: typeof quarterlyMetrics) => {
    const immediate: string[] = [];
    const longTerm: string[] = [];

    if (metrics.growthRate < 10) {
      immediate.push("Increase focus on South Africa market penetration");
    }
    if (metrics.activeAmbassadors < 50) {
      immediate.push("Launch ambassador recruitment drive in underperforming regions");
    }
    if (metrics.targetAchievement < 80) {
      immediate.push("Implement advanced training programs for existing ambassadors");
    }

    longTerm.push("Expand to additional African countries (Tanzania, Uganda)");
    longTerm.push("Develop comprehensive digital learning platform");
    longTerm.push("Establish regional training hubs for better support");

    return { immediate, longTerm };
  };

  const recommendations = generateStrategicRecommendations(quarterlyMetrics);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
        <span className="ml-2 text-sm text-gray-600">Loading quarterly report...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quarterly Reports</h1>
          <p className="text-sm text-gray-500">Strategic overview and performance analysis for the quarter</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
          >
            <option value="Q1-2024">Q1 2024</option>
            <option value="Q4-2023">Q4 2023</option>
            <option value="Q3-2023">Q3 2023</option>
          </select>
          <select
            className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="all">All Countries</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ash-teal/10 text-ash-teal">
              <UsersIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Students Reached</p>
              <h3 className="text-2xl font-bold text-gray-900">{quarterlyMetrics.totalStudents.toLocaleString()}</h3>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUpIcon size={14} className="mr-1" />
                +{quarterlyMetrics.growthRate}% YoY
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
              <h3 className="text-2xl font-bold text-gray-900">{quarterlyMetrics.newPartnerships}</h3>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUpIcon size={14} className="mr-1" />
                +14% from last quarter
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <TargetIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Target Achievement</p>
              <h3 className="text-2xl font-bold text-gray-900">{quarterlyMetrics.targetAchievement}%</h3>
              <p className="text-sm text-gray-600">87% of quarterly goals met</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <AwardIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Ambassadors</p>
              <h3 className="text-2xl font-bold text-gray-900">{quarterlyMetrics.activeAmbassadors}</h3>
              <p className="text-sm text-green-600">+6 from last quarter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quarterly Goals Progress</h3>
        <div className="space-y-4">
          {quarterlyGoals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{goal.goal}</span>
                <span className="text-sm text-gray-500">
                  {goal.current} / {goal.target} ({goal.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    goal.status === 'on-track' ? 'bg-green-500' :
                    goal.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${goal.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChart
          title="Quarterly Student Reach Trends"
          data={quarterlyTrends}
        />
        <PieChart
          title="Students Reached by Country"
          data={countryPerformance}
        />
        <BarChart
          title="Partnership Growth Over Quarters"
          data={partnershipGrowth}
        />

      </div>

      {/* Top Performing Schools */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Top Performing Schools</h3>
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FilterIcon size={16} className="mr-1" />
            Filter
          </button>
        </div>
        <DataTable
          columns={schoolColumns}
          data={topSchools}
          keyField="id"
          rowsPerPage={5}
        />
      </div>

      {/* Strategic Recommendations */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Strategic Recommendations</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Immediate Actions</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {recommendations.immediate.length > 0 ? (
                recommendations.immediate.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500"></div>
                    {action}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">All immediate goals on track</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Long-term Strategy</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {recommendations.longTerm.map((strategy, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  {strategy}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};