import React from 'react';

/**
 * Loading Spinner Component
 * Reusable loading indicator with different sizes
 */
const LoadingSpinner = ({ 
  size = 'md', 
  className = '',
  color = 'text-orangedeep'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div 
      className={`animate-spin rounded-full border-2 border-orangedeep border-t-current ${sizeClasses[size]} ${color} ${className}`}
      role="status"
      aria-label="جاري التحميل"
    >
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );
};

export { LoadingSpinner };
