import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Logo } from '../ui/logo';
import { DollarSign, Info, Percent } from 'lucide-react';

interface LoanBuilderStep2Props {
  onNext: (data: LoanBuilderStep2Data) => void;
  onBack: () => void;
  initialData?: LoanBuilderStep2Data;
}

export interface LoanBuilderStep2Data {
  minLoanAmount: string;
  maxLoanAmount: string;
  interestRateMin: string;
  interestRateMax: string;
  termMin: string;
  termMax: string;
  termUnit: string;
  feeStructure: string;
}

const LoanBuilderStep2: React.FC<LoanBuilderStep2Props> = ({
  onNext,
  onBack,
  initialData
}) => {
  const [formData, setFormData] = useState<LoanBuilderStep2Data>({
    minLoanAmount: initialData?.minLoanAmount || '5,000',
    maxLoanAmount: initialData?.maxLoanAmount || '250,000',
    interestRateMin: initialData?.interestRateMin || '4.5',
    interestRateMax: initialData?.interestRateMax || '12.0',
    termMin: initialData?.termMin || '6',
    termMax: initialData?.termMax || '60',
    termUnit: initialData?.termUnit || 'Months',
    feeStructure: initialData?.feeStructure || 'origination'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const updateFormData = (field: keyof LoanBuilderStep2Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#cdd0d5] px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-[5px]">
          <Logo />
        </div>
        <Button 
          variant="outline"
          className="bg-white border border-[#d0d5dd] text-[#344054] text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm"
        >
          Home
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-[578px] space-y-12">
          {/* Header Section */}
          <div className="space-y-3">
            <h1 className="text-5xl font-medium text-black tracking-tight leading-[60px]">
              Loan Terms
            </h1>
            <p className="text-base text-[#525866] leading-6 max-w-[500px]">
              Configure loan amounts, interest rates, and repayment terms for your product
            </p>
          </div>

          {/* Loan Amount Range */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9">
              Loan Amount Range
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Minimum Amount */}
              <div className="space-y-1.5">
                <Label htmlFor="minAmount" className="text-sm font-medium text-[#344054] tracking-tight">
                  Minimum Amount:
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                  <Input
                    id="minAmount"
                    type="text"
                    value={formData.minLoanAmount}
                    onChange={(e) => updateFormData('minLoanAmount', e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                             text-[#667085] placeholder:text-[#667085]
                             shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                             focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                    placeholder="5,000"
                  />
                </div>
              </div>

              {/* Maximum Amount */}
              <div className="space-y-1.5">
                <Label htmlFor="maxAmount" className="text-sm font-medium text-[#344054] tracking-tight">
                  Maximum Amount:
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                  <Input
                    id="maxAmount"
                    type="text"
                    value={formData.maxLoanAmount}
                    onChange={(e) => updateFormData('maxLoanAmount', e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                             text-[#667085] placeholder:text-[#667085]
                             shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                             focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                    placeholder="250,000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interest Rate Range */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9">
              Interest Rate Range
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Minimum Rate */}
              <div className="space-y-1.5">
                <Label htmlFor="minRate" className="text-sm font-medium text-[#344054] tracking-tight">
                  Minimum Rate:
                </Label>
                <div className="relative">
                  <Percent className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                  <Input
                    id="minRate"
                    type="text"
                    value={formData.interestRateMin}
                    onChange={(e) => updateFormData('interestRateMin', e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                             text-[#667085] placeholder:text-[#667085]
                             shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                             focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                    placeholder="4.5"
                  />
                </div>
              </div>

              {/* Maximum Rate */}
              <div className="space-y-1.5">
                <Label htmlFor="maxRate" className="text-sm font-medium text-[#344054] tracking-tight">
                  Maximum Rate:
                </Label>
                <div className="relative">
                  <Percent className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                  <Input
                    id="maxRate"
                    type="text"
                    value={formData.interestRateMax}
                    onChange={(e) => updateFormData('interestRateMax', e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                             text-[#667085] placeholder:text-[#667085]
                             shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                             focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                    placeholder="12.0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Repayment Terms */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9">
              Repayment Terms
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Minimum Term */}
              <div className="space-y-1.5">
                <Label htmlFor="minTerm" className="text-sm font-medium text-[#344054] tracking-tight">
                  Minimum Term:
                </Label>
                <div className="flex">
                  <Input
                    id="minTerm"
                    type="text"
                    value={formData.termMin}
                    onChange={(e) => updateFormData('termMin', e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-l-lg 
                             text-[#667085] placeholder:text-[#667085]
                             shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                             focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]
                             border-r-0 focus:border-r-0"
                    placeholder="6"
                  />
                  <div className="bg-white border border-[#d0d5dd] border-l-0 rounded-r-lg px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
                    <Select
                      value={formData.termUnit}
                      onValueChange={(value) => updateFormData('termUnit', value)}
                    >
                      <SelectTrigger className="border-0 shadow-none p-0 h-auto text-[#101828] text-base font-normal">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Months">Months</SelectItem>
                        <SelectItem value="Years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Maximum Term */}
              <div className="space-y-1.5">
                <Label htmlFor="maxTerm" className="text-sm font-medium text-[#344054] tracking-tight">
                  Maximum Term:
                </Label>
                <div className="flex">
                  <Input
                    id="maxTerm"
                    type="text"
                    value={formData.termMax}
                    onChange={(e) => updateFormData('termMax', e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-l-lg 
                             text-[#667085] placeholder:text-[#667085]
                             shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                             focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]
                             border-r-0 focus:border-r-0"
                    placeholder="60"
                  />
                  <div className="bg-white border border-[#d0d5dd] border-l-0 rounded-r-lg px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
                    <span className="text-[#101828] text-base font-normal">
                      {formData.termUnit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Structure */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9">
              Fee Structure
            </h2>
            
            <div className="space-y-1.5">
              <Label htmlFor="feeStructure" className="text-sm font-medium text-[#344054] tracking-tight">
                Fee Type:
              </Label>
              <Select
                value={formData.feeStructure}
                onValueChange={(value) => updateFormData('feeStructure', value)}
              >
                <SelectTrigger className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                         shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                         focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="origination">Origination Fee (1-3% of loan amount)</SelectItem>
                  <SelectItem value="processing">Processing Fee (Flat $500)</SelectItem>
                  <SelectItem value="none">No Additional Fees</SelectItem>
                  <SelectItem value="custom">Custom Fee Structure</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Info Alert */}
            <Alert className="bg-[#fcfcfd] border border-[#d0d5dd] rounded-lg p-4">
              <Info className="h-5 w-5 text-[#344054]" />
              <div className="space-y-1">
                <AlertTitle className="text-sm font-medium text-[#344054]">
                  Competitive Positioning
                </AlertTitle>
                <AlertDescription className="text-sm text-[#475467] leading-5">
                  Your loan terms will be compared against market rates to ensure competitiveness 
                  while maintaining profitability. Caelo's algorithm considers local market conditions 
                  and borrower risk profiles to optimize approval rates.
                </AlertDescription>
              </div>
            </Alert>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-[#cdd0d5] px-8 py-6 flex items-center justify-between">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
          className="bg-white border border-[#d0d5dd] text-[#344054] text-sm font-medium px-3.5 py-2 rounded-lg shadow-sm"
        >
          Back
        </Button>
        <Button 
          type="submit"
          onClick={handleSubmit}
          className="bg-[#1a2340] text-[#fff5e6] hover:bg-[#111629] 
                   border border-[#fff5e6] rounded-lg px-3.5 py-2 
                   text-sm font-medium leading-5
                   shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default LoanBuilderStep2;
