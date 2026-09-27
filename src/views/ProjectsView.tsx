import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Target,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    goals,
    tasks,
    deleteProject,
    toggleMilestone,
    addMilestone,
    openQuickAdd,
    updateProject,
  } = useApp();

  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<{ [key: string]: string }>({});

  const handleAddMilestone = (projectId: string, e: React.FormEvent) => {
    e.preventDefault();
    const title = newMilestoneTitle[projectId]?.trim();
    if (!title) return;

    addMilestone(projectId, title);
    setNewMilestoneTitle((prev) => ({ ...prev, [projectId]: '' }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-subtle">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Execution Engines</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Active Projects & Milestones
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Transforming strategic goals into concrete roadmaps and deliverables.
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('project')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => {
          const parentGoal = goals.find((g) => g.id === project.goalId);
          const projectTasks = tasks.filter((t) => t.projectId === project.id);
          const completedMilestones = project.milestones.filter((m) => m.completed).length;
          const totalMilestones = project.milestones.length;
          const progressPercent = totalMilestones > 0
            ? Math.round((completedMilestones / totalMilestones) * 100)
            : 0;

          const isExpanded = expandedProjectId === project.id;

          return (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-subtle overflow-hidden transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              {/* Project Card Header */}
              <div
                className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: `${project.color}20`, color: project.color }}
                  >
                    <FolderKanban className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {project.category}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {project.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
                        {project.description}
                      </p>
                    )}

                    {parentGoal && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-brand-600 dark:text-brand-400 font-semibold">
                        <Target className="w-3.5 h-3.5" />
                        <span>Connected to: {parentGoal.title}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress & Toggle */}
                <div className="flex items-center gap-6 sm:shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1.5">
                      <span className="font-mono text-base font-extrabold text-zinc-900 dark:text-white">
                        {progressPercent}%
                      </span>
                      <span className="text-xs text-zinc-400">
                        ({completedMilestones}/{totalMilestones} milestones)
                      </span>
                    </div>
                    <div className="w-28 sm:w-36 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ backgroundColor: project.color, width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <button className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Milestones & Tasks Drawer */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-5 bg-zinc-50/50 dark:bg-zinc-900/50">
                  {/* Milestones Checklist */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                      Key Milestones
                    </h4>

                    <div className="space-y-2">
                      {project.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => toggleMilestone(project.id, m.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            m.completed
                              ? 'bg-zinc-100/60 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-400'
                              : 'bg-white dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 hover:border-brand-500'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                              m.completed ? 'bg-emerald-500 text-white' : 'border border-zinc-300 dark:border-zinc-600'
                            }`}
                          >
                            {m.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <span className={`text-xs font-semibold flex-1 ${m.completed ? 'line-through' : ''}`}>
                            {m.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Inline Add Milestone form */}
                    <form
                      onSubmit={(e) => handleAddMilestone(project.id, e)}
                      className="mt-3 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Add a milestone to this project..."
                        value={newMilestoneTitle[project.id] || ''}
                        onChange={(e) =>
                          setNewMilestoneTitle((prev) => ({
                            ...prev,
                            [project.id]: e.target.value,
                          }))
                        }
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity"
                      >
                        + Add Milestone
                      </button>
                    </form>
                  </div>

                  {/* Connected Tasks List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                      Associated Tasks ({projectTasks.length})
                    </h4>
                    <div className="space-y-1.5">
                      {projectTasks.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 text-xs"
                        >
                          <span className={t.completed ? 'line-through text-zinc-400' : 'font-medium text-zinc-800 dark:text-zinc-200'}>
                            {t.title}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400">{t.estimatedMinutes}m</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-2 flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Target: {project.dueDate}</span>
                    </span>

                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-rose-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Project</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
