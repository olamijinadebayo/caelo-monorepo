import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Switch } from '../ui/switch';
import { Logo } from '../ui/logo';
import { Info, Target, TrendingUp, Users } from 'lucide-react';

interface LoanBuilderStep3Props {
  onNext: (data: LoanBuilderStep3Data) => void;
  onBack: () => void;
  initialData?: LoanBuilderStep3Data;
}

export interface LoanBuilderStep3Data {
  creditScoreMin: string;
  dtiRatio: string;
  cashFlowRequirement: string;
  collateralRequired: boolean;
  personalGuaranteeRequired: boolean;
  bankStatementMonths: string;
  riskTolerance: string;
  autoApprovalThreshold: string;
}

const LoanBuilderStep3: React.FC<LoanBuilderStep3Props> = ({
  onNext,
  onBack,
  initialData
}) => {
  const [formData, setFormData] = useState<LoanBuilderStep3Data>({
    creditScoreMin: initialData?.creditScoreMin || '600',
    dtiRatio: initialData?.dtiRatio || '40',
    cashFlowRequirement: initialData?.cashFlowRequirement || '1.25',
    collateralRequired: initialData?.collateralRequired ?? false,
    personalGuaranteeRequired: initialData?.personalGuaranteeRequired ?? true,
    bankStatementMonths: initialData?.bankStatementMonths || '12',
    riskTolerance: initialData?.riskTolerance || 'moderate',
    autoApprovalThreshold: initialData?.autoApprovalThreshold || '85'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const updateFormData = (field: keyof LoanBuilderStep3Data, value: string | boolean) => {
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
              Credit Box Builder
            </h1>
            <p className="text-base text-[#525866] leading-6 max-w-[500px]">
              Define underwriting criteria and risk parameters for automated decision-making
            </p>
          </div>

          {/* Credit Criteria */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9 flex items-center gap-2">
              <Target className="w-6 h-6 text-[#1a2340]" />
              Credit Criteria
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Minimum Credit Score */}
              <div className="space-y-1.5">
                <Label htmlFor="creditScore" className="text-sm font-medium text-[#344054] tracking-tight">
                  Minimum Credit Score:
                </Label>
                <Input
                  id="creditScore"
                  type="text"
                  value={formData.creditScoreMin}
                  onChange={(e) => updateFormData('creditScoreMin', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085]
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                  placeholder="600"
                />
              </div>

              {/* DTI Ratio */}
              <div className="space-y-1.5">
                <Label htmlFor="dtiRatio" className="text-sm font-medium text-[#344054] tracking-tight">
                  Max Debt-to-Income %:
                </Label>
                <Input
                  id="dtiRatio"
                  type="text"
                  value={formData.dtiRatio}
                  onChange={(e) => updateFormData('dtiRatio', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085]
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                  placeholder="40"
                />
              </div>
            </div>
          </div>

          {/* Cash Flow Analysis */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#1a2340]" />
              Cash Flow Analysis
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Cash Flow Requirement */}
              <div className="space-y-1.5">
                <Label htmlFor="cashFlow" className="text-sm font-medium text-[#344054] tracking-tight">
                  Min Cash Flow Ratio:
                </Label>
                <Input
                  id="cashFlow"
                  type="text"
                  value={formData.cashFlowRequirement}
                  onChange={(e) => updateFormData('cashFlowRequirement', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085]
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                  placeholder="1.25"
                />
                <p className="text-xs text-[#667085]">
                  Monthly cash flow ÷ Monthly debt service
                </p>
              </div>

              {/* Bank Statement Period */}
              <div className="space-y-1.5">
                <Label htmlFor="bankStatements" className="text-sm font-medium text-[#344054] tracking-tight">
                  Bank Statement Period:
                </Label>
                <Select
                  value={formData.bankStatementMonths}
                  onValueChange={(value) => updateFormData('bankStatementMonths', value)}
                >
                  <SelectTrigger className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                    <SelectItem value="24">24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Risk & Security */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#1a2340]" />
              Risk & Security Requirements
            </h2>
            
            <div className="space-y-4">
              {/* Collateral Required */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-[#344054] tracking-tight">
                    Collateral Required
                  </Label>
                  <p className="text-xs text-[#667085]">
                    Require business assets as collateral
                  </p>
                </div>
                <Switch
                  checked={formData.collateralRequired}
                  onCheckedChange={(checked) => updateFormData('collateralRequired', checked)}
                />
              </div>

              {/* Personal Guarantee */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-[#344054] tracking-tight">
                    Personal Guarantee Required
                  </Label>
                  <p className="text-xs text-[#667085]">
                    Require personal guarantee from business owner
                  </p>
                </div>
                <Switch
                  checked={formData.personalGuaranteeRequired}
                  onCheckedChange={(checked) => updateFormData('personalGuaranteeRequired', checked)}
                />
              </div>
            </div>
          </div>

          {/* Risk Tolerance */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9">
              Risk Tolerance
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Risk Level */}
              <div className="space-y-1.5">
                <Label htmlFor="riskTolerance" className="text-sm font-medium text-[#344054] tracking-tight">
                  Risk Level:
                </Label>
                <Select
                  value={formData.riskTolerance}
                  onValueChange={(value) => updateFormData('riskTolerance', value)}
                >
                  <SelectTrigger className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative (Lower risk, lower returns)</SelectItem>
                    <SelectItem value="moderate">Moderate (Balanced risk-return)</SelectItem>
                    <SelectItem value="aggressive">Aggressive (Higher risk, higher returns)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Auto-Approval Threshold */}
              <div className="space-y-1.5">
                <Label htmlFor="autoApproval" className="text-sm font-medium text-[#344054] tracking-tight">
                  Auto-Approval Score:
                </Label>
                <Input
                  id="autoApproval"
                  type="text"
                  value={formData.autoApprovalThreshold}
                  onChange={(e) => updateFormData('autoApprovalThreshold', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085]
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                  placeholder="85"
                />
                <p className="text-xs text-[#667085]">
                  Applications above this score are automatically approved
                </p>
              </div>
            </div>

            {/* Info Alert */}
            <Alert className="bg-[#fcfcfd] border border-[#d0d5dd] rounded-lg p-4">
              <Info className="h-5 w-5 text-[#344054]" />
              <div className="space-y-1">
                <AlertTitle className="text-sm font-medium text-[#344054]">
                  AI-Powered Risk Assessment
                </AlertTitle>
                <AlertDescription className="text-sm text-[#475467] leading-5">
                  Caelo's credit box uses machine learning to analyze traditional credit metrics alongside 
                  alternative data sources including bank transactions, industry trends, and local market 
                  conditions. This comprehensive approach reduces bias while improving approval rates for 
                  creditworthy borrowers who might not meet traditional criteria.
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

export default LoanBuilderStep3;
