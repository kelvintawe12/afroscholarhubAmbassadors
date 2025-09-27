import React, { useState, useEffect } from 'react';
import {
  Users,
  MapPin,
  Award,
  TrendingUp,
  Calendar,
  BarChart3,
  Filter,
  Download,
  Globe,
  Clock
} from 'lucide-react';
import { getGlobalCountriesStats, getGlobalQuickStats, getGlobalRecentActivities, CountryStats, QuickStat, RecentActivity } from '../../../api/global-peek';
import { LoadingSpinner } from '../../LoadingSpinner';

// Components
const CountryCard: React.FC<{ country: CountryStats }> = ({ country }) => {
  const statusColors = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    developing: 'bg-yellow-100 text-yellow-800',
    'needs-attention': 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    excellent: '⭐⭐⭐⭐⭐',
    good: '⭐⭐⭐⭐',
    developing: '⭐⭐⭐',
    'needs-attention': '⭐⭐'
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[country.status]}`}>
          {statusIcons[country.status]}
        </span>
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${country.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

      <div className="relative p-6">
        {/* Country Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mr-3">
              <span className="text-lg font-bold text-gray-700">{country.code}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{country.name}</h3>
              <p className="text-sm text-gray-500">Africa</p>
            </div>
          </div>
          <div className={`p-1 rounded-full ${country.status === 'excellent' ? 'bg-green-100' : country.status === 'good' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
            <Globe className="h-4 w-4 text-gray-600" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Ambassadors</p>
            <p className="text-xl font-bold text-gray-900">{country.ambassadors.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Scholarships</p>
            <p className="text-xl font-bold text-gray-900">{country.scholarships.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Funding</p>
            <p className="text-lg font-semibold text-gray-900">{country.funding}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Growth</p>
            <div className="flex items-center">
              <span className="text-lg font-bold text-green-600">+{country.growth}%</span>
              <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-ash-teal bg-ash-teal/5 hover:bg-ash-teal/10 rounded-lg transition-colors border border-ash-teal/20">
            <MapPin className="h-4 w-4" />
            View Details
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const QuickStatCard: React.FC<{ stat: QuickStat }> = ({ stat }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-ash-teal to-ash-gold rounded-lg mr-3">
            {stat.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className={`text-sm font-semibold ${
            stat.trend === 'up' ? 'text-green-600' :
            stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {stat.change}
          </span>
          {stat.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500 ml-1" />}
          {stat.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-500 ml-1 rotate-180" />}
          {stat.trend === 'stable' && <Clock className="h-4 w-4 text-gray-400 ml-1" />}
        </div>
      </div>
    </div>
  );
};

const ActivityCard: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
  const typeColors = {
    scholarship: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    partnership: 'bg-blue-50 border-blue-200 text-blue-800',
    expansion: 'bg-green-50 border-green-200 text-green-800',
    milestone: 'bg-purple-50 border-purple-200 text-purple-800',
    event: 'bg-green-50 border-green-200 text-green-800',
    visit: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`relative rounded-xl p-4 border-l-4 ${typeColors[activity.type]} border bg-white shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 pt-0.5">
          <div className="p-2 bg-white rounded-full shadow-sm">
            {activity.icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900 truncate">{activity.title}</h4>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {activity.country}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{activity.impact}</p>
          <p className="mt-2 text-xs text-gray-500">{activity.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const GlobalPeekPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30D');
  const [view, setView] = useState('overview');
  const [countries, setCountries] = useState<CountryStats[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timeRanges = ['7D', '30D', '90D', 'YTD', '12M'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [countriesData, quickStatsData, activitiesData] = await Promise.all([
          getGlobalCountriesStats(),
          getGlobalQuickStats(),
          getGlobalRecentActivities()
        ]);

        // Add icons to quick stats
        const quickStatsWithIcons = quickStatsData.map(stat => ({
          ...stat,
          icon: stat.title.includes('Ambassadors') ? <Users className="h-5 w-5" /> :
                stat.title.includes('Scholarships') ? <Award className="h-5 w-5" /> :
                stat.title.includes('Impact') ? <TrendingUp className="h-5 w-5" /> :
                <MapPin className="h-5 w-5" />
        }));

        // Add icons to activities
        const activitiesWithIcons = activitiesData.map(activity => ({
          ...activity,
          icon: activity.type === 'event' ? <Calendar className="h-4 w-4 text-green-500" /> :
                activity.type === 'partnership' ? <Users className="h-4 w-4 text-blue-500" /> :
                activity.type === 'visit' ? <MapPin className="h-4 w-4 text-purple-500" /> :
                <Award className="h-4 w-4 text-yellow-500" />
        }));

        setCountries(countriesData);
        setQuickStats(quickStatsWithIcons);
        setRecentActivities(activitiesWithIcons);
      } catch (err) {
        console.error('Error fetching global peek data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-ash-teal text-white rounded-lg hover:bg-ash-teal/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-ash-teal to-ash-gold rounded-xl mr-3">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Global Peek</h1>
              <p className="text-lg text-gray-600 mt-1">Africa-wide impact overview</p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-0 flex items-center gap-4">
          {/* Time Range Selector */}
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 px-1 py-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-ash-teal text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-2">
            <button
              className={`p-1 rounded transition-colors ${
                view === 'overview' ? 'text-ash-teal' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setView('overview')}
              title="Overview"
            >
              <Globe className="h-4 w-4" />
            </button>
            <span className="text-gray-400">|</span>
            <button
              className={`p-1 rounded transition-colors ${
                view === 'countries' ? 'text-ash-teal' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setView('countries')}
              title="Countries"
            >
              <MapPin className="h-4 w-4" />
            </button>
            <span className="text-gray-400">|</span>
            <button
              className={`p-1 rounded transition-colors ${
                view === 'trends' ? 'text-ash-teal' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setView('trends')}
              title="Trends"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>

          {/* Actions */}
          <button className="flex items-center gap-2 px-4 py-2 bg-ash-gold text-ash-dark rounded-lg font-semibold hover:bg-ash-gold/90 transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <QuickStatCard key={index} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Countries Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-ash-teal" />
              Country Performance
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ash-teal">
                <option>Funding Impact</option>
                <option>Ambassadors</option>
                <option>Growth Rate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-4">
            <button className="text-ash-teal hover:text-ash-teal/80 font-medium text-sm flex items-center justify-center gap-1 mx-auto">
              Load More Countries
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-ash-gold" />
            Recent Activity
          </h2>

          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>

          <div className="pt-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-ash-teal bg-ash-teal/5 hover:bg-ash-teal/10 rounded-lg transition-colors border border-ash-teal/20">
              View All Activity
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Impact Metrics - Full Width */}
      <div className="bg-gradient-to-r from-ash-teal to-ash-gold rounded-2xl p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{quickStats.find(s => s.title.includes('Scholarships'))?.value || '0'}</div>
              <div className="text-ash-light text-lg">Students Transformed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{quickStats.find(s => s.title.includes('Impact'))?.value || '$0'}</div>
              <div className="text-ash-light text-lg">Total Investment</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{quickStats.find(s => s.title.includes('Success Rate'))?.value || '0%'}</div>
              <div className="text-ash-light text-lg">Success Rate</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-ash-light text-lg mb-6 max-w-2xl mx-auto">
              We're building the future of African education, one scholarship at a time.
              Join us in creating opportunities that change lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-ash-teal rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Become an Ambassador
                <Users className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-ash-teal transition-colors">
                Partner With Us
                <Award className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Sticky Footer */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full p-3 shadow-lg border border-gray-200 z-40 md:hidden">
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
          <Filter className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default GlobalPeekPage;
