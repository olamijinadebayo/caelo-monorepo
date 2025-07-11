
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/ui/login-form';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import AnalystDashboard from '../components/dashboards/AnalystDashboard';
import BorrowerDashboard from '../components/dashboards/BorrowerDashboard';
import { Button } from '../components/ui/button';
import { Building2, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Logo } from '../components/ui/logo';

const Index = () => {
  const { user, logout, checkAuth } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuth();
  }, [checkAuth]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  // If user is authenticated, show appropriate dashboard
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

  // Landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo />
            <span className="text-2xl font-bold text-foreground">Caelo</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <Button variant="outline" onClick={() => setIsSignUp(false)}>
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Loan Operating System for{' '}
                <span className="text-primary">Community Lenders</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Empowering CDFIs and community lenders with technology that enhances 
                relationships while streamlining operations.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid sm:grid-cols-2 gap-6" id="features">
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Relationship-First</h3>
                  <p className="text-sm text-muted-foreground">
                    Technology that enhances human connections
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Operational Efficiency</h3>
                  <p className="text-sm text-muted-foreground">
                    Streamline processes without losing personal touch
                  </p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-4" id="about">
              <h2 className="text-2xl font-semibold text-foreground">
                Built for Community Development
              </h2>
              <p className="text-muted-foreground">
                Caelo understands the unique needs of CDFI loan funds and community lenders. 
                Our platform combines operational efficiency with the human-centered approach 
                that drives successful community lending.
              </p>
              <div className="flex items-center space-x-2 text-primary">
                <span className="font-medium">Learn more about our mission</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <LoginForm onToggleMode={toggleMode} isSignUp={isSignUp} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t bg-background/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Logo className="h-5 w-5" />
              <span className="font-semibold text-foreground">Caelo</span>
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
