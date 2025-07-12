import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { DollarSign, CheckCircle2 } from 'lucide-react';

interface LoanDetails {
  amount: string;
  purpose: string;
  term: string;
  rate: string;
  monthlyPayment: string;
  balance: string;
  nextPayment: string;
  status: string;
}

interface LoanOverviewProps {
  loanDetails: LoanDetails;
}

export const LoanOverview: React.FC<LoanOverviewProps> = ({ loanDetails }) => {
  return (
    <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Loan Overview
        </CardTitle>
        <CardDescription>
          {loanDetails.purpose} - Approved {loanDetails.term}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{loanDetails.amount}</p>
            <p className="text-sm text-gray-600">Original Amount</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{loanDetails.balance}</p>
            <p className="text-sm text-gray-600">Current Balance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{loanDetails.monthlyPayment}</p>
            <p className="text-sm text-gray-600">Monthly Payment</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Loan Progress</span>
            <span>26% Paid</span>
          </div>
          <Progress value={26} className="h-3" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
          <div>
            <span className="text-gray-600">Interest Rate:</span>
            <span className="ml-2 font-medium">{loanDetails.rate}</span>
          </div>
          <div>
            <span className="text-gray-600">Term:</span>
            <span className="ml-2 font-medium">{loanDetails.term}</span>
          </div>
          <div>
            <span className="text-gray-600">Next Payment:</span>
            <span className="ml-2 font-medium">{loanDetails.nextPayment}</span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <Badge className="ml-2 bg-green-100 text-green-800">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Current
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 