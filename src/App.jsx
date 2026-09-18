import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClubDataProvider } from './context/ClubDataContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { TaskModal } from './components/TaskModal';
import { MeetingModal } from './components/MeetingModal';
import { ProfileModal } from './components/ProfileModal';
import { Dashboard } from './pages/Dashboard';
import { TasksPage } from './pages/TasksPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { VaultPage } from './pages/VaultPage';
import { ChatPage } from './pages/ChatPage';
import { MembersPage } from './pages/MembersPage';

function MainPortal() {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // If user is not authenticated, show strict Login Gate
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
        onOpenMeetingModal={() => setIsMeetingModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {currentTab === 'dashboard' && (
            <Dashboard
              setCurrentTab={setCurrentTab}
              onOpenTaskModal={() => setIsTaskModalOpen(true)}
              onOpenMeetingModal={() => setIsMeetingModalOpen(true)}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksPage
              onOpenTaskModal={() => setIsTaskModalOpen(true)}
            />
          )}

          {currentTab === 'meetings' && (
            <MeetingsPage
              onOpenMeetingModal={() => setIsMeetingModalOpen(true)}
            />
          )}

          {currentTab === 'vault' && (
            <VaultPage />
          )}

          {currentTab === 'chat' && (
            <ChatPage />
          )}

          {currentTab === 'members' && (
            <MembersPage
              setCurrentTab={setCurrentTab}
              onOpenTaskModal={() => setIsTaskModalOpen(true)}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <MeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ClubDataProvider>
        <MainPortal />
      </ClubDataProvider>
    </AuthProvider>
  );
}
