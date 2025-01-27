import React, { useState } from 'react';
import {
  Receipt,
  Link,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  Download,
  Filter,
  Search,
  ArrowRight
} from 'lucide-react';

const QuickBooksTab: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Receipt className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Connect to QuickBooks</h2>
          <p className="text-gray-600 mb-8">
            Connect your QuickBooks account to automatically sync your financial data and streamline your accounting process.
          </p>
          <button
            onClick={handleConnect}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Link className="w-5 h-5 mr-2" />
            Connect QuickBooks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Status Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Connected to QuickBooks</h3>
              <p className="text-sm text-gray-500">Last synced: 5 minutes ago</p>
            </div>
          </div>
          <button
            onClick={handleSync}
            className={`inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
              isSyncing ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isSyncing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900">Generate Reports</h3>
          <p className="text-sm text-gray-500 mt-1">Create custom financial reports</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900">Export Data</h3>
          <p className="text-sm text-gray-500 mt-1">Download financial records</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900">Reconciliation</h3>
          <p className="text-sm text-gray-500 mt-1">Review and match transactions</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search activity..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Invoice Synced</p>
                  <p className="text-sm text-gray-500">INV-2024-{item.toString().padStart(3, '0')}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
          ))}
        </div>

        <button className="mt-6 w-full py-2 flex items-center justify-center space-x-2 text-sm text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors">
          <FileText className="w-4 h-4" />
          <span>View All Activity</span>
        </button>
      </div>
    </div>
  );
};

export default QuickBooksTab;
