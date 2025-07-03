/**
 * Main Timer component that integrates all timer functionality
 */

import { Card, CardBody } from '@/components/ui/card';
import { KEYBOARD_SHORTCUTS, TIMER_COLORS } from '@/constants/timer';
import { useTimer } from '@/hooks/use-timer';
import type { TimerCallbacks } from '@/types/timer';
import { useCallback, useEffect } from 'react';
import { TimerControls } from './timer-controls';
import { TimerDisplay } from './timer-display';
import { TimerStatus } from './timer-status';

interface TimerProps {
  /** Timer event callbacks */
  callbacks?: TimerCallbacks;
  /** Additional class names */
  className?: string;
}

/**
 * Main Timer component
 */
export function Timer({ callbacks, className = '' }: TimerProps) {
  // Use the main timer hook
  const timer = useTimer(callbacks);

  // Keyboard shortcuts handler
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts if user is typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (event.key) {
      case KEYBOARD_SHORTCUTS.TOGGLE_TIMER:
        event.preventDefault();
        timer.toggleTimer();
        break;
      case KEYBOARD_SHORTCUTS.RESET_TIMER:
        event.preventDefault();
        timer.resetTimer();
        break;
      default:
        break;
    }
  }, [timer]);

  // Set up keyboard shortcuts
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Get color scheme based on current state
  const colorScheme = TIMER_COLORS[timer.currentState.toUpperCase() as keyof typeof TIMER_COLORS];

  const allClasses = [
    'w-full max-w-2xl mx-auto',
    'transition-all duration-300 ease-in-out',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={allClasses}>
      <Card
        variant="elevated"
        padding="lg"
        className={colorScheme.primary}
      >
        <CardBody className="space-y-8">
          {/* Timer Display */}
          <div className="text-center">
            <TimerDisplay
              time={timer.displayTime}
              state={timer.currentState}
              isRunning={timer.isRunning}
              size="xl"
            />
          </div>

          {/* Timer Status */}
          <TimerStatus
            state={timer.currentState}
            isRunning={timer.isRunning}
            workTime={timer.currentWorkTime}
            breakTime={timer.currentBreakTime}
            isBreakAvailable={timer.isBreakAvailable}
          />

          {/* Timer Controls */}
          <TimerControls
            state={timer.currentState}
            isRunning={timer.isRunning}
            isBreakAvailable={timer.isBreakAvailable}
            buttonText={timer.buttonText}
            onToggle={timer.toggleTimer}
            onReset={timer.resetTimer}
          />
        </CardBody>
      </Card>
    </div>
  );
} 