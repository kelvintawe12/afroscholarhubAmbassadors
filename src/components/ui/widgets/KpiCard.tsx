import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  subtitle?: string;
}
export const KpiCard = ({
  title,
  value,
  icon,
  change,
  subtitle
}: KpiCardProps) => {
  return <div className="rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center">
        {icon && <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ash-teal/10 text-ash-teal">
            {icon}
          </div>}
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-center">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {change !== undefined && <span className={`ml-2 flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? <>
                    <ArrowUpIcon size={14} className="mr-0.5" />+{change}%
                  </> : <>
                    <ArrowDownIcon size={14} className="mr-0.5" />
                    {change}%
                  </>}
              </span>}
          </div>
          {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>;
};