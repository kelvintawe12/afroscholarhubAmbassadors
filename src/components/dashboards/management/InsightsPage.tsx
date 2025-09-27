import React from 'react';
import { PieChart } from '../../ui/widgets/PieChart';
import { BarChart } from '../../ui/widgets/BarChart';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { LightbulbIcon, TrendingUpIcon, BrainIcon, BarChart3Icon } from 'lucide-react';
import { getInsightsData } from '../../../api/management';
import { useDashboardData } from '../../../hooks/useDashboardData';

export const InsightsPage = () => {
  const { data: insights, loading, error } = useDashboardData(
    async () => await getInsightsData(),
    []
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div>Loading insights...</div></div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading insights: {error}</div>;
  }

  const kpiData = insights?.kpiData || [];
  const programDistributionData = insights?.programDistributionData || {
    labels: ['Academic Support', 'Career Guidance', 'Mentorship', 'Scholarships', 'Workshops'],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(38, 162, 105, 0.8)', 'rgba(108, 92, 231, 0.8)', 'rgba(225, 112, 85, 0.8)']
    }]
  };
  const studentEngagementData = insights?.studentEngagementData || {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'High Engagement',
      data: [0, 0, 0, 0],
      backgroundColor: 'rgba(38, 162, 105, 0.8)'
    }, {
      label: 'Medium Engagement',
      data: [0, 0, 0, 0],
      backgroundColor: 'rgba(244, 196, 48, 0.8)'
    }, {
      label: 'Low Engagement',
      data: [0, 0, 0, 0],
      backgroundColor: 'rgba(225, 112, 85, 0.8)'
    }]
  };

  const keyFindings = insights?.keyFindings || [];
  const growthOpportunities = insights?.growthOpportunities || [];
  const aiRecommendations = insights?.aiRecommendations || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights Dashboard</h1>
        <p className="text-sm text-gray-500">
          Advanced analytics and predictive insights for strategic decision-making
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi: any, index: number) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            icon={<TrendingUpIcon size={20} />}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PieChart title="Program Impact Distribution" data={programDistributionData} />
        <BarChart title="Quarterly Student Engagement" data={studentEngagementData} />
      </div>

      {/* Key Insights Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center text-lg font-medium text-gray-900">
            <LightbulbIcon size={20} className="mr-2 text-ash-teal" />
            Key Findings
          </h3>
          <ul className="space-y-3">
            {keyFindings.map((finding: string, index: number) => (
              <li key={index} className="rounded-md bg-ash-teal/5 p-3 text-sm">
                <span className="font-medium text-ash-teal">
                  {finding.split(':')[0]}:
                </span>{' '}
                {finding.split(':')[1]}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center text-lg font-medium text-gray-900">
            <TrendingUpIcon size={20} className="mr-2 text-ash-gold" />
            Growth Opportunities
          </h3>
          <ul className="space-y-3">
            {growthOpportunities.map((opportunity: string, index: number) => (
              <li key={index} className="rounded-md bg-ash-gold/5 p-3 text-sm">
                <span className="font-medium text-ash-gold">
                  {opportunity.split(':')[0]}:
                </span>{' '}
                {opportunity.split(':')[1]}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center text-lg font-medium text-gray-900">
            <BrainIcon size={20} className="mr-2 text-green-600" />
            AI Recommendations
          </h3>
          <ul className="space-y-3">
            {aiRecommendations.map((recommendation: string, index: number) => (
              <li key={index} className="rounded-md bg-green-50 p-3 text-sm">
                <span className="font-medium text-green-600">
                  {recommendation.split(':')[0]}:
                </span>{' '}
                {recommendation.split(':')[1]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
