
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoanOverview } from './borrower/LoanOverview';
import { RecentActivity } from './borrower/RecentActivity';
import { UpcomingTasks } from './borrower/UpcomingTasks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  Bell,
  CreditCard,
  TrendingUp,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Phone
} from 'lucide-react';

const BorrowerDashboard = () => {
  const { user, logout } = useAuth();

  const loanDetails = {
    amount: "$25,000",
    purpose: "Equipment Purchase",
    term: "36 months",
    rate: "4.5%",
    monthlyPayment: "$743",
    balance: "$18,450",
    nextPayment: "February 15, 2024",
    status: "current"
  };

  const recentActivity = [
    { 
      type: "payment", 
      description: "Payment received - $743", 
      date: "January 15, 2024", 
      status: "success" 
    },
    { 
      type: "contact", 
      description: "Check-in call with Mike Rodriguez", 
      date: "January 10, 2024", 
      status: "info" 
    },
    { 
      type: "document", 
      description: "Financial statement uploaded", 
      date: "January 5, 2024", 
      status: "success" 
    },
    { 
      type: "reminder", 
      description: "Upcoming payment reminder sent", 
      date: "January 3, 2024", 
      status: "info" 
    }
  ];

  const upcomingTasks = [
    { task: "Submit Q4 financial statements", due: "February 1, 2024", priority: "high" },
    { task: "Schedule quarterly check-in call", due: "February 5, 2024", priority: "medium" },
    { task: "Update business insurance information", due: "February 15, 2024", priority: "low" }
  ];

  return (
    <DashboardLayout 
      title="My Business Loan" 
      subtitle={user?.organization}
      onLogout={logout}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-gray-600">
            Your loan is performing well. Next payment due on {loanDetails.nextPayment}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Loan Information */}
          <div className="lg:col-span-2 space-y-6">
            <LoanOverview loanDetails={loanDetails} />
            <RecentActivity activities={recentActivity} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <UpcomingTasks tasks={upcomingTasks} />
            
            {/* Quick Actions */}
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common tasks and actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Lender
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Make Payment
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Recent updates and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-gray-500">Your payment of $743 has been processed</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Document reminder</p>
                      <p className="text-xs text-gray-500">Q4 financial statements due soon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BorrowerDashboard;
