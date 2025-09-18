import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Award, 
  TrendingUp, 
  Star, 
  Calendar, 
  Phone, 
  Mail, 
  Download, 
  Filter, 
  Search, 
  Plus, 
  Shield,
  Zap,
  GraduationCap,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { DataTable } from '../../../ui/widgets/DataTable';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { BarChart } from '../../../ui/widgets/BarChart';
import { PieChart } from '../../../ui/widgets/PieChart';
import { LineChart } from '../../../ui/widgets/LineChart';

// Types
interface Ambassador {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  flag: string;
  region: string;
  role: 'lead' | 'coordinator' | 'field' | 'trainee';
  status: 'active' | 'inactive' | 'training' | 'on-leave';
  joinDate: string;
  lastActivity: string;
  performanceScore: number;
  certifications: number;
  schoolsReached: number;
  scholarshipsGenerated: number;
  leadsGenerated: number;
  conversionRate: number;
  avgResponseTime: string;
  trainingCompletion: number;
  satisfactionRating: number;
  assignedRegion: string;
  contact: {
    email: string;
    phone: string;
  };
  profilePicture?: string;
  bio?: string;
}

interface AmbassadorMetric {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
}

// Mock Data
const ambassadorMetrics: AmbassadorMetric[] = [
  {
    title: 'Total Ambassadors',
    value: '1,247',
    trend: '+12% QoQ',
    icon: <Users className="h-5 w-5 text-blue-600" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Active Ambassadors',
    value: '1,156',
    trend: '93% active',
    icon: <TrendingUp className="h-5 w-5 text-green-600" />,
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: 'Top Performers',
    value: '89',
    trend: 'Top 7%',
    icon: <Award className="h-5 w-5 text-yellow-500" />,
    color: 'from-yellow-400 to-orange-500'
  },
  {
    title: 'Training Completion',
    value: '94%',
    trend: 'Target: 90%',
    icon: <GraduationCap className="h-5 w-5 text-purple-600" />,
    color: 'from-purple-500 to-violet-600'
  },
  {
    title: 'Avg Response Time',
    value: '2.1h',
    trend: 'Target: 4h',
    icon: <Clock className="h-5 w-5 text-indigo-600" />,
    color: 'from-indigo-500 to-cyan-600'
  },
  {
    title: 'Satisfaction Score',
    value: '4.7/5',
    trend: '+0.2 from last quarter',
    icon: <Star className="h-5 w-5 text-amber-500" />,
    color: 'from-amber-500 to-orange-600'
  }
];

const ambassadorsData: Ambassador[] = [
  {
    id: '1',
    name: 'Aisha Bello',
    email: 'aisha.bello@afroscholarhub.org',
    phone: '+234 801 234 5678',
    country: 'Nigeria',
    flag: '🇳🇬',
    region: 'Lagos & West',
    role: 'lead',
    status: 'active',
    joinDate: '2023-03-15',
    lastActivity: '2 hours ago',
    performanceScore: 94,
    certifications: 5,
    schoolsReached: 23,
    scholarshipsGenerated: 45,
    leadsGenerated: 156,
    conversionRate: 29,
    avgResponseTime: '1.8h',
    trainingCompletion: 100,
    satisfactionRating: 4.9,
    assignedRegion: 'Lagos State',
    contact: {
      email: 'aisha.bello@afroscholarhub.org',
      phone: '+234 801 234 5678'
    },
    bio: 'Lead Ambassador for Nigeria operations with 5+ years in educational outreach'
  },
  {
    id: '2',
    name: 'Kwame Mensah',
    email: 'kwame.mensah@afroscholarhub.org',
    phone: '+233 302 123 456',
    country: 'Ghana',
    flag: '🇬🇭',
    region: 'Greater Accra',
    role: 'coordinator',
    status: 'active',
    joinDate: '2023-06-22',
    lastActivity: '5 hours ago',
    performanceScore: 88,
    certifications: 4,
    schoolsReached: 18,
    scholarshipsGenerated: 32,
    leadsGenerated: 123,
    conversionRate: 26,
    avgResponseTime: '2.3h',
    trainingCompletion: 95,
    satisfactionRating: 4.6,
    assignedRegion: 'Accra Metropolitan',
    contact: {
      email: 'kwame.mensah@afroscholarhub.org',
      phone: '+233 302 123 456'
    },
    bio: 'Engineering graduate passionate about STEM education in rural Ghana'
  },
  {
    id: '3',
    name: 'Fatima Ali',
    email: 'fatima.ali@afroscholarhub.org',
    phone: '+254 711 234 567',
    country: 'Kenya',
    flag: '🇰🇪',
    region: 'Nairobi',
    role: 'field',
    status: 'active',
    joinDate: '2023-09-10',
    lastActivity: '1 day ago',
    performanceScore: 76,
    certifications: 3,
    schoolsReached: 12,
    scholarshipsGenerated: 18,
    leadsGenerated: 89,
    conversionRate: 20,
    avgResponseTime: '3.1h',
    trainingCompletion: 85,
    satisfactionRating: 4.4,
    assignedRegion: 'Nairobi County',
    contact: {
      email: 'fatima.ali@afroscholarhub.org',
      phone: '+254 711 234 567'
    },
    bio: 'Women in Tech advocate focusing on STEM scholarships for girls'
  },
  {
    id: '4',
    name: 'Thabo Mthembu',
    email: 'thabo.mthembu@afroscholarhub.org',
    phone: '+27 82 345 6789',
    country: 'South Africa',
    flag: '🇿🇦',
    region: 'Gauteng',
    role: 'lead',
    status: 'active',
    joinDate: '2022-11-05',
    lastActivity: '3 hours ago',
    performanceScore: 91,
    certifications: 6,
    schoolsReached: 27,
    scholarshipsGenerated: 56,
    leadsGenerated: 201,
    conversionRate: 28,
    avgResponseTime: '1.5h',
    trainingCompletion: 100,
    satisfactionRating: 4.8,
    assignedRegion: 'Johannesburg',
    contact: {
      email: 'thabo.mthembu@afroscholarhub.org',
      phone: '+27 82 345 6789'
    },
    bio: 'Regional Lead with expertise in corporate partnerships and funding'
  },
  {
    id: '5',
    name: 'Sarah Nakato',
    email: 'sarah.nakato@afroscholarhub.org',
    phone: '+256 772 456 789',
    country: 'Uganda',
    flag: '🇺🇬',
    region: 'Central',
    role: 'trainee',
    status: 'training',
    joinDate: '2024-01-20',
    lastActivity: '6 hours ago',
    performanceScore: 67,
    certifications: 2,
    schoolsReached: 5,
    scholarshipsGenerated: 8,
    leadsGenerated: 34,
    conversionRate: 24,
    avgResponseTime: '4.2h',
    trainingCompletion: 65,
    satisfactionRating: 4.2,
    assignedRegion: 'Kampala',
    contact: {
      email: 'sarah.nakato@afroscholarhub.org',
      phone: '+256 772 456 789'
    },
    bio: 'Recent graduate currently completing ambassador training program'
  },
  {
    id: '6',
    name: 'Jamal Ibrahim',
    email: 'jamal.ibrahim@afroscholarhub.org',
    phone: '+20 100 123 4567',
    country: 'Egypt',
    flag: '🇪🇬',
    region: 'Cairo',
    role: 'coordinator',
    status: 'inactive',
    joinDate: '2023-04-12',
    lastActivity: '15 days ago',
    performanceScore: 54,
    certifications: 3,
    schoolsReached: 8,
    scholarshipsGenerated: 12,
    leadsGenerated: 45,
    conversionRate: 27,
    avgResponseTime: '5.8h',
    trainingCompletion: 80,
    satisfactionRating: 3.8,
    assignedRegion: 'Cairo Governorate',
    contact: {
      email: 'jamal.ibrahim@afroscholarhub.org',
      phone: '+20 100 123 4567'
    },
    bio: 'Currently on academic leave - returning January 2025'
  }
];

// Chart Data
const performanceByCountryData = {
  labels: ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Uganda', 'Egypt'],
  datasets: [{
    label: 'Performance Score',
    data: [94, 88, 76, 91, 67, 54],
    backgroundColor: 'rgba(26, 95, 122, 0.8)'
  }, {
    label: 'Scholarships Generated',
    data: [45, 32, 18, 56, 8, 12],
    backgroundColor: 'rgba(244, 196, 48, 0.8)'
  }]
};

const roleDistributionData = {
  labels: ['Lead', 'Coordinator', 'Field', 'Trainee'],
  datasets: [{
    data: [12, 34, 56, 18],
    backgroundColor: [
      'rgba(26, 95, 122, 0.8)',
      'rgba(244, 196, 48, 0.8)',
      'rgba(38, 162, 105, 0.8)',
      'rgba(147, 51, 234, 0.8)'
    ]
  }]
};

const activityTrendsData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Active Ambassadors',
      data: [856, 912, 945, 1012],
      borderColor: 'rgb(26, 95, 122)',
      backgroundColor: 'rgba(26, 95, 122, 0.1)',
      tension: 0.4
    },
    {
      label: 'Scholarships Generated',
      data: [23, 31, 38, 45],
      borderColor: 'rgb(244, 196, 48)',
      backgroundColor: 'rgba(244, 196, 48, 0.1)',
      tension: 0.4,
      yAxisID: 'y1'
    }
  ]
};

// Configuration
const statusConfig = {
  active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
  inactive: { color: 'bg-gray-100 text-gray-700', icon: <Clock className="h-4 w-4" /> },
  training: { color: 'bg-yellow-100 text-yellow-800', icon: <GraduationCap className="h-4 w-4" /> },
  'on-leave': { color: 'bg-orange-100 text-orange-800', icon: <AlertCircle className="h-4 w-4" /> }
};

const roleConfig = {
  lead: { color: 'bg-blue-100 text-blue-800', label: 'Lead Ambassador' },
  coordinator: { color: 'bg-purple-100 text-purple-800', label: 'Coordinator' },
  field: { color: 'bg-green-100 text-green-800', label: 'Field Ambassador' },
  trainee: { color: 'bg-yellow-100 text-yellow-800', label: 'Trainee' }
};

// Components
const AmbassadorCard: React.FC<{ ambassador: Ambassador; onClick: () => void }> = ({ ambassador, onClick }) => {
  const status = statusConfig[ambassador.status];
  const role = roleConfig[ambassador.role];
  const performanceColor = ambassador.performanceScore >= 90 ? 'text-green-600' : 
                         ambassador.performanceScore >= 75 ? 'text-yellow-600' : 'text-red-600';

  const getStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-3 w-3 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && <Star className="h-3 w-3 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div 
      className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
          {status.icon}
          {ambassador.status}
        </span>
      </div>

      {/* Role Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
          {role.label}
        </span>
      </div>

      {/* Performance Badge */}
      {ambassador.performanceScore >= 90 && (
        <div className="absolute top-12 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Star className="h-3 w-3 fill-current" />
            Top Performer
          </span>
        </div>
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-ash-teal transition-colors">
              {ambassador.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="flex items-center">
                <span className="mr-1">{ambassador.flag}</span>
                <span className="truncate">{ambassador.country}</span>
              </span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {ambassador.region}
              </span>
            </div>
            {ambassador.bio && (
              <p className="text-sm text-gray-600 line-clamp-1">{ambassador.bio}</p>
            )}
          </div>
          
          {/* Profile Picture */}
          <div className="flex-shrink-0 ml-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-ash-teal to-ash-gold flex items-center justify-center text-white font-semibold text-sm`}>
              {ambassador.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Performance</p>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                <div 
                  className={`h-2 rounded-full ${performanceColor}`} 
                  style={{ width: `${ambassador.performanceScore}%` }}
                />
              </div>
              <span className={`text-sm font-semibold ${performanceColor}`}>
                {ambassador.performanceScore}%
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Scholarships</p>
            <p className="text-lg font-bold text-gray-900">{ambassador.scholarshipsGenerated}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Schools Reached</p>
            <p className="text-lg font-bold text-gray-900">{ambassador.schoolsReached}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Conversion</p>
            <p className={`text-sm font-semibold ${ambassador.conversionRate >= 25 ? 'text-green-600' : 'text-yellow-600'}`}>
              {ambassador.conversionRate}%
            </p>
          </div>
        </div>

        {/* Activity & Training */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-500">Training Completion</span>
              <span className="text-xs text-gray-400">{ambassador.lastActivity}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-ash-teal to-ash-gold h-2 rounded-full" 
                style={{ width: `${ambassador.trainingCompletion}%` }}
              />
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Satisfaction</p>
            {getStars(ambassador.satisfactionRating)}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span className="font-medium text-gray-900">{ambassador.role}</span>
            <div className="flex items-center gap-2">
              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                <Mail className="h-3 w-3" />
              </button>
              {ambassador.phone && (
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                  <Phone className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-ash-teal hover:bg-ash-teal/10 rounded-lg transition-colors">
              <MessageSquare className="h-4 w-4" />
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

const AmbassadorQuickAction: React.FC<{ 
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

const PerformanceSummary: React.FC<{ 
  title: string; 
  score: number; 
  target: number; 
  color: string;
  icon: React.ReactNode;
}> = ({ title, score, target, color, icon }) => {
  const percentage = ((score / target) * 100).toFixed(1);
  const isAboveTarget = score >= target;
  
  return (
    <div className={`p-4 rounded-lg border-l-4 ${color} bg-white shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${color} mr-3 flex-shrink-0`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className={`text-2xl font-bold ${isAboveTarget ? 'text-green-600' : 'text-red-600'}`}>
              {score}
            </p>
          </div>
        </div>
        <span className={`text-sm font-semibold ${isAboveTarget ? 'text-green-600' : 'text-red-600'}`}>
          {isAboveTarget ? '+' : ''}{percentage}%
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Target: {target}</span>
        <span className="flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          {isAboveTarget ? 'Above' : 'Below'} target
        </span>
      </div>
    </div>
  );
};

const AmbassadorsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: 'all',
    role: 'all',
    status: 'all',
    region: 'all',
    performance: 'all'
  });

  const tabs = [
    { id: 'directory', label: 'Directory (1,247)', icon: <Users className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'performance', label: 'Performance (156)', icon: <Award className="h-4 w-4" /> },
    { id: 'training', label: 'Training (89)', icon: <GraduationCap className="h-4 w-4" /> }
  ];

  const countries = [
    { value: 'all', label: 'All Countries' },
    { value: 'NG', label: 'Nigeria 🇳🇬' },
    { value: 'GH', label: 'Ghana 🇬🇭' },
    { value: 'KE', label: 'Kenya 🇰🇪' },
    { value: 'ZA', label: 'South Africa 🇿🇦' },
    { value: 'UG', label: 'Uganda 🇺🇬' },
    { value: 'EG', label: 'Egypt 🇪🇬' }
  ];

  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'lead', label: 'Lead Ambassadors' },
    { value: 'coordinator', label: 'Coordinators' },
    { value: 'field', label: 'Field Ambassadors' },
    { value: 'trainee', label: 'Trainees' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'training', label: 'Training' },
    { value: 'on-leave', label: 'On Leave' }
  ];

  // Filter ambassadors
  const filteredAmbassadors = ambassadorsData.filter(ambassador => {
    const matchesSearch = ambassador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambassador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambassador.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambassador.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = filters.country === 'all' || ambassador.country === filters.country;
    const matchesRole = filters.role === 'all' || ambassador.role === filters.role;
    const matchesStatus = filters.status === 'all' || ambassador.status === filters.status;
    const matchesPerformance = filters.performance === 'all' || 
                              (filters.performance === 'top' && ambassador.performanceScore >= 90) ||
                              (filters.performance === 'good' && ambassador.performanceScore >= 75);
    
    return matchesSearch && matchesCountry && matchesRole && matchesStatus && matchesPerformance;
  });

  // Recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'certification',
      title: 'Aisha Bello Certified',
      description: 'Completed Advanced Scholarship Management course',
      timestamp: '2 hours ago',
      user: { name: 'Aisha Bello' },
      icon: <GraduationCap className="h-4 w-4 text-purple-600" />
    },
    {
      id: '2',
      type: 'performance',
      title: 'Monthly Top Performer',
      description: 'Thabo Mthembu recognized for outstanding Q4 results',
      timestamp: '1 day ago',
      user: { name: 'Thabo Mthembu' },
      icon: <Award className="h-4 w-4 text-yellow-500" />
    },
    {
      id: '3',
      type: 'training',
      title: 'New Ambassador Onboarded',
      description: 'Sarah Nakato joined Uganda operations team',
      timestamp: '3 days ago',
      user: { name: 'Sarah Nakato' },
      icon: <Users className="h-4 w-4 text-blue-600" />
    },
    {
      id: '4',
      type: 'feedback',
      title: 'Satisfaction Survey',
      description: '94% ambassador satisfaction rate achieved',
      timestamp: '5 days ago',
      user: { name: 'HR Team' },
      icon: <Star className="h-4 w-4 text-amber-500" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-ash-teal to-ash-gold rounded-xl mr-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ambassador Directory</h1>
              <p className="text-lg text-gray-600 mt-1">Manage and analyze your ambassador network across Africa</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export Directory
          </button>
          
          {/* Add Ambassador Button */}
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ash-teal to-ash-gold text-white rounded-lg font-semibold hover:from-ash-teal/90 hover:to-ash-gold/90 transition-all shadow-lg hover:shadow-xl">
            <Plus className="h-4 w-4" />
            Add Ambassador
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
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ambassadorMetrics.map((metric, index) => (
              <KpiCard 
                key={index}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                trend={metric.trend}
                color={metric.color}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AmbassadorQuickAction
              icon={<Users className="h-5 w-5 text-white" />}
              title="New Ambassador"
              description="Onboard new team members"
              onClick={() => console.log('Add new ambassador')}
              color="from-blue-500 to-blue-600"
            />
            <AmbassadorQuickAction
              icon={<Award className="h-5 w-5 text-white" />}
              title="Top Performers"
              description="Recognize outstanding ambassadors"
              count={12}
              onClick={() => console.log('View top performers')}
              color="from-yellow-400 to-orange-500"
            />
            <AmbassadorQuickAction
              icon={<GraduationCap className="h-5 w-5 text-white" />}
              title="Training Needs"
              description="Identify training gaps"
              count={23}
              onClick={() => console.log('View training needs')}
              color="from-purple-500 to-violet-600"
            />
            <AmbassadorQuickAction
              icon={<Shield className="h-5 w-5 text-white" />}
              title="Compliance Check"
              description="Review certification status"
              count={5}
              onClick={() => console.log('Check compliance')}
              color="from-red-500 to-pink-500"
            />
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search ambassadors by name, country, or region..."
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
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                  >
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>{country.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.role}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.performance}
                    onChange={(e) => setFilters(prev => ({ ...prev, performance: e.target.value }))}
                  >
                    <option value="all">All Performance</option>
                    <option value="top">Top Performers (90+)</option>
                    <option value="good">Good (75-89)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Ambassadors Grid */}
          <div className="space-y-6">
            {filteredAmbassadors.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAmbassadors.slice(0, 6).map((ambassador) => (
                  <AmbassadorCard 
                    key={ambassador.id}
                    ambassador={ambassador}
                    onClick={() => console.log('View ambassador:', ambassador.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ambassadors found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-ash-teal text-white rounded-lg font-medium hover:bg-ash-teal/90 transition-colors mx-auto">
                  <Plus className="h-4 w-4" />
                  Add Your First Ambassador
                </button>
              </div>
            )}
            
            {filteredAmbassadors.length > 6 && (
              <div className="text-center">
                <button className="text-ash-teal hover:text-ash-teal/80 font-medium text-sm flex items-center justify-center gap-1 mx-auto">
                  Load More Ambassadors
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Table View Alternative */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Ambassadors Table View</h3>
              <button className="text-sm text-ash-teal hover:text-ash-teal/80 font-medium">
                Switch to Cards →
              </button>
            </div>
            <DataTable 
              columns={[
                { 
                  header: 'Ambassador', 
                  accessor: (row: Ambassador) => (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ash-teal to-ash-gold flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {row.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{row.name}</div>
                        <div className="text-xs text-gray-500 truncate">{row.email}</div>
                      </div>
                    </div>
                  )
                },
                { 
                  header: 'Country', 
                  accessor: (row: Ambassador) => (
                    <div className="flex items-center">
                      <span className="mr-2">{row.flag}</span>
                      <span className="text-sm font-medium">{row.country}</span>
                    </div>
                  )
                },
                { 
                  header: 'Role', 
                  accessor: (row: Ambassador) => (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleConfig[row.role].color}`}>
                      {roleConfig[row.role].label}
                    </span>
                  )
                },
                { 
                  header: 'Performance', 
                  accessor: (row: Ambassador) => (
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-gradient-to-r from-ash-teal to-ash-gold h-2 rounded-full" 
                          style={{ width: `${row.performanceScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{row.performanceScore}%</span>
                    </div>
                  ),
                  sortable: true
                },
                { 
                  header: 'Scholarships', 
                  accessor: (row: Ambassador) => row.scholarshipsGenerated.toString(),
                  sortable: true
                },
                { 
                  header: 'Status', 
                  accessor: (row: Ambassador) => (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[row.status].color}`}>
                      {statusConfig[row.status].icon}
                      {row.status}
                    </span>
                  )
                },
                { 
                  header: 'Last Activity', 
                  accessor: (row: Ambassador) => row.lastActivity,
                  sortable: true
                },
                { 
                  header: 'Actions', 
                  accessor: (row: Ambassador) => (
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-ash-teal hover:bg-ash-teal/10 rounded transition-colors">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
              data={ambassadorsData}
              keyField="id"
              rowsPerPage={10}
            />
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PerformanceSummary
              title="Overall Performance"
              score={89}
              target={85}
              color="bg-gradient-to-r from-green-500 to-emerald-600"
              icon={<TrendingUp className="h-5 w-5 text-white" />}
            />
            <PerformanceSummary
              title="Scholarship Generation"
              score={2847}
              target={2500}
              color="bg-gradient-to-r from-yellow-400 to-orange-500"
              icon={<Award className="h-5 w-5 text-white" />}
            />
            <PerformanceSummary
              title="Training Completion"
              score={94}
              target={90}
              color="bg-gradient-to-r from-purple-500 to-violet-600"
              icon={<GraduationCap className="h-5 w-5 text-white" />}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance by Country */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Performance by Country
                </h3>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ash-teal">
                    <option>Q4 2024</option>
                    <option>YTD 2024</option>
                  </select>
                </div>
              </div>
              <BarChart
                title="Performance by Country"
                data={performanceByCountryData}
                height={300}
              />
            </div>

            {/* Role Distribution */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Role Distribution
                </h3>
                <span className="text-sm text-gray-500">Total: 1,247</span>
              </div>
              <PieChart
                title="Role Distribution"
                data={roleDistributionData}
                height={300}
              />
            </div>
          </div>

          {/* Activity Trends */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-600" />
                Activity Trends
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Last 30 days</span>
              </div>
            </div>
            <LineChart
              title="Activity Trends"
              data={activityTrendsData}
              height={300}
            />
          </div>
        </div>
      )}

      {/* Activity Feed - Always visible */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {/* Additional content based on tab */}
          {activeTab === 'performance' && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performers Q4 2024</h3>
              <DataTable 
                columns={[
                { header: 'Rank', accessor: 'rank' },
                  { header: 'Ambassador', accessor: 'name' },
                  { header: 'Country', accessor: 'country' },
                  { header: 'Score', accessor: 'score', sortable: true },
                  { header: 'Scholarships', accessor: 'scholarships', sortable: true },
                  { header: 'Leads', accessor: 'leads', sortable: true }
                ]}
                data={[
                  { id: 1, rank: 1, name: 'Aisha Bello', country: '🇳🇬 Nigeria', score: '94%', scholarships: 45, leads: 156 },
                  { id: 2, rank: 2, name: 'Thabo Mthembu', country: '🇿🇦 South Africa', score: '91%', scholarships: 56, leads: 201 },
                  { id: 3, rank: 3, name: 'Kwame Mensah', country: '🇬🇭 Ghana', score: '88%', scholarships: 32, leads: 123 }
                ]}
                keyField="id"
                rowsPerPage={5}
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

export default AmbassadorsPage;