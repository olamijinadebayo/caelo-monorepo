
// API Request/Response Types for FastAPI integration

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'analyst' | 'borrower';
  name: string;
  organization?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface APIError {
  detail: string;
  code?: string;
}

// Dashboard Data Types
export interface LoanMetrics {
  total_active_loans: number;
  total_loan_amount: number;
  average_loan_size: number;
  default_rate: number;
  monthly_originations: number;
}

export interface BorrowerProfile {
  id: string;
  name: string;
  business_name?: string;
  email: string;
  phone?: string;
  address?: string;
  loan_history: LoanSummary[];
}

export interface LoanSummary {
  id: string;
  amount: number;
  status: 'active' | 'paid' | 'default' | 'pending';
  origination_date: string;
  maturity_date: string;
  interest_rate: number;
}
