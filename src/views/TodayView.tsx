import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Play,
  Pause,
  Star,
  Trash2,
  Clock,
  Target,
  Flame,
  Filter,
  Check,
  Tag,
  FolderKanban,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Priority, Task } from '../types';
import { getTodayString } from '../data/initialData';

export const TodayView: React.FC = () => {
  const {
    tasks,
    projects,
    goals,
    addTask,
    toggleTaskComplete,
    deleteTask,
    setCurrentFocusTask,
    toggleTodayPriority,
    focusSession,
    startFocusTimer,
    pauseFocusTimer,
    getTaskAlignment,
    openQuickAdd,
  } = useApp();

  const todayStr = getTodayString(0);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'priority'>('all');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<Priority>('p1');
  const [quickProjectId, setQuickProjectId] = useState('');

  // Tasks for today
  const todayTasks = tasks.filter((t) => t.date === todayStr);

  const activeFocusTask = tasks.find((t) => t.id === focusSession.activeTaskId);

  // Quick add inline
  const handleInlineAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const selectedProj = projects.find((p) => p.id === quickProjectId);

    addTask({
      title: quickTitle.trim(),
      priority: quickPriority,
      completed: false,
      date: todayStr,
      estimatedMinutes: 30,
      isTodayPriority: true,
      projectId: quickProjectId || undefined,
      goalId: selectedProj ? selectedProj.goalId : undefined,
    });

    setQuickTitle('');
  };

  const filteredTasks = todayTasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'priority') return t.isTodayPriority;
    return true;
  });

  const completedCount = todayTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* 1. Currently Working On Banner / Spotlight */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 text-white p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    focusSession.isRunning ? 'animate-ping bg-emerald-400' : 'bg-brand-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    focusSession.isRunning ? 'bg-emerald-500' : 'bg-brand-500'
                  }`}
                />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                Currently Working On
              </span>
            </div>

            {activeFocusTask && (() => {
              const align = getTaskAlignment(activeFocusTask);
              return align.lifeGoal ? (
                <div className="flex items-center gap-1.5 text-xs text-brand-300 font-semibold bg-brand-950/80 px-2.5 py-1 rounded-full border border-brand-800/50">
                  <Target className="w-3.5 h-3.5" />
                  <span>{align.lifeGoal.title}</span>
                </div>
              ) : null;
            })()}
          </div>

          {activeFocusTask ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-2">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {activeFocusTask.title}
                </h2>
                {activeFocusTask.description && (
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                    {activeFocusTask.description}
                  </p>
                )}
                {(() => {
                  const align = getTaskAlignment(activeFocusTask);
                  return align.project ? (
                    <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
                      <FolderKanban className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Project: <strong className="text-zinc-200">{align.project.title}</strong></span>
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="flex items-center gap-3">
                <div className="font-mono text-2xl font-black bg-zinc-800/90 px-4 py-2 rounded-xl border border-zinc-700/60 text-white">
                  {Math.floor(focusSession.secondsRemaining / 60)
                    .toString()
                    .padStart(2, '0')}
                  :
                  {(focusSession.secondsRemaining % 60).toString().padStart(2, '0')}
                </div>

                {focusSession.isRunning ? (
                  <button
                    onClick={pauseFocusTimer}
                    className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all active:scale-95"
                    title="Pause Focus Session"
                  >
                    <Pause className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={startFocusTimer}
                    className="p-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-600/30 transition-all active:scale-95"
                    title="Start Focus Session"
                  >
                    <Play className="w-5 h-5 fill-current" />
                  </button>
                )}

                <button
                  onClick={() => toggleTaskComplete(activeFocusTask.id)}
                  className={`p-3 rounded-xl transition-all active:scale-95 ${
                    activeFocusTask.completed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-800 hover:bg-emerald-600/30 text-emerald-400 border border-zinc-700'
                  }`}
                  title="Mark Complete"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-4 text-zinc-400 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span>No active task in focus right now. Pick a task below to enter deep work mode.</span>
              {todayTasks[0] && (
                <button
                  onClick={() => {
                    setCurrentFocusTask(todayTasks[0].id);
                    startFocusTimer();
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all w-fit"
                >
                  Start First Task
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Inline Quick Add Bar */}
      <form
        onSubmit={handleInlineAdd}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2.5 sm:p-3 shadow-subtle flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
      >
        <div className="flex-1 flex items-center gap-2.5 px-3">
          <Plus className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Add a new task for today... (Press Enter to save)"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800 justify-end">
          <select
            value={quickPriority}
            onChange={(e) => setQuickPriority(e.target.value as Priority)}
            className="text-xs py-1.5 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 font-semibold focus:outline-none"
          >
            <option value="p1">P1 Urgent</option>
            <option value="p2">P2 Standard</option>
            <option value="p3">P3 Low</option>
          </select>

          <select
            value={quickProjectId}
            onChange={(e) => setQuickProjectId(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 focus:outline-none max-w-[130px] truncate"
          >
            <option value="">No Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 shrink-0"
          >
            Add
          </button>
        </div>
      </form>

      {/* 3. Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            Daily Execution List
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            {completedCount} / {todayTasks.length} Done
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
          {(['all', 'active', 'priority', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                filter === tab
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              {tab === 'priority' ? '★ Top Priorities' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Task List Items */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 text-center">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              No tasks found for this view.
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {filter === 'completed' ? 'Keep crushing your active tasks!' : 'Add a task above or use Quick Add.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const alignment = getTaskAlignment(task);
            const isFocus = focusSession.activeTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`group flex items-start gap-3.5 p-4 rounded-2xl border transition-all ${
                  task.completed
                    ? 'bg-zinc-50/70 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80 opacity-75'
                    : isFocus
                    ? 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-500/50 shadow-sm'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-subtle'
                }`}
              >
                {/* Complete checkbox */}
                <button
                  onClick={() => toggleTaskComplete(task.id)}
                  className="mt-1 shrink-0 transition-transform active:scale-90"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600 hover:text-brand-500" />
                  )}
                </button>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {/* Priority badge */}
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        task.priority === 'p1'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                          : task.priority === 'p2'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {task.priority.toUpperCase()}
                    </span>

                    {/* Task Title */}
                    <span
                      className={`text-sm sm:text-base font-bold ${
                        task.completed
                          ? 'line-through text-zinc-400 dark:text-zinc-500'
                          : 'text-zinc-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  {/* Goal Alignment Meta Badges */}
                  <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                    {alignment.lifeGoal && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-medium text-[11px] border border-brand-200/50 dark:border-brand-800/40">
                        <Target className="w-3 h-3 text-brand-500" />
                        <span className="truncate max-w-[200px]">{alignment.lifeGoal.title}</span>
                      </span>
                    )}

                    {alignment.project && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium text-[11px]">
                        <FolderKanban className="w-3 h-3 text-zinc-400" />
                        <span className="truncate max-w-[150px]">{alignment.project.title}</span>
                      </span>
                    )}

                    {task.tag && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                        <Tag className="w-3 h-3" />
                        <span>{task.tag}</span>
                      </span>
                    )}

                    {task.completedAt && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                        Completed at {task.completedAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                  {/* Pin as Today's Priority */}
                  <button
                    onClick={() => toggleTodayPriority(task.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      task.isTodayPriority
                        ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                        : 'text-zinc-300 dark:text-zinc-600 hover:text-amber-500'
                    }`}
                    title={task.isTodayPriority ? 'Unpin from Top Priorities' : 'Pin to Top Priorities'}
                  >
                    <Star className={`w-4 h-4 ${task.isTodayPriority ? 'fill-current' : ''}`} />
                  </button>

                  {/* Set as current focus */}
                  {!task.completed && (
                    <button
                      onClick={() => {
                        setCurrentFocusTask(task.id);
                        startFocusTimer();
                      }}
                      className={`p-1.5 rounded-lg transition-all ${
                        isFocus
                          ? 'bg-brand-600 text-white'
                          : 'text-zinc-400 hover:text-brand-600 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                      title={isFocus ? 'Current focus task' : 'Set as focus task'}
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}

                  {/* Delete Task */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-zinc-300 dark:text-zinc-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
