/**
 * Timer application constants
 */

import type { TimerConfig, TimerData, TimerStats } from "@/types/timer";

/**
 * Default timer configuration
 */
export const DEFAULT_TIMER_CONFIG: TimerConfig = {
  /** Break time = work time / 5 */
  breakRatio: 0.2,
  /** Update timer every 100ms for smooth display */
  updateInterval: 100,
  /** Persist state in localStorage by default */
  persistState: true,
} as const;

/**
 * Initial timer data state
 */
export const INITIAL_TIMER_DATA: TimerData = {
  workTime: 0,
  breakTime: 0,
  currentTime: 0,
  state: "idle",
  isRunning: false,
  startTime: null,
} as const;

/**
 * Initial timer statistics
 */
export const INITIAL_TIMER_STATS: TimerStats = {
  completedWorkSessions: 0,
  completedBreakSessions: 0,
  totalWorkTime: 0,
  totalBreakTime: 0,
  currentSessionCount: 0,
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  TIMER_DATA: "flowmodoro-timer-data",
  TIMER_STATS: "flowmodoro-timer-stats",
  TIMER_CONFIG: "flowmodoro-timer-config",
  THEME_PREFERENCE: "flowmodoro-theme",
} as const;

/**
 * Timer display formats
 */
export const TIMER_FORMATS = {
  /** Display format for work sessions (show hours if >= 1 hour) */
  WORK_DISPLAY: "dynamic",
  /** Display format for break sessions (always show minutes:seconds) */
  BREAK_DISPLAY: "mm:ss",
} as const;

/**
 * UI configuration constants
 */
export const UI_CONFIG = {
  /** Minimum work time before allowing break (in seconds) */
  MIN_WORK_TIME: 60,
  /** Maximum break time cap (in seconds) - 2 hours */
  MAX_BREAK_TIME: 7200,
  /** Notification timing before break/work ends (in seconds) */
  NOTIFICATION_WARNING_TIME: 30,
  /** Theme transition duration in milliseconds */
  THEME_TRANSITION_DURATION: 200,
  /** Timer animation duration in milliseconds */
  TIMER_ANIMATION_DURATION: 300,
} as const;

/**
 * Color scheme constants for different timer states
 */
export const TIMER_COLORS = {
  IDLE: {
    primary: "bg-gray-100 dark:bg-gray-800",
    secondary: "text-gray-600 dark:text-gray-400",
    accent: "border-gray-300 dark:border-gray-600",
  },
  WORKING: {
    primary: "bg-blue-50 dark:bg-blue-900/20",
    secondary: "text-blue-600 dark:text-blue-400",
    accent: "border-blue-300 dark:border-blue-600",
  },
  BREAK: {
    primary: "bg-green-50 dark:bg-green-900/20",
    secondary: "text-green-600 dark:text-green-400",
    accent: "border-green-300 dark:border-green-600",
  },
} as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  TOGGLE_TIMER: " ", // Spacebar
  RESET_TIMER: "r",
  TOGGLE_THEME: "t",
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  STORAGE_NOT_AVAILABLE: "Local storage is not available",
  INVALID_TIMER_STATE: "Invalid timer state detected",
  TIMER_UPDATE_FAILED: "Failed to update timer",
  STATE_RESTORATION_FAILED: "Failed to restore previous state",
} as const;
