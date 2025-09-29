import React, { useEffect, useState } from 'react';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { BarChart } from '../../ui/widgets/BarChart';
import { LineChart } from '../../ui/widgets/LineChart';
import { PieChart } from '../../ui/widgets/PieChart';
import { UsersIcon, SchoolIcon, TrophyIcon, CheckSquareIcon, MapPinIcon, TargetIcon, TrendingUpIcon } from 'lucide-react';
import {
  getAmbassadorImpactMetrics,
  getAmbassadorTasksCompleted,
  getAmbassadorVisitsCount,
  getAmbassadorLeadsGenerated
} from '../../../api/ambassador';
import { useAuth } from '../../../hooks/useAuth';

export const ImpactPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<{
    totalStudents: number;
    schoolCount: number;
    partnershipCount: number;
    tasksCompleted: number;
    visitsCount: number;
    leadsGenerated: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const impactMetrics = await getAmbassadorImpactMetrics(user.id);
        const tasksCompleted = await getAmbassadorTasksCompleted(user.id);
        const visitsCount = await getAmbassadorVisitsCount(user.id);
        const leadsGenerated = await getAmbassadorLeadsGenerated(user.id);

        setMetrics({
          totalStudents: impactMetrics.totalStudents,
          schoolCount: impactMetrics.schoolCount,
          partnershipCount: impactMetrics.partnershipCount,
          tasksCompleted,
          visitsCount,
          leadsGenerated
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching impact metrics:', error);
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, [user?.id]);

  // Prepare data for BarChart
  const barChartData = metrics
    ? {
        labels: ['Students Reached', 'Schools Visited', 'Partnerships', 'Tasks Completed', 'Leads Generated'],
        datasets: [
          {
            label: 'Impact Metrics',
            data: [metrics.totalStudents, metrics.schoolCount, metrics.partnershipCount, metrics.tasksCompleted, metrics.leadsGenerated],
            backgroundColor: ['#34D399', '#60A5FA', '#FBBF24', '#10B981', '#F59E0B']
          }
        ]
      }
    : null;

  // Prepare data for LineChart (current metrics as single point)
  const lineChartData = metrics
    ? {
        labels: ['Current'],
        datasets: [
          {
            label: 'Students Reached',
            data: [metrics.totalStudents],
            borderColor: '#34D399',
            backgroundColor: 'rgba(52, 211, 153, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Schools Visited',
            data: [metrics.schoolCount],
            borderColor: '#60A5FA',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    : null;

  // Prepare data for PieChart (activity breakdown with real data)
  const pieChartData = metrics
    ? {
        labels: ['School Visits', 'Task Completions', 'Partnerships', 'Leads Generated'],
        datasets: [
          {
            data: [metrics.visitsCount, metrics.tasksCompleted, metrics.partnershipCount, metrics.leadsGenerated],
            backgroundColor: [
              '#10B981',
              '#3B82F6',
              '#F59E0B',
              '#8B5CF6'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
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
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              title="Students Reached"
              value={metrics.totalStudents.toString()}
              icon={<UsersIcon size={20} />}
              color="bg-green-400"
            />
            <KpiCard
              title="Schools Visited"
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
            <KpiCard
              title="Tasks Completed"
              value={metrics.tasksCompleted.toString()}
              icon={<CheckSquareIcon size={20} />}
              color="bg-purple-400"
            />
            <KpiCard
              title="School Visits"
              value={metrics.visitsCount.toString()}
              icon={<MapPinIcon size={20} />}
              color="bg-indigo-400"
            />
            <KpiCard
              title="Leads Generated"
              value={metrics.leadsGenerated.toString()}
              icon={<TargetIcon size={20} />}
              color="bg-orange-400"
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BarChart title="Impact Overview" data={barChartData} height={300} />
            <PieChart title="Activity Breakdown" data={pieChartData} height={300} subtitle="Current activity distribution" />
          </div>

          <LineChart title="Current Impact" data={lineChartData} height={300} subtitle="Current metrics overview" />
        </>
      )}
    </div>
  );
};
