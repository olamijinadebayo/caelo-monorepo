import React from 'react';
import { Button } from '../ui/button';
import { Settings, ChevronRight } from 'lucide-react';

interface LoanProductsPageProps {
  onNavigateToLoanBuilder: () => void;
  onNavigateToSettings: () => void;
}

const LoanProductsPage: React.FC<LoanProductsPageProps> = ({ 
  onNavigateToLoanBuilder, 
  onNavigateToSettings 
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="px-4 sm:px-8 lg:px-12 xl:px-16 pt-7 lg:pt-10 xl:pt-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3 lg:gap-4 xl:gap-5">
            <button
              onClick={onNavigateToSettings}
              className="flex items-center justify-center p-1 lg:p-2 hover:bg-gray-100 rounded transition-colors
                       focus:outline-none focus:ring-2 focus:ring-[#1a2340] focus:ring-offset-1"
            >
              <Settings className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-[#667085]" />
            </button>
            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-[#d0d5dd]" />
            <div className="text-sm lg:text-base xl:text-lg font-medium text-[#111925] leading-5">
              Loan Products
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="bg-[#fff5e6] border border-[#3c131f]/20 rounded-2xl w-full 
                      max-w-[794px] lg:max-w-[900px] xl:max-w-[1100px] 2xl:max-w-[1200px]
                      h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[550px]
                      relative overflow-hidden shadow-sm">
          
          {/* Laptop Illustration - Responsive sizing */}
          <div className="absolute right-0 top-0 h-full 
                         w-[420px] lg:w-[500px] xl:w-[600px] 2xl:w-[700px]
                         hidden md:flex items-center justify-center overflow-hidden">
            <img 
              src="http://localhost:3845/assets/73f7dc511360af5c8843576d2f8cf4bc6d3e0ec0.svg"
              alt="Person with laptop illustration" 
              className="w-auto h-[85%] lg:h-[90%] xl:h-[92%] object-contain"
            />
          </div>

          {/* Content - Responsive positioning and sizing */}
          <div className="absolute left-4 sm:left-8 md:left-12 lg:left-16 xl:left-20 
                         top-1/2 transform -translate-y-1/2 
                         w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] 
                         md:w-[350px] lg:w-[400px] xl:w-[450px] 2xl:w-[500px]
                         space-y-8 md:space-y-12 lg:space-y-16 xl:space-y-20">
            
            {/* Title - Better scaling */}
            <h1 className="font-medium text-slate-950 leading-[1.1] tracking-[-0.96px] pr-4 md:pr-0
                         text-2xl sm:text-3xl md:text-[28px] lg:text-[32px] xl:text-[36px] 2xl:text-[40px]">
              Start by showing how Caelo gives CDFIs control over their lending logic
            </h1>

            {/* CTA Button - Consistent sizing */}
            <Button
              onClick={onNavigateToLoanBuilder}
              className="bg-[#1a2340] text-[#fff5e6] hover:bg-[#111629] 
                       border border-[#fff5e6] rounded-lg px-3.5 py-2 
                       text-sm font-medium leading-5 
                       w-full sm:w-[201px] lg:w-[220px] xl:w-[240px]
                       shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                       focus:outline-none focus:ring-2 focus:ring-[#1a2340] focus:ring-offset-2"
            >
              Create New Loan Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanProductsPage;
