import React, { useState } from 'react';
import { StatusBadge } from '../ui/status-badge';
import type { ApplicationId } from '../../types/loanApplications';

interface Application {
  id: ApplicationId;
  applicationDate: string;
  status: 'approved' | 'rejected' | 'in-review' | 'active';
  statusText: string;
  loanType: string;
  loanOfficer: string;
  amount: string;
  underwriter: string;
  recommendation: string;
  lastUpdated: string;
  lastUpdatedTime: string;
}

interface ApplicationsTableProps {
  applications?: Application[];
  onApplicationClick?: (applicationId: ApplicationId) => void;
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({ 
  applications: propApplications,
  onApplicationClick 
}) => {
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Default applications data if none provided
  const applications: Application[] = propApplications || [
    {
      id: 'IDC1092EA23' as ApplicationId,
      applicationDate: '12/09/25',
      status: 'approved',
      statusText: 'Approved',
      loanType: 'Loan Product 1',
      loanOfficer: 'Caleb Mark',
      amount: '$20,000',
      underwriter: 'Emmanuella Areal',
      recommendation: 'Recommend-Reject',
      lastUpdated: '12/09/24',
      lastUpdatedTime: '12:09am'
    },
    {
      id: 'IDC1092EA27' as ApplicationId,
      applicationDate: '12/09/25',
      status: 'rejected',
      statusText: 'Rejected',
      loanType: 'Loan Product 1',
      loanOfficer: 'Caleb Mark',
      amount: '$35,000',
      underwriter: 'Jasper Smith',
      recommendation: 'Recommend-Accept',
      lastUpdated: '12/09/24',
      lastUpdatedTime: '12:09am'
    },
    {
      id: 'IDC1092EA25' as ApplicationId,
      applicationDate: '12/09/25',
      status: 'in-review',
      statusText: 'In-Review',
      loanType: 'Loan Product 1',
      loanOfficer: 'Caleb Mark',
      amount: '$25,000',
      underwriter: 'Nikolai Tesla',
      recommendation: 'Recommend-Accept',
      lastUpdated: '12/09/24',
      lastUpdatedTime: '12:09am'
    },
    {
      id: 'IDC1092EA28' as ApplicationId,
      applicationDate: '12/09/25',
      status: 'active',
      statusText: 'Active',
      loanType: 'Loan Product 1',
      loanOfficer: 'Caleb Mark',
      amount: '$45,000',
      underwriter: 'Tobias Shneider',
      recommendation: 'Recommend-Accept',
      lastUpdated: '12/09/24',
      lastUpdatedTime: '12:09am'
    },
    {
      id: 'IDC1092EA24' as ApplicationId,
      applicationDate: '12/09/25',
      status: 'active',
      statusText: 'Active',
      loanType: 'Loan Product 1',
      loanOfficer: 'Caleb Mark',
      amount: '$30,000',
      underwriter: 'Lila Say',
      recommendation: 'Recommend-Accept',
      lastUpdated: '12/09/24',
      lastUpdatedTime: '12:09am'
    },
    {
      id: 'IDC1092EA26' as ApplicationId,
      applicationDate: '12/09/25',
      status: 'active',
      statusText: 'Active',
      loanType: 'Loan Product 1',
      loanOfficer: 'Caleb Mark',
      amount: '$40,000',
      underwriter: 'Sofia Tinker',
      recommendation: 'Recommend-Accept',
      lastUpdated: '12/09/24',
      lastUpdatedTime: '12:09am'
    }
  ];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(new Set(applications.map(app => app.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectApplication = (id: string) => {
    const newSelected = new Set(selectedApplications);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedApplications(newSelected);
    setSelectAll(newSelected.size === applications.length);
  };

  const handleRowClick = (applicationId: ApplicationId) => {
    if (onApplicationClick) {
      onApplicationClick(applicationId);
    }
  };

  return (
    <section className="w-full flex flex-col items-stretch border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="flex items-start self-stretch bg-white overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="flex h-11 items-center gap-3 relative px-6 py-3 border-b-[#EAECF0] border-b border-solid">
                <div className="flex justify-center items-center relative">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-5 h-5 border relative bg-white rounded-md border-solid border-[#D0D5DD]"
                  />
                </div>
                <div className="flex items-center gap-1 relative">
                  <div className="text-[#667085] text-xs font-medium leading-[18px] relative">
                    <div className="font-normal text-xs text-[rgba(102,112,133,1)]">
                      Application ID
                    </div>
                  </div>
                  <div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ stroke: '#667085', strokeWidth: 1.33333, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }}>
                      <path d="M7.99998 3.33325V12.6666M7.99998 12.6666L12.6666 7.99992M7.99998 12.6666L3.33331 7.99992" stroke="#667085" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                </div>
              </th>
              <th className="text-left px-6 py-3 border-b-[#EAECF0] border-b border-solid bg-gray-50">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">
                  App. Date
                </div>
              </th>
              <th className="text-left px-6 py-3 border-b-[#EAECF0] border-b border-solid bg-gray-50">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">
                  Status
                </div>
              </th>
              <th className="text-left px-6 py-3 border-b-[#EAECF0] border-b border-solid bg-gray-50">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">
                  Loan Type
                </div>
              </th>
              <th className="text-left px-6 py-3 border-b-[#EAECF0] border-b border-solid bg-gray-50 w-[150px]">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">
                  Loan Officer
                </div>
              </th>
              <th className="text-left px-6 py-3 border-b-[#EAECF0] border-b border-solid bg-gray-50">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">
                  Amount
                </div>
              </th>
              <th className="text-left px-6 py-3 border-b-[#EAECF0] border-b border-solid bg-gray-50">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">
                  Underwriter
                </div>
              </th>
              <th className="text-left px-6 py-3 border-b-[#EAECF0] border-b border-solid bg-gray-50 flex-[1_0_0]">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">
                  Recommendation
                </div>
              </th>
              <th className="text-left px-6 py-3 border-b-[#EAECF0] border-b border-solid bg-gray-50">
                <div className="text-[#667085] text-xs font-medium leading-[18px]">
                  Last Updated
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application, index) => (
              <tr 
                key={`${application.id}-${index}`} 
                className="border-b-[#EAECF0] border-b border-solid hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(application.id)}
              >
                <td className="h-[72px] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedApplications.has(application.id)}
                      onChange={() => handleSelectApplication(application.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 border relative bg-white rounded-md border-solid border-[#D0D5DD]"
                    />
                    <div className="text-[#101828] text-sm font-medium leading-5">
                      {application.id}
                    </div>
                  </div>
                </td>
                <td className="h-[72px] px-6 py-4">
                  <div className="text-[#667085] text-sm font-normal leading-5">
                    {application.applicationDate}
                  </div>
                </td>
                <td className="h-[72px] px-6 py-4">
                  <StatusBadge status={application.status} text={application.statusText} />
                </td>
                <td className="h-[72px] px-6 py-4">
                  <div className="text-[#667085] text-sm font-normal leading-5">
                    {application.loanType}
                  </div>
                </td>
                <td className="h-[72px] px-6 py-4">
                  <div className="text-[#667085] text-sm font-normal leading-5">
                    {application.loanOfficer}
                  </div>
                </td>
                <td className="h-[72px] px-6 py-4">
                  <div className="text-[#101828] text-sm font-medium leading-5">
                    {application.amount}
                  </div>
                </td>
                <td className="h-[72px] px-6 py-4">
                  <div className="text-[#101828] text-sm font-medium leading-5">
                    {application.underwriter}
                  </div>
                </td>
                <td className="h-[72px] px-6 py-4">
                  <div className={`text-sm font-medium leading-5 ${
                    application.recommendation.includes('Reject') ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {application.recommendation}
                  </div>
                </td>
                <td className="h-[72px] px-6 py-4">
                  <div className="flex flex-col items-start">
                    <div className="text-[#101828] text-sm font-normal leading-5">
                      {application.lastUpdated}
                    </div>
                    <div className="text-[#667085] text-sm font-normal leading-5">
                      {application.lastUpdatedTime}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <footer className="flex justify-between items-center self-stretch relative pt-3 pb-4 px-6 border-t-[#EAECF0] border-t border-solid max-sm:flex-col max-sm:gap-3 max-sm:text-center">
        <button className="flex justify-center items-center gap-2 border shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] relative bg-white px-3.5 py-2 rounded-lg border-solid border-[#EAECF0] max-sm:w-full" disabled>
          <div className="text-[#D0D5DD] text-sm font-medium leading-5 relative">
            <div className="font-normal text-sm text-[rgba(208,213,221,1)]">
              Previous
            </div>
          </div>
        </button>
        <div className="text-[#344054] text-sm font-medium leading-5 relative">
          <div className="font-normal text-sm text-[rgba(52,64,84,1)]">
            Page 1 of 10
          </div>
        </div>
        <button className="flex justify-center items-center gap-2 border shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] relative bg-white px-3.5 py-2 rounded-lg border-solid border-[#D0D5DD] max-sm:w-full">
          <div className="text-[#344054] text-sm font-medium leading-5 relative">
            <div className="font-normal text-sm text-[rgba(52,64,84,1)]">
              Next
            </div>
          </div>
        </button>
      </footer>
    </section>
  );
};
