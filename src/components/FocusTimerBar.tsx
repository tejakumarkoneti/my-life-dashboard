import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Sparkles,
  Flame,
  Target,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FocusTimerBar: React.FC = () => {
  const {
    focusSession,
    tasks,
    startFocusTimer,
    pauseFocusTimer,
    resetFocusTimer,
    setFocusDuration,
    toggleTaskComplete,
    getTaskAlignment,
    setCurrentFocusTask,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);

  const activeTask = tasks.find((t) => t.id === focusSession.activeTaskId);

  // If no task selected and timer is at 0, or user closed it, we still allow quick launch
  if (!activeTask && !focusSession.isRunning) return null;

  const { project, goal, lifeGoal } = activeTask ? getTaskAlignment(activeTask) : {};

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = focusSession.totalSeconds > 0
    ? Math.round(((focusSession.totalSeconds - focusSession.secondsRemaining) / focusSession.totalSeconds) * 100)
    : 0;

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-200">
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors"
          title="Minimize Focus Mode"
        >
          <Minimize2 className="w-5 h-5" />
        </button>

        <div className="max-w-lg w-full flex flex-col items-center text-center">
          {/* Mode pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{focusSession.mode.replace('-', ' ')}</span>
          </div>

          {/* Connected Goal Hierarchy */}
          {lifeGoal && (
            <div className="flex items-center gap-1.5 text-xs text-brand-400 font-medium mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>{lifeGoal.title}</span>
            </div>
          )}

          {/* Active Task Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 max-w-md">
            {activeTask ? activeTask.title : 'Deep Focus Session'}
          </h2>
          {project && (
            <p className="text-sm text-zinc-400 mb-8 font-medium">
              Project: <span className="text-zinc-200">{project.title}</span>
            </p>
          )}

          {/* Big Digital Timer */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="text-7xl sm:text-8xl font-black font-mono tracking-tighter drop-shadow-lg text-white">
              {formatTime(focusSession.secondsRemaining)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs h-2 rounded-full bg-white/15 overflow-hidden my-4">
            <div
              className="h-full bg-gradient-to-r from-brand-400 to-indigo-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-zinc-400 mb-8 font-mono">{progressPercent}% completed</span>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={resetFocusTimer}
              className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              onClick={focusSession.isRunning ? pauseFocusTimer : startFocusTimer}
              className="p-6 rounded-full bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-600/30 transition-all active:scale-95"
              title={focusSession.isRunning ? 'Pause' : 'Start'}
            >
              {focusSession.isRunning ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              )}
            </button>

            {activeTask && (
              <button
                onClick={() => {
                  toggleTaskComplete(activeTask.id);
                  setIsExpanded(false);
                }}
                className={`p-4 rounded-full transition-all active:scale-95 ${
                  activeTask.completed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/10 hover:bg-emerald-600/30 text-emerald-400'
                }`}
                title="Mark Task Complete"
              >
                <CheckCircle2 className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFocusDuration(25, 'focus')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                focusSession.mode === 'focus' && focusSession.totalSeconds === 25 * 60
                  ? 'bg-brand-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-zinc-300'
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => setFocusDuration(50, 'focus')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                focusSession.mode === 'focus' && focusSession.totalSeconds === 50 * 60
                  ? 'bg-brand-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-zinc-300'
              }`}
            >
              50m Deep Work
            </button>
            <button
              onClick={() => setFocusDuration(5, 'short-break')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                focusSession.mode === 'short-break'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-zinc-300'
              }`}
            >
              5m Break
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Bottom Floating Bar Mode
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl">
      <div className="bg-zinc-900/95 text-white dark:bg-zinc-900/95 border border-zinc-700/80 rounded-2xl shadow-2xl p-3 flex items-center justify-between gap-3 backdrop-blur-md">
        {/* Task and alignment info */}
        <div className="flex items-center gap-3 overflow-hidden min-w-0">
          <div className="w-9 h-9 rounded-xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5 text-[11px] text-brand-400 font-semibold truncate">
              <span>CURRENT FOCUS</span>
              {project && <span>• {project.title}</span>}
            </div>
            <p className="text-xs sm:text-sm font-semibold truncate text-zinc-100">
              {activeTask ? activeTask.title : 'Focus Session'}
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-base sm:text-lg font-bold text-white px-2">
            {formatTime(focusSession.secondsRemaining)}
          </span>

          <button
            onClick={focusSession.isRunning ? pauseFocusTimer : startFocusTimer}
            className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-transform active:scale-95"
            title={focusSession.isRunning ? 'Pause' : 'Start'}
          >
            {focusSession.isRunning ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          {activeTask && (
            <button
              onClick={() => toggleTaskComplete(activeTask.id)}
              className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all active:scale-95"
              title="Mark Task Complete"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Expand Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentFocusTask(null)}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
            title="Dismiss Bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
