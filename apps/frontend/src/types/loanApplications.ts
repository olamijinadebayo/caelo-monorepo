export interface LoanApplication {
  id: string;
  borrowerId: string;
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