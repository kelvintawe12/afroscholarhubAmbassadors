import React from 'react';
import { PieChart } from '../../ui/widgets/PieChart';
import { BarChart } from '../../ui/widgets/BarChart';
import { KpiCard } from '../../ui/widgets/KpiCard';
import { LightbulbIcon, TrendingUpIcon, BrainIcon, BarChart3Icon } from 'lucide-react';
export const InsightsPage = () => {
  // Mock data for KPI cards
  const kpiData = [{
    title: 'Student Retention',
    value: '87%',
    change: 5,
    icon: <TrendingUpIcon size={20} />
  }, {
    title: 'Ambassador Efficiency',
    value: '76%',
    change: 3,
    icon: <LightbulbIcon size={20} />
  }, {
    title: 'Program Effectiveness',
    value: '92%',
    change: 8,
    icon: <BrainIcon size={20} />
  }, {
    title: 'ROI Score',
    value: '3.8x',
    change: 12,
    icon: <BarChart3Icon size={20} />
  }];
  // Mock data for charts
  const programDistributionData = {
    labels: ['Academic Support', 'Career Guidance', 'Mentorship', 'Scholarships', 'Workshops'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: ['rgba(26, 95, 122, 0.8)', 'rgba(244, 196, 48, 0.8)', 'rgba(38, 162, 105, 0.8)', 'rgba(108, 92, 231, 0.8)', 'rgba(225, 112, 85, 0.8)']
    }]
  };
  const studentEngagementData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'High Engagement',
      data: [45, 52, 60, 70],
      backgroundColor: 'rgba(38, 162, 105, 0.8)'
    }, {
      label: 'Medium Engagement',
      data: [30, 35, 25, 20],
      backgroundColor: 'rgba(244, 196, 48, 0.8)'
    }, {
      label: 'Low Engagement',
      data: [25, 13, 15, 10],
      backgroundColor: 'rgba(225, 112, 85, 0.8)'
    }]
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights Dashboard</h1>
        <p className="text-sm text-gray-500">
          Advanced analytics and predictive insights for strategic
          decision-making
        </p>
      </div>
      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => <KpiCard key={index} title={kpi.title} value={kpi.value} change={kpi.change} icon={kpi.icon} />)}
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
            <li className="rounded-md bg-ash-teal/5 p-3 text-sm">
              <span className="font-medium text-ash-teal">
                Ambassador Efficiency:
              </span>{' '}
              Ambassadors with regular training sessions show 32% higher
              conversion rates.
            </li>
            <li className="rounded-md bg-ash-teal/5 p-3 text-sm">
              <span className="font-medium text-ash-teal">
                School Partnerships:
              </span>{' '}
              Schools with dedicated contact persons maintain 45% longer
              partnerships.
            </li>
            <li className="rounded-md bg-ash-teal/5 p-3 text-sm">
              <span className="font-medium text-ash-teal">
                Regional Trends:
              </span>{' '}
              Urban schools in Nigeria show highest engagement but rural schools
              show highest growth.
            </li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center text-lg font-medium text-gray-900">
            <TrendingUpIcon size={20} className="mr-2 text-ash-gold" />
            Growth Opportunities
          </h3>
          <ul className="space-y-3">
            <li className="rounded-md bg-ash-gold/5 p-3 text-sm">
              <span className="font-medium text-ash-gold">
                Ghana Expansion:
              </span>{' '}
              Data suggests 40% untapped potential in northern regions of Ghana.
            </li>
            <li className="rounded-md bg-ash-gold/5 p-3 text-sm">
              <span className="font-medium text-ash-gold">
                Mentorship Program:
              </span>{' '}
              Students in mentorship show 28% higher scholarship application
              rates.
            </li>
            <li className="rounded-md bg-ash-gold/5 p-3 text-sm">
              <span className="font-medium text-ash-gold">
                Digital Outreach:
              </span>{' '}
              Virtual events reach 3x more students at 1/5th the cost of
              in-person events.
            </li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h3 className="mb-3 flex items-center text-lg font-medium text-gray-900">
            <BrainIcon size={20} className="mr-2 text-green-600" />
            AI Recommendations
          </h3>
          <ul className="space-y-3">
            <li className="rounded-md bg-green-50 p-3 text-sm">
              <span className="font-medium text-green-600">
                Resource Allocation:
              </span>{' '}
              Shift 15% of Kenya budget to workshop programs for optimal ROI.
            </li>
            <li className="rounded-md bg-green-50 p-3 text-sm">
              <span className="font-medium text-green-600">
                Ambassador Training:
              </span>{' '}
              Focus Q3 training on digital engagement skills based on
              performance data.
            </li>
            <li className="rounded-md bg-green-50 p-3 text-sm">
              <span className="font-medium text-green-600">
                Outreach Timing:
              </span>{' '}
              Schedule major events in April-May for 23% higher attendance
              rates.
            </li>
          </ul>
        </div>
      </div>
    </div>;
};