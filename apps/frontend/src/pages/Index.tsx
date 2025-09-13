
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/ui/login-form';
import { SignUpForm } from '../components/ui/sign-up-form';
import LenderLogin from '../components/auth/LenderLogin';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import AnalystDashboard from '../components/dashboards/AnalystDashboard';
import BorrowerDashboard from '../components/dashboards/BorrowerDashboard';
import { Button } from '../components/ui/button';
import { Building2, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Logo } from '../components/ui/logo';
import { getBranding } from '../utils/branding';

const Index = () => {
  const { user, logout, checkAuth } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const branding = getBranding();

  const toggleMode = () => setIsSignUp((prev) => !prev);

  // If user is authenticated, show appropriate dashboard (blank for Sprint 1)
  if (user) {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'analyst':
        return <AnalystDashboard />;
      case 'borrower':
        return <BorrowerDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  }

  // If in sign-in mode, show full-screen Figma login
  if (!isSignUp) {
    return <LenderLogin />;
  }

  // Landing page for sign-up mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Replace logo image with text */}
            <span className="inline-block h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg text-primary">
              {branding.name[0]}
            </span>
            <span className="text-2xl font-bold text-foreground">{branding.name}</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="outline" onClick={() => setIsSignUp(false)}>
              Sign In
            </Button>
            <Button variant="default">
              Sign Up
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between">
        {/* Left Column - Info */}
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Welcome to {branding.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {branding.name === "CDFI Lender"
              ? "A custom experience for CDFI partners."
              : "Empowering community lenders with relationship-first technology."}
          </p>
        </div>
        {/* Right Column - Sign Up Form */}
        <div className="flex justify-center lg:justify-end w-full lg:w-1/2">
          <SignUpForm onToggleMode={toggleMode} />
        </div>
      </main>
      {/* Footer */}
      <footer className="mt-20 border-t bg-background/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              {/* Replace logo image with text */}
              <span className="inline-block h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-primary">
                {branding.name[0]}
              </span>
              <span className="font-semibold text-foreground">{branding.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Caelo. Empowering community lenders with relationship-first technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
