import React, { useState, useEffect } from 'react';
import { Heart, User, Briefcase, Home, Coffee, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotLoggedIn from './other_components/NotLoggedIn';

const Profile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const {userid}=useAuth();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoSuccess, setPhotoSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    // Profile Details
    name: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    occupationType: '',
    occupation: '',
    height: '',
    education: '',
    languagesKnown: [],
    
    // Family Details
    fathersName: '',
    fathersOccupation: '',
    mothersName: '',
    mothersOccupation: '',
    
    // Location & Preferences
    residentCountry: '',
    currentCity: '',
    hometown: '',
    interests: [],
    disabilities: '',
    futurePlans: '',
    aboutMyself: '',
    foodPreference: '',
    gotra: '',
    phoneNumber: ''
  });

  useEffect(() => {
    // Fetch current user data
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/user/getLoggedinUser', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Fetched user data:', userData);
        
        // Only update fields that have actual values
        setFormData(prev => ({
          ...prev,
          name: userData.name || prev.name,
          lastName: userData.lastName || prev.lastName,
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : prev.dateOfBirth,
          gender: userData.gender || prev.gender,
          occupationType: userData.occupationType || prev.occupationType,
          occupation: userData.occupation || prev.occupation,
          height: userData.height || prev.height,
          education: userData.education || prev.education,
          languagesKnown: userData.languagesKnown || prev.languagesKnown,
          fathersName: userData.fathersName || prev.fathersName,
          fathersOccupation: userData.fathersOccupation || prev.fathersOccupation,
          mothersName: userData.mothersName || prev.mothersName,
          mothersOccupation: userData.mothersOccupation || prev.mothersOccupation,
          residentCountry: userData.residentCountry || prev.residentCountry,
          currentCity: userData.currentCity || prev.currentCity,
          hometown: userData.hometown || prev.hometown,
          interests: userData.interests || prev.interests,
          disabilities: userData.disabilities || prev.disabilities,
          futurePlans: userData.futurePlans || prev.futurePlans,
          aboutMyself: userData.aboutMyself || prev.aboutMyself,
          foodPreference: userData.foodPreference || prev.foodPreference,
          gotra: userData.gotra || prev.gotra,
          phoneNumber: userData.phoneNumber || prev.phoneNumber,
        }));
      } else {
        console.error('Failed to fetch user data:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInput = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8000/api/v1/user/updateUser', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (currentStep === 4) {
          setCurrentStep(5); // Move to photo upload step
          setSuccess(true);
          setTimeout(() => setSuccess(false), 1500);
        } else {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    setUploadingPhoto(true);
    setError('');
    setPhotoSuccess(false);

    try {
      const formData = new FormData();
      formData.append('profilePhoto', photoFile);

      const response = await fetch('http://localhost:8000/api/v1/user/uploadProfilePhoto', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setPhotoSuccess(true);
        setTimeout(() => setPhotoSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to upload photo');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal', icon: User },
    { number: 2, title: 'Professional', icon: Briefcase },
    { number: 3, title: 'Family', icon: Home },
    { number: 4, title: 'Preferences', icon: Coffee },
    { number: 5, title: 'Photo', icon: Save }
  ];

  if(!userid){
    return(<NotLoggedIn/>);
  }

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
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Update Your Profile
          </h1>
          <p className="text-gray-600">Complete your journey to find your perfect match</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3 animate-pulse">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <p className="text-green-700 font-medium">Profile updated successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step.number)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg'
                          : isCompleted
                          ? 'bg-gradient-to-r from-orange-400 to-red-400'
                          : 'bg-gray-200'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isActive || isCompleted ? 'text-white' : 'text-gray-500'}`} />
                    </button>
                    <span className={`mt-2 text-sm font-medium ${isActive ? 'text-orange-600' : 'text-gray-600'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-gradient-to-r from-orange-400 to-red-400' : 'bg-gray-200'}`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg p-8">
            
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                    <input
                      type="text"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="e.g., 5'8&quot;"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Food Preference</label>
                    <select
                      name="foodPreference"
                      value={formData.foodPreference}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    >
                      <option value="">Select Preference</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Eggetarian">Eggetarian</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gotra</label>
                    <input
                      type="text"
                      name="gotra"
                      value={formData.gotra}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Enter your gotra"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About Myself</label>
                  <textarea
                    name="aboutMyself"
                    value={formData.aboutMyself}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              </div>
            )}

            {/* Step 2: Professional Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200">
                  Professional Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation Type</label>
                    <select
                      name="occupationType"
                      value={formData.occupationType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    >
                      <option value="">Select Type</option>
                      <option value="Govt">Government</option>
                      <option value="Private">Private</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="e.g., B.Tech from Delhi"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages Known (comma separated)</label>
                    <input
                      type="text"
                      value={formData.languagesKnown.join(', ')}
                      onChange={(e) => handleArrayInput('languagesKnown', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="e.g., English, Hindi, Marathi"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Family Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200">
                  Family Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
                    <input
                      type="text"
                      name="fathersName"
                      value={formData.fathersName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Enter father's name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Father's Occupation</label>
                    <input
                      type="text"
                      name="fathersOccupation"
                      value={formData.fathersOccupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Enter father's occupation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
                    <input
                      type="text"
                      name="mothersName"
                      value={formData.mothersName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Enter mother's name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Occupation</label>
                    <input
                      type="text"
                      name="mothersOccupation"
                      value={formData.mothersOccupation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Enter mother's occupation"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Location & Preferences */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200">
                  Location & Preferences
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resident Country</label>
                    <input
                      type="text"
                      name="residentCountry"
                      value={formData.residentCountry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="e.g., India"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current City</label>
                    <input
                      type="text"
                      name="currentCity"
                      value={formData.currentCity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="e.g., Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hometown</label>
                    <input
                      type="text"
                      name="hometown"
                      value={formData.hometown}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="e.g., Jaipur"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Disabilities (if any)</label>
                    <input
                      type="text"
                      name="disabilities"
                      value={formData.disabilities}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="None or specify"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interests (comma separated)</label>
                    <input
                      type="text"
                      value={formData.interests.join(', ')}
                      onChange={(e) => handleArrayInput('interests', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="e.g., Reading, Traveling, Cooking"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Future Plans</label>
                    <textarea
                      name="futurePlans"
                      value={formData.futurePlans}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="Share your future plans and aspirations..."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Photo Upload */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200">
                  Upload Profile Photo
                </h2>
                
                <div className="flex flex-col items-center gap-6">
                  {/* Photo Preview */}
                  {photoPreview ? (
                    <div className="relative w-48 h-48">
                      <img 
                        src={photoPreview} 
                        alt="Profile Preview" 
                        className="w-full h-full rounded-full object-cover border-4 border-orange-200"
                      />
                      <button
                        onClick={() => {
                          setPhotoFile(null);
                          setPhotoPreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center">
                      <User className="w-20 h-20 text-gray-300" />
                    </div>
                  )}

                  {/* Upload Controls */}
                  <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                    <label className="w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                      <div className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium text-center cursor-pointer hover:shadow-lg transition">
                        Select Photo
                      </div>
                    </label>

                    {photoFile && (
                      <button
                        onClick={handlePhotoUpload}
                        disabled={uploadingPhoto}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {uploadingPhoto ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                          </>
                        ) : (
                          <>Upload Photo</>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Success Message */}
                  {photoSuccess && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Photo uploaded successfully!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
<div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
  <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
    {/* Previous button, dots, and Next button - same line on mobile */}
    <div className="flex gap-3 w-full md:w-auto justify-between md:justify-start items-center order-1">
      <button
        type="button"
        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
        disabled={currentStep === 1}
        className={`px-6 py-2 rounded-lg font-medium transition ${
          currentStep === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        style={{ minWidth: '110px' }}
      >
        Previous
      </button>

      {/* Step indicators */}
      <div className="flex gap-2">
        {steps.map(step => (
          <div
            key={step.number}
            className={`w-2 h-2 rounded-full ${
              currentStep === step.number
                ? 'bg-gradient-to-r from-orange-500 to-red-500 w-8'
                : 'bg-gray-300'
            } transition-all`}
          ></div>
        ))}
      </div>

      {currentStep < 4 ? (
        <button
          type="button"
          onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition"
          style={{ minWidth: '110px' }}
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed"
          disabled
          style={{ minWidth: '110px' }}
        >
          Next
        </button>
      )}
    </div>

    {/* Save button */}
    <div className="flex w-full md:w-auto justify-center md:justify-end order-2">
      {currentStep < 4 ? (
        <button
          type="button"
          className="px-8 py-2 bg-gray-200 text-gray-400 rounded-lg font-medium cursor-not-allowed flex items-center gap-2"
          disabled
          style={{ minWidth: '130px' }}
        >
          <Save className="w-5 h-5" />
          Save Profile
        </button>
      ) : currentStep === 4 ? (
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          style={{ minWidth: '130px' }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save & Continue
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-8 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition flex items-center gap-2"
          style={{ minWidth: '130px' }}
        >
          <CheckCircle className="w-5 h-5" />
          Finish
        </button>
      )}
    </div>
  </div>
</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;