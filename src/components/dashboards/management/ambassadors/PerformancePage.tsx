import { useState } from 'react';
import { TrendingUpIcon, FilterIcon, DownloadIcon, SearchIcon, CheckCircleIcon, AlertTriangleIcon, XCircleIcon, BarChart3Icon, ArrowUpIcon, ArrowDownIcon, CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { LineChart } from '../../../ui/widgets/LineChart';
import { BarChart } from '../../../ui/widgets/BarChart';
import { DataTable } from '../../../ui/widgets/DataTable';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { getAmbassadorsData } from '../../../../api/management';
import { useDashboardData } from '../../../../hooks/useDashboardData';

interface Ambassador {
  id: string;
  name: string;
  email: string;
  country: string;
  region: string;
  status: string;
  performance: number;
  schoolsCount: number;
  studentsReached: number;
  tasksCompleted: number;
  tasksTotal: number;
  lastActivity: string;
  avatar: string;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
    borderDash?: number[];
  }>;
}

interface AmbassadorsData {
  ambassadors: Ambassador[];
  metrics: Array<{
    title: string;
    value: string;
    change: number;
  }>;
  charts: {
    performanceTrend: ChartData;
    performanceByCountry: ChartData;
    studentsReached: ChartData;
    completionRate: ChartData;
  };
}

export const AmbassadorPerformancePage = () => {
  const { data: ambassadorsData, loading, error } = useDashboardData<AmbassadorsData>(
    async () => await getAmbassadorsData(),
    []
  );

  const [timeRange, setTimeRange] = useState('quarter');
  const [filterRegion, setFilterRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div>Loading performance data...</div></div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading performance data: {error}</div>;
  }

  const ambassadors: Ambassador[] = ambassadorsData?.ambassadors || [];
  const metrics = ambassadorsData?.metrics || [];
  const charts = ambassadorsData?.charts || {
    performanceTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Average Performance Score',
        data: [72, 75, 78, 80, 82, 85],
        borderColor: '#1A5F7A',
        backgroundColor: 'rgba(26, 95, 122, 0.1)',
        fill: true
      }, {
        label: 'Goal',
        data: [80, 80, 80, 80, 80, 80],
        borderColor: '#F4C430',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        fill: false
      }]
    },
    performanceByCountry: {
      labels: ['Nigeria', 'Kenya', 'Ghana', 'South Africa'],
      datasets: [{
        label: 'Average Performance Score',
        data: [85, 82, 78, 75],
        backgroundColor: 'rgba(26, 95, 122, 0.8)'
      }]
    },
    studentsReached: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Students Reached',
        data: [320, 450, 520, 680, 750, 920],
        borderColor: '#26A269',
        backgroundColor: 'rgba(38, 162, 105, 0.1)',
        fill: true
      }]
    },
    completionRate: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Task Completion Rate',
        data: [75, 78, 80, 82, 85, 88],
        borderColor: '#F4C430',
        backgroundColor: 'rgba(244, 196, 48, 0.1)',
        fill: true
      }]
    }
  };

  // Filter ambassadors
  const filteredAmbassadors = ambassadors.filter((ambassador: Ambassador) => {
    const matchesRegion = filterRegion === 'all' || ambassador.country === filterRegion;
    const matchesSearch = searchQuery === '' ||
      ambassador.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ambassador.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ambassador.region.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRegion && matchesSearch;
  });

  // Ambassador performance table columns
  const columns = [{
    header: 'Ambassador',
    accessor: (row: Ambassador) => (
      <div className="flex items-center">
        <img src={row.avatar} alt={row.name} className="h-10 w-10 rounded-full object-cover" />
        <div className="ml-3">
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      </div>
    )
  }, {
    header: 'Country/Region',
    accessor: (row: Ambassador) => (
      <div>
        <div className="font-medium">{row.country}</div>
        <div className="text-xs text-gray-500">{row.region}</div>
      </div>
    )
  }, {
    header: 'Status',
    accessor: (row: Ambassador) => (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {row.status === 'active' ? (
          <>
            <CheckCircleIcon size={12} className="mr-1" />
            Active
          </>
        ) : (
          <>
            <XCircleIcon size={12} className="mr-1" />
            Inactive
          </>
        )}
      </span>
    )
  }, {
    header: 'Performance Score',
    accessor: (row: Ambassador) => (
      <div className="w-full max-w-[120px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{row.performance}%</span>
          <span className={`flex items-center text-xs ${
            row.performance >= 80 ? 'text-green-600' : 'text-red-600'
          }`}>
            <ArrowUpIcon size={12} className="mr-0.5" />
            {row.performance >= 80 ? '+' : ''}{Math.floor(Math.random() * 10) + 1}%
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
          <div
            className={`h-1.5 rounded-full ${
              row.performance >= 80 ? 'bg-green-500' : row.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${row.performance}%` }}
          />
        </div>
      </div>
    ),
    sortable: true
  }, {
    header: 'Schools',
    accessor: (row: Ambassador) => row.schoolsCount.toString(),
    sortable: true
  }, {
    header: 'Students Reached',
    accessor: (row: Ambassador) => row.studentsReached.toString(),
    sortable: true
  }, {
    header: 'Task Completion',
    accessor: (row: Ambassador) => (
      <div>
        <div className="text-sm">
          {row.tasksCompleted}/{row.tasksTotal}
        </div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full bg-ash-teal"
            style={{
              width: `${row.tasksTotal > 0 ? (row.tasksCompleted / row.tasksTotal) * 100 : 0}%`
            }}
          />
        </div>
      </div>
    )
  }, {
    header: 'Last Activity',
    accessor: (row: Ambassador) => row.lastActivity
  }];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Ambassador Performance
        </h1>
        <p className="text-sm text-gray-500">
          Track ambassador metrics, identify top performers, and discover opportunities for improvement
        </p>
      </div>

      {/* Time range selector */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              timeRange === 'month' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              timeRange === 'quarter' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setTimeRange('quarter')}
          >
            Quarter
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              timeRange === 'year' ? 'bg-ash-teal text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
          <div className="ml-0 sm:ml-4 flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 mt-2 sm:mt-0">
            <CalendarIcon size={16} className="mr-2 text-gray-400" />
            <span>Q2 2025</span>
            <ChevronDownIcon size={16} className="ml-2 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
          <button
            className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon size={16} className="mr-2" />
            Filter
          </button>
          <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto">
            <DownloadIcon size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-medium text-gray-700">Filters</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Country
              </label>
              <select
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm"
                value={filterRegion}
                onChange={e => setFilterRegion(e.target.value)}
              >
                <option value="all">All Countries</option>
                {Array.from(new Set(ambassadors.map((a: Ambassador) => a.country))).map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Performance Score
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Scores</option>
                <option value="high">High (80%+)</option>
                <option value="medium">Medium (60-79%)</option>
                <option value="low">Low (Below 60%)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Status
              </label>
              <select className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="training">Training</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Performance metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric: any, index: number) => (
          <KpiCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={<BarChart3Icon size={20} />}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChart
          title="Performance Trend"
          subtitle="Average performance score over time"
          data={charts.performanceTrend}
        />
        <BarChart
          title="Performance by Country"
          subtitle="Average performance by country"
          data={charts.performanceByCountry}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChart
          title="Students Reached"
          subtitle="Total students reached over time"
          data={charts.studentsReached}
        />
        <LineChart
          title="Task Completion Rate"
          subtitle="Percentage of tasks completed on time"
          data={charts.completionRate}
        />
      </div>

      {/* Ambassador Table */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Ambassador Performance Details
          </h2>
          <div className="relative w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search ambassadors..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredAmbassadors}
          keyField="id"
          rowsPerPage={10}
          showSearch={false}
        />
      </div>

      {/* Improvement Recommendations */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-medium text-gray-700">
          Performance Improvement Recommendations
        </h3>
        <div className="space-y-4">
          <div className="flex items-start rounded-lg bg-yellow-50 p-3">
            <AlertTriangleIcon size={20} className="mr-3 mt-0.5 text-yellow-500" />
            <div>
              <h4 className="font-medium text-gray-900">
                {ambassadors.filter((a: Ambassador) => a.performance < 60).length} ambassadors below performance threshold
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                Consider scheduling training sessions or one-on-one check-ins to address performance issues.
              </p>
              <button className="mt-2 rounded-md border border-ash-teal px-3 py-1.5 text-xs font-medium text-ash-teal hover:bg-ash-teal/10">
                Schedule Training
              </button>
            </div>
          </div>
          <div className="flex items-start rounded-lg bg-green-50 p-3">
            <TrendingUpIcon size={20} className="mr-3 mt-0.5 text-green-500" />
            <div>
              <h4 className="font-medium text-gray-900">
                Top performing ambassadors identified
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                Consider documenting successful strategies and sharing with other team members.
              </p>
              <button className="mt-2 rounded-md border border-ash-teal px-3 py-1.5 text-xs font-medium text-ash-teal hover:bg-ash-teal/10">
                Share Best Practices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
