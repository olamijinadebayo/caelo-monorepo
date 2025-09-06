import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Logo } from '../ui/logo';
import { Info, FileText, Upload, CheckSquare } from 'lucide-react';

interface LoanBuilderStep4Props {
  onNext: (data: LoanBuilderStep4Data) => void;
  onBack: () => void;
  initialData?: LoanBuilderStep4Data;
}

export interface LoanBuilderStep4Data {
  requiredDocuments: string[];
  optionalDocuments: string[];
  customDocuments: string[];
  digitalSubmissionRequired: boolean;
  documentRetentionPeriod: string;
}

const LoanBuilderStep4: React.FC<LoanBuilderStep4Props> = ({
  onNext,
  onBack,
  initialData
}) => {
  const [formData, setFormData] = useState<LoanBuilderStep4Data>({
    requiredDocuments: initialData?.requiredDocuments || ['bankStatements', 'taxReturns', 'businessLicense'],
    optionalDocuments: initialData?.optionalDocuments || ['cashFlowProjections', 'leaseAgreement'],
    customDocuments: initialData?.customDocuments || [],
    digitalSubmissionRequired: initialData?.digitalSubmissionRequired ?? true,
    documentRetentionPeriod: initialData?.documentRetentionPeriod || '7'
  });

  const [newCustomDocument, setNewCustomDocument] = useState('');

  const requiredDocumentOptions = [
    { id: 'bankStatements', label: 'Bank Statements (12 months)', description: 'Business bank account statements' },
    { id: 'taxReturns', label: 'Tax Returns (2 years)', description: 'Business tax returns and personal tax returns' },
    { id: 'businessLicense', label: 'Business License', description: 'Current business license and registrations' },
    { id: 'financialStatements', label: 'Financial Statements', description: 'Profit & loss, balance sheet' },
    { id: 'businessPlan', label: 'Business Plan', description: 'Current business plan or summary' },
    { id: 'personalId', label: 'Personal Identification', description: 'Driver\'s license or passport' },
    { id: 'voicingForm', label: 'Voicing & Disclosure Form', description: 'Standard CDFI voicing requirements' }
  ];

  const optionalDocumentOptions = [
    { id: 'cashFlowProjections', label: 'Cash Flow Projections', description: '12-month cash flow forecast' },
    { id: 'leaseAgreement', label: 'Lease Agreement', description: 'Commercial property lease' },
    { id: 'customerContracts', label: 'Customer Contracts', description: 'Major customer agreements' },
    { id: 'insurance', label: 'Insurance Documents', description: 'Business and liability insurance' },
    { id: 'collateralInfo', label: 'Collateral Information', description: 'Asset valuations and titles' },
    { id: 'references', label: 'Trade References', description: 'Vendor and customer references' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const toggleDocument = (docId: string, isRequired: boolean) => {
    const field = isRequired ? 'requiredDocuments' : 'optionalDocuments';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(docId)
        ? prev[field].filter(id => id !== docId)
        : [...prev[field], docId]
    }));
  };

  const addCustomDocument = () => {
    if (newCustomDocument.trim() && !formData.customDocuments.includes(newCustomDocument.trim())) {
      setFormData(prev => ({
        ...prev,
        customDocuments: [...prev.customDocuments, newCustomDocument.trim()]
      }));
      setNewCustomDocument('');
    }
  };

  const removeCustomDocument = (doc: string) => {
    setFormData(prev => ({
      ...prev,
      customDocuments: prev.customDocuments.filter(d => d !== doc)
    }));
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
        <form onSubmit={handleSubmit} className="w-full max-w-[678px] space-y-12">
          {/* Header Section */}
          <div className="space-y-3">
            <h1 className="text-5xl font-medium text-black tracking-tight leading-[60px]">
              Documentation
            </h1>
            <p className="text-base text-[#525866] leading-6 max-w-[500px]">
              Define required and optional documents for loan applications
            </p>
          </div>

          {/* Required Documents */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#1a2340]" />
              Required Documents
            </h2>
            
            <div className="space-y-4">
              {requiredDocumentOptions.map((doc) => (
                <div key={doc.id} className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-[#d0d5dd]">
                  <Checkbox
                    id={`required-${doc.id}`}
                    checked={formData.requiredDocuments.includes(doc.id)}
                    onCheckedChange={() => toggleDocument(doc.id, true)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={`required-${doc.id}`}
                      className="text-sm font-medium text-[#344054] cursor-pointer"
                    >
                      {doc.label}
                    </Label>
                    <p className="text-xs text-[#667085] mt-1">
                      {doc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Documents */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9 flex items-center gap-2">
              <Upload className="w-6 h-6 text-[#1a2340]" />
              Optional Documents
            </h2>
            
            <div className="space-y-4">
              {optionalDocumentOptions.map((doc) => (
                <div key={doc.id} className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-[#d0d5dd]">
                  <Checkbox
                    id={`optional-${doc.id}`}
                    checked={formData.optionalDocuments.includes(doc.id)}
                    onCheckedChange={() => toggleDocument(doc.id, false)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={`optional-${doc.id}`}
                      className="text-sm font-medium text-[#344054] cursor-pointer"
                    >
                      {doc.label}
                    </Label>
                    <p className="text-xs text-[#667085] mt-1">
                      {doc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Documents */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9 flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-[#1a2340]" />
              Custom Documents
            </h2>
            
            {/* Add Custom Document */}
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newCustomDocument}
                onChange={(e) => setNewCustomDocument(e.target.value)}
                placeholder="Add custom document requirement..."
                className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                         text-[#667085] placeholder:text-[#667085]
                         shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                         focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
              />
              <Button
                type="button"
                onClick={addCustomDocument}
                className="bg-[#1a2340] text-[#fff5e6] hover:bg-[#111629] px-4 py-2.5 rounded-lg"
              >
                Add
              </Button>
            </div>

            {/* Custom Document List */}
            {formData.customDocuments.length > 0 && (
              <div className="space-y-2">
                {formData.customDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#d0d5dd]">
                    <span className="text-sm text-[#344054]">{doc}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomDocument(doc)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Settings */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-black leading-9">
              Document Settings
            </h2>
            
            <div className="space-y-4">
              {/* Digital Submission */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#d0d5dd]">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-[#344054] tracking-tight">
                    Digital Submission Required
                  </Label>
                  <p className="text-xs text-[#667085]">
                    All documents must be submitted electronically
                  </p>
                </div>
                <Checkbox
                  checked={formData.digitalSubmissionRequired}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    digitalSubmissionRequired: checked as boolean 
                  }))}
                />
              </div>

              {/* Document Retention */}
              <div className="space-y-1.5">
                <Label htmlFor="retention" className="text-sm font-medium text-[#344054] tracking-tight">
                  Document Retention Period (Years):
                </Label>
                <Input
                  id="retention"
                  type="text"
                  value={formData.documentRetentionPeriod}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    documentRetentionPeriod: e.target.value 
                  }))}
                  className="w-32 px-3.5 py-2.5 text-sm bg-white border border-[#d0d5dd] rounded-lg 
                           text-[#667085] placeholder:text-[#667085]
                           shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]
                           focus:border-[#1a2340] focus:ring-1 focus:ring-[#1a2340]"
                  placeholder="7"
                />
                <p className="text-xs text-[#667085]">
                  Legal requirement for CDFI compliance
                </p>
              </div>
            </div>

            {/* Info Alert */}
            <Alert className="bg-[#fcfcfd] border border-[#d0d5dd] rounded-lg p-4">
              <Info className="h-5 w-5 text-[#344054]" />
              <div className="space-y-1">
                <AlertTitle className="text-sm font-medium text-[#344054]">
                  Smart Document Processing
                </AlertTitle>
                <AlertDescription className="text-sm text-[#475467] leading-5">
                  Caelo automatically extracts and verifies key data points from uploaded documents using 
                  OCR and machine learning. This reduces manual review time while ensuring accuracy and 
                  compliance with CDFI documentation standards.
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

export default LoanBuilderStep4;
