import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AdminDashboard from '../../components/dashboards/AdminDashboard';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/use-toast';
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

const mockUseAuth = useAuth as vi.Mock;
const mockUseToast = useToast as vi.Mock;

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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders admin dashboard with loan products', async () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    const loanProductsElements = screen.getAllByText('Loan Products');
    expect(loanProductsElements.length).toBeGreaterThan(0);
    
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
      expect(screen.getByText('3, 6, 12, 24, 36, 48, 60 months')).toBeInTheDocument();
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

  it('allows editing existing loan products', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      const editButtons = screen.getAllByTestId('edit-button');
      fireEvent.click(editButtons[0]);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Edit Loan Product')).toBeInTheDocument();
      expect(screen.getByDisplayValue('River City Launchpad')).toBeInTheDocument();
    });
  });

  it('allows duplicating loan products', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      const duplicateButtons = screen.getAllByTestId('duplicate-button');
      fireEvent.click(duplicateButtons[0]);
    });
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Product Duplicated',
        description: 'Loan product has been duplicated successfully.',
      });
    });
  });

  it('allows deleting loan products', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByTestId('delete-button');
      fireEvent.click(deleteButtons[0]);
    });
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Product Deleted',
        description: 'Loan product has been deleted successfully.',
      });
    });
  });

  it('toggles loan product active status', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      const toggleSwitches = screen.getAllByRole('switch');
      fireEvent.click(toggleSwitches[0]);
    });
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Status Updated',
        description: 'Loan product status has been updated successfully.',
      });
    });
  });

  it('filters loan products by search term', async () => {
    render(<AdminDashboard />);
    
    // Wait for mock data to load
    await waitFor(() => {
      const riverCityElements = screen.queryAllByText('River City Launchpad');
      expect(riverCityElements.length).toBeGreaterThan(0);
    });
    
    const searchInput = screen.getByPlaceholderText('Search loan products...');
    fireEvent.change(searchInput, { target: { value: 'River' } });
    
    await waitFor(() => {
      const riverCityElements = screen.getAllByText('River City Launchpad');
      expect(riverCityElements.length).toBeGreaterThan(0);
      expect(screen.queryByText('Small Business Growth Fund')).not.toBeInTheDocument();
    });
  });

  it('shows empty state when no products match search', async () => {
    render(<AdminDashboard />);
    
    const searchInput = screen.getByPlaceholderText('Search loan products...');
    fireEvent.change(searchInput, { target: { value: 'NonExistentProduct' } });
    
    await waitFor(() => {
      expect(screen.getByText('No loan products')).toBeInTheDocument();
      expect(screen.getByText('Get started by creating your first loan product.')).toBeInTheDocument();
    });
  });

  it('handles logout', () => {
    render(<AdminDashboard />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });

  describe('Loan Product Form', () => {
    it('renders all form tabs', async () => {
      render(<AdminDashboard />);
      
      const createButton = screen.getByText('Create Loan Product');
      fireEvent.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText('Basic Info')).toBeInTheDocument();
        expect(screen.getByText('Eligibility')).toBeInTheDocument();
        expect(screen.getByText('Loan Parameters')).toBeInTheDocument();
        expect(screen.getByText('Risk Spread')).toBeInTheDocument();
      });
    });

    it('validates required fields', async () => {
      render(<AdminDashboard />);
      
      const createButton = screen.getByText('Create Loan Product');
      fireEvent.click(createButton);
      
      await waitFor(() => {
        const submitButton = screen.getByText('Create Product');
        fireEvent.click(submitButton);
      });
      
      // Form should not submit without required fields
      expect(screen.getByText('Create New Loan Product')).toBeInTheDocument();
    });

    it('allows adding risk spread tiers', async () => {
      render(<AdminDashboard />);
      
      const createButton = screen.getByText('Create Loan Product');
      fireEvent.click(createButton);
      
      // Wait for dialog to open and click the Risk Spread tab
      await waitFor(() => {
        expect(screen.getByText('Create New Loan Product')).toBeInTheDocument();
      });
      
      const riskTab = screen.getByText('Risk Spread');
      await userEvent.click(riskTab);
      
      // Wait for the risk spread content to be visible
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add risk tier/i })).toBeInTheDocument();
      });
      
      const addButton = screen.getByText('Add Risk Tier');
      fireEvent.click(addButton);
      
      // Should have one more risk tier row
      await waitFor(() => {
        const riskInputs = screen.getAllByPlaceholderText('e.g., 90+');
        expect(riskInputs.length).toBeGreaterThan(5); // Default 5 + 1 new
      });
    });

    it('allows removing risk spread tiers', async () => {
      render(<AdminDashboard />);
      
      const createButton = screen.getByText('Create Loan Product');
      fireEvent.click(createButton);
      
      // Wait for dialog to open and click the Risk Spread tab
      await waitFor(() => {
        expect(screen.getByText('Create New Loan Product')).toBeInTheDocument();
      });
      
      const riskTab = screen.getByText('Risk Spread');
      await userEvent.click(riskTab);
      
      // Wait for the risk spread content to be visible
      await waitFor(() => {
        expect(screen.getByText((content) => content.includes('Add Risk Tier'))).toBeInTheDocument();
      });
      
      // Wait for remove buttons to be available
      await waitFor(() => {
        const removeButtons = screen.getAllByTestId('remove-risk-tier');
        expect(removeButtons.length).toBeGreaterThan(0);
      });
      
      const removeButtons = screen.getAllByTestId('remove-risk-tier');
      fireEvent.click(removeButtons[0]);
      
      // Should have one less risk tier row
      await waitFor(() => {
        const riskInputs = screen.getAllByPlaceholderText('e.g., 90+');
        expect(riskInputs.length).toBe(4); // Default 5 - 1 removed
      });
    });

    it('allows selecting business types', async () => {
      render(<AdminDashboard />);
      
      const createButton = screen.getByText('Create Loan Product');
      fireEvent.click(createButton);
      
      // Wait for dialog to open and click the Eligibility tab
      await waitFor(() => {
        expect(screen.getByText('Create New Loan Product')).toBeInTheDocument();
      });
      
      const eligibilityTab = screen.getByText('Eligibility');
      await userEvent.click(eligibilityTab);
      
      // Wait for the eligibility content to be visible
      await waitFor(() => {
        expect(screen.getByLabelText('Restaurant (7225)')).toBeInTheDocument();
      });
      
      const restaurantCheckbox = screen.getByLabelText('Restaurant (7225)');
      fireEvent.click(restaurantCheckbox);
      expect(restaurantCheckbox).toBeChecked();
    });

    it('allows selecting term options', async () => {
      render(<AdminDashboard />);
      
      const createButton = screen.getByText('Create Loan Product');
      fireEvent.click(createButton);
      
      // Click the Loan Parameters tab
      const parametersTab = await screen.findByText('Loan Parameters');
      await userEvent.click(parametersTab);
      
      // Wait for the parameters content to be visible
      await waitFor(() => {
        expect(screen.getByLabelText('12')).toBeInTheDocument();
      });
      
      // Find a checkbox that should be unchecked initially (term 3)
      const term3Checkbox = screen.getByLabelText('3');
      
      // Ensure the checkbox is not checked initially
      expect(term3Checkbox).not.toBeChecked();
      
      // Click the checkbox
      await userEvent.click(term3Checkbox);
      
      // Wait for the checkbox to be checked
      await waitFor(() => {
        expect(term3Checkbox).toBeChecked();
      });
      
      // Verify term 12 is checked by default
      const term12Checkbox = screen.getByLabelText('12');
      expect(term12Checkbox).toBeChecked();
    });
  });

  describe('Navigation', () => {
    it('shows sidebar navigation', () => {
      render(<AdminDashboard />);
      
      // Use getAllByText to handle multiple instances
      const loanProductsElements = screen.getAllByText('Loan Products');
      expect(loanProductsElements.length).toBeGreaterThan(0);
      expect(screen.getByText('Borrowers')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('highlights current section', () => {
      render(<AdminDashboard />);
      
      // Find the sidebar navigation button specifically (Loan Products should be highlighted by default)
      const sidebarButtons = screen.getAllByText('Loan Products');
      const sidebarButton = sidebarButtons.find(element => element.closest('button'));
      expect(sidebarButton?.closest('button')).toHaveClass('bg-gray-100');
    });
  });
}); 