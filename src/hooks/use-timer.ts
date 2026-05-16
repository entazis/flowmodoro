import { useCallback, useEffect, useRef, useState } from 'react';
import {
  STORAGE_KEY,
  TimerSnapshot,
  calcBreakDuration,
  computeBreakRemaining,
  computeWorkSeconds,
  initialSnapshot,
} from '@/lib/timer';
import { playNotificationSound } from '@/utils/audioUtils';

type ChromeStorageArea = {
  get: (
    key: string,
    cb: (items: Record<string, unknown>) => void
  ) => void;
  set: (items: Record<string, unknown>, cb?: () => void) => void;
};

type ChromeStorageChange = { newValue?: unknown; oldValue?: unknown };

type ChromeLike = {
  storage?: {
    local: ChromeStorageArea;
    onChanged: {
      addListener: (
        cb: (
          changes: Record<string, ChromeStorageChange>,
          area: string
        ) => void
      ) => void;
      removeListener: (
        cb: (
          changes: Record<string, ChromeStorageChange>,
          area: string
        ) => void
      ) => void;
    };
  };
};

const getChrome = (): ChromeLike | undefined => {
  if (typeof globalThis === 'undefined') return undefined;
  const c = (globalThis as unknown as { chrome?: ChromeLike }).chrome;
  return c && c.storage ? c : undefined;
};

const loadSnapshot = (): Promise<TimerSnapshot> => {
  const chrome = getChrome();
  if (!chrome?.storage) return Promise.resolve(initialSnapshot);
  return new Promise((resolve) => {
    chrome.storage!.local.get(STORAGE_KEY, (items) => {
      const stored = items[STORAGE_KEY] as TimerSnapshot | undefined;
      resolve(stored ?? initialSnapshot);
    });
  });
};

const persistSnapshot = (snap: TimerSnapshot): void => {
  const chrome = getChrome();
  if (!chrome?.storage) return;
  chrome.storage.local.set({ [STORAGE_KEY]: snap });
};

export interface TimerApi {
  status: TimerSnapshot['status'];
  isRunning: boolean;
  workTime: number;
  breakTime: number;
  startTimer: () => void;
  resetTimer: () => void;
}

export const useTimer = (): TimerApi => {
  const [snapshot, setSnapshot] = useState<TimerSnapshot>(initialSnapshot);
  const [workTime, setWorkTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const snapshotRef = useRef<TimerSnapshot>(initialSnapshot);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hydratedRef = useRef(false);

  const applySnapshot = useCallback((next: TimerSnapshot) => {
    snapshotRef.current = next;
    setSnapshot(next);
    const now = Date.now();
    setWorkTime(computeWorkSeconds(next, now));
    setBreakTime(computeBreakRemaining(next, now));
  }, []);

  const commit = useCallback(
    (next: TimerSnapshot) => {
      applySnapshot(next);
      persistSnapshot(next);
    },
    [applySnapshot]
  );

  useEffect(() => {
    loadSnapshot().then((snap) => {
      hydratedRef.current = true;
      applySnapshot(snap);
    });
    const chrome = getChrome();
    if (!chrome?.storage) return;
    const listener = (
      changes: Record<string, ChromeStorageChange>,
      area: string
    ) => {
      if (area !== 'local' || !(STORAGE_KEY in changes)) return;
      const next = changes[STORAGE_KEY].newValue as TimerSnapshot | undefined;
      if (!next) return;
      if (
        JSON.stringify(next) === JSON.stringify(snapshotRef.current)
      ) {
        return;
      }
      applySnapshot(next);
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage!.onChanged.removeListener(listener);
  }, [applySnapshot]);

  useEffect(() => {
    const tick = () => {
      const snap = snapshotRef.current;
      const now = Date.now();
      if (snap.status === 'working' && snap.isRunning) {
        setWorkTime(computeWorkSeconds(snap, now));
      } else if (snap.status === 'breaking' && snap.isRunning) {
        const remaining = computeBreakRemaining(snap, now);
        setBreakTime(remaining);
        if (remaining <= 0) {
          // Only the active context plays sound. Background worker also notifies via OS.
          if (!getChrome()) playNotificationSound();
          commit({
            ...initialSnapshot,
          });
        }
      }
    };
    if (snapshot.isRunning) {
      tick();
      tickRef.current = setInterval(tick, 1000);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [snapshot.isRunning, snapshot.status, commit]);

  const startTimer = useCallback(() => {
    const snap = snapshotRef.current;
    const now = Date.now();
    if (snap.status === 'idle') {
      commit({
        ...initialSnapshot,
        status: 'working',
        isRunning: true,
        startTime: now,
      });
    } else if (snap.status === 'working') {
      const worked = computeWorkSeconds(snap, now);
      const duration = calcBreakDuration(worked);
      commit({
        ...snap,
        status: 'breaking',
        isRunning: false,
        startTime: null,
        pausedTime: 0,
        breakStartTime: null,
        breakDuration: duration,
      });
    } else if (snap.status === 'breaking') {
      commit({
        ...snap,
        isRunning: true,
        breakStartTime: now,
      });
    }
  }, [commit]);

  const resetTimer = useCallback(() => {
    commit({ ...initialSnapshot });
  }, [commit]);

  return {
    status: snapshot.status,
    isRunning: snapshot.isRunning,
    workTime,
    breakTime,
    startTimer,
    resetTimer,
  };
};
