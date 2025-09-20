import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Figma asset URLs
const imgEyeIcon = "http://localhost:3845/assets/47e4c009a33da2f51850446ab421c404ba884299.svg";
const imgCaeloIcon = "http://localhost:3845/assets/668d60eab65cf7eddb2c7c48c4910ad992800de8.svg";
const imgCaeloLogo = "http://localhost:3845/assets/c9b9232245e873a3eb623dc83305d97db14e84b0.svg";

interface LenderLoginProps {
  onSwitchToSignUp?: () => void;
}

const LenderLogin: React.FC<LenderLoginProps> = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState('mike@cdfi.example.org');
  const [password, setPassword] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  // Clear any existing auth state when login component mounts
  React.useEffect(() => {
    logout();
  }, [logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call login with email and password
      await login(email, password);
      
      // Navigate to home - Index.tsx will show the appropriate dashboard
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative">
      {/* Logo - Responsive positioning */}
      <div className="flex items-center gap-1.5 mb-8 md:mb-12">
        <div className="relative w-[35px] h-[35px]">
          <img 
            alt=""
            role="presentation"
            className="block w-full h-full object-contain" 
            src={imgCaeloIcon}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.parentElement!.style.display = 'none';
            }}
          />
        </div>
        <div className="relative h-9 w-[109px]">
          <img 
            alt=""
            role="presentation"
            className="block w-full h-full object-contain" 
            src={imgCaeloLogo}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.parentElement!.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Login Form Card - Responsive */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
          {/* Header Section */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-medium text-black tracking-tight leading-tight md:leading-[60px]">
              Welcome Back
            </h1>
            <p className="text-base text-[#525866] leading-6">
              Enter your email and password to continue
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="font-medium text-blue-900 mb-1">Demo Accounts:</p>
              <p className="text-blue-800">• mike@cdfi.example.org / demo123 (Analyst)</p>
              <p className="text-blue-800">• sarah@withcaelo.ai / demo123 (Admin)</p>
              <p className="text-blue-800">• jessica@smallbiz.com / demo123 (Borrower)</p>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054] tracking-tight">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085] font-normal
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340] focus:outline-none
                           transition-colors"
                  placeholder="mike@cdfi.example.org"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054] tracking-tight">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085] font-normal
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340] focus:outline-none
                           transition-colors"
                  placeholder="*******"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
                  <img 
                    alt=""
                    role="presentation"
                    className="block w-full h-full object-contain opacity-60" 
                    src={imgEyeIcon}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.parentElement!.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a2340] text-[#fff5e6] hover:bg-[#111629] 
                       border border-[#fff5e6] rounded-lg px-4 py-2.5 
                       text-base font-medium leading-6
                       shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {/* Switch to Sign Up */}
            {onSwitchToSignUp && (
              <div className="text-center">
                <p className="text-sm text-[#525866]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToSignUp}
                    className="text-[#1a2340] font-medium hover:underline"
                  >
                    Create account
                  </button>
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LenderLogin;
