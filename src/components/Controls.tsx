import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface ControlsProps {
  onSettingsClick: () => void;
}

export function Controls({ onSettingsClick }: ControlsProps) {
  const { state, dispatch } = useTimer();
  const { isRunning } = state;

  return (
    <div className="flex items-center justify-center gap-6 mt-12">
      {/* リセットボタン */}
      <button
        onClick={() => dispatch({ type: 'RESET' })}
        className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md active:shadow-inner"
        aria-label="タイマーをリセット"
      >
        <ArrowPathIcon className="w-7 h-7 text-gray-600 dark:text-gray-300" />
      </button>

      {/* 開始/一時停止ボタン */}
      <button
        onClick={() => dispatch({ type: isRunning ? 'PAUSE' : 'START' })}
        className="p-5 rounded-full bg-primary hover:bg-primary-dark text-white transition-all shadow-lg hover:shadow-xl active:shadow-inner transform hover:scale-105 active:scale-95"
        aria-label={isRunning ? 'タイマーを一時停止' : 'タイマーを開始'}
      >
        {isRunning ? (
          <PauseIcon className="w-10 h-10" />
        ) : (
          <PlayIcon className="w-10 h-10" />
        )}
      </button>

      {/* 設定ボタン */}
      <button
        onClick={onSettingsClick}
        className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md active:shadow-inner"
        aria-label="設定を開く"
      >
        <Cog6ToothIcon className="w-7 h-7 text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  );
} 