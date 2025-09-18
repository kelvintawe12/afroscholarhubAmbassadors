import React, { useState } from 'react';
import { PlusIcon, SchoolIcon, CalendarIcon, ClipboardListIcon, UserPlusIcon, XIcon } from 'lucide-react';
interface FloatingActionButtonProps {
  role: string;
}
export const FloatingActionButton = ({
  role
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  // Define actions based on user role
  const getActions = () => {
    switch (role) {
      case 'management':
        return [{
          icon: <SchoolIcon size={18} />,
          label: 'Add School',
          action: () => console.log('Add School')
        }, {
          icon: <UserPlusIcon size={18} />,
          label: 'Add Ambassador',
          action: () => console.log('Add Ambassador')
        }, {
          icon: <CalendarIcon size={18} />,
          label: 'Schedule Event',
          action: () => console.log('Schedule Event')
        }];
      case 'country_lead':
        return [{
          icon: <SchoolIcon size={18} />,
          label: 'Add School',
          action: () => console.log('Add School')
        }, {
          icon: <CalendarIcon size={18} />,
          label: 'Schedule Event',
          action: () => console.log('Schedule Event')
        }, {
          icon: <UserPlusIcon size={18} />,
          label: 'Add Team Member',
          action: () => console.log('Add Team Member')
        }];
      case 'ambassador':
        return [{
          icon: <SchoolIcon size={18} />,
          label: 'Log Visit',
          action: () => console.log('Log Visit')
        }, {
          icon: <ClipboardListIcon size={18} />,
          label: 'Add Task',
          action: () => console.log('Add Task')
        }, {
          icon: <CalendarIcon size={18} />,
          label: 'Schedule Follow-up',
          action: () => console.log('Schedule Follow-up')
        }];
      default:
        return [{
          icon: <ClipboardListIcon size={18} />,
          label: 'Add Task',
          action: () => console.log('Add Task')
        }];
    }
  };
  const actions = getActions();
  return <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end space-y-2">
      {/* Action buttons that appear when menu is open */}
      {isOpen && <div className="flex flex-col-reverse space-y-reverse space-y-2">
          {actions.map((action, index) => <button key={index} onClick={() => {
        action.action();
        setIsOpen(false);
      }} className="flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-gray-50">
              <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-ash-teal/10 text-ash-teal">
                {action.icon}
              </span>
              {action.label}
            </button>)}
        </div>}
      {/* Main FAB button */}
      <button onClick={toggleMenu} className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:shadow-xl ${isOpen ? 'bg-red-500 text-white' : 'bg-ash-gold text-white'}`} aria-label={isOpen ? 'Close menu' : 'Open menu'}>
        {isOpen ? <XIcon size={24} /> : <PlusIcon size={24} />}
      </button>
    </div>;
};