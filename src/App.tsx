import React, { useState } from 'react';
import { Bot, MessageSquare, Home, BarChart3, Settings, LogOut } from 'lucide-react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <Landing onLogin={handleLogin} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;