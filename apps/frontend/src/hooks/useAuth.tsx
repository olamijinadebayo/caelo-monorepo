
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '../services/auth';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'analyst' | 'borrower';
  name: string;
  organization?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Demo users for MVP (fallback when API is not available)
const demoUsers: Record<string, User> = {
  'sarah@withcaelo.ai': {
    id: '1',
    email: 'sarah@withcaelo.ai',
    role: 'admin',
    name: 'Sarah Chen',
    organization: 'Caelo Inc.'
  },
  'mike@cdfi.example.org': {
    id: '2',
    email: 'mike@cdfi.example.org',
    role: 'analyst',
    name: 'Mike Rodriguez',
    organization: 'Community Capital Partners'
  },
  'jessica@smallbiz.com': {
    id: '3',
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
          // Try to login with API first
          const response = await AuthService.login({ email, password });
          const token = response.access_token;
          
          set({ 
            user: response.user, 
            token, 
            isLoading: false 
          });
          
          // Store token for API requests
          localStorage.setItem('access_token', token);
          
        } catch (error) {
          console.log('API login failed, falling back to demo users', error);
          
          // Check if it's an API unavailability error or network error
          if (error.message === 'API_UNAVAILABLE' || 
              error.code === 'ERR_NETWORK' || 
              error.message?.includes('fetch') ||
              error.message?.includes('Network Error')) {
            
            // Fallback to demo authentication
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const user = demoUsers[email];
            if (user && password === 'demo123') {
              console.log('Demo authentication successful for:', email);
              const token = `demo_token_${user.id}_${Date.now()}`;
              set({ user, token, isLoading: false });
              localStorage.setItem('access_token', token);
            } else {
              console.log('Demo authentication failed for:', email, 'Password:', password);
              set({ isLoading: false });
              throw new Error('Invalid credentials');
            }
          } else {
            // For other errors, just throw them
            set({ isLoading: false });
            throw error;
          }
        }
      },
      
      logout: () => {
        AuthService.logout();
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        try {
          const user = await AuthService.getMe();
          set({ user, token });
        } catch (error) {
          // If API is unavailable, check if it's a demo token
          if (error.message === 'API_UNAVAILABLE' || 
              error.code === 'ERR_NETWORK' || 
              error.message?.includes('fetch')) {
            
            // Check if it's a demo token
            if (token.startsWith('demo_token_')) {
              // Extract user info from demo token or use stored user
              const storedUser = get().user;
              if (storedUser) {
                set({ user: storedUser, token });
                return;
              }
            }
          }
          
          // Token is invalid, clear auth state
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
