/**
 * Timer status component showing current state and break information
 */

import { StatusBadge } from '@/components/ui/badge';
import type { TimerState } from '@/types/timer';
import { formatDuration, formatTime } from '@/utils/timer';

interface TimerStatusProps {
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
  /** Additional class names */
  className?: string;
}

/**
 * Timer status display component
 */
export function TimerStatus({
  state,
  isRunning,
  workTime,
  breakTime,
  isBreakAvailable,
  className = ''
}: TimerStatusProps) {
  const getStatusMessage = () => {
    switch (state) {
      case 'working':
        return isRunning ? 'Focus time - work until you naturally lose focus' : 'Work session paused';
      case 'break':
        return isRunning ? 'Break time - relax and recharge' : 'Break session paused';
      case 'idle':
      default:
        if (isBreakAvailable) {
          return 'Break earned! Take a moment to recharge before your next session';
        }
        return 'Ready to start your focus session';
    }
  };

  const getProgressInfo = () => {
    if (state === 'working' && workTime > 0) {
      return {
        label: 'Current session',
        value: formatTime(workTime),
        description: 'Time worked in this session'
      };
    }
    
    if (state === 'break' && breakTime > 0) {
      return {
        label: 'Break earned',
        value: formatTime(breakTime),
        description: 'Break time calculated from work session'
      };
    }
    
    if (state === 'idle' && workTime > 0 && breakTime > 0) {
      return {
        label: 'Last session',
        value: formatTime(workTime),
        description: `Earned ${formatTime(breakTime)} break`
      };
    }
    
    return null;
  };

  const progressInfo = getProgressInfo();

  const allClasses = [
    'flex flex-col items-center text-center space-y-4',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={allClasses}>
      {/* Status Badge */}
      <StatusBadge status={state} size="lg" />
      
      {/* Status Message */}
      <div className="max-w-md">
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {getStatusMessage()}
        </p>
      </div>

      {/* Progress Information */}
      {progressInfo && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 w-full max-w-sm">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {progressInfo.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-mono">
                {progressInfo.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {progressInfo.description}
              </p>
            </div>
            
            {/* Visual indicator based on state */}
            <div className="ml-4">
              {state === 'working' && (
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              )}
              
              {(state === 'break' || isBreakAvailable) && (
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
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
                </div>
              )}
              
              {state === 'idle' && !isBreakAvailable && (
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-400"
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Break Information */}
      {isBreakAvailable && state === 'idle' && (
        <div className="text-center">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                         You&apos;ve earned a {formatDuration(breakTime)} break!
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Break time = Work time ÷ 5
          </p>
        </div>
      )}
    </div>
  );
}

interface SessionSummaryProps {
  /** Work time in seconds */
  workTime: number;
  /** Break time in seconds */
  breakTime: number;
  /** Session number */
  sessionNumber: number;
}

/**
 * Session summary component
 */
export function SessionSummary({
  workTime,
  breakTime,
  sessionNumber
}: SessionSummaryProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
          Session #{sessionNumber} Complete
        </h3>
        <div className="text-xs text-blue-600 dark:text-blue-400">
          🎉
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 font-mono">
            {formatTime(workTime)}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Work Time
          </p>
        </div>
        
        <div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 font-mono">
            {formatTime(breakTime)}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Break Earned
          </p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
        <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
          Take your well-deserved break or start a new session
        </p>
      </div>
    </div>
  );
} 