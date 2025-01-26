import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot,
  MessageSquare, 
  BarChart3, 
  User,
  Menu,
  X,
  BookOpen,
  BrainCircuit,
  Receipt,
  Clock,
  Users,
  Activity,
  Zap,
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
  DollarSign,
  PieChart,
  LineChart,
  FileText,
  Building2,
  Wallet,
  CreditCard,
  TrendingDown,
  CircleDollarSign,
  BarChart,
  Banknote,
  Link,
  FileBarChart,
  ScrollText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Calendar,
  Bell,
  Download,
  Filter,
  CreditCard as CreditCardIcon,
  DollarSign as DollarSignIcon,
  Percent,
  Target,
  AlertTriangle,
  ChevronDown,
  Plus,
  Search,
  Trash2,
  ArrowDownLeft,
  LogOut,
  Settings
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { generateAIResponse } from '../services/deepseek';
import { getAuthorizationUrl } from '../services/quickbooks';

// Interfaces
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  recurring: boolean;
  unusual?: boolean;
}

interface Investment {
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  value: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'crypto';
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  recurring: boolean;
}

interface TaxDocument {
  id: string;
  name: string;
  type: string;
  date: Date;
  amount: number;
  status: 'filed' | 'pending' | 'draft';
}

interface FinancialGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: Date;
  category: 'savings' | 'investment' | 'debt' | 'other';
}

// Mock Data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date(),
    description: 'Grocery Shopping',
    amount: 156.78,
    category: 'Groceries',
    type: 'expense',
    recurring: false
  },
  {
    id: '2',
    date: new Date(),
    description: 'Monthly Salary',
    amount: 5000.00,
    category: 'Income',
    type: 'income',
    recurring: true
  },
  {
    id: '3',
    date: new Date(),
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    type: 'expense',
    recurring: true
  },
  {
    id: '4',
    date: new Date(),
    description: 'Unusual Large Purchase',
    amount: 999.99,
    category: 'Shopping',
    type: 'expense',
    recurring: false,
    unusual: true
  }
];

const mockInvestments: Investment[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 10,
    price: 175.84,
    value: 1758.40,
    change: 2.34,
    changePercent: 1.35,
    type: 'stock'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    quantity: 0.5,
    price: 42000,
    value: 21000,
    change: -1200,
    changePercent: -2.8,
    type: 'crypto'
  }
];

const mockBills: Bill[] = [
  {
    id: '1',
    name: 'Rent',
    amount: 2000,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    status: 'pending',
    recurring: true
  },
  {
    id: '2',
    name: 'Utilities',
    amount: 150,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    status: 'pending',
    recurring: true
  }
];

const mockTaxDocuments: TaxDocument[] = [
  {
    id: '1',
    name: 'W-2 Form',
    type: 'Income',
    date: new Date(),
    amount: 75000,
    status: 'filed'
  },
  {
    id: '2',
    name: '1099-INT',
    type: 'Interest Income',
    date: new Date(),
    amount: 500,
    status: 'pending'
  }
];

const mockFinancialGoals: FinancialGoal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    target: 25000,
    current: 15000,
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    category: 'savings'
  },
  {
    id: '2',
    name: 'Down Payment',
    target: 50000,
    current: 20000,
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    category: 'savings'
  }
];

// Mock data for charts and QuickBooks integration
const mockTransactionsForCharts = [
  { id: 1, date: new Date('2025-01-26'), amount: 1200, type: 'income', description: 'Client Payment - Project A' },
  { id: 2, date: new Date('2025-01-25'), amount: 450, type: 'expense', description: 'Office Supplies' },
  { id: 3, date: new Date('2025-01-24'), amount: 2500, type: 'income', description: 'Consulting Services' },
  { id: 4, date: new Date('2025-01-23'), amount: 800, type: 'expense', description: 'Software Subscription' },
  { id: 5, date: new Date('2025-01-22'), amount: 1800, type: 'income', description: 'Client Payment - Project B' },
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Mock data for spending by category
const spendingByCategory = [
  { name: 'Housing', value: 2000 },
  { name: 'Transportation', value: 500 },
  { name: 'Food', value: 800 },
  { name: 'Utilities', value: 300 },
  { name: 'Entertainment', value: 400 },
  { name: 'Healthcare', value: 600 }
];

const revenueData = [
  { month: 'Jan', value: 4000 },
  { month: 'Feb', value: 3000 },
  { month: 'Mar', value: 5000 },
  { month: 'Apr', value: 4500 },
  { month: 'May', value: 6000 },
  { month: 'Jun', value: 5500 }
];

const expensesData = [
  { month: 'Jan', value: 2000 },
  { month: 'Feb', value: 2200 },
  { month: 'Mar', value: 1800 },
  { month: 'Apr', value: 2500 },
  { month: 'May', value: 2300 },
  { month: 'Jun', value: 2100 }
];

const QuickBooksTab = () => {
  const [quickbooksTab, setQuickbooksTab] = useState<'overview' | 'transactions' | 'reports'>('overview');
  const [quickbooks, setQuickbooks] = useState({ isConnected: false });

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 px-6">
          {[
            { value: 'overview', label: 'Overview' },
            { value: 'transactions', label: 'Transactions' },
            { value: 'reports', label: 'Reports' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setQuickbooksTab(tab.value as any)}
              className={`px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                quickbooksTab === tab.value
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {!quickbooks.isConnected ? (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connect to QuickBooks
            </h3>
            <p className="text-gray-500 mb-6">
              Connect your QuickBooks account to sync your financial data and get AI-powered insights.
            </p>
            <button
              onClick={() => setQuickbooks({ isConnected: true })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Connect QuickBooks
            </button>
          </div>
        ) : (
          <>
            {quickbooksTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Revenue (Last 30 Days)</h4>
                    <div className="text-2xl font-semibold text-gray-900">$24,563.00</div>
                    <div className="text-sm text-green-600 mt-1">↑ 12% from last month</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Expenses (Last 30 Days)</h4>
                    <div className="text-2xl font-semibold text-gray-900">$12,789.00</div>
                    <div className="text-sm text-red-600 mt-1">↑ 8% from last month</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Profit Margin</h4>
                    <div className="text-2xl font-semibold text-gray-900">47.9%</div>
                    <div className="text-sm text-green-600 mt-1">↑ 2% from last month</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Revenue Trend</h4>
                  <div className="h-64">
                    <RechartsLineChart data={mockTransactionsForCharts} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#6366F1" />
                    </RechartsLineChart>
                  </div>
                </div>
              </div>
            )}

            {quickbooksTab === 'transactions' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">Recent Transactions</h4>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search transactions..."
                          className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                      <button className="px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        Export CSV
                      </button>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {mockTransactionsForCharts.map(transaction => (
                    <div key={transaction.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'income' ? (
                              <ArrowUpRight className={`w-5 h-5 ${
                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                              }`} />
                            ) : (
                              <ArrowDownLeft className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.description}
                            </div>
                            <div className="text-xs text-gray-500">
                              {transaction.date.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {quickbooksTab === 'reports' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Profit & Loss</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Revenue</span>
                      <span className="text-sm font-medium text-gray-900">$124,563.00</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Expenses</span>
                      <span className="text-sm font-medium text-gray-900">$52,789.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Net Profit</span>
                      <span className="text-sm font-medium text-green-600">$71,774.00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Balance Sheet</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Total Assets</span>
                      <span className="text-sm font-medium text-gray-900">$345,678.00</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Total Liabilities</span>
                      <span className="text-sm font-medium text-gray-900">$123,456.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Equity</span>
                      <span className="text-sm font-medium text-gray-900">$222,222.00</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'quickbooks' | 'profile'>('dashboard');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickbooks, setQuickbooks] = useState({ isConnected: false });
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingConversationId && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingConversationId]);

  const startEditing = (conversation: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConversationId(conversation.id);
    setEditingTitle(conversation.title);
  };

  const saveTitle = () => {
    if (!editingConversationId) return;
    
    const newTitle = editingTitle.trim();
    if (!newTitle) return;

    setConversations(prev => prev.map(conv =>
      conv.id === editingConversationId
        ? { ...conv, title: newTitle }
        : conv
    ));
    setEditingConversationId(null);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveTitle();
    } else if (e.key === 'Escape') {
      setEditingConversationId(null);
    }
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Conversation ${conversations.length + 1}`,
      messages: [],
      timestamp: new Date()
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    setMessages([]);
    setActiveTab('chat');
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (activeConversation?.id === conversationId) {
      setActiveConversation(null);
      setMessages([]);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setMessages(conversation.messages);
    setActiveTab('chat');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    // Update the conversation
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation.id 
        ? { ...conv, messages: updatedMessages }
        : conv
    ));

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'This is a simulated AI response.',
        sender: 'ai',
        timestamp: new Date()
      };
      const newMessages = [...updatedMessages, aiMessage];
      setMessages(newMessages);
      setIsTyping(false);
      
      // Update the conversation with AI response
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation.id 
          ? { ...conv, messages: newMessages }
          : conv
      ));
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage(e);
    }
  };

  const renderMessage = (message: Message) => (
    <div key={message.id} className={`flex items-start space-x-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
      {message.sender === 'ai' && (
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <Bot className="w-5 h-5 text-indigo-600" />
        </div>
      )}
      <div className={`max-w-md p-4 rounded-2xl ${
        message.sender === 'user' 
          ? 'bg-indigo-600 text-white' 
          : 'bg-white border border-gray-200'
      }`}>
        <p className={message.sender === 'user' ? 'text-white' : 'text-gray-800'}>
          {message.content}
        </p>
        <span className={`text-xs mt-2 block ${
          message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
      {message.sender === 'user' && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      {/* Alerts Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Important Updates</h2>
          <Bell className="w-6 h-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-lg">
            <AlertCircle className="w-6 h-6 mb-2" />
            <p className="font-medium">Low Balance Alert</p>
            <p className="text-sm opacity-80">Checking account below $1,000</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-lg">
            <Clock className="w-6 h-6 mb-2" />
            <p className="font-medium">Upcoming Bill</p>
            <p className="text-sm opacity-80">Rent due in 5 days</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-lg">
            <AlertTriangle className="w-6 h-6 mb-2" />
            <p className="font-medium">Unusual Activity</p>
            <p className="text-sm opacity-80">Large transaction detected</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-lg">
            <Target className="w-6 h-6 mb-2" />
            <p className="font-medium">Goal Achievement</p>
            <p className="text-sm opacity-80">Emergency fund at 80%</p>
          </div>
        </div>
      </div>

      {/* Financial Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCardIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">Excellent</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">785</h3>
          <p className="text-sm text-gray-500 mt-1">Credit Score</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Percent className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">Good</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">28%</h3>
          <p className="text-sm text-gray-500 mt-1">Debt-to-Income</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">+5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">25%</h3>
          <p className="text-sm text-gray-500 mt-1">Savings Rate</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-pink-600" />
            </div>
            <span className="text-sm font-medium text-pink-600">On Track</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">3/4</h3>
          <p className="text-sm text-gray-500 mt-1">Goals Progress</p>
        </div>
      </div>

      {/* Transaction Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" />
            </div>
          </div>
          <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
            {mockTransactions.map(transaction => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className={`w-5 h-5 ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {transaction.unusual && (
                  <div className="mt-2 flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Unusual activity detected</span>
                  </div>
                )}
                {transaction.recurring && (
                  <div className="mt-2 flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                    <RefreshCw className="w-4 h-4" />
                    <span>Recurring transaction</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
              <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={spendingByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {spendingByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Portfolio */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Investment Portfolio</h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Add Investment</span>
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {mockInvestments.map(investment => (
            <div key={investment.symbol} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    investment.type === 'stock' ? 'bg-blue-100' : 'bg-amber-100'
                  }`}>
                    {investment.type === 'stock' ? (
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    ) : (
                      <CircleDollarSign className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{investment.symbol}</p>
                      <span className="text-sm text-gray-500">{investment.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {investment.quantity} {investment.type === 'stock' ? 'shares' : 'coins'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${investment.value.toFixed(2)}</p>
                  <p className={`text-sm ${
                    investment.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {investment.change >= 0 ? '+' : ''}{investment.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Flow Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Income Streams</h3>
                <p className="text-sm text-gray-500">Monthly breakdown</p>
              </div>
              <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Salary</span>
                  <span className="text-sm font-medium text-gray-900">$5,000</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Investments</span>
                  <span className="text-sm font-medium text-gray-900">$1,200</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Freelance</span>
                  <span className="text-sm font-medium text-gray-900">$800</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-purple-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Bills</h3>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Calendar className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {mockBills.map(bill => (
              <div key={bill.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{bill.name}</p>
                      <p className="text-sm text-gray-500">
                        Due in {Math.ceil((bill.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${bill.amount}</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      bill.status === 'paid' 
                        ? 'bg-green-100 text-green-600'
                        : bill.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tax Planning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Tax Documents</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {mockTaxDocuments.map(doc => (
              <div key={doc.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${doc.amount.toFixed(2)}</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      doc.status === 'filed'
                        ? 'bg-green-100 text-green-600'
                        : doc.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Estimated Tax Payments</h3>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Q1 2024</span>
                <span className="text-sm font-medium text-green-600">Paid</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Q2 2024</span>
                <span className="text-sm font-medium text-yellow-600">Due in 45 days</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-indigo-900">Estimated Tax Liability</span>
                <span className="font-medium text-indigo-900">$12,450</span>
              </div>
              <p className="text-sm text-indigo-700">Based on current income and deductions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Tax Deductions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">Charitable Donations</span>
                  <span className="font-medium text-gray-900">$2,500</span>
                </div>
                <p className="text-sm text-gray-500">3 receipts tracked</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">Home Office</span>
                  <span className="font-medium text-gray-900">$1,800</span>
                </div>
                <p className="text-sm text-gray-500">Monthly expenses</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">Business Equipment</span>
                  <span className="font-medium text-gray-900">$3,200</span>
                </div>
                <p className="text-sm text-gray-500">5 items tracked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports & Analytics */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Financial Reports</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-500" />
              </button>
              <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Last 12 Months</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Income vs Expenses</h4>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Savings Growth</h4>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Net Worth Trend</h4>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#EC4899" strokeWidth={2} dot={false} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>This Year</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending by Category */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
          </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={spendingByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {spendingByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-200 ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center space-x-3 p-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-lg font-semibold text-gray-900">PulseAI V2</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {[
              { value: 'chat', label: 'Chat', icon: MessageSquare },
              { value: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { value: 'quickbooks', label: 'QuickBooks', icon: Receipt },
              { value: 'profile', label: 'Profile', icon: User }
            ].map(item => (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value as any)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${
                  activeTab === item.value
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Library Panel */}
      <div 
        className={`flex bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          showLibrary && activeTab === 'chat' ? 'w-80' : 'w-0'
        } overflow-hidden`}
      >
        <div className="h-full p-6" style={{ width: '320px' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Past Conversations</h3>
            </div>
          </div>
          <button
            onClick={createNewConversation}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 mb-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">New Conversation</span>
          </button>
          <div className="space-y-2">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`group relative px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  activeConversation?.id === conversation.id
                    ? 'bg-indigo-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => selectConversation(conversation)}
              >
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {editingConversationId === conversation.id ? (
                        <input
                          ref={titleInputRef}
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={saveTitle}
                          onKeyDown={handleTitleKeyDown}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2.5 py-0.5 text-sm bg-white rounded-lg border border-indigo-100 focus:outline-none focus:border-indigo-300 font-medium"
                          placeholder="Enter conversation title"
                        />
                      ) : (
                        <h4 
                          onDoubleClick={(e) => startEditing(conversation, e)}
                          className={`font-medium truncate cursor-text ${
                            activeConversation?.id === conversation.id
                              ? 'text-indigo-900'
                              : 'text-gray-900'
                          }`}
                          title="Double-click to edit"
                        >
                          {conversation.title}
                        </h4>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      className={`ml-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                        activeConversation?.id === conversation.id
                          ? 'text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100'
                          : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                      }`}
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{conversation.messages.length} messages</span>
                    <span>·</span>
                    <span>{new Date(conversation.timestamp).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {conversations.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setShowLibrary(!showLibrary)}
                className={`p-2 rounded-lg transition-colors ${
                  showLibrary 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === 'chat' && 'PulseAI V2'}
                {activeTab === 'dashboard' && 'Financial Dashboard'}
                {activeTab === 'quickbooks' && 'QuickBooks Integration'}
                {activeTab === 'profile' && 'User Profile'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {activeTab === 'chat' && messages.length > 0 && (
                <button
                  onClick={() => {
                    setMessages([]);
                    setActiveConversation(null);
                  }}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'chat' && (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6">
                    {messages.map((message, index) => (
                      <ChatMessage key={index} message={message} />
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!input.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'quickbooks' && <QuickBooksTab />}
              {activeTab === 'profile' && (
                <div className="p-6 max-w-2xl mx-auto">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gray-200" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
                        <p className="text-sm text-gray-500">john@example.com</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value="John Doe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value="john@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value="Acme Inc"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;