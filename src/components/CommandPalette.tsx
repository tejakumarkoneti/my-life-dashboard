import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  CheckCircle2,
  Target,
  FolderKanban,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Play,
  RotateCcw,
  BookOpenText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveSection } from '../types';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    closeCommandPalette,
    tasks,
    goals,
    projects,
    habits,
    setActiveSection,
    openQuickAdd,
    toggleTheme,
    theme,
    startFocusTimer,
    setCurrentFocusTask,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Filter items
  const q = query.toLowerCase().trim();

  const filteredTasks = tasks.filter(
    (t) => t.title.toLowerCase().includes(q) || t.tag?.toLowerCase().includes(q)
  );

  const filteredGoals = goals.filter(
    (g) => g.title.toLowerCase().includes(q) || g.level.toLowerCase().includes(q)
  );

  const filteredProjects = projects.filter(
    (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );

  const actions = [
    {
      title: 'Quick Add Task',
      action: () => {
        closeCommandPalette();
        openQuickAdd('task');
      },
      icon: CheckCircle2,
    },
    {
      title: 'Quick Add Schedule Activity',
      action: () => {
        closeCommandPalette();
        openQuickAdd('schedule');
      },
      icon: Clock,
    },
    {
      title: 'Start 25m Focus Timer',
      action: () => {
        closeCommandPalette();
        startFocusTimer();
      },
      icon: Play,
    },
    {
      title: `Toggle Theme (Currently ${theme})`,
      action: () => {
        toggleTheme();
      },
      icon: theme === 'dark' ? Sun : Moon,
    },
    {
      title: 'Go to Life Dashboard',
      action: () => {
        closeCommandPalette();
        setActiveSection('dashboard');
      },
      icon: Sparkles,
    },
    {
      title: 'Go to Daily Journal',
      action: () => {
        closeCommandPalette();
        setActiveSection('journal');
      },
      icon: BookOpenText,
    },
    {
      title: 'Inspect Goal Alignment Tree',
      action: () => {
        closeCommandPalette();
        setActiveSection('hierarchy');
      },
      icon: Target,
    },
  ].filter((a) => a.title.toLowerCase().includes(q));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150"
      onClick={closeCommandPalette}
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
          />
          <kbd className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto space-y-4 text-xs">
          {/* Actions */}
          {actions.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Actions
              </div>
              <div className="space-y-0.5">
                {actions.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={i}
                      onClick={act.action}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-brand-500" />
                        <span className="font-medium">{act.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Tasks ({filteredTasks.length})
              </div>
              <div className="space-y-0.5">
                {filteredTasks.slice(0, 5).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentFocusTask(t.id);
                      setActiveSection('today');
                      closeCommandPalette();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          t.completed ? 'text-emerald-500' : 'text-zinc-400'
                        }`}
                      />
                      <span className={`truncate ${t.completed ? 'line-through text-zinc-400' : 'font-medium'}`}>
                        {t.title}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                      Focus
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Goals */}
          {filteredGoals.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Goals ({filteredGoals.length})
              </div>
              <div className="space-y-0.5">
                {filteredGoals.slice(0, 4).map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setActiveSection('goals');
                      closeCommandPalette();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Target className="w-4 h-4 text-purple-500 shrink-0" />
                      <span className="truncate font-medium">{g.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 capitalize">{g.level}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Projects ({filteredProjects.length})
              </div>
              <div className="space-y-0.5">
                {filteredProjects.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveSection('projects');
                      closeCommandPalette();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderKanban className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate font-medium">{p.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">{p.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {actions.length === 0 &&
            filteredTasks.length === 0 &&
            filteredGoals.length === 0 &&
            filteredProjects.length === 0 && (
              <div className="py-8 text-center text-zinc-400 text-xs">
                No matching results found for "{query}".
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
