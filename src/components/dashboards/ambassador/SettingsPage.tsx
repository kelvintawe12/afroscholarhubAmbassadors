import React, { useState } from 'react';
import { BellIcon, ShieldIcon, GlobeIcon, MoonIcon, SunIcon, SaveIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

export const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      schoolUpdates: true,
      eventReminders: true,
      systemAlerts: true
    },
    privacy: {
      profileVisibility: 'public',
      contactInfo: 'ambassadors',
      activityLog: 'private'
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'Africa/Lagos',
      dateFormat: 'DD/MM/YYYY'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordChange: false
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    // Here you would save settings to backend
    alert('Settings saved successfully!');
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and privacy settings</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Notifications */}
          <div>
            <div className="flex items-center mb-4">
              <BellIcon size={20} className="mr-3 text-ash-teal" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4 ml-8">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Email Notifications</label>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => updateSetting('notifications', 'email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ash-teal/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ash-teal"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Push Notifications</label>
                  <p className="text-sm text-gray-600">Receive browser notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => updateSetting('notifications', 'push', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ash-teal/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ash-teal"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">School Updates</label>
                  <p className="text-sm text-gray-600">Get notified about school activities</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.schoolUpdates}
                    onChange={(e) => updateSetting('notifications', 'schoolUpdates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ash-teal/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ash-teal"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <div className="flex items-center mb-4">
              <ShieldIcon size={20} className="mr-3 text-ash-teal" />
              <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
            </div>
            <div className="space-y-4 ml-8">
              <div>
                <label className="block font-medium text-gray-900 mb-2">Profile Visibility</label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ash-teal"
                >
                  <option value="public">Public</option>
                  <option value="ambassadors">Ambassadors Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-900 mb-2">Contact Information</label>
                <select
                  value={settings.privacy.contactInfo}
                  onChange={(e) => updateSetting('privacy', 'contactInfo', e.target.value)}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ash-teal"
                >
                  <option value="public">Public</option>
                  <option value="ambassadors">Ambassadors Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <div className="flex items-center mb-4">
              <GlobeIcon size={20} className="mr-3 text-ash-teal" />
              <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-8">
              <div>
                <label className="block font-medium text-gray-900 mb-2">Theme</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.preferences.theme === 'light'}
                      onChange={(e) => updateSetting('preferences', 'theme', e.target.value)}
                      className="mr-2"
                    />
                    <SunIcon size={16} className="mr-1" />
                    Light
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.preferences.theme === 'dark'}
                      onChange={(e) => updateSetting('preferences', 'theme', e.target.value)}
                      className="mr-2"
                    />
                    <MoonIcon size={16} className="mr-1" />
                    Dark
                  </label>
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-900 mb-2">Language</label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ash-teal"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-900 mb-2">Timezone</label>
                <select
                  value={settings.preferences.timezone}
                  onChange={(e) => updateSetting('preferences', 'timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ash-teal"
                >
                  <option value="Africa/Lagos">West Africa (GMT+1)</option>
                  <option value="Africa/Nairobi">East Africa (GMT+3)</option>
                  <option value="Africa/Johannesburg">South Africa (GMT+2)</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-900 mb-2">Date Format</label>
                <select
                  value={settings.preferences.dateFormat}
                  onChange={(e) => updateSetting('preferences', 'dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ash-teal"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <div className="flex items-center mb-4">
              <ShieldIcon size={20} className="mr-3 text-ash-teal" />
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            </div>
            <div className="space-y-4 ml-8">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-900">Two-Factor Authentication</label>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactor}
                    onChange={(e) => updateSetting('security', 'twoFactor', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ash-teal/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ash-teal"></div>
                </label>
              </div>

              <div>
                <label className="block font-medium text-gray-900 mb-2">Change Password</label>
                <div className="space-y-3 max-w-md">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ash-teal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ash-teal"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ash-teal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-3 bg-ash-teal text-white rounded-md hover:bg-ash-teal/90 transition-colors font-medium"
            >
              <SaveIcon size={16} className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
