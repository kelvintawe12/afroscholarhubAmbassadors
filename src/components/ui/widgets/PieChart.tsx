import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { DownloadIcon, InfoIcon } from 'lucide-react';
// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);
interface PieChartProps {
  title: string;
  data: ChartData<'pie'> | null;
  subtitle?: string;
  height?: number;
  showLegend?: boolean;
}
export const PieChart = ({
  title,
  data,
  subtitle,
  height = 300,
  showLegend = true
}: PieChartProps) => {
  if (!data) {
    return <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-gray-500">No data available</p>
      </div>;
  }
  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: {
          size: 12
        },
        bodyFont: {
          size: 12
        },
        cornerRadius: 4,
        displayColors: true
      }
    },
    cutout: '0%'
  };
  return <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-700">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex space-x-2">
          <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
            <InfoIcon size={16} />
          </button>
          <button className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
            <DownloadIcon size={16} />
          </button>
        </div>
      </div>
      <div style={{
      height: `${height}px`
    }} className="flex items-center justify-center">
        <Pie options={options} data={data} />
      </div>
    </div>;
};