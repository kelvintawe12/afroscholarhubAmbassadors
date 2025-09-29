import React, { useState, useEffect } from 'react';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, CalendarIcon, EditIcon, SaveIcon, XIcon } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../utils/supabase';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    joinDate: '',
    schoolsManaged: 0,
    studentsHelped: 0
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            *,
            ambassador_stats:ambassador_stats(*)
          `)
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile({
            name: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            bio: data.bio || '',
            joinDate: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            schoolsManaged: data.ambassador_stats?.schools_managed || 0,
            studentsHelped: data.ambassador_stats?.students_helped || 0
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setSaveStatus('idle');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.name,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio
        })
        .eq('id', user.id);

      if (error) throw error;

      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload profile data to reset changes
    if (user?.id) {
      const loadProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select(`
              *,
              ambassador_stats:ambassador_stats(*)
            `)
            .eq('id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            setProfile({
              name: data.full_name || '',
              email: data.email || '',
              phone: data.phone || '',
              location: data.location || '',
              bio: data.bio || '',
              joinDate: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              schoolsManaged: data.ambassador_stats?.schools_managed || 0,
              studentsHelped: data.ambassador_stats?.students_helped || 0
            });
          }
        } catch (error) {
          console.error('Error reloading profile:', error);
        }
      };
      loadProfile();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-ash-teal text-white rounded-md hover:bg-ash-teal/90 transition-colors"
            >
              <EditIcon size={16} className="mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              {saveStatus === 'success' && (
                <div className="mr-4 text-green-600 font-medium">Profile saved successfully!</div>
              )}
              {saveStatus === 'error' && (
                <div className="mr-4 text-red-600 font-medium">Failed to save profile. Please try again.</div>
              )}
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                ) : (
                  <SaveIcon size={16} className="mr-2" />
                )}
                Save
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XIcon size={16} className="mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-start space-x-6 mb-8">
            <div className="w-24 h-24 bg-ash-teal rounded-full flex items-center justify-center">
              <UserIcon size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{profile.name}</h2>
              <p className="text-gray-600 mb-4">{profile.bio}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon size={16} className="mr-2" />
                  Joined {profile.joinDate}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon size={16} className="mr-2" />
                  {profile.location}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ash-teal"
                  />
                ) : (
                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md">
                    <MailIcon size={16} className="mr-3 text-gray-400" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ash-teal"
                  />
                ) : (
                  <div className="flex items-center px-3 py-2 bg-gray-50 rounded-md">
                    <PhoneIcon size={16} className="mr-3 text-gray-400" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ash-teal"
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-md text-gray-700">{profile.bio}</p>
            )}
          </div>

          {/* Statistics */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-ash-teal to-ash-dark p-6 rounded-lg text-white">
                <div className="text-3xl font-bold mb-2">{profile.schoolsManaged}</div>
                <div className="text-sm opacity-90">Schools Managed</div>
              </div>
              <div className="bg-gradient-to-br from-ash-gold to-ash-teal p-6 rounded-lg text-white">
                <div className="text-3xl font-bold mb-2">{profile.studentsHelped}</div>
                <div className="text-sm opacity-90">Students Helped</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Profile updated - Just now</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Settings updated - Today</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Activity logged - Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
