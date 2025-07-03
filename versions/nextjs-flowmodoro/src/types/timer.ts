/**
 * Timer application type definitions
 */

/**
 * Possible states of the timer
 */
export type TimerState = "idle" | "working" | "break";

/**
 * Timer data interface containing all timer-related information
 */
export interface TimerData {
  /** Current work time in seconds */
  workTime: number;
  /** Calculated break time in seconds */
  breakTime: number;
  /** Current time being displayed (work time during work, remaining break time during break) */
  currentTime: number;
  /** Current state of the timer */
  state: TimerState;
  /** Whether the timer is currently running */
  isRunning: boolean;
  /** Timestamp when the current session started */
  startTime: number | null;
}

/**
 * Timer configuration interface
 */
export interface TimerConfig {
  /** Break calculation ratio (default: 0.2 for 1/5) */
  breakRatio: number;
  /** Timer update interval in milliseconds */
  updateInterval: number;
  /** Whether to persist state in localStorage */
  persistState: boolean;
}

/**
 * Timer statistics interface
 */
export interface TimerStats {
  /** Total completed work sessions */
  completedWorkSessions: number;
  /** Total completed break sessions */
  completedBreakSessions: number;
  /** Total work time in seconds */
  totalWorkTime: number;
  /** Total break time in seconds */
  totalBreakTime: number;
  /** Current session count */
  currentSessionCount: number;
}

/**
 * Local storage data structure
 */
export interface TimerStorageData {
  timerData: TimerData;
  stats: TimerStats;
  config: TimerConfig;
  lastUpdated: number;
}

/**
 * Timer action types for state management
 */
export type TimerAction =
  | { type: "START_WORK" }
  | { type: "STOP_WORK"; workTime: number }
  | { type: "START_BREAK"; breakTime: number }
  | { type: "STOP_BREAK" }
  | { type: "TICK"; currentTime: number }
  | { type: "RESET" }
  | { type: "LOAD_STATE"; data: TimerStorageData };

/**
 * Timer event callbacks
 */
export interface TimerCallbacks {
  onWorkStart?: () => void;
  onWorkEnd?: (workTime: number) => void;
  onBreakStart?: (breakTime: number) => void;
  onBreakEnd?: () => void;
  onTick?: (currentTime: number, state: TimerState) => void;
  onReset?: () => void;
}
