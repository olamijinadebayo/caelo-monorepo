import React from 'react';
import { Button } from '../ui/button';
import { Settings, ChevronRight, Edit, Eye } from 'lucide-react';

interface LoanProduct {
  id: string;
  name: string;
  description: string;
  minAmount: string;
  maxAmount: string;
  baseInterest: string;
  termOptions: string[];
  status: 'active' | 'draft' | 'inactive';
  createdDate: string;
}

interface LoanProductsPageProps {
  onNavigateToLoanBuilder: () => void;
  onNavigateToSettings: () => void;
  loanProducts: LoanProduct[];
}

const LoanProductsPage: React.FC<LoanProductsPageProps> = ({ 
  onNavigateToLoanBuilder, 
  onNavigateToSettings,
  loanProducts 
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
      {loanProducts.length === 0 ? (
        /* Empty State - Call to Action */
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
      ) : (
        /* Loan Products List */
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 pb-8">
          <div className="max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-medium text-[#020617] mb-2">Your Loan Products</h2>
                <p className="text-[#667085]">{loanProducts.length} product{loanProducts.length !== 1 ? 's' : ''} created</p>
              </div>
              <Button
                onClick={onNavigateToLoanBuilder}
                className="bg-[#1a2340] text-[#fff5e6] hover:bg-[#111629] 
                         border border-[#fff5e6] rounded-lg px-4 py-2 
                         text-sm font-medium leading-5
                         shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
              >
                Create New Product
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loanProducts.map((product) => (
                <div key={product.id} className="bg-white border border-[#d0d5dd] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#020617]">{product.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : product.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-[#667085] text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <span className="text-[#98a2b3] block mb-1">Loan Range</span>
                      <span className="text-[#020617] font-medium">
                        ${product.minAmount} - ${product.maxAmount}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#98a2b3] block mb-1">Base Interest</span>
                      <span className="text-[#020617] font-medium">{product.baseInterest}%</span>
                    </div>
                    <div>
                      <span className="text-[#98a2b3] block mb-1">Terms</span>
                      <span className="text-[#020617] font-medium">
                        {product.termOptions.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#98a2b3] block mb-1">Created</span>
                      <span className="text-[#020617] font-medium">{product.createdDate}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanProductsPage;
