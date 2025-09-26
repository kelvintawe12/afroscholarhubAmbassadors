import React, { useEffect, useState, useRef } from 'react';
import { BellIcon, MenuIcon, SearchIcon, UserIcon, ChevronDownIcon, LogOutIcon, CrownIcon, FlagIcon, HandshakeIcon, SettingsIcon, HelpCircleIcon, CalendarIcon, XIcon, SchoolIcon, FileTextIcon, ClipboardIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
interface NavbarProps {
  toggleSidebar: () => void;
  currentRole: string;
}
export const Navbar = ({
  toggleSidebar,
  currentRole
}: NavbarProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchCategories, setSearchCategories] = useState<Record<string, any[]>>({});
  const [notifications, setNotifications] = useState([{
    id: 1,
    message: 'New school partnership request',
    time: '5 minutes ago',
    read: false
  }, {
    id: 2,
    message: 'Aisha completed her monthly targets',
    time: '1 hour ago',
    read: false
  }, {
    id: 3,
    message: 'Nigeria team meeting scheduled',
    time: 'Yesterday',
    read: true
  }]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const helpMenuRef = useRef<HTMLDivElement>(null);
  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close search results
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
      // Close profile menu
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      // Close notifications
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      // Close help menu
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
        setShowHelpMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'management':
        return 'Management Dashboard';
      case 'country_lead':
        return 'Country Lead Dashboard';
      case 'ambassador':
        return 'Ambassador Dashboard';
      case 'support':
        return 'Support Dashboard';
      default:
        return 'Dashboard';
    }
  };
  const unreadCount = notifications.filter(n => !n.read).length;
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  const switchRole = (role: string) => {
    navigate(`/dashboard/${role}`);
    setShowProfileMenu(false);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      // Simulate search results - in a real app, this would call an API
      const mockSchools = [{
        id: 1,
        type: 'school',
        name: 'Lagos Model School',
        location: 'Lagos, Nigeria',
        status: 'Partnered'
      }, {
        id: 2,
        type: 'school',
        name: 'Accra International Academy',
        location: 'Accra, Ghana',
        status: 'Prospect'
      }, {
        id: 3,
        type: 'school',
        name: 'Nairobi Secondary School',
        location: 'Nairobi, Kenya',
        status: 'Visited'
      }, {
        id: 4,
        type: 'school',
        name: 'Cape Town High School',
        location: 'Cape Town, South Africa',
        status: 'Partnered'
      }];
      const mockAmbassadors = [{
        id: 1,
        type: 'ambassador',
        name: 'Aisha Mohammed',
        role: 'Senior Ambassador',
        country: 'Nigeria'
      }, {
        id: 2,
        type: 'ambassador',
        name: 'Daniel Osei',
        role: 'Ambassador',
        country: 'Ghana'
      }, {
        id: 3,
        type: 'ambassador',
        name: 'James Mwangi',
        role: 'Ambassador',
        country: 'Kenya'
      }];
      const mockEvents = [{
        id: 1,
        type: 'event',
        name: 'Career Fair 2025',
        date: 'March 15, 2025',
        location: 'Lagos, Nigeria'
      }, {
        id: 2,
        type: 'event',
        name: 'Scholarship Workshop',
        date: 'April 10, 2025',
        location: 'Accra, Ghana'
      }, {
        id: 3,
        type: 'event',
        name: 'STEM Expo',
        date: 'May 22, 2025',
        location: 'Nairobi, Kenya'
      }];
      const mockDocuments = [{
        id: 1,
        type: 'document',
        name: 'Partnership Agreement Template',
        category: 'Legal',
        lastUpdated: '2 weeks ago'
      }, {
        id: 2,
        type: 'document',
        name: 'School Visit Guidelines',
        category: 'Procedures',
        lastUpdated: '1 month ago'
      }, {
        id: 3,
        type: 'document',
        name: 'Quarterly Report Q1 2025',
        category: 'Reports',
        lastUpdated: '3 days ago'
      }];
      // Filter all categories based on query
      const filteredSchools = mockSchools.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) || item.location.toLowerCase().includes(query.toLowerCase()));
      const filteredAmbassadors = mockAmbassadors.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) || item.country.toLowerCase().includes(query.toLowerCase()));
      const filteredEvents = mockEvents.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) || item.location.toLowerCase().includes(query.toLowerCase()));
      const filteredDocuments = mockDocuments.filter(item => item.name.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()));
      // Combine all results
      const allResults = [...filteredSchools, ...filteredAmbassadors, ...filteredEvents, ...filteredDocuments];
      // Group by category for organized display
      const categories: Record<string, any[]> = {
        schools: filteredSchools,
        ambassadors: filteredAmbassadors,
        events: filteredEvents,
        documents: filteredDocuments
      };
      setSearchResults(allResults);
      setSearchCategories(categories);
    } else {
      setSearchResults([]);
      setSearchCategories({});
    }
  };
  const handleSearchResultClick = (result: any) => {
    // Navigate based on result type
    switch (result.type) {
      case 'school':
        navigate(`/dashboard/${currentRole}/schools/${result.id}`);
        break;
      case 'ambassador':
        navigate(`/dashboard/${currentRole}/ambassadors/${result.id}`);
        break;
      case 'event':
        navigate(`/dashboard/${currentRole}/outreaches/events/${result.id}`);
        break;
      case 'document':
        navigate(`/dashboard/${currentRole}/resources/${result.id}`);
        break;
      default:
        break;
    }
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };
  const renderResultIcon = (type: string) => {
    switch (type) {
      case 'school':
        return <SchoolIcon size={16} />;
      case 'ambassador':
        return <UserIcon size={16} />;
      case 'event':
        return <CalendarIcon size={16} />;
      case 'document':
        return <FileTextIcon size={16} />;
      default:
        return <ClipboardIcon size={16} />;
    }
  };
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  return <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:px-6 lg:h-20">
      <div className="flex items-center">
        <button className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden" onClick={toggleSidebar}>
          <MenuIcon size={20} />
        </button>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">
            {getRoleTitle(currentRole)}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          </p>
        </div>
        {/* Mobile search toggle */}
        <button className="ml-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden" onClick={() => setShowSearch(!showSearch)}>
          <SearchIcon size={20} />
        </button>
        {/* Desktop search */}
        <div className="relative ml-4 hidden md:block lg:ml-8">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon size={18} className="text-gray-400" />
          </span>
          <input type="search" placeholder="Search schools, ambassadors, events..." className="w-64 rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal lg:w-80" value={searchQuery} onChange={handleSearchChange} />
          {/* Search results dropdown */}
          {Object.values(searchCategories).some(category => category.length > 0) && <div ref={searchResultsRef} className="absolute left-0 right-0 top-full mt-1 max-h-[80vh] overflow-y-auto rounded-md border border-gray-200 bg-white py-2 shadow-lg">
              {Object.entries(searchCategories).map(([category, results]) => results.length > 0 ? <div key={category} className="mb-2">
                    <h3 className="mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {category}
                    </h3>
                    {results.map(result => <button key={`${result.type}-${result.id}`} className="flex w-full items-start px-4 py-2 text-left hover:bg-gray-50" onClick={() => handleSearchResultClick(result)}>
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ash-teal/10 text-ash-teal">
                          {renderResultIcon(result.type)}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {result.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.type === 'school' && result.location}
                            {result.type === 'ambassador' && `${result.role} • ${result.country}`}
                            {result.type === 'event' && `${result.date} • ${result.location}`}
                            {result.type === 'document' && `${result.category} • ${result.lastUpdated}`}
                          </div>
                        </div>
                      </button>)}
                  </div> : null)}
              {searchQuery.length > 0 && searchResults.length === 0 && <div className="px-4 py-3 text-center text-sm text-gray-500">
                  No results found for "{searchQuery}"
                </div>}
            </div>}
        </div>
      </div>
      {/* Mobile search overlay */}
      {showSearch && <div className="fixed inset-0 z-20 bg-white p-4 md:hidden">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="text-lg font-medium text-gray-900">Search</h2>
            <button className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" onClick={() => setShowSearch(false)}>
              <XIcon size={20} />
            </button>
          </div>
          <div className="relative mt-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={18} className="text-gray-400" />
            </span>
            <input ref={searchInputRef} type="search" placeholder="Search schools, ambassadors, events..." className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-4 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal" value={searchQuery} onChange={handleSearchChange} />
          </div>
          {/* Mobile search results */}
          {Object.values(searchCategories).some(category => category.length > 0) ? <div className="mt-4">
              {Object.entries(searchCategories).map(([category, results]) => results.length > 0 ? <div key={category} className="mb-4">
                    <h3 className="mb-2 text-sm font-medium text-gray-500">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h3>
                    <div className="divide-y divide-gray-100">
                      {results.map(result => <button key={`${result.type}-${result.id}`} className="flex w-full items-start py-3 text-left" onClick={() => handleSearchResultClick(result)}>
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ash-teal/10 text-ash-teal">
                            {renderResultIcon(result.type)}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">
                              {result.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.type === 'school' && result.location}
                              {result.type === 'ambassador' && `${result.role} • ${result.country}`}
                              {result.type === 'event' && `${result.date} • ${result.location}`}
                              {result.type === 'document' && `${result.category} • ${result.lastUpdated}`}
                            </div>
                          </div>
                        </button>)}
                    </div>
                  </div> : null)}
            </div> : searchQuery.length > 0 ? <div className="mt-8 text-center text-gray-500">
              No results found for "{searchQuery}"
            </div> : <div className="mt-8 text-center text-gray-500">
              Try searching for schools, ambassadors, or events
            </div>}
        </div>}
      <div className="flex items-center space-x-1 md:space-x-4">
        {/* Calendar Button */}
        <button className="hidden rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:flex" onClick={() => navigate(`/dashboard/${currentRole}/outreaches/calendar`)}>
          <CalendarIcon size={20} />
        </button>
        {/* Help Button */}
        <div className="relative">
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" onClick={() => setShowHelpMenu(!showHelpMenu)}>
            <HelpCircleIcon size={20} />
          </button>
          {showHelpMenu && <div ref={helpMenuRef} className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              <button className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50" onClick={() => navigate('/help/documentation')}>
                <span>Documentation</span>
              </button>
              <button className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50" onClick={() => navigate('/help/tutorials')}>
                <span>Video Tutorials</span>
              </button>
              <button className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50" onClick={() => navigate('/help/support')}>
                <span>Contact Support</span>
              </button>
            </div>}
        </div>
        {/* Notifications */}
        <div className="relative">
          <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700" onClick={() => setShowNotifications(!showNotifications)}>
            <BellIcon size={20} />
            {unreadCount > 0 && <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </span>}
          </button>
          {showNotifications && <div ref={notificationsRef} className="absolute right-0 mt-2 w-80 rounded-md border border-gray-200 bg-white py-2 shadow-lg">
              <div className="border-b border-gray-100 px-4 py-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Notifications</h3>
                  <button className="text-xs font-medium text-ash-teal hover:text-ash-teal/80" onClick={markAllNotificationsAsRead}>
                    Mark all as read
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50/50' : ''}`}>
                    <p className="text-sm font-medium">
                      {notification.message}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                      {!notification.read && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          New
                        </span>}
                    </div>
                  </div>)}
              </div>
              <div className="border-t border-gray-100 px-4 py-2">
                <button className="w-full rounded-md border border-ash-teal bg-white px-3 py-1.5 text-xs font-medium text-ash-teal hover:bg-ash-teal/10">
                  View all notifications
                </button>
              </div>
            </div>}
        </div>
        {/* User Profile */}
        <div className="relative">
          <button className="flex items-center rounded-full text-sm focus:outline-none" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ash-teal text-white">
              <UserIcon size={18} />
            </div>
            <span className="ml-2 hidden text-sm font-medium md:block">
              John Okafor
            </span>
            <ChevronDownIcon size={16} className="ml-1 hidden md:block" />
          </button>
          {showProfileMenu && <div ref={profileMenuRef} className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-300 bg-white py-2 shadow-xl transition-all duration-200 ease-in-out">
              <div className="border-b border-gray-200 px-4 py-4">
                <p className="font-semibold text-gray-900">John Okafor</p>
                <p className="text-sm text-gray-600">john@afroscholarhub.org</p>
                <div className="mt-3">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    Active
                  </span>
                </div>
              </div>
              <div className="border-b border-gray-200 py-3">
                <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Switch Role
                </div>
                <button className="flex w-full items-center px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors duration-150" onClick={() => switchRole('management')}>
                  <CrownIcon size={16} className="mr-3 text-ash-gold" />
                  <span className="flex-1">Management</span>
                </button>
                <button className="flex w-full items-center px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors duration-150" onClick={() => switchRole('country-lead')}>
                  <FlagIcon size={16} className="mr-3 text-ash-teal" />
                  <span className="flex-1">Country Lead</span>
                </button>
                <button className="flex w-full items-center px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors duration-150" onClick={() => switchRole('ambassador')}>
                  <HandshakeIcon size={16} className="mr-3 text-ash-teal" />
                  <span className="flex-1">Ambassador</span>
                </button>
              </div>
              <div className="py-2">
                <button className="flex w-full items-center px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors duration-150 rounded-md" onClick={() => navigate(`/dashboard/${currentRole}/profile`)}>
                  <UserIcon size={16} className="mr-3 text-gray-600" />
                  <span className="flex-1">My Profile</span>
                </button>
                <button className="flex w-full items-center px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors duration-150 rounded-md" onClick={() => navigate(`/dashboard/${currentRole}/settings`)}>
                  <SettingsIcon size={16} className="mr-3 text-gray-600" />
                  <span className="flex-1">Settings</span>
                </button>
                <button className="flex w-full items-center px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 rounded-md" onClick={handleLogout}>
                  <LogOutIcon size={16} className="mr-3" />
                  <span className="flex-1">Log out</span>
                </button>
              </div>
            </div>}
        </div>
      </div>
    </header>;
};