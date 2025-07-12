import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { LucideIcon } from 'lucide-react';

interface Metric {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

interface PortfolioMetricsProps {
  metrics: Metric[];
}

export const PortfolioMetrics: React.FC<PortfolioMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
              </div>
              <div className={`p-2 rounded-lg bg-gray-50 ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 