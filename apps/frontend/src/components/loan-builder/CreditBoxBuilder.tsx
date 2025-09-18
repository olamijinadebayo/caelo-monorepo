import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Logo } from '../ui/logo';
import { DollarSign, X } from 'lucide-react';

interface CreditBoxBuilderProps {
  onNext: (data: CreditBoxBuilderData) => void;
  onBack: () => void;
  initialData?: CreditBoxBuilderData;
}

export interface CreditBoxBuilderData {
  description: string;
  usedFor: string[];
  loanAmountMin: string;
  loanAmountMax: string;
}

const CreditBoxBuilder: React.FC<CreditBoxBuilderProps> = ({
  onNext,
  onBack,
  initialData
}) => {
  const [formData, setFormData] = useState<CreditBoxBuilderData>({
    description: initialData?.description || '',
    usedFor: initialData?.usedFor || [],
    loanAmountMin: initialData?.loanAmountMin || '',
    loanAmountMax: initialData?.loanAmountMax || ''
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.usedFor.length === 0) {
      newErrors.usedFor = 'At least one "Used For" tag is required';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const updateFormData = (field: keyof CreditBoxBuilderData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.usedFor.includes(newTag.trim())) {
      updateFormData('usedFor', [...formData.usedFor, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData('usedFor', formData.usedFor.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
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
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-[598px] space-y-8">
          {/* Header Section */}
          <div className="space-y-3">
            <h1 className="text-5xl font-medium text-black tracking-tight leading-[60px]">
              Credit Box Builder
            </h1>
            <p className="text-base text-[#525866] leading-6 max-w-[334px]">
              Define your lending logic and create flexible loan products that reflect your organization's values
            </p>
          </div>

          <div className="space-y-6">
            {/* Description Text Field */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm font-medium text-[#344054] tracking-tight">
                Description (Text Field)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className={`w-full h-[150px] px-3.5 py-2.5 text-sm bg-white border rounded-lg 
                         text-[#667085] placeholder:text-[#667085] resize-none
                         shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                         focus:ring-1 ${
                  errors.description 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#d0d5dd] focus:border-[#1a2340] focus:ring-[#1a2340]'
                }`}
                placeholder="Enter product description..."
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Used For */}
            <div className="space-y-1.5">
              <Label htmlFor="usedFor" className="text-sm font-medium text-[#344054] tracking-tight">
                Used For
              </Label>
              <div className={`bg-white border rounded-lg px-3.5 py-2.5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] ${
                errors.usedFor 
                  ? 'border-red-500' 
                  : 'border-[#d0d5dd]'
              }`}>
                <div className="flex flex-wrap gap-1.5 items-center">
                  {/* Existing Tags */}
                  {formData.usedFor.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="bg-white border border-[#d0d5dd] text-[#344054] text-sm font-medium px-2 py-0.5 rounded-md flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-gray-100 rounded-sm p-0.5"
                      >
                        <X className="w-3 h-3 text-[#98a2b3]" />
                      </button>
                    </Badge>
                  ))}
                  
                  {/* Add New Tag Input */}
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onBlur={addTag}
                    placeholder="Add tag..."
                    className="flex-1 min-w-[80px] outline-none text-sm text-[#98a2b3] placeholder:text-[#98a2b3] bg-transparent"
                  />
                </div>
              </div>
              {errors.usedFor && (
                <p className="text-sm text-red-600">{errors.usedFor}</p>
              )}
            </div>

            {/* Loan Amount Range */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#344054] tracking-tight">
                Loan Amount Range
              </Label>
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                {/* Minimum Amount */}
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-[#667085]">Minimum</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                    <Input
                      type="text"
                      value={formData.loanAmountMin}
                      onChange={(e) => updateFormData('loanAmountMin', e.target.value)}
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg 
                               text-[#667085] placeholder:text-[#667085]
                               shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                               focus:ring-1 ${
                        errors.loanAmountMin 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-[#d0d5dd] focus:border-[#1a2340] focus:ring-[#1a2340]'
                      }`}
                      placeholder="25,000"
                      required
                    />
                  </div>
                  {errors.loanAmountMin && (
                    <p className="text-sm text-red-600">{errors.loanAmountMin}</p>
                  )}
                </div>

                {/* Maximum Amount */}
                <div className="flex-1 space-y-1">
                  <Label className="text-xs text-[#667085]">Maximum</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667085]" />
                    <Input
                      type="text"
                      value={formData.loanAmountMax}
                      onChange={(e) => updateFormData('loanAmountMax', e.target.value)}
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border rounded-lg 
                               text-[#667085] placeholder:text-[#667085]
                               shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                               focus:ring-1 ${
                        errors.loanAmountMax 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-[#d0d5dd] focus:border-[#1a2340] focus:ring-[#1a2340]'
                      }`}
                      placeholder="250,000"
                      required
                    />
                  </div>
                  {errors.loanAmountMax && (
                    <p className="text-sm text-red-600">{errors.loanAmountMax}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
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

export default CreditBoxBuilder;
