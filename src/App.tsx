import React, { useState } from 'react';
import { TimerProvider, useTimer } from './contexts/TimerContext';
import { TimerRing } from './components/TimerRing';
import { Controls } from './components/Controls';
import { SettingsModal } from './components/SettingsModal';

function CycleIndicator() {
  const { state } = useTimer();
  const { cycle, mode } = state;

  return (
    <div className="flex justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((dot) => (
        <div
          key={dot}
          className={`w-3 h-3 rounded-full transition-colors ${
            dot <= cycle && mode === 'work'
              ? 'bg-primary'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function TimerApp() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* タイトル */}
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Pomodoro Timer
          </h1>

          {/* サイクルインジケーター */}
          <CycleIndicator />

          {/* タイマーリング */}
          <div className="flex justify-center mb-8">
            <TimerRing size={320} strokeWidth={16} />
          </div>

          {/* コントロール */}
          <Controls onSettingsClick={() => setIsSettingsOpen(true)} />

          {/* 設定モーダル */}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <TimerProvider>
      <TimerApp />
    </TimerProvider>
  );
}

export default App; 