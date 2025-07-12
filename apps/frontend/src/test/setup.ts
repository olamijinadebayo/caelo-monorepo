import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage with a real in-memory implementation
class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

const localStorageMock = new LocalStorageMock();
global.localStorage = localStorageMock;
global.window.localStorage = localStorageMock;

// Mock sessionStorage (can remain as vi.fn for now)
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock lib imports for all tests
vi.mock('../lib/constants', () => ({
  BUSINESS_TYPES: [
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
  ],
  USER_ROLES: {
    ADMIN: 'admin',
    ANALYST: 'analyst',
    BORROWER: 'borrower',
  },
  APPLICATION_STATUS: {
    PENDING: 'pending',
    UNDER_REVIEW: 'under_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    FUNDED: 'funded',
  },
  APP_CONFIG: {
    name: 'Caelo',
    version: '1.0.0',
    description: 'Modern lending platform',
  },
  VALIDATION_RULES: {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    EMAIL_MAX_LENGTH: 254,
    PHONE_MAX_LENGTH: 20,
    BUSINESS_NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  },
}));

vi.mock('../lib/types', () => ({
  LoanProduct: {},
  RiskSpread: {},
  User: {},
  LoanApplication: {},
  Document: {},
  LoginFormData: {},
  SignUpFormData: {},
  ApiResponse: {},
  PaginatedResponse: {},
  BaseComponentProps: {},
  LoadingState: {},
})); 