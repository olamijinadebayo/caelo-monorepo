import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { LoanApplication, ApplicationFilter } from '../../types/loanApplications';
import { loanApplicationService } from '../../services/loanApplications';
import { useToast } from '../../hooks/use-toast';

interface ApplicationQueueProps {
  onApplicationSelect: (application: LoanApplication) => void;
  selectedApplicationId?: string;
  highlightedApplicationId?: string | null;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const statusIcons = {
  pending: Clock,
  under_review: AlertTriangle,
  approved: CheckCircle,
  rejected: XCircle
};

export default function ApplicationQueue({ onApplicationSelect, selectedApplicationId, highlightedApplicationId }: ApplicationQueueProps) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'risk'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      const data = await loanApplicationService.getLoanApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load loan applications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortApplications = () => {
    let filtered = applications.filter(app => {
      const matchesSearch = 
        app.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.businessType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort applications
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.applicationDate).getTime();
          bValue = new Date(b.applicationDate).getTime();
          break;
        case 'amount':
          aValue = a.loanAmount;
          bValue = b.loanAmount;
          break;
        case 'risk':
          aValue = a.riskScore;
          bValue = b.riskScore;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    setFilteredApplications(filtered);
  };

  const handleSort = (field: 'date' | 'amount' | 'risk') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Queue</CardTitle>
          <CardDescription>Loading applications...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Application Queue</CardTitle>
            <CardDescription>
              {filteredApplications.length} of {applications.length} applications
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadApplications}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, business, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('date')}
                    className="h-auto p-0 font-medium"
                  >
                    Date
                    {sortBy === 'date' && (
                      sortOrder === 'asc' ? <TrendingUp className="ml-1 h-3 w-3" /> : <TrendingDown className="ml-1 h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('amount')}
                    className="h-auto p-0 font-medium"
                  >
                    Amount
                    {sortBy === 'amount' && (
                      sortOrder === 'asc' ? <TrendingUp className="ml-1 h-3 w-3" /> : <TrendingDown className="ml-1 h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('risk')}
                    className="h-auto p-0 font-medium"
                  >
                    Risk Score
                    {sortBy === 'risk' && (
                      sortOrder === 'asc' ? <TrendingUp className="ml-1 h-3 w-3" /> : <TrendingDown className="ml-1 h-3 w-3" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => {
                const StatusIcon = statusIcons[application.status];
                return (
                  <TableRow 
                    key={application.id}
                    className={`cursor-pointer hover:bg-gray-50 transition-all duration-300 ${
                      selectedApplicationId === application.id ? 'bg-blue-50' : ''
                    } ${
                      highlightedApplicationId === application.id 
                        ? 'bg-green-50 border-l-4 border-l-green-500 shadow-md animate-pulse' 
                        : ''
                    }`}
                    onClick={() => onApplicationSelect(application)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(application.applicationDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.borrowerName}</div>
                        <div className="text-sm text-gray-500">{application.businessType}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{application.businessName}</div>
                      <div className="text-sm text-gray-500">{application.loanPurpose}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                        {formatCurrency(application.loanAmount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getRiskColor(application.riskScore)}`}>
                        {application.riskScore}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[application.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[application.priority]}>
                        {application.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplicationSelect(application);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No applications found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 