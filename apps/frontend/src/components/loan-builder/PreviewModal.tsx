import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DollarSign, Percent } from 'lucide-react';
import type { LoanBuilderStep1Data } from './LoanBuilderStep1';
import type { CreditBoxBuilderData } from './CreditBoxBuilder';
import type { LoanProductConfigurationData } from './LoanProductConfiguration';

interface PreviewModalProps {
  step1Data: LoanBuilderStep1Data;
  step2Data: CreditBoxBuilderData;
  step3Data: LoanProductConfigurationData;
  onSave: () => void;
  onClose?: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  step1Data,
  step2Data,
  step3Data,
  onSave
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[720px] max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-2xl font-medium text-black leading-9">
            Preview
          </h1>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Step 1 Data - Loan Builder */}
          <div className="space-y-6">
            <div className="space-y-5">
              {/* Minimum Annual Revenue */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#344054] tracking-tight">
                  Minimum Annual Revenue:
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                  <Input
                    type="text"
                    value={step1Data.minimumAnnualRevenue}
                    readOnly
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                             text-[#667085] cursor-default
                             shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                  />
                </div>
                <p className="text-sm text-[#667085] leading-5">
                  This is a hint text to help user.
                </p>
              </div>

              {/* Time in Business */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#344054] tracking-tight">
                  Time in Business:
                </Label>
                <div className="flex">
                  <Input
                    type="text"
                    value={step1Data.timeInBusiness}
                    readOnly
                    className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-l-lg 
                             text-[#667085] cursor-default
                             shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                             border-r-0"
                  />
                  <div className="bg-white border border-[#d0d5dd] border-l-0 rounded-r-lg px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
                    <span className="text-[#101828] text-base font-normal">
                      {step1Data.timeInBusinessUnit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Product Configuration Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-black leading-7">
                Loan Product Configuration
              </h2>
            </div>
            
            <div className="space-y-4">
              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#344054] tracking-tight">
                  Description (Text Field)
                </Label>
                <Textarea
                  value={step2Data.description}
                  readOnly
                  className="w-full h-[100px] px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] resize-none cursor-default
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                />
              </div>

              {/* Used For */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#344054] tracking-tight">
                  Used For
                </Label>
                <Select disabled>
                  <SelectTrigger className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-default">
                    <SelectValue placeholder={step2Data.usedFor.join(', ') || 'Inventory'} />
                  </SelectTrigger>
                  <SelectContent>
                    {step2Data.usedFor.map((item, index) => (
                      <SelectItem key={index} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Loan Amount */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#344054] tracking-tight">
                  Loan Amount
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                  <Input
                    type="text"
                    value={step3Data.loanAmountMin}
                    readOnly
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                             text-[#667085] cursor-default
                             shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                  />
                </div>
              </div>

              {/* Base Interest */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#344054] tracking-tight">
                  Base Interest
                </Label>
                <div className="relative">
                  <Percent className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                  <Input
                    type="text"
                    value={step3Data.baseInterest}
                    readOnly
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                             text-[#667085] cursor-default
                             shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                  />
                </div>
              </div>

              {/* Term Options */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-[#344054] tracking-tight">
                  Term Options
                </Label>
                <Select disabled>
                  <SelectTrigger className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-default">
                    <SelectValue placeholder={step3Data.termOptions.join(', ') || 'Inventory'} />
                  </SelectTrigger>
                  <SelectContent>
                    {step3Data.termOptions.map((option, index) => (
                      <SelectItem key={index} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed Footer with Save Button */}
        <div className="border-t border-gray-200 p-6 flex-shrink-0 bg-white rounded-b-2xl">
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-[#1a2340] text-[#fff5e6] hover:bg-[#111629] 
                       border border-[#fff5e6] rounded-lg px-6 py-3 
                       text-sm font-medium leading-5
                       shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                       disabled:opacity-50 min-w-[120px]"
            >
              {isLoading ? 'Saving...' : 'Save Details'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
