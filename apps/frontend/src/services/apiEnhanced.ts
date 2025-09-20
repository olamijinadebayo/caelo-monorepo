/**
 * Enhanced API Service for Caelo Frontend
 * 
 * Comprehensive service layer for all backend API interactions including:
 * - Authentication with JWT
 * - CRUD operations for loan applications
 * - User management
 * - Team notes and messaging
 * - Dashboard analytics
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';

// ===== TYPES & INTERFACES =====

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'loan_officer' | 'borrower';
  organization?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

interface LoanApplication {
  id: string;
  business_name: string;
  business_type: string;
  loan_amount: number;
  loan_purpose: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  borrower_id: string;
  loan_officer_id?: string;
  underwriter_id?: string;
  risk_score?: number;
  recommendation?: 'approve' | 'reject' | 'review_required';
  recommendation_summary?: string;
  analyst_notes?: string;
  application_date: string;
  decision_date?: string;
  created_at: string;
  updated_at?: string;
  borrower: User;
  loan_officer?: User;
  underwriter?: User;
  transactions: Transaction[];
  team_notes: TeamNote[];
  messages: Message[];
}

interface Transaction {
  id: string;
  application_id: string;
  transaction_date: string;
  type: 'inflow' | 'outflow';
  category: string;
  description: string;
  amount: number;
  anomaly_score?: number;
  is_anomaly: boolean;
  anomaly_explanation?: string;
  source_account?: string;
  reference_number?: string;
  created_at: string;
  updated_at?: string;
}

interface TeamNote {
  id: string;
  application_id: string;
  author_id: string;
  content: string;
  is_private: boolean;
  created_at: string;
  updated_at?: string;
  author: User;
}

interface Message {
  id: string;
  application_id: string;
  sender_id: string;
  content: string;
  is_from_lender: boolean;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  sender: User;
}

interface DashboardStats {
  total_applications: number;
  pending_applications: number;
  approved_applications: number;
  rejected_applications: number;
  under_review_applications: number;
  total_loan_amount: number;
  avg_processing_time_days?: number;
  approval_rate?: number;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface ApiError {
  error: string;
  details?: string;
  timestamp: string;
}

// ===== API CLIENT CLASS =====

class ApiEnhanced {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  // ===== TOKEN MANAGEMENT =====

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private clearAuthToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // ===== AUTHENTICATION ENDPOINTS =====

  async login(email: string, password: string): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await this.client.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    this.setAuthToken(response.data.access_token);
    this.setUser(response.data.user);
    return response.data;
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    organization?: string;
  }): Promise<User> {
    const response = await this.client.post<User>('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    this.setUser(response.data);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      this.clearAuthToken();
    }
  }

  // ===== LOAN APPLICATION ENDPOINTS =====

  async createLoanApplication(applicationData: {
    business_name: string;
    business_type: string;
    loan_amount: number;
    loan_purpose: string;
  }): Promise<LoanApplication> {
    const response = await this.client.post<LoanApplication>('/applications', applicationData);
    return response.data;
  }

  async getLoanApplications(params?: {
    status?: string;
    priority?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<LoanApplication>> {
    const response = await this.client.get('/applications', { params });
    return response.data;
  }

  async getLoanApplication(id: string): Promise<LoanApplication> {
    const response = await this.client.get<LoanApplication>(`/applications/${id}`);
    return response.data;
  }

  async updateLoanApplication(
    id: string,
    updateData: Partial<LoanApplication>
  ): Promise<LoanApplication> {
    const response = await this.client.put<LoanApplication>(`/applications/${id}`, updateData);
    return response.data;
  }

  async deleteLoanApplication(id: string): Promise<void> {
    await this.client.delete(`/applications/${id}`);
  }

  // ===== TRANSACTION ENDPOINTS =====

  async addTransaction(
    applicationId: string,
    transactionData: {
      transaction_date: string;
      type: 'inflow' | 'outflow';
      category: string;
      description: string;
      amount: number;
      source_account?: string;
      reference_number?: string;
    }
  ): Promise<Transaction> {
    const response = await this.client.post<Transaction>(
      `/applications/${applicationId}/transactions`,
      { ...transactionData, application_id: applicationId }
    );
    return response.data;
  }

  async getApplicationTransactions(applicationId: string): Promise<Transaction[]> {
    const response = await this.client.get<Transaction[]>(`/applications/${applicationId}/transactions`);
    return response.data;
  }

  // ===== TEAM NOTES ENDPOINTS =====

  async addTeamNote(
    applicationId: string,
    noteData: {
      content: string;
      is_private?: boolean;
    }
  ): Promise<TeamNote> {
    const response = await this.client.post<TeamNote>(
      `/applications/${applicationId}/notes`,
      { ...noteData, application_id: applicationId }
    );
    return response.data;
  }

  async getApplicationTeamNotes(applicationId: string): Promise<TeamNote[]> {
    const response = await this.client.get<TeamNote[]>(`/applications/${applicationId}/notes`);
    return response.data;
  }

  // ===== MESSAGING ENDPOINTS =====

  async sendMessage(
    applicationId: string,
    messageData: {
      content: string;
    }
  ): Promise<Message> {
    const response = await this.client.post<Message>(
      `/applications/${applicationId}/messages`,
      { ...messageData, application_id: applicationId }
    );
    return response.data;
  }

  async getApplicationMessages(applicationId: string): Promise<Message[]> {
    const response = await this.client.get<Message[]>(`/applications/${applicationId}/messages`);
    return response.data;
  }

  async markMessageAsRead(messageId: string): Promise<Message> {
    const response = await this.client.put<Message>(`/messages/${messageId}/read`);
    return response.data;
  }

  // ===== USER MANAGEMENT ENDPOINTS =====

  async getUsers(params?: {
    role?: string;
    active_only?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<User[]> {
    const response = await this.client.get<User[]>('/users', { params });
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.client.get<User>(`/users/${id}`);
    return response.data;
  }

  // ===== DASHBOARD ENDPOINTS =====

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.client.get<DashboardStats>('/dashboard/stats');
    return response.data;
  }

  // ===== UTILITY ENDPOINTS =====

  async healthCheck(): Promise<{ status: string; timestamp: string; database: string; version: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }

  // ===== TEST METHODS =====

  async testApiConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  async testAuthentication(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      console.error('Authentication test failed:', error);
      return false;
    }
  }

  // ===== ERROR HANDLING HELPERS =====

  private handleApiError(error: any): ApiError {
    if (error.response) {
      return {
        error: error.response.data?.error || 'API Error',
        details: error.response.data?.details || error.message,
        timestamp: new Date().toISOString(),
      };
    } else if (error.request) {
      return {
        error: 'Network Error',
        details: 'Unable to connect to the server',
        timestamp: new Date().toISOString(),
      };
    } else {
      return {
        error: 'Unknown Error',
        details: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ===== DEBUGGING HELPERS =====

  getApiStatus(): {
    baseURL: string;
    authenticated: boolean;
    user: User | null;
    token: string | null;
  } {
    return {
      baseURL: this.baseURL,
      authenticated: this.isAuthenticated(),
      user: this.getUser(),
      token: this.getAuthToken(),
    };
  }
}

// ===== EXPORT SINGLETON INSTANCE =====

export const apiEnhanced = new ApiEnhanced();
export default apiEnhanced;

// Export types for use in components
export type {
  User,
  AuthResponse,
  LoanApplication,
  Transaction,
  TeamNote,
  Message,
  DashboardStats,
  PaginatedResponse,
  ApiError,
};
