import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft,
  User,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  Eye,
  BarChart3,
  Shield,
  Target,
  Users,
  CreditCard,
  Clock3
} from 'lucide-react';
import { LoanApplication, ApplicationInsight } from '../../types/loanApplications';
import { loanApplicationService } from '../../services/loanApplications';
import { useToast } from '../../hooks/use-toast';

interface ApplicationDetailProps {
  application: LoanApplication;
  onBack: () => void;
  onApplicationUpdate: (application: LoanApplication) => void;
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const insightSeverityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200'
};

export default function ApplicationDetail({ application, onBack, onApplicationUpdate }: ApplicationDetailProps) {
  const { toast } = useToast();
  const [insights, setInsights] = useState<ApplicationInsight[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [recommendation, setRecommendation] = useState<'approve' | 'reject' | 'review_required' | null>(
    application.recommendation
  );
  const [notes, setNotes] = useState(application.analystNotes);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadInsights();
  }, [application.id]);

  const loadInsights = async () => {
    try {
      setIsLoadingInsights(true);
      const data = await loanApplicationService.getApplicationInsights(application.id);
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
      toast({
        title: "Error",
        description: "Failed to load application insights.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleRecommendationUpdate = async () => {
    if (!recommendation) {
      toast({
        title: "Error",
        description: "Please select a recommendation.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const updatedApplication = await loanApplicationService.updateApplicationRecommendation(
        application.id,
        recommendation,
        notes
      );
      onApplicationUpdate(updatedApplication);
      toast({
        title: "Success",
        description: "Recommendation updated successfully.",
      });
    } catch (error) {
      console.error('Error updating recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to update recommendation.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Medium Risk';
    return 'High Risk';
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'financial_statement':
        return <BarChart3 className="h-4 w-4" />;
      case 'tax_return':
        return <FileText className="h-4 w-4" />;
      case 'business_plan':
        return <Target className="h-4 w-4" />;
      case 'bank_statement':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Queue
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application #{application.id}</h1>
            <p className="text-sm text-gray-500">Submitted {formatDate(application.applicationDate)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={statusColors[application.status]}>
            {application.status.replace('_', ' ')}
          </Badge>
          <Badge className={priorityColors[application.priority]}>
            {application.priority} Priority
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Application Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Borrower</p>
                      <p className="text-lg font-semibold">{application.borrowerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Business</p>
                      <p className="text-lg font-semibold">{application.businessName}</p>
                      <p className="text-sm text-gray-500">{application.businessType}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                      <p className="text-lg font-semibold">{formatCurrency(application.loanAmount)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Purpose</p>
                      <p className="text-sm">{application.loanPurpose}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Business Performance Metrics</CardTitle>
              <CardDescription>Key financial indicators and business health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(application.businessMetrics.revenue)}
                  </p>
                  <p className="text-sm text-gray-500">Annual Revenue</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPercentage(application.businessMetrics.profitMargin)}
                  </p>
                  <p className="text-sm text-gray-500">Profit Margin</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(application.businessMetrics.cashFlow)}
                  </p>
                  <p className="text-sm text-gray-500">Cash Flow</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {application.businessMetrics.creditScore}
                  </p>
                  <p className="text-sm text-gray-500">Credit Score</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Business Age</span>
                  <span className="font-semibold">{application.businessMetrics.businessAge} years</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Employees</span>
                  <span className="font-semibold">{application.businessMetrics.employeeCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Debt/Equity</span>
                  <span className="font-semibold">{application.businessMetrics.debtToEquity.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Analysis & Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Analysis & Insights</CardTitle>
              <CardDescription>AI-generated insights and risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Risk Score</span>
                  <span className={`text-lg font-bold ${getRiskColor(application.riskScore)}`}>
                    {application.riskScore} - {getRiskLevel(application.riskScore)}
                  </span>
                </div>
                <Progress value={application.riskScore} className="h-2" />
              </div>

              {isLoadingInsights ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`p-4 border rounded-lg ${insightSeverityColors[insight.severity]}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{insight.title}</h4>
                          <p className="text-sm opacity-90">{insight.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {insight.category.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {insight.type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {insights.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No insights available for this application.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Supporting documentation for this application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {application.documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      {getDocumentIcon(document.type)}
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-gray-500">
                          {document.type.replace('_', ' ')} • Uploaded {formatDate(document.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
                
                {application.documents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No documents uploaded for this application.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recommendation Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
              <CardDescription>Make your decision and add notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="recommendation">Decision</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={recommendation === 'approve' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setRecommendation('approve')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Recommend Approve
                  </Button>
                  <Button
                    variant={recommendation === 'reject' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setRecommendation('reject')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Recommend Reject
                  </Button>
                  <Button
                    variant={recommendation === 'review_required' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setRecommendation('review_required')}
                  >
                    <Clock3 className="h-4 w-4 mr-2" />
                    Review Required
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Analyst Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add your analysis and reasoning..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleRecommendationUpdate}
                disabled={!recommendation || isSaving}
                className="w-full"
              >
                {isSaving ? 'Saving...' : 'Update Recommendation'}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Request Additional Info
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Escalate to Manager
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 