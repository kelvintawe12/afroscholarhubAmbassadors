import React, { useState, useEffect } from 'react';
import {
  Users,
  MapPin,
  Award,
  TrendingUp,
  Star,
  Phone,
  Mail,
  Download,
  Filter,
  Search,
  Plus,
  Shield,
  GraduationCap,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  X,
  Globe
} from 'lucide-react';
import { DataTable } from '../../../ui/widgets/DataTable';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { BarChart } from '../../../ui/widgets/BarChart';
import { PieChart } from '../../../ui/widgets/PieChart';
import { LineChart } from '../../../ui/widgets/LineChart';
import { getAmbassadorsData, getCountries, createAmbassador, assignCountryLead, assignCountryToAmbassador } from '../../../../api/management';

// Types
interface Ambassador {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  flag: string;
  region: string;
  role: 'lead' | 'coordinator' | 'field' | 'trainee' | 'ambassador';
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
  trainee: { color: 'bg-yellow-100 text-yellow-800', label: 'Trainee' },
  ambassador: { color: 'bg-blue-100 text-blue-800', label: 'Ambassador' }
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
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color} mr-3 flex-shrink-0`}>
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
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [countriesList, setCountriesList] = useState<string[]>([]);

  // New states for lead assignment feature
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [leadSearch, setLeadSearch] = useState('');
  const [leadCountryFilter, setLeadCountryFilter] = useState('');
  const [allAmbassadors, setAllAmbassadors] = useState<Ambassador[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAmbassadorsData();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries();
        setCountries(data);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (dashboardData?.ambassadors) {
      const countryCodes = dashboardData.ambassadors
        .map((a: any) => a.country)
        .filter((country: any): country is string => typeof country === 'string');
      setCountriesList(Array.from<string>(new Set(countryCodes)));
    }
  }, [dashboardData]);

  // Map API data to component expected format
  const ambassadorsRaw = dashboardData?.ambassadors || [];
  const mappedAmbassadors: Ambassador[] = ambassadorsRaw.map((a: any) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    phone: '', // Not available in API
    country: a.country,
    flag: '', // Not available, can add mapping if needed
    region: a.region,
    role: 'ambassador' as const,
    status: a.status as any,
    joinDate: new Date().toISOString().split('T')[0], // Approximate - API doesn't provide join date
    lastActivity: a.lastActivity,
    performanceScore: a.performance,
    certifications: 0, // Mock, can add if available
    schoolsReached: a.schoolsCount || 0,
    scholarshipsGenerated: 0, // Mock
    leadsGenerated: a.leadsGenerated || 0,
    conversionRate: 0, // Mock
    avgResponseTime: '', // Mock
    trainingCompletion: 0, // Mock
    satisfactionRating: 0, // Mock
    assignedRegion: a.region,
    contact: {
      email: a.email,
      phone: ''
    },
    profilePicture: a.avatar,
    bio: '' // Mock
  }));

  // Populate allAmbassadors when data loads
  useEffect(() => {
    setAllAmbassadors(mappedAmbassadors);
  }, [dashboardData]);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAmbassadorsData();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: 'all',
    role: 'all',
    status: 'all',
    region: 'all',
    performance: 'all'
  });
  const [assigningLead, setAssigningLead] = useState<Ambassador | null>(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [newCountryCode, setNewCountryCode] = useState('');
  const [newCountryName, setNewCountryName] = useState('');
  const [showAddAmbassador, setShowAddAmbassador] = useState(false);
  const [newAmbassador, setNewAmbassador] = useState({ name: '', email: '', countryCode: '' });

  const handleAssignLead = (ambassador: Ambassador) => {
    setAssigningLead(ambassador);
    // Optionally open a modal for confirmation or country selection
  };

  const confirmAssignLead = async () => {
    if (assigningLead && assigningLead.country) {
      try {
        await assignCountryLead(assigningLead.country, assigningLead.id);
        alert(`${assigningLead.name} assigned as Country Lead!`);
        setAssigningLead(null);
        await refreshData();
      } catch (err: any) {
        alert(`Error assigning lead: ${err.message}`);
      }
    }
  };

  const handleAddCountry = async () => {
    if (newCountryName) {
      try {
        // Auto-generate country code from name
        const generatedCode = newCountryName
          .split(' ')
          .map(word => word.charAt(0).toUpperCase())
          .join('')
          .slice(0, 3);

        const countryData = { code: generatedCode, name: newCountryName };

        // Assign selected lead if chosen
        if (selectedLeadId) {
          await assignCountryLead(generatedCode, selectedLeadId);
          alert(`Country ${newCountryName} added and lead assigned!`);
        } else {
          alert(`Country ${newCountryName} added!`);
        }

        setNewCountryCode('');
        setNewCountryName('');
        setSelectedLeadId('');
        setLeadSearch('');
        setLeadCountryFilter('');
        const fetchedCountries = await getCountries();
        setCountries(fetchedCountries);
        await refreshData();
      } catch (err: any) {
        alert(`Error adding country: ${err.message}`);
      }
    }
  };

  const handleAddAmbassador = async () => {
    if (newAmbassador.name && newAmbassador.email) {
      try {
        const newUser = await createAmbassador({
          email: newAmbassador.email,
          full_name: newAmbassador.name,
          country_code: newAmbassador.countryCode,
        });
        if (newAmbassador.countryCode) {
          await assignCountryToAmbassador(newUser.id, newAmbassador.countryCode);
        }
        alert(`Added ambassador: ${newAmbassador.name}`);
        setShowAddAmbassador(false);
        setNewAmbassador({ name: '', email: '', countryCode: '' });
        await refreshData();
      } catch (err: any) {
        alert(`Error adding ambassador: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading ambassadors data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-12">
        Error loading ambassadors data: {String(error)}
      </div>
    );
  }

  const metrics = dashboardData?.metrics || [];
  const charts = dashboardData?.charts || {};

  const tabs = [
    { id: 'directory', label: `Directory (${ambassadorsRaw.length})`, icon: <Users className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'performance', label: 'Performance', icon: <Award className="h-4 w-4" /> },
    { id: 'training', label: 'Training', icon: <GraduationCap className="h-4 w-4" /> }
  ];

  const countriesFilter = [
    { value: 'all', label: 'All Countries' },
    ...countries.map(c => ({ value: c.code, label: `${c.name} (${c.code})` })).sort((a, b) => a.label.localeCompare(b.label))
  ];

  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'ambassador', label: 'Ambassadors' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'training', label: 'Training' }
  ];

  // Filter ambassadors
  const filteredAmbassadors = mappedAmbassadors.filter((ambassador: Ambassador) => {
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

  // Recent activities - mock for now, can integrate real if available
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

  const filteredLeadOptions = allAmbassadors.filter(a => {
    const matchesCountry = !leadCountryFilter || a.country === leadCountryFilter;
    const matchesSearch =
      a.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(leadSearch.toLowerCase());
    return matchesCountry && matchesSearch;
  });

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
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-ash-teal to-ash-gold text-white rounded-lg font-semibold hover:from-ash-teal/90 hover:to-ash-gold/90 transition-all shadow-lg hover:shadow-xl"
            onClick={() => setShowAddAmbassador(true)}
          >
            <Plus className="h-4 w-4" />
            Add Ambassador
          </button>

          {/* Manage Countries Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setShowCountryModal(true)}
          >
            <MapPin className="h-4 w-4" />
            Manage Countries
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
        {metrics.map((metric: any, index: number) => (
          <KpiCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={
              metric.title.includes('Performance') ? <TrendingUp className="h-5 w-5 text-green-600" /> :
              metric.title.includes('Active') ? <Users className="h-5 w-5 text-blue-600" /> :
              metric.title.includes('Completion') ? <CheckCircle className="h-5 w-5 text-purple-600" /> :
              <Award className="h-5 w-5 text-yellow-500" />
            }
            trend={metric.change > 0 ? `+${metric.change}%` : `${metric.change}%`}
            color="from-blue-500 to-blue-600"
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
                    {countriesFilter.map(country => (
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ash-teal to-ash-gold flex items-center justify-center text-white text-sm font-semibold">
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
                      <span className="mr-2">{row.flag || '🏳️'}</span>
                      <span className="text-sm font-medium">{row.country}</span>
                    </div>
                  )
                },
                { 
                  header: 'Role', 
                  accessor: () => (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                      Ambassador
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
                  header: 'Schools Reached', 
                  accessor: (row: Ambassador) => row.schoolsReached.toString(),
                  sortable: true
                },
                { 
                  header: 'Status', 
                  accessor: (row: Ambassador) => (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[row.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                      {statusConfig[row.status]?.icon || <Clock className="h-4 w-4" />}
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
                      <button
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors text-xs font-semibold"
                        onClick={() => handleAssignLead(row)}
                        title="Assign as Country Lead"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
              data={mappedAmbassadors}
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
                data={(charts as any)?.performanceByCountry || performanceByCountryData}
                height={300}
              />
            </div>

            {/* Role Distribution - All ambassadors for now */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Role Distribution
                </h3>
                <span className="text-sm text-gray-500">Total: {allAmbassadors.length}</span>
              </div>
              <PieChart
                title="Role Distribution"
                data={{
                  labels: ['Ambassador'],
                  datasets: [{
                    data: [ambassadorsRaw.length],
                    backgroundColor: ['rgba(26, 95, 122, 0.8)']
                  }]
                }}
                height={300}
              />
            </div>
          </div>

          {/* Activity Trends */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-600" />
                Performance Trends
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Last 6 months</span>
              </div>
            </div>
            <LineChart
              title="Performance Trends"
              data={(charts as any)?.performanceTrend || activityTrendsData}
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

      {/* Assign Lead Modal */}
      {assigningLead && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Assign as Country Lead</h2>
            <p>
              Are you sure you want to assign <b>{assigningLead.name}</b> as the lead for <b>{assigningLead.country}</b>?
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 rounded bg-gray-100" onClick={() => setAssigningLead(null)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-ash-teal text-white" onClick={confirmAssignLead}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Country Modal */}
      {showCountryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-ash-teal to-ash-gold p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Manage Countries</h2>
                    <p className="text-white/80 text-sm">Add and manage country operations</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCountryModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Existing Countries */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-ash-teal" />
                  Active Countries ({countries.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                  {countries.map((country) => (
                    <div key={country.code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ash-teal to-ash-gold flex items-center justify-center text-white text-sm font-semibold">
                          {country.code}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{country.name}</p>
                          <p className="text-sm text-gray-500">{country.code}</p>
                        </div>
                      </div>
                      {country.lead_id && (
                        <div className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          <Shield className="h-3 w-3 mr-1" />
                          Lead Assigned
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Country */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-ash-teal" />
                  Add New Country
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ash-teal focus:border-transparent"
                      placeholder="e.g., Nigeria"
                      value={newCountryName}
                      onChange={e => setNewCountryName(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Full country name - code will be auto-generated</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign Country Lead <span className="text-gray-400">(optional)</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={leadCountryFilter}
                        onChange={e => setLeadCountryFilter(e.target.value)}
                      >
                        <option value="">All Countries</option>
                        {countries.map(c => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                      <input
                        className="border rounded px-2 py-1 text-sm flex-1"
                        placeholder="Search ambassador..."
                        value={leadSearch}
                        onChange={e => setLeadSearch(e.target.value)}
                      />
                    </div>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={selectedLeadId}
                      onChange={e => setSelectedLeadId(e.target.value)}
                    >
                      <option value="">No Lead</option>
                      {filteredLeadOptions.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.email}) {a.country}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Choose an ambassador to assign as lead for this country.</p>
                  </div>
                  <button
                    className="w-full bg-gradient-to-r from-ash-teal to-ash-gold text-white py-3 px-4 rounded-lg font-semibold hover:from-ash-teal/90 hover:to-ash-gold/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddCountry}
                    disabled={!newCountryName.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Country & Assign Lead
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Ambassador Modal */}
      {showAddAmbassador && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Ambassador</h2>
            <div className="flex flex-col gap-3">
              <input
                className="border rounded px-2 py-1"
                placeholder="Name"
                value={newAmbassador.name}
                onChange={e => setNewAmbassador(a => ({ ...a, name: e.target.value }))}
              />
              <input
                className="border rounded px-2 py-1"
                placeholder="Email"
                value={newAmbassador.email}
                onChange={e => setNewAmbassador(a => ({ ...a, email: e.target.value }))}
              />
              <select
                className="border rounded px-2 py-1"
                value={newAmbassador.countryCode}
                onChange={e => setNewAmbassador(a => ({ ...a, countryCode: e.target.value }))}
              >
                <option value="">Select Country</option>
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 rounded bg-gray-100" onClick={() => setShowAddAmbassador(false)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-ash-teal text-white" onClick={handleAddAmbassador}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbassadorsPage;