import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  LifeGoal,
  Goal,
  Project,
  Task,
  ScheduleActivity,
  Habit,
  JournalEntry,
  FocusSession,
  ActiveSection,
} from '../types';
import {
  INITIAL_LIFE_GOALS,
  INITIAL_GOALS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_SCHEDULE,
  INITIAL_HABITS,
  INITIAL_JOURNAL,
  getTodayString,
} from '../data/initialData';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info';
}

interface AppContextType {
  // State
  lifeGoals: LifeGoal[];
  goals: Goal[];
  projects: Project[];
  tasks: Task[];
  schedule: ScheduleActivity[];
  habits: Habit[];
  journal: JournalEntry[];
  activeSection: ActiveSection;
  theme: 'dark' | 'light';
  focusSession: FocusSession;
  isQuickAddOpen: boolean;
  quickAddType: 'task' | 'goal' | 'project' | 'habit' | 'schedule' | 'journal';
  isCommandPaletteOpen: boolean;
  toast: ToastState | null;

  // Navigation & UI
  setActiveSection: (section: ActiveSection) => void;
  toggleTheme: () => void;
  openQuickAdd: (type?: 'task' | 'goal' | 'project' | 'habit' | 'schedule' | 'journal') => void;
  closeQuickAdd: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  showToast: (message: string, type?: 'success' | 'info') => void;
  resetToSampleData: () => void;

  // Task actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  setCurrentFocusTask: (id: string | null) => void;
  toggleTodayPriority: (id: string) => void;

  // Schedule actions
  addScheduleActivity: (activity: Omit<ScheduleActivity, 'id'>) => void;
  updateScheduleActivity: (id: string, updates: Partial<ScheduleActivity>) => void;
  deleteScheduleActivity: (id: string) => void;
  toggleActivityComplete: (id: string) => void;
  rescheduleActivity: (id: string, shiftMinutes: number) => void;

  // Goal actions
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addLifeGoal: (lg: Omit<LifeGoal, 'id'>) => void;
  updateLifeGoal: (id: string, updates: Partial<LifeGoal>) => void;
  deleteLifeGoal: (id: string) => void;

  // Project actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  addMilestone: (projectId: string, title: string) => void;

  // Habit actions
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedDates'>) => void;
  toggleHabitDate: (habitId: string, dateStr: string) => void;
  deleteHabit: (habitId: string) => void;

  // Journal actions
  saveJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  deleteJournalEntry: (id: string) => void;

  // Focus Timer actions
  startFocusTimer: () => void;
  pauseFocusTimer: () => void;
  resetFocusTimer: () => void;
  setFocusDuration: (minutes: number, mode: 'focus' | 'short-break' | 'long-break') => void;

  // Traceability & Alignment calculations
  getTaskAlignment: (task: Task) => {
    project?: Project;
    goal?: Goal;
    lifeGoal?: LifeGoal;
  };
  getAlignmentScore: () => number; // 0 to 100 percentage
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'life_os_';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}theme`);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}theme`, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Section navigation
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');

  // Modals & Popovers
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'task' | 'goal' | 'project' | 'habit' | 'schedule' | 'journal'>('task');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Helper to load or initialize from localStorage
  const loadStorage = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  // Main state entities
  const [lifeGoals, setLifeGoals] = useState<LifeGoal[]>(() => loadStorage('life_goals', INITIAL_LIFE_GOALS));
  const [goals, setGoals] = useState<Goal[]>(() => loadStorage('goals', INITIAL_GOALS));
  const [projects, setProjects] = useState<Project[]>(() => loadStorage('projects', INITIAL_PROJECTS));
  const [tasks, setTasks] = useState<Task[]>(() => loadStorage('tasks', INITIAL_TASKS));
  const [schedule, setSchedule] = useState<ScheduleActivity[]>(() => loadStorage('schedule', INITIAL_SCHEDULE));
  const [habits, setHabits] = useState<Habit[]>(() => loadStorage('habits', INITIAL_HABITS));
  const [journal, setJournal] = useState<JournalEntry[]>(() => loadStorage('journal', INITIAL_JOURNAL));

  // Focus Session timer
  const [focusSession, setFocusSession] = useState<FocusSession>(() => ({
    activeTaskId: 't-1',
    isRunning: false,
    secondsRemaining: 25 * 60,
    totalSeconds: 25 * 60,
    mode: 'focus',
  }));

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}life_goals`, JSON.stringify(lifeGoals)); }, [lifeGoals]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}goals`, JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}projects`, JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}tasks`, JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}schedule`, JSON.stringify(schedule)); }, [schedule]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}habits`, JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}journal`, JSON.stringify(journal)); }, [journal]);

  // Toast handler
  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 3500);
  }, []);

  // Keyboard shortcut listener (Cmd/Ctrl+K, Q)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when user is typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'q') {
        e.preventDefault();
        setIsQuickAddOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus Timer interval effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (focusSession.isRunning && focusSession.secondsRemaining > 0) {
      timer = setInterval(() => {
        setFocusSession((prev) => {
          if (prev.secondsRemaining <= 1) {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            showToast('Focus session complete! Take a well-deserved breather.', 'success');
            return {
              ...prev,
              isRunning: false,
              secondsRemaining: 0,
            };
          }
          return {
            ...prev,
            secondsRemaining: prev.secondsRemaining - 1,
          };
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [focusSession.isRunning, focusSession.secondsRemaining, showToast]);

  const startFocusTimer = useCallback(() => {
    setFocusSession((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const pauseFocusTimer = useCallback(() => {
    setFocusSession((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resetFocusTimer = useCallback(() => {
    setFocusSession((prev) => ({
      ...prev,
      isRunning: false,
      secondsRemaining: prev.totalSeconds,
    }));
  }, []);

  const setFocusDuration = useCallback((minutes: number, mode: 'focus' | 'short-break' | 'long-break') => {
    const secs = minutes * 60;
    setFocusSession((prev) => ({
      ...prev,
      isRunning: false,
      mode,
      totalSeconds: secs,
      secondsRemaining: secs,
    }));
  }, []);

  // Quick Add Helpers
  const openQuickAdd = useCallback((type: 'task' | 'goal' | 'project' | 'habit' | 'schedule' | 'journal' = 'task') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  }, []);

  const closeQuickAdd = useCallback(() => {
    setIsQuickAddOpen(false);
  }, []);

  const openCommandPalette = useCallback(() => setIsCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);

  // Reset to Sample Data
  const resetToSampleData = useCallback(() => {
    setLifeGoals(INITIAL_LIFE_GOALS);
    setGoals(INITIAL_GOALS);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setSchedule(INITIAL_SCHEDULE);
    setHabits(INITIAL_HABITS);
    setJournal(INITIAL_JOURNAL);
    showToast('Reset to clean sample data successfully!', 'info');
  }, [showToast]);

  // Tasks actions
  const addTask = useCallback((taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task "${newTask.title.slice(0, 24)}..." created!`, 'success');
  }, [showToast]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed', 'info');
  }, [showToast]);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        }
        return t;
      })
    );
  }, []);

  const setCurrentFocusTask = useCallback((id: string | null) => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        isCurrentFocus: t.id === id,
      }))
    );
    setFocusSession((prev) => ({
      ...prev,
      activeTaskId: id,
      isRunning: id !== null,
    }));
    if (id) {
      showToast('Switched current focus task!', 'info');
    }
  }, [showToast]);

  const toggleTodayPriority = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isTodayPriority: !t.isTodayPriority } : t))
    );
  }, []);

  // Schedule Actions
  const addScheduleActivity = useCallback((actData: Omit<ScheduleActivity, 'id'>) => {
    const newAct: ScheduleActivity = {
      ...actData,
      id: `act-${Date.now()}`,
    };
    setSchedule((prev) => [...prev, newAct].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    showToast(`Activity "${newAct.title.slice(0, 20)}..." scheduled`, 'success');
  }, [showToast]);

  const updateScheduleActivity = useCallback((id: string, updates: Partial<ScheduleActivity>) => {
    setSchedule((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a)).sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
  }, []);

  const deleteScheduleActivity = useCallback((id: string) => {
    setSchedule((prev) => prev.filter((a) => a.id !== id));
    showToast('Activity removed from schedule', 'info');
  }, [showToast]);

  const toggleActivityComplete = useCallback((id: string) => {
    setSchedule((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextCompleted = !a.completed;
          if (nextCompleted) {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.65 } });
          }
          return { ...a, completed: nextCompleted };
        }
        return a;
      })
    );
  }, []);

  const rescheduleActivity = useCallback((id: string, shiftMinutes: number) => {
    setSchedule((prev) =>
      prev.map((act) => {
        if (act.id !== id) return act;
        const [startH, startM] = act.startTime.split(':').map(Number);
        const [endH, endM] = act.endTime.split(':').map(Number);

        let newStartTotal = startH * 60 + startM + shiftMinutes;
        let newEndTotal = endH * 60 + endM + shiftMinutes;

        // Clamp to 24h
        newStartTotal = Math.max(0, Math.min(23 * 60 + 59, newStartTotal));
        newEndTotal = Math.max(newStartTotal + 15, Math.min(23 * 60 + 59, newEndTotal));

        const formatTime = (total: number) => {
          const h = Math.floor(total / 60);
          const m = total % 60;
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        };

        return {
          ...act,
          startTime: formatTime(newStartTotal),
          endTime: formatTime(newEndTotal),
        };
      }).sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
    showToast(`Activity rescheduled by ${shiftMinutes > 0 ? '+' : ''}${shiftMinutes}m`, 'info');
  }, [showToast]);

  // Goal & Life Goal actions
  const addGoal = useCallback((goalData: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `g-${Date.now()}`,
    };
    setGoals((prev) => [newGoal, ...prev]);
    showToast(`New goal created: ${newGoal.title}`, 'success');
  }, [showToast]);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Goal deleted', 'info');
  }, [showToast]);

  const addLifeGoal = useCallback((lgData: Omit<LifeGoal, 'id'>) => {
    const newLG: LifeGoal = {
      ...lgData,
      id: `lg-${Date.now()}`,
    };
    setLifeGoals((prev) => [...prev, newLG]);
    showToast(`Life goal added: ${newLG.title}`, 'success');
  }, [showToast]);

  const updateLifeGoal = useCallback((id: string, updates: Partial<LifeGoal>) => {
    setLifeGoals((prev) => prev.map((lg) => (lg.id === id ? { ...lg, ...updates } : lg)));
  }, []);

  const deleteLifeGoal = useCallback((id: string) => {
    setLifeGoals((prev) => prev.filter((lg) => lg.id !== id));
    showToast('Life goal deleted', 'info');
  }, [showToast]);

  // Project actions
  const addProject = useCallback((pData: Omit<Project, 'id'>) => {
    const newProj: Project = {
      ...pData,
      id: `p-${Date.now()}`,
    };
    setProjects((prev) => [newProj, ...prev]);
    showToast(`Project created: ${newProj.title}`, 'success');
  }, [showToast]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Project deleted', 'info');
  }, [showToast]);

  const toggleMilestone = useCallback((projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedMilestones = proj.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        return {
          ...proj,
          milestones: updatedMilestones,
        };
      })
    );
  }, []);

  const addMilestone = useCallback((projectId: string, title: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        return {
          ...proj,
          milestones: [
            ...proj.milestones,
            { id: `m-${Date.now()}`, title, completed: false },
          ],
        };
      })
    );
    showToast('Milestone added', 'success');
  }, [showToast]);

  // Habit actions
  const addHabit = useCallback((hData: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...hData,
      id: `h-${Date.now()}`,
      streak: 0,
      longestStreak: 0,
      completedDates: [],
    };
    setHabits((prev) => [...prev, newHabit]);
    showToast(`Habit "${newHabit.title}" created`, 'success');
  }, [showToast]);

  const toggleHabitDate = useCallback((habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;
        const alreadyDone = habit.completedDates.includes(dateStr);
        let updatedDates: string[];

        if (alreadyDone) {
          updatedDates = habit.completedDates.filter((d) => d !== dateStr);
        } else {
          updatedDates = [...habit.completedDates, dateStr];
          confetti({ particleCount: 35, spread: 45, origin: { y: 0.6 } });
        }

        // Simple streak recalculation for today/yesterday continuity
        const isTodayDone = updatedDates.includes(getTodayString(0));
        const newStreak = alreadyDone
          ? Math.max(0, habit.streak - 1)
          : isTodayDone ? habit.streak + 1 : habit.streak;

        return {
          ...habit,
          completedDates: updatedDates,
          streak: newStreak,
          longestStreak: Math.max(habit.longestStreak, newStreak),
        };
      })
    );
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    showToast('Habit deleted', 'info');
  }, [showToast]);

  // Journal actions
  const saveJournalEntry = useCallback((entryData: Omit<JournalEntry, 'id'>) => {
    setJournal((prev) => {
      const existingIndex = prev.findIndex((j) => j.date === entryData.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...entryData, id: prev[existingIndex].id };
        return updated;
      }
      return [{ ...entryData, id: `j-${Date.now()}` }, ...prev];
    });
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
    showToast('Daily reflection recorded!', 'success');
  }, [showToast]);

  const deleteJournalEntry = useCallback((id: string) => {
    setJournal((prev) => prev.filter((j) => j.id !== id));
    showToast('Journal entry deleted', 'info');
  }, [showToast]);

  // Traceability & Alignment calculations
  // Connects: Task -> Project -> Goal -> LifeGoal
  const getTaskAlignment = useCallback((task: Task) => {
    let project = task.projectId ? projects.find((p) => p.id === task.projectId) : undefined;
    let goalId = task.goalId || (project ? project.goalId : undefined);
    let goal = goalId ? goals.find((g) => g.id === goalId) : undefined;
    let lifeGoalId = goal ? goal.lifeGoalId : undefined;
    let lifeGoal = lifeGoalId ? lifeGoals.find((lg) => lg.id === lifeGoalId) : undefined;

    return { project, goal, lifeGoal };
  }, [projects, goals, lifeGoals]);

  // Alignment Score: % of today's tasks that have a verified connection to a Goal/LifeGoal
  const getAlignmentScore = useCallback(() => {
    const todayStr = getTodayString(0);
    const todayTasks = tasks.filter((t) => t.date === todayStr);
    if (todayTasks.length === 0) return 85; // baseline

    const alignedTasks = todayTasks.filter((t) => {
      const alignment = getTaskAlignment(t);
      return Boolean(alignment.goal || alignment.lifeGoal);
    });

    return Math.round((alignedTasks.length / todayTasks.length) * 100);
  }, [tasks, getTaskAlignment]);

  return (
    <AppContext.Provider
      value={{
        lifeGoals,
        goals,
        projects,
        tasks,
        schedule,
        habits,
        journal,
        activeSection,
        theme,
        focusSession,
        isQuickAddOpen,
        quickAddType,
        isCommandPaletteOpen,
        toast,

        setActiveSection,
        toggleTheme,
        openQuickAdd,
        closeQuickAdd,
        openCommandPalette,
        closeCommandPalette,
        showToast,
        resetToSampleData,

        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        setCurrentFocusTask,
        toggleTodayPriority,

        addScheduleActivity,
        updateScheduleActivity,
        deleteScheduleActivity,
        toggleActivityComplete,
        rescheduleActivity,

        addGoal,
        updateGoal,
        deleteGoal,
        addLifeGoal,
        updateLifeGoal,
        deleteLifeGoal,

        addProject,
        updateProject,
        deleteProject,
        toggleMilestone,
        addMilestone,

        addHabit,
        toggleHabitDate,
        deleteHabit,

        saveJournalEntry,
        deleteJournalEntry,

        startFocusTimer,
        pauseFocusTimer,
        resetFocusTimer,
        setFocusDuration,

        getTaskAlignment,
        getAlignmentScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
