
import { api } from '../utils/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'analyst' | 'borrower';
    name: string;
    organization?: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'analyst' | 'borrower';
  name: string;
  organization?: string;
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Convert to form data format that the backend expects
      const formData = new URLSearchParams();
      formData.append('username', credentials.email); // Backend expects 'username' field
      formData.append('password', credentials.password);
      
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      // If the API is not available, throw a specific error
      if (error.code === 'ERR_NETWORK' || error.message?.includes('fetch')) {
        throw new Error('API_UNAVAILABLE');
      }
      throw error;
    }
  }

  static async getMe(): Promise<User> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // If the API is not available, throw a specific error
      if (error.code === 'ERR_NETWORK' || error.message?.includes('fetch')) {
        throw new Error('API_UNAVAILABLE');
      }
      throw error;
    }
  }

  static async logout(): Promise<void> {
    // For now, just clear local storage
    // In future, could call logout endpoint
    localStorage.removeItem('access_token');
    localStorage.removeItem('caelo-auth-storage');
  }
}
