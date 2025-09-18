import React from 'react';
import { ClipboardIcon, CheckCircleIcon, AlertCircleIcon, MessageSquareIcon, FileTextIcon, PlusIcon } from 'lucide-react';
interface Activity {
  id: number | string;
  type: string;
  title: string;
  description?: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  status?: string;
}
interface ActivityFeedProps {
  title: string;
  activities: Activity[];
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}
export const ActivityFeed = ({
  title,
  activities,
  maxItems = 5,
  showViewAll = true,
  onViewAll
}: ActivityFeedProps) => {
  const displayedActivities = maxItems ? activities.slice(0, maxItems) : activities;
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <ClipboardIcon size={16} className="text-blue-500" />;
      case 'partnership':
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case 'task':
        return <AlertCircleIcon size={16} className="text-yellow-500" />;
      case 'note':
        return <MessageSquareIcon size={16} className="text-purple-500" />;
      case 'document':
        return <FileTextIcon size={16} className="text-gray-500" />;
      default:
        return <PlusIcon size={16} className="text-gray-500" />;
    }
  };
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    switch (status) {
      case 'completed':
        return <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            Completed
          </span>;
      case 'pending':
        return <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
            Pending
          </span>;
      case 'failed':
        return <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
            Failed
          </span>;
      default:
        return <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>;
    }
  };
  return <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-base font-medium text-gray-700">{title}</h3>
      {activities.length === 0 ? <div className="flex h-32 items-center justify-center text-center text-sm text-gray-500">
          No recent activity to display
        </div> : <div className="space-y-4">
          {displayedActivities.map(activity => <div key={activity.id} className="border-l-2 border-ash-teal/30 pl-4">
              <div className="flex items-start">
                <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ash-teal/10">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium text-gray-900">
                      {activity.title}
                    </p>
                    {getStatusBadge(activity.status)}
                  </div>
                  {activity.description && <p className="mt-0.5 text-sm text-gray-600">
                      {activity.description}
                    </p>}
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    {activity.user && <span className="font-medium">{activity.user.name}</span>}
                    {activity.user && <span className="mx-1">•</span>}
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>)}
        </div>}
      {showViewAll && activities.length > maxItems && <div className="mt-4 text-center">
          <button onClick={onViewAll} className="text-sm font-medium text-ash-teal hover:text-ash-teal/80">
            View all activity
          </button>
        </div>}
    </div>;
};