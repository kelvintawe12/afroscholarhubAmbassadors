import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useCountryLeadKPIs, useCountryAmbassadors, useLeadGenerationTrends, useCountryDistribution, useAmbassadorPerformance, useRecentActivities } from '../../../hooks/useDashboardData';
import { supabase } from '../../../utils/supabase';
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  Users,
  Award,
  MapPin,
  TrendingUp,
  Zap,
  Shield,
  Building,
  GraduationCap,
  Activity,
  DollarSign,
  Percent,
  Clock,
  Plus
} from 'lucide-react';
import { BarChart } from '../../ui/widgets/BarChart';
import { PieChart } from '../../ui/widgets/PieChart';
import { LineChart } from '../../ui/widgets/LineChart';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { DataTable } from '../../ui/widgets/DataTable';

// Types
interface ReportMetric {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
}

interface ReportFilter {
  timePeriod: '7d' | '30d' | '90d' | 'ytd' | '12m' | 'all';
  region: 'all' | 'ng' | 'gh' | 'ke' | 'za' | 'ug' | 'eg' | 'multi';
  category: 'all' | 'stem' | 'business' | 'health' | 'arts' | 'education';
  status: 'all' | 'funded' | 'pending' | 'rejected';
}

interface Report {
  id: string;
  title: string;
  type: 'impact' | 'financial' | 'ambassador' | 'school' | 'event' | 'compliance';
  period: string;
  generated: string;
  status: 'ready' | 'generating' | 'error';
  size: string;
  downloads: number;
  categories: string[];
}

// Real Data - will be populated from API
const reportMetrics: ReportMetric[] = [];

const recentReports: Report[] = [];

// Chart Data - will be populated from API
const scholarshipTrendsData: any = {
  labels: [],
  datasets: []
};

const categoryBreakdownData: any = {
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: [
      'rgba(26, 95, 122, 0.8)',
      'rgba(244, 196, 48, 0.8)',
      'rgba(38, 162, 105, 0.8)',
      'rgba(147, 51, 234, 0.8)',
      'rgba(239, 68, 68, 0.8)'
    ]
  }]
};

const regionalPerformanceData: any = {
  labels: [],
  datasets: []
};

const ambassadorPerformanceData: any = {
  labels: [],
  datasets: []
};

// Components
const ReportCard: React.FC<{ report: Report; onDownload: () => void }> = ({ report, onDownload }) => {
  const typeConfig = {
    impact: { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <TrendingUp className="h-4 w-4" /> },
    financial: { color: 'text-green-600 bg-green-50 border-green-200', icon: <DollarSign className="h-4 w-4" /> },
    ambassador: { color: 'text-purple-600 bg-purple-50 border-purple-200', icon: <Users className="h-4 w-4" /> },
    school: { color: 'text-orange-600 bg-orange-50 border-orange-200', icon: <Building className="h-4 w-4" /> },
    event: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: <Activity className="h-4 w-4" /> },
    compliance: { color: 'text-red-600 bg-red-50 border-red-200', icon: <Shield className="h-4 w-4" /> }
  };

  const typeInfo = typeConfig[report.type];
  const statusColors = {
    ready: 'bg-green-100 text-green-800',
    generating: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Type Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
          {typeInfo.icon}
          {report.type}
        </span>
      </div>

      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status]}`}>
          {report.status === 'ready' ? 'Ready' : report.status === 'generating' ? 'Generating' : 'Error'}
        </span>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-ash-teal transition-colors">
            {report.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{report.period}</span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(report.generated).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {report.categories.map((category, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-3">{report.size}</span>
            <span className="flex items-center">
              <Download className="h-3 w-3 mr-1" />
              {report.downloads} downloads
            </span>
          </div>
          
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-ash-teal to-ash-gold text-white rounded-lg text-sm font-medium hover:from-ash-teal/90 hover:to-ash-gold/90 transition-all group-hover:shadow-md"
          >
            Download
            <Download className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportQuickAction: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  count?: number;
  onClick: () => void; 
  color?: string;
}> = ({ icon, title, description, count, onClick, color = 'from-ash-teal to-ash-gold' }) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
      
      {/* Count Badge */}
      {count && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            {count}
          </span>
        </div>
      )}
      
      <div className="relative z-10 flex items-start space-x-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <BarChart3 className="h-4 w-4 text-white" />
      </div>
    </button>
  );
};

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const countryCode = user?.country_code || 'ng'; // Default to Nigeria if not set

  const { data: kpis, loading: kpisLoading } = useCountryLeadKPIs(countryCode);
  const { data: ambassadors } = useCountryAmbassadors(countryCode);
  const { data: leadTrends } = useLeadGenerationTrends();
  const { data: countryDist } = useCountryDistribution();
  const { data: ambPerformance } = useAmbassadorPerformance();
  const { data: activities } = useRecentActivities(5);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ReportFilter>({
    timePeriod: '30d',
    region: 'all',
    category: 'all',
    status: 'all'
  });

  // Populate reportMetrics from KPIs
  const reportMetrics: ReportMetric[] = React.useMemo(() => {
    if (!kpis || kpisLoading) return [];

    return [
      {
        title: 'Leads Generated',
        value: kpis.leadsGenerated?.toLocaleString() || '0',
        trend: '+12% this month',
        icon: <Users className="h-5 w-5 text-blue-600" />,
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: 'Partner Schools',
        value: kpis.schoolsVisited?.toString() || '0',
        trend: '+5 this quarter',
        icon: <Building className="h-5 w-5 text-purple-600" />,
        color: 'from-purple-500 to-violet-600'
      },
      {
        title: 'Tasks Completed',
        value: kpis.tasksCompleted?.toString() || '0',
        trend: '+18% this month',
        icon: <Award className="h-5 w-5 text-yellow-600" />,
        color: 'from-yellow-400 to-orange-500'
      },
      {
        title: 'Conversion Rate',
        value: kpis.conversionRate ? `${kpis.conversionRate}%` : '0%',
        trend: 'Target: 85%',
        icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
        color: 'from-emerald-500 to-teal-600'
      },
      {
        title: 'Active Ambassadors',
        value: kpis.activeAmbassadors?.toString() || '0',
        trend: '+2 this month',
        icon: <Users className="h-5 w-5 text-green-600" />,
        color: 'from-green-500 to-emerald-600'
      },
      {
        title: 'Impact Score',
        value: kpis.impactScore?.toString() || '0',
        trend: 'Goal: 100',
        icon: <Clock className="h-5 w-5 text-orange-600" />,
        color: 'from-orange-400 to-red-500'
      }
    ];
  }, [kpis, kpisLoading]);

  // Fetch additional data for metrics and charts
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [schoolsByStatus, setSchoolsByStatus] = useState<Record<string, number>>({});
  const [totalFunding, setTotalFunding] = useState<number>(0);
  const [avgResolutionTime, setAvgResolutionTime] = useState<string>('0 days');
  const [categoryData, setCategoryData] = useState<any>(categoryBreakdownData);
  const [regionalData, setRegionalData] = useState<any>(regionalPerformanceData);
  const [scholarshipTrends, setScholarshipTrends] = useState<any>(scholarshipTrendsData);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (!countryCode) return;

      try {
        // Fetch total students reached
        const { data: visitData } = await supabase
          .from('visits')
          .select('students_reached')
          .eq('country_code', countryCode);
        const students = visitData?.reduce((sum: number, v: any) => sum + (v.students_reached || 0), 0) || 0;
        setTotalStudents(students);

        // Fetch schools by status
        const { data: schoolData } = await supabase
          .from('schools')
          .select('status')
          .eq('country_code', countryCode);
        const statusCount: Record<string, number> = {};
        schoolData?.forEach((s: any) => {
          statusCount[s.status] = (statusCount[s.status] || 0) + 1;
        });
        setSchoolsByStatus(statusCount);

        // Fetch total funding
        const { data: eventData } = await supabase
          .from('events')
          .select('actual_cost')
          .eq('country_code', countryCode)
          .gt('actual_cost', 0);
        const funding = eventData?.reduce((sum: number, e: any) => sum + (e.actual_cost || 0), 0) || 0;
        setTotalFunding(funding);

        // Avg resolution time
        const { data: taskData } = await supabase
          .from('tasks')
          .select('created_at, completed_date, updated_at')
          .eq('status', 'Completed')
          .eq('country_code', countryCode);
        if (taskData && taskData.length > 0) {
          const avgDays = taskData.reduce((sum: number, t: any) => {
            const start = new Date(t.created_at);
            const end = new Date(t.completed_date || t.updated_at);
            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / taskData.length;
          setAvgResolutionTime(`${avgDays.toFixed(1)} days`);
        }

        // Category breakdown by school type (simplified)
        const { data: typeData } = await supabase
          .from('schools')
          .select('type')
          .eq('country_code', countryCode)
          .eq('status', 'partnered');
        if (typeData) {
          const typeCount: Record<string, number> = {};
          typeData.forEach((s: any) => {
            const type = s.type?.toUpperCase() || 'Other';
            typeCount[type] = (typeCount[type] || 0) + 1;
          });
          setCategoryData({
            labels: Object.keys(typeCount),
            datasets: [{
              data: Object.values(typeCount),
              backgroundColor: categoryBreakdownData.datasets[0].backgroundColor
            }]
          });
        }

        // Regional breakdown (simplified)
        const { data: regionData } = await supabase
          .from('schools')
          .select('region')
          .eq('country_code', countryCode);
        if (regionData) {
          const regionCount: Record<string, number> = {};
          regionData.forEach((s: any) => {
            const region = s.region || 'Unknown';
            regionCount[region] = (regionCount[region] || 0) + 1;
          });
          setRegionalData({
            labels: Object.keys(regionCount),
            datasets: [{
              label: 'Schools',
              data: Object.values(regionCount),
              backgroundColor: 'rgba(26, 95, 122, 0.8)'
            }]
          });
        }

        // Scholarship trends
        const { data: schoolTrends } = await supabase
          .from('schools')
          .select('partnership_date')
          .eq('country_code', countryCode)
          .eq('status', 'partnered');
        if (schoolTrends) {
          const monthly: Record<string, number> = {};
          schoolTrends.forEach((s: any) => {
            if (s.partnership_date) {
              const date = new Date(s.partnership_date);
              const month = date.toLocaleDateString('en-US', { month: 'short' });
              monthly[month] = (monthly[month] || 0) + 1;
            }
          });
          setScholarshipTrends({
            labels: Object.keys(monthly),
            datasets: [{
              label: 'Schools Partnered',
              data: Object.values(monthly),
              borderColor: 'rgb(26, 95, 122)',
              backgroundColor: 'rgba(26, 95, 122, 0.1)',
              tension: 0.4
            }]
          });
        }
      } catch (error) {
        console.error('Error fetching additional data:', error);
      }
    };

    fetchAdditionalData();
  }, [countryCode]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'reports', label: 'Reports (23)', icon: <FileText className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'schedules', label: 'Schedules (5)', icon: <Calendar className="h-4 w-4" /> }
  ];

  const timePeriods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'ytd', label: 'YTD' },
    { value: '12m', label: '12 Months' },
    { value: 'all', label: 'All Time' }
  ];

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'ng', label: 'Nigeria 🇳🇬' },
    { value: 'gh', label: 'Ghana 🇬🇭' },
    { value: 'ke', label: 'Kenya 🇰🇪' },
    { value: 'za', label: 'South Africa 🇿🇦' },
    { value: 'ug', label: 'Uganda 🇺🇬' },
    { value: 'eg', label: 'Egypt 🇪🇬' },
    { value: 'multi', label: 'Multi-country 🌍' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'stem', label: 'STEM' },
    { value: 'business', label: 'Business' },
    { value: 'health', label: 'Health Sciences' },
    { value: 'arts', label: 'Arts & Humanities' },
    { value: 'education', label: 'Education' }
  ];

  // Filter reports
  const filteredReports = recentReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.period.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Additional filtering logic based on categories, etc.
    return matchesSearch;
  });

  // Recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'report',
      title: 'Q4 Impact Report Generated',
      description: 'Comprehensive analysis of 2,847 scholarships funded',
      timestamp: '2 hours ago',
      user: { name: 'Analytics System' },
      icon: <FileText className="h-4 w-4 text-blue-600" />
    },
    {
      id: '2',
      type: 'download',
      title: 'Nigeria Operations Report Downloaded',
      description: 'Financial Director accessed Q4 financial summary',
      timestamp: '4 hours ago',
      user: { name: 'Fatima Ahmed' },
      icon: <Download className="h-4 w-4 text-green-600" />
    },
    {
      id: '3',
      type: 'schedule',
      title: 'Monthly Ambassador Report Scheduled',
      description: 'Automated report delivery set for 1st of each month',
      timestamp: 'Yesterday 10:30 AM',
      user: { name: 'Sarah Nakato' },
      icon: <Calendar className="h-4 w-4 text-purple-600" />
    },
    {
      id: '4',
      type: 'analytics',
      title: 'STEM Conversion Rate Improved',
      description: 'Success rate increased from 82% to 89% in Q4',
      timestamp: '2 days ago',
      user: { name: 'Data Team' },
      icon: <TrendingUp className="h-4 w-4 text-emerald-600" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-ash-teal to-ash-gold rounded-xl mr-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-lg text-gray-600 mt-1">Data-driven insights for strategic decision making</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Quick Export */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export All
          </button>
          
          {/* Generate Report */}
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ash-teal to-ash-gold text-white rounded-lg font-semibold hover:from-ash-teal/90 hover:to-ash-gold/90 transition-all shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4" />
            New Report
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-ash-teal text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Based on Active Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reportMetrics.map((metric, index) => (
              <KpiCard 
                key={index}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                color={metric.color}
              />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scholarship Trends */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  Scholarship Trends
                </h3>
                <div className="flex items-center gap-2">
                  <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ash-teal">
                    <option>2024</option>
                    <option>2023</option>
                  </select>
                </div>
              </div>
              <LineChart
                title="Scholarship Trends"
                data={scholarshipTrends}
                height={300}
              />
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
                  Category Breakdown
                </h3>
                <span className="text-sm text-gray-500">Q4 2024</span>
              </div>
              <PieChart
                title="Category Breakdown"
                data={categoryData}
                height={300}
              />
            </div>
          </div>

          {/* Secondary Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Regional Performance */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Regional Performance
                </h3>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <BarChart
                title="Regional Performance"
                data={regionalData}
                height={300}
              />
            </div>

            {/* Ambassador Performance */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Ambassador Performance
                </h3>
                <span className="text-sm text-gray-500">2024</span>
              </div>
              <BarChart
                title="Ambassador Performance"
                data={ambassadorPerformanceData}
                height={300}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ReportQuickAction
              icon={<TrendingUp className="h-5 w-5 text-white" />}
              title="Impact Analysis"
              description="Scholarship outcomes and student success metrics"
              count={12}
              onClick={() => console.log('Generate impact report')}
              color="from-blue-500 to-blue-600"
            />
            <ReportQuickAction
              icon={<DollarSign className="h-5 w-5 text-white" />}
              title="Financial Reports"
              description="Funding allocation, disbursements, and ROI analysis"
              count={8}
              onClick={() => console.log('Generate financial report')}
              color="from-green-500 to-emerald-600"
            />
            <ReportQuickAction
              icon={<Users className="h-5 w-5 text-white" />}
              title="Ambassador Metrics"
              description="Performance tracking and training effectiveness"
              count={5}
              onClick={() => console.log('Generate ambassador report')}
              color="from-purple-500 to-violet-600"
            />
            <ReportQuickAction
              icon={<Building className="h-5 w-5 text-white" />}
              title="School Partnerships"
              description="Pipeline analysis and conversion tracking"
              count={3}
              onClick={() => console.log('Generate school report')}
              color="from-orange-500 to-red-500"
            />
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports by title, period, or category..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ash-teal focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <Filter className="h-4 w-4 text-gray-500 mr-2" />
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.timePeriod}
                    onChange={(e) => setFilters(prev => ({ ...prev, timePeriod: e.target.value as ReportFilter['timePeriod'] }))}
                  >
                    {timePeriods.map(period => (
                      <option key={period.value} value={period.value}>{period.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.region}
                    onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value as ReportFilter['region'] }))}
                  >
                    {regions.map(region => (
                      <option key={region.value} value={region.value}>{region.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as ReportFilter['category'] }))}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard 
                key={report.id}
                report={report}
                onDownload={() => console.log('Download report:', report.title)}
              />
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-ash-teal text-white rounded-lg font-medium hover:bg-ash-teal/90 transition-colors mx-auto">
                <Plus className="h-4 w-4" />
                Generate New Report
              </button>
            </div>
          )}
        </div>
      )}

      {/* Activity Feed - Always visible */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {/* Reports Table - Alternative view */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detailed Analytics</h3>
                <button className="text-sm text-ash-teal hover:text-ash-teal/80 font-medium">
                  Export CSV →
                </button>
              </div>
              <DataTable 
                columns={[
                  { header: 'Metric', accessor: 'metric' },
                  { header: 'Current', accessor: 'current' },
                  { header: 'Previous', accessor: 'previous' },
                  { header: 'Change', accessor: 'change', sortable: true },
                  { header: 'Target', accessor: 'target' }
                ]}
                data={[
                  { id: 1, metric: 'Scholarships Funded', current: '2,847', previous: '2,412', change: '+18%', target: '3,000' },
                  { id: 2, metric: 'Funding Disbursed', current: '₦12.4B', previous: '₦10.2B', change: '+24%', target: '₦15B' },
                  { id: 3, metric: 'Ambassador Activity', current: '1,247', previous: '1,112', change: '+12%', target: '1,500' },
                  { id: 4, metric: 'Success Rate', current: '89%', previous: '86%', change: '+3%', target: '85%' }
                ]}
                keyField="id"
                rowsPerPage={10}
              />
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            Recent Activity
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              Live
            </span>
          </h2>
          
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {activity.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{activity.title}</h4>
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span className="font-medium">{activity.user.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 bg-gradient-to-r from-ash-teal to-ash-gold text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 md:hidden">
        <Plus className="h-6 w-6" />
      </div>
    </div>
  );
};

export default ReportsPage;