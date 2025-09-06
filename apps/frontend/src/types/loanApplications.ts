// Branded types for type safety
type Brand<T, K> = T & { readonly __brand: K };

export type ApplicationId = Brand<string, 'ApplicationId'>;
export type BorrowerId = Brand<string, 'BorrowerId'>;
export type LoanOfficerId = Brand<string, 'LoanOfficerId'>;
export type UnderwriterId = Brand<string, 'UnderwriterId'>;

export interface LoanApplication {
  id: ApplicationId;
  borrowerId: BorrowerId;
  borrowerName: string;
  businessName: string;
  businessType: string;
  loanAmount: number;
  loanPurpose: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  riskScore: number;
  recommendation: 'approve' | 'reject' | 'review_required' | null;
  analystNotes: string;
  businessMetrics: BusinessMetrics;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
  // Enhanced fields for comprehensive analysis
  loanOfficer?: string;
  loanOfficerId?: LoanOfficerId;
  underwriter?: string;
  underwriterId?: UnderwriterId;
  financialStability?: FinancialStabilityAnalysis;
  businessAnalysis?: BusinessAnalysis;
  personalAnalysis?: PersonalAnalysis;
  posAnalysis?: POSAnalysis;
  taxReturnAnalysis?: TaxReturnAnalysis;
  recommendation_summary?: string;
}

export interface BusinessMetrics {
  revenue: number;
  profitMargin: number;
  cashFlow: number;
  debtToEquity: number;
  creditScore: number;
  businessAge: number;
  employeeCount: number;
  industryRisk: 'low' | 'medium' | 'high';
}

export interface Document {
  id: string;
  name: string;
  type: 'financial_statement' | 'tax_return' | 'business_plan' | 'bank_statement' | 'other';
  url: string;
  uploadedAt: string;
}

export interface ApplicationInsight {
  id: string;
  applicationId: string;
  type: 'risk_analysis' | 'performance_metric' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
}

export interface ApplicationFilter {
  status?: string[];
  priority?: string[];
  businessType?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  riskScore?: {
    min: number;
    max: number;
  };
}

// Enhanced Analysis Interfaces
export interface FinancialStabilityAnalysis {
  personalFundMingling: AnalysisMetric;
  frequencyVolume: AnalysisMetric;
}

export interface BusinessAnalysis {
  depositFrequency: AnalysisMetric;
  grossMargin: AnalysisMetric;
  netIncomeMargin: AnalysisMetric;
  paymentHistory: AnalysisMetric;
  overdraftFrequency: AnalysisMetric;
  recoverySignals: AnalysisMetric;
  openJudgements: AnalysisMetric;
  debtToIncome: number;
  debtServiceCoverage: number;
  currentRatio: number;
  globalDebtService: number;
  returnOnEquity: number;
  returnOnAssets: number;
}

export interface PersonalAnalysis {
  debtLevels: AnalysisMetric;
  creditUtilization: AnalysisMetric;
  incomeVerification: AnalysisMetric;
  businessExperience: AnalysisMetric;
  openBankruptcies: AnalysisMetric;
  overdraftNSF: AnalysisMetric;
}

export interface POSAnalysis {
  customerHealth: AnalysisMetric;
  disputeFrequency: AnalysisMetric;
  transactionConsistency: AnalysisMetric;
}

export interface TaxReturnAnalysis {
  filingHistory: AnalysisMetric;
  revenueMatch: AnalysisMetric;
  profitability: AnalysisMetric;
  businessStructure: AnalysisMetric;
  riskFlags: AnalysisMetric;
}

export interface AnalysisMetric {
  label: string;
  status: 'positive' | 'warning' | 'negative';
  description: string;
}

export type AnalysisTab = 
  | 'financials' 
  | 'cash_flow' 
  | 'financial_stability' 
  | 'relationship'; 