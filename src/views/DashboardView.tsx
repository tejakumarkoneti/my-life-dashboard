import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Flame,
  Zap,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Play,
  Calendar,
  Layers,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayString } from '../data/initialData';

export const DashboardView: React.FC = () => {
  const {
    tasks,
    schedule,
    habits,
    lifeGoals,
    goals,
    projects,
    focusSession,
    toggleTaskComplete,
    setCurrentFocusTask,
    startFocusTimer,
    toggleHabitDate,
    setActiveSection,
    getTaskAlignment,
    getAlignmentScore,
    openQuickAdd,
  } = useApp();

  const todayStr = getTodayString(0);

  // Today's tasks
  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const completedTasks = todayTasks.filter((t) => t.completed);
  const remainingTasks = todayTasks.filter((t) => !t.completed);
  const topPriorities = todayTasks.filter((t) => t.isTodayPriority);

  // Today's habits
  const habitsDoneToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const habitRate = habits.length > 0 ? Math.round((habitsDoneToday / habits.length) * 100) : 0;

  // Active focus task
  const currentFocusTask = tasks.find((t) => t.id === focusSession.activeTaskId) || remainingTasks[0];

  // Alignment Score
  const alignmentScore = getAlignmentScore();

  // Upcoming schedule activities
  const upcomingActivities = schedule
    .filter((s) => s.date === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Greeting & Motivational Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-zinc-900 text-white p-6 sm:p-8 shadow-xl border border-brand-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-semibold backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Momentum & Alignment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back. Let's make today count.
            </h1>
            <p className="text-zinc-300 text-xs sm:text-sm mt-1 max-w-xl">
              You have <span className="text-white font-semibold">{remainingTasks.length} tasks remaining</span> today.
              Your daily actions are currently{' '}
              <span className="text-brand-300 font-bold">{alignmentScore}% aligned</span> with your high-level Life Goals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveSection('hierarchy')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-all flex items-center gap-2"
            >
              <Target className="w-4 h-4 text-brand-400" />
              <span>Inspect Alignment Tree</span>
            </button>
            <button
              onClick={() => openQuickAdd('task')}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold shadow-md shadow-brand-500/30 transition-all active:scale-95"
            >
              + Quick Add Task
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Quick-Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tasks Completion */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-brand-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tasks Today</span>
            <CheckCircle2 className="w-4 h-4 text-brand-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {completedTasks.length}
            </span>
            <span className="text-xs text-zinc-400 font-medium">/ {todayTasks.length} done</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-500"
              style={{
                width: `${todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Card 2: Habit Consistency */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Habits Today</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {habitsDoneToday}
            </span>
            <span className="text-xs text-zinc-400 font-medium">/ {habits.length} checked</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${habitRate}%` }}
            />
          </div>
        </div>

        {/* Card 3: Goal Alignment Ratio */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Goal Alignment</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {alignmentScore}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Tied to Vision</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${alignmentScore}%` }}
            />
          </div>
        </div>

        {/* Card 4: Focus Time Logged */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Deep Focus</span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {completedTasks.reduce((acc, t) => acc + (t.actualMinutes || t.estimatedMinutes), 0)}m
            </span>
            <span className="text-xs text-zinc-400 font-medium">Logged today</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: '70%' }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Current Focus & Priorities on Left, Habits & Life Goals on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Spotlight: Current Focus Card */}
          {currentFocusTask && (
            <div className="rounded-2xl border border-brand-200 dark:border-brand-900/60 bg-gradient-to-br from-brand-500/5 via-transparent to-indigo-500/5 dark:bg-zinc-900 p-5 shadow-subtle">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                  </span>
                  <span>Current Deep Focus</span>
                </div>
                {(() => {
                  const align = getTaskAlignment(currentFocusTask);
                  return align.lifeGoal ? (
                    <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {align.lifeGoal.category}
                    </span>
                  ) : null;
                })()}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                    {currentFocusTask.title}
                  </h3>
                  {currentFocusTask.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg">
                      {currentFocusTask.description}
                    </p>
                  )}
                  {(() => {
                    const align = getTaskAlignment(currentFocusTask);
                    return align.project ? (
                      <p className="text-xs text-zinc-400 mt-1.5 font-medium">
                        Linked Project: <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{align.project.title}</span>
                      </p>
                    ) : null;
                  })()}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setCurrentFocusTask(currentFocusTask.id);
                      startFocusTimer();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{focusSession.isRunning ? 'Running' : 'Start Focus (25m)'}</span>
                  </button>

                  <button
                    onClick={() => toggleTaskComplete(currentFocusTask.id)}
                    className="p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-500 text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 transition-colors"
                    title="Mark Done"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Today's Priorities */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-500" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Today's Top Priorities
                </h2>
                <span className="text-xs text-zinc-400 font-medium">({topPriorities.length})</span>
              </div>
              <button
                onClick={() => setActiveSection('today')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {topPriorities.length === 0 ? (
                <div className="text-center py-6 text-zinc-400 text-xs">
                  No priority tasks pinned yet. Add or star tasks to view them here.
                </div>
              ) : (
                topPriorities.map((task) => {
                  const alignment = getTaskAlignment(task);
                  return (
                    <div
                      key={task.id}
                      className={`group flex items-start gap-3 p-3 rounded-xl border transition-all ${
                        task.completed
                          ? 'bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                          : 'bg-white dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 hover:border-brand-500/50 hover:shadow-sm'
                      }`}
                    >
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="mt-0.5 shrink-0 transition-transform active:scale-90"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-400 hover:text-brand-500" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded text-[10px] ${
                              task.priority === 'p1'
                                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {task.priority.toUpperCase()}
                          </span>
                          <span
                            className={`text-sm font-semibold truncate ${
                              task.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-white'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        {/* Connected goal trace */}
                        {alignment.lifeGoal && (
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                            <Target className="w-3 h-3" />
                            <span className="truncate">{alignment.lifeGoal.title}</span>
                            {alignment.project && (
                              <span className="text-zinc-400">• {alignment.project.title}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-zinc-400 font-mono">
                          {task.estimatedMinutes}m
                        </span>
                        {!task.completed && (
                          <button
                            onClick={() => {
                              setCurrentFocusTask(task.id);
                              startFocusTimer();
                            }}
                            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-brand-50 dark:hover:bg-brand-950 text-brand-600 dark:text-brand-400 transition-opacity"
                            title="Focus on this"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Today's Schedule Timeline Preview */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-500" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Upcoming Today
                </h2>
              </div>
              <button
                onClick={() => setActiveSection('schedule')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {upcomingActivities.slice(0, 4).map((act) => (
                <div key={act.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-zinc-400 font-medium w-24">
                      {act.startTime} - {act.endTime}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        act.category === 'deep-work'
                          ? 'bg-purple-500'
                          : act.category === 'health'
                          ? 'bg-emerald-500'
                          : act.category === 'learning'
                          ? 'bg-blue-500'
                          : 'bg-zinc-400'
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        act.completed ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {act.title}
                    </span>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-zinc-400 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                    {act.category.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          {/* Daily Habits Quick-Check */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Daily Habits
                </h2>
              </div>
              <button
                onClick={() => setActiveSection('habits')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                All Habits
              </button>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => {
                const isDone = habit.completedDates.includes(todayStr);
                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabitDate(habit.id, todayStr)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-300'
                        : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                          isDone ? 'bg-emerald-500 text-white' : 'border border-zinc-300 dark:border-zinc-600 text-transparent'
                        }`}
                      >
                        ✓
                      </div>
                      <span className={`text-xs font-medium truncate ${isDone ? 'line-through opacity-80' : ''}`}>
                        {habit.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 shrink-0">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{habit.streak}d</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* High-Level Life Goals Progress */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-500" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Life Goals
                </h2>
              </div>
              <button
                onClick={() => setActiveSection('goals')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-4">
              {lifeGoals.map((lg) => (
                <div key={lg.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900 dark:text-white truncate pr-2">
                      {lg.title}
                    </span>
                    <span className="font-mono font-semibold text-zinc-500 dark:text-zinc-400">
                      {lg.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        backgroundColor: lg.color,
                        width: `${lg.progress}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span>{lg.category}</span>
                    <span>{lg.targetYears}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <button
                onClick={() => setActiveSection('hierarchy')}
                className="w-full py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Full Alignment Chain</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
