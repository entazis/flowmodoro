/// <reference types="vite/client" />
import {
  BREAK_END_ALARM,
  STORAGE_KEY,
  TimerSnapshot,
  initialSnapshot,
} from "../src/lib/timer";
import iconOrangeRun128 from "./icons/icon-128-orange-run.png?url";
import iconOrange128 from "./icons/icon-128-orange.png?url";
import iconBlueRun128 from "./icons/icon-128-run.png?url";
import iconOrangeRun16 from "./icons/icon-16-orange-run.png?url";
import iconOrange16 from "./icons/icon-16-orange.png?url";
import iconBlueRun16 from "./icons/icon-16-run.png?url";
import iconOrangeRun32 from "./icons/icon-32-orange-run.png?url";
import iconOrange32 from "./icons/icon-32-orange.png?url";
import iconBlueRun32 from "./icons/icon-32-run.png?url";
import iconOrangeRun48 from "./icons/icon-48-orange-run.png?url";
import iconOrange48 from "./icons/icon-48-orange.png?url";
import iconBlueRun48 from "./icons/icon-48-run.png?url";

const OFFSCREEN_URL = "offscreen.html";
const CHIME_LIFETIME_MS = 2500;

const NOTIF_CLEAR_ALARM = "flowmodoro:clear-notification";
const NOTIF_ID = "flowmodoro-break-end";

const clearAlarm = () => chrome.alarms.clear(BREAK_END_ALARM);

const ICON_SETS = {
  idle: {
    16: "icons/icon-16.png",
    32: "icons/icon-32.png",
    48: "icons/icon-48.png",
    128: "icons/icon-128.png",
  },
  working: {
    16: iconBlueRun16,
    32: iconBlueRun32,
    48: iconBlueRun48,
    128: iconBlueRun128,
  },
  breakReady: {
    16: iconOrange16,
    32: iconOrange32,
    48: iconOrange48,
    128: iconOrange128,
  },
  breakRunning: {
    16: iconOrangeRun16,
    32: iconOrangeRun32,
    48: iconOrangeRun48,
    128: iconOrangeRun128,
  },
} as const;

const pickIconSet = (snap: TimerSnapshot) => {
  if (snap.status === "working") return ICON_SETS.working;
  if (snap.status === "breaking") {
    return snap.isRunning ? ICON_SETS.breakRunning : ICON_SETS.breakReady;
  }
  return ICON_SETS.idle;
};

const applyAction = async (snap: TimerSnapshot) => {
  try {
    await chrome.action.setIcon({ path: pickIconSet(snap) });
    await chrome.action.setBadgeText({ text: "" });
  } catch (error) {
    console.warn("Flowmodoro: failed to update toolbar icon", error);
  }
};

const ensureOffscreenDocument = async () => {
  const existing = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
  });
  if (existing.length > 0) return;
  await chrome.offscreen.createDocument({
    url: OFFSCREEN_URL,
    reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
    justification: "Play notification chime when the break timer ends.",
  });
};

const playBreakEndSound = async () => {
  try {
    await ensureOffscreenDocument();
    await chrome.runtime.sendMessage({
      target: "offscreen",
      type: "play-break-end-sound",
    });
  } catch (error) {
    console.warn("Flowmodoro: failed to play break-end sound", error);
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
    snap.status !== "breaking" ||
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
  if (!snap || snap.status !== "breaking" || !snap.isRunning) return;
  await chrome.storage.local.set({ [STORAGE_KEY]: { ...initialSnapshot } });
  await playBreakEndSound();
  chrome.notifications.create(NOTIF_ID, {
    type: "basic",
    iconUrl: "icons/icon-128.png",
    title: "Break finished",
    message: "Back to flow when you are ready.",
    requireInteraction: false,
  });
  chrome.alarms.create(NOTIF_CLEAR_ALARM, { delayInMinutes: 0.1 });
};

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  if (!(STORAGE_KEY in stored)) {
    await chrome.storage.local.set({ [STORAGE_KEY]: { ...initialSnapshot } });
  } else {
    const snap = stored[STORAGE_KEY] as TimerSnapshot;
    scheduleBreakEnd(snap);
    applyAction(snap);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const snap =
    (stored[STORAGE_KEY] as TimerSnapshot | undefined) ?? initialSnapshot;
  scheduleBreakEnd(snap);
  applyAction(snap);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !(STORAGE_KEY in changes)) return;
  const next =
    (changes[STORAGE_KEY].newValue as TimerSnapshot | undefined) ??
    initialSnapshot;
  scheduleBreakEnd(next);
  applyAction(next);
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === BREAK_END_ALARM) endBreak();
  if (alarm.name === NOTIF_CLEAR_ALARM) chrome.notifications.clear(NOTIF_ID);
});
