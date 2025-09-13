/**
 * Centralized Figma assets extracted from the design system
 * All assets are sourced from the builder.io API with Figma integration
 */

export const FigmaAssets = {
  // Logo and Branding
  logo: {
    caelo: 'https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/cc33327b8d58413e06172f331a0a2fd5af8e7a45?placeholderIfAbsent=true',
    partner: '/partner-logo.png', // Use the uploaded logo file
    alt: {
      caelo: 'Caelo Logo',
      partner: 'Partner Organization Logo'
    }
  },

  // Navigation Icons
  icons: {
    notifications: 'https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/d1c556c5f584f01b0ef47327f32a147f8ced1c0e?placeholderIfAbsent=true',
    settings: 'https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/c746af05f9d1a6bbaf22848dffe51211c18cab2c?placeholderIfAbsent=true',
    home: 'https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/c33c4215a8a66291357334daab3996361d525ff7?placeholderIfAbsent=true',
    breadcrumbSeparator: 'https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/09fd411f06e1c43f6544c4a564b90e5a39410f82?placeholderIfAbsent=true',
    messaging: 'https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/b7bf769314dde6c9c8e5d784118df62186648c03?placeholderIfAbsent=true',
    aiIntelligence: 'https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/b487bf441836a4aa66a210d686bcd95556d2a220?placeholderIfAbsent=true'
  },

  // User Profile
  user: {
    avatar: 'https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/5092258052b9a6feef5e0772d1455239ed12f960?placeholderIfAbsent=true',
    alt: 'User Profile Avatar'
  },

  // Charts and Analytics
  charts: {
    cashFlow: 'https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/04af02a2cbdb18e7fa26f30e72ca8b7db3a85619?placeholderIfAbsent=true',
    pieChart: 'https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/65f5c64c9bf61ea08864d055ae2c388e99a66a29?placeholderIfAbsent=true'
  },

  // Design System Colors (from Figma design variables)
  colors: {
    primary: {
      deepNavy: '#111629',     // Caelo/Deep Navy
      background: '#1a2340',
      backgroundHover: '#111629',
      text: '#fff5e6',
      border: '#fff5e6'
    },
    neutral: {
      text: '#101828',         // Gray/900
      textSecondary: '#344054', // Gray/700
      textMuted: '#667085',
      border: '#EAECF0',       // Gray/200
      borderLight: '#D0D5DD',
      background: '#EAECF0',    // Gray/200
      backgroundHover: '#F9FAFB', // Gray/50
      white: '#FFFFFF'          // Base/White
    },
    status: {
      success: '#10B981',
      error: '#D92D20',
      warning: '#F59E0B',
      info: '#3B82F6'
    }
  }
} as const;

// Helper function to get asset URLs
export const getAsset = (category: keyof typeof FigmaAssets, key: string): string => {
  const categoryAssets = FigmaAssets[category] as Record<string, string | Record<string, string>>;
  const asset = categoryAssets[key];
  return typeof asset === 'string' ? asset : '';
};

// Type definitions for better TypeScript support
export type FigmaAssetCategory = keyof typeof FigmaAssets;
export type FigmaIconKey = keyof typeof FigmaAssets.icons;
export type FigmaChartKey = keyof typeof FigmaAssets.charts;
