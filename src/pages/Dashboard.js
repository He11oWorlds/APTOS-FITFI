import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardWrapper from '../components/CardWrapper';

export default function Dashboard() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('fitfi_user');
    if (stored) {
      const data = JSON.parse(stored);
      setWalletAddress(data.walletAddress || '');
      setUserId(data.user_id || '');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fitfi_user');
    navigate('/');
  };

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-12 pb-32">
      <CardWrapper>
        {/* All inner content below stays the same */}
        <div className="mb-6 flex justify-center">
          <div className="w-36 h-36 rounded-full bg-gray-100 flex items-center justify-center text-7xl text-gray-700">
            😄
          </div>
        </div>

        <div className="w-full mb-4">
          <div className="bg-green-500 text-white text-base font-semibold text-center py-3 rounded-lg">
            Wallet Connected: {shortAddress}
          </div>
        </div>

        <div className="w-full space-y-3 mb-6">
          <button
            className="w-full bg-green-300 text-white font-semibold py-3 rounded-lg flex items-center justify-between px-5 text-lg"
            onClick={() => alert('🔨 Achievement screen coming soon')}
          >
            <span>Achievement</span>
            <span>›</span>
          </button>
          <button
            className="w-full bg-green-300 text-white font-semibold py-3 rounded-lg flex items-center justify-between px-5 text-lg"
            onClick={() => alert('📊 Session History coming soon')}
          >
            <span>Session History</span>
            <span>›</span>
          </button>
        </div>

        <div className="w-full bg-gray-100 rounded-lg p-5 text-base mb-6">
          <div className="flex justify-between mb-3">
            <span className="font-medium">UID:</span>
            <span>{userId || '—'}</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 py-3">
            <span>Terms of Use</span>
            <span>›</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 py-3">
            <span>Privacy Policy</span>
            <span>›</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-3">
            <span>Version</span>
            <span>0.0.01</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition text-lg"
        >
          DISCONNECT WALLET / LOG OUT
        </button>
      </CardWrapper>
    </div>
  );
}
