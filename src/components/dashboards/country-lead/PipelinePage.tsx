import React, { useState } from 'react';
import {
  MapPin, School, Users, Award, TrendingUp, Calendar, Plus, Search, Filter, Download, Phone, Mail, CheckCircle, AlertTriangle,
  Zap, Building, GraduationCap
} from 'lucide-react';
import { DataTable } from '../../ui/widgets/DataTable';
import { ActivityFeed } from '../../ui/widgets/ActivityFeed';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useCountryLeadKPIs, useCountryAmbassadors, useRecentActivities, useDashboardData } from '../../../hooks/useDashboardData';
import { getCountrySchools, getCountryMetrics } from '../../../api/country-lead';

// Types
interface School {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  flag: string;
  type: 'public' | 'private' | 'university' | 'polytechnic' | 'secondary';
  stage: 'prospect' | 'contacted' | 'visited' | 'proposal' | 'partnered' | 'inactive';
  students: number;
  ambassadors: number;
  scholarships: number;
  potential: string;
  nextAction: string;
  lastContact: string;
  assignedTo: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: string;
  score: number;
  conversionProbability: number;
}

interface PipelineStat {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}

// Mock Data (will be replaced with real data inside component)
const pipelineStats: PipelineStat[] = [
  {
    title: 'Total Schools',
    value: '1,247',
    icon: <School className="h-5 w-5 text-blue-600" />,
    trend: '+34 this quarter',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Active Pipeline',
    value: '289',
    icon: <TrendingUp className="h-5 w-5 text-green-600" />,
    trend: 'Conversion: 23%',
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'New Partners',
    value: '67',
    icon: <CheckCircle className="h-5 w-5 text-purple-600" />,
    trend: '+12 this month',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Pipeline Value',
    value: '₦2.4B',
    icon: <Award className="h-5 w-5 text-yellow-500" />,
    trend: 'Potential impact',
    color: 'from-yellow-400 to-orange-500'
  }
];


// Stage configurations
const stageConfig = {
  prospect: { 
    color: 'bg-gray-100 text-gray-700 border-gray-200', 
    label: 'Prospect',
    icon: <MapPin className="h-4 w-4" />,
    probability: 10
  },
  contacted: { 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    label: 'Contacted',
    icon: <Phone className="h-4 w-4" />,
    probability: 30
  },
  visited: { 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    label: 'Visited',
    icon: <Building className="h-4 w-4" />,
    probability: 60
  },
  proposal: { 
    color: 'bg-purple-100 text-purple-800 border-purple-200', 
    label: 'Proposal',
    icon: <GraduationCap className="h-4 w-4" />,
    probability: 80
  },
  partnered: { 
    color: 'bg-green-100 text-green-800 border-green-200', 
    label: 'Partnered',
    icon: <CheckCircle className="h-4 w-4" />,
    probability: 100
  },
  inactive: { 
    color: 'bg-red-100 text-red-800 border-red-200', 
    label: 'Inactive',
    icon: <AlertTriangle className="h-4 w-4" />,
    probability: 0
  }
};

// School type configurations
const schoolTypeConfig = {
  public: { color: 'bg-blue-100 text-blue-800', label: 'Public' },
  private: { color: 'bg-green-100 text-green-800', label: 'Private' },
  university: { color: 'bg-purple-100 text-purple-800', label: 'University' },
  polytechnic: { color: 'bg-orange-100 text-orange-800', label: 'Polytechnic' },
  secondary: { color: 'bg-indigo-100 text-indigo-800', label: 'Secondary' }
};

// Components
const SchoolCard: React.FC<{ school: School; onClick: () => void }> = ({ school, onClick }) => {
  const stage = stageConfig[school.stage];
  const schoolType = schoolTypeConfig[school.type];
  const potentialColors = {
    'Low': 'text-red-600',
    'Medium': 'text-yellow-600',
    'High': 'text-green-600',
    'Very High': 'text-emerald-600'
  };

  const formatPotentialValue = (potential: string) => {
    const multipliers = { 'Low': 0.1, 'Medium': 0.3, 'High': 0.7, 'Very High': 1.0 };
    const baseValue = school.students * 50000; // ₦50k per student potential
    return (baseValue * multipliers[potential as keyof typeof multipliers]).toLocaleString();
  };

  return (
    <div 
      className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Stage Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${stage.color}`}>
          {stage.icon}
          {stage.label}
        </span>
      </div>

      {/* School Type */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${schoolType.color}`}>
          {schoolType.label}
        </span>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-ash-teal transition-colors">
              {school.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{school.city}, {school.country}</span>
              </span>
              <span className="flex items-center ml-2">
                <span className="mr-1">{school.flag}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Students</p>
            <p className="text-lg font-bold text-gray-900">{school.students.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Scholarships</p>
            <p className="text-lg font-bold text-gray-900">{school.scholarships}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Ambassadors</p>
            <p className={`text-sm font-semibold ${school.ambassadors > 0 ? 'text-green-600' : 'text-gray-500'}`}>
              {school.ambassadors}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Score</p>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className="bg-gradient-to-r from-ash-teal to-ash-gold h-2 rounded-full" 
                  style={{ width: `${school.score}%` }}
                />
              </div>
              <span className="text-sm font-semibold">{school.score}%</span>
            </div>
          </div>
        </div>

        {/* Potential Value */}
        <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Potential Value</p>
              <p className={`text-sm font-semibold ${potentialColors[school.potential as keyof typeof potentialColors]}`}>
                {potentialColors[school.potential as keyof typeof potentialColors]}
                ₦{formatPotentialValue(school.potential)}M
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${potentialColors[school.potential as keyof typeof potentialColors]}`}>
              {school.potential}
            </span>
          </div>
        </div>

        {/* Action Items */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-500">Next Action</span>
            <span className="text-xs text-gray-400">{new Date(school.lastContact).toLocaleDateString()}</span>
          </div>
          <p className="text-sm font-medium text-gray-900 truncate">{school.nextAction}</p>
        </div>

        {/* Contact & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span className="font-medium text-gray-900">{school.assignedTo}</span>
            <div className="flex items-center gap-2">
              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <Mail className="h-3 w-3" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <Phone className="h-3 w-3" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-ash-teal hover:bg-ash-teal/10 rounded-lg transition-colors">
              <CheckCircle className="h-4 w-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PipelineQuickAction: React.FC<{ 
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
        <Plus className="h-4 w-4 text-white" />
      </div>
    </button>
  );
};

const PipelineStageSummary: React.FC<{ stage: string; count: number; value: string; color: string }> = ({ 
  stage, 
  count, 
  value, 
  color 
}) => {
  const stageInfo = stageConfig[stage as keyof typeof stageConfig];
  
  return (
    <div className={`p-4 rounded-lg border-l-4 ${color} bg-white shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 capitalize">{stage.replace('_', ' ')}</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Potential</p>
          <p className="text-sm font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>{stageInfo.icon} {stageInfo.probability}% Conversion</span>
        <span className="flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{Math.round(Math.random() * 5)}%
        </span>
      </div>
    </div>
  );
};

const PipelinePage: React.FC = () => {
  const SAMPLE_COUNTRY_CODE = 'NG';

  const [activeTab, setActiveTab] = useState('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    stage: 'all',
    type: 'all',
    country: 'all',
    assignedTo: 'all'
  });

  // Real data hooks
  const { data: kpiData, loading: kpisLoading, error: kpisError } = useCountryLeadKPIs(SAMPLE_COUNTRY_CODE);
  const { data: schoolsData, loading: schoolsLoading, error: schoolsError } = useDashboardData(
    () => getCountrySchools(SAMPLE_COUNTRY_CODE),
    [SAMPLE_COUNTRY_CODE]
  );
  const { data: ambassadorsData, loading: ambassadorsLoading, error: ambassadorsError } = useCountryAmbassadors(SAMPLE_COUNTRY_CODE);
  const { data: activitiesData, loading: activitiesLoading, error: activitiesError } = useRecentActivities(6);

  // Show loading state
  if (kpisLoading || schoolsLoading || ambassadorsLoading || activitiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (kpisError || schoolsError || ambassadorsError || activitiesError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading pipeline data</p>
          <p className="text-sm text-gray-500">
            {kpisError || schoolsError || ambassadorsError || activitiesError}
          </p>
        </div>
      </div>
    );
  }

  // Generate pipeline stats from real KPI data
  const realPipelineStats = kpiData ? [
    {
      title: 'Total Schools',
      value: kpiData.schoolsVisited?.toLocaleString() || '0',
      icon: <School className="h-5 w-5 text-blue-600" />,
      trend: `Conversion: ${kpiData.conversionRate || 0}%`,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Pipeline',
      value: kpiData.activePipeline?.toLocaleString() || '0',
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      trend: `Conversion: ${kpiData.conversionRate || 0}%`,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'New Partners',
      value: kpiData.newPartners?.toLocaleString() || '0',
      icon: <CheckCircle className="h-5 w-5 text-purple-600" />,
      trend: `+${kpiData.newPartnersThisMonth || 0} this month`,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Pipeline Value',
      value: `₦${(kpiData.pipelineValue || 0).toLocaleString()}`,
      icon: <Award className="h-5 w-5 text-yellow-500" />,
      trend: 'Potential impact',
      color: 'from-yellow-400 to-orange-500'
    }
  ] : [];

  // Calculate pipeline stage summary from real schools data
  const stageSummary = (() => {
    if (!schoolsData) return [];
    const stages = ['prospect', 'contacted', 'visited', 'proposal', 'partnered'];
    return stages.map(stage => {
      const filtered = schoolsData.filter(s => (s.status || s.stage) === stage);
      const totalStudents = filtered.reduce((sum, s) => sum + (s.student_count || s.students || 0), 0);
      const avgValuePerStudent = 50000;
      return {
        stage,
        count: filtered.length,
        value: `₦${((totalStudents * avgValuePerStudent) / 1000000).toFixed(1)}M`,
        color: stageConfig[stage as keyof typeof stageConfig]?.color || 'border-gray-300'
      };
    });
  })();

  // Tabs from real data
  const tabs = [
    { id: 'pipeline', label: `Pipeline (${stageSummary.reduce((sum, s) => sum + s.count, 0)})`, icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'partners', label: `Partners (${stageSummary.find(s => s.stage === 'partnered')?.count || 0})`, icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'prospects', label: `New Prospects (${stageSummary.find(s => s.stage === 'prospect')?.count || 0})`, icon: <MapPin className="h-4 w-4" /> },
    { id: 'inactive', label: `Inactive (${schoolsData?.filter(s => (s.status || s.stage) === 'inactive').length || 0})`, icon: <AlertTriangle className="h-4 w-4" /> }
  ];

  // Ambassadors from real data
  const ambassadors = ambassadorsData ? [
    { value: 'all', label: 'All Ambassadors' },
    ...ambassadorsData.map(ambassador => ({
      value: ambassador.id,
      label: `${ambassador.full_name} (${ambassador.country_code})`
    }))
  ] : [
    { value: 'all', label: 'All Ambassadors' }
  ];

  // Filter schools
  const filteredSchools = (schoolsData ?? []).filter(school => {
    const schoolStage = school.status || school.stage;
    const matchesTab = activeTab === 'pipeline' ? ['prospect', 'contacted', 'visited', 'proposal'].includes(schoolStage) :
                        activeTab === 'partners' ? schoolStage === 'partnered' :
                        activeTab === 'prospects' ? schoolStage === 'prospect' :
                        activeTab === 'inactive' ? schoolStage === 'inactive' : true;

    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (school.contact?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filters.type === 'all' || school.type === filters.type;
    const matchesCountry = filters.country === 'all' || school.country === filters.country;
    const matchesStage = filters.stage === 'all' || schoolStage === filters.stage;
    const matchesAssigned = filters.assignedTo === 'all' || school.assignedTo === filters.assignedTo;

    return matchesTab && matchesSearch && matchesType && matchesCountry && matchesStage && matchesAssigned;
  });

  const recentActivities = activitiesData || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-ash-teal to-ash-gold rounded-xl mr-4">
              <School className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">School Pipeline</h1>
              <p className="text-lg text-gray-600 mt-1">Track schools from prospect to partnership across Africa</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export Pipeline
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ash-teal to-ash-gold text-white rounded-lg font-semibold hover:from-ash-teal/90 hover:to-ash-gold/90 transition-all shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4" />
            Add School
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {realPipelineStats.map((stat, index) => (
          <KpiCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Pipeline Stage Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stageSummary.map((summary) => (
          <PipelineStageSummary
            key={summary.stage}
            stage={summary.stage}
            count={summary.count}
            value={summary.value}
            color={`border-l-4 ${summary.color}`}
          />
        ))}
      </div>

      {/* Tabs */}
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

      {/* Search & Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search schools, locations, or contacts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ash-teal focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
              <Filter className="h-4 w-4 text-gray-500 mr-2" />
              <select
                className="bg-transparent text-sm border-none focus:outline-none"
                value={filters.stage}
                onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
              >
                <option value="all">All Stages</option>
                {Object.keys(stageConfig).map(stage => (
                  <option key={stage} value={stage}>
                    {stageConfig[stage as keyof typeof stageConfig].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
              <select
                className="bg-transparent text-sm border-none focus:outline-none"
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="all">All Types</option>
                <option value="public">Public Schools</option>
                <option value="private">Private Schools</option>
                <option value="university">Universities</option>
                <option value="polytechnic">Polytechnics</option>
                <option value="secondary">Secondary Schools</option>
              </select>
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
              <select
                className="bg-transparent text-sm border-none focus:outline-none"
                value={filters.country}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              >
                <option value="all">All Countries</option>
                <option value="NG">Nigeria 🇳🇬</option>
                <option value="GH">Ghana 🇬🇭</option>
                <option value="KE">Kenya 🇰🇪</option>
                <option value="ZA">South Africa 🇿🇦</option>
                <option value="UG">Uganda 🇺🇬</option>
                <option value="EG">Egypt 🇪🇬</option>
              </select>
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
              <select
                className="bg-transparent text-sm border-none focus:outline-none"
                value={filters.assignedTo}
                onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
              >
                {ambassadors.map(ambassador => (
                  <option key={ambassador.value} value={ambassador.value}>{ambassador.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="space-y-6">
        {filteredSchools.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSchools.slice(0, 6).map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onClick={() => console.log('View school:', school.name)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-ash-teal text-white rounded-lg font-medium hover:bg-ash-teal/90 transition-colors mx-auto">
              <Plus className="h-4 w-4" />
              Add Your First School
            </button>
          </div>
        )}
        {filteredSchools.length > 6 && (
          <div className="text-center">
            <button className="text-ash-teal hover:text-ash-teal/80 font-medium text-sm flex items-center justify-center gap-1 mx-auto">
              Load More Schools
              <TrendingUp className="h-4 w-4" />
            </button>
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
        <ActivityFeed
          title="Recent Activity"
          activities={recentActivities}
          maxItems={6}
        />
      </div>
    </div>
  );
};

export default PipelinePage;