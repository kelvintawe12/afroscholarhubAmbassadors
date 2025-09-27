import React, { useState, useEffect } from 'react';
import { CalendarIcon, DownloadIcon, FilterIcon, TrendingUpIcon, TrendingDownIcon, UsersIcon, SchoolIcon, MapPinIcon, BarChart3Icon, PieChartIcon, TargetIcon, AwardIcon } from 'lucide-react';
import { LineChart } from '../../../ui/widgets/LineChart';
import { BarChart } from '../../../ui/widgets/BarChart';
import { PieChart } from '../../../ui/widgets/PieChart';
import { DataTable } from '../../../ui/widgets/DataTable';
import { generateQuarterlyReport } from '../../../../api/reports';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../../../LoadingSpinner';

export const QuarterlyReportsPage = () => {
  const [selectedQuarter, setSelectedQuarter] = useState('Q1-2024');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [loading, setLoading] = useState(false);
  const [quarterlyData, setQuarterlyData] = useState<any>(null);

  useEffect(() => {
    const fetchQuarterlyData = async () => {
      setLoading(true);
      try {
        const [quarter, year] = selectedQuarter.split('-');
        const quarterNum = parseInt(quarter.replace('Q', ''));
        const countryCode = selectedCountry === 'all' ? undefined : selectedCountry;

        const data = await generateQuarterlyReport(quarterNum, parseInt(year), countryCode);
        setQuarterlyData(data);
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
    growthRate: 18.5, // Would need previous quarter comparison
    targetAchievement: 87 // Would need target data
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
      data: [2850, 3200, 3450, 3650, 3750],
      borderColor: '#1A5F7A',
      backgroundColor: 'rgba(26, 95, 122, 0.1)'
    }]
  };

  const countryPerformance = {
    labels: ['Nigeria', 'Kenya', 'Ghana', 'South Africa'],
    datasets: [{
      label: 'Students Reached',
      data: [1950, 920, 540, 340],
      backgroundColor: ['rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(38, 162, 105, 0.8)', 'rgba(108, 92, 231, 0.8)']
    }]
  };

  const partnershipGrowth = {
    labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024'],
    datasets: [{
      label: 'New Partnerships',
      data: [28, 32, 38, 41, 42],
      backgroundColor: 'rgba(26, 95, 122, 0.8)'
    }]
  };

  const quarterlyGoals = [
    { goal: 'Student Reach Target', current: 3750, target: 4000, percentage: 94, status: 'on-track' },
    { goal: 'New Partnerships', current: 42, target: 45, percentage: 93, status: 'on-track' },
    { goal: 'Country Expansion', current: 4, target: 5, percentage: 80, status: 'at-risk' },
    { goal: 'Ambassador Training', current: 78, target: 85, percentage: 92, status: 'on-track' }
  ];

  const topSchools = [
    { id: 1, name: 'Lagos Model School', students: 450, partnerships: 3, region: 'Southwest Nigeria', growth: 25 },
    { id: 2, name: 'Nairobi Secondary', students: 380, partnerships: 2, region: 'Nairobi County', growth: 18 },
    { id: 3, name: 'Accra International Academy', students: 320, partnerships: 2, region: 'Greater Accra', growth: 22 },
    { id: 4, name: 'Cape Town High School', students: 280, partnerships: 1, region: 'Western Cape', growth: 15 },
    { id: 5, name: 'Abuja Grammar School', students: 350, partnerships: 2, region: 'Federal Capital', growth: 20 }
  ];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quarterly Reports</h1>
          <p className="text-sm text-gray-500">Strategic overview and performance analysis for the quarter</p>
        </div>
        <div className="flex space-x-3">
          <select
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
          >
            <option value="Q1-2024">Q1 2024</option>
            <option value="Q4-2023">Q4 2023</option>
            <option value="Q3-2023">Q3 2023</option>
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
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUpIcon size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Strong Growth in Nigeria</p>
                <p className="text-sm text-gray-500">52% increase in student reach compared to last quarter</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <TargetIcon size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Partnership Target Exceeded</p>
                <p className="text-sm text-gray-500">42 partnerships formed, 7% above quarterly target</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingDownIcon size={16} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">South Africa Needs Attention</p>
                <p className="text-sm text-gray-500">Student engagement 15% below regional average</p>
              </div>
            </div>
          </div>
        </div>
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
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500"></div>
                Increase focus on South Africa market penetration
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500"></div>
                Launch ambassador recruitment drive in underperforming regions
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500"></div>
                Implement advanced training programs for existing ambassadors
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Long-term Strategy</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                Expand to additional African countries (Tanzania, Uganda)
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                Develop comprehensive digital learning platform
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                Establish regional training hubs for better support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};