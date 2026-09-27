import React from 'react';
import {
  Flame,
  Plus,
  Trophy,
  Check,
  Calendar,
  Sparkles,
  Zap,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayString } from '../data/initialData';

export const HabitsView: React.FC = () => {
  const { habits, toggleHabitDate, deleteHabit, openQuickAdd } = useApp();

  const todayStr = getTodayString(0);

  // Generate the last 14 days array for heatmap visual
  const pastDays = Array.from({ length: 14 }, (_, i) => {
    return getTodayString(-13 + i);
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-subtle">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>Rituals & Identity</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Daily Habits & Consistency
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('habit')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habits List */}
      <div className="grid grid-cols-1 gap-4">
        {habits.map((habit) => {
          const isDoneToday = habit.completedDates.includes(todayStr);

          return (
            <div
              key={habit.id}
              className={`rounded-3xl border p-5 sm:p-6 transition-all duration-200 ${
                isDoneToday
                  ? 'bg-white dark:bg-zinc-900 border-emerald-500/40 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-subtle'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Habit details */}
                <div className="flex items-start gap-4">
                  {/* Today check toggle button */}
                  <button
                    onClick={() => toggleHabitDate(habit.id, todayStr)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 active:scale-90 ${
                      isDoneToday
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 text-transparent hover:text-emerald-500'
                    }`}
                    title={isDoneToday ? 'Completed today! Click to undo' : 'Click to complete for today'}
                  >
                    <Check className="w-6 h-6 stroke-[3]" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {habit.category}
                      </span>
                      {isDoneToday && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                          Done Today
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                      {habit.title}
                    </h3>

                    {habit.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg">
                        {habit.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Streak Counters */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  {/* Current Streak */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                    <Flame className="w-5 h-5 fill-current" />
                    <div>
                      <span className="text-base font-black font-mono leading-none">{habit.streak}</span>
                      <span className="text-[10px] block font-semibold uppercase tracking-wider text-amber-500">
                        Streak
                      </span>
                    </div>
                  </div>

                  {/* Best Streak */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-base font-black font-mono leading-none">{habit.longestStreak}</span>
                      <span className="text-[10px] block font-semibold uppercase tracking-wider text-zinc-400">
                        Best
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 text-zinc-300 dark:text-zinc-600 hover:text-rose-500 transition-colors"
                    title="Delete Habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 14-Day Completion Heatmap / History Row */}
              <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
                  <span>Last 14 Days History</span>
                  <span>Today</span>
                </div>

                <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5 sm:gap-2">
                  {pastDays.map((dStr, idx) => {
                    const isCompleted = habit.completedDates.includes(dStr);
                    const isCurrentToday = dStr === todayStr;
                    const dateObj = new Date(dStr + 'T00:00:00');
                    const dayLetter = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' });

                    return (
                      <div
                        key={dStr}
                        onClick={() => toggleHabitDate(habit.id, dStr)}
                        className="flex flex-col items-center gap-1 cursor-pointer group"
                        title={`${dStr}: ${isCompleted ? 'Completed' : 'Missed'} (Click to toggle)`}
                      >
                        <div
                          className={`w-full aspect-square rounded-lg transition-all duration-150 flex items-center justify-center text-[10px] font-bold ${
                            isCompleted
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : isCurrentToday
                              ? 'border-2 border-brand-500 bg-brand-50/50 dark:bg-brand-950/20'
                              : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {isCompleted && '✓'}
                        </div>
                        <span className="text-[9px] text-zinc-400 font-mono group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                          {dayLetter}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
