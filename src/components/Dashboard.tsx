import React, { useState, useEffect } from 'react';
import { MessageSquare, BarChart3, Receipt, Menu, X, BookOpen, BrainCircuit, FileBarChart, TrendingUp, Wallet, PlusCircle, Pencil, Trash2, Check } from 'lucide-react';
import Chat from './tabs/Chat';
import FinanceDashboard from './tabs/FinanceDashboard';
import QuickBooks from './tabs/QuickBooks';
import Reports from './tabs/Reports';
import Investment from './tabs/Investment';
import Portfolio from './tabs/Portfolio';
import { Profile } from './Profile';
import { useAuth } from '../context/AuthContext';
import { conversationService, type Conversation, type Message } from '../services/conversationService';
import { aiService } from '../services/aiService';

type TabType = 'chat' | 'dashboard' | 'quickbooks' | 'reports' | 'investment' | 'portfolio';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [conversationMessages, setConversationMessages] = useState<Record<string, number>>({});

  // Load conversations when component mounts
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  // Load message counts for all conversations
  const loadMessageCounts = async () => {
    const counts: Record<string, number> = {};
    for (const conv of conversations) {
      const messages = await conversationService.getMessages(conv.id);
      counts[conv.id] = messages.length;
    }
    setConversationMessages(counts);
  };

  useEffect(() => {
    loadMessageCounts();
  }, [conversations]);

  const loadConversations = async () => {
    try {
      if (!user) return;
      const conversations = await conversationService.getConversations(user);
      setConversations(conversations);
      setError(null);
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Error loading conversations:', err);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const messages = await conversationService.getMessages(conversationId);
      setMessages(messages);
      setError(null);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    }
  };

  const createNewConversation = async () => {
    try {
      if (!user) return;
      const title = 'New Conversation';
      const conversation = await conversationService.createConversation(user, title);
      if (conversation) {
        setConversations(prev => [conversation, ...prev]);
        setActiveConversation(conversation);
        setActiveTab('chat');
        setMessages([]);
        setError(null);
      }
    } catch (err) {
      setError('Failed to create new conversation');
      console.error('Error creating conversation:', err);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const success = await conversationService.deleteConversation(conversationId);
      if (success) {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        if (activeConversation?.id === conversationId) {
          setActiveConversation(null);
          setMessages([]);
        }
        setError(null);
      }
    } catch (err) {
      setError('Failed to delete conversation');
      console.error('Error deleting conversation:', err);
    }
  };

  const startEditingTitle = (id: string, currentTitle: string) => {
    setEditingTitle(id);
    setNewTitle(currentTitle);
  };

  const saveTitle = async (id: string) => {
    try {
      const success = await conversationService.updateConversationTitle(id, newTitle.trim() || 'Untitled');
      if (success) {
        setConversations(prev =>
          prev.map(c =>
            c.id === id ? { ...c, title: newTitle.trim() || 'Untitled' } : c
          )
        );
        if (activeConversation?.id === id) {
          setActiveConversation(prev => prev ? { ...prev, title: newTitle.trim() || 'Untitled' } : prev);
        }
        setEditingTitle(null);
        setNewTitle('');
        setError(null);
      }
    } catch (err) {
      setError('Failed to update conversation title');
      console.error('Error updating title:', err);
    }
  };

  const sendMessage = async (text: string) => {
    if (!activeConversation || !text.trim()) return;

    try {
      await aiService.processUserMessage(activeConversation.id, text);
      // Refresh messages after sending
      const updatedMessages = await conversationService.getMessages(activeConversation.id);
      setMessages(updatedMessages);
      setError(null);
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
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
                {activeTab === 'chat' && (activeConversation?.title || 'Chat')}
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
                    onClick={createNewConversation}
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
                        activeConversation?.id === conversation.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => {
                        setActiveConversation(conversation);
                        setActiveTab('chat');
                      }}
                    >
                      {editingTitle === conversation.id ? (
                        <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
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
                            onClick={() => saveTitle(conversation.id)}
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
                            {conversationMessages[conversation.id] || 0} messages
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                  {conversations.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500">No conversations yet</p>
                      <button
                        onClick={createNewConversation}
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
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                  {error}
                </div>
              )}
              {activeTab === 'chat' && activeConversation && (
                <Chat 
                  messages={messages}
                  setMessages={setMessages}
                  groupedMessages={{}}
                  showLibrary={showLibrary}
                  sendMessage={sendMessage}
                />
              )}
              {activeTab === 'dashboard' && <FinanceDashboard />}
              {activeTab === 'reports' && <Reports />}
              {activeTab === 'investment' && <Investment />}
              {activeTab === 'portfolio' && <Portfolio />}
              {activeTab === 'quickbooks' && <QuickBooks isConnected={false} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;