import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, Home, ChevronRight, MessageCircle, Lightbulb, FileText } from 'lucide-react';
import { Logo } from '../ui/logo';
import type { 
  LoanApplication, 
  ApplicationId,
  AnalysisTab,
  FinancialStabilityAnalysis,
  BusinessAnalysis,
  PersonalAnalysis,
  TaxReturnAnalysis 
} from '../../types/loanApplications';

interface EnhancedApplicationDetailProps {
  applicationId: ApplicationId;
  onBack: () => void;
}

// Mock data matching the Figma design
const getMockApplicationData = (id: ApplicationId): LoanApplication => ({
  id,
  borrowerId: id,
  borrowerName: 'Jessica Smith',
  businessName: 'Sunrise Bakery',
  businessType: 'Food Services',
  loanAmount: 20000,
  loanPurpose: 'Equipment Purchase',
  applicationDate: '2024-12-09',
  status: 'under_review',
  priority: 'medium',
  riskScore: 75,
  recommendation: null,
  analystNotes: '',
  loanOfficer: 'Caleb Mark',
  underwriter: 'Emmanuella Areal',
  recommendation_summary: 'Recommend Reject',
  businessMetrics: {
    revenue: 600000,
    profitMargin: 0.14,
    cashFlow: 42000,
    debtToEquity: 0.28,
    creditScore: 720,
    businessAge: 8,
    employeeCount: 12,
    industryRisk: 'medium'
  },
  documents: [],
  createdAt: '2024-12-09T10:00:00Z',
  updatedAt: '2024-12-09T10:00:00Z'
});

const EnhancedApplicationDetail: React.FC<EnhancedApplicationDetailProps> = ({ 
  applicationId, 
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('financial_stability');
  const [sideNavOpen, setSideNavOpen] = useState(false);
  
  const application = getMockApplicationData(applicationId);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo />
              <nav className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md bg-gray-100"
                >
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  Borrowers
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  Portfolio
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <div className="w-5 h-5 text-gray-500">⚙️</div>
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <div className="w-5 h-5 text-gray-500">🔔</div>
              </Button>
              <div className="w-10 h-10 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs & Actions */}
      <div className="px-12 py-5 flex items-center justify-between">
        <nav className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 flex items-center">
            <Home className="w-4 h-4" />
          </Button>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">Loan Application</span>
        </nav>
        
        <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
          <MessageCircle className="w-5 h-5 mr-2" />
          Message User
        </Button>
      </div>

      <div className="px-12 pb-8">
        {/* Application Header Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-medium text-slate-950">
                    Application #LA-2024-0892
                  </h1>
                  <div className="w-8 h-full flex items-center">
                    <div className="w-px h-8 bg-gray-300 rotate-90" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Recommendation:</div>
                    <div className="text-sm font-medium text-green-600">
                      {application.recommendation_summary}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button className="bg-blue-900 text-white hover:bg-blue-800">
                  Approve
                </Button>
                <Button className="bg-red-100 text-red-600 hover:bg-red-200">
                  Reject
                </Button>
              </div>
            </div>

            <hr className="border-gray-200 mb-6" />

            {/* Application Details Grid */}
            <div className="grid grid-cols-3 gap-8 mb-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-3">Borrower ID:</div>
                <div className="text-sm text-gray-900">{application.borrowerId}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-3">Application Date:</div>
                <div className="text-sm text-gray-900">{formatDate(application.applicationDate)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-3">Loan Type:</div>
                <div className="text-sm text-gray-900">Loan Product 1</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-3">Loan Officer:</div>
                <div className="text-sm text-gray-900">{application.loanOfficer}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-3">Amount Requested:</div>
                <div className="text-sm text-gray-900">{formatCurrency(application.loanAmount)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-3">Underwriter:</div>
                <div className="text-sm text-gray-900">{application.underwriter}</div>
              </div>
            </div>

            <hr className="border-gray-200 mb-6" />

            <div className="flex items-center space-x-3 mb-6">
              <span className="text-sm font-medium text-gray-500">Recommendation:</span>
              <span className="text-sm font-medium text-green-600">{application.recommendation_summary}</span>
            </div>

            {/* Caelo Intelligence Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-6 h-6 text-gray-600 mt-0.5" />
                <div>
                  <h3 className="text-base font-medium text-slate-950 mb-2">
                    Caelo Intelligence Summary
                  </h3>
                  <p className="text-sm text-black leading-relaxed">
                    The business shows a healthy balance of inflows and outflows. Revenues are growing at 20% YoY with profits growing at a similar rate. However, the owner shows signs of financial distress with 2 NSFs in the past 6 months. Furthermore, several uncategorized transactions were found in amounts above $1000. Please consult the Transactions table under Cash Flow Analytics for more information.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AnalysisTab)}>
          <div className="flex items-center space-x-1 mb-4">
            <TabsList className="bg-white border-none p-0 space-x-1">
              <TabsTrigger 
                value="financials" 
                className="bg-white text-gray-700 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 px-3 py-2 rounded-md"
              >
                Financials & Supporting Documents
              </TabsTrigger>
              <TabsTrigger 
                value="cash_flow"
                className="bg-white text-gray-700 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 px-3 py-2 rounded-md"
              >
                Cash Flow Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="financial_stability"
                className="bg-gray-200 text-gray-900 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 px-3 py-2 rounded-md"
              >
                Business & Personal Financial Stability
              </TabsTrigger>
              <TabsTrigger 
                value="relationship"
                className="bg-white text-gray-700 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 px-3 py-2 rounded-md"
              >
                Relationship & Impact
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="financial_stability">
            <FinancialStabilityContent />
          </TabsContent>

          <TabsContent value="financials">
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Financials & Supporting Documents</h3>
              <p className="text-gray-600">Content coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="cash_flow">
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cash Flow Analytics</h3>
              <p className="text-gray-600">Content coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="relationship">
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Relationship & Impact</h3>
              <p className="text-gray-600">Content coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Financial Stability Content Component
const FinancialStabilityContent: React.FC = () => {
  return (
    <Card className="border border-slate-200">
      <CardContent className="p-7">
        <h2 className="text-2xl font-medium text-slate-950 mb-6">
          Business & Personal Financial Stability
        </h2>

        <div className="space-y-6 max-w-4xl">
          {/* Loan Purpose & Impact Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-6 h-6" />
                <h3 className="text-xl font-medium text-gray-900">
                  Loan Purpose & Impact Summary
                </h3>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-3">
                    Personal-business fund mingling
                  </div>
                  <div className="text-base text-yellow-600">
                    Occasional personal expenses detected in business account ($124.56 at Walmart).
                  </div>
                </div>
                
                <hr className="border-gray-200" />
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-3">
                    Frequency and volume of mingling
                  </div>
                  <div className="text-base text-green-600">
                    Low volume and infrequent, within expected seasonal patterns.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Point-of-Sale Data Analysis */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex-1">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-6 h-6" />
                <h3 className="text-xl font-medium text-gray-900">
                  Point-of-Sale (POS) Data Analysis
                </h3>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-8 h-full">
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-3">
                    Customer portfolio health & diversity
                  </div>
                  <div className="text-base text-yellow-600">
                    80% repeat customers indicating strong customer loyalty. Revenue sources are well diversified.
                  </div>
                </div>
                
                <hr className="border-gray-200" />
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-3">
                    Frequency and nature of disputes
                  </div>
                  <div className="text-base text-green-600">
                    Dispute rate below 1%, with no recurring issues.
                  </div>
                </div>

                <hr className="border-gray-200" />
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-3">
                    Transaction processing consistency
                  </div>
                  <div className="text-base text-green-600">
                    Stable transaction volume averaging $50,000/month, no major disruptions.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Financial Stability */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-6 h-6" />
                <h3 className="text-xl font-medium text-gray-900">
                  Personal Financial Stability & Behavioral Insights
                </h3>
              </div>
            </div>
            
            <PersonalFinancialStabilityCard />
          </div>

          {/* Business Financial Stability */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-6 h-6" />
                <h3 className="text-xl font-medium text-gray-900">
                  Business Financial Stability & Behavioral Insights
                </h3>
              </div>
            </div>
            
            <BusinessFinancialStabilityCard />
          </div>

          {/* Tax Return Verification */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex-1">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-6 h-6" />
                <h3 className="text-xl font-medium text-gray-900">
                  Tax Return Verification
                </h3>
              </div>
            </div>
            
            <TaxReturnVerificationCard />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Personal Financial Stability Card
const PersonalFinancialStabilityCard: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-8">
    <div className="space-y-6">
      {[
        {
          label: "Debt levels and repayment behavior",
          value: "Low personal debt ($5,000) with consistent on-time repayments over 24 months.",
          status: "warning"
        },
        {
          label: "Credit utilization and history", 
          value: "Credit utilization under 25%, no late payments, stable credit score over the past 6 months.",
          status: "positive"
        },
        {
          label: "Verification of income sources",
          value: "Verified annual income of $100,000 through tax returns and bank deposits.",
          status: "positive"
        },
        {
          label: "Experience in business/industry",
          value: "12 years total industry experience, 8 years operating current business.",
          status: "positive"
        },
        {
          label: "Open Bankruptcies, Judgements, Liens & More",
          value: "No",
          status: "positive"
        },
        {
          label: "Overdraft & NSF frequency",
          value: "No overdrafts reported in the past 18 months. 2 NSFs reported over the past 6 months.",
          status: "positive"
        }
      ].map((item, index, arr) => (
        <div key={index}>
          <div className="text-sm font-medium text-gray-500 mb-3">
            {item.label}
          </div>
          <div className={`text-base ${
            item.status === 'positive' ? 'text-green-600' : 
            item.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {item.value}
          </div>
          {index < arr.length - 1 && <hr className="border-gray-200 mt-6" />}
        </div>
      ))}
    </div>
  </div>
);

// Business Financial Stability Card  
const BusinessFinancialStabilityCard: React.FC = () => (
  <div className="flex gap-5">
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex-1">
      <div className="space-y-6">
        {[
          {
            label: "Deposit frequency and regularity",
            value: "Average 15 deposits per month, no gaps longer than 10 days between deposits.",
            status: "positive"
          },
          {
            label: "Gross Margin >= 35%",
            value: "42%, no negative cashflow months in the past year.",
            status: "positive"
          },
          {
            label: "Net Income Margin >5%", 
            value: "7%.",
            status: "positive"
          },
          {
            label: "Payment history",
            value: "Clean record with 95% on-time payments over the last 24 months.",
            status: "positive"
          },
          {
            label: "Overdraft frequency",
            value: "No overdrafts reported in the past 18 months.",
            status: "positive"
          },
          {
            label: "Recovery signals",
            value: "Prompt recovery from minor past delinquencies, showing financial discipline.",
            status: "positive"
          },
          {
            label: "Open Judgement, Liens & More",
            value: "No",
            status: "positive"
          }
        ].map((item, index, arr) => (
          <div key={index}>
            <div className="text-sm font-medium text-gray-500 mb-3">
              {item.label}
            </div>
            <div className="text-base text-green-600">
              {item.value}
            </div>
            {index < arr.length - 1 && <hr className="border-gray-200 mt-6" />}
          </div>
        ))}
      </div>
    </div>
    
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 w-80">
      <div className="space-y-6">
        {[
          { label: "Debt-to-Income (DTI)", value: "28%" },
          { label: "Debt Service Coverage Ratio", value: "1.8x" },
          { label: "Current Ratio", value: "2.1" },
          { label: "Global Debt Service", value: "35%" },
          { label: "Return on Equity (ROE)", value: "15%" },
          { label: "Return on Assets", value: "12%" }
        ].map((item, index, arr) => (
          <div key={index}>
            <div className="text-sm font-medium text-gray-500 mb-3">
              {item.label}
            </div>
            <div className="text-base text-black">
              {item.value}
            </div>
            {index < arr.length - 1 && <hr className="border-gray-200 mt-6" />}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Tax Return Verification Card
const TaxReturnVerificationCard: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-5">
    <div className="space-y-6">
      {[
        {
          label: "Filing history",
          value: "All required tax returns for 2021-2023 filed on time.",
          status: "warning"
        },
        {
          label: "Revenue match",
          value: "Application states $600,000; tax return shows $570,000. 5.3% variance, good.",
          status: "positive"
        },
        {
          label: "Profitability",
          value: "Positive net profit in all years, average margin 14%.",
          status: "positive"
        },
        {
          label: "Business structure match",
          value: "Business structure reported as S-Corp; matches application details.",
          status: "positive"
        },
        {
          label: "Risk flags",
          value: "No significant revenue decline, volatility, or loss carryforwards detected.",
          status: "positive"
        }
      ].map((item, index, arr) => (
        <div key={index}>
          <div className="text-sm font-medium text-gray-500 mb-3">
            {item.label}
          </div>
          <div className={`text-base ${
            item.status === 'positive' ? 'text-green-600' : 
            item.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {item.value}
          </div>
          {index < arr.length - 1 && <hr className="border-gray-200 mt-6" />}
        </div>
      ))}
    </div>
  </div>
);

export default EnhancedApplicationDetail;
