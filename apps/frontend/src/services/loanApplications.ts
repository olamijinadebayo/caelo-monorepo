import { LoanApplication, ApplicationFilter, ApplicationInsight } from '../types/loanApplications';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock data for development
const mockApplications: LoanApplication[] = [
  {
    id: '1',
    borrowerId: 'borrower-1',
    borrowerName: 'John Smith',
    businessName: 'Smith & Co. Restaurant',
    businessType: 'Restaurant',
    loanAmount: 150000,
    loanPurpose: 'Equipment purchase and working capital',
    applicationDate: '2024-01-15T10:30:00Z',
    status: 'pending',
    priority: 'high',
    riskScore: 72,
    recommendation: null,
    analystNotes: '',
    businessMetrics: {
      revenue: 850000,
      profitMargin: 0.15,
      cashFlow: 125000,
      debtToEquity: 0.3,
      creditScore: 720,
      businessAge: 5,
      employeeCount: 12,
      industryRisk: 'medium'
    },
    documents: [
      {
        id: 'doc-1',
        name: '2023 Financial Statement',
        type: 'financial_statement',
        url: '/documents/financial-2023.pdf',
        uploadedAt: '2024-01-15T09:00:00Z'
      },
      {
        id: 'doc-2',
        name: 'Business Plan',
        type: 'business_plan',
        url: '/documents/business-plan.pdf',
        uploadedAt: '2024-01-15T09:15:00Z'
      }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    borrowerId: 'borrower-2',
    borrowerName: 'Sarah Johnson',
    businessName: 'TechStart Solutions',
    businessType: 'Professional Services',
    loanAmount: 250000,
    loanPurpose: 'Expansion and hiring',
    applicationDate: '2024-01-14T14:20:00Z',
    status: 'under_review',
    priority: 'medium',
    riskScore: 85,
    recommendation: 'approve',
    analystNotes: 'Strong financials and growth potential. Recommend approval with standard terms.',
    businessMetrics: {
      revenue: 1200000,
      profitMargin: 0.25,
      cashFlow: 300000,
      debtToEquity: 0.1,
      creditScore: 780,
      businessAge: 3,
      employeeCount: 8,
      industryRisk: 'low'
    },
    documents: [
      {
        id: 'doc-3',
        name: '2023 Tax Return',
        type: 'tax_return',
        url: '/documents/tax-2023.pdf',
        uploadedAt: '2024-01-14T13:00:00Z'
      }
    ],
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: '3',
    borrowerId: 'borrower-3',
    borrowerName: 'Mike Chen',
    businessName: 'Chen Construction LLC',
    businessType: 'Construction',
    loanAmount: 500000,
    loanPurpose: 'Large project financing',
    applicationDate: '2024-01-13T16:45:00Z',
    status: 'pending',
    priority: 'urgent',
    riskScore: 45,
    recommendation: 'review_required',
    analystNotes: 'High loan amount with moderate risk score. Need additional documentation.',
    businessMetrics: {
      revenue: 2500000,
      profitMargin: 0.08,
      cashFlow: 200000,
      debtToEquity: 0.6,
      creditScore: 650,
      businessAge: 8,
      employeeCount: 25,
      industryRisk: 'high'
    },
    documents: [
      {
        id: 'doc-4',
        name: 'Bank Statements (Last 6 months)',
        type: 'bank_statement',
        url: '/documents/bank-statements.pdf',
        uploadedAt: '2024-01-13T15:30:00Z'
      }
    ],
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-13T16:45:00Z'
  },
  {
    id: '4',
    borrowerId: 'borrower-4',
    borrowerName: 'Lisa Rodriguez',
    businessName: 'Rodriguez Retail',
    businessType: 'Retail',
    loanAmount: 75000,
    loanPurpose: 'Inventory purchase',
    applicationDate: '2024-01-12T11:15:00Z',
    status: 'approved',
    priority: 'low',
    riskScore: 90,
    recommendation: 'approve',
    analystNotes: 'Excellent credit history and stable business. Approved with favorable terms.',
    businessMetrics: {
      revenue: 600000,
      profitMargin: 0.18,
      cashFlow: 108000,
      debtToEquity: 0.2,
      creditScore: 820,
      businessAge: 6,
      employeeCount: 5,
      industryRisk: 'medium'
    },
    documents: [
      {
        id: 'doc-5',
        name: 'Financial Statements (2022-2023)',
        type: 'financial_statement',
        url: '/documents/financial-2022-2023.pdf',
        uploadedAt: '2024-01-12T10:00:00Z'
      }
    ],
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-14T09:30:00Z'
  },
  {
    id: '5',
    borrowerId: 'borrower-5',
    borrowerName: 'David Wilson',
    businessName: 'Wilson Manufacturing',
    businessType: 'Manufacturing',
    loanAmount: 300000,
    loanPurpose: 'Equipment upgrade',
    applicationDate: '2024-01-11T13:30:00Z',
    status: 'rejected',
    priority: 'medium',
    riskScore: 35,
    recommendation: 'reject',
    analystNotes: 'Poor cash flow and high debt ratio. Business model needs improvement.',
    businessMetrics: {
      revenue: 1800000,
      profitMargin: 0.05,
      cashFlow: 90000,
      debtToEquity: 0.8,
      creditScore: 580,
      businessAge: 10,
      employeeCount: 15,
      industryRisk: 'medium'
    },
    documents: [
      {
        id: 'doc-6',
        name: 'Equipment Quotes',
        type: 'other',
        url: '/documents/equipment-quotes.pdf',
        uploadedAt: '2024-01-11T12:00:00Z'
      }
    ],
    createdAt: '2024-01-11T13:30:00Z',
    updatedAt: '2024-01-13T14:20:00Z'
  }
];

const mockInsights: ApplicationInsight[] = [
  {
    id: 'insight-1',
    applicationId: '1',
    type: 'risk_analysis',
    title: 'Strong Revenue Growth',
    description: 'Business shows 15% year-over-year revenue growth with consistent profit margins.',
    severity: 'low',
    category: 'financial_performance',
    createdAt: '2024-01-15T10:35:00Z'
  },
  {
    id: 'insight-2',
    applicationId: '1',
    type: 'performance_metric',
    title: 'Industry Benchmark Comparison',
    description: 'Profit margin of 15% exceeds industry average of 8% for restaurants.',
    severity: 'low',
    category: 'industry_analysis',
    createdAt: '2024-01-15T10:36:00Z'
  },
  {
    id: 'insight-3',
    applicationId: '2',
    type: 'recommendation',
    title: 'High Growth Potential',
    description: 'Tech sector business with strong fundamentals and low debt ratio.',
    severity: 'low',
    category: 'growth_potential',
    createdAt: '2024-01-15T11:05:00Z'
  },
  {
    id: 'insight-4',
    applicationId: '3',
    type: 'risk_analysis',
    title: 'High Debt Ratio Concern',
    description: 'Debt-to-equity ratio of 0.6 is above recommended threshold for construction industry.',
    severity: 'high',
    category: 'financial_risk',
    createdAt: '2024-01-15T11:10:00Z'
  }
];

class LoanApplicationService {
  private getStorageKey(key: string): string {
    return `loan_applications_${key}`;
  }

  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('API request failed, falling back to localStorage:', error);
      throw error;
    }
  }

  async getLoanApplications(filter?: ApplicationFilter): Promise<LoanApplication[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filter) {
        if (filter.status) queryParams.append('status', filter.status.join(','));
        if (filter.priority) queryParams.append('priority', filter.priority.join(','));
        if (filter.businessType) queryParams.append('business_type', filter.businessType.join(','));
        if (filter.dateRange) {
          queryParams.append('start_date', filter.dateRange.start);
          queryParams.append('end_date', filter.dateRange.end);
        }
        if (filter.riskScore) {
          queryParams.append('min_risk_score', filter.riskScore.min.toString());
          queryParams.append('max_risk_score', filter.riskScore.max.toString());
        }
      }

      const endpoint = `/loan-applications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      return await this.makeApiRequest(endpoint);
    } catch (error) {
      // Fallback to localStorage
      const stored = localStorage.getItem(this.getStorageKey('applications'));
      if (stored) {
        const applications = JSON.parse(stored) as LoanApplication[];
        return this.filterApplications(applications, filter);
      }
      
      // Return mock data if nothing in localStorage
      return this.filterApplications(mockApplications, filter);
    }
  }

  private filterApplications(applications: LoanApplication[], filter?: ApplicationFilter): LoanApplication[] {
    if (!filter) return applications;

    return applications.filter(app => {
      if (filter.status && filter.status.length > 0 && !filter.status.includes(app.status)) {
        return false;
      }
      if (filter.priority && filter.priority.length > 0 && !filter.priority.includes(app.priority)) {
        return false;
      }
      if (filter.businessType && filter.businessType.length > 0 && !filter.businessType.includes(app.businessType)) {
        return false;
      }
      if (filter.riskScore) {
        if (app.riskScore < filter.riskScore.min || app.riskScore > filter.riskScore.max) {
          return false;
        }
      }
      if (filter.dateRange) {
        const appDate = new Date(app.applicationDate);
        const startDate = new Date(filter.dateRange.start);
        const endDate = new Date(filter.dateRange.end);
        if (appDate < startDate || appDate > endDate) {
          return false;
        }
      }
      return true;
    });
  }

  async getLoanApplication(id: string): Promise<LoanApplication> {
    try {
      return await this.makeApiRequest(`/loan-applications/${id}`);
    } catch (error) {
      // Fallback to localStorage
      const stored = localStorage.getItem(this.getStorageKey('applications'));
      if (stored) {
        const applications = JSON.parse(stored) as LoanApplication[];
        const application = applications.find(app => app.id === id);
        if (application) return application;
      }
      
      // Return mock data
      const application = mockApplications.find(app => app.id === id);
      if (application) return application;
      
      throw new Error('Application not found');
    }
  }

  async updateApplicationRecommendation(id: string, recommendation: 'approve' | 'reject' | 'review_required', notes?: string): Promise<LoanApplication> {
    try {
      return await this.makeApiRequest(`/loan-applications/${id}/recommendation`, {
        method: 'PUT',
        body: JSON.stringify({ recommendation, notes }),
      });
    } catch (error) {
      // Fallback to localStorage
      const stored = localStorage.getItem(this.getStorageKey('applications'));
      const applications = stored ? JSON.parse(stored) as LoanApplication[] : [...mockApplications];
      
      const applicationIndex = applications.findIndex(app => app.id === id);
      if (applicationIndex === -1) {
        throw new Error('Application not found');
      }

      const updatedApplication = {
        ...applications[applicationIndex],
        recommendation,
        analystNotes: notes || applications[applicationIndex].analystNotes,
        updatedAt: new Date().toISOString(),
      };

      applications[applicationIndex] = updatedApplication;
      localStorage.setItem(this.getStorageKey('applications'), JSON.stringify(applications));
      
      return updatedApplication;
    }
  }

  async getApplicationInsights(applicationId: string): Promise<ApplicationInsight[]> {
    try {
      return await this.makeApiRequest(`/loan-applications/${applicationId}/insights`);
    } catch (error) {
      // Fallback to localStorage
      const stored = localStorage.getItem(this.getStorageKey('insights'));
      if (stored) {
        const insights = JSON.parse(stored) as ApplicationInsight[];
        return insights.filter(insight => insight.applicationId === applicationId);
      }
      
      // Return mock insights
      return mockInsights.filter(insight => insight.applicationId === applicationId);
    }
  }

  async updateApplicationStatus(id: string, status: 'pending' | 'approved' | 'rejected' | 'under_review'): Promise<LoanApplication> {
    try {
      return await this.makeApiRequest(`/loan-applications/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      // Fallback to localStorage
      const stored = localStorage.getItem(this.getStorageKey('applications'));
      const applications = stored ? JSON.parse(stored) as LoanApplication[] : [...mockApplications];
      
      const applicationIndex = applications.findIndex(app => app.id === id);
      if (applicationIndex === -1) {
        throw new Error('Application not found');
      }

      const updatedApplication = {
        ...applications[applicationIndex],
        status,
        updatedAt: new Date().toISOString(),
      };

      applications[applicationIndex] = updatedApplication;
      localStorage.setItem(this.getStorageKey('applications'), JSON.stringify(applications));
      
      return updatedApplication;
    }
  }

  // Initialize demo data in localStorage if empty
  initializeDemoData(): void {
    const stored = localStorage.getItem(this.getStorageKey('applications'));
    if (!stored) {
      localStorage.setItem(this.getStorageKey('applications'), JSON.stringify(mockApplications));
    }
    
    const storedInsights = localStorage.getItem(this.getStorageKey('insights'));
    if (!storedInsights) {
      localStorage.setItem(this.getStorageKey('insights'), JSON.stringify(mockInsights));
    }
  }
}

export const loanApplicationService = new LoanApplicationService();

// Initialize demo data when the service is imported
if (typeof window !== 'undefined') {
  loanApplicationService.initializeDemoData();
} 