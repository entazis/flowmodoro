/**
 * Timer controls component with start/stop/reset functionality
 */

import { Button } from '@/components/ui/button';
import type { TimerState } from '@/types/timer';

interface TimerControlsProps {
  /** Current timer state */
  state: TimerState;
  /** Whether timer is running */
  isRunning: boolean;
  /** Whether break is available */
  isBreakAvailable: boolean;
  /** Current button text */
  buttonText: string;
  /** Whether controls are disabled */
  disabled?: boolean;
  /** Toggle timer handler */
  onToggle: () => void;
  /** Reset timer handler */
  onReset: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * Timer control buttons component
 */
export function TimerControls({
  state,
  isRunning,
  isBreakAvailable,
  buttonText,
  disabled = false,
  onToggle,
  onReset,
  className = ''
}: TimerControlsProps) {
  // Determine primary button variant based on state
  const getPrimaryVariant = () => {
    if (isRunning) {
      return state === 'working' ? 'danger' : 'secondary';
    }
    return isBreakAvailable ? 'success' : 'primary';
  };

  // Determine primary button icon
  const getPrimaryIcon = () => {
    if (isRunning) {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    
    return (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 100-5H9m0 5v1.5a2.5 2.5 0 005 0V10M9 10V9a2 2 0 012-2h1.5"
        />
      </svg>
    );
  };

  const allClasses = [
    'flex flex-col sm:flex-row items-center justify-center gap-4',
    'w-full max-w-md mx-auto',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={allClasses}>
      {/* Primary Action Button */}
      <Button
        variant={getPrimaryVariant()}
        size="lg"
        fullWidth
        onClick={onToggle}
        disabled={disabled}
        icon={getPrimaryIcon()}
        className="min-h-[3rem] text-lg font-semibold"
      >
        {buttonText}
      </Button>

      {/* Secondary Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Reset Button */}
        <Button
          variant="ghost"
          size="md"
          onClick={onReset}
          disabled={disabled}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          }
          className="flex-1 sm:flex-none"
        >
          Reset
        </Button>

        {/* Keyboard Hint */}
        <div className="hidden sm:flex items-center text-xs text-gray-500 dark:text-gray-400">
          <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
            Space
          </kbd>
          <span className="ml-1">to toggle</span>
        </div>
      </div>
    </div>
  );
}

interface QuickActionsProps {
  /** Current timer state */
  state: TimerState;
  /** Whether timer is running */
  isRunning: boolean;
  /** Current work time */
  workTime: number;
  /** Current break time */
  breakTime: number;
  /** Whether break is available */
  isBreakAvailable: boolean;
  /** Start work handler */
  onStartWork: () => void;
  /** Start break handler */
  onStartBreak: () => void;
  /** Stop current session handler */
  onStop: () => void;
}

/**
 * Quick action buttons for specific timer actions
 */
export function QuickActions({
  state,
  isRunning,

  breakTime,
  isBreakAvailable,
  onStartWork,
  onStartBreak,
  onStop
}: QuickActionsProps) {
  if (isRunning) {
    return (
      <div className="flex items-center justify-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={onStop}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10l6 6m0-6l-6 6"
              />
            </svg>
          }
        >
          Stop {state === 'working' ? 'Work' : 'Break'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Start Work Button */}
      <Button
        variant="primary"
        size="sm"
        onClick={onStartWork}
        icon={
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        }
      >
        Start Work
      </Button>

      {/* Start Break Button */}
      {isBreakAvailable && (
        <Button
          variant="success"
          size="sm"
          onClick={onStartBreak}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 100-5H9m0 5v1.5a2.5 2.5 0 005 0V10M9 10V9a2 2 0 012-2h1.5"
              />
            </svg>
          }
        >
          Start Break ({Math.floor(breakTime / 60)}m)
        </Button>
      )}
    </div>
  );
} 