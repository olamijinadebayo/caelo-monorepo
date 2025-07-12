import { useState, useEffect, useCallback } from 'react';
import { LoanProduct } from '../lib/types';
import { loanProductService } from '../services/loanProducts';
import { useToast } from './use-toast';

export const useLoanProducts = () => {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await loanProductService.getLoanProducts();
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load loan products';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createProduct = useCallback(async (product: Omit<LoanProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct = await loanProductService.createLoanProduct(product);
      setProducts(prev => [...prev, newProduct]);
      toast({
        title: "Success",
        description: "Loan product created successfully.",
      });
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create loan product';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const updateProduct = useCallback(async (id: string, updates: Partial<LoanProduct>) => {
    try {
      const updatedProduct = await loanProductService.updateLoanProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      toast({
        title: "Success",
        description: "Loan product updated successfully.",
      });
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update loan product';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await loanProductService.deleteLoanProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Loan product deleted successfully.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete loan product';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const toggleProductStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      const updatedProduct = await loanProductService.toggleLoanProductStatus(id, isActive);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      toast({
        title: "Success",
        description: "Product status updated successfully.",
      });
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product status';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  const duplicateProduct = useCallback(async (product: LoanProduct) => {
    try {
      const duplicatedProduct = {
        ...product,
        name: `${product.name} (Copy)`,
      };
      delete duplicatedProduct.id;
      delete duplicatedProduct.createdAt;
      delete duplicatedProduct.updatedAt;
      
      const newProduct = await loanProductService.createLoanProduct(duplicatedProduct);
      setProducts(prev => [...prev, newProduct]);
      toast({
        title: "Success",
        description: "Loan product duplicated successfully.",
      });
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate loan product';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  }, [toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    isLoading,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    duplicateProduct,
  };
}; 