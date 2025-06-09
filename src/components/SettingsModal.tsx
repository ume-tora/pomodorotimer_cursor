import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { state, dispatch } = useTimer();
  const { settings } = state;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSettings = {
      workDuration: Number(formData.get('workDuration')),
      shortBreakDuration: Number(formData.get('shortBreakDuration')),
      longBreakDuration: Number(formData.get('longBreakDuration')),
      autoStartBreaks: formData.get('autoStartBreaks') === 'on',
      autoStartPomodoros: formData.get('autoStartPomodoros') === 'on',
      soundEnabled: formData.get('soundEnabled') === 'on',
    };
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">設定</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="設定を閉じる"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 時間設定 */}
          <div className="space-y-4">
            <div>
              <label htmlFor="workDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                作業時間（分）
              </label>
              <input
                type="number"
                id="workDuration"
                name="workDuration"
                min="1"
                max="60"
                defaultValue={settings.workDuration}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="shortBreakDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                短休憩時間（分）
              </label>
              <input
                type="number"
                id="shortBreakDuration"
                name="shortBreakDuration"
                min="1"
                max="30"
                defaultValue={settings.shortBreakDuration}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="longBreakDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                長休憩時間（分）
              </label>
              <input
                type="number"
                id="longBreakDuration"
                name="longBreakDuration"
                min="1"
                max="60"
                defaultValue={settings.longBreakDuration}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* 自動開始設定 */}
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoStartBreaks"
                name="autoStartBreaks"
                defaultChecked={settings.autoStartBreaks}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
              />
              <label htmlFor="autoStartBreaks" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                休憩を自動開始
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoStartPomodoros"
                name="autoStartPomodoros"
                defaultChecked={settings.autoStartPomodoros}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
              />
              <label htmlFor="autoStartPomodoros" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                ポモドーロを自動開始
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="soundEnabled"
                name="soundEnabled"
                defaultChecked={settings.soundEnabled}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
              />
              <label htmlFor="soundEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                サウンドを有効にする
              </label>
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              設定を保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 