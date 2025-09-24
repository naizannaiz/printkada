import React, { useState, useEffect } from 'react';
import { FaTrash, FaChartBar, FaPlay, FaPause, FaSync } from 'react-icons/fa';

const AdminCleanup = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastCleanup, setLastCleanup] = useState(null);
  const [error, setError] = useState(null);

  const CLEANUP_SERVICE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://pri-production.up.railway.app/' 
    : 'http://localhost:5001';

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${CLEANUP_SERVICE_URL}/api/cleanup/stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data);
      } else {
        setError('Failed to fetch cleanup statistics');
      }
    } catch (error) {
      setError('Cleanup service is not running or not accessible');
    } finally {
      setLoading(false);
    }
  };

  const triggerCleanup = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${CLEANUP_SERVICE_URL}/api/cleanup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLastCleanup(data);
        // Refresh stats after cleanup
        setTimeout(fetchStats, 1000);
      } else {
        setError('Cleanup failed: ' + data.error);
      }
    } catch (error) {
      setError('Failed to trigger cleanup');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FaTrash className="text-red-600" />
                Cleanup Management
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor and control automatic cleanup of old print requests and files
              </p>
            </div>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Current Statistics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Old Requests</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {loading ? '...' : (stats?.oldRequestsCount || 0)}
                  </p>
                </div>
                <FaChartBar className="text-blue-500 text-2xl" />
              </div>
              <p className="text-blue-600 text-xs mt-2">
                Pending deletion (older than 24h)
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Cutoff Time</p>
                  <p className="text-sm font-bold text-green-900">
                    {stats?.cutoffTime ? new Date(stats.cutoffTime).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <FaPause className="text-green-500 text-2xl" />
              </div>
              <p className="text-green-600 text-xs mt-2">
                Requests before this time will be deleted
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Service Status</p>
                  <p className="text-sm font-bold text-purple-900">
                    {stats ? 'Running' : 'Not Available'}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${stats ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <p className="text-purple-600 text-xs mt-2">
                Cleanup service status
              </p>
            </div>
          </div>

          {/* Manual Cleanup Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4 flex items-center gap-2">
              <FaPlay className="text-yellow-600" />
              Manual Cleanup
            </h2>
            <p className="text-yellow-700 mb-4">
              Trigger immediate cleanup of old print requests and associated PDF files. 
              This will permanently delete data older than 24 hours.
            </p>
            
            <div className="flex items-center gap-4">
              <button
                onClick={triggerCleanup}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                  loading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Running Cleanup...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Run Cleanup Now
                  </>
                )}
              </button>
              
              {lastCleanup && (
                <div className="text-sm text-gray-600">
                  Last cleanup: {lastCleanup.firestoreDeleted} documents, {lastCleanup.storageDeleted} files deleted
                </div>
              )}
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Automatic Cleanup</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Runs every 6 hours automatically</li>
                  <li>• Deletes requests older than 24 hours</li>
                  <li>• Removes associated PDF files from storage</li>
                  <li>• Logs all activities for monitoring</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Safety Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Error handling for individual file failures</li>
                  <li>• Non-blocking operations</li>
                  <li>• Detailed logging and monitoring</li>
                  <li>• Manual control available</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {lastCleanup && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Last Cleanup Results</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-green-600 text-sm">Firestore Documents</p>
                  <p className="text-2xl font-bold text-green-900">{lastCleanup.firestoreDeleted}</p>
                </div>
                <div>
                  <p className="text-green-600 text-sm">Storage Files</p>
                  <p className="text-2xl font-bold text-green-900">{lastCleanup.storageDeleted}</p>
                </div>
                <div>
                  <p className="text-green-600 text-sm">Timestamp</p>
                  <p className="text-sm font-bold text-green-900">
                    {new Date(lastCleanup.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCleanup;
