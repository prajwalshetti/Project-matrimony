import React, { useEffect, useState } from 'react';
import { Heart, CheckCircle, XCircle, AlertCircle, ArrowRight, CreditCard } from 'lucide-react';
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
    { key: 'personal', label: 'Personal Information', route: '/profile' },
    { key: 'professional', label: 'Professional Details', route: '/profile' },
    { key: 'family', label: 'Family Information', route: '/profile' },
    { key: 'location', label: 'Location Details', route: '/profile' },
    { key: 'preferences', label: 'Interests & Plans', route: '/profile' },
    { key: 'photo', label: 'Profile Photo', route: '/profile' },
    { key: 'payment', label: 'Payment', route: '/payment' },
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

          {/* Status Message */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Profile Incomplete</h3>
                <p className="text-sm text-gray-600">
                  {profileData?.isDetailsCompleted 
                    ? 'All profile details are filled! Please complete the payment to access all features.'
                    : `Please complete the following ${profileData?.missingFieldsCount} item(s) to unlock all features.`
                  }
                </p>
              </div>
            </div>
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
                    : 'bg-red-50 border-red-200 hover:shadow-md'
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
                {!profileData?.sectionCompletion[section.key] && (
                  <button
                    onClick={() => navigate(section.route)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition"
                  >
                    Complete
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!profileData?.isDetailsCompleted ? (
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-2"
            >
              Complete Profile Details
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : !profileData?.isPaymentDone ? (
            <button
              onClick={() => navigate('/payment')}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Complete Payment
            </button>
          ) : null}
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold text-lg hover:shadow-lg hover:border-gray-400 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Motivational Message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <p className="text-sm text-gray-600">
              Complete your profile to get <span className="font-semibold text-orange-600">3x more matches!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotProfileCompleted;
