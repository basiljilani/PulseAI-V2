import React from 'react';
import { ArrowRight } from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  return (
    <div className="h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-white">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            <span className="block">Transform Your</span>
            <span className="block text-indigo-600">Business</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Experience intelligent financial consulting powered by advanced AI.
          </p>
          <button
            onClick={onLogin}
            className="mt-8 group inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2">
        <img
          src="https://images.unsplash.com/photo-1635002962487-2c1d4d2f63c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80"
          alt="AI Financial Analytics"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Landing;