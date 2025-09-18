import React, { useEffect, useState } from 'react';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { BarChart } from '../../ui/widgets/BarChart';
import { UsersIcon, SchoolIcon, TrophyIcon } from 'lucide-react';
import { getAmbassadorImpactMetrics } from '../../../api/ambassador';

export const ImpactPage = () => {
  const [metrics, setMetrics] = useState<{ totalStudents: number; schoolCount: number; partnershipCount: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        // Replace 'current-user-id' with actual ambassador ID in real app
        const data = await getAmbassadorImpactMetrics('current-user-id');
        setMetrics(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching impact metrics:', error);
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // Prepare data for BarChart
  const chartData = metrics
    ? {
        labels: ['Total Students', 'Schools', 'Partnerships'],
        datasets: [
          {
            label: 'Count',
            data: [metrics.totalStudents, metrics.schoolCount, metrics.partnershipCount],
            backgroundColor: ['#34D399', '#60A5FA', '#FBBF24']
          }
        ]
      }
    : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Impact</h1>
        <p className="text-sm text-gray-500">
          Overview of your impact metrics and achievements
        </p>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-ash-teal border-t-transparent"></div>
        </div>
      )}

      {!isLoading && metrics && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KpiCard
              title="Students Reached"
              value={metrics.totalStudents.toString()}
              icon={<UsersIcon size={20} />}
              color="bg-green-400"
            />
            <KpiCard
              title="Schools"
              value={metrics.schoolCount.toString()}
              icon={<SchoolIcon size={20} />}
              color="bg-blue-400"
            />
            <KpiCard
              title="Partnerships"
              value={metrics.partnershipCount.toString()}
              icon={<TrophyIcon size={20} />}
              color="bg-yellow-400"
            />
          </div>

          <BarChart title="Impact Overview" data={chartData} height={300} />
        </>
      )}
    </div>
  );
};
