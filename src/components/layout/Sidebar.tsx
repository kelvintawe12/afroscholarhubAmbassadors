import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { LayoutDashboardIcon, UsersIcon, SchoolIcon, CalendarIcon, FileTextIcon, SettingsIcon, ChevronRightIcon, CheckSquareIcon, FolderIcon, BarChart3Icon, MessageSquareIcon, HelpCircleIcon, ClipboardListIcon, FileIcon, ShieldIcon, UserPlusIcon, InboxIcon, BookOpenIcon, LineChartIcon } from 'lucide-react';
interface SidebarProps {
  currentRole: string;
  onNavigate: () => void;
}
export const Sidebar = ({
  currentRole,
  onNavigate
}: SidebarProps) => {
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };
  const renderManagementSidebar = () => <nav className="mt-2 px-2">
      <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Main
      </div>
      <SidebarSection title="Overview" icon={<LayoutDashboardIcon size={18} />} expanded={expandedSection === 'overview'} onClick={() => toggleSection('overview')} active={isActive('/management')}>
        <SidebarItem title="Dashboard" href="/dashboard/management" active={isActive('/management') && !isActive('/management/')} onNavigate={onNavigate} />
        <SidebarItem title="Analytics" href="/dashboard/management/analytics" active={isActive('/management/analytics')} onNavigate={onNavigate} />
        <SidebarItem title="Insights" href="/dashboard/management/insights" active={isActive('/management/insights')} onNavigate={onNavigate} />
      </SidebarSection>
      <SidebarSection title="Ambassadors" icon={<UsersIcon size={18} />} expanded={expandedSection === 'ambassadors'} onClick={() => toggleSection('ambassadors')} active={isActive('/management/ambassadors')}>
        <SidebarItem title="Directory" href="/dashboard/management/ambassadors" active={isActive('/management/ambassadors')} onNavigate={onNavigate} />
        <SidebarItem title="Performance" href="/dashboard/management/ambassadors/performance" active={isActive('/management/ambassadors/performance')} onNavigate={onNavigate} />
        <SidebarItem title="Training" href="/dashboard/management/ambassadors/training" active={isActive('/management/ambassadors/training')} onNavigate={onNavigate} />
      </SidebarSection>
      <SidebarSection title="Users" icon={<UsersIcon size={18} />} expanded={expandedSection === 'users'} onClick={() => toggleSection('users')} active={isActive('/management/users')}>
        <SidebarItem title="Directory" href="/dashboard/management/users" active={isActive('/management/users')} onNavigate={onNavigate} />
      </SidebarSection>
      <SidebarSection title="Schools" icon={<SchoolIcon size={18} />} expanded={expandedSection === 'schools'} onClick={() => toggleSection('schools')} active={isActive('/management/schools')}>
        <SidebarItem title="Master Sheet" href="/dashboard/management/schools" active={isActive('/management/schools')} onNavigate={onNavigate} />
        <SidebarItem title="Partnerships" href="/dashboard/management/schools/partnerships" active={isActive('/management/schools/partnerships')} onNavigate={onNavigate} />
        <SidebarItem title="Prospects" href="/dashboard/management/schools/prospects" active={isActive('/management/schools/prospects')} onNavigate={onNavigate} />
      </SidebarSection>
      <SidebarSection title="Outreaches" icon={<CalendarIcon size={18} />} expanded={expandedSection === 'outreaches'} onClick={() => toggleSection('outreaches')} active={isActive('/management/outreaches')}>
        <SidebarItem title="Events" href="/dashboard/management/outreaches/events" active={isActive('/management/outreaches/events')} onNavigate={onNavigate} />
        <SidebarItem title="Pipeline" href="/dashboard/management/outreaches/pipeline" active={isActive('/management/outreaches/pipeline')} onNavigate={onNavigate} />
        <SidebarItem title="Calendar" href="/dashboard/management/outreaches/calendar" active={isActive('/management/outreaches/calendar')} onNavigate={onNavigate} />
      </SidebarSection>
      <SidebarSection title="Reports" icon={<FileTextIcon size={18} />} expanded={expandedSection === 'reports'} onClick={() => toggleSection('reports')} active={isActive('/management/reports')}>
        <SidebarItem title="Weekly" href="/dashboard/management/reports/weekly" active={isActive('/management/reports/weekly')} onNavigate={onNavigate} />
        <SidebarItem title="Monthly" href="/dashboard/management/reports/monthly" active={isActive('/management/reports/monthly')} onNavigate={onNavigate} />
        <SidebarItem title="Quarterly" href="/dashboard/management/reports/quarterly" active={isActive('/management/reports/quarterly')} onNavigate={onNavigate} />
        <SidebarItem title="Custom" href="/dashboard/management/reports/custom" active={isActive('/management/reports/custom')} onNavigate={onNavigate} />
      </SidebarSection>
      <div className="my-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        System
      </div>
      <SidebarItem title="Settings" icon={<SettingsIcon size={18} />} href="/dashboard/management/settings" active={isActive('/management/settings')} onNavigate={onNavigate} />
    </nav>;
  const renderCountryLeadSidebar = () => {
    const params = useParams<{ countryCode?: string }>();
    const countryCode = params.countryCode || 'ng';
    return <nav className="mt-2 px-2">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Operations
        </div>
        <SidebarItem title="My Team" icon={<UsersIcon size={18} />} href={`/dashboard/country-lead/${countryCode}/team`} active={isActive(`/country-lead/${countryCode}/team`)} onNavigate={onNavigate} />
        <SidebarItem title="School Pipeline" icon={<SchoolIcon size={18} />} href={`/dashboard/country-lead/${countryCode}/pipeline`} active={isActive(`/country-lead/${countryCode}/pipeline`)} onNavigate={onNavigate} />
        <SidebarItem title="Events" icon={<CalendarIcon size={18} />} href={`/dashboard/country-lead/${countryCode}/events`} active={isActive(`/country-lead/${countryCode}/events`)} onNavigate={onNavigate} />
        <SidebarItem title="Resources" icon={<FolderIcon size={18} />} href={`/dashboard/country-lead/${countryCode}/resources`} active={isActive(`/country-lead/${countryCode}/resources`)} onNavigate={onNavigate} />
        <SidebarItem title="Training" icon={<FileTextIcon size={18} />} href={`/dashboard/country-lead/${countryCode}/training`} active={isActive(`/country-lead/${countryCode}/training`)} onNavigate={onNavigate} />
        <SidebarItem title="Escalations" icon={<MessageSquareIcon size={18} />} href={`/dashboard/country-lead/${countryCode}/escalations`} active={isActive(`/country-lead/${countryCode}/escalations`)} onNavigate={onNavigate} />
        <div className="my-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Insights
        </div>
        <SidebarItem title="Global Peek" icon={<BarChart3Icon size={18} />} href={`/dashboard/country-lead/${countryCode}/global`} active={isActive(`/country-lead/${countryCode}/global`)} onNavigate={onNavigate} />
        <SidebarItem title="Reports" icon={<FileTextIcon size={18} />} href={`/dashboard/country-lead/${countryCode}/reports`} active={isActive(`/country-lead/${countryCode}/reports`)} onNavigate={onNavigate} />
      </nav>;
  };
  const renderAmbassadorSidebar = () => <nav className="mt-2 px-2">
      <SidebarItem title="My Tasks" icon={<CheckSquareIcon size={18} />} href="/dashboard/ambassador/tasks" active={isActive('/ambassador/tasks')} onNavigate={onNavigate} />
      <SidebarItem title="My Schools" icon={<SchoolIcon size={18} />} href="/dashboard/ambassador/schools" active={isActive('/ambassador/schools')} onNavigate={onNavigate} />
      <SidebarItem title="Activity Log" icon={<ClipboardListIcon size={18} />} href="/dashboard/ambassador/activity" active={isActive('/ambassador/activity')} onNavigate={onNavigate} />
      <SidebarItem title="Resources" icon={<BookOpenIcon size={18} />} href="/dashboard/ambassador/resources" active={isActive('/ambassador/resources')} onNavigate={onNavigate} />
      <SidebarItem title="Training" icon={<FileTextIcon size={18} />} href="/dashboard/ambassador/training" active={isActive('/ambassador/training')} onNavigate={onNavigate} />
      <SidebarItem title="My Impact" icon={<LineChartIcon size={18} />} href="/dashboard/ambassador/impact" active={isActive('/ambassador/impact')} onNavigate={onNavigate} />
      <SidebarItem title="Support" icon={<HelpCircleIcon size={18} />} href="/dashboard/ambassador/support" active={isActive('/ambassador/support')} onNavigate={onNavigate} />
    </nav>;
  const renderSupportSidebar = () => <nav className="mt-2 px-2">
      <SidebarItem title="Queues" icon={<InboxIcon size={18} />} href="/dashboard/support/queues" active={isActive('/support/queues')} onNavigate={onNavigate} />
      <SidebarItem title="Resources" icon={<FolderIcon size={18} />} href="/dashboard/support/resources" active={isActive('/support/resources')} onNavigate={onNavigate} />
      <SidebarItem title="Reports" icon={<FileIcon size={18} />} href="/dashboard/support/reports" active={isActive('/support/reports')} onNavigate={onNavigate} />
      <SidebarItem title="Moderation" icon={<ShieldIcon size={18} />} href="/dashboard/support/moderation" active={isActive('/support/moderation')} onNavigate={onNavigate} />
      <SidebarItem title="Audits" icon={<ClipboardListIcon size={18} />} href="/dashboard/support/audits" active={isActive('/support/audits')} onNavigate={onNavigate} />
      <SidebarItem title="Team Directory" icon={<UserPlusIcon size={18} />} href="/dashboard/support/directory" active={isActive('/support/directory')} onNavigate={onNavigate} />
    </nav>;
  return <div className="h-full overflow-y-auto bg-ash-dark py-4 text-white">
      {currentRole === 'management' && renderManagementSidebar()}
      {currentRole === 'country_lead' && renderCountryLeadSidebar()}
      {currentRole === 'ambassador' && renderAmbassadorSidebar()}
      {currentRole === 'support' && renderSupportSidebar()}
      <div className="mt-auto px-4 py-6">
        <div className="rounded-lg bg-ash-teal/20 p-4">
          <h4 className="font-medium">Need Help?</h4>
          <p className="mt-1 text-sm text-gray-300">
            Check our documentation or contact support for assistance.
          </p>
          <button className="mt-3 w-full rounded-md bg-ash-gold px-3 py-1.5 text-sm font-medium text-ash-dark hover:bg-yellow-400">
            View Documentation
          </button>
        </div>
      </div>
    </div>;
};
interface SidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  expanded: boolean;
  onClick: () => void;
  active: boolean;
}
const SidebarSection = ({
  title,
  icon,
  children,
  expanded,
  onClick,
  active
}: SidebarSectionProps) => {
  return <div className="mb-1">
      <button className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${active ? 'bg-ash-teal text-white' : 'text-gray-300 hover:bg-ash-teal/20 hover:text-white'}`} onClick={onClick}>
        <div className="flex items-center">
          <span className="mr-2">{icon}</span>
          <span>{title}</span>
        </div>
        <ChevronRightIcon size={16} className={`transform transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && <div className="mt-1 pl-6">{children}</div>}
    </div>;
};
interface SidebarItemProps {
  title: string;
  href: string;
  active: boolean;
  icon?: React.ReactNode;
  onNavigate: () => void;
}
const SidebarItem = ({
  title,
  href,
  active,
  icon,
  onNavigate
}: SidebarItemProps) => {
  return <Link to={href} className={`flex items-center rounded-md px-3 py-2 text-sm ${active ? 'bg-ash-teal text-white' : 'text-gray-300 hover:bg-ash-teal/20 hover:text-white'}`} onClick={onNavigate}>
      {icon && <span className="mr-2">{icon}</span>}
      <span>{title}</span>
    </Link>;
};