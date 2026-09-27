import React, { useState } from 'react';
import {
  Target,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  FolderKanban,
  Edit2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Goal, GoalLevel, LifeGoal } from '../types';

export const GoalsView: React.FC = () => {
  const {
    lifeGoals,
    goals,
    projects,
    tasks,
    updateGoal,
    deleteGoal,
    openQuickAdd,
    setActiveSection,
  } = useApp();

  const [activeTier, setActiveTier] = useState<GoalLevel | 'all'>('all');
  const [selectedLifeGoalFilter, setSelectedLifeGoalFilter] = useState<string>('all');

  // Filtered goals
  const filteredGoals = goals.filter((g) => {
    const tierMatch = activeTier === 'all' || g.level === activeTier;
    const lifeMatch = selectedLifeGoalFilter === 'all' || g.lifeGoalId === selectedLifeGoalFilter;
    return tierMatch && lifeMatch;
  });

  const getTierColor = (level: GoalLevel) => {
    switch (level) {
      case 'weekly':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
      case 'short-term':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
      case 'long-term':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300';
      default:
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Top Banner / Hero */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-subtle">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5" />
            <span>Strategic Direction</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Life & Strategic Goals
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Bridging the gap between 5-year vision and this week's prioritized execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('hierarchy')}
            className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Alignment Tree
          </button>
          <button
            onClick={() => openQuickAdd('goal')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* 1. Life Goals Showcase Carousel/Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Core Life Aspirations ({lifeGoals.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lifeGoals.map((lg) => {
            const childGoalsCount = goals.filter((g) => g.lifeGoalId === lg.id).length;
            const isSelected = selectedLifeGoalFilter === lg.id;

            return (
              <div
                key={lg.id}
                onClick={() => setSelectedLifeGoalFilter(isSelected ? 'all' : lg.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-brand-500 shadow-md bg-white dark:bg-zinc-800'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-subtle'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: lg.color }}
                  />
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {lg.category}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-1.5 leading-snug line-clamp-2">
                  {lg.title}
                </h4>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
                  {lg.vision}
                </p>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-medium">Progress</span>
                    <span className="font-bold font-mono text-zinc-900 dark:text-white">{lg.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        backgroundColor: lg.color,
                        width: `${lg.progress}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>{lg.targetYears}</span>
                  <span className="font-medium text-brand-600 dark:text-brand-400">
                    {childGoalsCount} linked goals
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Goal Tiers Filter Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(
            [
              { id: 'all', label: 'All Goal Tiers' },
              { id: 'weekly', label: 'Weekly Goals' },
              { id: 'short-term', label: 'Short-Term (Quarterly)' },
              { id: 'long-term', label: 'Long-Term (1-3 Yrs)' },
            ] as const
          ).map((tier) => (
            <button
              key={tier.id}
              onClick={() => setActiveTier(tier.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTier === tier.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        {selectedLifeGoalFilter !== 'all' && (
          <button
            onClick={() => setSelectedLifeGoalFilter('all')}
            className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
          >
            Clear Life Goal Filter (Showing 1)
          </button>
        )}
      </div>

      {/* 3. Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map((goal) => {
          const parentLife = lifeGoals.find((lg) => lg.id === goal.lifeGoalId);
          const connectedProjects = projects.filter((p) => p.goalId === goal.id);

          return (
            <div
              key={goal.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Meta badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getTierColor(
                      goal.level
                    )}`}
                  >
                    {goal.level.replace('-', ' ')}
                  </span>

                  <span className="text-xs font-mono text-zinc-400 font-medium">
                    {goal.timeframe}
                  </span>
                </div>

                <h4 className="text-base font-bold text-zinc-900 dark:text-white leading-snug mb-1">
                  {goal.title}
                </h4>

                {goal.description && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
                    {goal.description}
                  </p>
                )}

                {/* Parent Life Goal Badge */}
                {parentLife && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-[11px] font-medium text-zinc-600 dark:text-zinc-300 mb-4">
                    <Target className="w-3 h-3 text-brand-500" />
                    <span>Feeds: <strong>{parentLife.title}</strong></span>
                  </div>
                )}
              </div>

              <div>
                {/* Progress bar and metric target */}
                <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                      {goal.metricTarget
                        ? `${goal.metricCurrent} / ${goal.metricTarget} ${goal.metricUnit || ''}`
                        : 'Completion'}
                    </span>
                    <span className="font-bold font-mono text-zinc-900 dark:text-white">
                      {goal.progress}%
                    </span>
                  </div>

                  {/* Interactive Slider to update progress easily! */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => updateGoal(goal.id, { progress: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                </div>

                {/* Connected Projects */}
                {connectedProjects.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap text-[11px] text-zinc-500">
                    <FolderKanban className="w-3 h-3 text-zinc-400" />
                    <span>Projects:</span>
                    {connectedProjects.map((p) => (
                      <span
                        key={p.id}
                        className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold"
                      >
                        {p.title}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-3 pt-2 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Due: {goal.targetDate}</span>
                  </span>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 hover:text-rose-500 transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
