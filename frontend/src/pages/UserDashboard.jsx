import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">User Dashboard</h1>
          <button onClick={logout} className="text-sm bg-gray-800 text-white px-3 py-1 rounded">Logout</button>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-700">Welcome, {user?.name}</p>
          <p className="text-gray-700">Email: {user?.email}</p>
          <p className="text-gray-700">Role: {user?.role}</p>
        </div>
      </div>
    </div>
  );
}


