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

// Wakes the worker shortly before the break ends so it can arm a precise timer.
const BREAK_ARM_ALARM = "flowmodoro:break-arm";

// Any extension API call resets Chrome's 30s service-worker idle timer; ping
// comfortably inside that window.
const KEEPALIVE_INTERVAL_MS = 20_000;

// How early to wake. Must clear two floors: Chrome refuses to deliver alarms
// less than ~30s out, and delivery itself runs late by a random 10-30s. 90s
// leaves margin on both so the arm alarm always lands before the break ends.
const ARM_LEAD_MS = 90_000;

const clearAlarms = () =>
  Promise.all([
    chrome.alarms.clear(BREAK_END_ALARM),
    chrome.alarms.clear(BREAK_ARM_ALARM),
  ]);

let keepaliveTimer: ReturnType<typeof setInterval> | null = null;
let preciseTimer: ReturnType<typeof setTimeout> | null = null;
let endingBreak = false;

const stopBreakTimers = () => {
  if (keepaliveTimer !== null) {
    clearInterval(keepaliveTimer);
    keepaliveTimer = null;
  }
  if (preciseTimer !== null) {
    clearTimeout(preciseTimer);
    preciseTimer = null;
  }
};

// Hold the worker awake and end the break on a precise in-worker timeout.
// Only used for the final stretch of a break — see scheduleBreakEnd.
const startBreakTimers = (when: number) => {
  stopBreakTimers();
  keepaliveTimer = setInterval(() => {
    chrome.runtime.getPlatformInfo().catch(() => {
      // No-op: keepalive ping only exists for its side effect.
    });
  }, KEEPALIVE_INTERVAL_MS);
  preciseTimer = setTimeout(() => {
    preciseTimer = null;
    endBreak();
  }, Math.max(0, when - Date.now()));
};

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
    stopBreakTimers();
    return clearAlarms();
  }
  const when = snap.breakStartTime + snap.breakDuration * 1000;
  if (when <= Date.now()) {
    stopBreakTimers();
    return endBreak();
  }
  // Safety net for both paths below: if Chrome evicts the worker anyway (device
  // sleep, memory pressure), the in-memory timers die with it and only this is
  // left. Late, but never silent.
  chrome.alarms.create(BREAK_END_ALARM, { when });

  // Keeping the worker awake costs memory, so only do it for the final stretch.
  // Sleep through the rest of the break and let a cheap alarm wake us early —
  // that alarm can be its usual tens-of-seconds late and still land in time,
  // because ARM_LEAD_MS is budgeted for exactly that.
  if (when - Date.now() > ARM_LEAD_MS) {
    chrome.alarms.clear(BREAK_ARM_ALARM);
    chrome.alarms.create(BREAK_ARM_ALARM, { when: when - ARM_LEAD_MS });
    stopBreakTimers();
    return;
  }
  // Inside the lead window — either a short break, or the arm alarm just woke
  // us. Hold the worker and end on the precise timer.
  chrome.alarms.clear(BREAK_ARM_ALARM);
  startBreakTimers(when);
};

const endBreak = async () => {
  // The precise timer and the safety-net alarm can both land; the storage check
  // below only rejects the second one once the first has finished writing.
  if (endingBreak) return;
  endingBreak = true;
  try {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    const snap = stored[STORAGE_KEY] as TimerSnapshot | undefined;
    // Bail if break was already ended (e.g. via manual reset from the popup,
    // or by an open popup ending it locally).
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
  } finally {
    endingBreak = false;
  }
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

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === BREAK_END_ALARM) endBreak();
  if (alarm.name === NOTIF_CLEAR_ALARM) chrome.notifications.clear(NOTIF_ID);
  if (alarm.name === BREAK_ARM_ALARM) {
    // Re-read rather than trusting the alarm: the break may have been reset or
    // restarted while we slept. scheduleBreakEnd decides what this snapshot
    // now needs — usually arming the precise timer for the final stretch.
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    scheduleBreakEnd(
      (stored[STORAGE_KEY] as TimerSnapshot | undefined) ?? initialSnapshot
    );
  }
});

// The keepalive and precise timer live in worker memory, so they die with the
// worker. Top-level code runs on every worker start, so re-arm from the
// persisted snapshot on whatever wakes us — not just install/startup.
chrome.storage.local.get(STORAGE_KEY).then((stored) => {
  const snap =
    (stored[STORAGE_KEY] as TimerSnapshot | undefined) ?? initialSnapshot;
  scheduleBreakEnd(snap);
  applyAction(snap);
});
