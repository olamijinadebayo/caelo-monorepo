import React, { useState } from 'react';
import LoanBuilderStep1, { LoanBuilderStep1Data } from './LoanBuilderStep1';
import CreditBoxBuilder, { CreditBoxBuilderData } from './CreditBoxBuilder';
import LoanProductConfiguration, { LoanProductConfigurationData } from './LoanProductConfiguration';
import PreviewModal from './PreviewModal';

interface LoanBuilderFlowData {
  step1?: LoanBuilderStep1Data;
  step2?: CreditBoxBuilderData;
  step3?: LoanProductConfigurationData;
}

interface LoanBuilderFlowProps {
  onComplete: (
    step1Data: LoanBuilderStep1Data,
    step2Data: CreditBoxBuilderData, 
    step3Data: LoanProductConfigurationData
  ) => void;
  onExit: () => void;
}

const LoanBuilderFlow: React.FC<LoanBuilderFlowProps> = ({ onComplete, onExit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [flowData, setFlowData] = useState<LoanBuilderFlowData>({});

  const handleStep1Next = (data: LoanBuilderStep1Data) => {
    setFlowData(prev => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (data: CreditBoxBuilderData) => {
    setFlowData(prev => ({ ...prev, step2: data }));
    setCurrentStep(3);
  };

  const handleStep3Next = (data: LoanProductConfigurationData) => {
    setFlowData(prev => ({ ...prev, step3: data }));
    setCurrentStep(4);
  };

  const handleComplete = () => {
    // Call the parent's onComplete with all the data
    if (flowData.step1 && flowData.step2 && flowData.step3) {
      onComplete(flowData.step1, flowData.step2, flowData.step3);
      // You could also show a success toast here
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      // On step 1, go back to loan products page
      onExit();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LoanBuilderStep1
            onNext={handleStep1Next}
            onBack={handleBack}
            initialData={flowData.step1}
          />
        );
      case 2:
        return (
          <CreditBoxBuilder
            onNext={handleStep2Next}
            onBack={handleBack}
            initialData={flowData.step2}
          />
        );
      case 3:
        return (
          <LoanProductConfiguration
            onNext={handleStep3Next}
            onBack={handleBack}
            initialData={flowData.step3}
          />
        );
      case 4:
        if (!flowData.step1 || !flowData.step2 || !flowData.step3) {
          // If somehow we got to step 4 without completing previous steps, go back
          setCurrentStep(1);
          return null;
        }
        return (
          <PreviewModal
            step1Data={flowData.step1}
            step2Data={flowData.step2}
            step3Data={flowData.step3}
            onSave={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return renderCurrentStep();
};

export default LoanBuilderFlow;
