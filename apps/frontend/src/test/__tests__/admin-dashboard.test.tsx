import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AdminDashboard from '../../components/dashboards/AdminDashboard';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/use-toast';
import { useLoanProducts } from '../../hooks/useLoanProducts';
import { useLoanApplications } from '../../hooks/useLoanApplications';
import * as loanProductServiceModule from '../../services/loanProducts';



vi.mock('../../services/loanProducts', () => ({
  loanProductService: {
    getLoanProducts: vi.fn().mockResolvedValue([
      {
        id: '1',
        name: 'River City Launchpad',
        description: 'Use for Working capital, Equipment Purchases or Vehicle Purchases',
        isActive: true,
        createdAt: '2024-01-01',
        eligibilityRequirements: {},
        loanParameters: {
          minAmount: 100,
          maxAmount: 250000,
          termOptions: [3, 6, 12, 24, 36, 48, 60],
          baseInterestRate: 8.5,
          riskSpread: []
        }
      },
      {
        id: '2',
        name: 'Small Business Growth Fund',
        description: 'For expansion, inventory, or marketing',
        isActive: false,
        createdAt: '2024-01-02',
        eligibilityRequirements: {},
        loanParameters: {
          minAmount: 500,
          maxAmount: 100000,
          termOptions: [12, 24, 36],
          baseInterestRate: 10.0,
          riskSpread: []
        }
      }
    ]),
    createLoanProduct: vi.fn().mockImplementation(async (product) => ({ ...product, id: 'new' })),
    updateLoanProduct: vi.fn().mockImplementation(async (product) => product),
    deleteLoanProduct: vi.fn().mockResolvedValue(undefined),
    toggleLoanProductStatus: vi.fn().mockImplementation(async (id, isActive) => {
      const products = [
        {
          id: '1',
          name: 'River City Launchpad',
          description: 'Use for Working capital, Equipment Purchases or Vehicle Purchases',
          isActive: true,
          createdAt: '2024-01-01',
          eligibilityRequirements: {},
          loanParameters: {
            minAmount: 100,
            maxAmount: 250000,
            termOptions: [3, 6, 12, 24, 36, 48, 60],
            baseInterestRate: 8.5,
            riskSpread: []
          }
        },
        {
          id: '2',
          name: 'Small Business Growth Fund',
          description: 'For expansion, inventory, or marketing',
          isActive: false,
          createdAt: '2024-01-02',
          eligibilityRequirements: {},
          loanParameters: {
            minAmount: 500,
            maxAmount: 100000,
            termOptions: [12, 24, 36],
            baseInterestRate: 10.0,
            riskSpread: []
          }
        }
      ];
      const product = products.find(p => p.id === id);
      return { ...product, isActive };
    }),
  },
}));

// Mock the hooks
vi.mock('../../hooks/useAuth');
vi.mock('../../hooks/use-toast');
vi.mock('../../hooks/useLoanProducts');
vi.mock('../../hooks/useLoanApplications');

const mockUseAuth = useAuth as any;
const mockUseToast = useToast as any;
const mockUseLoanProducts = useLoanProducts as any;
const mockUseLoanApplications = useLoanApplications as any;

describe('AdminDashboard', () => {
  const mockLogout = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '1',
        email: 'admin@example.com',
        role: 'admin',
        name: 'Admin User',
        organization: 'Test Org'
      },
      token: 'test-token',
      isLoading: false,
      login: vi.fn(),
      logout: mockLogout,
      checkAuth: vi.fn()
    });

    mockUseToast.mockReturnValue({
      toasts: [],
      toast: mockToast,
      dismiss: vi.fn()
    });

    mockUseLoanProducts.mockReturnValue({
      products: [
        {
          id: '1',
          name: 'River City Launchpad',
          description: 'Use for Working capital, Equipment Purchases or Vehicle Purchases',
          minAmount: 100,
          maxAmount: 250000,
          interestRate: 8.5,
          termLength: 36,
          isActive: true,
          businessTypes: ['Restaurant - 7225', 'Retail - 44-45'],
          riskSpreads: [
            { lendscoreRange: '90+', spread: 0 },
            { lendscoreRange: '80-89', spread: 1 },
            { lendscoreRange: '70-79', spread: 2 },
            { lendscoreRange: '60-69', spread: 3 },
            { lendscoreRange: '<50', spread: 4 }
          ],
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Small Business Growth Fund',
          description: 'Flexible financing for established businesses looking to expand',
          minAmount: 5000,
          maxAmount: 100000,
          interestRate: 7.2,
          termLength: 48,
          isActive: false,
          businessTypes: [],
          riskSpreads: [
            { lendscoreRange: '90+', spread: 0 },
            { lendscoreRange: '80-89', spread: 0.5 },
            { lendscoreRange: '70-79', spread: 1.5 },
            { lendscoreRange: '60-69', spread: 2.5 }
          ],
          createdAt: '2024-01-10',
          updatedAt: '2024-01-10'
        }
      ],
      isLoading: false,
      error: null,
      loadProducts: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
      toggleProductStatus: vi.fn(),
      duplicateProduct: vi.fn(),
    });

    mockUseLoanApplications.mockReturnValue({
      applications: [
        {
          id: '1',
          borrowerId: 'b1',
          productId: '1',
          amount: 2000,
          purpose: 'Working capital',
          status: 'pending',
          businessType: 'Retail',
          annualRevenue: 100000,
          creditScore: 700,
          lendscore: 80,
          documents: [],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ],
      isLoading: false,
      error: null,
      loadApplications: vi.fn(),
      createApplication: vi.fn(),
      updateApplication: vi.fn(),
      deleteApplication: vi.fn(),
      updateApplicationStatus: vi.fn(),
    });

    localStorage.setItem('loan_products', JSON.stringify([
      {
        id: '1',
        name: 'Test Product',
        description: 'A test loan product',
        minAmount: 1000,
        maxAmount: 5000,
        interestRate: 5.5,
        termLength: 12,
        isActive: true,
        businessTypes: ['Retail'],
        riskSpreads: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ]));
    localStorage.setItem('loan_applications', JSON.stringify([
      {
        id: '1',
        borrowerId: 'b1',
        productId: '1',
        amount: 2000,
        purpose: 'Working capital',
        status: 'pending',
        businessType: 'Retail',
        annualRevenue: 100000,
        creditScore: 700,
        lendscore: 80,
        documents: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ]));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders admin dashboard with loan products', async () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    const loanProductsTab = screen.getByRole('tab', { name: /Loan Products/i });
    expect(loanProductsTab).toBeInTheDocument();
    
    // Wait for loading to complete and products to appear
    await waitFor(() => {
      expect(screen.getByText('River City Launchpad')).toBeInTheDocument();
      expect(screen.getByText('Small Business Growth Fund')).toBeInTheDocument();
    });
  });

  it('displays loan product details correctly', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('River City Launchpad')).toBeInTheDocument();
      expect(screen.getByText('Use for Working capital, Equipment Purchases or Vehicle Purchases')).toBeInTheDocument();
      expect(screen.getByText('$100 - $250,000')).toBeInTheDocument();
      expect(screen.getByText('8.5%')).toBeInTheDocument();
      expect(screen.getByText('36 months')).toBeInTheDocument();
    });
  });

  it('shows active/inactive status badges', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
  });

  it('opens create loan product dialog', async () => {
    render(<AdminDashboard />);
    
    const createButton = screen.getByText('Create Loan Product');
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Loan Product')).toBeInTheDocument();
    });
  });

  it('handles logout', () => {
    render(<AdminDashboard />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('shows main dashboard tabs', () => {
    render(<AdminDashboard />);
    
    // Check for the main dashboard tabs that actually exist
    const loanProductsTab = screen.getByRole('tab', { name: /Loan Products/i });
    const loanApplicationsTab = screen.getByRole('tab', { name: /Loan Applications/i });
    
    expect(loanProductsTab).toBeInTheDocument();
    expect(loanApplicationsTab).toBeInTheDocument();
  });

  it('allows switching between tabs', async () => {
    render(<AdminDashboard />);
    
    // Click on Loan Applications tab
    const applicationsTab = screen.getByRole('tab', { name: /Loan Applications/i });
    await userEvent.click(applicationsTab);
    
    // Verify the applications tab is now active
    expect(applicationsTab).toHaveAttribute('data-state', 'active');
  });
}); 