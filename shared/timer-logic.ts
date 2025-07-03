/**
 * Shared Timer Logic for Flowmodoro Applications
 * Can be used by both Next.js and Vite versions
 */

export type TimerState = "idle" | "working" | "breaking";

export interface TimerConfig {
  workTime: number;
  breakRatio: number; // e.g., 5 means break = workTime / 5
}

export interface TimerData {
  state: TimerState;
  currentTime: number;
  workTime: number;
  breakTime: number;
  isRunning: boolean;
}

export class FlowmodoroTimer {
  private state: TimerState = "idle";
  private currentTime: number = 0;
  private workTime: number = 0;
  private breakTime: number = 0;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private config: TimerConfig;
  private onUpdate?: (data: TimerData) => void;

  constructor(config: TimerConfig = { workTime: 0, breakRatio: 5 }) {
    this.config = config;
  }

  /**
   * Set callback for timer updates
   */
  onTimerUpdate(callback: (data: TimerData) => void): void {
    this.onUpdate = callback;
  }

  /**
   * Start work session
   */
  startWork(): void {
    this.state = "working";
    this.currentTime = 0;
    this.isRunning = true;
    this.startInterval();
    this.notifyUpdate();
  }

  /**
   * Stop work session and calculate break time
   */
  stopWork(): number {
    if (this.state === "working") {
      this.workTime = this.currentTime;
      this.breakTime = Math.floor(this.workTime / this.config.breakRatio);
      this.state = "idle";
      this.isRunning = false;
      this.stopInterval();
      this.notifyUpdate();
      return this.breakTime;
    }
    return 0;
  }

  /**
   * Start break session
   */
  startBreak(): void {
    if (this.breakTime > 0) {
      this.state = "breaking";
      this.currentTime = this.breakTime;
      this.isRunning = true;
      this.startInterval(true); // Count down for break
      this.notifyUpdate();
    }
  }

  /**
   * Pause current session
   */
  pause(): void {
    this.isRunning = false;
    this.stopInterval();
    this.notifyUpdate();
  }

  /**
   * Resume current session
   */
  resume(): void {
    if (this.state !== "idle") {
      this.isRunning = true;
      this.startInterval(this.state === "breaking");
      this.notifyUpdate();
    }
  }

  /**
   * Reset timer to idle state
   */
  reset(): void {
    this.state = "idle";
    this.currentTime = 0;
    this.workTime = 0;
    this.breakTime = 0;
    this.isRunning = false;
    this.stopInterval();
    this.notifyUpdate();
  }

  /**
   * Get current timer data
   */
  getData(): TimerData {
    return {
      state: this.state,
      currentTime: this.currentTime,
      workTime: this.workTime,
      breakTime: this.breakTime,
      isRunning: this.isRunning,
    };
  }

  /**
   * Format time as MM:SS
   */
  static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  private startInterval(countdown: boolean = false): void {
    this.stopInterval();
    this.intervalId = setInterval(() => {
      if (countdown) {
        this.currentTime--;
        if (this.currentTime <= 0) {
          this.completeBreak();
        }
      } else {
        this.currentTime++;
      }
      this.notifyUpdate();
    }, 1000);
  }

  private stopInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private completeBreak(): void {
    this.state = "idle";
    this.isRunning = false;
    this.currentTime = 0;
    this.breakTime = 0;
    this.stopInterval();
    this.notifyUpdate();
  }

  private notifyUpdate(): void {
    if (this.onUpdate) {
      this.onUpdate(this.getData());
    }
  }

  /**
   * Cleanup when component unmounts
   */
  destroy(): void {
    this.stopInterval();
  }
}
