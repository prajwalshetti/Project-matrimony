import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, Send, Inbox, Heart } from 'lucide-react';

const badgeFor = (status) => {
  if (status === 'accepted') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-2 py-1 text-[11px] font-semibold">
        <CheckCircle className="w-3 h-3" /> Accepted
      </span>
    );
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 text-pink-700 px-2 py-1 text-[11px] font-semibold">
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
  }
  // pending
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 text-pink-700 px-2 py-1 text-[11px] font-semibold">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
};

const Row = ({ avatarUrl, name, subline, right, note }) => {
  return (
    <li className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-400">
            <span className="text-white font-bold">{(name?.[0] || '?').toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-gray-800 truncate">{name}</p>
          {right}
        </div>
        {note ? (
          <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-2">“{note}”</p>
        ) : null}
        <p className="text-[11px] text-gray-400 mt-0.5">{subline}</p>
      </div>
    </li>
  );
};

const Requests = () => {
  const [activeTab, setActiveTab] = useState('received'); // 'sent' | 'received'
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null); // for disabling buttons while calling API

  // Load lists
  const loadLists = async () => {
    try {
      const [s, r] = await Promise.all([
        axios.get('http://localhost:8000/api/v1/request/sentRequests', { withCredentials: true }),
        axios.get('http://localhost:8000/api/v1/request/receivedRequests', { withCredentials: true }),
      ]);
      // newest first
      const sortByNewest = (arr) => [...(arr || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setSent(sortByNewest(s.data.requests || []));
      setReceived(sortByNewest(r.data.requests || []));
    } catch (err) {
      // optionally toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  // Actions
  const accept = async (requestId) => {
    setActingId(requestId);
    try {
      await axios.put(
        `http://localhost:8000/api/v1/request/acceptRequest/${requestId}`,
        {},
        { withCredentials: true }
      );
      await loadLists();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to accept request');
    } finally {
      setActingId(null);
    }
  };

  const reject = async (requestId) => {
    setActingId(requestId);
    try {
      await axios.put(
        `http://localhost:8000/api/v1/request/rejectRequest/${requestId}`,
        {},
        { withCredentials: true }
      );
      await loadLists();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to reject request');
    } finally {
      setActingId(null);
    }
  };

  const cancel = async (requestId) => {
    setActingId(requestId);
    try {
      await axios.put(
        `http://localhost:8000/api/v1/request/cancelRequest/${requestId}`,
        {},
        { withCredentials: true }
      );
      await loadLists();
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to cancel request');
    } finally {
      setActingId(null);
    }
  };

  // Group by status
  const groupByStatus = (items) => {
    const grouped = { pending: [], accepted: [], rejected: [], cancelled: [] };
    for (const it of items) {
      (grouped[it.status] || grouped.pending).push(it);
    }
    return grouped;
  };

  const data = activeTab === 'sent' ? sent : received;
  const grouped = useMemo(() => groupByStatus(data), [data, activeTab]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-gray-600">
          <Heart className="w-5 h-5 text-orange-500" />
          Loading requests...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 py-4 sm:py-8 px-3 sm:px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl sm:max-w-3xl mx-auto relative">
        {/* Small nav with two buttons */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 sm:p-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-lg font-semibold text-sm transition ${
                activeTab === 'sent'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Send className="w-4 h-4" />
              Sent
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-lg font-semibold text-sm transition ${
                activeTab === 'received'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Inbox className="w-4 h-4" />
              Received
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 sm:p-5">
          {/* Pending */}
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">Pending</h3>
            {grouped.pending.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
                No pending requests
              </div>
            ) : (
              <ul className="space-y-3">
                {grouped.pending.map((req) => {
                  const user = activeTab === 'sent' ? req.receiverId : req.senderId;
                  return (
                    <Row
                      key={req._id}
                      avatarUrl={user?.profilePhoto}
                      name={`${user?.name || ''} ${user?.lastName || ''}`.trim()}
                      subline={new Date(req.createdAt).toLocaleString()}
                      note={req.message}
                      right={
                        activeTab === 'received' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => accept(req._id)}
                              disabled={actingId === req._id}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                                actingId === req._id
                                  ? 'bg-gray-200 text-gray-500'
                                  : 'bg-green-100 text-green-800 hover:ring-2 hover:ring-green-200'
                              }`}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => reject(req._id)}
                              disabled={actingId === req._id}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                                actingId === req._id
                                  ? 'bg-gray-200 text-gray-500'
                                  : 'bg-pink-100 text-pink-700 hover:ring-2 hover:ring-pink-200'
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {badgeFor('pending')}
                            <button
                              onClick={() => cancel(req._id)}
                              disabled={actingId === req._id}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                                actingId === req._id
                                  ? 'bg-gray-200 text-gray-500'
                                  : 'bg-gray-100 text-gray-700 hover:ring-2 hover:ring-gray-200'
                              }`}
                            >
                              Cancel
                            </button>
                          </div>
                        )
                      }
                    />
                  );
                })}
              </ul>
            )}
          </div>

          {/* Accepted */}
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">Accepted</h3>
            {grouped.accepted.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
                No accepted requests
              </div>
            ) : (
              <ul className="space-y-3">
                {grouped.accepted.map((req) => {
                  const user = activeTab === 'sent' ? req.receiverId : req.senderId;
                  return (
                    <Row
                      key={req._id}
                      avatarUrl={user?.profilePhoto}
                      name={`${user?.name || ''} ${user?.lastName || ''}`.trim()}
                      subline={new Date(req.createdAt).toLocaleString()}
                      note={req.message}
                      right={badgeFor('accepted')}
                    />
                  );
                })}
              </ul>
            )}
          </div>

          {/* Rejected */}
          <div className="mb-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">Rejected</h3>
            {grouped.rejected.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
                No rejected requests
              </div>
            ) : (
              <ul className="space-y-3">
                {grouped.rejected.map((req) => {
                  const user = activeTab === 'sent' ? req.receiverId : req.senderId;
                  return (
                    <Row
                      key={req._id}
                      avatarUrl={user?.profilePhoto}
                      name={`${user?.name || ''} ${user?.lastName || ''}`.trim()}
                      subline={new Date(req.createdAt).toLocaleString()}
                      note={req.message}
                      right={badgeFor('rejected')}
                    />
                  );
                })}
              </ul>
            )}
          </div>

          {/* Cancelled (only show in Sent tab) */}
          {activeTab === 'sent' && (
            <div className="mt-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">Cancelled</h3>
              {grouped.cancelled.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
                  No cancelled requests
                </div>
              ) : (
                <ul className="space-y-3">
                  {grouped.cancelled.map((req) => {
                    const user = req.receiverId;
                    return (
                      <Row
                        key={req._id}
                        avatarUrl={user?.profilePhoto}
                        name={`${user?.name || ''} ${user?.lastName || ''}`.trim()}
                        subline={new Date(req.createdAt).toLocaleString()}
                        note={req.message}
                        right={
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2 py-1 text-[11px] font-semibold">
                            <Clock className="w-3 h-3" /> Cancelled
                          </span>
                        }
                      />
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
