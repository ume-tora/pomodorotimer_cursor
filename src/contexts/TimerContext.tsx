import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TimerState, TimerAction, TimerSettings, TimerMode } from '../types/timer';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: true,
  autoStartPomodoros: true,
  soundEnabled: true,
};

function loadSettings(): TimerSettings {
  try {
    const raw = localStorage.getItem('timerSettings');
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.workDuration === 'number' &&
      typeof parsed.shortBreakDuration === 'number' &&
      typeof parsed.longBreakDuration === 'number' &&
      typeof parsed.autoStartBreaks === 'boolean' &&
      typeof parsed.autoStartPomodoros === 'boolean' &&
      typeof parsed.soundEnabled === 'boolean'
    ) {
      return parsed;
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const initialSettings = loadSettings();

const initialState: TimerState = {
  mode: 'work',
  timeLeft: (initialSettings.workDuration ?? 25) * 60,
  isRunning: false,
  cycle: 1,
  totalCycles: 0,
  settings: initialSettings,
};

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START':
      return { ...state, isRunning: true };
    case 'PAUSE':
      return { ...state, isRunning: false };
    case 'RESET':
      return {
        ...state,
        isRunning: false,
        mode: 'work',
        timeLeft: state.settings.workDuration * 60,
        cycle: 1,
      };
    case 'TICK':
      if (state.timeLeft <= 0) {
        const nextMode = getNextMode(state.mode, state.cycle);
        const nextCycle = state.mode === 'work' ? (state.cycle % 4) + 1 : state.cycle;
        const nextTimeLeft = getDurationForMode(nextMode, state.settings) * 60;
        const shouldAutoStart = (nextMode === 'work' && state.settings.autoStartPomodoros) ||
                              (nextMode !== 'work' && state.settings.autoStartBreaks);

        // 通知を送信
        if (state.settings.soundEnabled) {
          new Audio('/sounds/beep.mp3').play().catch(console.error);
        }
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Pomodoro Timer', {
            body: `${state.mode === 'work' ? '休憩' : '作業'}の時間です！`,
            icon: '/favicon.ico',
          });
        }

        return {
          ...state,
          mode: nextMode,
          timeLeft: nextTimeLeft,
          cycle: nextCycle,
          totalCycles: state.mode === 'work' ? state.totalCycles + 1 : state.totalCycles,
          isRunning: shouldAutoStart,
        };
      }
      return { ...state, timeLeft: state.timeLeft - 1 };
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
        timeLeft: getDurationForMode(action.payload, state.settings) * 60,
        isRunning: false,
      };
    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.payload };
      return {
        ...state,
        settings: newSettings,
        timeLeft: getDurationForMode(state.mode, newSettings) * 60,
      };
    default:
      return state;
  }
}

function getNextMode(currentMode: TimerMode, cycle: number): TimerMode {
  if (currentMode === 'work') {
    return cycle === 4 ? 'longBreak' : 'shortBreak';
  }
  return 'work';
}

function getDurationForMode(mode: TimerMode, settings: TimerSettings): number {
  switch (mode) {
    case 'work':
      return settings.workDuration;
    case 'shortBreak':
      return settings.shortBreakDuration;
    case 'longBreak':
      return settings.longBreakDuration;
  }
}

const TimerContext = createContext<{
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
} | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // タイマーの実行
  useEffect(() => {
    let intervalId: number | undefined;

    if (state.isRunning) {
      intervalId = window.setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [state.isRunning]);

  // 通知の許可を要求
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // 設定の保存
  useEffect(() => {
    localStorage.setItem('timerSettings', JSON.stringify(state.settings));
  }, [state.settings]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
} 