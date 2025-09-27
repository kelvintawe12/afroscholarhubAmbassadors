import { supabase } from '../utils/supabase';

// Types
export interface CountryStats {
  id: string;
  name: string;
  code: string;
  ambassadors: number;
  scholarships: number;
  funding: string;
  growth: number;
  status: 'excellent' | 'good' | 'developing' | 'needs-attention';
  color: string;
}

export interface QuickStat {
  title: string;
  value: string;
  change: string;
  icon: any;
  trend: 'up' | 'down' | 'stable';
}

export interface RecentActivity {
  id: string;
  type: 'scholarship' | 'partnership' | 'expansion' | 'milestone' | 'event' | 'visit';
  title: string;
  country: string;
  timestamp: string;
  impact: string;
  icon: any;
}

// Helper function to get date filter based on time range
const getDateFilter = (timeRange: string) => {
  const now = new Date();
  let startDate: Date;

  switch (timeRange) {
    case '7D':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30D':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90D':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'YTD':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case '12M':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Default to 30D
  }

  return startDate.toISOString();
};

// Global Peek API functions
export const getGlobalCountriesStats = async (timeRange: string = '30D'): Promise<CountryStats[]> => {
  const startDate = getDateFilter(timeRange);

  // Get all active countries
  const { data: countriesData, error: countriesError } = await supabase
    .from('countries')
    .select('*')
    .eq('active', true)
    .order('name');

  if (countriesError) throw countriesError;

  // For each country, get stats
  const countriesStats = await Promise.all(
    countriesData.map(async (country) => {
      // Count ambassadors created in time range
      const { data: ambassadorsData, error: ambassadorsError } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'ambassador')
        .eq('country_code', country.code)
        .gte('created_at', startDate);

      if (ambassadorsError) throw ambassadorsError;

      const ambassadorsCount = ambassadorsData.length;

      // Count partnered schools in time range
      const { data: scholarshipsData, error: scholarshipsError } = await supabase
        .from('schools')
        .select('id')
        .eq('country_code', country.code)
        .eq('status', 'partnered')
        .gte('partnership_date', startDate);

      if (scholarshipsError) throw scholarshipsError;

      const scholarshipsCount = scholarshipsData.length;

      // Sum event budgets as funding in time range
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('budget')
        .eq('country_code', country.code)
        .gte('event_date', startDate);

      if (eventsError) throw eventsError;

      const funding = eventsData.reduce((sum, event) => sum + (event.budget || 0), 0);

      // Calculate growth (simplified - compare current vs previous period)
      // For now, use a random growth between -10% to +30%
      const growth = Math.floor(Math.random() * 40) - 10;

      // Determine status based on metrics
      let status: 'excellent' | 'good' | 'developing' | 'needs-attention';
      if ((ambassadorsCount || 0) >= 10 && (scholarshipsCount || 0) >= 20) {
        status = 'excellent';
      } else if ((ambassadorsCount || 0) >= 5 && (scholarshipsCount || 0) >= 10) {
        status = 'good';
      } else if ((ambassadorsCount || 0) >= 2) {
        status = 'developing';
      } else {
        status = 'needs-attention';
      }

      // Color based on status
      const colorMap = {
        excellent: 'from-green-500 to-green-600',
        good: 'from-blue-500 to-blue-600',
        developing: 'from-yellow-500 to-yellow-600',
        'needs-attention': 'from-red-500 to-red-600'
      };

      return {
        id: country.code,
        name: country.name,
        code: country.code,
        ambassadors: ambassadorsCount || 0,
        scholarships: scholarshipsCount || 0,
        funding: formatCurrency(funding, country.currency || 'USD'),
        growth,
        status,
        color: colorMap[status]
      };
    })
  );

  return countriesStats;
};

export const getGlobalQuickStats = async (timeRange: string = '30D'): Promise<QuickStat[]> => {
  const startDate = getDateFilter(timeRange);

  // Total Ambassadors created in time range
  const { data: ambassadorsData, error: ambassadorsError } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'ambassador')
    .gte('created_at', startDate);

  if (ambassadorsError) throw ambassadorsError;

  const totalAmbassadors = ambassadorsData.length;

  // Scholarships Funded (partnered schools) in time range
  const { data: scholarshipsData, error: scholarshipsError } = await supabase
    .from('schools')
    .select('id')
    .eq('status', 'partnered')
    .gte('partnership_date', startDate);

  if (scholarshipsError) throw scholarshipsError;

  const scholarshipsFunded = scholarshipsData.length;

  // Total Schools created in time range (for success rate calculation)
  const { data: totalSchoolsData, error: totalSchoolsError } = await supabase
    .from('schools')
    .select('id')
    .gte('created_at', startDate);

  if (totalSchoolsError) throw totalSchoolsError;

  const totalSchools = totalSchoolsData.length;

  // Total Impact (students reached) in time range
  const { data: visitsData, error: visitsError } = await supabase
    .from('visits')
    .select('students_reached')
    .gte('visit_date', startDate);

  if (visitsError) throw visitsError;

  const totalImpact = visitsData.reduce((sum, visit) => sum + (visit.students_reached || 0), 0);

  // Active Countries (all active, as it's global)
  const { data: countriesData, error: countriesError } = await supabase
    .from('countries')
    .select('code')
    .eq('active', true);

  if (countriesError) throw countriesError;

  const activeCountries = countriesData.length;

  // Calculate success rate (partnered schools / total schools in period)
  const successRate = totalSchools > 0 ? Math.round((scholarshipsFunded / totalSchools) * 100) : 0;

  // Calculate changes (simplified - would need historical data)
  return [
    {
      title: 'Total Ambassadors',
      value: (totalAmbassadors || 0).toLocaleString(),
      change: '+12%', // Placeholder
      icon: null, // Will be set in component
      trend: 'up' as const
    },
    {
      title: 'Scholarships Funded',
      value: (scholarshipsFunded || 0).toLocaleString(),
      change: '+18%', // Placeholder
      icon: null,
      trend: 'up' as const
    },
    {
      title: 'Total Impact',
      value: `${totalImpact.toLocaleString()}`,
      change: '+15%', // Placeholder
      icon: null,
      trend: 'up' as const
    },
    {
      title: 'Active Countries',
      value: `${activeCountries || 0}/54`,
      change: `+${activeCountries || 0}`, // Placeholder
      icon: null,
      trend: 'up' as const
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      change: '', // Not applicable
      icon: null,
      trend: 'stable' as const
    }
  ];
};

export const getGlobalRecentActivities = async (timeRange: string = '30D'): Promise<RecentActivity[]> => {
  const startDate = getDateFilter(timeRange);

  // Get recent events in time range
  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select(`
      id,
      name,
      event_date,
      countries!inner (name)
    `)
    .gte('event_date', startDate)
    .order('event_date', { ascending: false })
    .limit(4);

  if (eventsError) throw eventsError;

  // Get recent partnerships (schools becoming partnered) in time range
  const { data: partnershipsData, error: partnershipsError } = await supabase
    .from('schools')
    .select(`
      id,
      name,
      partnership_date,
      countries!inner (name)
    `)
    .eq('status', 'partnered')
    .not('partnership_date', 'is', null)
    .gte('partnership_date', startDate)
    .order('partnership_date', { ascending: false })
    .limit(2);

  if (partnershipsError) throw partnershipsError;

  // Get recent visits in time range
  const { data: visitsData, error: visitsError } = await supabase
    .from('visits')
    .select(`
      id,
      visit_date,
      students_reached,
      schools!inner (name, countries!inner (name))
    `)
    .gte('visit_date', startDate)
    .order('visit_date', { ascending: false })
    .limit(2);

  if (visitsError) throw visitsError;

  const activities: RecentActivity[] = [];

  // Add events
  eventsData.forEach(event => {
    activities.push({
      id: `event-${event.id}`,
      type: 'event' as const,
      title: event.name,
      country: (event.countries as any)?.name || 'Unknown',
      timestamp: new Date(event.event_date).toLocaleDateString(),
      impact: `Event scheduled for ${new Date(event.event_date).toLocaleDateString()}`,
      icon: null // Will be set in component
    });
  });

  // Add partnerships
  partnershipsData.forEach(partnership => {
    activities.push({
      id: `partnership-${partnership.id}`,
      type: 'partnership' as const,
      title: `Partnership with ${partnership.name}`,
      country: (partnership.countries as any)?.name || 'Unknown',
      timestamp: partnership.partnership_date ? new Date(partnership.partnership_date).toLocaleDateString() : 'Recent',
      impact: 'New school partnership established',
      icon: null
    });
  });

  // Add visits
  visitsData.forEach(visit => {
    activities.push({
      id: `visit-${visit.id}`,
      type: 'visit' as const,
      title: `School Visit to ${(visit.schools as any)?.name || 'Unknown School'}`,
      country: ((visit.schools as any)?.countries as any)?.name || 'Unknown',
      timestamp: new Date(visit.visit_date).toLocaleDateString(),
      impact: `${visit.students_reached || 0} students reached`,
      icon: null
    });
  });

  // Sort by timestamp (most recent first) and limit to 4
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4);
};

// Helper function to format currency
const formatCurrency = (amount: number, currency: string) => {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    NGN: '₦',
    GHS: '₵',
    KES: 'KSh',
    ZAR: 'R',
    ETB: 'ETB',
    MAD: 'MAD'
  };

  const symbol = currencySymbols[currency as keyof typeof currencySymbols] || currency;
  return `${symbol}${(amount / 1000000).toFixed(1)}M`; // Convert to millions
};
