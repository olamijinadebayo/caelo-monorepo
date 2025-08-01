import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Info, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import CaeloLogo from "@/components/CaeloLogo";
import BorrowerFileUpload from "@/components/BorrowerFileUpload";

const LoanApplication = () => {
  const [loanAmount, setLoanAmount] = useState([10000]);
  const [loanTerm, setLoanTerm] = useState([6]);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState({
    taxReturns: { name: "Tax Returns.pdf", size: "200 KB", progress: 100 },
    businessBankLoans: null,
    recentBankLoans: null,
    supportingDoc: null
  });

  const calculateMonthlyPayment = () => {
    return Math.round(loanAmount[0] / loanTerm[0]);
  };

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <CaeloLogo />
          <Button variant="outline">Save Progress</Button>
        </div>

        <div className="max-w-2xl mx-auto py-12 px-6">
          <h1 className="text-3xl font-bold text-center mb-2">Data Collection</h1>
          
          <div className="space-y-8">
            <BorrowerFileUpload 
              label="Upload 3 months of your business recent bank loans"
              uploadedFile={uploadedFiles.businessBankLoans}
              onFileSelect={(file) => {
                setUploadedFiles(prev => ({
                  ...prev,
                  businessBankLoans: { name: file.name, size: `${Math.round(file.size / 1024)} KB`, progress: 100 }
                }));
              }}
            />

            <BorrowerFileUpload 
              label="Upload 3 months of your recent bank loans"
              uploadedFile={uploadedFiles.recentBankLoans}
              onFileSelect={(file) => {
                setUploadedFiles(prev => ({
                  ...prev,
                  recentBankLoans: { name: file.name, size: `${Math.round(file.size / 1024)} KB`, progress: 100 }
                }));
              }}
            />

            <BorrowerFileUpload 
              label="Upload most recent tax returns"
              optional={true}
              uploadedFile={uploadedFiles.taxReturns}
              onFileSelect={(file) => {
                setUploadedFiles(prev => ({
                  ...prev,
                  taxReturns: { name: file.name, size: `${Math.round(file.size / 1024)} KB`, progress: 100 }
                }));
              }}
            />
          </div>

          <div className="flex gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button 
              className="flex-1 bg-caelo-navy hover:bg-caelo-navy-light"
              onClick={() => setCurrentStep(3)}
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <CaeloLogo />
          <Button variant="outline">Save Progress</Button>
        </div>

        <div className="max-w-2xl mx-auto py-12 px-6">
          <Card>
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-2">Preview</h1>
              <p className="text-gray-600 mb-6">
                Here's a summary of your application. Double-check your info and make any changes before you submit.
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Enter Loan Amount</Label>
                  <div className="mt-2">
                    <Input value={`$${loanAmount[0].toLocaleString()}`} readOnly />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Select Loan Term</Label>
                  <div className="mt-2">
                    <Select value={`${loanTerm[0]} Months`} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Term Period</span>
                    <span className="font-medium">{loanTerm[0]} Months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payments</span>
                    <span className="font-medium">${calculateMonthlyPayment()}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Select Reason for Loan</Label>
                  <div className="mt-2">
                    <Select value={reason} disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Provide a brief description of the reason</Label>
                  <div className="mt-2">
                    <Textarea value={description} readOnly className="min-h-[120px]" />
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Upload most recent tax returns (optional)</Label>
                  <Card className="mt-3 p-8 border-2 border-dashed border-gray-300 text-center">
                    <CardContent className="space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PDF, PNG or JPG (max. 10mb)</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Button className="w-full mt-8 bg-caelo-navy hover:bg-caelo-navy-light" asChild>
                <Link to="/dashboard">Submit</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <CaeloLogo />
        <Button variant="outline">Save Progress</Button>
      </div>

      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Bom Launchpad</h1>
          <p className="text-gray-600">Apply for funding with Bom Launchpad</p>
        </div>

        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              This flexible engine lets CDFIs adapt to their members' needs without depending on one-size-fits-all automation. Our risk spread uses our version of a credit score and takes into consideration both willingness to pay + ability to pay + real time business performance data.
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div>
            <Label className="text-base font-medium mb-4 block">Enter Loan Amount</Label>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input 
                  value={loanAmount[0].toLocaleString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value.replace(/,/g, ''));
                    if (!isNaN(value)) {
                      setLoanAmount([value]);
                    }
                  }}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-4 block">Select Loan Term</Label>
            <div className="space-y-4">
              <Slider
                value={loanTerm}
                onValueChange={setLoanTerm}
                max={24}
                min={3}
                step={1}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-lg font-medium">{loanTerm[0]} Months</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Term Period</span>
              <span className="font-medium">{loanTerm[0]} Months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Payments</span>
              <span className="font-medium">${calculateMonthlyPayment()}</span>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-4 block">Select Reason for Loan</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="expansion">Business Expansion</SelectItem>
                <SelectItem value="working-capital">Working Capital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium mb-4 block">Provide a brief description of the reason</Label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="1-5"
              className="min-h-[120px]"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Button variant="outline" asChild>
            <Link to="/dashboard">Back</Link>
          </Button>
          <Button 
            className="flex-1 bg-caelo-navy hover:bg-caelo-navy-light"
            onClick={() => setCurrentStep(2)}
          >
            Begin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;