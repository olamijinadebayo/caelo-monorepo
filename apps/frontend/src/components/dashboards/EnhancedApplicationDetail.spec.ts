import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import EnhancedApplicationDetail from './EnhancedApplicationDetail';
import type { ApplicationId } from '../../types/loanApplications';

describe('EnhancedApplicationDetail', () => {
  const mockApplicationId = 'LA-2024-0892' as ApplicationId;
  const mockOnBack = () => {};

  test('renders application header with correct ID', () => {
    render(
      <EnhancedApplicationDetail 
        applicationId={mockApplicationId}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('Application #LA-2024-0892')).toBeInTheDocument();
  });

  test('displays Caelo Intelligence Summary section', () => {
    render(
      <EnhancedApplicationDetail 
        applicationId={mockApplicationId}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('Caelo Intelligence Summary')).toBeInTheDocument();
    expect(screen.getByText(/The business shows a healthy balance/)).toBeInTheDocument();
  });

  test('renders Financial Stability tab by default', () => {
    render(
      <EnhancedApplicationDetail 
        applicationId={mockApplicationId}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('Business & Personal Financial Stability')).toBeInTheDocument();
  });

  test('displays approve and reject action buttons', () => {
    render(
      <EnhancedApplicationDetail 
        applicationId={mockApplicationId}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByRole('button', { name: /approve/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
  });

  test('shows application details in correct format', () => {
    render(
      <EnhancedApplicationDetail 
        applicationId={mockApplicationId}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('IDC1092EA23')).toBeInTheDocument();
    expect(screen.getByText('$20,000')).toBeInTheDocument();
    expect(screen.getByText('Caleb Mark')).toBeInTheDocument();
    expect(screen.getByText('Emmanuella Areal')).toBeInTheDocument();
  });
});
