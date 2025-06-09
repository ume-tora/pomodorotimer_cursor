import React from 'react';
import { useTimer } from '../contexts/TimerContext';

interface TimerRingProps {
  size?: number;
  strokeWidth?: number;
}

export function TimerRing({ size = 320, strokeWidth = 16 }: TimerRingProps) {
  const { state } = useTimer();
  const { timeLeft, mode, settings } = state;

  // 現在のモードに応じた総時間を計算
  const totalTime = (() => {
    switch (mode) {
      case 'work':
        return settings.workDuration * 60;
      case 'shortBreak':
        return settings.shortBreakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
    }
  })();

  // 残り時間の割合を計算
  const progress = timeLeft / totalTime;
  const circumference = 2 * Math.PI * ((size - strokeWidth) / 2);
  const strokeDashoffset = circumference * (1 - progress);

  // モードに応じた色を設定
  const getColor = () => {
    switch (mode) {
      case 'work':
        return '#F87171'; // 赤系
      case 'shortBreak':
        return '#34D399'; // 緑系
      case 'longBreak':
        return '#60A5FA'; // 青系
    }
  };

  // 残り時間を分:秒形式に変換
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // モード名を日本語に変換
  const getModeLabel = () => {
    switch (mode) {
      case 'work':
        return '作業';
      case 'shortBreak':
        return '短休憩';
      case 'longBreak':
        return '長休憩';
    }
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* 背景の円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-800"
        />
        {/* プログレス円 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.3))',
          }}
        />
      </svg>
      {/* 中央のテキスト */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span 
          className="text-6xl font-bold tabular-nums tracking-tight" 
          aria-label={`残り時間: ${formatTime(timeLeft)}`}
          style={{
            color: getColor(),
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {formatTime(timeLeft)}
        </span>
        <span 
          className="mt-4 text-xl font-medium text-gray-600 dark:text-gray-300"
          style={{
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
        >
          {getModeLabel()}
        </span>
      </div>
    </div>
  );
} 