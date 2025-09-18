import React, { useState } from 'react';
import { 
  AlertTriangle, 
  User, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Shield,
  Zap,
  Award,
  Building
} from 'lucide-react';
import { DataTable } from '../../ui/widgets/DataTable';
import { ActivityFeed } from '../../ui/widgets/ActivityFeed';
import { KpiCard } from '../../ui/widgets/KpiCard';

// Types
interface Escalation {
  id: string;
  ticketId: string;
  category: 'scholarship' | 'compliance' | 'technical' | 'ambassador' | 'partner' | 'system';
  subCategory: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in-progress' | 'escalated' | 'resolved' | 'closed';
  title: string;
  description: string;
  ambassador: {
    name: string;
    email: string;
    country: string;
    flag: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  assignedTo?: string;
  resolutionNotes?: string;
  attachments?: string[];
  impact: 'single-student' | 'multiple-students' | 'regional' | 'national' | 'system-wide';
}

interface EscalationStat {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}

// Mock Data
const escalationStats: EscalationStat[] = [
  {
    title: 'Open Escalations',
    value: '23',
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    trend: '+4 this week',
    color: 'from-red-400 to-red-600'
  },
  {
    title: 'Avg Resolution Time',
    value: '2.3 days',
    icon: <Clock className="h-5 w-5 text-yellow-600" />,
    trend: 'Target: 48hrs',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    title: 'Satisfaction Rate',
    value: '92%',
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    trend: '+3% from last month',
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Critical Issues',
    value: '2',
    icon: <Shield className="h-5 w-5 text-purple-600" />,
    trend: '0 new today',
    color: 'from-purple-500 to-pink-500'
  }
];

const escalationsData: Escalation[] = [
  {
    id: '1',
    ticketId: '#ESC-001',
    category: 'scholarship',
    subCategory: 'Payment Delay',
    priority: 'critical',
    status: 'escalated',
    title: 'Scholarship payment delayed for 45 STEM recipients',
    description: 'Bank transfer issue affecting Q4 disbursements for Lagos STEM Excellence program. Students facing tuition deadlines.',
    ambassador: {
      name: 'Aisha Bello',
      email: 'aisha@afroscholarhub.org',
      country: 'Nigeria',
      flag: '🇳🇬',
      phone: '+234 801 234 5678'
    },
    createdAt: '2024-12-15T09:30:00Z',
    updatedAt: '2024-12-16T14:22:00Z',
    dueDate: '2024-12-17T18:00:00Z',
    assignedTo: 'Fatima Ahmed - Finance',
    impact: 'regional'
  },
  {
    id: '2',
    ticketId: '#ESC-002',
    category: 'compliance',
    subCategory: 'Documentation',
    priority: 'high',
    status: 'in-progress',
    title: 'Missing KYC documents for 23 Ghana scholars',
    description: 'Regulatory compliance issue - students cannot receive funding without complete documentation. Risk of program suspension.',
    ambassador: {
      name: 'Kwame Mensah',
      email: 'kwame@afroscholarhub.org',
      country: 'Ghana',
      flag: '🇬🇭'
    },
    createdAt: '2024-12-14T16:45:00Z',
    updatedAt: '2024-12-16T10:15:00Z',
    dueDate: '2024-12-18T12:00:00Z',
    assignedTo: 'Legal Team',
    impact: 'multiple-students'
  },
  {
    id: '3',
    ticketId: '#ESC-003',
    category: 'technical',
    subCategory: 'Portal Access',
    priority: 'medium',
    status: 'new',
    title: 'Application portal down in East Africa',
    description: 'Technical outage affecting Kenya, Uganda, and Tanzania. 156 students unable to submit applications before deadline.',
    ambassador: {
      name: 'James Otieno',
      email: 'james@afroscholarhub.org',
      country: 'Kenya',
      flag: '🇰🇪'
    },
    createdAt: '2024-12-16T08:20:00Z',
    updatedAt: '2024-12-16T08:20:00Z',
    impact: 'regional'
  },
  {
    id: '4',
    ticketId: '#ESC-004',
    category: 'ambassador',
    subCategory: 'Performance',
    priority: 'low',
    status: 'resolved',
    title: 'Ambassador training completion issue',
    description: 'Lagos team members unable to access final certification module. Resolved by IT support.',
    ambassador: {
      name: 'Chidi Okonkwo',
      email: 'chidi@afroscholarhub.org',
      country: 'Nigeria',
      flag: '🇳🇬'
    },
    createdAt: '2024-12-12T11:10:00Z',
    updatedAt: '2024-12-15T09:45:00Z',
    resolutionNotes: 'Module access restored. All 12 ambassadors certified.',
    impact: 'single-student'
  },
  {
    id: '5',
    ticketId: '#ESC-005',
    category: 'partner',
    subCategory: 'Funding',
    priority: 'high',
    status: 'in-progress',
    title: 'MTN Foundation funding shortfall',
    description: 'Partner reduced Q4 contribution by 35% due to budget cuts. Need to find alternative funding for 67 scholarships.',
    ambassador: {
      name: 'National Director',
      email: 'director@afroscholarhub.org',
      country: 'Nigeria',
      flag: '🇳🇬'
    },
    createdAt: '2024-12-13T14:30:00Z',
    updatedAt: '2024-12-16T11:00:00Z',
    dueDate: '2024-12-20T12:00:00Z',
    assignedTo: 'Partnerships Team',
    impact: 'national'
  },
  {
    id: '6',
    ticketId: '#ESC-006',
    category: 'system',
    subCategory: 'Reporting',
    priority: 'medium',
    status: 'closed',
    title: 'Q3 impact report generation error',
    description: 'Automated reporting system failed to generate country-level impact metrics. Manual report created as workaround.',
    ambassador: {
      name: 'Data Team',
      email: 'data@afroscholarhub.org',
      country: 'Pan-Africa',
      flag: '🌍'
    },
    createdAt: '2024-12-10T09:15:00Z',
    updatedAt: '2024-12-14T16:30:00Z',
    resolutionNotes: 'Bug fixed in reporting module v2.3.1',
    impact: 'system-wide'
  }
];

// Category configurations
const categoryConfig = {
  scholarship: { 
    color: 'text-orange-600 bg-orange-50 border-orange-200', 
    icon: <Award className="h-4 w-4" /> 
  },
  compliance: { 
    color: 'text-red-600 bg-red-50 border-red-200', 
    icon: <Shield className="h-4 w-4" /> 
  },
  technical: { 
    color: 'text-blue-600 bg-blue-50 border-blue-200', 
    icon: <Zap className="h-4 w-4" /> 
  },
  ambassador: { 
    color: 'text-green-600 bg-green-50 border-green-200', 
    icon: <User className="h-4 w-4" /> 
  },
  partner: { 
    color: 'text-purple-600 bg-purple-50 border-purple-200', 
    icon: <Building className="h-4 w-4" /> 
  },
  system: { 
    color: 'text-gray-600 bg-gray-50 border-gray-200', 
    icon: <TrendingUp className="h-4 w-4" /> 
  }
};

// Priority colors
const priorityConfig = {
  low: { color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  medium: { color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  high: { color: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  critical: { color: 'bg-red-100 text-red-800', dot: 'bg-red-500' }
};

// Status colors
const statusConfig = {
  new: { color: 'bg-gray-100 text-gray-800', label: 'New' },
  'in-progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
  escalated: { color: 'bg-yellow-100 text-yellow-800', label: 'Escalated' },
  resolved: { color: 'bg-green-100 text-green-800', label: 'Resolved' },
  closed: { color: 'bg-gray-200 text-gray-600', label: 'Closed' }
};

// Impact levels
const impactConfig = {
  'single-student': { label: 'Single Student', color: 'text-gray-600' },
  'multiple-students': { label: 'Multiple Students', color: 'text-blue-600' },
  regional: { label: 'Regional', color: 'text-purple-600' },
  national: { label: 'National', color: 'text-orange-600' },
  'system-wide': { label: 'System-wide', color: 'text-red-600' }
};

// Components
const EscalationCard: React.FC<{ escalation: Escalation; onClick: () => void }> = ({ escalation, onClick }) => {
  const category = categoryConfig[escalation.category];
  const priority = priorityConfig[escalation.priority];
  const status = statusConfig[escalation.status];
  const impact = impactConfig[escalation.impact];
  
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`;
  };

  const isOverdue = escalation.dueDate && new Date(escalation.dueDate) < new Date();

  return (
    <div 
      className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Priority Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${priority.color}`}>
          <div className={`w-2 h-2 rounded-full ${priority.dot}`} />
          {escalation.priority.toUpperCase()}
        </span>
      </div>

      {/* Category Label */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
          {category.icon}
          {escalation.category.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Overdue Warning */}
      {isOverdue && (
        <div className="absolute top-12 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="h-3 w-3" />
            Overdue
          </span>
        </div>
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-ash-teal transition-colors">
              {escalation.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="flex items-center">
                <span className="flex items-center mr-4">
                  <User className="h-3 w-3 mr-1" />
                  {escalation.ambassador.name}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">{escalation.ambassador.flag}</span>
                  <span className="truncate">{escalation.ambassador.country}</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-gray-600">
              <Clock className="h-3 w-3" />
              {timeAgo(escalation.updatedAt)}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
          {escalation.dueDate && (
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>Due: {new Date(escalation.dueDate).toLocaleDateString()}</span>
              {escalation.assignedTo && (
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full" />
                  {escalation.assignedTo}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Impact & Description */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className={`font-medium ${impact.color}`}>{impact.label}</span>
            <span className="text-xs text-gray-500">#{escalation.ticketId}</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{escalation.description}</p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <button className="flex items-center gap-1 hover:text-ash-teal transition-colors">
              <Mail className="h-3 w-3" />
              <span>{escalation.ambassador.email}</span>
            </button>
            {escalation.ambassador.phone && (
              <button className="flex items-center gap-1 hover:text-ash-teal transition-colors">
                <Phone className="h-3 w-3" />
                <span className="truncate">{escalation.ambassador.phone}</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageSquare className="h-4 w-4" />
            </button>
            {escalation.attachments && escalation.attachments.length > 0 && (
              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                <span className="sr-only">{escalation.attachments.length} attachments</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EscalationQuickAction: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick: () => void; 
  color?: string;
  badge?: string;
}> = ({ icon, title, description, onClick, color = 'from-ash-teal to-ash-gold', badge }) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
      
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            {badge}
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

const EscalationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    status: 'all',
    country: 'all'
  });

  const tabs = [
    { id: 'open', label: 'Open (12)', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'in-progress', label: 'In Progress (7)', icon: <Clock className="h-4 w-4" /> },
    { id: 'critical', label: 'Critical (2)', icon: <Shield className="h-4 w-4" /> },
    { id: 'resolved', label: 'Resolved (45)', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'all', label: 'All (67)', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'scholarship', label: 'Scholarship Issues' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'technical', label: 'Technical' },
    { value: 'ambassador', label: 'Ambassador' },
    { value: 'partner', label: 'Partners' },
    { value: 'system', label: 'System' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const countries = [
    { value: 'all', label: 'All Countries' },
    { value: 'NG', label: 'Nigeria 🇳🇬' },
    { value: 'GH', label: 'Ghana 🇬🇭' },
    { value: 'KE', label: 'Kenya 🇰🇪' },
    { value: 'ZA', label: 'South Africa 🇿🇦' },
    { value: 'multi', label: 'Multi-country 🌍' }
  ];

  // Filter escalations
  const filteredEscalations = escalationsData.filter(escalation => {
    const matchesTab = activeTab === 'open' ? ['new', 'in-progress', 'escalated'].includes(escalation.status) :
                      activeTab === 'critical' ? escalation.priority === 'critical' :
                      activeTab === 'resolved' ? ['resolved', 'closed'].includes(escalation.status) :
                      activeTab === 'in-progress' ? escalation.status === 'in-progress' : true;
    
    const matchesSearch = escalation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         escalation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         escalation.ambassador.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || escalation.category === filters.category;
    const matchesPriority = filters.priority === 'all' || escalation.priority === filters.priority;
    const matchesStatus = filters.status === 'all' || escalation.status === filters.status;
    const matchesCountry = filters.country === 'all' || 
                          escalation.ambassador.country === filters.country ||
                          (filters.country === 'multi' && escalation.ambassador.country === 'Pan-Africa');
    
    return matchesTab && matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesCountry;
  });

  // Recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'assignment',
      title: 'Payment delay assigned to Finance',
      description: 'Critical scholarship payment issue escalated to Fatima Ahmed',
      timestamp: '30 minutes ago',
      user: { name: 'Escalation System' },
      icon: <Shield className="h-4 w-4 text-red-600" />
    },
    {
      id: '2',
      type: 'update',
      title: 'KYC documentation progress',
      description: '15/23 documents received from Ghana team',
      timestamp: '2 hours ago',
      user: { name: 'Legal Team' },
      icon: <CheckCircle className="h-4 w-4 text-green-600" />
    },
    {
      id: '3',
      type: 'resolution',
      title: 'Portal outage resolved',
      description: 'East Africa application system back online',
      timestamp: '4 hours ago',
      user: { name: 'IT Support' },
      icon: <Zap className="h-4 w-4 text-blue-600" />
    },
    {
      id: '4',
      type: 'escalation',
      title: 'MTN funding issue escalated',
      description: 'National Director flagged partner funding shortfall',
      timestamp: 'Yesterday 11:30 AM',
      user: { name: 'National Director' },
      icon: <AlertTriangle className="h-4 w-4 text-orange-600" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl mr-4">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Escalations Management</h1>
              <p className="text-lg text-gray-600 mt-1">Handle critical issues escalated from ambassadors to management</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export Report
          </button>
          
          {/* Create Escalation Button */}
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4" />
            New Escalation
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {escalationStats.map((stat, index) => (
          <KpiCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            color={stat.color}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EscalationQuickAction
          icon={<Award className="h-5 w-5 text-white" />}
          title="Scholarship Issues"
          description="Payment delays, eligibility disputes, funding gaps"
          onClick={() => console.log('Filter scholarship issues')}
          color="from-orange-500 to-red-500"
          badge="12 Open"
        />
        <EscalationQuickAction
          icon={<Shield className="h-5 w-5 text-white" />}
          title="Compliance Alerts"
          description="KYC, regulatory, documentation requirements"
          onClick={() => console.log('Filter compliance issues')}
          color="from-red-500 to-pink-500"
          badge="5 Open"
        />
        <EscalationQuickAction
          icon={<Zap className="h-5 w-5 text-white" />}
          title="Technical Support"
          description="Portal outages, system errors, access issues"
          onClick={() => console.log('Filter technical issues')}
          color="from-blue-500 to-cyan-500"
          badge="3 Open"
        />
        <EscalationQuickAction
          icon={<User className="h-5 w-5 text-white" />}
          title="Ambassador Support"
          description="Training, performance, regional challenges"
          onClick={() => console.log('Filter ambassador issues')}
          color="from-green-500 to-emerald-500"
          badge="2 Open"
        />
        <EscalationQuickAction
          icon={<Building className="h-5 w-5 text-white" />}
          title="Partner Relations"
          description="Funding commitments, contract disputes"
          onClick={() => console.log('Filter partner issues')}
          color="from-purple-500 to-violet-500"
          badge="1 Open"
        />
        <EscalationQuickAction
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          title="System Operations"
          description="Reporting, analytics, infrastructure issues"
          onClick={() => console.log('Filter system issues')}
          color="from-gray-500 to-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Escalations List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-500 text-white shadow-sm'
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
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search escalations, ambassadors, or descriptions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    {priorities.map(prio => (
                      <option key={prio.value} value={prio.value}>{prio.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                  >
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>{country.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Escalations Grid */}
          <div className="space-y-6">
            {filteredEscalations.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredEscalations.slice(0, 8).map((escalation) => (
                  <EscalationCard 
                    key={escalation.id} 
                    escalation={escalation} 
                    onClick={() => console.log('View escalation:', escalation.ticketId)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No escalations found</h3>
                <p className="text-gray-500 mb-6">All issues are currently resolved or try adjusting your filters</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors mx-auto">
                  <Plus className="h-4 w-4" />
                  Create New Escalation
                </button>
              </div>
            )}
            
            {filteredEscalations.length > 8 && (
              <div className="text-center">
                <button className="text-red-500 hover:text-red-600 font-medium text-sm flex items-center justify-center gap-1 mx-auto">
                  Load More Escalations
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
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

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 md:hidden">
        <Plus className="h-6 w-6" />
      </div>
    </div>
  );
};

export default EscalationsPage;