import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending';
}

interface ProgressStepsProps {
  steps: ProgressStep[];
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps }) => {
  return (
    <div className="flex items-center space-x-8 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'completed'
                  ? 'bg-green-100 text-green-600'
                  : step.status === 'current'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step.status === 'completed' ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                step.status === 'completed'
                  ? 'text-green-600'
                  : step.status === 'current'
                  ? 'text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 ml-4 ${
                steps[index + 1].status === 'completed' || step.status === 'completed'
                  ? 'bg-green-200'
                  : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
