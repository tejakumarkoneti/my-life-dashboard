import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { QuickAddModal } from './components/QuickAddModal';
import { CommandPalette } from './components/CommandPalette';
import { FocusTimerBar } from './components/FocusTimerBar';

// Views
import { DashboardView } from './views/DashboardView';
import { TodayView } from './views/TodayView';
import { ScheduleView } from './views/ScheduleView';
import { GoalsView } from './views/GoalsView';
import { ProjectsView } from './views/ProjectsView';
import { HabitsView } from './views/HabitsView';
import { ProgressView } from './views/ProgressView';
import { JournalView } from './views/JournalView';
import { HierarchyView } from './views/HierarchyView';

const AppContent: React.FC = () => {
  const { activeSection } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'today':
        return <TodayView />;
      case 'schedule':
        return <ScheduleView />;
      case 'goals':
        return <GoalsView />;
      case 'projects':
        return <ProjectsView />;
      case 'habits':
        return <HabitsView />;
      case 'progress':
        return <ProgressView />;
      case 'journal':
        return <JournalView />;
      case 'hierarchy':
        return <HierarchyView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Sidebar navigation */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header onOpenMobile={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Bars */}
      <QuickAddModal />
      <CommandPalette />
      <FocusTimerBar />
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
