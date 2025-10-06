import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AlertCircle, ArrowRight, Heart, Lock } from 'lucide-react';

function CompleteProfile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-red-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-lg w-full relative z-10">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-orange-100">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-8 py-12 text-center relative">
            <div className="mx-auto h-24 w-24 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mb-6 shadow-lg relative animate-pulse">
              <Lock className="h-12 w-12 text-white" />
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center border-4 border-white animate-bounce">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Profile Incomplete
            </h2>
            <p className="text-orange-50 text-base">
              Please complete your profile to access this page
            </p>
          </div>

          <div className="px-8 py-10 space-y-6">
            {/* Alert Message */}
            <div className="flex items-start space-x-3 p-5 bg-orange-50 rounded-xl border-2 border-orange-200">
              <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Access Restricted</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This page is only accessible to members with complete profiles. Please visit your profile page and fill in all the required information to unlock this feature.
                </p>
              </div>
            </div>

            {/* Why Complete Section */}
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-5 w-5 text-orange-600 fill-orange-600" />
                <h3 className="font-bold text-gray-800">Why Complete Your Profile?</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Connect with compatible matches</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Receive personalized recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Unlock all matrimony features</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Increase your profile visibility</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center space-x-3 py-4 px-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <User className="h-6 w-6" />
              <span>Complete Your Profile</span>
              <ArrowRight className="h-6 w-6" />
            </button>

          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-5 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-md border border-orange-100">
            <Heart className="h-4 w-4 text-orange-600 fill-orange-600 animate-pulse" />
            <span className="text-sm text-gray-700 font-medium">
              Your perfect match awaits!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;