
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { loanProductService, LoanProduct } from '../../services/loanProducts';
import { loanApplicationService } from '../../services/loanApplications';
import { LoanApplication } from '../../types/loanApplications';
import ApplicationQueue from './ApplicationQueue';
import ApplicationDetail from './ApplicationDetail';
import { 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Search, 
  Filter, 
  Settings, 
  Users, 
  FileText, 
  BarChart3,
  Building2,
  Calendar,
  DollarSign,
  Percent,
  Shield,
  CheckCircle,
  XCircle,
  ClipboardList,
  TrendingUp
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const businessTypes = [
  { code: '7225', name: 'Restaurant' },
  { code: '44-45', name: 'Retail' },
  { code: '23', name: 'Construction' },
  { code: '31-33', name: 'Manufacturing' },
  { code: '48-49', name: 'Transportation' },
  { code: '52', name: 'Finance and Insurance' },
  { code: '53', name: 'Real Estate' },
  { code: '54', name: 'Professional Services' },
  { code: '56', name: 'Administrative Services' },
  { code: '62', name: 'Healthcare' },
  { code: '71', name: 'Arts and Entertainment' },
  { code: '72', name: 'Accommodation and Food Services' }
];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LoanProduct | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'products'>('products');
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [highlightedApplicationId, setHighlightedApplicationId] = useState<string | null>(null);

  console.log('AdminDashboard component rendered, isLoading:', isLoading, 'loanProducts count:', loanProducts?.length || 0);

  useEffect(() => {
    console.log('AdminDashboard useEffect triggered');
    loadLoanProducts();
    loadApplications();
  }, []);

  const loadLoanProducts = async () => {
    try {
      console.log('Loading loan products...');
      setIsLoading(true);
      const products = await loanProductService.getLoanProducts();
      console.log('Products loaded:', products);
      setLoanProducts(products);
    } catch (error) {
      console.error('Error loading loan products:', error);
      toast({
        title: "Error",
        description: "Failed to load loan products.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const data = await loanApplicationService.getLoanApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load loan applications.",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = (loanProducts || []).filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleActive = async (productId: string) => {
    try {
      const product = loanProducts.find(p => p.id === productId);
      if (!product) return;
      
      const updatedProduct = await loanProductService.toggleLoanProductStatus(productId, !product.isActive);
      setLoanProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      toast({
        title: "Status Updated",
        description: "Loan product status has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await loanProductService.deleteLoanProduct(productId);
      setLoanProducts(prev => prev.filter(product => product.id !== productId));
      toast({
        title: "Product Deleted",
        description: "Loan product has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (product: LoanProduct) => {
    try {
      const duplicatedProduct = {
        ...product,
        name: `${product.name} (Copy)`,
      };
      delete duplicatedProduct.id;
      delete duplicatedProduct.createdAt;
      
      const newProduct = await loanProductService.createLoanProduct(duplicatedProduct);
      setLoanProducts(prev => [...prev, newProduct]);
      toast({
        title: "Product Duplicated",
        description: "Loan product has been duplicated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate product.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: LoanProduct) => {
    setEditingProduct(product);
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage loan products and configurations</p>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="mt-8">
            <div className="px-4">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'applications' 
                      ? 'text-gray-900 bg-gray-100' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <ClipboardList className="mr-3 h-5 w-5" />
                  Loan Applications
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'products' 
                      ? 'text-gray-900 bg-gray-100' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Loan Products
                </button>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                  <Users className="mr-3 h-5 w-5" />
                  Borrowers
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                  <BarChart3 className="mr-3 h-5 w-5" />
                  Analytics
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </a>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'applications' ? (
              // Applications View
              <div>
                {selectedApplication ? (
                  <ApplicationDetail
                    application={selectedApplication}
                    onBack={() => setSelectedApplication(null)}
                    onApplicationUpdate={(updatedApplication) => {
                      setApplications(prev => 
                        prev.map(app => app.id === updatedApplication.id ? updatedApplication : app)
                      );
                      setSelectedApplication(updatedApplication);
                      // Highlight the updated application when returning to queue
                      setHighlightedApplicationId(updatedApplication.id);
                      // Clear highlight after 3 seconds
                      setTimeout(() => {
                        setHighlightedApplicationId(null);
                      }, 3000);
                    }}
                  />
                ) : (
                  <ApplicationQueue
                    onApplicationSelect={setSelectedApplication}
                    selectedApplicationId={selectedApplication?.id}
                    highlightedApplicationId={highlightedApplicationId}
                  />
                )}
              </div>
            ) : (
              // Products View
              <div>
                {/* Page Header */}
                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Loan Products</h2>
                      <p className="text-sm text-gray-500">Create and manage loan products for your lending platform</p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Loan Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {editingProduct ? 'Edit Loan Product' : 'Create New Loan Product'}
                          </DialogTitle>
                          <DialogDescription>
                            Configure all parameters for your loan product. This will be used to determine borrower eligibility and loan terms.
                          </DialogDescription>
                        </DialogHeader>
                        <LoanProductForm 
                          product={editingProduct}
                          onSave={async (product) => {
                            try {
                              if (editingProduct) {
                                const updatedProduct = await loanProductService.updateLoanProduct({ ...product, id: editingProduct.id });
                                setLoanProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
                              } else {
                                const newProduct = await loanProductService.createLoanProduct(product);
                                setLoanProducts(prev => [...prev, newProduct]);
                              }
                              setIsCreateDialogOpen(false);
                              setEditingProduct(null);
                              toast({
                                title: editingProduct ? "Product Updated" : "Product Created",
                                description: `Loan product has been ${editingProduct ? 'updated' : 'created'} successfully.`,
                              });
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: `Failed to ${editingProduct ? 'update' : 'create'} product.`,
                                variant: "destructive",
                              });
                            }
                          }}
                          onCancel={() => {
                            setIsCreateDialogOpen(false);
                            setEditingProduct(null);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search loan products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Loan Products Grid */}
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading loan products...</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                <Badge variant={product.isActive ? "default" : "secondary"}>
                                  {product.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <CardDescription className="text-sm">
                                {product.description}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(product)}
                                data-testid="edit-button"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDuplicate(product)}
                                data-testid="duplicate-button"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                                data-testid="delete-button"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-500">Loan Range:</span>
                              <p>${product.loanParameters.minAmount.toLocaleString()} - ${product.loanParameters.maxAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Base Rate:</span>
                              <p>{product.loanParameters.baseInterestRate}%</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Terms:</span>
                              <p>{product.loanParameters.termOptions.join(', ')} months</p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Created: {product.createdAt}</span>
                              <Switch
                                checked={product.isActive}
                                onCheckedChange={() => handleToggleActive(product.id)}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredProducts.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No loan products</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by creating your first loan product.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Loan Product Form Component
interface LoanProductFormProps {
  product?: LoanProduct | null;
  onSave: (product: LoanProduct) => void;
  onCancel: () => void;
}

function LoanProductForm({ product, onSave, onCancel }: LoanProductFormProps) {
  const [formData, setFormData] = useState<Partial<LoanProduct>>(
    product || {
      name: '',
      description: '',
      isActive: true,
      eligibilityRequirements: {},
      loanParameters: {
        minAmount: 100,
        maxAmount: 250000,
        termOptions: [12, 24, 36],
        baseInterestRate: 8.5,
        riskSpread: [
          { lendscoreRange: '90+', spread: 0 },
          { lendscoreRange: '80-89', spread: 1 },
          { lendscoreRange: '70-79', spread: 2 },
          { lendscoreRange: '60-69', spread: 3 },
          { lendscoreRange: '<50', spread: 4 }
        ]
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.loanParameters) {
      onSave(formData as LoanProduct);
    }
  };

  const updateRiskSpread = (index: number, field: 'lendscoreRange' | 'spread', value: string | number) => {
    if (!formData.loanParameters?.riskSpread) return;
    
    const newRiskSpread = [...formData.loanParameters.riskSpread];
    newRiskSpread[index] = { ...newRiskSpread[index], [field]: value };
    
    setFormData(prev => ({
      ...prev,
      loanParameters: {
        ...prev.loanParameters!,
        riskSpread: newRiskSpread
      }
    }));
  };

  const addRiskSpreadRow = () => {
    if (!formData.loanParameters?.riskSpread) return;
    
    setFormData(prev => ({
      ...prev,
      loanParameters: {
        ...prev.loanParameters!,
        riskSpread: [...prev.loanParameters!.riskSpread, { lendscoreRange: '', spread: 0 }]
      }
    }));
  };

  const removeRiskSpreadRow = (index: number) => {
    if (!formData.loanParameters?.riskSpread) return;
    
    const newRiskSpread = formData.loanParameters.riskSpread.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      loanParameters: {
        ...prev.loanParameters!,
        riskSpread: newRiskSpread
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="parameters">Loan Parameters</TabsTrigger>
          <TabsTrigger value="risk">Risk Spread</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., River City Launchpad"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the loan product and its intended use"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </TabsContent>

        <TabsContent value="eligibility" className="space-y-4">
          <div>
            <Label htmlFor="timeInBusiness">Minimum Time in Business (months)</Label>
            <Input
              id="timeInBusiness"
              type="number"
              value={formData.eligibilityRequirements?.timeInBusiness || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                eligibilityRequirements: {
                  ...prev.eligibilityRequirements,
                  timeInBusiness: e.target.value ? parseInt(e.target.value) : undefined
                }
              }))}
              placeholder="Optional"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minCreditScore">Minimum Credit Score</Label>
              <Input
                id="minCreditScore"
                type="number"
                value={formData.eligibilityRequirements?.minCreditScore || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  eligibilityRequirements: {
                    ...prev.eligibilityRequirements,
                    minCreditScore: e.target.value ? parseInt(e.target.value) : undefined
                  }
                }))}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label htmlFor="maxCreditScore">Maximum Credit Score</Label>
              <Input
                id="maxCreditScore"
                type="number"
                value={formData.eligibilityRequirements?.maxCreditScore || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  eligibilityRequirements: {
                    ...prev.eligibilityRequirements,
                    maxCreditScore: e.target.value ? parseInt(e.target.value) : undefined
                  }
                }))}
                placeholder="Optional"
              />
            </div>
          </div>
          <div>
            <Label>Business Types (NAICS Codes)</Label>
            <div className="mt-2 space-y-2">
              {businessTypes.map((type) => (
                <div key={type.code} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`business-type-${type.code}`}
                    checked={formData.eligibilityRequirements?.businessTypes?.includes(`${type.name} - ${type.code}`) || false}
                    onChange={(e) => {
                      const currentTypes = formData.eligibilityRequirements?.businessTypes || [];
                      const newTypes = e.target.checked
                        ? [...currentTypes, `${type.name} - ${type.code}`]
                        : currentTypes.filter(t => t !== `${type.name} - ${type.code}`);
                      setFormData(prev => ({
                        ...prev,
                        eligibilityRequirements: {
                          ...prev.eligibilityRequirements,
                          businessTypes: newTypes
                        }
                      }));
                    }}
                  />
                  <Label htmlFor={`business-type-${type.code}`} className="text-sm">
                    {type.name} ({type.code})
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minAmount">Minimum Loan Amount ($)</Label>
              <Input
                id="minAmount"
                type="number"
                value={formData.loanParameters?.minAmount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  loanParameters: {
                    ...prev.loanParameters!,
                    minAmount: parseInt(e.target.value)
                  }
                }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="maxAmount">Maximum Loan Amount ($)</Label>
              <Input
                id="maxAmount"
                type="number"
                value={formData.loanParameters?.maxAmount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  loanParameters: {
                    ...prev.loanParameters!,
                    maxAmount: parseInt(e.target.value)
                  }
                }))}
                required
              />
            </div>
          </div>
          <div>
            <Label>Term Options (months)</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[3, 6, 12, 24, 36, 48, 60].map((term) => (
                <div key={term} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`term-${term}`}
                    checked={formData.loanParameters?.termOptions.includes(term) || false}
                    onChange={(e) => {
                      const currentTerms = formData.loanParameters?.termOptions || [];
                      const newTerms = e.target.checked
                        ? [...currentTerms, term]
                        : currentTerms.filter(t => t !== term);
                      setFormData(prev => ({
                        ...prev,
                        loanParameters: {
                          ...prev.loanParameters!,
                          termOptions: newTerms
                        }
                      }));
                    }}
                  />
                  <Label htmlFor={`term-${term}`} className="text-sm">{term.toString()}</Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="baseInterestRate">Base Interest Rate (%)</Label>
            <Input
              id="baseInterestRate"
              type="number"
              step="0.1"
              value={formData.loanParameters?.baseInterestRate}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                loanParameters: {
                  ...prev.loanParameters!,
                  baseInterestRate: parseFloat(e.target.value)
                }
              }))}
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div>
            <Label>Risk Spread Configuration</Label>
            <p className="text-sm text-gray-500 mb-4">
              Configure interest rate spreads based on lendscore ranges
            </p>
            <div className="space-y-3">
              {formData.loanParameters?.riskSpread.map((spread, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    placeholder="e.g., 90+"
                    value={spread.lendscoreRange}
                    onChange={(e) => updateRiskSpread(index, 'lendscoreRange', e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">lendscore</span>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={spread.spread}
                    onChange={(e) => updateRiskSpread(index, 'spread', parseFloat(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-500">% spread</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRiskSpreadRow(index)}
                    data-testid="remove-risk-tier"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRiskSpreadRow}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Risk Tier
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </DialogFooter>
    </form>
  );
}
