import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { XIcon, HeartIcon, InfoIcon } from 'lucide-react';
import { ChatBot } from '../ChatBot';
import { FloatingActionButton } from '../ui/FloatingActionButton';
interface DashboardLayoutProps {
  children: React.ReactNode;
}
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Determine current role from URL
  const getCurrentRole = () => {
    const path = location.pathname;
    if (path.includes('/management')) return 'management';
    if (path.includes('/country-lead')) return 'country_lead';
    if (path.includes('/ambassador')) return 'ambassador';
    if (path.includes('/support')) return 'support';
    return 'management';
  };
  const role = getCurrentRole();
  // Close sidebar on mobile when a navigation item is clicked
  const handleNavigation = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };
  return <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-20 bg-black/50 transition-opacity duration-200 ease-in-out lg:hidden ${sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setSidebarOpen(false)} />
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-ash-dark transition duration-200 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-4 lg:h-20">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-ash-gold">
              AfroScholarHub
            </span>
          </div>
          <button className="rounded-md p-2 text-white hover:bg-ash-teal/20 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <XIcon size={20} />
          </button>
        </div>
        <Sidebar currentRole={role} onNavigate={handleNavigation} />
      </div>
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} currentRole={role} />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-3 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <span>© 2025 AfroScholarHub</span>
            <span>•</span>
            <span className="flex items-center">
              <span className="mr-1">Made with</span>
              <HeartIcon size={14} className="text-red-500" />
              <span className="ml-1">in Africa</span>
            </span>
            <span>•</span>
            <span className="flex items-center">
              <InfoIcon size={14} className="mr-1" />
              <span>v1.2.0</span>
            </span>
          </div>
        </footer>
      </div>
      {/* Chatbot */}
      <ChatBot />
      {/* Floating Action Button */}
      <FloatingActionButton role={role} />
    </div>;
};