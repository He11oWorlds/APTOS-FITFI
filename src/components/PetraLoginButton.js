import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PetraLoginButton() {
  const [status, setStatus] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate('/dashboard');
    }
  }, [loggedIn, navigate]); // ✅ proper deps

  const handleLogin = async () => {
    if (!window.aptos) return alert('Petra wallet not found');

    try {
      setStatus('[1] Connecting to Petra...');

      const message = 'Login to FitFi';
      const wallet = await window.aptos.connect();
      const walletAddress = wallet.address;

      setStatus('[3] Requesting signature...');
      const response = await window.aptos.signMessage({
        message,
        nonce: 'fitfi-login',
      });

      const signedMessage = response.signature;

      setStatus('[5] Sending to backend...');
      const res = await fetch('http://localhost:3000/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          signedMessage,
          originalMessage: message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ Welcome ${data.username || 'anon'}`);
        localStorage.setItem('fitfi_user', JSON.stringify({ ...data, walletAddress }));
        setLoggedIn(true); // ✅ trigger redirect via useEffect
      } else {
        setStatus(`❌ ${data.message || 'Login failed'}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Wallet rejected or error occurred');
    }
  };

  return (
    <div>
      <button
        onClick={handleLogin}
        className="w-full bg-white border border-gray-300 rounded-md py-2 text-center font-medium hover:shadow"
      >
        Login with Petra
      </button>
      {status && (
        <p className="text-sm text-center mt-3 text-red-600 dark:text-red-400">{status}</p>
      )}
    </div>
  );
}
