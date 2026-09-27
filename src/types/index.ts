export type Priority = 'p1' | 'p2' | 'p3';

export type GoalLevel = 'life' | 'long-term' | 'short-term' | 'weekly';

export type GoalStatus = 'in-progress' | 'completed' | 'on-hold' | 'planning';

export type ActivityCategory = 'deep-work' | 'health' | 'learning' | 'routine' | 'meeting' | 'break';

export type MoodType = 'ecstatic' | 'good' | 'neutral' | 'tired' | 'stressed';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface LifeGoal {
  id: string;
  title: string;
  vision: string;
  category: 'Career' | 'Health' | 'Finance' | 'Personal' | 'Creativity' | 'Impact';
  color: string;
  iconName: string;
  targetYears: string;
  progress: number; // 0 - 100
}

export interface Goal {
  id: string;
  lifeGoalId: string; // Links to parent Life Goal
  parentGoalId?: string; // Optional parent goal if hierarchical
  title: string;
  level: 'long-term' | 'short-term' | 'weekly';
  timeframe: string; // e.g. "2026-2027", "Q4 2026", "This Week"
  targetDate: string;
  status: GoalStatus;
  progress: number; // 0 - 100
  metricTarget?: number;
  metricCurrent?: number;
  metricUnit?: string;
  description?: string;
}

export interface Project {
  id: string;
  goalId: string; // Links to parent Goal
  title: string;
  description: string;
  category: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
  color: string;
  dueDate: string;
  milestones: Milestone[];
}

export interface Task {
  id: string;
  projectId?: string; // Links to Project
  goalId?: string; // Can link directly or via project
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  date: string; // YYYY-MM-DD
  estimatedMinutes: number;
  actualMinutes?: number;
  isTodayPriority?: boolean;
  isCurrentFocus?: boolean;
  tag?: string;
  completedAt?: string;
}

export interface ScheduleActivity {
  id: string;
  taskId?: string; // Links to Task
  title: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  date: string; // YYYY-MM-DD
  category: ActivityCategory;
  completed: boolean;
  notes?: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  iconName: string;
  category: 'health' | 'mindset' | 'productivity' | 'skill';
  color: string;
  streak: number;
  longestStreak: number;
  completedDates: string[]; // ['2026-09-27', '2026-09-26', ...]
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  accomplishments: string[];
  wentWell: string[];
  needsImprovement: string[];
  learned: string[];
  mood: MoodType;
  productivityRating: number; // 1-5
  notes?: string;
}

export interface FocusSession {
  activeTaskId: string | null;
  isRunning: boolean;
  secondsRemaining: number;
  totalSeconds: number;
  mode: 'focus' | 'short-break' | 'long-break';
}

export type ActiveSection =
  | 'dashboard'
  | 'today'
  | 'schedule'
  | 'goals'
  | 'projects'
  | 'habits'
  | 'progress'
  | 'journal'
  | 'hierarchy';
