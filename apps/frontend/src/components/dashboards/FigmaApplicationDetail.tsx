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
  const [activeRelationshipSection, setActiveRelationshipSection] = useState<string>('loan-purpose');
  const [applicationStatus, setApplicationStatus] = useState<'submitted' | 'in-review' | 'approved' | 'rejected' | 'funded'>('in-review');
  
  // Intersection Observer for scroll navigation
  React.useEffect(() => {
    if (activeTab !== 'relationship') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveRelationshipSection(entry.target.id);
          }
        });
      },
      { 
        root: null, 
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      }
    );

    const sections = ['loan-purpose', 'relationship-history', 'community-impact'];
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [activeTab]);
  
  // Chat messages state
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, this is the lender team reaching to learn more about your request",
      sender: "lender",
      timestamp: "8:00 PM",
      avatar: null
    },
    {
      id: 2,
      text: "Okay No problem",
      sender: "user",
      timestamp: "8:00 PM",
      avatar: "MR"
    }
  ]);
  const [newMessageText, setNewMessageText] = useState('');
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
    },
    {
      id: 5,
      author: 'Sarah Johnson',
      isCurrentUser: false,
      timestamp: '2 hours ago',
      content: "Credit verification completed. FICO score is 742, well within our approval range. No recent derogatory marks found."
    },
    {
      id: 6,
      author: 'Michael Davis',
      isCurrentUser: false,
      timestamp: '3 hours ago',
      content: "Employment verification received. Applicant confirmed as full-time employee with stable income for past 2 years."
    },
    {
      id: 7,
      author: 'Emily Chen',
      isCurrentUser: false,
      timestamp: '4 hours ago',
      content: "Reviewed bank statements for last 3 months. Regular deposits match stated income. Minimal overdraft activity."
    },
    {
      id: 8,
      author: 'Robert Wilson',
      isCurrentUser: false,
      timestamp: '5 hours ago',
      content: "Initial document review complete. All required forms submitted and appear authentic. Processing can continue."
    },
    {
      id: 9,
      author: 'Amanda Liu',
      isCurrentUser: false,
      timestamp: '1 day ago',
      content: "Application received and assigned. Customer has existing checking account relationship since 2019."
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

  // Scroll navigation for relationship tab
  const scrollToSection = (sectionId: string) => {
    setActiveRelationshipSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const relationshipSections = [
    {
      id: 'loan-purpose',
      label: 'Loan Purpose & Impact Summary',
      icon: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      id: 'relationship-history',
      label: 'Relationship History',
      icon: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      id: 'community-impact',
      label: 'Community Impact',
      icon: (
        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      )
    }
  ];

  const handleSendMessage = () => {
    if (newMessageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: newMessageText.trim(),
        sender: "lender" as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: null
      };
      setMessages([...messages, newMessage]);
      setNewMessageText('');
    }
  };

  const progressSteps = [
    { id: 'submitted', label: 'Submitted', status: 'completed' as const },
    { 
      id: 'in-review', 
      label: 'In Review', 
      status: applicationStatus === 'submitted' ? 'pending' as const : 
              applicationStatus === 'in-review' ? 'current' as const : 
              applicationStatus === 'rejected' ? 'rejected' as const :
              'completed' as const 
    },
    { 
      id: 'approved', 
      label: applicationStatus === 'rejected' ? 'Rejected' : 'Approved', 
      status: applicationStatus === 'approved' ? 'current' as const : 
              applicationStatus === 'funded' ? 'completed' as const : 
              applicationStatus === 'rejected' ? 'rejected' as const :
              'pending' as const 
    },
    { 
      id: 'funded', 
      label: 'Funded', 
      status: applicationStatus === 'funded' ? 'current' as const : 'pending' as const 
    },
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
    setApplicationStatus('approved');
    console.log('Application approved - status updated to approved');
  };

  const handleReject = () => {
    setApplicationStatus('rejected');
    console.log('Application rejected - status updated to rejected');
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
                  ) : step.status === 'rejected' ? (
                    <div className="aspect-[1] object-contain w-6 self-center bg-red-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
                    step.status === 'current' ? 'text-green-600' : 
                    step.status === 'rejected' ? 'text-red-600' : 
                    'text-[#344054]'
                  }`}>
                    <div>{step.label}</div>
                  </div>
                </div>
                {index < progressSteps.length - 1 && (
                  <div className={`flex mr-[-120px] w-64 shrink-0 max-w-full h-0.5 mt-[11px] ${
                    step.status === 'completed' ? 'bg-green-600' : 
                    step.status === 'rejected' ? 'bg-red-600' : 
                    'bg-[#EAECF0]'
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
                    disabled={applicationStatus === 'approved' || applicationStatus === 'rejected'}
                    className={`justify-center items-center border shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] self-stretch flex gap-2 overflow-hidden my-auto px-[18px] py-2.5 rounded-lg border-solid transition-colors ${
                      applicationStatus === 'approved'
                        ? 'bg-green-600 text-white border-green-600 cursor-not-allowed'
                        : applicationStatus === 'rejected'
                        ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                        : 'bg-[#1A2340] text-[#FFF5E6] border-[#FFF5E6] hover:bg-[#2A3450] cursor-pointer'
                    }`}
                  >
                    <div className="self-stretch my-auto">
                      {applicationStatus === 'approved' ? 'Approved ✓' : 'Approve'}
                    </div>
                  </button>
                  <button 
                    onClick={handleReject}
                    disabled={applicationStatus === 'approved' || applicationStatus === 'rejected'}
                    className={`justify-center items-center border shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] self-stretch flex gap-2 overflow-hidden my-auto px-[18px] py-2.5 rounded-lg border-solid transition-colors ${
                      applicationStatus === 'rejected'
                        ? 'bg-red-600 text-white border-red-600 cursor-not-allowed'
                        : applicationStatus === 'approved'
                        ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                        : 'bg-red-100 text-red-600 border-[#F9F5FF] hover:bg-red-200 cursor-pointer'
                    }`}
                  >
                    <div className="self-stretch my-auto">
                      {applicationStatus === 'rejected' ? 'Rejected ✗' : 'Reject'}
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
              <div className="w-full mt-4 relative">
                {/* Scroll Ball Navigation */}
                <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 shadow-[0px_4px_60px_0px_rgba(0,0,0,0.1)]">
                    <div className="flex flex-col gap-6 items-center justify-center">
                      {relationshipSections.map((section) => (
                        <div
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className="flex gap-4 items-start justify-center w-full cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <div className="relative shrink-0 size-[24px]">
                            {section.icon}
                          </div>
                          <div className={`basis-0 font-['Inter'] grow leading-none min-h-px min-w-px not-italic text-[20px] ${
                            activeRelationshipSection === section.id 
                              ? 'font-semibold text-gray-900 opacity-100' 
                              : 'font-medium text-gray-900 opacity-30'
                          }`}>
                            <p className="leading-[24px]">{section.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Loan Purpose & Impact Summary */}
                <div id="loan-purpose" className="bg-slate-50 border border-slate-200 rounded-[20px] p-[30px] mb-6">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex flex-col gap-8 w-[615px]">
                      {/* Title */}
                      <div className="flex gap-2 items-center">
                        <div className="w-6 h-6">
                          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10,9 9,9 8,9"/>
                          </svg>
                        </div>
                        <h2 className="text-[20px] font-medium text-gray-900 leading-6">
                          Loan Purpose & Impact Summary
                        </h2>
                      </div>
                      
                      {/* Description */}
                      <p className="text-[16px] font-normal text-black leading-6">
                        The borrower plans to open a second retail location, expected to increase annual revenue by 30%. This project is projected to create 3 new jobs and retain 2 existing positions, serving a historically underserved neighborhood and expanding access to affordable groceries. The project aligns with the CDFI's strategic goal of supporting minority-owned businesses and local economic development.
                      </p>
                    </div>
                    
                    {/* Metrics Card */}
                    <div className="bg-white border border-[#eaecf0] rounded-lg p-5 w-[539px]">
                      <div className="flex gap-6 items-start">
                        <div className="flex flex-col gap-3 flex-1">
                          <div className="text-[#667085] text-[14px] font-medium leading-5">
                            Revenue Increase
                          </div>
                          <div className="text-green-600 text-[16px] font-medium leading-6">
                            30%
                          </div>
                        </div>
                        
                        <div className="w-[1px] h-14 bg-[#eaecf0]"></div>
                        
                        <div className="flex flex-col gap-3 flex-1">
                          <div className="text-[#667085] text-[14px] font-medium leading-5">
                            Total Jobs Impact
                          </div>
                          <div className="text-black text-[16px] font-medium leading-6">
                            5
                          </div>
                        </div>
                        
                        <div className="w-[1px] h-14 bg-[#eaecf0]"></div>
                        
                        <div className="flex flex-col gap-3 flex-1">
                          <div className="text-[#667085] text-[14px] font-medium leading-5">
                            New Location
                          </div>
                          <div className="text-black text-[16px] font-medium leading-6">
                            1
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Relationship History */}
                <div id="relationship-history" className="bg-white border border-[#eaecf0] rounded-lg p-[30px] mb-6">
                  {/* Title */}
                  <div className="flex gap-2 items-center mb-10">
                    <div className="w-6 h-6">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <h2 className="text-[20px] font-medium text-gray-900 leading-6">
                      Relationship History
                    </h2>
                  </div>

                  <div className="flex flex-col gap-6">
                    {/* Length of Relationship */}
                    <div className="flex flex-col gap-3 max-w-[203px]">
                      <div className="text-[#667085] text-[14px] font-medium leading-5">
                        Length of Relationship with CDFI
                      </div>
                      <div className="text-black text-[16px] font-medium leading-6">
                        Client since 2025 (2 years).
                      </div>
                    </div>

                    <div className="h-[1px] bg-[#eaecf0] w-full"></div>

                    {/* Past History */}
                    <div className="flex flex-col gap-3">
                      <div className="text-[#667085] text-[14px] font-medium leading-5">
                        Past History
                      </div>
                      <div className="text-black text-[16px] font-medium leading-6">
                        2 previous microloans of $5000 and $10000. 100% on-time payments across 2 prior loans and payments are complete
                      </div>
                    </div>

                    <div className="h-[1px] bg-[#eaecf0] w-full"></div>

                    {/* Technical Assistance Engagement */}
                    <div className="flex flex-col gap-3">
                      <div className="text-[#667085] text-[14px] font-medium leading-5">
                        Technical Assistance Engagement
                      </div>
                      <div className="text-black text-[16px] font-medium leading-6">
                        Attended 3 business planning sessions in the past year.
                      </div>
                    </div>

                    {/* Referral Source */}
                    <div className="flex flex-col gap-3">
                      <div className="text-[#667085] text-[14px] font-medium leading-5">
                        Referral Source
                      </div>
                      <div className="text-black text-[16px] font-medium leading-6">
                        Referred by Local Chamber of Commerce.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Community Impact */}
                <div id="community-impact" className="bg-slate-50 border border-[#eaecf0] rounded-lg p-[30px]">
                  {/* Title */}
                  <div className="flex gap-2 items-center mb-10">
                    <div className="w-6 h-6">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </div>
                    <h2 className="text-[20px] font-medium text-gray-900 leading-6">
                      Community Impact
                    </h2>
                  </div>

                  <div className="flex gap-10">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-6">
                      {/* Geographic Impact */}
                      <div className="flex flex-col gap-3">
                        <div className="text-[#667085] text-[14px] font-medium leading-5">
                          Geographic Impact
                        </div>
                        <div className="text-black text-[16px] font-medium leading-6">
                          Serving historically underserved neighborhood, expanding access to affordable groceries
                        </div>
                      </div>

                      <div className="h-[1px] bg-[#eaecf0] w-full"></div>

                      {/* Borrower Testimonial */}
                      <div className="flex flex-col gap-3">
                        <div className="text-[#667085] text-[14px] font-medium leading-5">
                          Borrower Testimonial
                        </div>
                        <div className="bg-white border border-[#eaecf0] rounded-lg p-5">
                          <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                              <div className="text-[#667085] text-[14px] font-medium leading-6">
                                "This CDFI has been instrumental in helping me grow my business. Their support goes beyond just financing - the business planning sessions helped me develop a solid expansion strategy. I'm excited to serve more families in our community with fresh, affordable groceries."
                              </div>
                              <div className="text-black text-[16px] font-medium leading-6">
                                Annabel
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 flex flex-col gap-8">
                      {/* Jobs Impact Card */}
                      <div className="bg-white border border-[#eaecf0] rounded-lg p-5">
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-3 max-w-[203px]">
                            <div className="text-[#667085] text-[14px] font-medium leading-5">
                              New Jobs
                            </div>
                            <div className="text-green-600 text-[16px] font-medium leading-6">
                              2
                            </div>
                          </div>

                          <div className="h-[1px] bg-[#eaecf0] w-full"></div>

                          <div className="flex flex-col gap-3 max-w-[203px]">
                            <div className="text-[#667085] text-[14px] font-medium leading-5">
                              Retained Jobs
                            </div>
                            <div className="text-black text-[16px] font-medium leading-6">
                              1
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Strategic Alignment */}
                      <div className="border border-[#eaecf0] rounded-[10px] p-6">
                        <div className="flex gap-3">
                          <div className="w-6 h-6 flex-shrink-0">
                            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="text-slate-950 text-[16px] font-medium leading-6">
                              Strategic Alignment
                            </div>
                            <div className="text-black text-[14px] font-normal leading-[1.6]">
                              Supports minority-owned businesses and local economic development goals
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'financial-stability' && (
              <div className="w-full mt-4">
                <h1 className="text-[24px] font-semibold text-[#101828] mb-6">Business & Personal Financial Stability</h1>
                
                {/* Loan Purpose & Impact Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-[20px] p-[30px] mb-6">
                  <div className="flex gap-2 items-center mb-4">
                    <div className="w-6 h-6">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </div>
                    <h2 className="text-[20px] font-medium text-gray-900">Loan Purpose & Impact Summary</h2>
                  </div>
                  <p className="text-[16px] font-normal text-black leading-6 mb-4">
                    The borrower operates from <span className="text-orange-500">commercial structure expansion selected at business revenues (REIT entity statement)</span>
                  </p>
                  <p className="text-green-600 text-[16px] font-medium">
                    Low income area throughout, within expected seasonal patterns.
                  </p>
                </div>

                {/* Point-of-Sale (POS) Data Analysis */}
                <div className="bg-white border border-[#eaecf0] rounded-lg p-[30px] mb-6">
                  <div className="flex gap-2 items-center mb-10">
                    <div className="w-6 h-6">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </div>
                    <h2 className="text-[20px] font-medium text-gray-900">Point-of-Sale (POS) Data Analysis</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-6 text-[14px]">
                    <div>
                      <div className="text-[#667085] font-medium mb-2">Customer profile trends & spending</div>
                      <div className="text-black font-medium">Consistent performance indicating strong customer base loyalty. Revenue sources are well distributed.</div>
                    </div>

                    <div>
                      <div className="text-[#667085] font-medium mb-2">Frequency and variety of features</div>
                      <div className="text-black font-medium">Customer churn trends, 5% with top returning visitors.</div>
                    </div>

                    <div>
                      <div className="text-[#667085] font-medium mb-2">Seasonality (processing consistency)</div>
                      <div className="text-black font-medium">2024 transaction volume averaging $20K/month vs. major disruptions.</div>
                    </div>
                  </div>
                </div>

                {/* Personal Financial Stability & Behavioral Insights */}
                <div className="bg-white border border-[#eaecf0] rounded-lg p-[30px] mb-6">
                  <div className="flex gap-2 items-center mb-10">
                    <div className="w-6 h-6">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <h2 className="text-[20px] font-medium text-gray-900">Personal Financial Stability & Behavioral Insights</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-6 text-[14px]">
                    <div>
                      <div className="text-[#667085] font-medium mb-2">Non-credit and income behavior</div>
                      <div className="text-black font-medium">Over the past two 30-60 days not consistent as from supporting ones are existing</div>
                    </div>

                    <div>
                      <div className="text-[#667085] font-medium mb-2">Debt allocation summary</div>
                      <div className="text-green-600 font-medium">Credit utilization trends 20% vs the expected ratios within those over the past 6 months</div>
                    </div>

                    <div>
                      <div className="text-[#667085] font-medium mb-2">No frequency of income sources</div>
                      <div className="text-black font-medium">Monthly annual revenue: $120,000 through four retailers and super-discount</div>
                    </div>

                    <div>
                      <div className="text-[#667085] font-medium mb-2">Earnings schedule/history</div>
                      <div className="text-black font-medium">14 years food industry experience, 6 years operating current business</div>
                    </div>

                    <div>
                      <div className="text-[#667085] font-medium mb-2">Non-performance judgments / risk items</div>
                      <div className="text-black font-medium">Account 1 left frequency</div>
                    </div>

                    <div>
                      <div className="text-black font-medium">No significant regulatory in the past 12 months, 2 minor expenses over the past 6 months</div>
                    </div>
                  </div>
                </div>

                {/* Business Financial Stability & Behavioral Insights */}
                <div className="bg-white border border-[#eaecf0] rounded-lg p-[30px] mb-6">
                  <div className="flex gap-2 items-center mb-10">
                    <div className="w-6 h-6">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                    <h2 className="text-[20px] font-medium text-gray-900">Business Financial Stability & Behavioral Insights</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <div className="text-[#667085] font-medium mb-2 text-[14px]">Current Revenue and Liquidity</div>
                        <div className="text-green-600 font-medium text-[16px]">Average 18 sequential net results so page ranges from 15k to between business revenues</div>
                      </div>

                      <div>
                        <div className="text-[#667085] font-medium mb-2 text-[14px]">Gross Margin %</div>
                        <div className="text-black font-medium text-[16px]">25%</div>
                      </div>

                      <div>
                        <div className="text-[#667085] font-medium mb-2 text-[14px]">Key business performance measure to the past year</div>
                      </div>

                      <div>
                        <div className="text-[#667085] font-medium mb-2 text-[14px]">Business Growth (%)</div>
                      </div>

                      <div>
                        <div className="text-[#667085] font-medium mb-2 text-[14px]">Net Income Margin (%)</div>
                        <div className="text-black font-medium text-[16px]">8%</div>
                      </div>

                      <div>
                        <div className="text-[#667085] font-medium mb-2 text-[14px]">Payments history</div>
                        <div className="text-black font-medium text-[16px]">Good throughout 95% tax compliance basis since over the last 24 months</div>
                      </div>

                      <div>
                        <div className="text-[#667085] font-medium mb-2 text-[14px]">Cashflow Seasonality</div>
                        <div className="text-black font-medium text-[16px]">20%</div>
                      </div>

                      <div>
                        <div className="text-[#667085] font-medium mb-2 text-[14px]">Inventory turnover</div>
                        <div className="text-green-600 font-medium text-[16px]">Average inventory value above peak performance, avoiding financial problems</div>
                      </div>
                    </div>

                    {/* Right Column - Key Metrics */}
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-[#667085] font-medium mb-2 text-[12px]">Debt to Income Ratio</div>
                        <div className="text-black font-bold text-[24px]">15%</div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-[#667085] font-medium mb-2 text-[12px]">Debt Service Coverage Ratio</div>
                        <div className="text-black font-bold text-[24px]">1.8x</div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-[#667085] font-medium mb-2 text-[12px]">Savings in Assets</div>
                        <div className="text-black font-bold text-[24px]">$45k</div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-[#667085] font-medium mb-2 text-[12px]">Current Ratio</div>
                        <div className="text-black font-bold text-[24px]">2.1</div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-[#667085] font-medium mb-2 text-[12px]">Business FICO</div>
                        <div className="text-black font-bold text-[24px]">78</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax Return Verification */}
                <div className="bg-white border border-[#eaecf0] rounded-lg p-[30px]">
                  <div className="flex gap-2 items-center mb-10">
                    <div className="w-6 h-6">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </div>
                    <h2 className="text-[20px] font-medium text-gray-900">Tax Return Verification</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-6 text-[14px]">
                    <div>
                      <div className="text-[#667085] font-medium mb-2">Files Returns</div>
                      <div className="text-green-600 font-medium">Yes (Scheduled tax returns for 2022 - Filed on time)</div>
                    </div>

                    <div>
                      <div className="text-[#667085] font-medium mb-2">Revenue stated</div>
                      <div className="text-black font-medium">Equivalent trends $115,000 tax down-trends $117,000; 1.5% variance goals</div>
                    </div>

                    <div>
                      <div className="text-[#667085] font-medium mb-2">Compliant</div>
                      <div className="text-black font-medium">Business and profit at all plans, and key filings 12%</div>
                    </div>

                    <div>
                      <div className="text-[#667085] font-medium mb-2">Business Structure/entity</div>
                      <div className="text-green-600 font-medium">Yes, significant business license, liquidity, or top and hardware business</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'documents' && (
              <div className="flex flex-col gap-4 items-start justify-start w-full">
                {/* Main Document Container - Exact Figma Implementation */}
                <div className="bg-white border border-[#d0d5dd] rounded-2xl p-7 w-full">
                  <div className="flex gap-6 items-start justify-start w-full">
                    <div className="basis-0 flex flex-col gap-6 grow items-start justify-start min-h-px min-w-px self-stretch">
                      <div className="bg-slate-50 border border-slate-200 rounded-[20px] p-[30px] w-full">
                        <div className="flex flex-col gap-6 items-start justify-start w-full">
                          <div className="flex flex-col gap-3 items-start justify-start max-w-[660px] w-full">
                            <div className="flex gap-2 items-center justify-start w-full">
                              <div className="relative shrink-0 size-[24px]">
                                <svg className="block max-w-none size-full" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" fill="none" />
                                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" />
                                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" />
                                </svg>
                              </div>
                              <div className="flex gap-1 items-start justify-start">
                                <div className="font-['Inter'] font-medium leading-none text-[20px] text-gray-900">
                                  <p className="leading-[24px] whitespace-pre">Submitted Documents</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3 items-start justify-start w-full">
                            {/* Income Statement */}
                            <div className="bg-white border border-slate-100 rounded-[10px] w-full">
                              <div className="flex gap-[10px] items-start justify-start overflow-clip p-5 w-full">
                                <div className="basis-0 flex flex-col gap-3 grow items-start justify-start min-h-px min-w-px">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex gap-1 items-start justify-start">
                                      <div className="font-['Inter'] font-medium leading-none text-[16px] text-slate-950">
                                        <p className="leading-[24px] whitespace-pre">Income Statement</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-3 items-center justify-start">
                                      <div className="flex items-start justify-start mix-blend-multiply">
                                        <div className="bg-[#ecfdf3] flex items-center justify-center px-2 py-0.5 rounded-2xl">
                                          <div className="font-['Inter'] font-medium leading-none text-[#027a48] text-[12px] text-center">
                                            <p className="leading-[18px] whitespace-pre">90% Confident</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="overflow-clip relative size-4">
                                        <div className="absolute inset-[12.5%]">
                                          <div className="absolute inset-[-6.25%]">
                                            <svg className="block max-w-none size-full" fill="none" stroke="#101828" strokeWidth="2" viewBox="0 0 24 24">
                                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                              <polyline points="7,10 12,15 17,10" />
                                              <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Cash Flow Statement */}
                            <div className="bg-white border border-slate-100 rounded-[10px] w-full">
                              <div className="flex gap-[10px] items-start justify-start overflow-clip p-5 w-full">
                                <div className="basis-0 flex flex-col gap-3 grow items-start justify-start min-h-px min-w-px">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex gap-1 items-start justify-start">
                                      <div className="font-['Inter'] font-medium leading-none text-[16px] text-slate-950">
                                        <p className="leading-[24px] whitespace-pre">Cash Flow Statement</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-3 items-center justify-start">
                                      <div className="flex items-start justify-start mix-blend-multiply">
                                        <div className="bg-[#ecfdf3] flex items-center justify-center px-2 py-0.5 rounded-2xl">
                                          <div className="font-['Inter'] font-medium leading-none text-[#027a48] text-[12px] text-center">
                                            <p className="leading-[18px] whitespace-pre">90% Confident</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="overflow-clip relative size-4">
                                        <div className="absolute inset-[12.5%]">
                                          <div className="absolute inset-[-6.25%]">
                                            <svg className="block max-w-none size-full" fill="none" stroke="#101828" strokeWidth="2" viewBox="0 0 24 24">
                                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                              <polyline points="7,10 12,15 17,10" />
                                              <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Personal Bank Statements */}
                            <div className="bg-white border border-slate-100 rounded-[10px] w-full">
                              <div className="flex gap-[10px] items-start justify-start overflow-clip p-5 w-full">
                                <div className="basis-0 flex flex-col gap-3 grow items-start justify-start min-h-px min-w-px">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex gap-1 items-start justify-start">
                                      <div className="font-['Inter'] font-medium leading-none text-[16px] text-slate-950">
                                        <p className="leading-[24px] whitespace-pre">Personal Bank Statements</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-3 items-center justify-start">
                                      <div className="flex items-start justify-start mix-blend-multiply">
                                        <div className="bg-[#fffaeb] flex items-center justify-center px-2 py-0.5 rounded-2xl">
                                          <div className="font-['Inter'] font-medium leading-none text-[#b54708] text-[12px] text-center">
                                            <p className="leading-[18px] whitespace-pre">78% confident</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="overflow-clip relative size-4">
                                        <div className="absolute inset-[12.5%]">
                                          <div className="absolute inset-[-6.25%]">
                                            <svg className="block max-w-none size-full" fill="none" stroke="#101828" strokeWidth="2" viewBox="0 0 24 24">
                                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                              <polyline points="7,10 12,15 17,10" />
                                              <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Tax Returns (3 years) */}
                            <div className="bg-white border border-slate-100 rounded-[10px] w-full">
                              <div className="flex gap-[10px] items-start justify-start overflow-clip p-5 w-full">
                                <div className="basis-0 flex flex-col gap-3 grow items-start justify-start min-h-px min-w-px">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex gap-1 items-start justify-start">
                                      <div className="font-['Inter'] font-medium leading-none text-[16px] text-slate-950">
                                        <p className="leading-[24px] whitespace-pre">Tax Returns (3 years)</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-3 items-center justify-start">
                                      <div className="flex items-start justify-start mix-blend-multiply">
                                        <div className="bg-[#fef3f2] flex items-center justify-center px-2 py-0.5 rounded-2xl">
                                          <div className="font-['Inter'] font-medium leading-none text-[#b42318] text-[12px] text-center">
                                            <p className="leading-[18px] whitespace-pre">44% confident</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="overflow-clip relative size-4">
                                        <div className="absolute inset-[12.5%]">
                                          <div className="absolute inset-[-6.25%]">
                                            <svg className="block max-w-none size-full" fill="none" stroke="#101828" strokeWidth="2" viewBox="0 0 24 24">
                                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                              <polyline points="7,10 12,15 17,10" />
                                              <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Credit Memo and Financial Spreads Cards */}
                <div className="flex gap-9 items-center justify-start w-full mt-6">
                  {/* Credit Memo Card */}
                  <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[12px] border border-slate-200 overflow-hidden">
                    <div className="flex items-start justify-between p-8 relative w-full min-h-[160px]">
                      <div className="flex flex-col gap-0.5 items-start justify-start relative w-[347px] z-10">
                        <div className="font-['Inter'] font-medium leading-none text-[16px] text-slate-950 w-full">
                          <p className="leading-[24px]">Credit Memo</p>
                        </div>
                      </div>
                      {/* Bank Cheque Illustration */}
                      <div className="absolute right-[-50px] top-[-20px] w-[276px] h-[276px] opacity-20">
                        <svg className="block max-w-none size-full" viewBox="0 0 276 276" fill="none">
                          <rect x="20" y="60" width="220" height="140" fill="#F1F5F9" rx="8" stroke="#CBD5E1" strokeWidth="2"/>
                          <rect x="30" y="80" width="180" height="6" fill="#CBD5E1" rx="3"/>
                          <rect x="30" y="95" width="140" height="6" fill="#CBD5E1" rx="3"/>
                          <rect x="30" y="110" width="100" height="6" fill="#CBD5E1" rx="3"/>
                          <rect x="30" y="140" width="60" height="12" fill="#10B981" rx="6"/>
                          <rect x="140" y="140" width="50" height="12" fill="#E2E8F0" rx="6"/>
                          <circle cx="200" cy="90" r="25" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2"/>
                          <text x="200" y="95" textAnchor="middle" className="text-xs fill-slate-500 font-medium">$</text>
                        </svg>
                      </div>
                      <div className="bg-white relative rounded-[8px] border border-[#eaecf0] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] z-10">
                        <div className="flex gap-2 items-center justify-center overflow-clip px-4 py-2.5 relative">
                          <div className="font-['Inter'] font-medium leading-none text-[#d0d5dd] text-[14px]">
                            <p className="leading-[20px] whitespace-pre">Coming Soon</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Financial Spreads Card */}
                  <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[12px] border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between p-8 relative w-full min-h-[160px]">
                      <div className="flex flex-col gap-0.5 items-start justify-start relative w-[353px] z-10">
                        <div className="font-['Inter'] font-medium leading-none text-[16px] text-slate-950 w-full">
                          <p className="leading-[24px]">Financial Spreads</p>
                        </div>
                      </div>
                      <div className="bg-white relative rounded-[8px] border border-[#eaecf0] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] z-10">
                        <div className="flex gap-2 items-center justify-center overflow-clip px-4 py-2.5 relative">
                          <div className="font-['Inter'] font-medium leading-none text-[#d0d5dd] text-[14px]">
                            <p className="leading-[20px] whitespace-pre">Coming Soon</p>
                          </div>
                        </div>
                      </div>
                      {/* Financial Spreadsheet Illustration */}
                      <div className="absolute right-[-30px] bottom-[-20px] w-[132px] h-[132px] opacity-25">
                        <svg className="block max-w-none size-full" viewBox="0 0 132 132" fill="none">
                          <rect x="10" y="20" width="112" height="92" fill="#F8FAFC" rx="4" stroke="#E2E8F0" strokeWidth="1"/>
                          {/* Spreadsheet grid */}
                          <line x1="10" y1="35" x2="122" y2="35" stroke="#E2E8F0" strokeWidth="1"/>
                          <line x1="10" y1="50" x2="122" y2="50" stroke="#E2E8F0" strokeWidth="1"/>
                          <line x1="10" y1="65" x2="122" y2="65" stroke="#E2E8F0" strokeWidth="1"/>
                          <line x1="10" y1="80" x2="122" y2="80" stroke="#E2E8F0" strokeWidth="1"/>
                          <line x1="10" y1="95" x2="122" y2="95" stroke="#E2E8F0" strokeWidth="1"/>
                          <line x1="35" y1="20" x2="35" y2="112" stroke="#E2E8F0" strokeWidth="1"/>
                          <line x1="60" y1="20" x2="60" y2="112" stroke="#E2E8F0" strokeWidth="1"/>
                          <line x1="85" y1="20" x2="85" y2="112" stroke="#E2E8F0" strokeWidth="1"/>
                          <line x1="110" y1="20" x2="110" y2="112" stroke="#E2E8F0" strokeWidth="1"/>
                          {/* Data cells */}
                          <rect x="15" y="25" width="15" height="8" fill="#10B981" opacity="0.7" rx="1"/>
                          <rect x="40" y="25" width="15" height="8" fill="#3B82F6" opacity="0.7" rx="1"/>
                          <rect x="65" y="25" width="15" height="8" fill="#F59E0B" opacity="0.7" rx="1"/>
                          <rect x="90" y="25" width="15" height="8" fill="#EF4444" opacity="0.7" rx="1"/>
                          <rect x="15" y="40" width="15" height="8" fill="#CBD5E1" opacity="0.7" rx="1"/>
                          <rect x="40" y="40" width="15" height="8" fill="#CBD5E1" opacity="0.7" rx="1"/>
                          <rect x="65" y="40" width="15" height="8" fill="#CBD5E1" opacity="0.7" rx="1"/>
                          <rect x="90" y="40" width="15" height="8" fill="#CBD5E1" opacity="0.7" rx="1"/>
                        </svg>
                      </div>
                    </div>
                  </div>
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
              <div className="flex flex-col h-full w-full">
                {messageSidebarTab === 'team-note' ? (
                  <>
                    {/* Team Notes List - Fixed Height with Scroll */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                      <div className="flex flex-col gap-3 p-1">
                        {teamNotes.map((note) => (
                          <div key={note.id} className="bg-white border border-[#eaecf0] rounded-lg p-5 flex-shrink-0">
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
                    </div>

                    {/* Add Note Form or Button - Fixed at Bottom */}
                    <div className="flex-shrink-0 mt-6 border-t border-[#eaecf0] pt-6">
                      {isAddingNote ? (
                        <div className="space-y-4">
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
                          className="w-full bg-[#1a2340] text-[#fff5e6] px-4 py-2.5 rounded-lg font-medium text-base shadow-sm border border-[#fff5e6]"
                        >
                          Add Note
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col h-full">
                    {/* Chat Messages */}
                    <div className="flex-1 flex flex-col gap-8 overflow-y-auto p-6">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex flex-col gap-2.5 ${message.sender === 'lender' ? 'items-end' : 'items-start'} w-full`}>
                          <div className={`flex gap-2 ${message.sender === 'lender' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                            {/* Avatar */}
                            <div className={`flex-shrink-0 size-[40px] rounded-full flex items-center justify-center ${
                              message.sender === 'lender' 
                                ? 'bg-[#bdbdbd]' 
                                : 'bg-gray-50'
                            }`}>
                              {message.sender === 'lender' ? (
                                <div className="size-[24px] flex items-center justify-center">
                                  <div className="size-[20px] bg-white rounded-full flex items-center justify-center">
                                    <div className="size-[16px]">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <span className="font-medium text-[16px] text-[#475467]">
                                  {message.avatar}
                                </span>
                              )}
                            </div>
                            
                            {/* Message Bubble */}
                            <div className="flex flex-col gap-1 max-w-[362px]">
                              <div className={`px-3.5 py-2 rounded-[10px] ${
                                message.sender === 'lender'
                                  ? 'bg-[#344054] text-white'
                                  : 'bg-[#f2f4f7] text-black'
                              }`}>
                                <p className={`text-[12px] font-normal leading-[20px] tracking-[0.14px]`}>
                                  {message.text}
                                </p>
                              </div>
                              <span className="text-[#333333] text-[10px] font-normal">
                                {message.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Message Input */}
                    <div className="border-t border-[#eaecf0] p-6">
                      <div className="flex gap-3">
                        <textarea
                          value={newMessageText}
                          onChange={(e) => setNewMessageText(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 p-3 border border-[#d0d5dd] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1a2340] focus:border-transparent text-sm"
                          rows={3}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessageText.trim()}
                          className="self-end bg-[#1a2340] text-[#fff5e6] px-4 py-2.5 rounded-lg font-medium text-base shadow-sm border border-[#fff5e6] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Send
                        </button>
                      </div>
                    </div>
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
