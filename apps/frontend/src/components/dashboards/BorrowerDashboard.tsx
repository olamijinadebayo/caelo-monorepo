
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  LogOut,
  Bell,
  CreditCard,
  TrendingUp,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Phone
} from "lucide-react";

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment': return <CreditCard className="w-4 h-4" />;
      case 'contact': return <Phone className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">My Business Loan</h1>
                <p className="text-sm text-gray-600">{user?.organization}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600">Business Owner</p>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
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
            {/* Loan Overview */}
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Loan Overview
                </CardTitle>
                <CardDescription>
                  Equipment Purchase Loan - Approved {loanDetails.term}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{loanDetails.amount}</p>
                    <p className="text-sm text-gray-600">Original Amount</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{loanDetails.balance}</p>
                    <p className="text-sm text-gray-600">Current Balance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{loanDetails.monthlyPayment}</p>
                    <p className="text-sm text-gray-600">Monthly Payment</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Loan Progress</span>
                    <span>26% Paid</span>
                  </div>
                  <Progress value={26} className="h-3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                  <div>
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="ml-2 font-medium">{loanDetails.rate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Term:</span>
                    <span className="ml-2 font-medium">{loanDetails.term}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Payment:</span>
                    <span className="ml-2 font-medium">{loanDetails.nextPayment}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Current
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your loan account activity and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-lg ${
                        activity.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Make Payment
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact My Lender
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{task.task}</p>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">Due: {task.due}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Loan Officer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">MR</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Mike Rodriguez</h3>
                  <p className="text-sm text-gray-600 mb-4">Community Capital Partners</p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Mike
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerDashboard;
