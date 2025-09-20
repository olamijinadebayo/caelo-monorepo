
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiEnhanced from '../services/apiEnhanced';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'analyst' | 'loan_officer' | 'borrower';
  name: string;
  organization?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'analyst' | 'loan_officer' | 'borrower';
    organization?: string;
  }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Demo users for MVP (fallback when API is not available)
const demoUsers: Record<string, User> = {
  'admin@withcaelo.ai': {
    id: '1',
    email: 'admin@withcaelo.ai',
    role: 'admin',
    name: 'Admin User',
    organization: 'Caelo Inc.'
  },
  'sarah@withcaelo.ai': {
    id: '2',
    email: 'sarah@withcaelo.ai',
    role: 'admin',
    name: 'Sarah Chen',
    organization: 'Caelo Inc.'
  },
  'mike@cdfi.example.org': {
    id: '3',
    email: 'mike@cdfi.example.org',
    role: 'analyst',
    name: 'Mike Rodriguez',
    organization: 'Community Capital Partners'
  },
  'loan.officer@cdfi.example.org': {
    id: '4',
    email: 'loan.officer@cdfi.example.org',
    role: 'loan_officer',
    name: 'Caleb Mark',
    organization: 'Community Capital Partners'
  },
  'jessica@smallbiz.com': {
    id: '5',
    email: 'jessica@smallbiz.com',
    role: 'borrower',
    name: 'Jessica Williams',
    organization: 'Sunrise Bakery'
  }
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          console.log('🔐 Attempting login with enhanced API for:', email);
          
          // Try to login with enhanced API first
          const response = await apiEnhanced.login(email, password);
          console.log('✅ Enhanced API login successful for:', email, 'Role:', response.user.role);
          
          set({ 
            user: response.user, 
            token: response.access_token, 
            isLoading: false 
          });
          
        } catch (error) {
          console.log('❌ Enhanced API login failed, falling back to demo users', error);
          
          // Check if it's an API unavailability error or network error
          if (error.code === 'ERR_NETWORK' || 
              error.message?.includes('fetch') ||
              error.message?.includes('Network Error') ||
              error.response?.status >= 500) {
            
            // Fallback to demo authentication
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const user = demoUsers[email];
            if (user && password === 'demo123') {
              console.log('✅ Demo authentication successful for:', email);
              const token = `demo_token_${user.id}_${Date.now()}`;
              set({ user, token, isLoading: false });
              localStorage.setItem('access_token', token);
            } else {
              console.log('❌ Demo authentication failed for:', email);
              set({ isLoading: false });
              throw new Error('Invalid credentials');
            }
          } else {
            // For other errors (like 401 Unauthorized), just throw them
            set({ isLoading: false });
            throw error;
          }
        }
      },

      register: async (userData: {
        email: string;
        password: string;
        name: string;
        role: 'admin' | 'analyst' | 'loan_officer' | 'borrower';
        organization?: string;
      }) => {
        set({ isLoading: true });
        
        try {
          console.log('📝 Attempting registration with enhanced API for:', userData.email);
          
          // Try to register with enhanced API
          const response = await apiEnhanced.register(userData);
          console.log('✅ Enhanced API registration successful for:', userData.email, 'Role:', response.role);
          
          set({ isLoading: false });
          
          // Return success - don't auto-login, let user manually login
          
        } catch (error) {
          console.log('❌ Enhanced API registration failed:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        console.log('🚪 Logging out...');
        apiEnhanced.logout();
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
        if (!token) return;

        try {
          console.log('🔍 Checking authentication with enhanced API...');
          const user = await apiEnhanced.getCurrentUser();
          console.log('✅ Authentication check successful for:', user.email);
          set({ user, token });
        } catch (error) {
          console.log('❌ Authentication check failed:', error);
          
          // If API is unavailable, check if it's a demo token
          if (error.code === 'ERR_NETWORK' || 
              error.message?.includes('fetch') ||
              error.message?.includes('Network Error') ||
              error.response?.status >= 500) {
            
            // Check if it's a demo token
            if (token.startsWith('demo_token_')) {
              // Extract user info from demo token or use stored user
              const storedUser = get().user;
              if (storedUser) {
                console.log('✅ Using stored demo user:', storedUser.email);
                set({ user: storedUser, token });
                return;
              }
            }
          }
          
          // Token is invalid, clear auth state
          console.log('🧹 Clearing invalid auth state');
          get().logout();
        }
      }
    }),
    {
      name: 'caelo-auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
);
