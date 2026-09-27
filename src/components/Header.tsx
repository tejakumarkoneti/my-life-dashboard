import React from 'react';
import {
  Menu,
  Search,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const {
    activeSection,
    tasks,
    openQuickAdd,
    openCommandPalette,
    focusSession,
    startFocusTimer,
    pauseFocusTimer,
    resetFocusTimer,
    setActiveSection,
  } = useApp();

  const activeFocusTask = tasks.find((t) => t.id === focusSession.activeTaskId);

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard':
        return { title: 'Life Dashboard', desc: "Today's high-level overview & daily momentum" };
      case 'today':
        return { title: 'Today’s Work', desc: 'Prioritized execution & active focus' };
      case 'schedule':
        return { title: 'Daily Schedule', desc: 'Time-blocked daily flow & timeline' };
      case 'goals':
        return { title: 'Life & Strategic Goals', desc: 'Hierarchy from 5-year vision down to weekly goals' };
      case 'projects':
        return { title: 'Active Projects', desc: 'Milestone tracking and deliverables' };
      case 'habits':
        return { title: 'Habits & Streaks', desc: 'Daily ritual consistency & momentum' };
      case 'progress':
        return { title: 'Progress & Insights', desc: 'Productivity trends, consistency, & goal alignment' };
      case 'journal':
        return { title: 'Daily Journal & Reflection', desc: 'Wins, learnings, gaps, and clarity' };
      case 'hierarchy':
        return { title: 'Goal Alignment Tree', desc: 'Life Goal → Goal → Project → Tasks → Today' };
      default:
        return { title: 'Ascend', desc: 'Personal Life Operating System' };
    }
  };

  const sectionInfo = getSectionTitle();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Section title & breadcrumb */}
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight flex items-center gap-2">
            {sectionInfo.title}
          </h1>
          <p className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400">
            {sectionInfo.desc}
          </p>
        </div>
      </div>

      {/* Center / Right Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Focus Session Widget */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
            focusSession.isRunning
              ? 'bg-brand-500/10 border-brand-500/30 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300'
          }`}
        >
          <button
            onClick={() => setActiveSection('today')}
            className="flex items-center gap-1.5 hover:underline max-w-[130px] sm:max-w-[200px] truncate font-medium text-left"
            title={activeFocusTask ? activeFocusTask.title : 'Current Focus'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                focusSession.isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
              }`}
            />
            <span className="truncate">
              {activeFocusTask ? activeFocusTask.title : 'Focus Timer'}
            </span>
          </button>

          <span className="font-mono font-semibold text-zinc-900 dark:text-white">
            {formatTime(focusSession.secondsRemaining)}
          </span>

          <div className="flex items-center gap-1 border-l border-zinc-300 dark:border-zinc-700 pl-1.5">
            {focusSession.isRunning ? (
              <button
                onClick={pauseFocusTimer}
                className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                title="Pause Focus Session"
              >
                <Pause className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={startFocusTimer}
                className="p-1 rounded-full hover:bg-brand-100 dark:hover:bg-brand-900/50 text-brand-600 dark:text-brand-400 transition-colors"
                title="Start Focus Session"
              >
                <Play className="w-3 h-3 fill-current" />
              </button>
            )}
            <button
              onClick={resetFocusTimer}
              className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Date badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60">
          <span>{todayFormatted}</span>
        </div>

        {/* Search trigger (Cmd+K) */}
        <button
          onClick={openCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 text-xs transition-colors border border-zinc-200 dark:border-zinc-700/50"
          title="Search or jump to (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-block text-[10px] bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-300 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Button */}
        <button
          onClick={() => openQuickAdd()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Item</span>
        </button>
      </div>
    </header>
  );
};
