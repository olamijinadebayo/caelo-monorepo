
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLoanProducts } from '../../hooks/useLoanProducts';
import { useLoanApplications } from '../../hooks/useLoanApplications';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorDisplay } from '../ui/ErrorDisplay';
import { LoanProductCard } from './admin/LoanProductCard';
import { LoanProductForm } from './admin/LoanProductForm';
import ApplicationQueue from './ApplicationQueue';
import ApplicationDetail from './ApplicationDetail';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LoanProduct } from '../../lib/types';
import { LoanApplication } from '../../types/loanApplications';
import { Plus, Search } from 'lucide-react';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const {
    products,
    isLoading: productsLoading,
    error: productsError,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    duplicateProduct,
  } = useLoanProducts();
  
  const {
    applications,
    isLoading: applicationsLoading,
    error: applicationsError,
    updateApplicationStatus,
  } = useLoanApplications();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LoanProduct | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'products'>('products');
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [lastEditedProductId, setLastEditedProductId] = useState<string | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = async (productData: Omit<LoanProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createProduct(productData);
      setIsCreateDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEditProduct = (product: LoanProduct) => {
    setEditingProduct(product);
    setIsCreateDialogOpen(true);
  };

  const handleSaveProduct = async (productData: Omit<LoanProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        // Set the last edited product ID for highlighting
        setLastEditedProductId(editingProduct.id);
        // Clear the highlight after 3 seconds
        setTimeout(() => setLastEditedProductId(null), 3000);
      } else {
        await createProduct(productData);
      }
      setIsCreateDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleToggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      await toggleProductStatus(productId, isActive);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDuplicateProduct = async (product: LoanProduct) => {
    try {
      await duplicateProduct(product);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (productsLoading) {
    return (
      <DashboardLayout title="Admin Dashboard" onLogout={logout}>
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  if (productsError || applicationsError) {
    return (
      <DashboardLayout title="Admin Dashboard" onLogout={logout}>
        <ErrorDisplay 
          error={productsError || applicationsError || 'An error occurred'} 
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Admin Dashboard" 
      subtitle="Manage loan products and applications"
      onLogout={logout}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'applications' | 'products')}>
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 p-1 rounded-lg shadow-sm">
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Loan Products
            </TabsTrigger>
            <TabsTrigger 
              value="applications"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Loan Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search loan products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                </div>
              </div>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Loan Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <LoanProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDuplicate={handleDuplicateProduct}
                  onDelete={handleDeleteProduct}
                  onToggleStatus={handleToggleProductStatus}
                  isHighlighted={lastEditedProductId === product.id}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-gray-200/50">
                  <p className="text-gray-600 text-lg">
                    {searchTerm ? 'No products found matching your search.' : 'No loan products created yet.'}
                  </p>
                  {!searchTerm && (
                    <p className="text-gray-500 text-sm mt-2">
                      Get started by creating your first loan product.
                    </p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            {selectedApplication ? (
              <ApplicationDetail
                application={selectedApplication}
                onBack={() => setSelectedApplication(null)}
                onApplicationUpdate={(updatedApplication) => {
                  setSelectedApplication(updatedApplication);
                  // Update the applications list
                  const updatedApplications = applications.map(app => 
                    app.id === updatedApplication.id ? updatedApplication : app
                  );
                  // Note: In a real app, you'd want to update the applications state here
                }}
              />
            ) : (
              <ApplicationQueue
                onApplicationSelect={setSelectedApplication}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <LoanProductForm
        product={editingProduct}
        isOpen={isCreateDialogOpen}
        onSave={handleSaveProduct}
        onCancel={() => {
          setIsCreateDialogOpen(false);
          setEditingProduct(null);
        }}
      />
    </DashboardLayout>
  );
}
