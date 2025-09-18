import React from 'react';
import { Button } from '../ui/button';

interface ApplicationData {
  applicationId: string;
  recommendation: string;
  borrowerId: string;
  applicationDate: string;
  loanType: string;
  loanOfficer: string;
  amountRequested: string;
  underwriter: string;
}

interface ApplicationCardProps {
  data: ApplicationData;
  onApprove: () => void;
  onReject: () => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ data, onApprove, onReject }) => {
  return (
    <div className="border bg-white min-w-60 w-full flex-1 shrink basis-[0%] p-6 rounded-2xl border-[#eaecf0] max-md:max-w-full max-md:px-5">
      <div className="flex w-full items-center gap-[40px_100px] font-medium justify-between flex-wrap max-md:max-w-full">
        <div className="self-stretch flex min-w-60 min-h-8 items-center gap-2 flex-wrap my-auto max-md:max-w-full">
          <h1 className="text-[#020617] text-2xl leading-none tracking-[-0.72px] self-stretch my-auto">
            Application #{data.applicationId}
          </h1>
          <div className="border-[#eaecf0] border bg-[#eaecf0] self-stretch w-0 shrink-0 h-8 border-solid" />
          <div className="self-stretch min-w-60 text-sm leading-none my-auto">
            <div className="flex items-center gap-3">
              <div className="text-[#667085] self-stretch my-auto">
                Recommendation:
              </div>
              <div className={`self-stretch my-auto ${
                data.recommendation.includes('Reject') ? 'text-red-600' : 'text-green-600'
              }`}>
                {data.recommendation}
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex items-center gap-[9px] text-base whitespace-nowrap my-auto">
          <Button
            onClick={onApprove}
            className="bg-[#1a2340] text-[#fff5e6] hover:bg-[#111629] 
                     border border-[#fff5e6] rounded-lg px-[18px] py-2.5 
                     text-base font-medium
                     shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
          >
            Approve
          </Button>
          <Button
            onClick={onReject}
            variant="outline"
            className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100 
                     rounded-lg px-[18px] py-2.5 text-base font-medium"
          >
            Reject
          </Button>
        </div>
      </div>

      <hr className="border-[#eaecf0] min-h-px w-full mt-6 max-md:max-w-full" />

      <div className="flex w-full gap-[40px_100px] text-sm font-medium leading-none justify-between flex-wrap mt-6 max-md:max-w-full">
        <div className="flex flex-col items-stretch justify-center w-[203px]">
          <div className="text-[#667085]">Borrower ID:</div>
          <div className="text-[#020617] mt-3">{data.borrowerId}</div>
        </div>
        <div className="flex flex-col items-stretch justify-center w-[203px]">
          <div className="text-[#667085]">Application Date:</div>
          <div className="text-[#020617] mt-3">{data.applicationDate}</div>
        </div>
        <div className="flex flex-col items-stretch justify-center w-[203px]">
          <div className="text-[#667085]">Loan Type:</div>
          <div className="text-[#020617] mt-3">{data.loanType}</div>
        </div>
      </div>

      <div className="flex w-full gap-[40px_100px] text-sm font-medium leading-none justify-between flex-wrap mt-6 max-md:max-w-full">
        <div className="flex flex-col items-stretch justify-center w-[203px]">
          <div className="text-[#667085]">Loan Officer:</div>
          <div className="text-[#020617] mt-3">{data.loanOfficer}</div>
        </div>
        <div className="flex flex-col items-stretch justify-center w-[203px]">
          <div className="text-[#667085]">Amount Requested:</div>
          <div className="text-[#020617] mt-3">{data.amountRequested}</div>
        </div>
        <div className="flex flex-col items-stretch justify-center w-[203px]">
          <div className="text-[#667085]">Underwriter:</div>
          <div className="text-[#020617] mt-3">{data.underwriter}</div>
        </div>
      </div>
    </div>
  );
};
