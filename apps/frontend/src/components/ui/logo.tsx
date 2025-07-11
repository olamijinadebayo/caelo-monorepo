import React from 'react';

interface LogoProps {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({ src, alt = 'Lender Logo', className = '', style }) => {
  // Fallback logo (could be replaced with a real default image)
  const fallback = (
    <div
      className={`w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center ${className}`}
      style={style}
    >
      <span className="text-white font-bold text-lg">C</span>
    </div>
  );

  if (!src) return fallback;

  return (
    <img
      src={src}
      alt={alt}
      className={`w-10 h-10 object-contain rounded-lg bg-white border ${className}`}
      style={style}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '';
      }}
    />
  );
}; 