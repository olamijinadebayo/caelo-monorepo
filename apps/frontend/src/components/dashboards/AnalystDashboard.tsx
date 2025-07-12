
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLoanApplications } from '../../hooks/useLoanApplications';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorDisplay } from '../ui/ErrorDisplay';
import { PortfolioMetrics } from './analyst/PortfolioMetrics';
import ApplicationQueue from './analyst/ApplicationQueue';
import ApplicationDetail from './analyst/ApplicationDetail';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LoanApplication } from '../../types/loanApplications';
import { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Clock, 
  Bell,
  Search,
  Filter,
  TrendingUp,
  Heart
} from 'lucide-react';

const AnalystDashboard = () => {
  const { user, logout } = useAuth();
  const {
    applications,
    isLoading,
    error,
    updateApplicationStatus,
  } = useLoanApplications();

  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);

  const portfolioMetrics = [
    { title: "Active Loans", value: "34", change: "+2 this week", icon: DollarSign, color: "text-green-600" },
    { title: "Pending Reviews", value: "8", change: "Needs attention", icon: Clock, color: "text-orange-600" },
    { title: "Total Portfolio", value: "$485K", change: "+12% growth", icon: TrendingUp, color: "text-blue-600" },
    { title: "Borrower Relations", value: "92%", change: "Satisfaction rate", icon: Heart, color: "text-pink-600" }
  ];

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Loan Portfolio" 
        subtitle={user?.organization}
        onLogout={logout}
      >
        <LoadingSpinner size="lg" text="Loading portfolio..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout 
        title="Loan Portfolio" 
        subtitle={user?.organization}
        onLogout={logout}
      >
        <ErrorDisplay 
          error={error} 
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Loan Portfolio" 
      subtitle={user?.organization}
      onLogout={logout}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Good morning, {user?.name?.split(' ')[0]} 🌅
          </h2>
          <p className="text-gray-600">
            You have {applications.filter(app => app.status === 'pending').length} loan applications requiring review.
          </p>
        </div>

        {/* Metrics Grid */}
        <PortfolioMetrics metrics={portfolioMetrics} />

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            {selectedApplication ? (
              <ApplicationDetail
                application={selectedApplication}
                onBack={() => setSelectedApplication(null)}
                onApplicationUpdate={(updatedApplication) => {
                  setSelectedApplication(updatedApplication);
                }}
              />
            ) : (
              <ApplicationQueue
                onApplicationSelect={setSelectedApplication}
              />
            )}
          </TabsContent>

          <TabsContent value="portfolio">
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Portfolio Overview</CardTitle>
                <CardDescription>
                  View your active loan portfolio and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Portfolio Management</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Portfolio management features coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relationships">
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Borrower Relationships</CardTitle>
                <CardDescription>
                  Manage and nurture borrower relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Relationship Management</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Relationship management features coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AnalystDashboard;
