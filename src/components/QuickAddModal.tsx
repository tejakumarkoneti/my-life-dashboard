import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  Target,
  FolderKanban,
  Flame,
  BookOpenText,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Priority, GoalLevel, ActivityCategory } from '../types';
import { getTodayString } from '../data/initialData';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    quickAddType,
    closeQuickAdd,
    addTask,
    addScheduleActivity,
    addGoal,
    addProject,
    addHabit,
    saveJournalEntry,
    projects,
    goals,
    lifeGoals,
    tasks,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'task' | 'schedule' | 'goal' | 'project' | 'habit' | 'journal'>('task');

  // Sync tab with quickAddType when modal opens
  React.useEffect(() => {
    if (isQuickAddOpen) {
      setActiveTab(quickAddType as any);
    }
  }, [isQuickAddOpen, quickAddType]);

  // Form states - Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('p2');
  const [taskProjectId, setTaskProjectId] = useState('');
  const [taskEstimatedMin, setTaskEstimatedMin] = useState('30');
  const [taskIsToday, setTaskIsToday] = useState(true);
  const [taskTag, setTaskTag] = useState('');

  // Form states - Schedule Activity
  const [actTitle, setActTitle] = useState('');
  const [actStartTime, setActStartTime] = useState('09:00');
  const [actEndTime, setActEndTime] = useState('10:00');
  const [actCategory, setActCategory] = useState<ActivityCategory>('deep-work');
  const [actTaskId, setActTaskId] = useState('');

  // Form states - Goal
  const [goalTitle, setGoalTitle] = useState('');
  const [goalLevel, setGoalLevel] = useState<GoalLevel>('short-term');
  const [goalLifeGoalId, setGoalLifeGoalId] = useState(lifeGoals[0]?.id || '');
  const [goalTimeframe, setGoalTimeframe] = useState('Q4 2026');
  const [goalTargetDate, setGoalTargetDate] = useState(getTodayString(30));
  const [goalMetricTarget, setGoalMetricTarget] = useState('');
  const [goalMetricUnit, setGoalMetricUnit] = useState('');

  // Form states - Project
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCategory, setProjCategory] = useState('Engineering');
  const [projGoalId, setProjGoalId] = useState(goals[0]?.id || '');
  const [projDueDate, setProjDueDate] = useState(getTodayString(45));

  // Form states - Habit
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<'productivity' | 'health' | 'skill' | 'mindset'>('productivity');

  // Form states - Journal
  const [journalAccomplishment, setJournalAccomplishment] = useState('');
  const [journalLearned, setJournalLearned] = useState('');

  if (!isQuickAddOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'task') {
      if (!taskTitle.trim()) return;
      const selectedProj = projects.find((p) => p.id === taskProjectId);
      addTask({
        title: taskTitle.trim(),
        description: taskDesc.trim() || undefined,
        priority: taskPriority,
        projectId: taskProjectId || undefined,
        goalId: selectedProj ? selectedProj.goalId : undefined,
        estimatedMinutes: parseInt(taskEstimatedMin) || 30,
        isTodayPriority: taskIsToday,
        tag: taskTag.trim() || undefined,
        date: getTodayString(0),
        completed: false,
      });
      setTaskTitle('');
      setTaskDesc('');
    } else if (activeTab === 'schedule') {
      if (!actTitle.trim()) return;
      addScheduleActivity({
        title: actTitle.trim(),
        startTime: actStartTime,
        endTime: actEndTime,
        date: getTodayString(0),
        category: actCategory,
        taskId: actTaskId || undefined,
        completed: false,
      });
      setActTitle('');
    } else if (activeTab === 'goal') {
      if (!goalTitle.trim()) return;
      addGoal({
        title: goalTitle.trim(),
        level: goalLevel as 'long-term' | 'short-term' | 'weekly',
        lifeGoalId: goalLifeGoalId,
        timeframe: goalTimeframe,
        targetDate: goalTargetDate,
        status: 'in-progress',
        progress: 0,
        metricTarget: goalMetricTarget ? parseFloat(goalMetricTarget) : undefined,
        metricCurrent: 0,
        metricUnit: goalMetricUnit || undefined,
      });
      setGoalTitle('');
    } else if (activeTab === 'project') {
      if (!projTitle.trim()) return;
      addProject({
        title: projTitle.trim(),
        description: projDesc.trim(),
        category: projCategory,
        goalId: projGoalId,
        dueDate: projDueDate,
        status: 'active',
        color: '#8b5cf6',
        milestones: [],
      });
      setProjTitle('');
      setProjDesc('');
    } else if (activeTab === 'habit') {
      if (!habitTitle.trim()) return;
      addHabit({
        title: habitTitle.trim(),
        category: habitCategory,
        iconName: 'Zap',
        color: '#8b5cf6',
      });
      setHabitTitle('');
    } else if (activeTab === 'journal') {
      saveJournalEntry({
        date: getTodayString(0),
        accomplishments: journalAccomplishment ? [journalAccomplishment] : [],
        wentWell: [],
        needsImprovement: [],
        learned: journalLearned ? [journalLearned] : [],
        mood: 'good',
        productivityRating: 4,
      });
      setJournalAccomplishment('');
      setJournalLearned('');
    }

    closeQuickAdd();
  };

  const tabs = [
    { id: 'task', label: 'Task', icon: CheckCircle2 },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'goal', label: 'Goal', icon: Target },
    { id: 'project', label: 'Project', icon: FolderKanban },
    { id: 'habit', label: 'Habit', icon: Flame },
    { id: 'journal', label: 'Reflection', icon: BookOpenText },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-zinc-900 dark:text-white text-base">Quick Create</h2>
          </div>
          <button
            onClick={closeQuickAdd}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 px-3 pt-2 gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form contents */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {activeTab === 'task' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Solve 2 Binary Search problems"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Description / Sub-notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Key details, constraints, links..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Connect to Project
                  </label>
                  <select
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">(Standalone / No Project)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="p1">P1 - Urgent & Critical</option>
                    <option value="p2">P2 - Important Standard</option>
                    <option value="p3">P3 - Nice to have</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Estimated Duration
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={taskEstimatedMin}
                      onChange={(e) => setTaskEstimatedMin(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <span className="text-xs text-zinc-500">min</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tag / Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Algorithms"
                    value={taskTag}
                    onChange={(e) => setTaskTag(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="taskToday"
                  checked={taskIsToday}
                  onChange={(e) => setTaskIsToday(e.target.checked)}
                  className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="taskToday" className="text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  Pin to Today's Top Priorities
                </label>
              </div>
            </>
          )}

          {activeTab === 'schedule' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Activity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Deep Work: Ingestion Engine"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={actStartTime}
                    onChange={(e) => setActStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={actEndTime}
                    onChange={(e) => setActEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  value={actCategory}
                  onChange={(e) => setActCategory(e.target.value as ActivityCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="deep-work">Deep Work (High Focus)</option>
                  <option value="health">Health & Fitness</option>
                  <option value="learning">Learning & Study</option>
                  <option value="routine">Routine & Admin</option>
                  <option value="break">Rest & Break</option>
                  <option value="meeting">Meeting / Sync</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Attach to Existing Task (Optional)
                </label>
                <select
                  value={actTaskId}
                  onChange={(e) => {
                    setActTaskId(e.target.value);
                    const selected = tasks.find((t) => t.id === e.target.value);
                    if (selected && !actTitle) {
                      setActTitle(selected.title);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">(No linked task)</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {activeTab === 'goal' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master System Design & Raft Paper"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Connect to Life Goal *
                  </label>
                  <select
                    value={goalLifeGoalId}
                    onChange={(e) => setGoalLifeGoalId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {lifeGoals.map((lg) => (
                      <option key={lg.id} value={lg.id}>
                        {lg.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Goal Level
                  </label>
                  <select
                    value={goalLevel}
                    onChange={(e) => setGoalLevel(e.target.value as GoalLevel)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="weekly">Weekly Goal</option>
                    <option value="short-term">Short-term (Quarterly)</option>
                    <option value="long-term">Long-term (1-3 Years)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Target Timeframe
                  </label>
                  <input
                    type="text"
                    value={goalTimeframe}
                    onChange={(e) => setGoalTimeframe(e.target.value)}
                    placeholder="e.g. Q4 2026 or This Week"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'project' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Algorithmic Mastery Engine"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Project Objective / Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="What is the key outcome of this project?"
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Connect to Parent Goal *
                  </label>
                  <select
                    value={projGoalId}
                    onChange={(e) => setProjGoalId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {goals.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    placeholder="e.g. Engineering, Fitness"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'habit' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Habit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Work 90 minutes"
                  value={habitTitle}
                  onChange={(e) => setHabitTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  value={habitCategory}
                  onChange={(e) => setHabitCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="productivity">Productivity & Focus</option>
                  <option value="health">Health & Energy</option>
                  <option value="skill">Skill & Craft Mastery</option>
                  <option value="mindset">Mindset & Mindfulness</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'journal' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  What did you accomplish today?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solved 3 graph problems, shipped DB migration"
                  value={journalAccomplishment}
                  onChange={(e) => setJournalAccomplishment(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  What did you learn today?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Raft heartbeats must be sent with term numbers"
                  value={journalLearned}
                  onChange={(e) => setJournalLearned(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeQuickAdd}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all active:scale-95"
            >
              Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
