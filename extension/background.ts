import {
  BREAK_END_ALARM,
  STORAGE_KEY,
  TimerSnapshot,
  initialSnapshot,
} from '../src/lib/timer';

const OFFSCREEN_URL = 'offscreen.html';
const CHIME_LIFETIME_MS = 2500;

const clearAlarm = () => chrome.alarms.clear(BREAK_END_ALARM);

const ensureOffscreenDocument = async () => {
  const existing = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
  });
  if (existing.length > 0) return;
  await chrome.offscreen.createDocument({
    url: OFFSCREEN_URL,
    reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
    justification: 'Play notification chime when the break timer ends.',
  });
};

const playBreakEndSound = async () => {
  try {
    await ensureOffscreenDocument();
    await chrome.runtime.sendMessage({
      target: 'offscreen',
      type: 'play-break-end-sound',
    });
  } catch (error) {
    console.warn('Flowmodoro: failed to play break-end sound', error);
  } finally {
    setTimeout(() => {
      chrome.offscreen.closeDocument().catch(() => {
        // No-op: document may already be closed.
      });
    }, CHIME_LIFETIME_MS);
  }
};

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
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const snap = stored[STORAGE_KEY] as TimerSnapshot | undefined;
  // Bail if break was already ended (e.g. via manual reset from the popup).
  if (!snap || snap.status !== 'breaking' || !snap.isRunning) return;
  await chrome.storage.local.set({ [STORAGE_KEY]: { ...initialSnapshot } });
  await playBreakEndSound();
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
