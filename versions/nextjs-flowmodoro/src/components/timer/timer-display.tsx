/**
 * Timer display component that shows the current timer value
 */

import { TIMER_COLORS } from '@/constants/timer';
import type { TimerState } from '@/types/timer';
import { formatTime } from '@/utils/timer';
import React from 'react';

interface TimerDisplayProps {
  /** Current time in seconds */
  time: number;
  /** Current timer state */
  state: TimerState;
  /** Whether timer is running */
  isRunning: boolean;
  /** Display size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional class names */
  className?: string;
}

/**
 * Main timer display component
 */
export function TimerDisplay({
  time,
  state,
  isRunning,
  size = 'xl',
  className = ''
}: TimerDisplayProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl'
  };

  const colorScheme = TIMER_COLORS[state.toUpperCase() as keyof typeof TIMER_COLORS];

  const baseClasses = [
    'font-mono font-bold tabular-nums',
    'transition-all duration-300 ease-in-out',
    'select-none'
  ];

  const animationClasses = isRunning ? 'animate-pulse' : '';

  const allClasses = [
    ...baseClasses,
    sizeClasses[size],
    colorScheme.secondary,
    animationClasses,
    className
  ].filter(Boolean).join(' ');

  // Format time based on timer state
  const formattedTime = React.useMemo(() => {
    if (state === 'break') {
      // For break timer, always show mm:ss format
      return formatTime(time, 'mm:ss');
    }
    // For work timer, use dynamic format (show hours if needed)
    return formatTime(time, 'dynamic');
  }, [time, state]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={allClasses}>
        {formattedTime}
      </div>
      
      {/* Time unit labels */}
      <div className="flex items-center justify-center mt-2 space-x-4">
        {time >= 3600 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Hours
          </span>
        )}
        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Minutes
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Seconds
        </span>
      </div>
    </div>
  );
}

interface ProgressRingProps {
  /** Current progress (0-100) */
  progress: number;
  /** Ring size */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Ring color */
  color?: string;
  /** Background color */
  backgroundColor?: string;
}

/**
 * Circular progress ring component
 */
export function ProgressRing({
  progress,
  size = 200,
  strokeWidth = 8,
  color = 'currentColor',
  backgroundColor = 'rgb(229, 231, 235)'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
    </div>
  );
}

interface TimerDisplayWithProgressProps extends TimerDisplayProps {
  /** Total time for progress calculation */
  totalTime?: number;
  /** Whether to show progress ring */
  showProgress?: boolean;
}

/**
 * Timer display with optional progress ring
 */
export function TimerDisplayWithProgress({
  time,
  state,
  isRunning,
  size = 'xl',
  totalTime = 0,
  showProgress = false,
  className = ''
}: TimerDisplayWithProgressProps) {
  const progress = totalTime > 0 ? (time / totalTime) * 100 : 0;
  const colorScheme = TIMER_COLORS[state.toUpperCase() as keyof typeof TIMER_COLORS];

  if (!showProgress) {
    return (
      <TimerDisplay
        time={time}
        state={state}
        isRunning={isRunning}
        size={size}
        className={className}
      />
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <ProgressRing
        progress={progress}
        size={300}
        strokeWidth={12}
        color={colorScheme.secondary.includes('blue') ? 'rgb(59, 130, 246)' : 
               colorScheme.secondary.includes('green') ? 'rgb(34, 197, 94)' : 
               'rgb(107, 114, 128)'}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <TimerDisplay
          time={time}
          state={state}
          isRunning={isRunning}
          size="lg"
          className={className}
        />
      </div>
    </div>
  );
} 