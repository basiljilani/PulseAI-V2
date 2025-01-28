import React from 'react';
import { Wallet, CreditCard, TrendingUp, TrendingDown, CircleDollarSign, Banknote } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const portfolioData = [
  { date: '2024-01', value: 100000 },
  { date: '2024-02', value: 115000 },
  { date: '2024-03', value: 108000 },
  { date: '2024-04', value: 125000 },
  { date: '2024-05', value: 140000 },
  { date: '2024-06', value: 135000 },
];

const Portfolio: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Portfolio Overview</h2>
            <p className="text-gray-500">Track your financial portfolio performance</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            <Wallet className="w-4 h-4 mr-2" />
            Add Assets
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+15.3%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">$135,000</h3>
            <p className="text-sm text-gray-500 mt-1">Total Portfolio Value</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CircleDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+$2,500</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">$8,500</h3>
            <p className="text-sm text-gray-500 mt-1">Monthly Returns</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Banknote className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-600">15 Assets</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">8</h3>
            <p className="text-sm text-gray-500 mt-1">Asset Classes</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Performance</h3>
              <p className="text-sm text-gray-500">6-month trend</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">YTD Return:</span>
              <span className="text-sm font-medium text-green-600">+35%</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {[
              { type: 'Buy', asset: 'AAPL', amount: '$2,500', date: '2024-06-15', change: '+2.3%' },
              { type: 'Sell', asset: 'TSLA', amount: '$1,800', date: '2024-06-14', change: '-1.5%' },
              { type: 'Buy', asset: 'VTI', amount: '$3,000', date: '2024-06-12', change: '+1.8%' },
              { type: 'Buy', asset: 'BTC', amount: '$1,000', date: '2024-06-10', change: '+4.2%' },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'Buy' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'Buy' ? (
                      <TrendingUp className={`w-4 h-4 ${
                        transaction.type === 'Buy' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    ) : (
                      <TrendingDown className={`w-4 h-4 ${
                        transaction.type === 'Buy' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.asset}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{transaction.amount}</p>
                  <p className={`text-sm ${
                    transaction.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;