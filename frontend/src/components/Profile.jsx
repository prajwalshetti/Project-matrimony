import React from 'react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { userid, name, isProfileCompleted } = useAuth();

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Profile Information</h1>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">User ID</p>
          <p className="mt-1 text-gray-900">{userid || 'Not available'}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p className="mt-1 text-gray-900">{name || 'Not set'}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500">Profile Status</p>
          <p className={`mt-1 ${isProfileCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
            {isProfileCompleted ? 'Completed ✅' : 'Incomplete ⚠️'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;