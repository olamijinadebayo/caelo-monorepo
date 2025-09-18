import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Logo } from '../ui/logo';
import { 
  Info, 
  CheckCircle, 
  DollarSign, 
  Percent, 
  Calendar, 
  FileText, 
  Target,
  Sparkles
} from 'lucide-react';
import type { LoanBuilderStep1Data } from './LoanBuilderStep1';
import type { LoanBuilderStep2Data } from './LoanBuilderStep2';
import type { LoanBuilderStep3Data } from './LoanBuilderStep3';
import type { LoanBuilderStep4Data } from './LoanBuilderStep4';

interface LoanBuilderStep5Props {
  onComplete: () => void;
  onBack: () => void;
  step1Data: LoanBuilderStep1Data;
  step2Data: LoanBuilderStep2Data;
  step3Data: LoanBuilderStep3Data;
  step4Data: LoanBuilderStep4Data;
}

const LoanBuilderStep5: React.FC<LoanBuilderStep5Props> = ({
  onComplete,
  onBack,
  step1Data,
  step2Data,
  step3Data,
  step4Data
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleFinalize = async () => {
    setIsCreating(true);
    
    try {
      // Simulate API call to create loan product
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success and redirect
      onComplete();
    } catch (error) {
      console.error('Failed to create loan product:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const requiredDocumentLabels: Record<string, string> = {
    'bankStatements': 'Bank Statements (12 months)',
    'taxReturns': 'Tax Returns (2 years)',
    'businessLicense': 'Business License',
    'financialStatements': 'Financial Statements',
    'businessPlan': 'Business Plan',
    'personalId': 'Personal Identification',
    'voicingForm': 'Voicing & Disclosure Form'
  };

  const optionalDocumentLabels: Record<string, string> = {
    'cashFlowProjections': 'Cash Flow Projections',
    'leaseAgreement': 'Lease Agreement',
    'customerContracts': 'Customer Contracts',
    'insurance': 'Insurance Documents',
    'collateralInfo': 'Collateral Information',
    'references': 'Trade References'
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
      <div className="flex-1 p-8">
        <div className="w-full max-w-[800px] mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-medium text-black tracking-tight leading-[60px]">
              Review & Finalize
            </h1>
            <p className="text-base text-[#525866] leading-6">
              Review your loan product configuration before launching
            </p>
          </div>

          {/* Success Message */}
          <Alert className="bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="space-y-1">
              <AlertTitle className="text-sm font-medium text-green-800">
                Configuration Complete!
              </AlertTitle>
              <AlertDescription className="text-sm text-green-700 leading-5">
                Your loan product "{step1Data.productName}" is ready for launch. Review the details below and click "Launch Product" to make it available to borrowers.
              </AlertDescription>
            </div>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Overview */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-[#344054]">
                  <Sparkles className="w-5 h-5 text-[#1a2340]" />
                  Product Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-[#344054] mb-1">Product Name</h3>
                  <p className="text-[#667085]">{step1Data.productName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-[#344054] mb-1">Eligibility</h3>
                  <div className="text-sm text-[#667085] space-y-1">
                    <p>• Min Revenue: ${step1Data.minimumAnnualRevenue}</p>
                    <p>• Time in Business: {step1Data.timeInBusiness} {step1Data.timeInBusinessUnit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Terms */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-[#344054]">
                  <DollarSign className="w-5 h-5 text-[#1a2340]" />
                  Loan Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-[#344054] mb-1">Amount Range</h3>
                    <p className="text-[#667085]">${step2Data.minLoanAmount} - ${step2Data.maxLoanAmount}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#344054] mb-1">Interest Rate</h3>
                    <p className="text-[#667085]">{step2Data.interestRateMin}% - {step2Data.interestRateMax}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-[#344054] mb-1">Term Length</h3>
                    <p className="text-[#667085]">{step2Data.termMin} - {step2Data.termMax} {step2Data.termUnit}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#344054] mb-1">Fee Structure</h3>
                    <p className="text-[#667085] capitalize">{step2Data.feeStructure.replace('_', ' ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Criteria */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-[#344054]">
                  <Target className="w-5 h-5 text-[#1a2340]" />
                  Credit Box
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-[#344054] mb-1">Min Credit Score</h3>
                    <p className="text-[#667085]">{step3Data.creditScoreMin}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#344054] mb-1">Max DTI Ratio</h3>
                    <p className="text-[#667085]">{step3Data.dtiRatio}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-[#344054] mb-1">Cash Flow Ratio</h3>
                    <p className="text-[#667085]">{step3Data.cashFlowRequirement}x</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-[#344054] mb-1">Risk Level</h3>
                    <Badge variant="outline" className="capitalize">
                      {step3Data.riskTolerance}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-[#344054] mb-1">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {step3Data.collateralRequired && (
                      <Badge variant="secondary">Collateral Required</Badge>
                    )}
                    {step3Data.personalGuaranteeRequired && (
                      <Badge variant="secondary">Personal Guarantee</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-[#344054]">
                  <FileText className="w-5 h-5 text-[#1a2340]" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-[#344054] mb-2">Required ({step4Data.requiredDocuments.length})</h3>
                  <div className="flex flex-wrap gap-1">
                    {step4Data.requiredDocuments.map((docId) => (
                      <Badge key={docId} variant="default" className="text-xs">
                        {requiredDocumentLabels[docId] || docId}
                      </Badge>
                    ))}
                  </div>
                </div>
                {step4Data.optionalDocuments.length > 0 && (
                  <div>
                    <h3 className="font-medium text-[#344054] mb-2">Optional ({step4Data.optionalDocuments.length})</h3>
                    <div className="flex flex-wrap gap-1">
                      {step4Data.optionalDocuments.map((docId) => (
                        <Badge key={docId} variant="outline" className="text-xs">
                          {optionalDocumentLabels[docId] || docId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {step4Data.customDocuments.length > 0 && (
                  <div>
                    <h3 className="font-medium text-[#344054] mb-2">Custom ({step4Data.customDocuments.length})</h3>
                    <div className="flex flex-wrap gap-1">
                      {step4Data.customDocuments.map((doc, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Preview */}
          <Alert className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Info className="h-5 w-5 text-blue-600" />
            <div className="space-y-1">
              <AlertTitle className="text-sm font-medium text-blue-800">
                Caelo AI Analysis
              </AlertTitle>
              <AlertDescription className="text-sm text-blue-700 leading-5">
                Based on your configuration, this product is expected to have a <strong>78% approval rate</strong> and 
                <strong>4.2% default rate</strong>. The automated underwriting will process <strong>65%</strong> of 
                applications without manual review. Estimated time to first funding: <strong>3-5 business days</strong>.
              </AlertDescription>
            </div>
          </Alert>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-[#cdd0d5] px-8 py-6 flex items-center justify-between">
        <Button 
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isCreating}
          className="bg-white border border-[#d0d5dd] text-[#344054] text-sm font-medium px-3.5 py-2 rounded-lg shadow-sm"
        >
          Back
        </Button>
        <Button 
          onClick={handleFinalize}
          disabled={isCreating}
          className="bg-[#1a2340] text-[#fff5e6] hover:bg-[#111629] 
                   border border-[#fff5e6] rounded-lg px-6 py-2 
                   text-sm font-medium leading-5
                   shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                   disabled:opacity-50"
        >
          {isCreating ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Launching Product...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Launch Product
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LoanBuilderStep5;
