/**
 * Reusable Button component with variants
 */

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Icon to display after text */
  iconAfter?: React.ReactNode;
}

/**
 * Button component with multiple variants and states
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  iconAfter,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-lg',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'select-none'
  ];

  const variantClasses = {
    primary: [
      'bg-blue-600 hover:bg-blue-700 text-white',
      'focus:ring-blue-500',
      'dark:bg-blue-500 dark:hover:bg-blue-600'
    ].join(' '),
    
    secondary: [
      'bg-gray-100 hover:bg-gray-200 text-gray-900',
      'focus:ring-gray-500',
      'dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100'
    ].join(' '),
    
    success: [
      'bg-green-600 hover:bg-green-700 text-white',
      'focus:ring-green-500',
      'dark:bg-green-500 dark:hover:bg-green-600'
    ].join(' '),
    
    danger: [
      'bg-red-600 hover:bg-red-700 text-white',
      'focus:ring-red-500',
      'dark:bg-red-500 dark:hover:bg-red-600'
    ].join(' '),
    
    ghost: [
      'bg-transparent hover:bg-gray-100 text-gray-700',
      'focus:ring-gray-500',
      'dark:hover:bg-gray-800 dark:text-gray-300'
    ].join(' ')
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-3'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const allClasses = [
    ...baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    className
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || isLoading;

  return (
    <button
      className={allClasses}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      
      {children && (
        <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      )}
      
      {!isLoading && iconAfter && (
        <span className="flex-shrink-0">{iconAfter}</span>
      )}
    </button>
  );
} 