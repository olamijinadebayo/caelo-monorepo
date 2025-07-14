import { AuthService } from './auth';

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  eligibilityRequirements: {
    timeInBusiness?: number;
    minCreditScore?: number;
    maxCreditScore?: number;
    businessTypes?: string[];
  };
  loanParameters: {
    minAmount: number;
    maxAmount: number;
    termOptions: number[];
    baseInterestRate: number;
    riskSpread: Array<{
      lendscoreRange: string;
      spread: number;
    }>;
  };
}

export interface CreateLoanProductRequest {
  name: string;
  description: string;
  isActive: boolean;
  eligibilityRequirements: {
    timeInBusiness?: number;
    minCreditScore?: number;
    maxCreditScore?: number;
    businessTypes?: string[];
  };
  loanParameters: {
    minAmount: number;
    maxAmount: number;
    termOptions: number[];
    baseInterestRate: number;
    riskSpread: Array<{
      lendscoreRange: string;
      spread: number;
    }>;
  };
}

export interface UpdateLoanProductRequest extends CreateLoanProductRequest {
  id: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class LoanProductService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getLoanProducts(): Promise<LoanProduct[]> {
    try {
      console.log('Attempting to fetch loan products from API...');
      const response = await fetch(`${API_BASE_URL}/api/loan-products`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const products = await response.json();
      console.log('API returned products:', products);
      return products;
    } catch (error) {
      console.warn('API unavailable, using local storage:', error);
      const localProducts = this.getLocalLoanProducts();
      console.log('Local storage products:', localProducts);
      return localProducts;
    }
  }

  async createLoanProduct(product: CreateLoanProductRequest): Promise<LoanProduct> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/loan-products`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdProduct = await response.json();
      this.saveLocalLoanProduct(createdProduct);
      return createdProduct;
    } catch (error) {
      console.warn('API unavailable, saving to local storage:', error);
      const localProduct: LoanProduct = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      this.saveLocalLoanProduct(localProduct);
      return localProduct;
    }
  }

  async updateLoanProduct(product: UpdateLoanProductRequest): Promise<LoanProduct> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/loan-products/${product.id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProduct = await response.json();
      this.updateLocalLoanProduct(updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.warn('API unavailable, updating local storage:', error);
      const localProduct: LoanProduct = {
        ...product,
        createdAt: this.getLocalLoanProduct(product.id)?.createdAt || new Date().toISOString().split('T')[0],
      };
      this.updateLocalLoanProduct(localProduct);
      return localProduct;
    }
  }

  async deleteLoanProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/loan-products/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.removeLocalLoanProduct(id);
    } catch (error) {
      console.warn('API unavailable, removing from local storage:', error);
      this.removeLocalLoanProduct(id);
    }
  }

  async toggleLoanProductStatus(id: string, isActive: boolean): Promise<LoanProduct> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/loan-products/${id}/toggle-status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProduct = await response.json();
      this.updateLocalLoanProduct(updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.warn('API unavailable, updating local storage:', error);
      const localProduct = this.getLocalLoanProduct(id);
      if (localProduct) {
        const updatedProduct = { ...localProduct, isActive };
        this.updateLocalLoanProduct(updatedProduct);
        return updatedProduct;
      }
      throw new Error('Loan product not found');
    }
  }

  // Public method to reset to default demo data
  resetToDefaultProducts(): void {
    this.initializeDefaultProducts();
  }

  // Local storage methods for offline functionality
  private getLocalLoanProducts(): LoanProduct[] {
    try {
      const stored = localStorage.getItem('loan_products');
      if (!stored) {
        // Initialize with default products if localStorage is empty
        this.initializeDefaultProducts();
        return this.getDefaultLoanProducts();
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return this.getDefaultLoanProducts();
    }
  }

  private initializeDefaultProducts(): void {
    try {
      const defaultProducts = this.getDefaultLoanProducts();
      localStorage.setItem('loan_products', JSON.stringify(defaultProducts));
      console.log('Initialized default loan products in localStorage');
    } catch (error) {
      console.error('Error initializing default products:', error);
    }
  }

  private getLocalLoanProduct(id: string): LoanProduct | null {
    const products = this.getLocalLoanProducts();
    return products.find(p => p.id === id) || null;
  }

  private saveLocalLoanProduct(product: LoanProduct): void {
    try {
      const products = this.getLocalLoanProducts();
      products.push(product);
      localStorage.setItem('loan_products', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private updateLocalLoanProduct(product: LoanProduct): void {
    try {
      const products = this.getLocalLoanProducts();
      const index = products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        products[index] = product;
        localStorage.setItem('loan_products', JSON.stringify(products));
      }
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  }

  private removeLocalLoanProduct(id: string): void {
    try {
      const products = this.getLocalLoanProducts();
      const filteredProducts = products.filter(p => p.id !== id);
      localStorage.setItem('loan_products', JSON.stringify(filteredProducts));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  private getDefaultLoanProducts(): LoanProduct[] {
    return [
      {
        id: '1',
        name: 'River City Launchpad',
        description: 'Use for Working capital, Equipment Purchases or Vehicle Purchases',
        isActive: true,
        createdAt: '2024-01-15',
        eligibilityRequirements: {
          timeInBusiness: 12,
          minCreditScore: 650,
          businessTypes: ['Restaurant - 7225', 'Retail - 44-45']
        },
        loanParameters: {
          minAmount: 100,
          maxAmount: 250000,
          termOptions: [3, 6, 12, 24, 36, 48, 60],
          baseInterestRate: 8.5,
          riskSpread: [
            { lendscoreRange: '90+', spread: 0 },
            { lendscoreRange: '80-89', spread: 1 },
            { lendscoreRange: '70-79', spread: 2 },
            { lendscoreRange: '60-69', spread: 3 },
            { lendscoreRange: '<50', spread: 4 }
          ]
        }
      },
      {
        id: '2',
        name: 'Small Business Growth Fund',
        description: 'Flexible financing for established businesses looking to expand',
        isActive: false,
        createdAt: '2024-01-10',
        eligibilityRequirements: {
          timeInBusiness: 24,
          minCreditScore: 700
        },
        loanParameters: {
          minAmount: 5000,
          maxAmount: 100000,
          termOptions: [12, 24, 36, 48],
          baseInterestRate: 7.2,
          riskSpread: [
            { lendscoreRange: '90+', spread: 0 },
            { lendscoreRange: '80-89', spread: 0.5 },
            { lendscoreRange: '70-79', spread: 1.5 },
            { lendscoreRange: '60-69', spread: 2.5 }
          ]
        }
      }
    ];
  }
}

export const loanProductService = new LoanProductService(); 