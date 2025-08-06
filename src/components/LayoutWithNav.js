import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LayoutWithNav({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center relative">
      {/* Main content container (card inside this) */}
      <div className="w-full max-w-md flex-1 flex flex-col">
        {children}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 w-full max-w-md bg-white text-black flex justify-around py-3 text-sm z-50">
        <button
          className="flex flex-col items-center"
          onClick={() => navigate('/tracker')}
        >
          <img
            src="../icons/healthy.png"
            alt="Tracker"
            className={`w-6 h-6 mb-1 ${isActive('/tracker') ? 'brightness-125' : 'opacity-50'}`}
          />
        </button>

        <button
          className="flex flex-col items-center"
          onClick={() => navigate('/quests')}
        >
          <img
            src="../icons/travel.png"
            alt="Quests"
            className={`w-6 h-6 mb-1 ${isActive('/quests') ? 'brightness-125' : 'opacity-50'}`}
          />
        </button>

        <button
          className="flex flex-col items-center"
          onClick={() => alert('🎁 Rewards placeholder')}
        >
          <img
            src="../icons/gift.png"
            alt="Rewards"
            className="w-6 h-6 mb-1 opacity-50"
          />
        </button>

        <button
          className="flex flex-col items-center"
          onClick={() => navigate('/dashboard')}
        >
          <img
            src="../icons/dashboard.png"
            alt="Dashboard"
            className={`w-6 h-6 mb-1 ${isActive('/dashboard') ? 'brightness-125' : 'opacity-50'}`}
          />
        </button>
      </div>
    </div>
  );
}
