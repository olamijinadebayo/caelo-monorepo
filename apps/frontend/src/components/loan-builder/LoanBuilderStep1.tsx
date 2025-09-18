import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Logo } from '../ui/logo';
import { DollarSign, Info } from 'lucide-react';

interface LoanBuilderStep1Props {
  onNext: (data: LoanBuilderStep1Data) => void;
  onBack?: () => void;
  initialData?: LoanBuilderStep1Data;
}

export interface LoanBuilderStep1Data {
  productName: string;
  minimumAnnualRevenue: string;
  timeInBusiness: string;
  timeInBusinessUnit: string;
}

const LoanBuilderStep1: React.FC<LoanBuilderStep1Props> = ({
  onNext,
  onBack,
  initialData
}) => {
  const [formData, setFormData] = useState<LoanBuilderStep1Data>({
    productName: initialData?.productName || '',
    minimumAnnualRevenue: initialData?.minimumAnnualRevenue || '',
    timeInBusiness: initialData?.timeInBusiness || '',
    timeInBusinessUnit: initialData?.timeInBusinessUnit || 'Years'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    } else if (formData.productName.trim().length < 3) {
      newErrors.productName = 'Product name must be at least 3 characters';
    }

    if (!formData.minimumAnnualRevenue.trim()) {
      newErrors.minimumAnnualRevenue = 'Minimum annual revenue is required';
    } else {
      const cleanedValue = formData.minimumAnnualRevenue.replace(/,/g, '');
      if (!/^\d+(\.\d{1,2})?$/.test(cleanedValue) || parseFloat(cleanedValue) <= 0) {
        newErrors.minimumAnnualRevenue = 'Please enter a valid amount (e.g., 5000 or 10,000)';
      }
    }

    if (!formData.timeInBusiness.trim()) {
      newErrors.timeInBusiness = 'Time in business is required';
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

  const updateFormData = (field: keyof LoanBuilderStep1Data, value: string) => {
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
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[578px]">
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
          {/* Header Section */}
          <div className="space-y-3">
            <h1 className="text-5xl font-medium text-black tracking-tight leading-[60px]">
              Loan Builder
            </h1>
            <p className="text-base text-[#525866] leading-6 max-w-[334px]">
              Define your lending logic and create flexible loan products that reflect your organization's values
            </p>
          </div>

          {/* Product Name */}
          <div className="space-y-1.5">
            <Label htmlFor="productName" className="text-sm font-medium text-[#344054] tracking-tight">
              Product Name
            </Label>
            <div className="relative">
              <Input
                id="productName"
                type="text"
                value={formData.productName}
                onChange={(e) => updateFormData('productName', e.target.value)}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg 
                         text-[#667085] placeholder:text-[#667085]
                         shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                         focus:ring-1 ${
                  errors.productName 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#d0d5dd] focus:border-[#1a2340] focus:ring-[#1a2340]'
                }`}
                placeholder="Enter product name"
                required
              />
            </div>
            {errors.productName && (
              <p className="text-sm text-red-600">{errors.productName}</p>
            )}
          </div>

          {/* Pre-Screen Eligibility Rules Engine */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9">
              Pre-Screen Eligibility Rules Engine
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-5">
                {/* Minimum Annual Revenue */}
                <div className="space-y-1.5">
                  <Label htmlFor="minRevenue" className="text-sm font-medium text-[#344054] tracking-tight">
                    Minimum Annual Revenue:
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                    <Input
                      id="minRevenue"
                      type="text"
                      value={formData.minimumAnnualRevenue}
                      onChange={(e) => updateFormData('minimumAnnualRevenue', e.target.value)}
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg 
                               text-[#667085] placeholder:text-[#667085]
                               shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                               focus:ring-1 ${
                        errors.minimumAnnualRevenue 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-[#d0d5dd] focus:border-[#1a2340] focus:ring-[#1a2340]'
                      }`}
                      placeholder="10,000"
                      required
                    />
                  </div>
                  {errors.minimumAnnualRevenue && (
                    <p className="text-sm text-red-600">{errors.minimumAnnualRevenue}</p>
                  )}
                  <p className="text-sm text-[#667085] leading-5">
                    Enter the minimum annual revenue required for loan eligibility.
                  </p>
                </div>

                {/* Time in Business */}
                <div className="space-y-1.5">
                  <Label htmlFor="timeInBusiness" className="text-sm font-medium text-[#344054] tracking-tight">
                    Time in Business:
                  </Label>
                  <div className="flex flex-col sm:flex-row">
                    <Input
                      id="timeInBusiness"
                      type="text"
                      value={formData.timeInBusiness}
                      onChange={(e) => updateFormData('timeInBusiness', e.target.value)}
                      className={`flex-1 px-3.5 py-2.5 text-sm bg-white border rounded-l-lg sm:border-r-0 
                               text-[#667085] placeholder:text-[#667085]
                               shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                               focus:ring-1 ${
                        errors.timeInBusiness 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-[#d0d5dd] focus:border-[#1a2340] focus:ring-[#1a2340]'
                      }`}
                      placeholder="1-5"
                      required
                    />
                    <div className="bg-white border border-[#d0d5dd] border-l-0 sm:border-l-0 rounded-r-lg px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
                      <Select
                        value={formData.timeInBusinessUnit}
                        onValueChange={(value) => updateFormData('timeInBusinessUnit', value)}
                      >
                        <SelectTrigger className="border-0 shadow-none p-0 h-auto text-[#101828] text-base font-normal min-w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Years">Years</SelectItem>
                          <SelectItem value="Months">Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {errors.timeInBusiness && (
                    <p className="text-sm text-red-600">{errors.timeInBusiness}</p>
                  )}
                </div>
              </div>

              {/* Info Alert */}
              <Alert className="bg-[#fcfcfd] border border-[#d0d5dd] rounded-lg p-4">
                <Info className="h-5 w-5 text-[#344054]" />
                <div className="space-y-1">
                  <AlertTitle className="text-sm font-medium text-[#344054]">
                    Info
                  </AlertTitle>
                  <AlertDescription className="text-sm text-[#475467] leading-5">
                    This flexible engine lets CDFIs adapt to their members' needs without depending on 
                    one-size-fits-all automation. Our risk spread uses our version of a credit score and 
                    takes into consideration both willingness to pay + ability to pay + real time business 
                    performance data. Users will be encouraged to share as much data connection data as 
                    possible to aid in improving favorable lending outcomes for them.
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-[#cdd0d5] px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
          className="bg-white border border-[#d0d5dd] text-[#344054] text-sm font-medium px-3.5 py-2 rounded-lg shadow-sm
                   w-full sm:w-auto order-2 sm:order-1"
        >
          Back
        </Button>
        <Button 
          type="submit"
          onClick={handleSubmit}
          className="bg-[#1a2340] text-[#fff5e6] hover:bg-[#111629] 
                   border border-[#fff5e6] rounded-lg px-3.5 py-2 
                   text-sm font-medium leading-5
                   shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                   w-full sm:w-auto order-1 sm:order-2"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default LoanBuilderStep1;
