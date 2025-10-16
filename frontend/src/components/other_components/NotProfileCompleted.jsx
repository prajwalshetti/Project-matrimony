import React, { useEffect, useState } from 'react';
import { Heart, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotProfileCompleted = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileCompletion();
  }, []);

  const fetchProfileCompletion = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/user/testProfileCompletion', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.profileCompletion);
      }
    } catch (err) {
      console.error('Error fetching profile completion:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg">Loading profile status...</p>
        </div>
      </div>
    );
  }

  const getSectionIcon = (completed) => {
    return completed ? (
      <CheckCircle className="w-6 h-6 text-green-500" />
    ) : (
      <XCircle className="w-6 h-6 text-red-500" />
    );
  };

  const sections = [
    { key: 'personal', label: 'Personal Information' },
    { key: 'professional', label: 'Professional Details' },
    { key: 'family', label: 'Family Information' },
    { key: 'location', label: 'Location Details' },
    { key: 'preferences', label: 'Interests & Plans' },
    { key: 'photo', label: 'Profile Photo' },
    { key: 'payment', label: 'Payment' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 py-12 px-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Complete Your Profile
          </h1>
          <p className="text-gray-600">You're almost there! Complete your profile to find your perfect match</p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {profileData?.completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${profileData?.completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {profileData?.completedFields} of {profileData?.totalFields} items completed
            </p>
          </div>

          {/* Section Status */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Completion Checklist</h3>
            {sections.map((section) => (
              <div
                key={section.key}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  profileData?.sectionCompletion[section.key]
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getSectionIcon(profileData?.sectionCompletion[section.key])}
                  <div>
                    <p className="font-medium text-gray-800">{section.label}</p>
                    <p className="text-xs text-gray-500">
                      {profileData?.sectionCompletion[section.key] ? 'Completed' : 'Incomplete'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Fields Card (if details incomplete) */}
        {!profileData?.isDetailsCompleted && profileData?.missingRequiredFields?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-500" />
              Missing Fields ({profileData.missingRequiredFields.filter(f => f !== 'payment').length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profileData.missingRequiredFields
                .filter(field => field !== 'payment')
                .map((field) => (
                  <div
                    key={field}
                    className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition flex items-center gap-2"
          >
            Back to Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotProfileCompleted;
