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
  Globe,
  UserCog
} from 'lucide-react';
import { DataTable } from '../../../ui/widgets/DataTable';
import { KpiCard } from '../../../ui/widgets/KpiCard';
import { BarChart } from '../../../ui/widgets/BarChart';
import { PieChart } from '../../../ui/widgets/PieChart';
import { LineChart } from '../../../ui/widgets/LineChart';
import { 
  getAllUsers, 
  getCountries, 
  createUser, 
  updateUserRole, 
  updateUserCountry, 
  getUsersByRole, 
  getCountryLeads,
  assignCountryLead,
  createCountry 
} from '../../../../api/management';
import { User, UserRole, Country } from '../../../../types';

// Extended User for display
interface DisplayUser extends User {
  country_name?: string;
  flag_emoji?: string;
  lead_name?: string;
  status?: 'active' | 'inactive' | 'pending';
  performance_score?: number;
  bio?: string;
  phone?: string;
  onboarding_completed?: boolean;
}

// Chart Data (computed from real data)
const getRoleDistributionData = (users: DisplayUser[]) => {
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(roleCounts).map(role => roleConfig[role as UserRole]?.label || role),
    datasets: [{
      data: Object.values(roleCounts),
      backgroundColor: [
        'rgba(26, 95, 122, 0.8)', // management
        'rgba(244, 196, 48, 0.8)', // country_lead
        'rgba(38, 162, 105, 0.8)', // ambassador
        'rgba(108, 92, 231, 0.8)' // support
      ]
    }]
  };
};

const getUsersByCountryData = (users: DisplayUser[]) => {
  const countryCounts = users.reduce((acc, user) => {
    const countryName = user.country_name || 'Unassigned';
    acc[countryName] = (acc[countryName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: Object.keys(countryCounts),
    datasets: [{
      label: 'Users',
      data: Object.values(countryCounts),
      backgroundColor: 'rgba(26, 95, 122, 0.8)'
    }]
  };
};

const getUserGrowthData = (users: DisplayUser[]) => {
  // Group users by month
  const monthlyCounts = users.reduce((acc, user) => {
    const date = new Date(user.created_at);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort by date
  const sortedMonths = Object.keys(monthlyCounts).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  return {
    labels: sortedMonths,
    datasets: [{
      label: 'New Users',
      data: sortedMonths.map(month => monthlyCounts[month]),
      borderColor: 'rgb(26, 95, 122)',
      backgroundColor: 'rgba(26, 95, 122, 0.1)',
      tension: 0.4
    }]
  };
};

// Role badges config
const roleConfig: Record<UserRole, { color: string; label: string; icon: React.ReactNode }> = {
  management: { color: 'bg-blue-100 text-blue-800', label: 'Management', icon: <UserCog className="h-4 w-4" /> },
  country_lead: { color: 'bg-purple-100 text-purple-800', label: 'Country Lead', icon: <MapPin className="h-4 w-4" /> },
  ambassador: { color: 'bg-green-100 text-green-800', label: 'Ambassador', icon: <Users className="h-4 w-4" /> },
  support: { color: 'bg-indigo-100 text-indigo-800', label: 'Support', icon: <Shield className="h-4 w-4" /> }
};

// Status config
const statusConfig = {
  active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> },
  inactive: { color: 'bg-gray-100 text-gray-700', icon: <Clock className="h-4 w-4" /> },
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="h-4 w-4" /> }
};

// User Card Component
const UserCard: React.FC<{ user: DisplayUser; onClick: () => void; onEditRole: () => void; onAssignCountry: () => void }> = ({ 
  user, 
  onClick, 
  onEditRole, 
  onAssignCountry 
}) => {
  const role = roleConfig[user.role as UserRole];
  const status = statusConfig[user.status || 'active'];
  const performanceColor = (user.performance_score || 0) >= 80 ? 'text-green-600' : 
                          (user.performance_score || 0) >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div 
      className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
          {status.icon}
          {user.status || 'active'}
        </span>
      </div>

      {/* Role Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
          {role.icon}
          {role.label}
        </span>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {user.full_name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="flex items-center">
                <span className="mr-1">{user.flag_emoji || '🏳️'}</span>
                <span className="truncate">{user.country_name || 'Unassigned'}</span>
              </span>
            </div>
            {user.bio && (
              <p className="text-sm text-gray-600 line-clamp-1">{user.bio}</p>
            )}
          </div>
          
          {/* Profile Picture */}
          <div className="flex-shrink-0 ml-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm`}>
              {user.full_name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
          </div>
          
          {user.role === 'ambassador' && (
            <>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Performance</p>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${performanceColor}`} 
                      style={{ width: `${user.performance_score || 0}%` }}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${performanceColor}`}>
                    {user.performance_score}%
                  </span>
                </div>
              </div>
            </>
          )}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Joined</p>
            <p className="text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>

          {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span className="font-medium text-gray-900">ID: {user.id.slice(-6)}</span>
            <div className="flex items-center gap-2">
              <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" onClick={(e) => { e.stopPropagation(); onEditRole(); }}>
                <Shield className="h-3 w-3" />
              </button>
              {user.country_code && (
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors" onClick={(e) => { e.stopPropagation(); onAssignCountry(); }}>
                  <MapPin className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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

// Quick Action Component
const QuickAction: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  count?: number;
  onClick: () => void; 
  color?: string;
}> = ({ icon, title, description, count, onClick, color = 'from-blue-500 to-blue-600' }) => {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
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

// Performance Summary Component
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

// Main UsersPage Component
const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [activeTab, setActiveTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all' as UserRole | 'all',
    country: 'all',
    status: 'all'
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    full_name: '',
    role: 'ambassador' as UserRole,
    country_code: '',
    phone: '',
    bio: ''
  });
  const [editingUser, setEditingUser] = useState<DisplayUser | null>(null);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>('ambassador');
  const [showAssignCountryModal, setShowAssignCountryModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryLeads, setCountryLeads] = useState<Country[]>([]);
  const [showCreateCountryModal, setShowCreateCountryModal] = useState(false);
  const [showAssignLeadModal, setShowAssignLeadModal] = useState(false);
  const [newCountry, setNewCountry] = useState({
    code: '',
    name: '',
    flag_emoji: '',
    currency: '',
    timezone: ''
  });
  const [selectedCountryForLead, setSelectedCountryForLead] = useState('');
  const [selectedLeadUser, setSelectedLeadUser] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchCountries();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data as DisplayUser[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data);
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      setShowAddUserModal(false);
      setNewUser({ email: '', full_name: '', role: 'ambassador', country_code: '', phone: '', bio: '' });
      fetchUsers();
    } catch (err: any) {
      alert(`Error creating user: ${err.message}`);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;
    try {
      await updateUserRole(editingUser.id, newRole);
      setShowEditRoleModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(`Error updating role: ${err.message}`);
    }
  };

  const handleAssignCountry = async () => {
    if (!editingUser || !selectedCountry) return;
    try {
      await updateUserCountry(editingUser.id, selectedCountry);
      setShowAssignCountryModal(false);
      setEditingUser(null);
      setSelectedCountry('');
      fetchUsers();
    } catch (err: any) {
      alert(`Error assigning country: ${err.message}`);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    const matchesCountry = filters.country === 'all' || user.country_code === filters.country;
    const matchesStatus = filters.status === 'all' || (user.status || 'active') === filters.status;
    return matchesSearch && matchesRole && matchesCountry && matchesStatus;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="text-gray-500">Loading users...</div></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-12">Error: {error}</div>;
  }

  const tabs = [
    { id: 'directory', label: `Users (${users.length})`, icon: <Users className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> }
  ];

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    ...Object.entries(roleConfig).map(([key, { label }]) => ({ value: key as UserRole, label }))
  ];

  const countryOptions = [
    { value: 'all', label: 'All Countries' },
    ...countries.map(c => ({ value: c.code, label: `${c.name} (${c.code})` }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">User Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage users, roles, and country assignments</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto">
            <Download className="h-4 w-4" />
            Export Users
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 w-full sm:w-auto"
            onClick={() => setShowAddUserModal(true)}
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Total Users"
              value={users.length.toString()}
              icon={<Users className="h-5 w-5 text-blue-600" />}
              trend="+12%"
              color="from-blue-500 to-blue-600"
            />
            <KpiCard
              title="Active Users"
              value={users.filter(u => u.status === 'active').length.toString()}
              icon={<CheckCircle className="h-5 w-5 text-green-600" />}
              trend="+5%"
              color="from-green-500 to-green-600"
            />
            <KpiCard
              title="Ambassadors"
              value={users.filter(u => u.role === 'ambassador').length.toString()}
              icon={<Award className="h-5 w-5 text-yellow-500" />}
              trend="+8%"
              color="from-yellow-400 to-orange-500"
            />
            <KpiCard
              title="Countries Covered"
              value={new Set(users.map(u => u.country_code)).size.toString()}
              icon={<MapPin className="h-5 w-5 text-purple-600" />}
              trend="+2"
              color="from-purple-500 to-violet-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickAction
              icon={<Users className="h-5 w-5 text-white" />}
              title="Bulk Import"
              description="Import users from CSV"
              onClick={() => console.log('Bulk import')}
              color="from-indigo-500 to-purple-600"
            />
            <QuickAction
              icon={<Shield className="h-5 w-5 text-white" />}
              title="Role Changes"
              description="Review pending role updates"
              count={3}
              onClick={() => console.log('Role changes')}
              color="from-orange-500 to-red-500"
            />
            <QuickAction
              icon={<MapPin className="h-5 w-5 text-white" />}
              title="Country Assignment"
              description="Assign users to countries"
              count={12}
              onClick={() => console.log('Country assignment')}
              color="from-green-500 to-emerald-600"
            />
            <QuickAction
              icon={<TrendingUp className="h-5 w-5 text-white" />}
              title="Performance Review"
              description="Schedule performance evaluations"
              onClick={() => console.log('Performance review')}
              color="from-blue-500 to-blue-600"
            />
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.role}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as UserRole | 'all' }))}
                  >
                    {roleOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.country}
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                  >
                    {countryOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                  <select
                    className="bg-transparent text-sm border-none focus:outline-none"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Users Grid */}
          <div className="space-y-6">
            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredUsers.slice(0, 6).map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onClick={() => console.log('View user:', user.full_name)}
                    onEditRole={() => {
                      setEditingUser(user);
                      setNewRole(user.role);
                      setShowEditRoleModal(true);
                    }}
                    onAssignCountry={() => {
                      setEditingUser(user);
                      setSelectedCountry(user.country_code || '');
                      setShowAssignCountryModal(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 mx-auto">
                  <Plus className="h-4 w-4" />
                  Add Your First User
                </button>
              </div>
            )}
            {filteredUsers.length > 6 && (
              <div className="text-center">
                <button className="text-blue-600 hover:text-blue-500 font-medium text-sm flex items-center justify-center gap-1 mx-auto">
                  Load More Users
                  <TrendingUp className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Table View */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Users Table View</h3>
              <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                Switch to Cards →
              </button>
            </div>
            <DataTable 
              columns={[
                { 
                  header: 'User', 
                  accessor: (row: DisplayUser) => (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                        {row.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{row.full_name}</div>
                        <div className="text-xs text-gray-500 truncate">{row.email}</div>
                      </div>
                    </div>
                  )
                },
                { 
                  header: 'Role', 
                  accessor: (row: DisplayUser) => (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${roleConfig[row.role as UserRole]?.color || 'bg-gray-100 text-gray-700'}`}>
                      {roleConfig[row.role as UserRole]?.icon}
                      {roleConfig[row.role as UserRole]?.label}
                    </span>
                  )
                },
                { 
                  header: 'Country', 
                  accessor: (row: DisplayUser) => (
                    <div className="flex items-center">
                      <span className="mr-2">{row.flag_emoji || '🏳️'}</span>
                      <span className="text-sm font-medium">{row.country_name || 'Unassigned'}</span>
                    </div>
                  )
                },
                { 
                  header: 'Status', 
                  accessor: (row: DisplayUser) => (
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[row.status || 'active']?.color || 'bg-gray-100 text-gray-700'}`}>
                      {statusConfig[row.status || 'active']?.icon}
                      {row.status || 'active'}
                    </span>
                  )
                },
                { 
                  header: 'Joined', 
                  accessor: (row: DisplayUser) => new Date(row.created_at).toLocaleDateString(),
                  sortable: true
                },
                {
                  header: 'Actions',
                  accessor: (row: DisplayUser) => (
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" onClick={(e) => { e.stopPropagation(); setEditingUser(row); setNewRole(row.role); setShowEditRoleModal(true); }}>
                        <Shield className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" onClick={(e) => { e.stopPropagation(); setEditingUser(row); setSelectedCountry(row.country_code || ''); setShowAssignCountryModal(true); }}>
                        <MapPin className="h-4 w-4" />
                      </button>
                    </div>
                  )
                }
              ]}
              data={filteredUsers}
              keyField="id"
              rowsPerPage={10}
            />
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PerformanceSummary
              title="Total Active Users"
              score={users.filter(u => u.status === 'active').length}
              target={150}
              color="bg-gradient-to-r from-green-500 to-emerald-600"
              icon={<Users className="h-5 w-5 text-white" />}
            />
            <PerformanceSummary
              title="Role Diversity"
              score={new Set(users.map(u => u.role)).size}
              target={4}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              icon={<Award className="h-5 w-5 text-white" />}
            />
            <PerformanceSummary
              title="Country Coverage"
              score={new Set(users.map(u => u.country_code).filter(Boolean)).size}
              target={10}
              color="bg-gradient-to-r from-purple-500 to-violet-600"
              icon={<MapPin className="h-5 w-5 text-white" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Role Distribution</h3>
              <PieChart data={getRoleDistributionData(users)} height={300} title="Role Distribution" />
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Users by Country</h3>
              <BarChart data={getUsersByCountryData(users)} height={300} title="Users by Country" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth Trend</h3>
            <LineChart data={getUserGrowthData(users)} height={300} title="User Growth Trend" />
          </div>
        </div>
      )}

      {/* Modals */}
      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add New User</h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateUser} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  required
                >
                  {Object.entries(roleConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  value={newUser.country_code}
                  onChange={(e) => setNewUser(prev => ({ ...prev, country_code: e.target.value }))}
                >
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={newUser.phone}
                  onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  rows={3}
                  value={newUser.bio}
                  onChange={(e) => setNewUser(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Enter user bio (optional)"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRoleModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Edit User Role</h2>
              <button
                onClick={() => setShowEditRoleModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">{editingUser.full_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Role</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                >
                  {Object.entries(roleConfig).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  className="w-full sm:w-auto px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  onClick={() => setShowEditRoleModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  onClick={handleUpdateRole}
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Country Modal */}
      {showAssignCountryModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Assign Country</h2>
              <button
                onClick={() => setShowAssignCountryModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">{editingUser.full_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  className="w-full sm:w-auto px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  onClick={() => setShowAssignCountryModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  onClick={handleAssignCountry}
                >
                  Assign Country
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;

