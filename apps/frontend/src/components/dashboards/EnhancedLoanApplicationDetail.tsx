import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Bell, Settings, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Logo } from '../ui/logo';
import { ProgressSteps } from '../dashboard/ProgressSteps';
import { ApplicationCard } from '../dashboard/ApplicationCard';
import { IntelligenceSummary } from '../dashboard/IntelligenceSummary';
import { TabNavigation } from '../dashboard/TabNavigation';
import { CashFlowChart } from '../dashboard/CashFlowChart';
import { TransactionsTable } from '../dashboard/TransactionsTable';
import { useAuth } from '../../hooks/useAuth';
import type { ApplicationId } from '../../types/loanApplications';

interface EnhancedLoanApplicationDetailProps {
  applicationId: ApplicationId;
  onBack: () => void;
}

export const EnhancedLoanApplicationDetail: React.FC<EnhancedLoanApplicationDetailProps> = ({ 
  applicationId, 
  onBack 
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('cash-flow');

  const progressSteps = [
    { id: 'submitted', label: 'Submitted', status: 'completed' as const },
    { id: 'in-review', label: 'In Review', status: 'current' as const },
    { id: 'approved', label: 'Approved', status: 'pending' as const },
    { id: 'funded', label: 'Funded', status: 'pending' as const },
  ];

  const applicationData = {
    applicationId: 'LA-2024-0892',
    recommendation: 'Recommend Reject',
    borrowerId: applicationId,
    applicationDate: '12/09/2025',
    loanType: 'Loan Product 1',
    loanOfficer: 'Caleb Mark',
    amountRequested: '$20,000',
    underwriter: 'Emmanuella Areal',
  };

  const tabs = [
    { id: 'cash-flow', label: 'Cash Flow Analytics', isActive: activeTab === 'cash-flow' },
    { id: 'relationship', label: 'Relationship & Impact', isActive: activeTab === 'relationship' },
    { id: 'business', label: 'Business & Personal Financial Stability', isActive: activeTab === 'business' },
    { id: 'documents', label: 'Financials & Supporting Documents', isActive: activeTab === 'documents' },
  ];

  const handleApprove = () => {
    console.log('Application approved');
    // Here you would typically make an API call to approve the application
  };

  const handleReject = () => {
    console.log('Application rejected');
    // Here you would typically make an API call to reject the application
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#eaecf0] bg-white px-8">
        <div className="flex min-h-[72px] w-full items-center gap-[40px_100px] justify-between flex-wrap px-8">
          <div className="flex min-w-60 items-center gap-4">
            <div className="flex items-center gap-[5px]">
              <Logo />
            </div>
            <nav className="flex min-w-60 items-center gap-1 text-base text-[#667085] font-medium whitespace-nowrap">
              <Button variant="secondary" className="text-[#020617] bg-[#f2f4f7]">
                Dashboard
              </Button>
              <Button variant="ghost" className="text-[#667085] hover:bg-[#f9fafb]">
                Borrowers
              </Button>
              <Button variant="ghost" className="text-[#667085] hover:bg-[#f9fafb]">
                Portfolio
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="w-10 h-10 border border-[#eaecf0]">
                <Bell className="w-5 h-5 text-[#667085]" />
              </Button>
              <Button variant="ghost" size="icon" className="w-10 h-10 border border-[#eaecf0]">
                <Settings className="w-5 h-5 text-[#667085]" />
              </Button>
            </div>
            <Avatar>
              <AvatarFallback className="bg-[#f2f4f7]">
                <User className="w-5 h-5 text-[#667085]" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Breadcrumb and Progress */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-[#667085]">
            <button onClick={onBack} className="hover:text-[#1a2340]">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span>Loan Application</span>
          </div>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messaging
          </Button>
        </div>

        <ProgressSteps steps={progressSteps} />
      </div>

      {/* Application Card */}
      <div className="px-6 py-4">
        <ApplicationCard 
          data={applicationData} 
          onApprove={handleApprove} 
          onReject={handleReject} 
        />
      </div>

      {/* Intelligence Summary */}
      <div className="px-6 py-6">
        <IntelligenceSummary />
      </div>

      {/* Tabs Section */}
      <div className="px-6">
        <TabNavigation tabs={tabs} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          {activeTab === 'cash-flow' && <CashFlowChart />}
          {activeTab === 'relationship' && (
            <div className="bg-white border border-[#eaecf0] rounded-lg p-8 text-center text-[#667085]">
              <div className="text-4xl mb-4 opacity-30">🤝</div>
              <h3 className="text-lg font-medium text-[#020617] mb-2">Relationship & Impact Analysis</h3>
              <p>Detailed relationship and community impact metrics coming soon</p>
            </div>
          )}
          {activeTab === 'business' && (
            <div className="bg-white border border-[#eaecf0] rounded-lg p-8 text-center text-[#667085]">
              <div className="text-4xl mb-4 opacity-30">📊</div>
              <h3 className="text-lg font-medium text-[#020617] mb-2">Financial Stability Analysis</h3>
              <p>Business and personal financial stability metrics coming soon</p>
            </div>
          )}
          {activeTab === 'documents' && (
            <div className="bg-white border border-[#eaecf0] rounded-lg p-8 text-center text-[#667085]">
              <div className="text-4xl mb-4 opacity-30">📄</div>
              <h3 className="text-lg font-medium text-[#020617] mb-2">Supporting Documents</h3>
              <p>Financials and supporting document review coming soon</p>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="px-6 mt-8 pb-8">
        <TransactionsTable />
      </div>
    </div>
  );
};
