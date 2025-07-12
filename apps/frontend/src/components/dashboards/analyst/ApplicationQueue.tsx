import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { LoanApplication } from '../../../types/loanApplications';
import { Search, Filter, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ApplicationQueueProps {
  onApplicationSelect: (application: LoanApplication) => void;
}

const ApplicationQueue: React.FC<ApplicationQueueProps> = ({ onApplicationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in real app this would come from props or context
  const applications: LoanApplication[] = [
    {
      id: '1',
      borrowerId: 'b1',
      productId: 'p1',
      amount: 25000,
      purpose: 'Working capital',
      status: 'pending',
      businessType: 'Retail',
      annualRevenue: 150000,
      creditScore: 720,
      lendscore: 85,
      documents: [],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      borrowerId: 'b2',
      productId: 'p1',
      amount: 50000,
      purpose: 'Equipment purchase',
      status: 'approved',
      businessType: 'Manufacturing',
      annualRevenue: 300000,
      creditScore: 750,
      lendscore: 90,
      documents: [],
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14',
    },
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.businessType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Application Queue</CardTitle>
            <CardDescription>
              Review and manage loan applications
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900">
                    {application.businessType} - ${application.amount.toLocaleString()}
                  </h3>
                  {getStatusBadge(application.status)}
                </div>
                <p className="text-sm text-gray-600 mb-1">{application.purpose}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Revenue: ${application.annualRevenue.toLocaleString()}</span>
                  <span>Credit Score: {application.creditScore}</span>
                  <span>LendScore: {application.lendscore}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApplicationSelect(application)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Review
              </Button>
            </div>
          ))}
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No applications found matching your criteria.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationQueue; 