import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DownloadIcon, InfoIcon } from 'lucide-react';
// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
interface BarChartProps {
  title: string;
  data: ChartData<'bar'> | null;
  subtitle?: string;
  height?: number;
  showLegend?: boolean;
}
export const BarChart = ({
  title,
  data,
  subtitle,
  height = 300,
  showLegend = true
}: BarChartProps) => {
  if (!data) {
    return <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-gray-500">No data available</p>
      </div>;
  }
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle'
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
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 10
          },
          precision: 0
        }
      }
    }
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
    }}>
        <Bar options={options} data={data} />
      </div>
    </div>;
};