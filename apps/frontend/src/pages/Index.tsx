
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LenderLogin from '../components/auth/LenderLogin';
import SignUpForm from '../components/auth/SignUpForm';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import AnalystDashboard from '../components/dashboards/AnalystDashboard';
import BorrowerDashboard from '../components/dashboards/BorrowerDashboard';

const Index = () => {
  const { user, logout, checkAuth } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // If user is authenticated, show appropriate dashboard
  if (user) {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'analyst':
        return <AnalystDashboard />;
      case 'loan_officer':
        return <AdminDashboard />; // Use admin dashboard for loan officers for now
      case 'borrower':
        return <BorrowerDashboard />;
      default:
        return <div>Invalid user role: {user.role}</div>;
    }
  }

  // If in sign-up mode, show sign-up form
  if (isSignUp) {
    return <SignUpForm onSwitchToLogin={() => setIsSignUp(false)} />;
  }

  // Default: show login form
  return <LenderLogin onSwitchToSignUp={() => setIsSignUp(true)} />;
};

export default Index;
