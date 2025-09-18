import React, { useState } from 'react';

interface TransactionDetailsProps {
  transaction?: {
    id: string;
    description: string;
    anomalyExplanation: string;
    userComment?: string;
  };
  onMarkNormal?: () => void;
  onExcludeFromCashflow?: () => void;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction = {
    id: 'TXN-001',
    description: 'Large POS transaction at electronics store',
    anomalyExplanation: 'Amount is 4x larger than typical POS transactions. Occurred outside usual spending pattern.',
    userComment: ''
  },
  onMarkNormal,
  onExcludeFromCashflow
}) => {
  const [isExcluded, setIsExcluded] = useState(false);
  const separatorLine = "data:image/svg+xml,%3csvg width='100%25' height='1' viewBox='0 0 100 1' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0 0.5L100 0.5' stroke='%23EAECF0'/%3e%3c/svg%3e";

  return (
    <div className="bg-slate-50 box-border flex flex-col gap-6 items-start justify-start p-[24px] relative w-full border border-[#eaecf0] rounded-lg">
      {/* Header with Title and Action Buttons */}
      <div className="flex items-center justify-between relative w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2 h-8 items-center justify-start">
            <div className="font-['Inter:Medium',_sans-serif] font-medium text-[20px] text-slate-950 tracking-[-0.6px]">
              <p className="leading-[32px] whitespace-pre">Transaction Details</p>
            </div>
          </div>
          <div className="flex gap-[9px] items-center justify-start">
            <button 
              onClick={onMarkNormal}
              className="bg-[#1a2340] rounded-[8px] border border-[#fff5e6] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#111629] transition-colors"
            >
              <div className="flex gap-2 items-center justify-center px-[18px] py-2.5">
                <div className="font-['Inter:Medium',_sans-serif] font-medium text-[#fff5e6] text-[16px]">
                  <p className="leading-[24px] whitespace-pre">Mark Normal</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => setIsExcluded(!isExcluded)}
              className={`rounded-[8px] border transition-all ${
                isExcluded 
                  ? 'border-red-500 bg-red-50 ring-2 ring-red-200' 
                  : 'border-[#f9f5ff] hover:bg-gray-50'
              }`}
            >
              <div className="flex gap-2 items-center justify-center px-[18px] py-2.5">
                <div className={`font-['Inter:Medium',_sans-serif] font-medium text-[16px] ${
                  isExcluded ? 'text-red-700' : 'text-red-600'
                }`}>
                  <p className="leading-[24px] whitespace-pre">
                    {isExcluded ? 'Excluded From Cashflow ✓' : 'Exclude From Cashflow analysis'}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="h-0 relative w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <img alt="" className="block max-w-none w-full h-px" src={separatorLine} />
        </div>
      </div>

      {/* Description and Anomaly Explanation */}
      <div className="flex items-start justify-between relative w-full">
        <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium gap-3 items-start justify-center text-[14px] w-[363px]">
          <div className="text-[#667085]">
            <p className="leading-[20px] whitespace-pre">Description:</p>
          </div>
          <div className="text-[#101828]" style={{ width: "min-content", minWidth: "100%" }}>
            <p className="leading-[20px]">{transaction.description}</p>
          </div>
        </div>
        <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium gap-3 items-start justify-center text-[14px] w-[429px]">
          <div className="text-[#667085]">
            <p className="leading-[20px] whitespace-pre">Anomaly Explanation:</p>
          </div>
          <div className="text-[#101828]" style={{ width: "min-content", minWidth: "100%" }}>
            <p className="leading-[20px]">{transaction.anomalyExplanation}</p>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="h-0 relative w-full">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <img alt="" className="block max-w-none w-full h-px" src={separatorLine} />
        </div>
      </div>

      {/* User Comment */}
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium gap-3 items-start justify-center text-[14px] w-[622px]">
        <div className="text-[#667085]">
          <p className="leading-[20px] whitespace-pre">User Comment</p>
        </div>
        <div className="text-[#101828]" style={{ width: "min-content", minWidth: "100%" }}>
          <p className="leading-[20px]">{transaction.userComment || '-'}</p>
        </div>
      </div>
    </div>
  );
};
