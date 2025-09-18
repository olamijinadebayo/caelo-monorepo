import React, { useState } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Navbar } from '../shared/Navbar';
import { TransactionDetails } from '../dashboard/TransactionDetails';
import type { ApplicationId } from '../../types/loanApplications';

interface FigmaApplicationDetailProps {
  applicationId: ApplicationId;
  onBack: () => void;
  onNavigateToDashboard?: () => void;
}

interface Transaction {
  id: string;
  date: string;
  type: 'Inflow' | 'Outflow';
  category: string;
  description: string;
  amount: string;
  anomalyScore: number;
  isAnomaly: boolean;
}

interface MetricData {
  avgDailyInflow: string;
  avgDailyOutflow: string;
  totalInflow: string;
  totalOutflow: string;
}

export const FigmaApplicationDetail: React.FC<FigmaApplicationDetailProps> = ({ 
  applicationId, 
  onBack,
  onNavigateToDashboard 
}) => {
  const [activeTab, setActiveTab] = useState('cash-flow');
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showMessageSidebar, setShowMessageSidebar] = useState(false);
  const [messageSidebarTab, setMessageSidebarTab] = useState<'team-note' | 'message-user'>('team-note');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [teamNotes, setTeamNotes] = useState([
    {
      id: 1,
      author: 'Kabir Anifowose',
      isCurrentUser: true,
      timestamp: '1 hour ago',
      content: "NSF incidents are concerning but borrower's explanation seems reasonable. Strong business fundamentals otherwise. Need to discuss with risk committee."
    },
    {
      id: 2,
      author: 'Tom Chen (Risk)',
      isCurrentUser: false,
      timestamp: '45 mins ago',
      content: "NSF incidents are concerning but borrower's explanation seems reasonable. Strong business fundamentals otherwise. Need to discuss with risk committee."
    },
    {
      id: 3,
      author: 'Tom Chen (Risk)',
      isCurrentUser: false,
      timestamp: '45 mins ago',
      content: "NSF incidents are concerning but borrower's explanation seems reasonable. Strong business fundamentals otherwise. Need to discuss with risk committee."
    },
    {
      id: 4,
      author: 'Tom Chen (Risk)',
      isCurrentUser: false,
      timestamp: '45 mins ago',
      content: "NSF incidents are concerning but borrower's explanation seems reasonable. Strong business fundamentals otherwise. Need to discuss with risk committee."
    }
  ]);

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      const newNote = {
        id: Math.max(...teamNotes.map(n => n.id)) + 1,
        author: 'Kabir Anifowose',
        isCurrentUser: true,
        timestamp: 'Just now',
        content: newNoteText.trim()
      };
      setTeamNotes([newNote, ...teamNotes]);
      setNewNoteText('');
      setIsAddingNote(false);
    }
  };

  const handleCancelAddNote = () => {
    setNewNoteText('');
    setIsAddingNote(false);
  };

  const progressSteps = [
    { id: 'submitted', label: 'Submitted', status: 'completed' as const },
    { id: 'in-review', label: 'In Review', status: 'current' as const },
    { id: 'approved', label: 'Approved', status: 'pending' as const },
    { id: 'funded', label: 'Funded', status: 'pending' as const },
  ];

  const applicationData = {
    applicationId: 'LA-2024-0892',
    recommendation: 'Recommend Reject',
    borrowerId: 'IDC1092EA23',
    applicationDate: '12/09/2025',
    loanType: 'Loan Product 1',
    loanOfficer: 'Caleb Mark',
    amountRequested: '$20,000',
    underwriter: 'Emmanuella Areal',
  };

  const intelligenceSummary = "The business shows a healthy balance of inflows and outflows. Revenues are growing at 20% YoY with profits growing at a similar rate. However, the owner shows signs of financial distress with 2 NSFs in the past 6 months. Furthermore, several uncategorized transactions were found in amounts above $1000. Please consult the Transactions table under Cash Flow Analytics for more information.";

  const tabs = [
    { id: 'cash-flow', label: 'Cash Flow Analytics', isActive: activeTab === 'cash-flow' },
    { id: 'relationship', label: 'Relationship & Impact', isActive: activeTab === 'relationship' },
    { id: 'financial-stability', label: 'Business & Personal Financial Stability', isActive: activeTab === 'financial-stability' },
    { id: 'documents', label: 'Financials & Supporting Documents', isActive: activeTab === 'documents' },
  ];

  const cashFlowMetrics: MetricData = {
    avgDailyInflow: '$12,000',
    avgDailyOutflow: '$12,000',
    totalInflow: '$12,000',
    totalOutflow: '$12,000',
  };

  const transactions: Transaction[] = [
    {
      id: '1',
      date: '21/09/24',
      type: 'Inflow',
      category: 'Salary',
      description: 'Monthly salary payment',
      amount: '$20,000',
      anomalyScore: 0.8,
      isAnomaly: true,
    },
    {
      id: '2',
      date: '21/09/24',
      type: 'Outflow',
      category: 'Rent',
      description: 'Monthly rent payment - higher than usual',
      amount: '$35,000',
      anomalyScore: 0.1,
      isAnomaly: false,
    },
    {
      id: '3',
      date: '21/09/24',
      type: 'Outflow',
      category: 'Undefined',
      description: 'Caleb Mark',
      amount: '$25,000',
      anomalyScore: 0.3,
      isAnomaly: false,
    },
  ];

  const handleApprove = () => {
    console.log('Application approved');
  };

  const handleReject = () => {
    console.log('Application rejected');
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSelectAll = () => {
    if (selectedTransactions.size === transactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(transactions.map(t => t.id)));
    }
  };

  const handleSelectTransaction = (id: string) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const getProgressBarWidth = (score: number) => {
    return `${score * 100}%`;
  };

  const getProgressBarColor = (score: number) => {
    return score > 0.5 ? 'bg-[#D92D20]' : 'bg-green-600';
  };

  return (
    <div className="items-center flex flex-col overflow-hidden bg-white pb-[25px]">
      {/* Header */}
      <Navbar 
        onDashboardClick={onNavigateToDashboard}
        currentPage="dashboard"
      />
      
      {/* Main Content Container - matching EnhancedLenderDashboard structure */}
      <div className="w-full max-w-[1440px] mx-auto px-[50px] xl:px-[50px] lg:px-8 md:px-6 sm:px-4">
        {/* Breadcrumb and Messaging */}
        <div className="flex w-full items-center gap-[40px_100px] justify-between flex-wrap mt-5">
        <nav className="self-stretch flex items-center gap-3 my-auto" aria-label="Breadcrumb">
          <button onClick={onBack} className="self-stretch flex w-5 my-auto hover:opacity-60 transition-opacity">
            <img
              src="https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/c33c4215a8a66291357334daab3996361d525ff7?placeholderIfAbsent=true"
              alt="Home"
              className="aspect-[1] object-contain w-5"
            />
          </button>
          <img
            src="https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/09fd411f06e1c43f6544c4a564b90e5a39410f82?placeholderIfAbsent=true"
            alt="Breadcrumb separator"
            className="aspect-[1] object-contain w-4 self-stretch shrink-0 my-auto"
          />
          <div className="self-stretch flex items-center text-sm text-[#111925] font-medium leading-none justify-center my-auto">
            <div className="self-stretch my-auto">
              Loan Application
            </div>
          </div>
        </nav>
        
        <button 
          onClick={() => setShowMessageSidebar(!showMessageSidebar)}
          className="justify-center items-center border self-stretch flex gap-2 overflow-hidden text-base text-[#344054] font-medium whitespace-nowrap bg-white my-auto px-[18px] py-2.5 rounded-lg border-solid border-[#D0D5DD] hover:bg-gray-50"
        >
          <MessageSquare className="w-5 h-5" />
          Message
        </button>
      </div>
      
      <div className="z-10 flex w-full max-w-[1345px] flex-col items-stretch mt-8 max-md:max-w-full">
        {/* Progress Steps */}
        <div className="self-center flex w-[1296px] max-w-full flex-col items-center px-4 sm:px-8 lg:px-36 max-md:px-5">
          <div className="flex w-full max-w-[1008px] items-stretch gap-4 flex-wrap pb-5 max-md:max-w-full">
            {progressSteps.map((step, index) => (
              <div key={step.id} className="flex items-stretch flex-1 grow shrink basis-auto">
                <div className="flex flex-col items-stretch text-sm text-[#344054] font-normal whitespace-nowrap text-center leading-none">
                  {step.status === 'completed' ? (
                    <div className="aspect-[1] object-contain w-6 self-center bg-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`justify-center items-center self-center flex w-6 flex-col overflow-hidden h-6 px-[5px] rounded-xl ${
                      step.status === 'current' 
                        ? 'shadow-[0_0_0_4px_#F4EBFF] bg-green-50' 
                        : 'bg-[#F2F4F7]'
                    }`}>
                      <div className={`flex w-full shrink-0 h-2 bg-white rounded-[50%] ${
                        step.status === 'current' ? 'fill-green-600' : ''
                      }`} />
                    </div>
                  )}
                  <div className={`w-full mt-3 pt-0.5 ${
                    step.status === 'current' ? 'text-green-600' : 'text-[#344054]'
                  }`}>
                    <div>{step.label}</div>
                  </div>
                </div>
                {index < progressSteps.length - 1 && (
                  <div className={`flex mr-[-120px] w-64 shrink-0 max-w-full h-0.5 mt-[11px] ${
                    step.status === 'completed' ? 'bg-green-600' : 'bg-[#EAECF0]'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Application Card */}
        <div className="w-full mt-3 max-md:max-w-full">
          <div className="flex w-full justify-between max-md:max-w-full">
            <div className="border bg-white min-w-60 w-full flex-1 shrink basis-[0%] p-6 rounded-2xl border-solid border-[#EAECF0] max-md:max-w-full max-md:px-5">
              <div className="flex w-full items-center gap-[40px_100px] font-medium justify-between flex-wrap max-md:max-w-full">
                <div className="self-stretch flex min-w-60 min-h-8 items-center gap-2 flex-wrap my-auto max-md:max-w-full">
                  <h1 className="text-slate-950 text-2xl leading-none tracking-[-0.72px] self-stretch my-auto">
                    Application #{applicationData.applicationId}
                  </h1>
                  <div className="border-slate-200 border bg-slate-200 self-stretch w-0 shrink-0 h-8 border-solid" />
                  <div className="self-stretch min-w-60 text-sm leading-none my-auto">
                    <div className="flex items-center gap-3">
                      <div className="text-[#667085] self-stretch my-auto">
                        Recommendation:
                      </div>
                      <div className="text-green-600 self-stretch my-auto">
                        {applicationData.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex items-center gap-[9px] text-base whitespace-nowrap my-auto">
                  <button 
                    onClick={handleApprove}
                    className="justify-center items-center border shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] bg-[#1A2340] self-stretch flex gap-2 overflow-hidden text-[#FFF5E6] my-auto px-[18px] py-2.5 rounded-lg border-solid border-[#FFF5E6] hover:bg-[#2A3450] transition-colors"
                  >
                    <div className="self-stretch my-auto">
                      Approve
                    </div>
                  </button>
                  <button 
                    onClick={handleReject}
                    className="justify-center items-center border shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] self-stretch flex gap-2 overflow-hidden text-red-600 bg-red-100 my-auto px-[18px] py-2.5 rounded-lg border-solid border-[#F9F5FF] hover:bg-red-200 transition-colors"
                  >
                    <div className="text-red-600 self-stretch my-auto">
                      Reject
                    </div>
                  </button>
                </div>
              </div>
              
              <hr className="border-slate-200 border bg-slate-200 min-h-px w-full mt-6 border-solid max-md:max-w-full" />
              
              <div className="flex w-full gap-[40px_100px] text-sm font-medium leading-none justify-between flex-wrap mt-6 max-md:max-w-full">
                <div className="flex flex-col items-stretch justify-center w-[203px]">
                  <div className="text-[#667085]">Borrower ID:</div>
                  <div className="text-[#101828] mt-3">{applicationData.borrowerId}</div>
                </div>
                <div className="flex flex-col items-stretch justify-center w-[203px]">
                  <div className="text-[#667085]">Application Date:</div>
                  <div className="text-[#101828] mt-3">{applicationData.applicationDate}</div>
                </div>
                <div className="flex flex-col items-stretch justify-center w-[203px]">
                  <div className="text-[#667085]">Loan Type:</div>
                  <div className="text-[#101828] mt-3">{applicationData.loanType}</div>
                </div>
              </div>
              
              <div className="flex w-full gap-[40px_100px] text-sm font-medium leading-none justify-between flex-wrap mt-6 max-md:max-w-full">
                <div className="flex flex-col items-stretch justify-center w-[203px]">
                  <div className="text-[#667085]">Loan Officer:</div>
                  <div className="text-[#101828] mt-3">{applicationData.loanOfficer}</div>
                </div>
                <div className="flex flex-col items-stretch justify-center w-[203px]">
                  <div className="text-[#667085]">Amount Requested:</div>
                  <div className="text-[#101828] mt-3">{applicationData.amountRequested}</div>
                </div>
                <div className="flex flex-col items-stretch justify-center w-[203px]">
                  <div className="text-[#667085]">Underwriter:</div>
                  <div className="text-[#101828] mt-3">{applicationData.underwriter}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Intelligence Summary */}
          <div className="border-slate-200 border bg-slate-200 min-h-px w-full mt-6 border-solid max-md:max-w-full">
            <div className="flex w-full gap-3 overflow-hidden flex-wrap mt-6 p-6 rounded-[10px] max-md:max-w-full max-md:px-5 bg-amber-50 border border-amber-200">
              <img
                src="https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/b487bf441836a4aa66a210d686bcd95556d2a220?placeholderIfAbsent=true"
                alt="AI Intelligence Icon"
                className="aspect-[1] object-contain w-6 shrink-0"
              />
              <div className="min-w-60 flex-1 shrink basis-[0%] max-md:max-w-full">
                <h3 className="text-amber-900 text-base font-medium">
                  Caelo Intelligence Summary
                </h3>
                <p className="text-amber-800 text-sm font-normal leading-[22px] mt-2 max-md:max-w-full">
                  {intelligenceSummary}
                </p>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="w-full mt-8 max-md:max-w-full">
            <nav className="flex w-full items-center gap-1 text-base text-[#344054] font-medium flex-wrap max-md:max-w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`items-center self-stretch flex gap-2 overflow-hidden my-auto px-3 py-2 rounded-md transition-colors ${
                    tab.isActive 
                      ? 'text-[#101828] bg-[#EAECF0]' 
                      : 'text-[#344054] bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="self-stretch flex items-center gap-3 my-auto">
                    <div className={`self-stretch my-auto ${
                      tab.isActive ? 'text-[#101828]' : 'text-[#344054]'
                    }`}>
                      {tab.label}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
            
            {activeTab === 'cash-flow' && (
              <>
                {/* Cash Flow Analytics */}
                <div className="border w-full bg-white mt-4 p-7 rounded-2xl border-solid border-[#D0D5DD] max-md:max-w-full max-md:px-5">
                  <div className="flex w-full gap-3 flex-wrap max-md:max-w-full">
                    <div className="text-sm text-[#344054] font-medium leading-none">
                      <button className="justify-center items-center border shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] flex gap-2 overflow-hidden bg-white px-4 py-2.5 rounded-lg border-solid border-[#D0D5DD] hover:bg-gray-50">
                        <svg className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto" viewBox="0 0 20 20" fill="none">
                          <path d="M6 2V6M14 2V6M3 10H17M5 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V6C3 4.89543 3.89543 4 5 4Z" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="text-[#344054] self-stretch my-auto">
                          Jan 6, 2022 – Jan 13, 2022
                        </div>
                      </button>
                    </div>
                    <div className="flex min-w-60 items-stretch gap-3 flex-wrap max-md:max-w-full">
                      <div className="text-sm text-[#344054] font-medium leading-none my-auto">
                        <button className="justify-center items-center border shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] flex gap-2 overflow-hidden bg-white px-4 py-2.5 rounded-lg border-solid border-[#D0D5DD] hover:bg-gray-50">
                          <div className="text-[#344054] self-stretch my-auto">
                            One account Selected
                          </div>
                          <svg className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto" viewBox="0 0 20 20" fill="none">
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      <div className="flex min-w-60 items-stretch gap-2 h-full w-[570px] max-md:max-w-full">
                        <div className="flex items-stretch gap-1.5 h-full">
                          <div className="justify-center items-center flex gap-[3px] h-full bg-gray-50 pl-3 pr-[7px] py-0.5 rounded-md">
                            <div className="self-stretch flex items-center gap-[5px] text-sm text-[#344054] font-medium whitespace-nowrap text-center leading-none my-auto">
                              <div className="text-[#344054] self-stretch my-auto">
                                Checkings(192829031)
                              </div>
                            </div>
                            <button className="self-stretch flex flex-col overflow-hidden items-stretch justify-center w-4 my-auto p-0.5 rounded-[3px] hover:bg-gray-200">
                              <svg className="aspect-[1] object-contain w-3" viewBox="0 0 14 14" fill="none">
                                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex w-full gap-6 flex-wrap mt-6 max-md:max-w-full">
                    <div className="justify-center items-stretch border flex min-w-60 flex-col w-[260px] bg-white p-5 rounded-lg border-solid border-[#EAECF0]">
                      <div className="w-full">
                        <div className="flex max-w-full w-[203px] flex-col items-stretch font-medium justify-center">
                          <div className="text-[#667085] text-sm leading-none">
                            Average Daily Inflow
                          </div>
                          <div className="text-green-600 text-base mt-3">
                            {cashFlowMetrics.avgDailyInflow}
                          </div>
                        </div>
                        <hr className="border-slate-200 border bg-slate-200 min-h-px w-full mt-6 border-solid" />
                        <div className="flex max-w-full w-[203px] flex-col items-stretch font-medium justify-center mt-6">
                          <div className="text-[#667085] text-sm leading-none">
                            Average Daily Outflow
                          </div>
                          <div className="text-red-600 text-base mt-3">
                            {cashFlowMetrics.avgDailyOutflow}
                          </div>
                        </div>
                        <hr className="border-slate-200 border bg-slate-200 min-h-px w-full mt-6 border-solid" />
                        <div className="flex w-full gap-3 mt-6">
                          <div className="flex flex-col items-stretch justify-center w-[94px]">
                            <div className="text-[#667085] text-sm font-medium leading-none">
                              Total Inflow
                            </div>
                            <div className="text-[#101828] text-base font-semibold mt-3">
                              {cashFlowMetrics.totalInflow}
                            </div>
                          </div>
                          <div className="border-slate-200 border bg-slate-200 w-px shrink-0 h-[52px] border-solid" />
                          <div className="flex flex-col items-stretch justify-center flex-1 shrink basis-[0%]">
                            <div className="text-[#667085] text-sm font-medium leading-none">
                              Total Outflow
                            </div>
                            <div className="text-[#101828] text-base font-semibold mt-3">
                              {cashFlowMetrics.totalOutflow}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="min-w-60 flex-1 shrink basis-10 max-md:max-w-full">
                      <div className="flex w-full flex-col text-sm text-[#667085] font-normal leading-none max-md:max-w-full">
                        <div className="flex gap-[13px]">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <div className="bg-green-600 self-stretch flex w-2 shrink-0 h-2 fill-green-600 my-auto rounded-[50%]" />
                            <div className="text-[#667085] self-stretch my-auto">
                              Inflow
                            </div>
                          </div>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <div className="bg-red-600 self-stretch flex w-2 shrink-0 h-2 fill-red-600 my-auto rounded-[50%]" />
                            <div className="text-[#667085] self-stretch my-auto">
                              Outflow
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-[rgba(248,213,85,1)] self-stretch flex w-2 shrink-0 h-2 my-auto rounded-[50%]" />
                            <div className="text-[#667085] self-stretch my-auto">
                              Est. Net Income
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full items-stretch gap-7 mt-6 max-md:max-w-full">
                        <img
                          src="https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/04af02a2cbdb18e7fa26f30e72ca8b7db3a85619?placeholderIfAbsent=true"
                          alt="Cash Flow Chart"
                          className="aspect-[2.08] object-contain w-full min-w-60 flex-1 shrink basis-[0%] max-md:max-w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="items-stretch self-stretch border flex min-w-60 flex-col overflow-hidden text-sm leading-none w-[333px] bg-white p-5 rounded-xl border-solid border-[#EAECF0]">
                      <div className="flex w-full gap-[40px_75px] text-[#344054] font-medium justify-between">
                        <svg className="aspect-[1] object-contain w-4 shrink-0" viewBox="0 0 16 16" fill="none">
                          <path d="M2 8H14M8 2V14" stroke="#344054" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="text-[#344054]">
                          Inflow Category
                        </div>
                        <svg className="aspect-[1] object-contain w-4 shrink-0" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4L8 10L14 4" stroke="#344054" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <img
                        src="https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/65f5c64c9bf61ea08864d055ae2c388e99a66a29?placeholderIfAbsent=true"
                        alt="Pie Chart"
                        className="aspect-[1] object-contain w-[180px] self-center max-w-full mt-[46px] max-md:mt-10"
                      />
                      <div className="flex w-full items-stretch gap-[40px_100px] text-[#667085] font-normal justify-between mt-[46px] max-md:mt-10">
                        <div className="flex flex-col items-stretch justify-center">
                          <div className="flex items-center gap-2">
                            <div className="bg-yellow-600 self-stretch flex w-2 shrink-0 h-2 fill-yellow-600 my-auto rounded-[50%]" />
                            <div className="text-[#667085] self-stretch my-auto">
                              Item 1
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-[13px]">
                            <div className="bg-yellow-800 self-stretch flex w-2 shrink-0 h-2 fill-yellow-800 my-auto rounded-[50%]" />
                            <div className="text-[#667085] self-stretch my-auto">
                              Item 2
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="bg-[rgba(248,213,85,1)] self-stretch flex w-2 shrink-0 h-2 my-auto rounded-[50%]" />
                            <div className="text-[#667085] self-stretch my-auto">
                              Item 3
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-[13px]">
                            <div className="bg-yellow-800 self-stretch flex w-2 shrink-0 h-2 fill-yellow-800 my-auto rounded-[50%]" />
                            <div className="text-[#667085] self-stretch my-auto">
                              Item 4
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="w-full mt-4 max-md:max-w-full">
                  {/* Transactions Header - Exact Figma Design */}
                  <div className="flex items-center justify-between relative w-full">
                    <div className="font-['Inter:Medium',_sans-serif] font-medium text-[16px] text-slate-950">
                      <p className="leading-[24px] whitespace-pre">Transactions</p>
                    </div>
                    <div className="bg-white relative rounded-[8px]">
                      <div className="box-border flex gap-2 items-center justify-center px-4 py-2.5 relative">
                        <div className="overflow-hidden relative w-2.5 h-2.5">
                          <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4">
                            <div className="absolute inset-[-10%_-6.67%]">
                              <svg className="w-full h-full" viewBox="0 0 10 10" fill="none">
                                <circle cx="5" cy="5" r="1" fill="#101828" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="font-['Inter:Medium',_sans-serif] font-medium text-[#344054] text-[14px]">
                          <p className="leading-[20px] whitespace-pre">Filter</p>
                        </div>
                      </div>
                      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]" />
                    </div>
                  </div>
                  
                  <div className="border shadow-[0_1px_3px_0_rgba(16,24,40,0.10),0_1px_2px_0_rgba(16,24,40,0.06)] w-full overflow-hidden bg-white mt-4 rounded-lg border-solid border-[#EAECF0] max-md:max-w-full">
                    <div className="flex w-full flex-wrap bg-white max-md:max-w-full">
                      {/* Table Headers and Content */}
                      <div className="w-full overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="text-left px-6 py-3 border-b border-[#EAECF0]">
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedTransactions.size === transactions.length}
                                    onChange={handleSelectAll}
                                    className="border border-[#D0D5DD] rounded-md w-5 h-5"
                                  />
                                  <div className="flex items-center gap-1">
                                    <span className="text-[#667085] text-xs font-medium">Date</span>
                                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                                      <path d="M8 3V13M8 13L12 9M8 13L4 9" stroke="#667085" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                </div>
                              </th>
                              <th className="text-left px-6 py-3 border-b border-[#EAECF0]">
                                <span className="text-[#667085] text-xs font-medium">Type</span>
                              </th>
                              <th className="text-left px-6 py-3 border-b border-[#EAECF0]">
                                <span className="text-[#667085] text-xs font-medium">Category</span>
                              </th>
                              <th className="text-left px-6 py-3 border-b border-[#EAECF0]">
                                <span className="text-[#667085] text-xs font-medium">Description</span>
                              </th>
                              <th className="text-left px-6 py-3 border-b border-[#EAECF0]">
                                <span className="text-[#667085] text-xs font-medium">Amount</span>
                              </th>
                              <th className="text-left px-6 py-3 border-b border-[#EAECF0]">
                                <span className="text-[#667085] text-xs font-medium">Anomaly Score</span>
                              </th>
                              <th className="text-left px-6 py-3 border-b border-[#EAECF0]">
                                <span className="text-[#667085] text-xs font-medium">Anomaly</span>
                              </th>
                              <th className="text-left px-6 py-3 border-b border-[#EAECF0]">
                                <span className="text-[#667085] text-xs font-medium"></span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((transaction) => (
                              <React.Fragment key={transaction.id}>
                                <tr className="border-b border-[#EAECF0]">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <input
                                      type="checkbox"
                                      checked={selectedTransactions.has(transaction.id)}
                                      onChange={() => handleSelectTransaction(transaction.id)}
                                      className="border border-[#D0D5DD] rounded-md w-5 h-5"
                                    />
                                    <span className="text-[#101828] text-sm font-medium">
                                      {transaction.date}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex px-2 py-0.5 rounded-2xl text-xs font-medium ${
                                    transaction.type === 'Inflow' 
                                      ? 'bg-[#ECFDF3] text-[#027A48]' 
                                      : 'bg-[#FEF3F2] text-[#B42318]'
                                  }`}>
                                    {transaction.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5 text-[#667085] text-sm">
                                    {transaction.category === 'Undefined' ? (
                                      <>
                                        <span style={{textDecoration: 'underline'}}>
                                          {transaction.category}
                                        </span>
                                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                                          <circle cx="8" cy="8" r="6" stroke="#667085" strokeWidth="1.5"/>
                                          <path d="M8 12V8M8 6H8.01" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      </>
                                    ) : (
                                      transaction.category
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-[#667085] text-sm">
                                    {transaction.description}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-[#101828] text-sm font-medium">
                                    {transaction.amount}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-[#EAECF0] rounded h-2">
                                      <div 
                                        className={`rounded h-2 ${getProgressBarColor(transaction.anomalyScore)}`}
                                        style={{ width: getProgressBarWidth(transaction.anomalyScore) }}
                                      />
                                    </div>
                                    <span className="text-[#344054] text-sm font-medium min-w-8">
                                      {transaction.anomalyScore}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-sm font-medium ${
                                    transaction.isAnomaly ? 'text-[#D92D20]' : 'text-green-600'
                                  }`}>
                                    {transaction.isAnomaly ? 'Yes' : 'No'}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <button 
                                    onClick={() => setSelectedTransaction(
                                      selectedTransaction?.id === transaction.id ? null : transaction
                                    )}
                                    className="text-[#667085] text-sm font-medium hover:text-[#101828]"
                                  >
                                    {selectedTransaction?.id === transaction.id ? 'Hide' : 'View'}
                                  </button>
                                </td>
                              </tr>
                              {selectedTransaction?.id === transaction.id && (
                                <tr>
                                  <td colSpan={8} className="p-0 bg-gray-50">
                                    <div className="mx-6 my-4">
                                      <TransactionDetails 
                                        transaction={{
                                          id: selectedTransaction.id,
                                          description: selectedTransaction.description,
                                          anomalyExplanation: selectedTransaction.isAnomaly 
                                            ? `Amount is ${(selectedTransaction.anomalyScore * 100).toFixed(1)}% anomalous. This ${selectedTransaction.type.toLowerCase()} transaction deviates from typical patterns for this category.`
                                            : 'This transaction follows normal spending patterns.',
                                          userComment: ''
                                        }}
                                        onMarkNormal={() => {
                                          // Handle marking transaction as normal
                                          console.log('Marking transaction as normal:', selectedTransaction.id);
                                          setSelectedTransaction(null);
                                        }}
                                        onExcludeFromCashflow={() => {
                                          // Handle excluding from cashflow analysis - button handles highlighting internally
                                          console.log('Excluding transaction from cashflow:', selectedTransaction.id);
                                        }}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Pagination */}
                    <div className="flex justify-between items-center text-sm text-[#344054] font-medium px-6 py-4 border-t border-[#EAECF0]">
                      <button 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`border shadow-sm px-3.5 py-2 rounded-lg border-[#EAECF0] ${
                          currentPage === 1 ? 'text-[#D0D5DD] cursor-not-allowed' : 'text-[#344054] hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      <div className="text-[#344054]">
                        Page {currentPage} of {totalPages}
                      </div>
                      <button 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="border shadow-sm text-[#344054] px-3.5 py-2 rounded-lg border-[#D0D5DD] hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'relationship' && (
              <div className="border w-full bg-white mt-4 p-7 rounded-2xl border-solid border-[#D0D5DD] max-md:max-w-full max-md:px-5">
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold text-[#101828] mb-2">Relationship & Impact</h3>
                  <p className="text-[#667085]">This section is under development</p>
                </div>
              </div>
            )}
            
            {activeTab === 'financial-stability' && (
              <div className="border w-full bg-white mt-4 p-7 rounded-2xl border-solid border-[#D0D5DD] max-md:max-w-full max-md:px-5">
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold text-[#101828] mb-2">Business & Personal Financial Stability</h3>
                  <p className="text-[#667085]">This section is under development</p>
                </div>
              </div>
            )}
            
            {activeTab === 'documents' && (
              <div className="border w-full bg-white mt-4 p-7 rounded-2xl border-solid border-[#D0D5DD] max-md:max-w-full max-md:px-5">
                <div className="text-center py-20">
                  <h3 className="text-xl font-semibold text-[#101828] mb-2">Financials & Supporting Documents</h3>
                  <p className="text-[#667085]">This section is under development</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div> {/* Close main content container */}
      
      {/* Message Sidebar */}
      {showMessageSidebar && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/5 z-40"
            onClick={() => setShowMessageSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-[525px] bg-white shadow-2xl z-50 overflow-hidden rounded-l-[24px]">
            <div className="flex flex-col h-full p-6">
              {/* Button Group - Team Note / Message User */}
              <div className="relative rounded-lg border border-[#d0d5dd] shadow-sm mb-8">
                <div className="flex isolate">
                  <button
                    onClick={() => setMessageSidebarTab('team-note')}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-l-lg z-10 ${
                      messageSidebarTab === 'team-note'
                        ? 'bg-gray-50 text-[#1d2939] border-r border-[#d0d5dd]'
                        : 'bg-white text-[#344054] border-r border-[#d0d5dd]'
                    }`}
                  >
                    Internal Team note
                  </button>
                  <button
                    onClick={() => setMessageSidebarTab('message-user')}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-r-lg z-10 ${
                      messageSidebarTab === 'message-user'
                        ? 'bg-gray-50 text-[#1d2939]'
                        : 'bg-white text-[#344054]'
                    }`}
                  >
                    Message User
                  </button>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 flex flex-col justify-between w-full">
                {messageSidebarTab === 'team-note' ? (
                  <>
                    {/* Team Notes List */}
                    <div className="flex flex-col gap-3 overflow-y-auto flex-1">
                      {teamNotes.map((note) => (
                        <div key={note.id} className="bg-white border border-[#eaecf0] rounded-lg p-5">
                          <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex gap-1 items-start">
                                <span className="font-medium text-base text-slate-950">{note.author}</span>
                                {note.isCurrentUser && (
                                  <span className="font-medium text-base text-slate-950">(You)</span>
                                )}
                              </div>
                              <span className="font-normal text-sm text-slate-500">{note.timestamp}</span>
                            </div>
                            <p className="font-normal text-sm text-slate-500 leading-6">
                              {note.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Note Form or Button */}
                    {isAddingNote ? (
                      <div className="mt-8 space-y-4">
                        <div className="bg-white border border-[#eaecf0] rounded-lg p-5">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex gap-1 items-start">
                                <span className="font-medium text-base text-slate-950">Kabir Anifowose</span>
                                <span className="font-medium text-base text-slate-950">(You)</span>
                              </div>
                              <span className="font-normal text-sm text-slate-500">Just now</span>
                            </div>
                            <textarea
                              value={newNoteText}
                              onChange={(e) => setNewNoteText(e.target.value)}
                              placeholder="Add your note here..."
                              className="w-full p-3 border border-[#d0d5dd] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1a2340] focus:border-transparent"
                              rows={3}
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddNote}
                            disabled={!newNoteText.trim()}
                            className="flex-1 bg-[#1a2340] text-[#fff5e6] px-4 py-2.5 rounded-lg font-medium text-base shadow-sm border border-[#fff5e6] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Save Note
                          </button>
                          <button
                            onClick={handleCancelAddNote}
                            className="flex-1 bg-white text-[#344054] px-4 py-2.5 rounded-lg font-medium text-base shadow-sm border border-[#d0d5dd] hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAddingNote(true)}
                        className="w-full bg-[#1a2340] text-[#fff5e6] px-4 py-2.5 rounded-lg font-medium text-base shadow-sm border border-[#fff5e6] mt-8"
                      >
                        Add Note
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-6 h-full px-[119px]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-slate-100 p-6 rounded-lg">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <p className="text-[#667085] text-sm text-center w-[181px] leading-5">
                        Send a message to the borrower about this application
                      </p>
                    </div>
                    <button className="w-full bg-[#1a2340] text-[#fff5e6] px-4 py-2.5 rounded-lg font-medium text-base shadow-sm border border-[#fff5e6]">
                      Send Message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
