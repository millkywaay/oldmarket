
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-20 w-20',
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 w-full h-full">
      <div
        className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-black ${sizeClasses[size]}`}
        role="status"
        aria-live="polite"
        aria-label={message || 'Loading'}
      ></div>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
