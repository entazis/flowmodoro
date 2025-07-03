/**
 * Timer utility functions
 */

import type { TimerState } from "@/types/timer";

/**
 * Formats time in seconds to a human-readable string
 * @param seconds - Time in seconds
 * @param format - Format type ('dynamic', 'mm:ss', 'hh:mm:ss')
 * @returns Formatted time string
 */
export function formatTime(
  seconds: number,
  format: "dynamic" | "mm:ss" | "hh:mm:ss" = "dynamic"
): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num: number): string => num.toString().padStart(2, "0");

  switch (format) {
    case "hh:mm:ss":
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;

    case "mm:ss":
      return `${pad(minutes)}:${pad(secs)}`;

    case "dynamic":
    default:
      if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
      }
      return `${pad(minutes)}:${pad(secs)}`;
  }
}

/**
 * Calculates break time based on work time and ratio
 * @param workTime - Work time in seconds
 * @param ratio - Break ratio (default: 0.2 for 1/5)
 * @returns Break time in seconds
 */
export function calculateBreakTime(
  workTime: number,
  ratio: number = 0.2
): number {
  if (workTime <= 0) return 0;
  return Math.floor(workTime * ratio);
}

/**
 * Validates timer state
 * @param state - Timer state to validate
 * @returns True if state is valid
 */
export function validateTimerState(state: TimerState): boolean {
  return ["idle", "working", "break"].includes(state);
}

/**
 * Calculates elapsed time since start
 * @param startTime - Start timestamp in milliseconds
 * @returns Elapsed time in seconds
 */
export function calculateElapsedTime(startTime: number): number {
  if (!startTime) return 0;
  return Math.floor((Date.now() - startTime) / 1000);
}

/**
 * Converts milliseconds to seconds
 * @param milliseconds - Time in milliseconds
 * @returns Time in seconds
 */
export function millisecondsToSeconds(milliseconds: number): number {
  return Math.floor(milliseconds / 1000);
}

/**
 * Converts seconds to milliseconds
 * @param seconds - Time in seconds
 * @returns Time in milliseconds
 */
export function secondsToMilliseconds(seconds: number): number {
  return seconds * 1000;
}

/**
 * Checks if a number is a valid time value
 * @param time - Time value to validate
 * @returns True if time is valid (non-negative number)
 */
export function isValidTime(time: number): boolean {
  return typeof time === "number" && time >= 0 && !isNaN(time);
}

/**
 * Clamps a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats duration in a human-readable way
 * @param seconds - Duration in seconds
 * @returns Human-readable duration string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    if (remainingSeconds === 0) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Gets the current timestamp in milliseconds
 * @returns Current timestamp
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * Calculates the percentage of time elapsed
 * @param current - Current time
 * @param total - Total time
 * @returns Percentage (0-100)
 */
export function calculateProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  return clamp((current / total) * 100, 0, 100);
}

/**
 * Debounces a function call
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
