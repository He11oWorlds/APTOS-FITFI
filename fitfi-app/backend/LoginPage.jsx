import { useState } from 'react';

export default function LoginPage() {
  const [status, setStatus] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const message = "Login to FitFi";

    if (!window.aptos) {
      setStatus("Petra wallet not found.");
      return;
    }

    try {
      const result = await window.aptos.signMessage({
        message,
        nonce: "fitfi-login-001",
      });

      const res = await fetch('http://localhost:3000/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: result.publicKey,
          signedMessage: result.signature,
          originalMessage: message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setStatus("✅ Logged in!");
      } else {
        setStatus(`❌ Login failed: ${data.message}`);
      }
    } catch (error) {
      setStatus("❌ Error signing in.");
      console.error(error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', textAlign: 'center', marginTop: '100px' }}>
      <h1>FitFi Login</h1>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Login with Petra
      </button>
      <p>{status}</p>
      {user && (
        <div style={{ marginTop: '20px' }}>
          <strong>Welcome:</strong> {user.username}<br />
          <strong>Wallet:</strong> {user.wallet_address}
        </div>
      )}
    </div>
  );
}
