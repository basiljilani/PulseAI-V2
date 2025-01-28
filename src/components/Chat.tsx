import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, getTokenBalance } from '../services/deepseek';
import { Send, Loader2, AlertCircle, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import './Chat.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [tokenUsage, setTokenUsage] = useState({ prompt: 0, completion: 0, total: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchTokenBalance();
  }, []);

  const fetchTokenBalance = async () => {
    try {
      const response = await getTokenBalance();
      if (response.success && response.available_tokens !== undefined) {
        setTokenBalance(response.available_tokens);
      }
    } catch (error) {
      console.error('Failed to fetch token balance:', error);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        handleSendMessage(lastMessage.content);
      }
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    try {
      setError(null);
      setIsLoading(true);
      setMessages(prev => [...prev, { role: 'user', content: messageContent }]);
      setInput('');

      const response = await sendChatMessage(messageContent);

      if (response.success && response.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.message as string }]);
        if (response.usage) {
          const { prompt_tokens = 0, completion_tokens = 0, total_tokens = 0 } = response.usage;
          setTokenUsage(prev => ({
            prompt: prev.prompt + prompt_tokens,
            completion: prev.completion + completion_tokens,
            total: prev.total + total_tokens
          }));
          fetchTokenBalance();
        }
      } else {
        throw new Error(response.error?.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container flex flex-col h-screen">
      {/* Financial Dashboard */}
      <div className="dashboard-container">
        <div className="metric-card">
          <div className="metric-title">Total Revenue</div>
          <div className="metric-value">$24,000</div>
          <div className="metric-change positive">
            <TrendingUp className="w-4 h-4 mr-1" />
            12% vs last month
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Total Expenses</div>
          <div className="metric-value">$12,000</div>
          <div className="metric-change negative">
            <TrendingDown className="w-4 h-4 mr-1" />
            8% vs last month
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Net Profit</div>
          <div className="metric-value">$12,000</div>
          <div className="metric-change positive">
            <TrendingUp className="w-4 h-4 mr-1" />
            10% vs last month
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">Revenue Overview</div>
        </div>
        <div className="h-64 w-full">
          {/* Chart will be added here */}
        </div>
      </div>

      {/* Transactions */}
      <div className="transactions-container">
        <div className="transaction-section">
          <div className="transaction-header">
            <div className="transaction-title">Recent Transactions</div>
            <a href="#" className="view-all">View all</a>
          </div>
          {/* Transaction list will be added here */}
        </div>
        <div className="transaction-section">
          <div className="transaction-header">
            <div className="transaction-title">Upcoming Bills</div>
            <a href="#" className="view-all">View all</a>
          </div>
          {/* Bills list will be added here */}
        </div>
      </div>

      {/* Token Display */}
      <div className="token-display sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">Used:</span> {tokenUsage.total.toLocaleString()} tokens
          </div>
          {tokenBalance !== null && (
            <div>
              <span className="font-medium">Balance:</span> {tokenBalance.toLocaleString()} tokens
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`message-bubble ${
                message.role === 'user'
                  ? 'user-message'
                  : 'assistant-message'
              }`}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: message.content }}
                className="message-content"
              />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-container">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span className="flex-1">{error}</span>
            <button
              onClick={handleRetry}
              className="flex items-center space-x-1 hover:text-red-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Input Container */}
      <div className="input-container">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
              placeholder="Type your message..."
              className="chat-input flex-1"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="send-button"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
