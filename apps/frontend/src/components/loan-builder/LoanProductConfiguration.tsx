import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Logo } from '../ui/logo';
import { DollarSign, Percent, X } from 'lucide-react';

interface LoanProductConfigurationProps {
  onNext: (data: LoanProductConfigurationData) => void;
  onBack: () => void;
  initialData?: LoanProductConfigurationData;
}

export interface LoanProductConfigurationData {
  termOptions: string[];
  baseInterest: string;
  originationFee: string;
  loanAmountMin: string;
  loanAmountMax: string;
  riskSpread: string[];
}

const LoanProductConfiguration: React.FC<LoanProductConfigurationProps> = ({
  onNext,
  onBack,
  initialData
}) => {
  const [formData, setFormData] = useState<LoanProductConfigurationData>({
    termOptions: initialData?.termOptions || ['6 months', '12 months'],
    baseInterest: initialData?.baseInterest || '5',
    originationFee: initialData?.originationFee || '5',
    loanAmountMin: initialData?.loanAmountMin || '10,000',
    loanAmountMax: initialData?.loanAmountMax || '50,000',
    riskSpread: initialData?.riskSpread || ['+0% (90+ score)', '+1% (80–89)']
  });

  const [newTermOption, setNewTermOption] = useState('');
  const [newRiskSpread, setNewRiskSpread] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.termOptions.length === 0) {
      newErrors.termOptions = 'At least one term option is required';
    }

    if (!formData.baseInterest.trim()) {
      newErrors.baseInterest = 'Base interest rate is required';
    } else {
      const rate = parseFloat(formData.baseInterest);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        newErrors.baseInterest = 'Please enter a valid interest rate (0-100)';
      }
    }

    if (!formData.originationFee.trim()) {
      newErrors.originationFee = 'Origination fee is required';
    } else {
      const fee = parseFloat(formData.originationFee);
      if (isNaN(fee) || fee < 0 || fee > 100) {
        newErrors.originationFee = 'Please enter a valid fee percentage (0-100)';
      }
    }

    if (!formData.loanAmountMin.trim()) {
      newErrors.loanAmountMin = 'Minimum loan amount is required';
    } else {
      const cleanedMin = formData.loanAmountMin.replace(/,/g, '');
      if (!/^\d+(\.\d{1,2})?$/.test(cleanedMin) || parseFloat(cleanedMin) <= 0) {
        newErrors.loanAmountMin = 'Please enter a valid amount (e.g., 5000 or 25,000)';
      }
    }

    if (!formData.loanAmountMax.trim()) {
      newErrors.loanAmountMax = 'Maximum loan amount is required';
    } else {
      const cleanedMax = formData.loanAmountMax.replace(/,/g, '');
      if (!/^\d+(\.\d{1,2})?$/.test(cleanedMax) || parseFloat(cleanedMax) <= 0) {
        newErrors.loanAmountMax = 'Please enter a valid amount (e.g., 50000 or 250,000)';
      }
    }

    // Check if min is less than max
    if (formData.loanAmountMin && formData.loanAmountMax && !newErrors.loanAmountMin && !newErrors.loanAmountMax) {
      const min = parseFloat(formData.loanAmountMin.replace(/,/g, ''));
      const max = parseFloat(formData.loanAmountMax.replace(/,/g, ''));
      if (min >= max) {
        newErrors.loanAmountMax = 'Maximum amount must be greater than minimum amount';
      }
    }

    if (formData.riskSpread.length === 0) {
      newErrors.riskSpread = 'At least one risk spread option is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const updateFormData = (field: keyof LoanProductConfigurationData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTermOption = () => {
    if (newTermOption.trim() && !formData.termOptions.includes(newTermOption.trim())) {
      updateFormData('termOptions', [...formData.termOptions, newTermOption.trim()]);
      setNewTermOption('');
    }
  };

  const removeTermOption = (optionToRemove: string) => {
    updateFormData('termOptions', formData.termOptions.filter(option => option !== optionToRemove));
  };

  const addRiskSpread = () => {
    if (newRiskSpread.trim() && !formData.riskSpread.includes(newRiskSpread.trim())) {
      updateFormData('riskSpread', [...formData.riskSpread, newRiskSpread.trim()]);
      setNewRiskSpread('');
    }
  };

  const removeRiskSpread = (spreadToRemove: string) => {
    updateFormData('riskSpread', formData.riskSpread.filter(spread => spread !== spreadToRemove));
  };

  const handleTermKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTermOption();
    }
  };

  const handleRiskKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRiskSpread();
    }
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
        <form onSubmit={handleSubmit} className="w-full max-w-[578px] space-y-6">
          {/* Header Section */}
          <div>
            <h1 className="text-2xl font-medium text-black leading-9">
              Loan Product Configuration
            </h1>
          </div>

          <div className="space-y-6">
            {/* Term Options */}
            <div className="space-y-1.5">
              <Label htmlFor="termOptions" className="text-sm font-medium text-[#344054] tracking-tight">
                Term Options
              </Label>
              <div className={`bg-white border rounded-lg px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] ${
                errors.termOptions ? 'border-red-500' : 'border-[#d0d5dd]'
              }`}>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {/* Existing Term Options */}
                  {formData.termOptions.map((option, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="bg-white border border-[#d0d5dd] text-[#344054] text-sm font-medium px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      {option}
                      <button
                        type="button"
                        onClick={() => removeTermOption(option)}
                        className="ml-1 hover:bg-gray-100 rounded-sm p-0.5"
                      >
                        <X className="w-3 h-3 text-[#98a2b3]" />
                      </button>
                    </Badge>
                  ))}
                  
                  {/* Add New Term Option Input */}
                  <input
                    type="text"
                    value={newTermOption}
                    onChange={(e) => setNewTermOption(e.target.value)}
                    onKeyPress={handleTermKeyPress}
                    onBlur={addTermOption}
                    placeholder="Add term (e.g., 6 months)"
                    className="flex-1 min-w-[80px] outline-none text-sm text-[#98a2b3] placeholder:text-[#98a2b3] bg-transparent"
                  />
                </div>
              </div>
              {errors.termOptions && (
                <p className="text-sm text-red-600">{errors.termOptions}</p>
              )}
            </div>

            {/* Base Interest */}
            <div className="space-y-1.5">
              <Label htmlFor="baseInterest" className="text-sm font-medium text-[#344054] tracking-tight">
                Base Interest
              </Label>
              <div className="relative">
                <Percent className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                <Input
                  id="baseInterest"
                  type="text"
                  value={formData.baseInterest}
                  onChange={(e) => updateFormData('baseInterest', e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg 
                           text-[#667085] placeholder:text-[#667085]
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:ring-1 ${
                    errors.baseInterest 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-[#d0d5dd] focus:border-[#1a2340] focus:ring-[#1a2340]'
                  }`}
                  placeholder="5"
                  required
                />
              </div>
              {errors.baseInterest && (
                <p className="text-sm text-red-600">{errors.baseInterest}</p>
              )}
            </div>

            {/* Origination Fee */}
            <div className="space-y-1.5">
              <Label htmlFor="originationFee" className="text-sm font-medium text-[#344054] tracking-tight">
                Origination Fee
              </Label>
              <div className="relative">
                <Percent className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                <Input
                  id="originationFee"
                  type="text"
                  value={formData.originationFee}
                  onChange={(e) => updateFormData('originationFee', e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085]
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                  placeholder="5"
                />
              </div>
              <p className="text-sm text-[#667085] leading-5">
                Could vary over term options selected
              </p>
            </div>

            {/* Loan Amount Range */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#344054] tracking-tight">
                Loan Amount Range
              </Label>
              <div className="flex gap-3 items-end">
                {/* Minimum Amount */}
                <div className="flex-1">
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                    <Input
                      type="text"
                      value={formData.loanAmountMin}
                      onChange={(e) => updateFormData('loanAmountMin', e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                               text-[#667085] placeholder:text-[#667085]
                               shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                               focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                      placeholder="10,000"
                    />
                  </div>
                </div>

                {/* Maximum Amount */}
                <div className="flex-1">
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                    <Input
                      type="text"
                      value={formData.loanAmountMax}
                      onChange={(e) => updateFormData('loanAmountMax', e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                               text-[#667085] placeholder:text-[#667085]
                               shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                               focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                      placeholder="50,000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Spread */}
            <div className="space-y-1.5">
              <Label htmlFor="riskSpread" className="text-sm font-medium text-[#344054] tracking-tight">
                Risk Spread
              </Label>
              <div className="bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
                <div className="flex flex-wrap gap-1.5 items-center">
                  {/* Existing Risk Spread Options */}
                  {formData.riskSpread.map((spread, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="bg-white border border-[#d0d5dd] text-[#344054] text-sm font-medium px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      {spread}
                      <button
                        type="button"
                        onClick={() => removeRiskSpread(spread)}
                        className="ml-1 hover:bg-gray-100 rounded-sm p-0.5"
                      >
                        <X className="w-3 h-3 text-[#98a2b3]" />
                      </button>
                    </Badge>
                  ))}
                  
                  {/* Add New Risk Spread Input */}
                  <input
                    type="text"
                    value={newRiskSpread}
                    onChange={(e) => setNewRiskSpread(e.target.value)}
                    onKeyPress={handleRiskKeyPress}
                    onBlur={addRiskSpread}
                    placeholder="Add more"
                    className="flex-1 min-w-[80px] outline-none text-sm text-[#98a2b3] placeholder:text-[#98a2b3] bg-transparent"
                  />
                </div>
              </div>
            </div>
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

export default LoanProductConfiguration;
