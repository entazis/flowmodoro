/**
 * Main timer hook that manages all timer logic and state
 */

import {
  DEFAULT_TIMER_CONFIG,
  INITIAL_TIMER_DATA,
  INITIAL_TIMER_STATS,
  STORAGE_KEYS,
} from "@/constants/timer";
import type {
  TimerCallbacks,
  TimerConfig,
  TimerData,
  TimerStats,
} from "@/types/timer";
import {
  calculateBreakTime,
  calculateElapsedTime,
  getCurrentTimestamp,
} from "@/utils/timer";
import { useCallback, useRef, useState } from "react";
import { useInterval } from "./use-interval";
import { useLocalStorage } from "./use-local-storage";

/**
 * Main timer hook
 * @param callbacks - Optional callbacks for timer events
 * @returns Timer state and control functions
 */
export function useTimer(callbacks?: TimerCallbacks) {
  // State management
  const [timerData, setTimerData] = useLocalStorage<TimerData>(
    STORAGE_KEYS.TIMER_DATA,
    INITIAL_TIMER_DATA
  );

  const [stats, setStats] = useLocalStorage<TimerStats>(
    STORAGE_KEYS.TIMER_STATS,
    INITIAL_TIMER_STATS
  );

  const [config, setConfig] = useLocalStorage<TimerConfig>(
    STORAGE_KEYS.TIMER_CONFIG,
    DEFAULT_TIMER_CONFIG
  );

  // Keep track of break countdown
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0);

  // Refs for callbacks
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  // Update timer every interval when running
  const updateTimer = useCallback(() => {
    if (!timerData.isRunning || !timerData.startTime) return;

    const elapsed = calculateElapsedTime(timerData.startTime);

    if (timerData.state === "working") {
      // Update work time
      setTimerData((prev) => ({
        ...prev,
        workTime: elapsed,
        currentTime: elapsed,
      }));

      callbacksRef.current?.onTick?.(elapsed, "working");
    } else if (timerData.state === "break") {
      // Update break countdown
      const remaining = Math.max(0, timerData.breakTime - elapsed);
      setBreakTimeRemaining(remaining);

      setTimerData((prev) => ({
        ...prev,
        currentTime: remaining,
      }));

      callbacksRef.current?.onTick?.(remaining, "break");

      // Auto-stop break when it reaches zero
      if (remaining === 0) {
        stopBreak();
      }
    }
  }, [timerData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Use interval to update timer
  useInterval(updateTimer, timerData.isRunning ? config.updateInterval : null);

  /**
   * Start a work session
   */
  const startWork = useCallback(() => {
    const now = getCurrentTimestamp();

    setTimerData((prev) => ({
      ...prev,
      state: "working",
      isRunning: true,
      startTime: now,
      workTime: 0,
      currentTime: 0,
      breakTime: 0,
    }));

    setStats((prev) => ({
      ...prev,
      currentSessionCount: prev.currentSessionCount + 1,
    }));

    callbacksRef.current?.onWorkStart?.();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Stop the current work session
   */
  const stopWork = useCallback(() => {
    if (timerData.state !== "working" || !timerData.startTime) return;

    const finalWorkTime = calculateElapsedTime(timerData.startTime);
    const calculatedBreakTime = calculateBreakTime(
      finalWorkTime,
      config.breakRatio
    );

    setTimerData((prev) => ({
      ...prev,
      state: "idle",
      isRunning: false,
      startTime: null,
      workTime: finalWorkTime,
      breakTime: calculatedBreakTime,
      currentTime: finalWorkTime,
    }));

    setStats((prev) => ({
      ...prev,
      completedWorkSessions: prev.completedWorkSessions + 1,
      totalWorkTime: prev.totalWorkTime + finalWorkTime,
    }));

    callbacksRef.current?.onWorkEnd?.(finalWorkTime);

    return finalWorkTime;
  }, [timerData, config.breakRatio]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Start a break session
   */
  const startBreak = useCallback(() => {
    if (timerData.breakTime <= 0) return;

    const now = getCurrentTimestamp();

    setTimerData((prev) => ({
      ...prev,
      state: "break",
      isRunning: true,
      startTime: now,
      currentTime: prev.breakTime,
    }));

    setBreakTimeRemaining(timerData.breakTime);

    callbacksRef.current?.onBreakStart?.(timerData.breakTime);
  }, [timerData.breakTime]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Stop the current break session
   */
  const stopBreak = useCallback(() => {
    if (timerData.state !== "break") return;

    const breakTimeUsed = timerData.startTime
      ? calculateElapsedTime(timerData.startTime)
      : 0;

    setTimerData((prev) => ({
      ...prev,
      state: "idle",
      isRunning: false,
      startTime: null,
      currentTime: 0,
    }));

    setStats((prev) => ({
      ...prev,
      completedBreakSessions: prev.completedBreakSessions + 1,
      totalBreakTime: prev.totalBreakTime + breakTimeUsed,
    }));

    setBreakTimeRemaining(0);

    callbacksRef.current?.onBreakEnd?.();
  }, [timerData]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Reset timer to initial state
   */
  const resetTimer = useCallback(() => {
    setTimerData(INITIAL_TIMER_DATA);
    setBreakTimeRemaining(0);
    callbacksRef.current?.onReset?.();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Toggle timer (start/stop based on current state)
   */
  const toggleTimer = useCallback(() => {
    if (timerData.state === "working" && timerData.isRunning) {
      stopWork();
    } else if (timerData.state === "break" && timerData.isRunning) {
      stopBreak();
    } else if (timerData.state === "idle" && timerData.breakTime > 0) {
      startBreak();
    } else {
      startWork();
    }
  }, [timerData, startWork, stopWork, startBreak, stopBreak]);

  /**
   * Update timer configuration
   */
  const updateConfig = useCallback((newConfig: Partial<TimerConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Get current display time based on state
   */
  const getDisplayTime = useCallback(() => {
    switch (timerData.state) {
      case "working":
        return timerData.currentTime;
      case "break":
        return breakTimeRemaining;
      case "idle":
      default:
        return timerData.workTime || 0;
    }
  }, [timerData, breakTimeRemaining]);

  /**
   * Get button text based on current state
   */
  const getButtonText = useCallback(() => {
    if (timerData.isRunning) {
      return timerData.state === "working" ? "Stop Work" : "Stop Break";
    }

    if (timerData.state === "idle" && timerData.breakTime > 0) {
      return "Start Break";
    }

    return "Start Work";
  }, [timerData]);

  /**
   * Check if break is available
   */
  const isBreakAvailable =
    timerData.state === "idle" && timerData.breakTime > 0;

  /**
   * Check if timer can be started
   */
  const canStart = !timerData.isRunning;

  /**
   * Check if timer can be stopped
   */
  const canStop = timerData.isRunning;

  return {
    // State
    timerData,
    stats,
    config,
    breakTimeRemaining,

    // Computed values
    displayTime: getDisplayTime(),
    buttonText: getButtonText(),
    isBreakAvailable,
    canStart,
    canStop,

    // Actions
    startWork,
    stopWork,
    startBreak,
    stopBreak,
    resetTimer,
    toggleTimer,
    updateConfig,

    // Utility
    isRunning: timerData.isRunning,
    currentState: timerData.state,
    currentWorkTime: timerData.workTime,
    currentBreakTime: timerData.breakTime,
  };
}
