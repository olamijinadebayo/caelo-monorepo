import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { LoanApplication } from '../../../types/loanApplications';
import { ArrowLeft, CheckCircle, XCircle, Clock, FileText, DollarSign, Building, User } from 'lucide-react';

interface ApplicationDetailProps {
  application: LoanApplication;
  onBack: () => void;
  onApplicationUpdate: (application: LoanApplication) => void;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  application,
  onBack,
  onApplicationUpdate,
}) => {
  const [status, setStatus] = useState(application.status);
  const [notes, setNotes] = useState('');

  const handleStatusUpdate = () => {
    const updatedApplication = {
      ...application,
      status,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onApplicationUpdate(updatedApplication);
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Queue
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Application Review</h2>
          <p className="text-sm text-gray-600">Review and update application status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Business Type</label>
                  <p className="text-sm text-gray-900">{application.businessType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Annual Revenue</label>
                  <p className="text-sm text-gray-900">${application.annualRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Credit Score</label>
                  <p className="text-sm text-gray-900">{application.creditScore}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">LendScore</label>
                  <p className="text-sm text-gray-900">{application.lendscore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Request */}
          <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Loan Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Requested Amount</label>
                  <p className="text-2xl font-bold text-gray-900">${application.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Purpose</label>
                  <p className="text-sm text-gray-900">{application.purpose}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {application.documents && application.documents.length > 0 ? (
                <div className="space-y-2">
                  {application.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-sm text-gray-900">{doc}</span>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No documents uploaded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Review Panel */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Review Decision</CardTitle>
              <CardDescription>Update application status and add notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Current Status</label>
                {getStatusBadge(application.status)}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">New Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Review Notes</label>
                <Textarea
                  placeholder="Add your review notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleStatusUpdate}
                className="w-full"
                disabled={status === application.status}
              >
                Update Status
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-0 shadow-sm bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                    <p className="text-xs text-gray-500">{application.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Under Review</p>
                    <p className="text-xs text-gray-500">In progress</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail; 