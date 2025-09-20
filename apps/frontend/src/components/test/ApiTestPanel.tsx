/**
 * API Test Panel Component
 * 
 * Comprehensive testing interface for all backend API endpoints.
 * Allows real-time testing of authentication, CRUD operations, and more.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import apiEnhanced, { 
  type User, 
  type LoanApplication, 
  type Transaction,
  type TeamNote,
  type Message,
  type DashboardStats
} from '@/services/apiEnhanced';

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
  endpoint: string;
}

const ApiTestPanel: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  
  // Auth state
  const [loginEmail, setLoginEmail] = useState('mike@cdfi.example.org');
  const [loginPassword, setLoginPassword] = useState('demo123');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Application form state
  const [newApp, setNewApp] = useState({
    business_name: 'Test Business',
    business_type: 'Retail',
    loan_amount: 25000,
    loan_purpose: 'Equipment purchase and working capital'
  });
  
  // Selected application for testing
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  
  // Message/Note content
  const [messageContent, setMessageContent] = useState('This is a test message from the frontend!');
  const [noteContent, setNoteContent] = useState('This is a test team note added via the API.');

  useEffect(() => {
    checkApiStatus();
    checkHealth();
    loadCurrentUser();
  }, []);

  const logResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
  };

  const executeTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsLoading(true);
    try {
      const data = await testFn();
      logResult({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        endpoint: testName
      });
      return data;
    } catch (error: any) {
      logResult({
        success: false,
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString(),
        endpoint: testName
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ===== UTILITY TESTS =====

  const checkApiStatus = () => {
    const status = apiEnhanced.getApiStatus();
    setApiStatus(status);
    setCurrentUser(status.user);
  };

  const checkHealth = async () => {
    try {
      const health = await executeTest('Health Check', () => apiEnhanced.healthCheck());
      setHealthStatus(health);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const testConnection = async () => {
    await executeTest('API Connection', () => apiEnhanced.testApiConnection());
  };

  // ===== AUTHENTICATION TESTS =====

  const testLogin = async () => {
    const authResponse = await executeTest('Login', () => 
      apiEnhanced.login(loginEmail, loginPassword)
    );
    setCurrentUser(authResponse.user);
    checkApiStatus();
  };

  const testRegister = async () => {
    const userData = {
      email: `test_${Date.now()}@example.com`,
      password: 'testpassword123',
      name: 'Test User',
      role: 'borrower',
      organization: 'Test Company'
    };
    await executeTest('Register User', () => apiEnhanced.register(userData));
  };

  const loadCurrentUser = async () => {
    if (apiEnhanced.isAuthenticated()) {
      try {
        const user = await executeTest('Get Current User', () => apiEnhanced.getCurrentUser());
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to load current user:', error);
      }
    }
  };

  const testLogout = async () => {
    await executeTest('Logout', () => apiEnhanced.logout());
    setCurrentUser(null);
    checkApiStatus();
  };

  // ===== APPLICATION CRUD TESTS =====

  const testCreateApplication = async () => {
    const application = await executeTest('Create Application', () => 
      apiEnhanced.createLoanApplication(newApp)
    );
    setSelectedAppId(application.id);
    await loadApplications();
  };

  const loadApplications = async () => {
    const response = await executeTest('Get Applications', () => 
      apiEnhanced.getLoanApplications({ page: 1, size: 10 })
    );
    setApplications(response.items);
    if (response.items.length > 0 && !selectedAppId) {
      setSelectedAppId(response.items[0].id);
    }
  };

  const testGetApplication = async () => {
    if (!selectedAppId) {
      alert('Please select an application first');
      return;
    }
    await executeTest('Get Single Application', () => 
      apiEnhanced.getLoanApplication(selectedAppId)
    );
  };

  const testUpdateApplication = async () => {
    if (!selectedAppId) {
      alert('Please select an application first');
      return;
    }
    await executeTest('Update Application', () => 
      apiEnhanced.updateLoanApplication(selectedAppId, {
        status: 'under_review',
        analyst_notes: 'Updated via API test - application looks good!'
      })
    );
  };

  // ===== TRANSACTION TESTS =====

  const testAddTransaction = async () => {
    if (!selectedAppId) {
      alert('Please select an application first');
      return;
    }
    await executeTest('Add Transaction', () => 
      apiEnhanced.addTransaction(selectedAppId, {
        transaction_date: new Date().toISOString(),
        type: 'inflow',
        category: 'Sales',
        description: 'Test transaction added via API',
        amount: 1500.75,
        source_account: 'Business Checking'
      })
    );
  };

  const testGetTransactions = async () => {
    if (!selectedAppId) {
      alert('Please select an application first');
      return;
    }
    await executeTest('Get Transactions', () => 
      apiEnhanced.getApplicationTransactions(selectedAppId)
    );
  };

  // ===== COMMUNICATION TESTS =====

  const testAddTeamNote = async () => {
    if (!selectedAppId) {
      alert('Please select an application first');
      return;
    }
    await executeTest('Add Team Note', () => 
      apiEnhanced.addTeamNote(selectedAppId, {
        content: noteContent,
        is_private: true
      })
    );
  };

  const testGetTeamNotes = async () => {
    if (!selectedAppId) {
      alert('Please select an application first');
      return;
    }
    await executeTest('Get Team Notes', () => 
      apiEnhanced.getApplicationTeamNotes(selectedAppId)
    );
  };

  const testSendMessage = async () => {
    if (!selectedAppId) {
      alert('Please select an application first');
      return;
    }
    await executeTest('Send Message', () => 
      apiEnhanced.sendMessage(selectedAppId, {
        content: messageContent
      })
    );
  };

  const testGetMessages = async () => {
    if (!selectedAppId) {
      alert('Please select an application first');
      return;
    }
    await executeTest('Get Messages', () => 
      apiEnhanced.getApplicationMessages(selectedAppId)
    );
  };

  // ===== DASHBOARD TESTS =====

  const testGetDashboardStats = async () => {
    await executeTest('Get Dashboard Stats', () => apiEnhanced.getDashboardStats());
  };

  const testGetUsers = async () => {
    await executeTest('Get Users List', () => apiEnhanced.getUsers({ limit: 10 }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🧪 Caelo API Test Panel</h1>
        <p className="text-gray-600">Comprehensive testing interface for all backend endpoints</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={healthStatus?.status === 'healthy' ? 'default' : 'destructive'}>
              {healthStatus?.status || 'Unknown'}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">{apiStatus?.baseURL}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={currentUser ? 'default' : 'secondary'}>
              {currentUser ? 'Authenticated' : 'Not Authenticated'}
            </Badge>
            {currentUser && (
              <div className="mt-1">
                <p className="text-xs font-medium">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.role}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Database</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={healthStatus?.database === 'connected' ? 'default' : 'destructive'}>
              {healthStatus?.database || 'Unknown'}
            </Badge>
            <p className="text-xs text-gray-500 mt-1">PostgreSQL</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Tabs */}
      <Tabs defaultValue="auth" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="auth">Auth</TabsTrigger>
          <TabsTrigger value="apps">Applications</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        {/* Authentication Tests */}
        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button onClick={testConnection} disabled={isLoading}>
                  Test Connection
                </Button>
                <Button onClick={checkHealth} disabled={isLoading}>
                  Health Check
                </Button>
                <Button onClick={testLogin} disabled={isLoading}>
                  Login
                </Button>
                <Button onClick={testRegister} disabled={isLoading} variant="outline">
                  Register New User
                </Button>
                <Button onClick={loadCurrentUser} disabled={isLoading} variant="outline">
                  Get Current User
                </Button>
                <Button onClick={testLogout} disabled={isLoading} variant="destructive">
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Application Tests */}
        <TabsContent value="apps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Application Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input
                    value={newApp.business_name}
                    onChange={(e) => setNewApp({ ...newApp, business_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Input
                    value={newApp.business_type}
                    onChange={(e) => setNewApp({ ...newApp, business_type: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loan Amount</Label>
                  <Input
                    type="number"
                    value={newApp.loan_amount}
                    onChange={(e) => setNewApp({ ...newApp, loan_amount: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Selected Application</Label>
                  <Select value={selectedAppId} onValueChange={setSelectedAppId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select application" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map(app => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.business_name} - ${app.loan_amount}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Loan Purpose</Label>
                <Textarea
                  value={newApp.loan_purpose}
                  onChange={(e) => setNewApp({ ...newApp, loan_purpose: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={testCreateApplication} disabled={isLoading}>
                  Create Application
                </Button>
                <Button onClick={loadApplications} disabled={isLoading} variant="outline">
                  Load Applications
                </Button>
                <Button onClick={testGetApplication} disabled={isLoading} variant="outline">
                  Get Single Application
                </Button>
                <Button onClick={testUpdateApplication} disabled={isLoading} variant="outline">
                  Update Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction Tests */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedAppId && (
                <Alert>
                  <AlertDescription>
                    Please select an application in the Applications tab first.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button onClick={testAddTransaction} disabled={isLoading || !selectedAppId}>
                  Add Test Transaction
                </Button>
                <Button onClick={testGetTransactions} disabled={isLoading || !selectedAppId} variant="outline">
                  Get Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Tests */}
        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Team Note Content</Label>
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Message Content</Label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={testAddTeamNote} disabled={isLoading || !selectedAppId}>
                  Add Team Note
                </Button>
                <Button onClick={testGetTeamNotes} disabled={isLoading || !selectedAppId} variant="outline">
                  Get Team Notes
                </Button>
                <Button onClick={testSendMessage} disabled={isLoading || !selectedAppId}>
                  Send Message
                </Button>
                <Button onClick={testGetMessages} disabled={isLoading || !selectedAppId} variant="outline">
                  Get Messages
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Tests */}
        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard & Analytics Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={testGetDashboardStats} disabled={isLoading}>
                  Get Dashboard Stats
                </Button>
                <Button onClick={testGetUsers} disabled={isLoading} variant="outline">
                  Get Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Results */}
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results (Last 10)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.length === 0 ? (
                  <p className="text-gray-500">No test results yet. Run some tests!</p>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={result.success ? 'default' : 'destructive'}>
                            {result.success ? '✅ Success' : '❌ Error'}
                          </Badge>
                          <span className="font-medium">{result.endpoint}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {result.error && (
                        <p className="text-sm text-red-600 mb-2">{result.error}</p>
                      )}
                      
                      {result.data && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-600">View Data</summary>
                          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiTestPanel;
