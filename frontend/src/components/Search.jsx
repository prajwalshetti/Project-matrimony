import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Search as SearchIcon, Filter, X, User, Clock, CheckCircle } from 'lucide-react';
import NotLoggedIn from './other_components/NotLoggedIn';
import NotProfileCompleted from './other_components/NotProfileCompleted';

const Search = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    searchName: '',
    gender: '',
    foodPreference: '',
    occupationType: ''
  });

  // Check if user is logged in
  useEffect(() => {
    checkLoggedInUser();
  }, []);

  // Fetch all users when logged in user is loaded
  useEffect(() => {
    if (loggedInUser && loggedInUser.isProfileCompleted) {
      fetchAllUsers();
      fetchSentRequests();
      fetchReceivedRequests();
      fetchConnections();
    }
  }, [loggedInUser]);

  // Apply filters whenever filters or allUsers change
  useEffect(() => {
    applyFilters();
  }, [filters, allUsers]);

  const checkLoggedInUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/user/getLoggedinUser', {
        withCredentials: true
      });
      setLoggedInUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error checking logged in user:', error);
      setLoggedInUser(null);
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/user/getAllUsers', {
        withCredentials: true
      });
      
      // Filter out the logged-in user AND users with incomplete profiles
      const filteredUsers = response.data.filter(
        user => user._id !== loggedInUser._id && user.isProfileCompleted === true
      );
      setAllUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    }
  };

  const fetchSentRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/request/sentRequests', {
        withCredentials: true
      });
      setSentRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  const fetchReceivedRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/request/receivedRequests', {
        withCredentials: true
      });
      setReceivedRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching received requests:', error);
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/connection/myConnections', {
        withCredentials: true
      });
      setConnections(response.data.connections || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  // Check request/connection status for a user
  const getRequestStatus = (userId) => {
    // Check if connected
    const isConnected = connections.some(
      conn => conn.connectedUser._id === userId
    );
    if (isConnected) return { status: 'connected', label: 'Connected' };

    // Check if pending request sent
    const pendingSentRequest = sentRequests.find(
      req => req.receiverId._id === userId && req.status === 'pending'
    );
    if (pendingSentRequest) return { status: 'pending-sent', label: 'Request Sent' };

    // Check if pending request received
    const pendingReceivedRequest = receivedRequests.find(
      req => req.senderId._id === userId && req.status === 'pending'
    );
    if (pendingReceivedRequest) return { status: 'pending-received', label: 'Request Received' };

    // No request or connection
    return { status: 'none', label: 'Connect' };
  };

  const applyFilters = () => {
    let filtered = [...allUsers];

    // Search by name
    if (filters.searchName) {
      filtered = filtered.filter(user => 
        (user.name && user.name.toLowerCase().includes(filters.searchName.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(filters.searchName.toLowerCase()))
      );
    }

    // Filter by gender
    if (filters.gender) {
      filtered = filtered.filter(user => user.gender === filters.gender);
    }

    // Filter by food preference
    if (filters.foodPreference) {
      filtered = filtered.filter(user => user.foodPreference === filters.foodPreference);
    }

    // Filter by occupation type
    if (filters.occupationType) {
      filtered = filtered.filter(user => user.occupationType === filters.occupationType);
    }

    setFilteredUsers(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchName: '',
      gender: '',
      foodPreference: '',
      occupationType: ''
    });
  };

  const handleSendRequest = async (receiverId) => {
    setSendingRequest(receiverId);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/request/sendRequest',
        {
          receiverId: receiverId,
          message: ''
        },
        {
          withCredentials: true
        }
      );
      
      alert('Request sent successfully!');
      // Refresh requests to update UI
      fetchSentRequests();
    } catch (error) {
      console.error('Error sending request:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to send request');
      }
    } finally {
      setSendingRequest(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!loggedInUser) {
    return <NotLoggedIn />;
  }

  // Profile not completed
  if (!loggedInUser.isProfileCompleted) {
    return <NotProfileCompleted />;
  }

  // Main content - Show all users
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 py-4 sm:py-8 px-3 sm:px-4">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-3 sm:mb-4">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Find Your Perfect Match
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Browse profiles and connect with people who matter</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex gap-2 sm:gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={filters.searchName}
                onChange={(e) => handleFilterChange('searchName', e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition"
              />
            </div>
            {/* Filter Button */}
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm sm:text-base transition hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
            Showing <span className="font-semibold text-orange-600">{filteredUsers.length}</span> profile{filteredUsers.length !== 1 ? 's' : ''}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base sm:text-lg mb-2">No profiles found</p>
            <p className="text-gray-400 text-xs sm:text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {filteredUsers.map((user) => {
              const requestStatus = getRequestStatus(user._id);
              
              return (
                <div 
                  key={user._id} 
                  className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  {/* Profile Photo */}
                  <div className="h-48 sm:h-64 md:h-80 bg-gray-200 overflow-hidden relative">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-400">
                        <span className="text-white text-4xl sm:text-5xl md:text-7xl font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* User Details - Minimal for mobile */}
                  <div className="p-3 sm:p-4 md:p-6">
                    <h3 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 truncate">
                      {user.name} {user.lastName}
                    </h3>
                    
                    {/* Basic info - only on larger screens */}
                    <div className="hidden sm:block space-y-1.5 md:space-y-2 text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-5 md:mb-6">
                      {user.currentCity && (
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full"></span>
                          <span className="font-medium">City:</span> {user.currentCity}
                        </div>
                      )}
                      {user.occupation && (
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-500 rounded-full"></span>
                          <span className="font-medium">Occupation:</span> <span className="truncate">{user.occupation}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3">
                      {/* Connect Button - Status Based */}
                      {requestStatus.status === 'none' ? (
                        <button
                          onClick={() => handleSendRequest(user._id)}
                          disabled={sendingRequest === user._id}
                          className={`flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                            sendingRequest === user._id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg transform hover:scale-105'
                          }`}
                        >
                          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${sendingRequest === user._id ? '' : 'fill-white'}`} />
                          <span className="hidden sm:inline">{sendingRequest === user._id ? 'Sending...' : 'Connect'}</span>
                          <span className="sm:hidden">+</span>
                        </button>
                      ) : requestStatus.status === 'pending-sent' ? (
                        <button
                          disabled
                          className="flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg font-semibold text-xs sm:text-sm md:text-base bg-yellow-100 text-yellow-700 cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2"
                        >
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          <span className="hidden sm:inline">Pending</span>
                          <span className="sm:hidden">⏳</span>
                        </button>
                      ) : requestStatus.status === 'connected' ? (
                        <button
                          disabled
                          className="flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg font-semibold text-xs sm:text-sm md:text-base bg-green-100 text-green-700 cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2"
                        >
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          <span className="hidden sm:inline">Connected</span>
                          <span className="sm:hidden">✓</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg font-semibold text-xs sm:text-sm md:text-base bg-blue-100 text-blue-700 cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2"
                        >
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          <span className="hidden sm:inline">Received</span>
                          <span className="sm:hidden">💌</span>
                        </button>
                      )}
                      
                      <button
                        className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 border-2 border-gray-300 rounded-lg font-semibold text-xs sm:text-sm md:text-base text-gray-700 hover:bg-gray-50 transition-all hover:border-orange-500"
                        onClick={() => {
                          alert('View profile feature coming soon!');
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Modal - Same as before */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-bold">Filter Profiles</h2>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1.5 sm:p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Gender Filter */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Gender</label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={() => handleFilterChange('gender', '')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                      filters.gender === ''
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange('gender', 'Male')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                      filters.gender === 'Male'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => handleFilterChange('gender', 'Female')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                      filters.gender === 'Female'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Food Preference Filter */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Food Preference</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={() => handleFilterChange('foodPreference', '')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                      filters.foodPreference === ''
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange('foodPreference', 'Vegetarian')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                      filters.foodPreference === 'Vegetarian'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Vegetarian
                  </button>
                  <button
                    onClick={() => handleFilterChange('foodPreference', 'Eggetarian')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                      filters.foodPreference === 'Eggetarian'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Eggetarian
                  </button>
                  <button
                    onClick={() => handleFilterChange('foodPreference', 'Non-Veg')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                      filters.foodPreference === 'Non-Veg'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Non-Veg
                  </button>
                </div>
              </div>

              {/* Occupation Type Filter */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Occupation Type</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={() => handleFilterChange('occupationType', '')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                      filters.occupationType === ''
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange('occupationType', 'Govt')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                      filters.occupationType === 'Govt'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Government
                  </button>
                  <button
                    onClick={() => handleFilterChange('occupationType', 'Private')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                      filters.occupationType === 'Private'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Private
                  </button>
                  <button
                    onClick={() => handleFilterChange('occupationType', 'Business')}
                    className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                      filters.occupationType === 'Business'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Business
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 p-4 sm:p-6 rounded-b-xl sm:rounded-b-2xl flex gap-2 sm:gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 border-2 border-gray-300 rounded-lg font-semibold text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
