import React from 'react';
import { Button } from '../ui/button';
import { FileText } from 'lucide-react';

interface SettingsPageProps {
  onNavigateToLoanProducts: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigateToLoanProducts }) => {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
      <div className="max-w-[834px] lg:max-w-[1000px] xl:max-w-[1200px] mx-auto">
        <div className="space-y-6 lg:space-y-8 xl:space-y-10">
          {/* Title */}
          <div>
            <h1 className="text-xl lg:text-2xl xl:text-3xl font-medium text-slate-950 leading-6">
              Settings
            </h1>
          </div>

          {/* Settings Cards */}
          <div className="flex gap-3.5 lg:gap-6 xl:gap-8 flex-wrap justify-center lg:justify-start">
            {/* Loan Products Card */}
            <button
              onClick={onNavigateToLoanProducts}
              className="bg-[#f2f4f7] border border-slate-200 rounded-xl p-8 lg:p-10 xl:p-12
                       w-full sm:w-[360px] lg:w-[400px] xl:w-[450px] 2xl:w-[500px]
                       h-[136px] lg:h-[160px] xl:h-[180px] 2xl:h-[200px]
                       flex flex-col items-center justify-center gap-4 lg:gap-6 xl:gap-8
                       hover:bg-[#e9ecef] transition-colors
                       focus:outline-none focus:ring-2 focus:ring-[#1a2340] focus:ring-offset-2"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex items-center justify-center">
                <FileText className="w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-[#344054]" />
              </div>
              <div className="text-base lg:text-lg xl:text-xl font-medium text-[#344054] leading-6">
                Loan Products
              </div>
            </button>

            {/* Loan Configuration Card (Disabled) */}
            <div className="bg-[#f2f4f7] border border-slate-200 rounded-xl p-8 lg:p-10 xl:p-12
                          w-full sm:w-[360px] lg:w-[400px] xl:w-[450px] 2xl:w-[500px]
                          h-[136px] lg:h-[160px] xl:h-[180px] 2xl:h-[200px]
                          flex flex-col items-center justify-center gap-4 lg:gap-6 xl:gap-8
                          opacity-50 cursor-not-allowed">
              <div className="text-base lg:text-lg xl:text-xl font-medium text-[#344054] leading-6 opacity-0">
                Loan Configuration
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
