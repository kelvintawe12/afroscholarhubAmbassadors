import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Escalation, EscalationStat, EscalationActivity } from '../types';
import { useApi } from './useApi';
import {
  getCountryEscalations,
  getEscalationStats,
  createEscalation,
  updateEscalation,
  assignEscalation,
  resolveEscalation,
  getEscalationActivities
} from '../api/escalations';

// Generic hook for escalation data with loading and error states
export const useEscalationData = <T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching escalation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

// Country Lead Escalations Hook
export const useCountryEscalations = (countryCode: string) => {
  return useEscalationData<Escalation[]>(
    () => getCountryEscalations(countryCode),
    [countryCode]
  );
};

// Escalation Stats Hook
export const useEscalationStats = (countryCode: string) => {
  return useEscalationData(
    () => getEscalationStats(countryCode),
    [countryCode]
  );
};

// Escalation Activities Hook
export const useEscalationActivities = (countryCode: string, limit: number = 20) => {
  return useEscalationData<EscalationActivity[]>(
    () => getEscalationActivities(countryCode, limit),
    [countryCode, limit]
  );
};

// Create Escalation Hook
export const useCreateEscalation = () => {
  return useApi(createEscalation);
};

// Update Escalation Hook
export const useUpdateEscalation = () => {
  return useApi(updateEscalation);
};

// Assign Escalation Hook
export const useAssignEscalation = () => {
  return useApi(assignEscalation);
};

// Resolve Escalation Hook
export const useResolveEscalation = () => {
  return useApi(resolveEscalation);
};

// Hook for formatted escalation stats (for KPI cards)
export const useEscalationStatsFormatted = (countryCode: string) => {
  const { data: stats, loading, error } = useEscalationStats(countryCode);

  const formattedStats = stats ? [
    {
      title: 'Total Escalations',
      value: stats.totalEscalations.toString(),
      icon: 'AlertTriangle',
      trend: '+12%',
      color: 'text-red-600'
    },
    {
      title: 'Open Escalations',
      value: stats.openEscalations.toString(),
      icon: 'Clock',
      trend: '-5%',
      color: 'text-orange-600'
    },
    {
      title: 'Resolved This Month',
      value: stats.resolvedThisMonth.toString(),
      icon: 'CheckCircle',
      trend: '+8%',
      color: 'text-green-600'
    },
    {
      title: 'Avg Resolution Time',
      value: `${stats.avgResolutionTime}h`,
      icon: 'Timer',
      trend: '-15%',
      color: 'text-blue-600'
    }
  ] : [];

  return { data: formattedStats, loading, error };
};

// Hook for escalation priority distribution
export const useEscalationPriorityDistribution = (countryCode: string) => {
  const { data: escalations } = useCountryEscalations(countryCode);

  const priorityData = escalations ? escalations.reduce((acc, esc) => {
    acc[esc.priority] = (acc[esc.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) : {};

  return {
    labels: Object.keys(priorityData),
    datasets: [{
      data: Object.values(priorityData),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)', // Critical - red
        'rgba(245, 101, 101, 0.8)', // High - red-400
        'rgba(251, 146, 60, 0.8)', // Medium - orange
        'rgba(34, 197, 94, 0.8)' // Low - green
      ]
    }]
  };
};

// Hook for escalation status distribution
export const useEscalationStatusDistribution = (countryCode: string) => {
  const { data: escalations } = useCountryEscalations(countryCode);

  const statusData = escalations ? escalations.reduce((acc, esc) => {
    acc[esc.status] = (acc[esc.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) : {};

  return {
    labels: Object.keys(statusData),
    datasets: [{
      label: 'Escalations by Status',
      data: Object.values(statusData),
      backgroundColor: 'rgba(26, 95, 122, 0.8)'
    }]
  };
};

// Hook for escalation trends over time
export const useEscalationTrends = (countryCode: string) => {
  const { data: escalations } = useCountryEscalations(countryCode);

  const monthlyData = escalations ? escalations.reduce((acc: any, esc) => {
    const month = new Date(esc.created_at).toLocaleDateString('en-US', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {}) : {};

  return {
    labels: Object.keys(monthlyData),
    datasets: [{
      label: 'Escalations Created',
      data: Object.values(monthlyData),
      borderColor: '#1A5F7A',
      backgroundColor: 'rgba(26, 95, 122, 0.1)'
    }]
  };
};
