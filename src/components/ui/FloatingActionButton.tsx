import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, 
  X, 
  School, 
  UserPlus, 
  Calendar, 
  ClipboardList, 
  MessageSquare, 
  Download, 
  Zap, 
  Shield, 
  Award, 
  TrendingUp, 
  FileText, 
  MapPin,
  Activity,
  GraduationCap,
  AlertCircle,
  Check
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Declare gtag on the Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface ActionItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  action: () => Promise<void> | void;
  color?: string;
  disabled?: boolean;
  badge?: {
    text: string;
    variant: 'default' | 'success' | 'warning' | 'error';
  };
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

interface FloatingActionButtonProps {
  role: 'management' | 'country_lead' | 'ambassador' | 'support';
  userContext?: {
    countryCode?: string;
    teamId?: string;
    ambassadorId?: string;
  };
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  role,
  userContext = {},
  position = 'bottom-right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate unique IDs for actions
  const generateActionId = useCallback((label: string, role: string) => 
    `${role}-${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`, 
    []
  );

  // Enhanced role-specific actions with navigation
  const getActions = useCallback((): ActionItem[] => {
    const basePath = '/dashboard';
    const countryCode = userContext.countryCode || location.pathname.split('/').pop()?.toLowerCase() || 'ng';
    
    const commonActions: ActionItem[] = [];

    switch (role) {
      case 'management':
        commonActions.push(
          {
            id: generateActionId('Add School', role),
            icon: <School size={18} />,
            label: 'Add School',
            description: 'Add new school to prospects pipeline',
            action: () => navigate(`${basePath}/management/schools/prospects`),
            color: 'from-blue-500 to-blue-600',
            badge: { text: '+1', variant: 'success' }
          },
          {
            id: generateActionId('Add Ambassador', role),
            icon: <UserPlus size={18} />,
            label: 'Add Ambassador',
            description: 'Onboard new team member',
            action: () => navigate(`${basePath}/management/ambassadors/performance`),
            color: 'from-green-500 to-emerald-600'
          },
          {
            id: generateActionId('Schedule Event', role),
            icon: <Calendar size={18} />,
            label: 'Schedule Event',
            description: 'Create new outreach event',
            action: () => navigate(`${basePath}/management/outreaches/events`),
            color: 'from-purple-500 to-violet-600'
          },
          {
            id: generateActionId('Generate Report', role),
            icon: <TrendingUp size={18} />,
            label: 'Generate Report',
            description: 'Create custom analytics report',
            action: () => navigate(`${basePath}/management/reports/custom`),
            color: 'from-yellow-400 to-orange-500'
          },
          {
            id: generateActionId('Compliance Audit', role),
            icon: <Shield size={18} />,
            label: 'Compliance Check',
            description: 'Run system compliance audit',
            action: () => navigate(`${basePath}/management/settings`),
            color: 'from-red-500 to-pink-500',
            badge: { text: 'Required', variant: 'error' }
          }
        );
        break;

      case 'country_lead':
        commonActions.push(
          {
            id: generateActionId('Add School', role),
            icon: <School size={18} />,
            label: 'Add School',
            description: `Add to ${countryCode.toUpperCase()} pipeline`,
            action: () => navigate(`${basePath}/country-lead/${countryCode}/pipeline`),
            color: 'from-blue-500 to-blue-600'
          },
          {
            id: generateActionId('Add Team Member', role),
            icon: <UserPlus size={18} />,
            label: 'Add Team Member',
            description: 'Recruit new ambassador',
            action: () => navigate(`${basePath}/country-lead/${countryCode}/team`),
            color: 'from-green-500 to-emerald-600'
          },
          {
            id: generateActionId('Schedule Event', role),
            icon: <Calendar size={18} />,
            label: 'Schedule Event',
            description: 'Plan outreach activity',
            action: () => navigate(`${basePath}/country-lead/${countryCode}/events`),
            color: 'from-purple-500 to-violet-600'
          },
          {
            id: generateActionId('Recognize Performer', role),
            icon: <Award size={18} />,
            label: 'Recognize Performer',
            description: 'Award outstanding team member',
            action: async () => {
              // Simulate async operation
              await new Promise(resolve => setTimeout(resolve, 1000));
              console.log('Recognition awarded!');
            },
            color: 'from-yellow-400 to-orange-500',
            requiresConfirmation: true,
            confirmationMessage: 'Award public recognition to team member?'
          },
          {
            id: generateActionId('Submit Report', role),
            icon: <FileText size={18} />,
            label: 'Submit Report',
            description: 'Generate monthly country report',
            action: () => navigate(`${basePath}/country-lead/${countryCode}/reports`),
            color: 'from-indigo-500 to-cyan-600'
          }
        );
        break;

      case 'ambassador':
        commonActions.push(
          {
            id: generateActionId('Log School Visit', role),
            icon: <School size={18} />,
            label: 'Log School Visit',
            description: 'Record school outreach activity',
            action: () => navigate(`${basePath}/ambassador/schools`),
            color: 'from-blue-500 to-blue-600'
          },
          {
            id: generateActionId('Add Task', role),
            icon: <ClipboardList size={18} />,
            label: 'Add Task',
            description: 'Create follow-up task',
            action: () => navigate(`${basePath}/ambassador/tasks`),
            color: 'from-green-500 to-emerald-600'
          },
          {
            id: generateActionId('Schedule Follow-up', role),
            icon: <Calendar size={18} />,
            label: 'Schedule Follow-up',
            description: 'Plan next student contact',
            action: () => navigate(`${basePath}/ambassador/activity`),
            color: 'from-purple-500 to-violet-600'
          },
          {
            id: generateActionId('Log Activity', role),
            icon: <Activity size={18} />,
            label: 'Log Activity',
            description: 'Record daily work log',
            action: () => navigate(`${basePath}/ambassador/activity`),
            color: 'from-orange-400 to-red-500'
          },
          {
            id: generateActionId('Track Impact', role),
            icon: <Award size={18} />,
            label: 'Track Impact',
            description: 'Update scholarship progress',
            action: () => navigate(`${basePath}/ambassador/impact`),
            color: 'from-yellow-400 to-orange-500'
          }
        );
        break;

      case 'support':
        commonActions.push(
          {
            id: generateActionId('New Support Ticket', role),
            icon: <MessageSquare size={18} />,
            label: 'New Ticket',
            description: 'Create support request',
            action: () => navigate(`${basePath}/support/queues`),
            color: 'from-blue-500 to-blue-600'
          },
          {
            id: generateActionId('Add Resource', role),
            icon: <FileText size={18} />,
            label: 'Add Resource',
            description: 'Upload new support material',
            action: () => navigate(`${basePath}/support/resources`),
            color: 'from-green-500 to-emerald-600'
          },
          {
            id: generateActionId('Compliance Review', role),
            icon: <Shield size={18} />,
            label: 'Compliance Review',
            description: 'Start audit process',
            action: () => navigate(`${basePath}/support/audits`),
            color: 'from-red-500 to-pink-500'
          },
          {
            id: generateActionId('Generate Report', role),
            icon: <Download size={18} />,
            label: 'Generate Report',
            description: 'Create support analytics',
            action: () => navigate(`${basePath}/support/reports`),
            color: 'from-purple-500 to-violet-600'
          }
        );
        break;

      default:
        return [{
          id: generateActionId('Quick Action', role),
          icon: <Plus size={18} />,
          label: 'Quick Action',
          action: () => console.log('Default action'),
          color: 'from-gray-500 to-gray-600'
        }];
    }

    return commonActions;
  }, [navigate, location.pathname, userContext.countryCode, generateActionId]);

  const actions = getActions();

  // Sophisticated animation handling
  const handleToggle = useCallback(async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (isOpen) {
      // Closing animation
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 200);
      });
    }
    
    setIsOpen(prev => !prev);
    
    // Reset animation after completion
    setTimeout(() => {
      setIsAnimating(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }, 300);
  }, [isOpen, isAnimating]);

  // Auto-close on route change
  useEffect(() => {
    setIsOpen(false);
    setIsAnimating(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAnimating(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Enhanced action execution with loading states
  const executeAction = useCallback(async (action: ActionItem) => {
    if (action.disabled || isAnimating) return;

    setActiveAction(action.id);
    setIsOpen(false);
    setIsAnimating(true);

    try {
      if (action.requiresConfirmation && !window.confirm(action.confirmationMessage)) {
        throw new Error('Action cancelled by user');
      }

      // Execute action
      const result = action.action();
      if (result instanceof Promise) {
        await result;
      }

      // Success feedback (you can replace with toast notification)
      console.log(`✅ ${action.label} completed successfully`);
      
      // Optional: Track analytics
      if (window.gtag) {
        window.gtag('event', 'fab_action', {
          event_category: 'user_interaction',
          event_label: action.label,
          role: role,
          value: 1
        });
      }
    } catch (error) {
      console.error(`❌ Error executing ${action.label}:`, error);
      // Optional: Show error toast
      alert(`Error: ${action.label} failed. Please try again.`);
    } finally {
      setActiveAction(null);
      setIsAnimating(false);
    }
  }, [role, isAnimating]);

  // Calculate button positions and animations
  const getButtonStyles = useCallback((index: number, total: number) => {
    const x = 0;
    const y = -(index + 1) * 50; // Vertical stack upwards with tighter spacing

    return {
      // Initial closed position (stacked below main button)
      closed: {
        transform: `translateY(${(index + 1) * 6}px) scale(0.95)`,
        opacity: 0,
        pointerEvents: 'none' as const
      },
      // Open position (vertical stack)
      open: {
        transform: `translate(${x}px, ${y}px) scale(1)`,
        opacity: 1,
        pointerEvents: 'auto' as const,
        transition: `all 0.4s cubic-bezier(0.23, 1, 0.320, 1) ${0.1 + (index * 0.05)}s`
      },
      // Hover effect
      hover: {
        transform: `translate(${x}px, ${y}px) scale(1.02)`,
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
      }
    };
  }, []);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const containerClass = `fixed z-50 flex flex-col items-end space-y-1 ${positionClasses[position]} ${className}`;

  if (actions.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className={containerClass}>
      {/* Action Buttons */}
      <div className="relative flex flex-col-reverse space-y-reverse space-y-0.5 origin-bottom">
        {actions.map((action, index) => {
          const styles = getButtonStyles(index, actions.length);
          const isActive = activeAction === action.id;
          const variant = action.badge?.variant || 'default';
          
          return (
            <div
              key={action.id}
              className={`
                relative group flex items-center rounded-full px-5 py-3 text-sm font-semibold shadow-lg
                transition-all duration-300 ease-out overflow-hidden
                bg-white border border-gray-200 hover:border-gray-300
                ${action.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-gray-50 active:bg-gray-100'
                }
                ${isActive ? 'ring-2 ring-blue-500 ring-opacity-30' : ''}
                ${styles.closed.transform} ${styles.closed.opacity}
              `}
              style={{
                ...styles.open,
                ...(isOpen && !action.disabled ? styles.hover : {})
              }}
              onClick={() => !action.disabled && executeAction(action)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  !action.disabled && executeAction(action);
                }
              }}
              aria-label={`${action.label}${action.description ? `: ${action.description}` : ''}`}
              aria-disabled={action.disabled}
            >
              {/* Loading spinner */}
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              {/* Badge */}
              {action.badge && (
                <span 
                  className={`
                    absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                    shadow-lg transform translate-x-1/2 -translate-y-1/2
                    ${variant === 'success' && 'bg-green-500 text-white'}
                    ${variant === 'warning' && 'bg-yellow-500 text-white'}
                    ${variant === 'error' && 'bg-red-500 text-white'}
                    ${variant === 'default' && 'bg-blue-500 text-white'}
                  `}
                >
                  {action.badge.text}
                </span>
              )}
              
              {/* Icon */}
              <span 
                className={`
                  mr-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md
                  transition-all duration-200 group-hover:scale-110
                  ${action.color ? `bg-gradient-to-br ${action.color}` : 'bg-gray-500'}
                  ${action.disabled && 'opacity-50'}
                `}
              >
                {action.icon}
              </span>
              
              {/* Label */}
              <span className="whitespace-nowrap font-semibold text-gray-800 group-hover:text-gray-900">
                {action.label}
              </span>
              
              {/* Confirmation indicator */}
              {action.requiresConfirmation && (
                <AlertCircle size={14} className="ml-2 text-yellow-500" />
              )}
              
              {/* Disabled overlay */}
              {action.disabled && (
                <div className="absolute inset-0 bg-white/50 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* Main FAB Button */}
      <button
        onClick={handleToggle}
        disabled={isAnimating}
        className={`
          relative flex h-16 w-16 items-center justify-center rounded-full shadow-xl
          transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2
          transform-gpu hover:shadow-2xl active:scale-95
          ${isOpen 
            ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-200 ring-offset-2 shadow-red-500/25 scale-110' 
            : 'bg-gradient-to-br from-ash-gold via-ash-teal to-ash-gold hover:from-ash-gold/90 hover:to-ash-gold/90 scale-100 shadow-lg'
          }
          ${isAnimating ? 'scale-95 opacity-75 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label={isOpen ? 'Close action menu' : 'Open action menu'}
        aria-expanded={isOpen}
        aria-controls="fab-actions"
        type="button"
      >
        {/* Pulse ring animation */}
        {!isOpen && !isAnimating && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-ash-gold/30 to-ash-teal/30 animate-ping opacity-75" />
        )}
        
        {/* Secondary ring */}
        {!isOpen && !isAnimating && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-ash-gold/20 to-ash-teal/20 animate-pulse opacity-50" />
        )}
        
        {/* Icon container with rotation */}
        <div className={`
          relative h-8 w-8 flex items-center justify-center transition-all duration-500 ease-out
          ${isOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
        `}>
          <div className={`
            transition-all duration-300 ease-out
            ${isOpen ? 'text-white scale-110' : 'text-white'}
          `}>
            {isOpen ? <X size={24} /> : <Plus size={24} />}
          </div>
        </div>
        
        {/* Tooltip */}
        <div className={`
          absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg
          whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200
          shadow-lg before:absolute before:top-full before:right-1/2 before:mr-[-5px]
          before:border-5 before:border-transparent before:border-t-gray-900
          ${!isOpen && !isAnimating ? 'group-hover:opacity-100 group-hover:translate-y-[-8px]' : 'opacity-0'}
        `}>
          Quick Actions
        </div>
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={handleToggle}
          aria-hidden="true"
        />
      )}

      {/* Custom animations */}
      <style>{`
        .transform-gpu {
          transform: translate3d(0, 0, 0);
          will-change: transform, opacity;
        }
        
        @keyframes spiralIn {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }
        
        @keyframes spiralOut {
          0% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
          50% {
            transform: scale(0.9) rotate(180deg);
          }
          100% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
        }
        
        .animate-spiral-in {
          animation: spiralIn 0.5s cubic-bezier(0.23, 1, 0.320, 1);
        }
        
        .animate-spiral-out {
          animation: spiralOut 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

// Usage example in your DashboardLayout
export const DashboardLayoutWithFAB: React.FC<{
  children: React.ReactNode;
  role: 'management' | 'country_lead' | 'ambassador' | 'support';
}> = ({ children, role }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your existing layout */}
      <div className="flex flex-col h-screen">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      
      {/* FAB - positioned relative to layout */}
      <FloatingActionButton role={role} />
    </div>
  );
};