import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck2,
  Clock,
  Target,
  FolderKanban,
  Flame,
  BarChart3,
  BookOpenText,
  Network,
  Plus,
  Sun,
  Moon,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveSection } from '../types';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    activeSection,
    setActiveSection,
    theme,
    toggleTheme,
    openQuickAdd,
    tasks,
    habits,
    getAlignmentScore,
    resetToSampleData,
    focusSession,
  } = useApp();

  const alignmentScore = getAlignmentScore();
  const todayPendingCount = tasks.filter((t) => t.isTodayPriority && !t.completed).length;
  const activeHabitsToday = habits.length;

  const navItems: { id: ActiveSection; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'today', label: 'Today', icon: CalendarCheck2, badge: todayPendingCount > 0 ? todayPendingCount : undefined, badgeColor: 'bg-brand-500 text-white' },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'habits', label: 'Habits', icon: Flame, badge: activeHabitsToday, badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400' },
    { id: 'progress', label: 'Progress & Insights', icon: BarChart3 },
    { id: 'journal', label: 'Daily Journal', icon: BookOpenText },
    { id: 'hierarchy', label: 'Goal Alignment Tree', icon: Network, badge: `${alignmentScore}%`, badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
  ];

  const handleNavClick = (sectionId: ActiveSection) => {
    setActiveSection(sectionId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Brand Header */}
        <div className="h-16 px-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-zinc-900 dark:text-white text-base">Ascend</span>
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded">Life OS</span>
            </div>
          </div>
        </div>

        {/* Quick Add CTA */}
        <div className="p-3">
          <button
            onClick={() => openQuickAdd('task')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-sm transition-all duration-200 active:scale-[0.98] group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>Quick Add</span>
            <kbd className="ml-auto text-[10px] bg-brand-700/60 px-1.5 py-0.5 rounded text-brand-100 font-mono">Q</kbd>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pt-1">
          <div className="px-3 pb-1 pt-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-950 dark:text-white shadow-sm font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-brand-600 dark:text-brand-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.badgeColor || 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-zinc-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Alignment Gauge Banner */}
        <div className="mx-3 my-2 p-3 rounded-xl bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-zinc-800/60 dark:to-brand-950/40 border border-brand-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Goal Alignment
            </span>
            <span className="font-bold text-brand-600 dark:text-brand-400">{alignmentScore}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${alignmentScore}%` }}
            />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-snug">
            {alignmentScore >= 80 ? '🎯 High direct goal contribution today!' : '⚡ Connect more daily tasks to your goals.'}
          </p>
        </div>

        {/* Footer info & theme toggle */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Toggle Light / Dark mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-zinc-600" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (confirm('Reset to realistic sample data? All local edits will be replaced with fresh presets.')) {
                resetToSampleData();
              }
            }}
            className="flex items-center gap-1.5 p-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Reset to sample data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </aside>
    </>
  );
};
