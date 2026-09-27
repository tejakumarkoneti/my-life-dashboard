import React, { useState } from 'react';
import {
  Network,
  Target,
  FolderKanban,
  CheckCircle2,
  Clock,
  ChevronRight,
  ArrowDown,
  Sparkles,
  Link2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayString } from '../data/initialData';

export const HierarchyView: React.FC = () => {
  const { lifeGoals, goals, projects, tasks, schedule, getAlignmentScore, setActiveSection } = useApp();

  const [selectedLifeGoalId, setSelectedLifeGoalId] = useState<string>(lifeGoals[0]?.id || '');

  const activeLifeGoal = lifeGoals.find((lg) => lg.id === selectedLifeGoalId) || lifeGoals[0];

  // Connected Goals
  const connectedGoals = goals.filter((g) => g.lifeGoalId === activeLifeGoal?.id);

  const alignmentScore = getAlignmentScore();

  // Find orphaned tasks (not connected to any project or goal)
  const orphanedTasks = tasks.filter((t) => !t.projectId && !t.goalId);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Top Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-2">
              <Network className="w-3.5 h-3.5" />
              <span>Full Lineage & Traceability</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Life Goal ➔ Daily Activity Alignment
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
              Inspect how every hourly task and daily ritual ties directly back to your ultimate vision.
              Never spend a day wondering if your hard work actually matters.
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950/40 dark:to-zinc-900 border border-brand-200 dark:border-brand-800/40 shrink-0">
            <div>
              <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Alignment Score
              </div>
              <div className="text-3xl font-black text-brand-600 dark:text-brand-400">
                {alignmentScore}%
              </div>
            </div>
            <Sparkles className="w-6 h-6 text-brand-500 ml-2" />
          </div>
        </div>
      </div>

      {/* Life Goal Picker Pills */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Select Life Goal to Trace
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {lifeGoals.map((lg) => {
            const isSelected = lg.id === selectedLifeGoalId;
            return (
              <button
                key={lg.id}
                onClick={() => setSelectedLifeGoalId(lg.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500 shadow-sm'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: lg.color }}
                  />
                  <span className="text-[10px] uppercase font-bold text-zinc-400">
                    {lg.category}
                  </span>
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white line-clamp-2">
                  {lg.title}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Alignment Flow Tree */}
      {activeLifeGoal && (
        <div className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-subtle">
          {/* Level 1: Life Goal Apex */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-xl p-5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg text-center">
              <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                Tier 1: Ultimate Life Goal
              </span>
              <h3 className="text-lg sm:text-xl font-black mt-2">{activeLifeGoal.title}</h3>
              <p className="text-xs text-brand-100 mt-1">{activeLifeGoal.vision}</p>
            </div>
            <ArrowDown className="w-6 h-6 text-brand-500 my-3" />
          </div>

          {/* Level 2: Sub-Goals */}
          <div className="space-y-8">
            {connectedGoals.map((goal) => {
              const connectedProjects = projects.filter((p) => p.goalId === goal.id);

              return (
                <div
                  key={goal.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-6"
                >
                  {/* Goal Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-800/80 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        Tier 2: {goal.level.toUpperCase()} GOAL ({goal.timeframe})
                      </span>
                      <h4 className="text-base font-bold text-zinc-900 dark:text-white mt-1">
                        {goal.title}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-sm font-extrabold text-brand-600 dark:text-brand-400">
                        {goal.progress}% Done
                      </span>
                    </div>
                  </div>

                  {/* Level 3: Projects */}
                  <div className="space-y-4 pl-4 sm:pl-8 border-l-2 border-brand-500/30">
                    {connectedProjects.length === 0 ? (
                      <div className="text-xs text-zinc-400 italic">
                        No active projects currently linked directly under this goal.
                      </div>
                    ) : (
                      connectedProjects.map((project) => {
                        const projectTasks = tasks.filter((t) => t.projectId === project.id);

                        return (
                          <div
                            key={project.id}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-xs space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FolderKanban className="w-4 h-4 text-brand-500" />
                                <span className="text-[10px] uppercase font-bold text-zinc-400">
                                  Tier 3: Project
                                </span>
                                <span className="font-bold text-sm text-zinc-900 dark:text-white">
                                  {project.title}
                                </span>
                              </div>
                              <span className="text-xs text-zinc-400 font-mono">
                                Due: {project.dueDate}
                              </span>
                            </div>

                            {/* Level 4: Tasks */}
                            <div className="pl-4 sm:pl-6 border-l-2 border-zinc-200 dark:border-zinc-700 space-y-2">
                              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                                Tier 4: Today's Actionable Tasks
                              </span>

                              {projectTasks.length === 0 ? (
                                <p className="text-xs text-zinc-400 italic">No tasks created yet.</p>
                              ) : (
                                projectTasks.map((task) => {
                                  const linkedSchedule = schedule.find((s) => s.taskId === task.id);

                                  return (
                                    <div
                                      key={task.id}
                                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 text-xs"
                                    >
                                      <div className="flex items-center gap-2">
                                        <CheckCircle2
                                          className={`w-4 h-4 shrink-0 ${
                                            task.completed ? 'text-emerald-500' : 'text-zinc-400'
                                          }`}
                                        />
                                        <span
                                          className={`font-semibold ${
                                            task.completed ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-white'
                                          }`}
                                        >
                                          {task.title}
                                        </span>
                                      </div>

                                      {/* Level 5: Daily Schedule Block */}
                                      {linkedSchedule ? (
                                        <span className="font-mono text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded flex items-center gap-1 self-start sm:self-auto">
                                          <Clock className="w-3 h-3" />
                                          <span>Tier 5: Scheduled at {linkedSchedule.startTime}</span>
                                        </span>
                                      ) : (
                                        <span className="text-[10px] text-zinc-400">
                                          Flexible / Unscheduled
                                        </span>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Orphaned Tasks Notice */}
      {orphanedTasks.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/50 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
              {orphanedTasks.length} Standalone Task(s) Detected
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              These tasks are not currently linked to any Project or Life Goal. Linking them ensures every minute spent moves your life forward.
            </p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {orphanedTasks.map((t) => (
                <span
                  key={t.id}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium border border-amber-200 dark:border-amber-900"
                >
                  {t.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
