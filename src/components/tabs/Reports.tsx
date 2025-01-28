import React from 'react';
import { FileBarChart, ArrowUpRight, Download, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const reportsData = [
  { date: '2024-01', income: 5000, expenses: 3000, profit: 2000 },
  { date: '2024-02', income: 6000, expenses: 3500, profit: 2500 },
  { date: '2024-03', income: 4500, expenses: 3200, profit: 1300 },
  { date: '2024-04', income: 7000, expenses: 4000, profit: 3000 },
  { date: '2024-05', income: 6500, expenses: 3800, profit: 2700 },
  { date: '2024-06', income: 8000, expenses: 4500, profit: 3500 },
];

const Reports: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: 'Total Revenue', value: '$45,000', change: '+12.5%', color: 'green' },
            { title: 'Total Expenses', value: '$22,000', change: '+5.2%', color: 'yellow' },
            { title: 'Net Profit', value: '$23,000', change: '+18.3%', color: 'blue' },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">{item.title}</h3>
                <span className={`text-sm font-medium text-${item.color}-600`}>{item.change}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <ArrowUpRight className={`w-5 h-5 text-${item.color}-600`} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Financial Overview</h3>
              <p className="text-sm text-gray-500">Income vs Expenses vs Profit</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Income</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Expenses</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Profit</span>
              </div>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#4F46E5" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;