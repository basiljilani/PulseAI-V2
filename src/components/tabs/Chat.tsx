import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, AlertCircle, Bot } from 'lucide-react';
import { generateAIResponse } from '../../services/deepseek';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  error?: boolean;
}

interface ChatProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  groupedMessages: Record<string, Message[]>;
  showLibrary: boolean;
}

const Chat: React.FC<ChatProps> = ({ messages = [], setMessages }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    setError(null);
    const newMessages = [...messages];
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    newMessages.push(userMessage);
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await generateAIResponse(userMessage.text);
      
      const botMessage: Message = {
        id: `ai-${Date.now()}`,
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      const botErrorMessage: Message = {
        id: `error-${Date.now()}`,
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date(),
        error: true
      };
      
      setMessages([...newMessages, botErrorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('Files selected:', Array.from(files).map(f => f.name));
    }
  };

  const formatMessageText = (text: string) => {
    // Split text into lines while preserving empty lines
    const lines = text.split('\n');
    let formattedLines: JSX.Element[] = [];
    let currentBlock: string[] = [];
    let key = 0;

    const renderBlock = (block: string[], type: 'text' | 'code' = 'text') => {
      if (block.length === 0) return null;
      
      const content = block.join('\n');
      key++;

      if (type === 'code') {
        return (
          <pre key={key} className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-gray-800">{content}</code>
          </pre>
        );
      }

      // Process markdown-style formatting
      const formattedContent = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');

      return (
        <p
          key={key}
          className="mb-4 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      );
    };

    let inCodeBlock = false;

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          formattedLines.push(renderBlock(currentBlock, 'code')!);
          currentBlock = [];
          inCodeBlock = false;
        } else {
          // Start code block
          if (currentBlock.length > 0) {
            formattedLines.push(renderBlock(currentBlock)!);
            currentBlock = [];
          }
          inCodeBlock = true;
        }
      } else {
        currentBlock.push(line);
        
        // If it's the last line or next line is empty, render the block
        if (index === lines.length - 1 || (lines[index + 1] === '' && !inCodeBlock)) {
          formattedLines.push(renderBlock(currentBlock, inCodeBlock ? 'code' : 'text')!);
          currentBlock = [];
        }
      }
    });

    return formattedLines;
  };

  const renderMessage = (message: Message) => (
    <div 
      key={message.id} 
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex items-start space-x-3 max-w-[85%]`}>
        {message.sender === 'ai' && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mt-2">
            <Bot className="w-5 h-5 text-indigo-600" />
          </div>
        )}
        <div className="flex flex-col">
          <div className={`px-6 py-4 rounded-2xl ${
            message.sender === 'user' 
              ? 'bg-indigo-600 text-white' 
              : message.error 
                ? 'bg-red-50 border border-red-200'
                : 'bg-white border border-gray-200'
          }`}>
            {message.error && (
              <div className="flex items-center space-x-2 mb-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
            )}
            <div className={`prose ${message.sender === 'user' ? 'prose-invert' : ''} max-w-none`}>
              {formatMessageText(message.text)}
            </div>
          </div>
          <span className={`text-xs mt-1 ${
            message.sender === 'user' ? 'text-right text-gray-500' : 'text-gray-400'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {message.sender === 'user' && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mt-2 ml-3">
            <span className="text-sm font-medium text-white">You</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 relative">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-auto" ref={chatContainerRef}>
        <div className="max-w-4xl mx-auto pt-8 pb-36 px-4">
          {(!messages || messages.length === 0) ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to PulseAI</h2>
              <p className="text-gray-600 mb-8 max-w-md">
                I'm your personal financial advisor. Ask me anything about your finances or try one of these suggestions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {[
                  "How can I improve my investment strategy?",
                  "What's my current spending pattern?",
                  "Help me create a budget plan",
                  "Analyze my portfolio performance"
                ].map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    onClick={() => setInputText(suggestion)}
                    className="w-full p-4 text-left bg-white rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 hover:border-indigo-200 hover:shadow-sm"
                  >
                    <p className="text-gray-800">{suggestion}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 px-4">
              {Array.isArray(messages) && messages.map(renderMessage)}
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="px-4 py-3 bg-white border border-gray-200 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-8">
          <form onSubmit={handleSendMessage} className="relative">
            <div className="flex items-end space-x-2">
              <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your finances... (Ctrl + / to focus)"
                  className="w-full px-4 py-3 text-[15px] text-gray-800 placeholder-gray-400 bg-transparent border-none rounded-2xl resize-none focus:ring-0"
                  style={{ minHeight: '44px', maxHeight: '200px' }}
                />
              </div>
              <button
                type="button"
                onClick={handleFileClick}
                className="flex-shrink-0 p-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="flex-shrink-0 p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 flex justify-center">
              <p className="text-xs text-gray-500">
                Press Enter to send, Shift + Enter for new line
              </p>
            </div>
          </form>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;