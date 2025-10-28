import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Search as SearchIcon, Filter, X, User, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import NotLoggedIn from './other_components/NotLoggedIn';
import NotProfileCompleted from './other_components/NotProfileCompleted';

const Search = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Request/connection state
  const [sendingRequest, setSendingRequest] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  // Filters
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    searchName: '',
    gender: '',
    foodPreference: '',
    occupationType: ''
  });

  // Send-request modal
  const [openSendModal, setOpenSendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');

  // Init
  useEffect(() => {
    checkLoggedInUser();
  }, []);

  useEffect(() => {
    if (loggedInUser && loggedInUser.isProfileCompleted) {
      fetchAllUsers();
      fetchSentRequests();
      fetchReceivedRequests();
      fetchConnections();
    }
  }, [loggedInUser]);

  useEffect(() => {
    applyFilters();
  }, [filters, allUsers]);

  const checkLoggedInUser = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/getLoggedinUser', { withCredentials: true });
      setLoggedInUser(res.data);
      setLoading(false);
    } catch (err) {
      setLoggedInUser(null);
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/getAllUsers', { withCredentials: true });
      const onlyOthersWithProfileDone = res.data.filter(
        u => u._id !== loggedInUser._id && u.isProfileCompleted === true
      );
      setAllUsers(onlyOthersWithProfileDone);
      setFilteredUsers(onlyOthersWithProfileDone);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/request/sentRequests', { withCredentials: true });
      setSentRequests(res.data.requests || []);
    } catch {}
  };

  const fetchReceivedRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/request/receivedRequests', { withCredentials: true });
      setReceivedRequests(res.data.requests || []);
    } catch {}
  };

  const fetchConnections = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/connection/myConnections', { withCredentials: true });
      setConnections(res.data.connections || []);
    } catch {}
  };

  // Determine status for given user
  const getRequestStatus = (userId) => {
    const isConnected = connections.some(conn => conn.connectedUser._id === userId);
    if (isConnected) return { status: 'connected', label: 'Connected' };

    const pendingSent = sentRequests.find(req => req.receiverId._id === userId && req.status === 'pending');
    if (pendingSent) return { status: 'pending-sent', label: 'Request Sent' };

    const pendingReceived = receivedRequests.find(req => req.senderId._id === userId && req.status === 'pending');
    if (pendingReceived) return { status: 'pending-received', label: 'Request Received' };

    return { status: 'none', label: 'Connect' };
  };

  const applyFilters = () => {
    let f = [...allUsers];

    if (filters.searchName) {
      const q = filters.searchName.toLowerCase();
      f = f.filter(u =>
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.lastName && u.lastName.toLowerCase().includes(q))
      );
    }
    if (filters.gender) f = f.filter(u => u.gender === filters.gender);
    if (filters.foodPreference) f = f.filter(u => u.foodPreference === filters.foodPreference);
    if (filters.occupationType) f = f.filter(u => u.occupationType === filters.occupationType);

    setFilteredUsers(f);
  };

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters({
    searchName: '',
    gender: '',
    foodPreference: '',
    occupationType: ''
  });

  // Open modal instead of direct send
  const openConnectModal = (user) => {
    setSelectedUser(user);
    setRequestMessage('');
    setOpenSendModal(true);
  };

  const submitConnection = async () => {
    if (!selectedUser) return;
    setSendingRequest(selectedUser._id);
    try {
      await axios.post(
        'http://localhost:8000/api/v1/request/sendRequest',
        { receiverId: selectedUser._id, message: requestMessage.trim() },
        { withCredentials: true }
      );
      setOpenSendModal(false);
      setSelectedUser(null);
      setRequestMessage('');
      // refresh to reflect pending state
      fetchSentRequests();
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to send request';
      alert(msg);
    } finally {
      setSendingRequest(null);
    }
  };

  // Loading
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

  if (!loggedInUser) return <NotLoggedIn />;
  if (!loggedInUser.isProfileCompleted) return <NotProfileCompleted />;

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

        {/* Search + Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex gap-2 sm:gap-4">
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
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm sm:text-base transition hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
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
              const status = getRequestStatus(user._id);

              return (
                <div key={user._id} className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
                  <div className="h-48 sm:h-64 md:h-80 bg-gray-200 overflow-hidden relative">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-400">
                        <span className="text-white text-4xl sm:text-5xl md:text-7xl font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 md:p-6">
                    <h3 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 truncate">
                      {user.name} {user.lastName}
                    </h3>

                    {/* Minimal info on mobile, more on larger screens */}
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

                    <div className="flex gap-2 sm:gap-3">
                      {/* Status-aware primary button */}
                      {status.status === 'none' ? (
                        <button
                          onClick={() => openConnectModal(user)}
                          disabled={sendingRequest === user._id}
                          className={`flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                            sendingRequest === user._id
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg transform hover:scale-105'
                          }`}
                        >
                          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${sendingRequest === user._id ? '' : 'fill-white'}`} />
                          <span className="hidden sm:inline">Connect</span>
                          <span className="sm:hidden">+</span>
                        </button>
                      ) : status.status === 'pending-sent' ? (
                        <button
                          disabled
                          className="flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg font-semibold text-xs sm:text-sm md:text-base bg-yellow-100 text-yellow-700 cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2"
                        >
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          <span className="hidden sm:inline">Pending</span>
                          <span className="sm:hidden">⏳</span>
                        </button>
                      ) : status.status === 'connected' ? (
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
                          <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
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

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
                  <h2 className="text-xl sm:text-2xl font-bold">Filter Profiles</h2>
                </div>
                <button onClick={() => setShowFilterModal(false)} className="p-1.5 sm:p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                {/* Gender */}
                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Gender</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {['', 'Male', 'Female'].map((g, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleFilterChange('gender', g)}
                        className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                          filters.gender === g ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {g === '' ? 'All' : g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food Preference */}
                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Food Preference</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {['', 'Vegetarian', 'Eggetarian', 'Non-Veg'].map((f, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleFilterChange('foodPreference', f)}
                        className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                          filters.foodPreference === f ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {f === '' ? 'All' : f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occupation Type */}
                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Occupation Type</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {['', 'Govt', 'Private', 'Business'].map((o, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleFilterChange('occupationType', o)}
                        className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                          filters.occupationType === o ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {o === '' ? 'All' : (o === 'Govt' ? 'Government' : o)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 p-4 sm:p-6 rounded-b-xl sm:rounded-b-2xl flex gap-2 sm:gap-3">
                <button onClick={clearFilters} className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 border-2 border-gray-300 rounded-lg font-semibold text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition">
                  Clear All
                </button>
                <button onClick={() => setShowFilterModal(false)} className="flex-1 py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg transition">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Request Modal */}
        {openSendModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpenSendModal(false)} />

            {/* Sheet on mobile, dialog on larger */}
            <div className="relative w-full sm:max-w-md sm:rounded-2xl sm:overflow-hidden bg-white rounded-t-2xl shadow-2xl animate-[slideUp_0.2s_ease-out] sm:animate-none">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-white" />
                  <h3 className="text-lg sm:text-xl font-bold">Send Connection Request</h3>
                </div>
                <button
                  className="p-2 hover:bg-white/20 rounded-lg"
                  onClick={() => setOpenSendModal(false)}
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <p className="text-sm text-gray-600">
                    Sending request to <span className="font-semibold text-gray-800">{selectedUser.name} {selectedUser.lastName}</span>
                  </p>
                </div>

                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Add a message (optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Write a short note to introduce yourself..."
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition text-sm"
                />
                <div className="mt-2 text-xs text-gray-500">{requestMessage.length}/500</div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 bg-gray-50 flex gap-2">
                <button
                  onClick={() => setOpenSendModal(false)}
                  className="flex-1 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg font-semibold text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={submitConnection}
                  disabled={sendingRequest === selectedUser._id}
                  className={`flex-1 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition ${
                    sendingRequest === selectedUser._id
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                  }`}
                >
                  {sendingRequest === selectedUser._id ? 'Sending...' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Search;
