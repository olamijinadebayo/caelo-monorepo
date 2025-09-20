import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Figma asset URLs
const imgEyeIcon = "http://localhost:3845/assets/47e4c009a33da2f51850446ab421c404ba884299.svg";
const imgCaeloIcon = "http://localhost:3845/assets/668d60eab65cf7eddb2c7c48c4910ad992800de8.svg";
const imgCaeloLogo = "http://localhost:3845/assets/c9b9232245e873a3eb623dc83305d97db14e84b0.svg";

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'borrower' as 'admin' | 'analyst' | 'loan_officer' | 'borrower',
    organization: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { register } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message) setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password || !formData.name) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('📝 Registering new user:', formData.email, 'Role:', formData.role);
      
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        organization: formData.organization || undefined
      });
      
      setMessage({ 
        type: 'success', 
        text: `Account created successfully! You can now login with ${formData.email}` 
      });

      // Clear form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        role: 'borrower',
        organization: ''
      });

      // Auto-switch to login after 2 seconds
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Registration failed';
      setMessage({ type: 'error', text: errorMessage });
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

      {/* Sign Up Form Card - Responsive */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Section */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-medium text-black tracking-tight leading-tight">
              Create Account
            </h1>
            <p className="text-base text-[#525866] leading-6">
              Join the Caelo community lending platform
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-3 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          {/* Form Fields Section */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054] tracking-tight">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                         text-[#667085] placeholder:text-[#667085] font-normal
                         shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                         focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340] focus:outline-none
                         transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054] tracking-tight">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                         text-[#667085] placeholder:text-[#667085] font-normal
                         shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                         focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340] focus:outline-none
                         transition-colors"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Role Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054] tracking-tight">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                         text-[#667085] font-normal
                         shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                         focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340] focus:outline-none
                         transition-colors"
                required
              >
                <option value="borrower">Borrower</option>
                <option value="loan_officer">Loan Officer</option>
                <option value="analyst">Analyst</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Organization Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054] tracking-tight">
                Organization
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                         text-[#667085] placeholder:text-[#667085] font-normal
                         shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                         focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340] focus:outline-none
                         transition-colors"
                placeholder="Your organization name"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054] tracking-tight">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085] font-normal
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340] focus:outline-none
                           transition-colors"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
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

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#344054] tracking-tight">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085] font-normal
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340] focus:outline-none
                           transition-colors"
                  placeholder="Confirm your password"
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

            {/* Sign Up Button */}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Switch to Login */}
            <div className="text-center">
              <p className="text-sm text-[#525866]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-[#1a2340] font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
