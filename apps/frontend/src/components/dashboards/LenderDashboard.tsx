import React, { useState } from 'react';
import { Button } from '../ui/button';
import { 
  Search, 
  BarChart2, 
  Layers3, 
  Users, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../ui/logo';
import type { ApplicationId } from '../../types/loanApplications';
import EnhancedApplicationDetail from './EnhancedApplicationDetail';
import LoanBuilderFlow from '../loan-builder/LoanBuilderFlow';
import SettingsPage from '../pages/SettingsPage';
import LoanProductsPage from '../pages/LoanProductsPage';
import type { LoanBuilderStep1Data } from '../loan-builder/LoanBuilderStep1';
import type { CreditBoxBuilderData } from '../loan-builder/CreditBoxBuilder';
import type { LoanProductConfigurationData } from '../loan-builder/LoanProductConfiguration';

interface LoanProduct {
  id: string;
  name: string;
  description: string;
  minAmount: string;
  maxAmount: string;
  baseInterest: string;
  termOptions: string[];
  status: 'active' | 'draft' | 'inactive';
  createdDate: string;
}

const LenderDashboard = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'loan-approvals' | 'users' | 'settings' | 'loan-products' | 'loan-builder'>('settings');
  const [selectedApplicationId, setSelectedApplicationId] = useState<ApplicationId | null>(null);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);

  const handleLoanProductCreated = (
    step1Data: LoanBuilderStep1Data,
    step2Data: CreditBoxBuilderData, 
    step3Data: LoanProductConfigurationData
  ) => {
    const newProduct: LoanProduct = {
      id: `LP-${Date.now()}`,
      name: step1Data.productName,
      description: step2Data.description,
      minAmount: step2Data.loanAmountMin,
      maxAmount: step2Data.loanAmountMax,
      baseInterest: step3Data.baseInterest,
      termOptions: step3Data.termOptions,
      status: 'active',
      createdDate: new Date().toLocaleDateString()
    };

    setLoanProducts(prev => [...prev, newProduct]);
    setActiveView('loan-products'); // Return to loan products page to see the created product
  };

  // Mock applications for loan approvals view
  const applications = [
    {
      id: 'LA-2024-001' as ApplicationId,
      borrower: 'Maria\'s Restaurant',
      amount: '$25,000',
      purpose: 'Equipment Purchase',
      status: 'under_review' as const,
      submittedDate: '2024-01-08'
    },
    {
      id: 'LA-2024-002' as ApplicationId,
      borrower: 'Green Tech Solutions',
      amount: '$50,000',
      purpose: 'Working Capital',
      status: 'pending_docs' as const,
      submittedDate: '2024-01-05'
    },
    {
      id: 'LA-2024-003' as ApplicationId,
      borrower: 'Community Daycare',
      amount: '$15,000',
      purpose: 'Facility Expansion',
      status: 'approved' as const,
      submittedDate: '2024-01-03'
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

  // If viewing application detail, show that
  if (selectedApplicationId) {
    return (
      <EnhancedApplicationDetail
        applicationId={selectedApplicationId}
        onBack={() => setSelectedApplicationId(null)}
      />
    );
  }

  // Settings Page - Entry point
  if (activeView === 'settings') {
    return (
      <SettingsPage 
        onNavigateToLoanProducts={() => setActiveView('loan-products')}
      />
    );
  }

  // Loan Products Page - With laptop illustration
  if (activeView === 'loan-products') {
    return (
      <LoanProductsPage 
        onNavigateToLoanBuilder={() => setActiveView('loan-builder')}
        onNavigateToSettings={() => setActiveView('settings')}
      />
    );
  }

  // If loan builder is active, show the loan builder flow
  if (activeView === 'loan-builder') {
    return (
      <LoanBuilderFlow 
        onComplete={handleLoanProductCreated}
        onExit={() => setActiveView('loan-products')}
      />
    );
  }

  return (
    <div className="bg-white flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-[275px] h-screen bg-white border-r border-[#eaecf0] flex flex-col">
        {/* Header with Logo */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-[5.12px]">
            <Logo />
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[16px] text-[#667085] placeholder-[#667085] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 flex-1">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[16px] font-medium ${
                activeView === 'dashboard' 
                  ? 'bg-[#eaecf0] text-[#101828]' 
                  : 'text-[#344054] hover:bg-gray-50'
              }`}
            >
              <BarChart2 className="w-6 h-6" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('loan-approvals')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[16px] font-medium ${
                activeView === 'loan-approvals' 
                  ? 'bg-[#eaecf0] text-[#101828]' 
                  : 'text-[#344054] hover:bg-gray-50'
              }`}
            >
              <Layers3 className="w-6 h-6" />
              Loan Approvals
            </button>
            <button
              onClick={() => setActiveView('users')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[16px] font-medium ${
                activeView === 'users' 
                  ? 'bg-[#eaecf0] text-[#101828]' 
                  : 'text-[#344054] hover:bg-gray-50'
              }`}
            >
              <Users className="w-6 h-6" />
              Users
            </button>
          </nav>
        </div>

        {/* Footer */}
        <div className="px-4 pb-8">
          {/* Settings */}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[16px] font-medium text-[#344054] hover:bg-gray-50 mb-6">
            <Settings className="w-6 h-6" />
            Settings
          </button>

          {/* User Profile */}
          <div className="border-t border-[#eaecf0] pt-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-[#f9fafb] rounded-full flex items-center justify-center">
                <div className="w-6 h-6 text-[#475467]">👤</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-[#344054] truncate">
                  {user?.name || 'Sarah Adigba'}
                </div>
                <div className="text-[14px] text-[#667085] truncate">
                  {user?.email || 'admin@withcaelo.a'}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-[#667085]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <>
            {/* Page Title */}
            <div className="px-8 py-6">
              <h1 className="text-[20px] font-medium text-[#020617]">Loan Configuration</h1>
            </div>

            {/* Hero Banner */}
            <div className="mx-8 mb-8">
              <div className="bg-[#fff5e6] rounded-[16px] p-8 border border-[#3c131f]/20 relative overflow-hidden">
                <div className="max-w-[370px]">
                  <h2 className="text-[32px] font-medium text-[#020617] leading-[1.1] tracking-[-0.96px] mb-[19px]">
                    Start by showing how Caelo gives CDFIs control over their lending logic
                  </h2>
                  <Button className="bg-[#1a2340] text-[#fff5e6] border border-[#fff5e6] hover:bg-[#1a2340]/90">
                    Create New Loan Product
                  </Button>
                </div>
                
                {/* Illustration */}
                <div className="absolute right-0 top-0 w-[600px] h-full pointer-events-none">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Simple illustration placeholder */}
                    <div className="w-80 h-60 bg-white/20 rounded-lg flex items-center justify-center">
                      <div className="text-6xl opacity-50">💼</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Products Section */}
            <div className="px-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[20px] font-medium text-[#020617]">Loan Products</h3>
                <Button 
                  className="bg-[#1a2340] text-[#fff5e6] border border-[#fff5e6] hover:bg-[#1a2340]/90"
                  onClick={() => setActiveView('loan-builder')}
                >
                  Create New Product
                </Button>
              </div>
              
              {loanProducts.length === 0 ? (
                <div className="bg-[#f2f4f7] border border-[#020617]/10 rounded-[12px] p-8 flex flex-col items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-4xl mb-4 opacity-30">📝</div>
                    <p className="text-[#667085] mb-6">No loan products created yet</p>
                    <p className="text-[#98a2b3] text-sm">Click "Create New Product" to get started</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {loanProducts.map((product) => (
                    <div key={product.id} className="bg-white border border-[#d0d5dd] rounded-[12px] p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-[#020617]">{product.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                          </div>
                          
                          <p className="text-[#667085] text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-[#98a2b3] block">Loan Range</span>
                              <span className="text-[#020617] font-medium">
                                ${product.minAmount} - ${product.maxAmount}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#98a2b3] block">Base Interest</span>
                              <span className="text-[#020617] font-medium">{product.baseInterest}%</span>
                            </div>
                            <div>
                              <span className="text-[#98a2b3] block">Terms</span>
                              <span className="text-[#020617] font-medium">
                                {product.termOptions.join(', ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#98a2b3] block">Created</span>
                              <span className="text-[#020617] font-medium">{product.createdDate}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Loan Approvals View */}
        {activeView === 'loan-approvals' && (
          <>
            <div className="px-8 py-6">
              <h1 className="text-[20px] font-medium text-[#020617]">Loan Approvals</h1>
            </div>
            
            <div className="px-8">
              <div className="bg-white border border-[#eaecf0] rounded-lg shadow-sm">
                <div className="p-6">
                  <h3 className="text-[18px] font-medium text-[#101828] mb-4">Applications Pending Review</h3>
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="p-4 border border-[#eaecf0] rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-[#101828]">{app.borrower}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                {app.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="text-sm text-[#667085]">
                              {app.amount} • {app.purpose} • Applied {app.submittedDate}
                            </div>
                          </div>
                          <Button
                            onClick={() => setSelectedApplicationId(app.id)}
                            className="bg-[#1a2340] text-white hover:bg-[#1a2340]/90"
                          >
                            Review Application
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users View */}
        {activeView === 'users' && (
          <>
            <div className="px-8 py-6">
              <h1 className="text-[20px] font-medium text-[#020617]">Users</h1>
            </div>
            
            <div className="px-8">
              <div className="bg-white border border-[#eaecf0] rounded-lg shadow-sm p-8 text-center">
                <div className="text-4xl mb-4 opacity-30">👥</div>
                <h3 className="text-[18px] font-medium text-[#101828] mb-2">User Management</h3>
                <p className="text-[#667085]">User management features coming soon</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LenderDashboard;