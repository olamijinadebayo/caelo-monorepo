import React from 'react';

interface MetricCardProps {
  number: string;
  title: string;
  subtitle: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ number, title, subtitle }) => {
  return (
    <div className="flex flex-col items-start flex-1 border shadow-sm bg-white rounded-lg">
      <div className="flex flex-col items-start gap-2 w-full p-6">
        <div className="flex items-center gap-4 w-full">
          <div className="flex-[1_0_0] text-[#101828] text-[28px] font-semibold leading-[42px] tracking-[-0.56px] relative">
            <div className="font-bold text-[28px] text-[rgba(16,24,40,1)]">
              {number}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 relative">
            <div className="text-[#101828] text-right text-sm font-medium leading-5 relative">
              <div className="font-normal text-sm text-[rgba(16,24,40,1)]">
                {title}
              </div>
            </div>
            <div className="text-[#667085] text-right text-sm font-medium leading-5 relative">
              <div className="font-normal text-sm text-[rgba(102,112,133,1)]">
                {subtitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
