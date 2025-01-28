import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart, PieChart } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const investmentData = [
  { name: 'Stocks', value: 45000 },
  { name: 'Bonds', value: 25000 },
  { name: 'Real Estate', value: 20000 },
  { name: 'Crypto', value: 10000 },
];

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#6366F1'];

const Investment: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Portfolio</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Invested', value: '$100,000', change: '+15.3%', icon: DollarSign, color: 'indigo' },
            { title: 'Best Performer', value: 'AAPL', change: '+24.8%', icon: TrendingUp, color: 'green' },
            { title: 'Worst Performer', value: 'TSLA', change: '-8.2%', icon: TrendingDown, color: 'red' },
            { title: 'Portfolio Risk', value: 'Moderate', change: 'Balanced', icon: BarChart, color: 'yellow' },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className={`w-12 h-12 bg-${item.color}-100 rounded-full flex items-center justify-center mb-4`}>
                <item.icon className={`w-6 h-6 text-${item.color}-600`} />
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{item.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className={`text-sm font-medium ${
                item.change.startsWith('+') ? 'text-green-600' : 
                item.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
              }`}>
                {item.change}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Asset Allocation</h3>
                <p className="text-sm text-gray-500">Portfolio distribution</p>
              </div>
              <PieChart className="w-6 h-6 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={investmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {investmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Investment Opportunities</h3>
                <p className="text-sm text-gray-500">Recommended investments</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Tech Growth Fund', type: 'Mutual Fund', risk: 'Moderate', return: '12.5%' },
                { name: 'Green Energy ETF', type: 'ETF', risk: 'High', return: '18.3%' },
                { name: 'Blue Chip Portfolio', type: 'Stocks', risk: 'Low', return: '8.7%' },
                { name: 'Real Estate Trust', type: 'REIT', risk: 'Moderate', return: '10.2%' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{item.return}</p>
                    <p className="text-sm text-gray-500">{item.risk} Risk</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investment;