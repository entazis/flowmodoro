import {
  BREAK_END_ALARM,
  STORAGE_KEY,
  TimerSnapshot,
  initialSnapshot,
} from '../src/lib/timer';

const clearAlarm = () => chrome.alarms.clear(BREAK_END_ALARM);

const scheduleBreakEnd = (snap: TimerSnapshot) => {
  if (
    snap.status !== 'breaking' ||
    !snap.isRunning ||
    snap.breakStartTime == null ||
    snap.breakDuration <= 0
  ) {
    return clearAlarm();
  }
  const when = snap.breakStartTime + snap.breakDuration * 1000;
  if (when <= Date.now()) {
    return endBreak();
  }
  chrome.alarms.create(BREAK_END_ALARM, { when });
};

const endBreak = async () => {
  await chrome.storage.local.set({ [STORAGE_KEY]: { ...initialSnapshot } });
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon-128.png',
    title: 'Break finished',
    message: 'Back to flow when you are ready.',
    priority: 2,
  });
};

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  if (!(STORAGE_KEY in stored)) {
    await chrome.storage.local.set({ [STORAGE_KEY]: { ...initialSnapshot } });
  } else {
    scheduleBreakEnd(stored[STORAGE_KEY] as TimerSnapshot);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  if (STORAGE_KEY in stored) {
    scheduleBreakEnd(stored[STORAGE_KEY] as TimerSnapshot);
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !(STORAGE_KEY in changes)) return;
  const next = changes[STORAGE_KEY].newValue as TimerSnapshot | undefined;
  if (!next) return clearAlarm();
  scheduleBreakEnd(next);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === BREAK_END_ALARM) endBreak();
});
