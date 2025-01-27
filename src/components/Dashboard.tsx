import React, { useState } from 'react';
import {
  MessageSquare,
  BarChart3,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Home,
  PieChart,
  Wallet,
  ArrowUpRight,
  Bell,
  Search,
  ChevronDown,
  HelpCircle,
  FileText,
  LayoutDashboard,
  CircleDollarSign,
  LineChart,
  ArrowRight,
  Briefcase,
  Receipt
} from 'lucide-react';
import Chat from './Chat';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    {
      category: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'chat', label: 'AI Assistant', icon: MessageSquare }
      ]
    },
    {
      category: 'Finance',
      items: [
        { id: 'transactions', label: 'Transactions', icon: CircleDollarSign },
        { id: 'investments', label: 'Investments', icon: LineChart },
        { id: 'reports', label: 'Reports', icon: FileText }
      ]
    },
    {
      category: 'Business',
      items: [
        { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
        { id: 'invoices', label: 'Invoices', icon: Receipt },
        { id: 'wallet', label: 'Wallet', icon: Wallet }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PulseAI
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Quick search..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
            {menuItems.map((section) => (
              <div key={section.category}>
                <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.category}
                </h3>
                <div className="mt-3 space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'text-indigo-600 bg-indigo-50 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mr-3 ${
                        activeTab === item.id ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      {item.label}
                      {item.id === activeTab && (
                        <span className="ml-auto">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                  <p className="text-xs text-gray-500 truncate">john@example.com</p>
                </div>
              </div>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center">
          <div className="flex-1 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {menuItems.flatMap(section => section.items).find(item => item.id === activeTab)?.label}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-px bg-gray-200"></div>
              <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900">
                <span>Workspace</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {activeTab === 'chat' && <Chat />}
            {/* Add other tab content components here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;