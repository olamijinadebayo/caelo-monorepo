import React from 'react';
import { Navbar } from '../shared/Navbar';
import { MetricCard } from '../dashboard/MetricCard';
import { FilterButtons } from '../dashboard/FilterButtons';
import { ApplicationsTable } from '../dashboard/ApplicationsTable';
import type { ApplicationId } from '../../types/loanApplications';

interface EnhancedLenderDashboardProps {
  onApplicationClick?: (applicationId: ApplicationId) => void;
}

export const EnhancedLenderDashboard: React.FC<EnhancedLenderDashboardProps> = ({ onApplicationClick }) => {

  const metrics = [
    {
      number: "10",
      title: "Approved Applications",
      subtitle: "$12,000"
    },
    {
      number: "10", 
      title: "Rejected Applications",
      subtitle: "$12,000"
    },
    {
      number: "10",
      title: "In-Review Applications", 
      subtitle: "$12,000"
    },
    {
      number: "10",
      title: "Applications Received",
      subtitle: "$12,000"
    },
    {
      number: "",
      title: "Average Time to Decision",
      subtitle: "20s"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Navbar 
        currentPage="dashboard"
      />
      
      <main className="w-full max-w-[1440px] mx-auto px-[50px] xl:px-[50px] lg:px-8 md:px-6 sm:px-4 flex-1">
        <div className="py-4 space-y-6 h-full">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-[#020617]">Dashboard</h1>
            <FilterButtons />
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                number={metric.number}
                title={metric.title}
                subtitle={metric.subtitle}
              />
            ))}
          </section>

          <div className="flex-1 min-h-0">
            <ApplicationsTable onApplicationClick={onApplicationClick} />
          </div>
        </div>
      </main>
    </div>
  );
};
