/**
 * Loader Component - Reusable loading indicator
 * Single Responsibility: Only handles loading display
 */

import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'gold' | 'white';
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 border-2',
  md: 'h-12 w-12 border-b-2',
  lg: 'h-16 w-16 border-b-3',
};

const colorClasses = {
  primary: 'border-primary-500',
  gold: 'border-gold-500',
  white: 'border-white',
};

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'gold',
  className = '',
}) => {
  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="md" color="gold" />
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton rounded" />
        <div className="h-6 skeleton rounded w-3/4" />
        <div className="h-4 skeleton rounded w-1/2" />
      </div>
    </div>
  );
};

export default Loader;
