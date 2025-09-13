import React, { useState } from 'react';

export const FilterButtons: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('today');

  const filters = [
    { id: 'last-14-days', label: 'Last 14 Days' },
    { id: 'last-7-days', label: 'Last 7 Days' },
    { id: 'today', label: 'Today' }
  ];

  return (
    <div className="flex items-center gap-3">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`
            box-border flex gap-2 items-center justify-center overflow-hidden px-4 py-2.5 relative rounded-lg
            font-['Inter:Medium',_sans-serif] font-medium text-[14px] leading-[20px] text-nowrap
            border border-solid shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
            transition-colors
            ${activeFilter === filter.id 
              ? 'bg-[#F9FAFB] text-[#1D2939] border-[#D0D5DD]' 
              : 'bg-white text-[#344054] border-[#D0D5DD] hover:bg-[#F9FAFB] hover:text-[#1D2939]'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
      
      {/* Date Picker Button - matches Figma design */}
      <button className="
        box-border flex flex-col gap-2 items-start justify-start p-0 relative
        bg-white rounded-lg border border-[#D0D5DD] border-solid 
        shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
        hover:bg-[#F9FAFB] transition-colors
      ">
        <div className="box-border flex gap-2 items-center justify-center overflow-hidden px-4 py-2.5 relative">
          {/* Calendar Icon */}
          <div className="overflow-hidden relative shrink-0 w-5 h-5">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path 
                d="M6.66667 1.66667V5M13.3333 1.66667V5M2.5 8.33333H17.5M4.16667 3.33333H15.8333C16.7538 3.33333 17.5 4.07953 17.5 5V16.6667C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6667V5C2.5 4.07953 3.24619 3.33333 4.16667 3.33333Z" 
                stroke="#344054" 
                strokeWidth="1.66667" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-['Inter:Medium',_sans-serif] font-medium text-[14px] leading-[20px] text-[#344054] text-nowrap">
            Jan 6, 2022 — Jan 13, 2022
          </span>
        </div>
      </button>
    </div>
  );
};
