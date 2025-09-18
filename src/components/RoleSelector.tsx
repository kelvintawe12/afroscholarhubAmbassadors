import React, { useState } from 'react';
import { CrownIcon, FlagIcon, HandshakeIcon, XIcon, CheckIcon } from 'lucide-react';
import { Button } from './ui/Button';
interface Role {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  path: string;
  stats: string;
}
interface RoleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (path: string) => void;
  userName: string;
}
export const RoleSelector = ({
  isOpen,
  onClose,
  onSelectRole,
  userName
}: RoleSelectorProps) => {
  const [rememberChoice, setRememberChoice] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const roles: Role[] = [{
    id: 'management',
    title: 'Management',
    subtitle: 'Full oversight: Analytics, approvals, strategy',
    icon: <CrownIcon size={24} className="text-ash-gold" />,
    path: '/dashboard/management',
    stats: 'Global view: 45 partnerships, 1,200 leads this quarter'
  }, {
    id: 'ambassador',
    title: 'Ambassador',
    subtitle: 'Field duties: Log visits, track your impact',
    icon: <HandshakeIcon size={24} className="text-ash-teal" />,
    path: '/dashboard/ambassador',
    stats: 'Personal impact: 150 students reached, 3 partnerships'
  }];
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold text-ash-dark">
            Welcome, {userName}!
          </h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
            <XIcon size={20} />
          </button>
        </div>
        <div className="py-4">
          <p className="mb-4 text-sm text-gray-600">
            You have multiple roles in the system. Please select which dashboard
            you'd like to access:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map(role => <div key={role.id} className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${selectedRole === role.id ? 'border-ash-teal bg-ash-teal/5 ring-2 ring-ash-teal ring-offset-2' : 'border-gray-200 hover:border-ash-teal/50'}`} onClick={() => setSelectedRole(role.id)}>
                <div className="flex items-start">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {role.title}
                      </h3>
                      {selectedRole === role.id && <CheckIcon size={16} className="text-ash-teal" />}
                    </div>
                    <p className="text-sm text-gray-600">{role.subtitle}</p>
                    <p className="mt-2 text-xs text-ash-teal">{role.stats}</p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <label className="flex cursor-pointer items-center">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-ash-teal focus:ring-ash-teal" checked={rememberChoice} onChange={() => setRememberChoice(!rememberChoice)} />
            <span className="ml-2 text-sm text-gray-700">
              Remember my choice
            </span>
          </label>
          <div className="space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!selectedRole} onClick={() => selectedRole && onSelectRole(`${roles.find(r => r.id === selectedRole)?.path}`)}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>;
};