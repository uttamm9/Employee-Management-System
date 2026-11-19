import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Building2 } from 'lucide-react';

const AuthLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If already authenticated, redirect to appropriate portal
  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/profile'} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-indigo-50/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md mb-3">
          <Building2 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Employee Management System
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enterprise workforce administration & portal
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 rounded-2xl sm:px-10 border border-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
