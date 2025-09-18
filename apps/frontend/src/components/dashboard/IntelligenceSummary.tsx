import React from 'react';
import { Lightbulb } from 'lucide-react';

export const IntelligenceSummary: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
        </div>
        <div>
          <h3 className="font-semibold text-amber-900 mb-2">Caelo Intelligence Summary</h3>
          <p className="text-sm text-amber-800 leading-relaxed">
            The business shows a healthy balance of inflows and outflows. Revenues are growing at 20% YoY with profits growing at a similar rate. However, the owner shows signs of financial distress with 2 NSFs in the past 6 months. Furthermore, several uncategorized transactions were found in amounts above $1000. Please consult the Transactions table under Cash Flow Analytics for more information.
          </p>
        </div>
      </div>
    </div>
  );
};
