import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    async function run() {
      try {
        const res = await fetch(`${API_BASE}/auth/verify-email?token=${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Verification failed');
        setMessage(data?.message || 'Email verified successfully.');
      } catch (e) {
        setMessage(e.message);
      }
    }
    if (token) run();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Email Verification</h1>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}


