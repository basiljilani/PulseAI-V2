import React from 'react';
import { Link, Receipt, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getAuthorizationUrl } from '../../services/quickbooks';

interface QuickBooksProps {
  isConnected: boolean;
}

const QuickBooks: React.FC<QuickBooksProps> = ({ isConnected }) => {
  const handleQuickBooksConnect = () => {
    const authUrl = getAuthorizationUrl();
    window.location.href = authUrl;
  };

  if (!isConnected) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
            <Link className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect QuickBooks</h2>
          <p className="text-gray-600 mb-8">
            Link your QuickBooks account to sync your financial data and automate your bookkeeping.
          </p>
          <button
            onClick={handleQuickBooksConnect}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <Receipt className="w-5 h-5 mr-2" />
            Connect to QuickBooks
          </button>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <ShieldCheck className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Secure Connection</h3>
              <p className="text-sm text-gray-500 mt-1">Your data is encrypted and protected</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <RefreshCw className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Auto Sync</h3>
              <p className="text-sm text-gray-500 mt-1">Real-time data synchronization</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Connected to QuickBooks</p>
            <p className="text-sm text-green-600">Last synced: 5 minutes ago</p>
          </div>
        </div>
        <button className="text-sm text-green-700 hover:text-green-800 font-medium">
          Sync Now
        </button>
      </div>
    </div>
  );
};

export default QuickBooks;