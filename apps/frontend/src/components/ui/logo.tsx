import React from 'react';

interface LogoProps {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({ 
  src = 'https://api.builder.io/api/v1/image/assets/f105a8cba51a4a1393387348a1cf27b4/cc33327b8d58413e06172f331a0a2fd5af8e7a45?placeholderIfAbsent=true', 
  alt = 'Caelo Logo', 
  className = '', 
  style 
}) => {
  // Fallback logo if Figma asset fails to load
  const fallback = (
    <div
      className={`w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center ${className}`}
      style={style}
    >
      <span className="text-white font-bold text-lg">C</span>
    </div>
  );

  return (
    <img
      src={src}
      alt={alt}
      className={`aspect-[3.04] object-contain w-[73px] ${className}`}
      style={style}
      onError={(e) => {
        // Replace with fallback if image fails to load
        const target = e.target as HTMLImageElement;
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = '';
          parent.appendChild(React.createElement('div', {
            className: `w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center ${className}`,
            style,
            children: React.createElement('span', {
              className: 'text-white font-bold text-lg',
              children: 'C'
            })
          }));
        }
      }}
    />
  );
}; 