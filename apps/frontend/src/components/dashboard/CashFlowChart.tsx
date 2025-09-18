import React from 'react';

export const CashFlowChart: React.FC = () => {
  // This is a placeholder component - in a real implementation, you'd use a charting library like Recharts, Chart.js, etc.
  return (
    <div className="bg-white border border-[#eaecf0] rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#020617]">Cash Flow Analytics</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-[#667085]">Inflows</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-[#667085]">Outflows</span>
          </div>
        </div>
      </div>
      
      <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-4 opacity-30">📊</div>
          <p className="text-[#667085] mb-2">Cash Flow Chart</p>
          <p className="text-sm text-[#98a2b3]">Chart visualization would appear here</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">$125,400</div>
          <div className="text-sm text-[#667085]">Total Inflows</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">$98,200</div>
          <div className="text-sm text-[#667085]">Total Outflows</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#020617]">$27,200</div>
          <div className="text-sm text-[#667085]">Net Cash Flow</div>
        </div>
      </div>
    </div>
  );
};
