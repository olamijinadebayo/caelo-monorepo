import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { FigmaAssets } from '../../assets/figma-assets';
import { getBranding } from '../../utils/branding';

interface NavbarProps {
  onDashboardClick?: () => void;
  currentPage?: 'dashboard' | 'borrowers' | 'portfolio';
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onDashboardClick, 
  currentPage = 'dashboard'
}) => {
  const { user, logout } = useAuth();
  const branding = getBranding();

  return (
    <header className="self-stretch w-full overflow-hidden bg-white border-b-[#EAECF0] border-b border-solid">
      {/* Container with max-width constraint like Figma design */}
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="flex h-[72px] w-full items-center justify-between px-[50px] xl:px-[50px] lg:px-8 md:px-6 sm:px-4">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center h-10">
            {/* Logo Section - matches Figma ~109px width with tighter spacing */}
            <div className="flex items-center gap-1.5 mr-6">
              {/* Partner/Organization Logo (left) */}
              <div className="flex items-center">
                <img
                  src={FigmaAssets.logo.partner}
                  alt={FigmaAssets.logo.alt.partner}
                  className="object-contain w-8 h-8"
                  onError={(e) => {
                    // Fallback if partner logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center';
                    fallback.innerHTML = `<span class="text-white font-bold text-xs">${branding.name.charAt(0)}</span>`;
                    target.parentNode?.insertBefore(fallback, target);
                  }}
                />
              </div>
              
              {/* Separator */}
              <div className="w-px h-8 bg-[#EAECF0]"></div>
              
              {/* Caelo Logo (right) */}
              <img
                src={FigmaAssets.logo.caelo}
                alt={FigmaAssets.logo.alt.caelo}
                className="object-contain w-[73px] h-8"
              />
            </div>
            
            {/* Navigation - matches Figma navigation structure with tighter spacing */}
            <nav className="flex items-center gap-0 text-base text-[#344054] font-medium">
              <button 
                onClick={onDashboardClick}
                className={`flex items-center justify-center h-10 px-3 rounded-md font-medium transition-colors ${
                  currentPage === 'dashboard' 
                    ? 'text-[#101828] bg-[#EAECF0]' 
                    : 'text-[#344054] hover:bg-[#F9FAFB]'
                }`}
              >
                Dashboard
              </button>
              <button 
                className={`flex items-center justify-center h-10 px-3 rounded-md font-medium transition-colors ${
                  currentPage === 'borrowers' 
                    ? 'text-[#101828] bg-[#EAECF0]' 
                    : 'text-[#344054] hover:bg-[#F9FAFB]'
                }`}
              >
                Borrowers
              </button>
              <button 
                className={`flex items-center justify-center h-10 px-3 rounded-md font-medium transition-colors ${
                  currentPage === 'portfolio' 
                    ? 'text-[#101828] bg-[#EAECF0]' 
                    : 'text-[#344054] hover:bg-[#F9FAFB]'
                }`}
              >
                Portfolio
              </button>
            </nav>
          </div>
          
          {/* Right side - Actions matching Figma with tighter spacing */}
          <div className="flex items-center h-10">
            {/* Action Buttons - matches Figma 40px width each with no gap */}
            <div className="flex items-center">
              {/* Settings */}
              <button className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#F9FAFB] transition-colors">
                <img
                  src={FigmaAssets.icons.settings}
                  alt="Settings"
                  className="w-5 h-5"
                />
              </button>
              
              {/* Notifications */}
              <button className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#F9FAFB] transition-colors">
                <img
                  src={FigmaAssets.icons.notifications}
                  alt="Notifications"
                  className="w-5 h-5"
                />
              </button>
              
              {/* Logout Button */}
              <button 
                onClick={logout}
                className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#F9FAFB] transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-[#667085] hover:text-[#101828]" />
              </button>
            </div>
            
            {/* User Info - matches Figma styling */}
            <div className="flex items-center ml-2 gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-[#F9FAFB] transition-colors">
                <img
                  src={FigmaAssets.user.avatar}
                  alt={FigmaAssets.user.alt}
                  className="w-8 h-8 rounded-full"
                />
              </div>
              {user && (
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-medium text-[#101828]">{user.name}</span>
                  <span className="text-xs text-[#667085]">{user.organization}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
