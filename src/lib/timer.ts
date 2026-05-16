export type TimerStatus = 'idle' | 'working' | 'breaking';

export interface TimerSnapshot {
  status: TimerStatus;
  isRunning: boolean;
  startTime: number | null;
  pausedTime: number;
  breakStartTime: number | null;
  breakDuration: number;
}

export const initialSnapshot: TimerSnapshot = {
  status: 'idle',
  isRunning: false,
  startTime: null,
  pausedTime: 0,
  breakStartTime: null,
  breakDuration: 0,
};

export const STORAGE_KEY = 'flowmodoro:timer';
export const BREAK_END_ALARM = 'flowmodoro:break-end';
export const MIN_BREAK_SECONDS = 60;

export const formatTime = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const calcBreakDuration = (workSeconds: number): number =>
  Math.max(Math.floor(workSeconds / 5), MIN_BREAK_SECONDS);

export const computeWorkSeconds = (snap: TimerSnapshot, now: number): number => {
  if (snap.status !== 'working' || snap.startTime == null) return 0;
  return Math.floor((now - snap.startTime) / 1000) + snap.pausedTime;
};

export const computeBreakRemaining = (
  snap: TimerSnapshot,
  now: number
): number => {
  if (snap.status !== 'breaking') return 0;
  if (!snap.isRunning || snap.breakStartTime == null) return snap.breakDuration;
  const elapsed = Math.floor((now - snap.breakStartTime) / 1000);
  return Math.max(0, snap.breakDuration - elapsed);
};
