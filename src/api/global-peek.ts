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

// Global Peek API functions
export const getGlobalCountriesStats = async (): Promise<CountryStats[]> => {
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
      // Count ambassadors
      const { data: ambassadorsData, error: ambassadorsError } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'ambassador')
        .eq('country_code', country.code);

      if (ambassadorsError) throw ambassadorsError;

      const ambassadorsCount = ambassadorsData.length;

      // Count partnered schools (as scholarships)
      const { data: scholarshipsData, error: scholarshipsError } = await supabase
        .from('schools')
        .select('id')
        .eq('country_code', country.code)
        .eq('status', 'partnered');

      if (scholarshipsError) throw scholarshipsError;

      const scholarshipsCount = scholarshipsData.length;

      // Sum event budgets as funding
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('budget')
        .eq('country_code', country.code);

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

export const getGlobalQuickStats = async (): Promise<QuickStat[]> => {
  // Total Ambassadors
  const { data: ambassadorsData, error: ambassadorsError } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'ambassador');

  if (ambassadorsError) throw ambassadorsError;

  const totalAmbassadors = ambassadorsData.length;

  // Scholarships Funded (partnered schools)
  const { data: scholarshipsData, error: scholarshipsError } = await supabase
    .from('schools')
    .select('id')
    .eq('status', 'partnered');

  if (scholarshipsError) throw scholarshipsError;

  const scholarshipsFunded = scholarshipsData.length;

  // Total Impact (students reached)
  const { data: visitsData, error: visitsError } = await supabase
    .from('visits')
    .select('students_reached');

  if (visitsError) throw visitsError;

  const totalImpact = visitsData.reduce((sum, visit) => sum + (visit.students_reached || 0), 0);

  // Active Countries
  const { data: countriesData, error: countriesError } = await supabase
    .from('countries')
    .select('code')
    .eq('active', true);

  if (countriesError) throw countriesError;

  const activeCountries = countriesData.length;

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
    }
  ];
};

export const getGlobalRecentActivities = async (): Promise<RecentActivity[]> => {
  // Get recent events
  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select(`
      id,
      name,
      event_date,
      countries!inner (name)
    `)
    .order('created_at', { ascending: false })
    .limit(4);

  if (eventsError) throw eventsError;

  // Get recent partnerships (schools becoming partnered)
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
    .order('partnership_date', { ascending: false })
    .limit(2);

  if (partnershipsError) throw partnershipsError;

  // Get recent visits
  const { data: visitsData, error: visitsError } = await supabase
    .from('visits')
    .select(`
      id,
      visit_date,
      students_reached,
      schools!inner (name, countries!inner (name))
    `)
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
