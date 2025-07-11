
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  Bell,
  Settings,
  BarChart3,
  MapPin,
  Clock,
  CheckCircle
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const metrics = [
    { title: "Active CDFIs", value: "12", change: "+3 this month", icon: Building2, color: "text-blue-600" },
    { title: "Total Loan Volume", value: "$2.4M", change: "+18% vs last month", icon: DollarSign, color: "text-green-600" },
    { title: "Active Borrowers", value: "156", change: "+24 this week", icon: Users, color: "text-purple-600" },
    { title: "Platform Adoption", value: "89%", change: "Feature usage rate", icon: TrendingUp, color: "text-orange-600" }
  ];

  const recentActivity = [
    { action: "New CDFI onboarded", org: "Valley Community Capital", time: "2 hours ago", status: "success" },
    { action: "Loan application submitted", org: "Sunrise Bakery", time: "4 hours ago", status: "pending" },
    { action: "Portfolio review completed", org: "Urban Development Fund", time: "1 day ago", status: "success" },
    { action: "System maintenance scheduled", org: "Platform Update", time: "2 days ago", status: "info" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Caelo Admin</h1>
                <p className="text-sm text-gray-600">Community Lending Platform</p>
              </div>
              {/* Admin-only: Logo upload placeholder */}
              <Button variant="outline" size="sm" className="ml-4" disabled>
                Upload Logo (Coming Soon)
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-600">{user?.organization}</p>
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
            Here's what's happening across your community lending network today.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest updates from your CDFI network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 
                        activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.org}</p>
                      </div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Health */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>System Uptime</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Active Sessions</span>
                    <span className="font-medium">84%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Data Sync</span>
                    <span className="font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  CDFI Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">California</span>
                    <Badge variant="secondary">4 CDFIs</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Texas</span>
                    <Badge variant="secondary">3 CDFIs</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New York</span>
                    <Badge variant="secondary">2 CDFIs</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Others</span>
                    <Badge variant="secondary">3 CDFIs</Badge>
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

export default AdminDashboard;
