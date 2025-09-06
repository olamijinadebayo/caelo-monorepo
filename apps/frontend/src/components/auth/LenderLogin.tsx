import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Logo } from '../ui/logo';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LenderLogin = () => {
  const [email, setEmail] = useState('user@withcaelo.ai');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login for lender user
      await login({
        email,
        password,
        role: 'analyst', // Using analyst role as the main lender role
        name: 'Sarah Adigba',
        organization: 'Community Capital Partners'
      });
      
      // Navigate to lender dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {/* Logo */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        <Logo />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-12 relative">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-5xl font-medium text-black tracking-tight leading-[60px]">
              Welcome Back
            </h1>
            <p className="text-base text-[#525866] leading-6">
              Enter your email and password to continue
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-[#344054] tracking-tight">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085]
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                  placeholder="user@withcaelo.ai"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-[#344054] tracking-tight">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085]
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                  placeholder="*******"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#98a2b3] hover:text-[#667085]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a2340] text-[#fff5e6] hover:bg-[#111629] 
                       border border-[#fff5e6] rounded-lg px-4 py-2.5 
                       text-base font-medium leading-6
                       shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LenderLogin;
