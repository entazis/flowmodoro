# Flowmodoro

Flowmodoro is a special variant of the Pomodoro timer designed for deep work and natural focus cycles. Unlike traditional Pomodoro timers with fixed work intervals, Flowmodoro allows you to work until your focus fades and calculates the break time proportionally.

---

## 📝 **Project Overview**

Build a **beautiful web timer application** that:

- Allows starting and stopping a work timer.

- Calculates the break duration based on the elapsed work time:

  **Break time = elapsed work time / 5**

- Starts counting down the break when the user clicks start after finishing work.

- After the break finishes, clicking start begins a new work session counting upwards.

---

## 🎯 **Features**

✅ Start/Stop timer for work sessions\
✅ Calculate break time automatically\
✅ Countdown timer for breaks\
✅ Loop between work sessions and breaks\
✅ Responsive, minimal, beautiful UI\
✅ Dark mode support\
✅ Clear audio or visual notifications (future enhancement)

---

## 💡 **Flowmodoro Technique**

### **How it works:**

1. Set a clear goal for your work session.
2. Start working and track your time with the timer.
3. Continue until you naturally feel your focus waning.
4. Stop the timer. The app calculates your break duration (**work time / 5**).
5. Take the break. You can start it manually or configure auto-start (future enhancement).
6. After break finishes, starting again begins a new work session.

### **Benefits:**

- Increased productivity through **deep focus**
- Enhanced creativity by allowing **natural flow**
- Better time management with **flexible pacing**
- Reduced procrastination through immersion

---

## 🍅 **Comparison to Pomodoro Technique**

| **Pomodoro**                        | **Flowmodoro**                           |
| ----------------------------------- | ---------------------------------------- |
| Fixed 25 min work sessions          | Flexible work duration until focus fades |
| 5 min break after each work session | Break = work time / 5                    |
| 4 cycles → long break (15-30 min)   | No fixed cycles, natural flow            |
| Focus on structured discipline      | Focus on adaptability and deep work      |

---

## 🔧 **Tech Stack**

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS (with dark mode using `dark` class strategy)
- **Package Manager:** pnpm
- **Node.js:** Latest LTS (v20+ recommended)

---

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js >= 20 (Latest LTS)
- pnpm (recommended)

Install pnpm globally if you haven’t:

```bash
npm install -g pnpm
```

### **Setup**

```bash
npx create-next-app@latest . --use-pnpm --typescript --eslint --tailwind --src-dir --import-alias "@/*"
pnpm install
```

### **Running the Development Server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### **Suggested Project Structure**

```
/src
  /components
    Timer.tsx
    BreakTimer.tsx
  /pages
    index.tsx
  /styles
    globals.css
  /utils
    time.ts
```

---

## 🛠️ **Implementation Notes**

- Use React hooks (useState, useEffect) for timer logic.
- Consider setInterval with cleanup for accurate timing.
- State machine approach for managing work, break, and idle states enhances clarity.
- UI transitions should clearly indicate work vs break mode.
- Prioritize mobile responsiveness and dark mode compatibility.
- Keep state management simple and scoped to components for clarity.

### 🔍 **Suggested Timer Utility Functions**

```ts
startWorkTimer(): void // Starts counting work time upward.
stopWorkTimer(): number // Stops work timer and returns elapsed time in seconds.
calculateBreakTime(workTime: number): number // Returns break time as workTime / 5.
startBreakTimer(breakTime: number): void // Starts countdown for break.
stopBreakTimer(): void // Stops break timer.
```

### 📌 **Edge Cases & Clarifications**

- Should timers persist on page reload? **(Recommended: use localStorage)**
- Should break timers auto-start after work ends? **Currently: user starts manually**
- Add sound or visual notifications when break or work ends. **(Future enhancement)**

---

## ✨ **Future Enhancements**

- Persistent state with localStorage or cookies
- Sound notifications on work/break end
- Customizable break ratio (instead of always /5)
- Long break suggestion after multiple cycles
- Statistics dashboard for completed sessions

---

## 🖌 **Design**

- Clean, minimal interface
- Prominent Start/Stop button
- Clear timer display indicating current mode (work or break)
- Visual differentiation between work and break timers (colors, labels, or icons)
- Smooth transitions and dark mode support

---

## 🤖 **Recommended LLM Implementation Prompt**

“Implement an iFlowmodoro timer application using Next.js and Tailwind CSS. Scaffold the project with TypeScript, ESLint, Tailwind CSS, and pnpm. Create a start/stop timer for work sessions that calculates break time as work time divided by 5. When stopping work, the app should allow the user to start the break countdown timer. After the break finishes, starting again begins a new work session. Implement dark mode using Tailwind's dark class strategy. Maintain clean React component structure with separate Timer and BreakTimer components, use React hooks for state and intervals, ensure mobile responsiveness, and implement a clear state machine for work, break, and idle states.”

---

## 👤 **Author**

Bence Szabó

## 📄 **License**

MIT

> "iFlowmodoro – combine discipline with flow."

