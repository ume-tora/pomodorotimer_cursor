export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export interface TimerSettings {
  workDuration: number;    // 作業時間（分）
  shortBreakDuration: number;  // 短休憩時間（分）
  longBreakDuration: number;   // 長休憩時間（分）
  autoStartBreaks: boolean;    // 休憩を自動開始するか
  autoStartPomodoros: boolean; // ポモドーロを自動開始するか
  soundEnabled: boolean;       // サウンドを有効にするか
}

export interface TimerState {
  mode: TimerMode;
  timeLeft: number;        // 残り時間（秒）
  isRunning: boolean;
  cycle: number;          // 現在のサイクル（1-4）
  totalCycles: number;    // 完了したサイクル数
  settings: TimerSettings;
}

export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'SET_MODE'; payload: TimerMode }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<TimerSettings> }; 