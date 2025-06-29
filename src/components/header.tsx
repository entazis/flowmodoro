/**
 * Header component with dark mode toggle and app branding
 */

import { useDarkMode } from '@/hooks/use-dark-mode';
import { Button } from './ui/button';

interface HeaderProps {
  /** Additional class names */
  className?: string;
}

/**
 * Application header component
 */
export function Header({ className = '' }: HeaderProps) {
  const { isDark, toggleDarkMode } = useDarkMode();

  const allClasses = [
    'flex items-center justify-between',
    'py-4 px-6',
    'border-b border-gray-200 dark:border-gray-700',
    'bg-white dark:bg-gray-900',
    className
  ].filter(Boolean).join(' ');

  return (
    <header className={allClasses}>
      {/* App branding */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Flowmodoro
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Natural Focus Timer
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          icon={
            isDark ? (
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
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
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
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )
          }
          className="w-10 h-10"
        />

        {/* Info button */}
        <Button
          variant="ghost"
          size="sm"
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          className="w-10 h-10"
        />
      </div>
    </header>
  );
}

interface InfoPanelProps {
  /** Whether panel is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
}

/**
 * Information panel component
 */
export function InfoPanel({ isOpen, onClose }: InfoPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            About Flowmodoro
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            }
          />
        </div>
        
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Flowmodoro is a variant of the Pomodoro timer designed for deep work and natural focus cycles.
          </p>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              How it works:
            </h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Start working and track your time</li>
              <li>Continue until you naturally lose focus</li>
              <li>Stop the timer to calculate your break time</li>
              <li>Take a break (Break time = Work time ÷ 5)</li>
              <li>Start a new session when ready</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Keyboard shortcuts:
            </h3>
            <ul className="space-y-1">
              <li><kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Space</kbd> - Start/Stop timer</li>
              <li><kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">R</kbd> - Reset timer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 