import React, { useState } from 'react';
import {
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CalendarDays,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivityCategory, ScheduleActivity } from '../types';
import { getTodayString } from '../data/initialData';

export const ScheduleView: React.FC = () => {
  const {
    schedule,
    addScheduleActivity,
    updateScheduleActivity,
    deleteScheduleActivity,
    toggleActivityComplete,
    rescheduleActivity,
    tasks,
    openQuickAdd,
  } = useApp();

  const [selectedDate, setSelectedDate] = useState(getTodayString(0));
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter activities for selected date
  const activities = schedule
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const categoryColors: Record<ActivityCategory, { bg: string; text: string; border: string }> = {
    'deep-work': {
      bg: 'bg-purple-500/10 dark:bg-purple-950/40',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-500/30',
    },
    health: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/30',
    },
    learning: {
      bg: 'bg-blue-500/10 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-500/30',
    },
    routine: {
      bg: 'bg-amber-500/10 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-500/30',
    },
    break: {
      bg: 'bg-teal-500/10 dark:bg-teal-950/40',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-500/30',
    },
    meeting: {
      bg: 'bg-rose-500/10 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-500/30',
    },
  };

  // Timeline hours from 06:00 to 22:00
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  // Current time position indicator
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = selectedDate === getTodayString(0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Controls: Day switcher & Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
            <button
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(getTodayString(0))}
              className="px-3 py-1 text-xs font-bold text-zinc-900 dark:text-white rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="text-xs text-zinc-400 ml-2">
              ({activities.length} planned blocks)
            </span>
          </div>
        </div>

        <button
          onClick={() => openQuickAdd('schedule')}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Time Block</span>
        </button>
      </div>

      {/* Main Schedule Timeline Blocks */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            <span>Interactive Timeline</span>
          </h2>
          <span className="text-xs text-zinc-400">
            Use shift buttons to effortlessly reschedule any block
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 space-y-3">
            <CalendarDays className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm font-medium">No scheduled activities for this day.</p>
            <button
              onClick={() => openQuickAdd('schedule')}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
            >
              Schedule First Block
            </button>
          </div>
        ) : (
          <div className="relative pl-4 sm:pl-6 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-4 pt-2">
            {activities.map((act) => {
              const colors = categoryColors[act.category] || categoryColors['deep-work'];
              const linkedTask = tasks.find((t) => t.id === act.taskId);

              return (
                <div key={act.id} className="relative group">
                  {/* Timeline node dot */}
                  <div
                    className={`absolute -left-[23px] sm:-left-[31px] top-4 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-zinc-900 transition-colors ${
                      act.completed
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-brand-500'
                    }`}
                  />

                  {/* Activity card */}
                  <div
                    className={`rounded-2xl border p-4 transition-all duration-200 ${
                      colors.bg
                    } ${colors.border} ${
                      act.completed ? 'opacity-70' : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Completion check */}
                        <button
                          onClick={() => toggleActivityComplete(act.id)}
                          className="mt-1 transition-transform active:scale-90"
                        >
                          {act.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-400 hover:text-emerald-500" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white bg-white/60 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-200/50 dark:border-zinc-700/50">
                              {act.startTime} - {act.endTime}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${colors.text} bg-white/40 dark:bg-black/20`}
                            >
                              {act.category.replace('-', ' ')}
                            </span>
                          </div>

                          <h3
                            className={`text-sm sm:text-base font-bold mt-1 ${
                              act.completed
                                ? 'line-through text-zinc-400'
                                : 'text-zinc-900 dark:text-white'
                            }`}
                          >
                            {act.title}
                          </h3>

                          {act.notes && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                              {act.notes}
                            </p>
                          )}

                          {linkedTask && (
                            <span className="inline-block text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                              Linked Task: {linkedTask.title}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Reschedule & Quick Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center bg-white/70 dark:bg-zinc-800/60 p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                        {/* -30 min */}
                        <button
                          onClick={() => rescheduleActivity(act.id, -30)}
                          className="px-2 py-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Shift earlier by 30 mins"
                        >
                          -30m
                        </button>

                        {/* +30 min */}
                        <button
                          onClick={() => rescheduleActivity(act.id, 30)}
                          className="px-2 py-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Shift later by 30 mins"
                        >
                          +30m
                        </button>

                        <button
                          onClick={() => deleteScheduleActivity(act.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors"
                          title="Delete from schedule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
