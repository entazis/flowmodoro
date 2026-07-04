# Chrome Web Store Listing — Flowmodoro

**Category:** Productivity → Workflow & Planning

---

## Short summary (max 132 chars)

A flexible focus timer. Work until your focus fades, then take a break proportional to your effort. No accounts, no tracking.

---

## Detailed description

Flowmodoro is a focus timer that adapts to you — not the other way around.

Traditional Pomodoro locks you into fixed 25-minute blocks. Flowmodoro flips it: work for as long as you're in flow, and when your focus starts to fade, stop. Your break is then calculated automatically as a fraction of the time you just worked (work ÷ 5). Longer deep-work sessions earn longer rest; short bursts get short breaks. Simple, fair, and built around how focus actually works.

How it works
1. Click start and get to work — no timer counting down, no pressure.
2. When your attention drifts, stop the timer.
3. Flowmodoro calculates your break (one-fifth of your work time) and counts it down.
4. When the break ends, you get a gentle notification. Start again.

Features
• Flexible work sessions — no rigid blocks, work in your natural rhythm
• Automatic break calculation — break time scales with your focus time
• Desktop notifications when your break ends
• Optional sound alerts
• Clean light & dark themes
• Runs right from your toolbar — one click away, always
• Works fully offline

Private by design
Flowmodoro requires no account and no sign-up. It collects no personal data, sends nothing to any server, and includes no analytics or tracking. Everything stays on your device.

Work in flow, rest in balance.

---

# Privacy practices tab (required to publish)

## Single purpose description

Flowmodoro is a focus timer that implements the Flowmodoro technique: you work for as long as you stay focused, then take a break equal to one-fifth of the time you worked. Its single purpose is to time focus sessions and their proportional breaks from the browser toolbar.

## Permission justifications

**storage**
Saves the current timer state (working vs. break, elapsed time) and the theme preference on the user's own device so the timer persists when the popup is closed or the browser restarts. No data leaves the device.

**alarms**
Schedules the end of a break. The popup and the service worker can be closed while a break counts down, so chrome.alarms wakes the extension at the exact moment the break ends to notify the user, without keeping a page open.

**notifications**
Shows a desktop notification when a break finishes, so the user knows it is time to return to work even if the popup is closed and they are in another tab or app.

**offscreen**
Creates an offscreen document to play a short chime when a break ends. Manifest V3 service workers cannot play audio directly, so an offscreen document is the only supported way to play the notification sound.

## Remote code

Set the toggle to "No, I am not using remote code." All executable code is bundled in the
extension package — no CDN scripts, no eval, no remotely hosted modules or WASM. Selecting "No"
clears the requirement. If a justification box still appears:

All executable code is bundled in the extension package. The extension does not load or run any script, module, evaluated string, or WASM from a remote server.

## Data usage

In the Data collection section, leave every data-type checkbox unchecked (the extension collects
no user data). Then tick all three certification boxes — all true for this extension:
- Not sold or transferred to third parties, outside the approved use cases.
- Not used or transferred for purposes unrelated to the item's single purpose.
- Not used to determine creditworthiness or for lending purposes.

---

# Settings page (done in the dashboard, not in code)

- Contact email: add a publisher contact email (e.g. bence@beam.live) on the Settings page.
- Verify it: click the verification link Google emails. Publishing is blocked until it shows verified.
