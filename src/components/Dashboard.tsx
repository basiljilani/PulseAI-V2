import React, { useState, useEffect } from 'react';
import { MessageSquare, BarChart3, Receipt, Menu, X, BookOpen, BrainCircuit, FileBarChart, TrendingUp, Wallet, PlusCircle, Pencil, Trash2, Check } from 'lucide-react';
import Chat from './tabs/Chat';
import FinanceDashboard from './tabs/FinanceDashboard';
import QuickBooks from './tabs/QuickBooks';
import Reports from './tabs/Reports';
import Investment from './tabs/Investment';
import Portfolio from './tabs/Portfolio';
import { Profile } from './Profile';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

type TabType = 'chat' | 'dashboard' | 'quickbooks' | 'reports' | 'investment' | 'portfolio';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [quickbooks, setQuickbooks] = useState({ isConnected: false });
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Initialize with a default conversation
  useEffect(() => {
    if (conversations.length === 0) {
      const newId = Date.now().toString();
      const initialConversation: Conversation = {
        id: newId,
        title: 'New Conversation',
        messages: [{
          id: Date.now().toString(),
          text: "Hello! I'm Pulse AI V2, your financial advisor. How can I help you today?",
          sender: 'ai',
          timestamp: new Date()
        }],
        createdAt: new Date()
      };
      setConversations([initialConversation]);
      setCurrentConversationId(newId);
    }
  }, []);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const startNewChat = () => {
    const newId = Date.now().toString();
    const newConversation: Conversation = {
      id: newId,
      title: 'New Conversation',
      messages: [{
        id: Date.now().toString(),
        text: "Hello! I'm Pulse AI V2, your financial advisor. How can I help you today?",
        sender: 'ai',
        timestamp: new Date()
      }],
      createdAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    setActiveTab('chat');
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      const remainingConversations = conversations.filter(c => c.id !== id);
      if (remainingConversations.length > 0) {
        setCurrentConversationId(remainingConversations[0].id);
      } else {
        startNewChat();
      }
    }
  };

  const startEditingTitle = (id: string, currentTitle: string) => {
    setEditingTitle(id);
    setNewTitle(currentTitle);
  };

  const saveTitle = (id: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === id ? { ...c, title: newTitle.trim() || 'Untitled Conversation' } : c
      )
    );
    setEditingTitle(null);
    setNewTitle('');
  };

  const updateMessages = (newMessages: Message[]) => {
    if (!currentConversationId) return;
    
    setConversations(prev =>
      prev.map(c =>
        c.id === currentConversationId ? { ...c, messages: newMessages } : c
      )
    );
  };

  const tabs = [
    { icon: MessageSquare, label: 'Chat', value: 'chat' },
    { icon: BarChart3, label: 'Dashboard', value: 'dashboard' },
    { icon: FileBarChart, label: 'Reports', value: 'reports' },
    { icon: TrendingUp, label: 'Investment', value: 'investment' },
    { icon: Wallet, label: 'Portfolio', value: 'portfolio' },
    { icon: Receipt, label: 'QuickBooks', value: 'quickbooks' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden flex flex-col`}
      >
        <div className="flex-1 p-4">
          <div className="flex items-center space-x-3 mb-8 px-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              PulseAI <span className="text-red-600">V2</span>
            </span>
          </div>
          <nav className="space-y-2">
            {tabs.map(item => (
              <button
                key={item.value}
                onClick={() => setActiveTab(item.value as TabType)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === item.value 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <Profile />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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
                {activeTab === 'chat' && (currentConversation?.title || 'Chat')}
                {activeTab === 'dashboard' && 'Financial Dashboard'}
                {activeTab === 'reports' && 'Financial Reports'}
                {activeTab === 'investment' && 'Investment Management'}
                {activeTab === 'portfolio' && 'Portfolio Overview'}
                {activeTab === 'quickbooks' && 'QuickBooks Integration'}
              </h2>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Library Panel */}
            <div className={`${
              showLibrary ? 'w-80' : 'w-0'
            } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Conversations</h3>
                  <button
                    onClick={startNewChat}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Start New Chat"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  {conversations.map(conversation => (
                    <div
                      key={conversation.id}
                      className={`group relative p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                        currentConversationId === conversation.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => {
                        setCurrentConversationId(conversation.id);
                        setActiveTab('chat');
                      }}
                    >
                      {editingTitle === conversation.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveTitle(conversation.id);
                              }
                            }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveTitle(conversation.id);
                            }}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-900 line-clamp-1 pr-16">
                            {conversation.title}
                          </p>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingTitle(conversation.id, conversation.title);
                              }}
                              className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conversation.id);
                              }}
                              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {conversation.messages.length - 1} messages
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                  {conversations.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No conversations yet</p>
                      <button
                        onClick={startNewChat}
                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        Start a new chat
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'chat' && currentConversation && (
                <Chat 
                  messages={currentConversation.messages}
                  setMessages={updateMessages}
                  groupedMessages={{}}
                  showLibrary={showLibrary}
                />
              )}
              {activeTab === 'dashboard' && <FinanceDashboard />}
              {activeTab === 'reports' && <Reports />}
              {activeTab === 'investment' && <Investment />}
              {activeTab === 'portfolio' && <Portfolio />}
              {activeTab === 'quickbooks' && <QuickBooks isConnected={quickbooks.isConnected} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;