
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  DollarSign, 
  Clock, 
  LogOut,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Heart
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

const AnalystDashboard = () => {
  const { user, logout } = useAuth();

  const portfolioMetrics = [
    { title: "Active Loans", value: "34", change: "+2 this week", icon: DollarSign, color: "text-green-600" },
    { title: "Pending Reviews", value: "8", change: "Needs attention", icon: Clock, color: "text-orange-600" },
    { title: "Total Portfolio", value: "$485K", change: "+12% growth", icon: TrendingUp, color: "text-blue-600" },
    { title: "Borrower Relations", value: "92%", change: "Satisfaction rate", icon: Heart, color: "text-pink-600" }
  ];

  const loanApplications = [
    { 
      id: "LA-2024-001", 
      borrower: "Maria's Restaurant", 
      amount: "$25,000", 
      purpose: "Equipment Purchase",
      status: "under_review", 
      stage: "Credit Analysis",
      submittedDate: "2024-01-08",
      contact: "maria@mariasrestaurant.com",
      phone: "(555) 123-4567",
      relationship_score: 85
    },
    { 
      id: "LA-2024-002", 
      borrower: "Green Tech Solutions", 
      amount: "$50,000", 
      purpose: "Working Capital",
      status: "pending_docs", 
      stage: "Documentation",
      submittedDate: "2024-01-05",
      contact: "alex@greentech.com",
      phone: "(555) 234-5678",
      relationship_score: 72
    },
    { 
      id: "LA-2024-003", 
      borrower: "Community Daycare", 
      amount: "$15,000", 
      purpose: "Facility Expansion",
      status: "approved", 
      stage: "Disbursement",
      submittedDate: "2024-01-03",
      contact: "info@communitydaycare.org",
      phone: "(555) 345-6789",
      relationship_score: 94
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'pending_docs': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-4 h-4" />;
      case 'under_review': return <Clock className="w-4 h-4" />;
      case 'pending_docs': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Loan Portfolio</h1>
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
                  <p className="text-xs text-gray-600">Loan Analyst</p>
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
            Good morning, {user?.name?.split(' ')[0]} 🌅
          </h2>
          <p className="text-gray-600">
            You have 3 loan applications requiring review and 2 borrower check-ins scheduled today.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {portfolioMetrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-gray-50 ${metric.color}`}>
                    <metric.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Loan Applications</CardTitle>
                    <CardDescription>
                      Manage and review pending loan applications
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loanApplications.map((loan) => (
                    <div key={loan.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{loan.borrower}</h3>
                            <Badge className={getStatusColor(loan.status)}>
                              {getStatusIcon(loan.status)}
                              <span className="ml-1 capitalize">{loan.status.replace('_', ' ')}</span>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <p className="font-medium text-gray-900">{loan.amount}</p>
                              <p>{loan.purpose}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Stage: {loan.stage}</p>
                              <p>Applied: {loan.submittedDate}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Relationship Score</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Progress value={loan.relationship_score} className="h-2 w-16" />
                                <span className="text-xs">{loan.relationship_score}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-3">
                            <Button variant="ghost" size="sm">
                              <Mail className="w-4 h-4 mr-2" />
                              {loan.contact}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Phone className="w-4 h-4 mr-2" />
                              {loan.phone}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule Call
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                            Review
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Active Portfolio</CardTitle>
                <CardDescription>
                  Monitor and manage your active loan portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Management</h3>
                  <p className="text-gray-600">Detailed portfolio view coming in Sprint 2</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relationships">
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Borrower Relationships</CardTitle>
                <CardDescription>
                  Track and nurture your borrower relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Relationship Management</h3>
                  <p className="text-gray-600">Advanced relationship tracking coming in Sprint 2</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalystDashboard;
