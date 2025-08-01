import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, Building2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BorrowerSidebar from "@/components/BorrowerSidebar";


const Dashboard = () => {
  const [showLoanModal, setShowLoanModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BorrowerSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-8 mb-8 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="max-w-lg">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Get the Funds Your Business Needs, Fast and Simple
                </h1>
                <p className="text-gray-600 mb-6">
                  Submit your application and get started in minutes.
                </p>
                <Dialog open={showLoanModal} onOpenChange={setShowLoanModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-caelo-navy hover:bg-caelo-navy-light">
                      Start Application
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Apply for a Loan</DialogTitle>
                      <p className="text-gray-600">Select loan product to apply for</p>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-2">BOM Launchpad</h3>
                          <p className="text-gray-600 mb-4">
                            Need a boost for your business? Apply for the BOM Launchpad loan.
                          </p>
                          <Button asChild className="w-full bg-caelo-navy hover:bg-caelo-navy-light">
                            <Link to="/apply">Apply Now</Link>
                          </Button>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-lg mb-2">Loan Product 2</h3>
                          <p className="text-gray-600 mb-4">
                            Need a boost for your business? Apply for the BOM Launchpad loan.
                          </p>
                          <Button variant="outline" className="w-full" disabled>
                            Coming Soon
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2">Required Documents for application</h4>
                      <p className="text-sm text-gray-600">
                        This flexible engine lets CDFIs adapt to their members' needs without depending on one-size-fits-all automation. Our risk spread uses our version of a credit score and takes into consideration both willingness to pay + ability to pay + real time business performance data. Users will be encouraged to share as much data connection data as possible to aid in improving favorable lending outcomes for them.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="hidden md:block">
                <div className="w-48 h-48 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                  <DollarSign className="w-20 h-20 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Your Loan Applications */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Your Loan Applications</CardTitle>
                  <p className="text-gray-600">Track your most recent loan applications</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-center mb-2">
                      You haven't applied for any loans yet.
                    </p>
                    <p className="text-gray-500 text-center">
                      Click "Start Application" above to begin.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Connections */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Data Connections</CardTitle>
                  <p className="text-gray-600">Connect personal and business bank accounts</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Bank Account */}
                  <div>
                    <h3 className="font-semibold mb-3">Personal Bank Account</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Link your personal bank account and upload personal details to make application seamless
                    </p>
                    <Button variant="outline" className="w-full">
                      Connect Account
                    </Button>
                  </div>

                  {/* Business Bank Account */}
                  <div>
                    <h3 className="font-semibold mb-3">Business Bank Account</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Securely link your business bank account to help make your loan application process seamless
                    </p>
                    <Button variant="outline" className="w-full">
                      Connect Account
                    </Button>
                    <div className="mt-4">
                      <Building2 className="w-12 h-12 text-gray-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;