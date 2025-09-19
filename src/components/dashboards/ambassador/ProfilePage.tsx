import React, { useState } from 'react';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, CalendarIcon, EditIcon, SaveIcon, XIcon } from 'lucide-react';

export const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Okafor',
    email: 'john@afroscholarhub.org',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    bio: 'Dedicated ambassador working to connect students with educational opportunities across Africa.',
    joinDate: 'January 2023',
    schoolsManaged: 12,
    studentsHelped: 450
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any changes if needed
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
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <SaveIcon size={16} className="mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
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
                <span className="text-sm text-gray-700">Visited Lagos Model School - 2 days ago</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Updated student records - 5 days ago</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">Attended training session - 1 week ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
