import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LenderLogin from './LenderLogin';
import LenderDashboard from '../dashboards/LenderDashboard';
import LoanBuilderFlow from '../loan-builder/LoanBuilderFlow';

const LenderRouter = () => {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <LenderLogin />;
  }

  // If authenticated but not a lender role, redirect appropriately
  if (user?.role !== 'analyst' && user?.role !== 'admin') {
    return <Navigate to="/borrower-dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<LenderDashboard />} />
      <Route path="/loan-builder" element={<LoanBuilderFlow />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default LenderRouter;
