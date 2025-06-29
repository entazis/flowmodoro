/**
 * Reusable Badge component for status indicators
 */

import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Badge shape */
  shape?: 'rounded' | 'pill';
  /** Dot indicator instead of text */
  dot?: boolean;
}

/**
 * Badge component for status indicators and labels
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  dot = false,
  className = '',
  ...props
}: BadgeProps) {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium',
    'transition-all duration-200 ease-in-out',
    'select-none'
  ];

  const variantClasses = {
    default: [
      'bg-gray-100 text-gray-800',
      'dark:bg-gray-800 dark:text-gray-200'
    ].join(' '),
    
    primary: [
      'bg-blue-100 text-blue-800',
      'dark:bg-blue-900/30 dark:text-blue-400'
    ].join(' '),
    
    success: [
      'bg-green-100 text-green-800',
      'dark:bg-green-900/30 dark:text-green-400'
    ].join(' '),
    
    warning: [
      'bg-yellow-100 text-yellow-800',
      'dark:bg-yellow-900/30 dark:text-yellow-400'
    ].join(' '),
    
    danger: [
      'bg-red-100 text-red-800',
      'dark:bg-red-900/30 dark:text-red-400'
    ].join(' '),
    
    info: [
      'bg-cyan-100 text-cyan-800',
      'dark:bg-cyan-900/30 dark:text-cyan-400'
    ].join(' ')
  };

  const sizeClasses = {
    sm: dot ? 'h-2 w-2' : 'px-2 py-1 text-xs',
    md: dot ? 'h-2.5 w-2.5' : 'px-2.5 py-1 text-xs',
    lg: dot ? 'h-3 w-3' : 'px-3 py-1.5 text-sm'
  };

  const shapeClasses = {
    rounded: 'rounded-md',
    pill: 'rounded-full'
  };

  const allClasses = [
    ...baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    dot ? 'rounded-full' : shapeClasses[shape],
    className
  ].filter(Boolean).join(' ');

  if (dot) {
    return (
      <span className={allClasses} {...props} />
    );
  }

  return (
    <span className={allClasses} {...props}>
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  /** Status value */
  status: 'idle' | 'working' | 'break';
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Specialized badge for timer status
 */
export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig = {
    idle: {
      variant: 'default' as const,
      label: 'Ready',
      dot: false
    },
    working: {
      variant: 'primary' as const,
      label: 'Working',
      dot: true
    },
    break: {
      variant: 'success' as const,
      label: 'Break',
      dot: true
    }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      {config.dot && (
        <Badge
          variant={config.variant}
          size={size}
          dot
        />
      )}
      <Badge
        variant={config.variant}
        size={size}
        shape="pill"
      >
        {config.label}
      </Badge>
    </div>
  );
} 