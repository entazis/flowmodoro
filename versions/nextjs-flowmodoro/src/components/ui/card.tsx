/**
 * Reusable Card component for container layouts
 */

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card variant */
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  /** Card padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Card border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Card component for wrapping content
 */
export function Card({
  children,
  variant = 'default',
  padding = 'md',
  radius = 'lg',
  className = '',
  ...props
}: CardProps) {
  const baseClasses = [
    'transition-all duration-200 ease-in-out'
  ];

  const variantClasses = {
    default: [
      'bg-white dark:bg-gray-900',
      'border border-gray-200 dark:border-gray-700'
    ].join(' '),
    
    elevated: [
      'bg-white dark:bg-gray-900',
      'shadow-md hover:shadow-lg',
      'border border-gray-100 dark:border-gray-800'
    ].join(' '),
    
    outlined: [
      'bg-transparent',
      'border-2 border-gray-300 dark:border-gray-600',
      'hover:border-gray-400 dark:hover:border-gray-500'
    ].join(' '),
    
    filled: [
      'bg-gray-50 dark:bg-gray-800',
      'border border-gray-200 dark:border-gray-700'
    ].join(' ')
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const radiusClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  const allClasses = [
    ...baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    radiusClasses[radius],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={allClasses} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title?: string;
  /** Header subtitle */
  subtitle?: string;
  /** Header actions */
  actions?: React.ReactNode;
}

/**
 * Card header component
 */
export function CardHeader({
  title,
  subtitle,
  actions,
  children,
  className = '',
  ...props
}: CardHeaderProps) {
  const classes = [
    'flex items-center justify-between',
    'pb-4 border-b border-gray-200 dark:border-gray-700',
    'mb-4',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card body content */
  children?: React.ReactNode;
}

/**
 * Card body component
 */
export function CardBody({
  children,
  className = '',
  ...props
}: CardBodyProps) {
  const classes = [
    'flex-1',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Footer actions */
  actions?: React.ReactNode;
}

/**
 * Card footer component
 */
export function CardFooter({
  actions,
  children,
  className = '',
  ...props
}: CardFooterProps) {
  const classes = [
    'pt-4 border-t border-gray-200 dark:border-gray-700',
    'mt-4',
    'flex items-center justify-between',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="flex-1">
        {children}
      </div>
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
} 