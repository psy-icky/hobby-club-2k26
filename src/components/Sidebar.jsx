import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Video, 
  MessageSquare, 
  Users, 
  FolderLock,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { useClubData } from '../context/ClubDataContext';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ currentTab, setCurrentTab }) => {
  const { tasks, meetings, files } = useClubData();
  const { currentUser } = useAuth();

  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length;
  const myTasksCount = tasks.filter(t => t.assigneeId === currentUser?.id && t.status !== 'done').length;
  const upcomingMeetingsCount = meetings.filter(m => m.status === 'Upcoming' || m.status === 'Ongoing').length;
  const totalFilesCount = (files || []).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      color: 'text-blue-400'
    },
    {
      id: 'tasks',
      label: 'Task Delegation',
      icon: CheckSquare,
      badge: myTasksCount > 0 ? `${myTasksCount} Mine` : `${pendingTasksCount}`,
      badgeColor: myTasksCount > 0 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300',
      color: 'text-emerald-400'
    },
    {
      id: 'meetings',
      label: 'Google Meet Hub',
      icon: Video,
      badge: upcomingMeetingsCount > 0 ? `${upcomingMeetingsCount} Live` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      color: 'text-cyan-400'
    },
    {
      id: 'vault',
      label: 'Bills & Media Vault',
      icon: FolderLock,
      badge: `${totalFilesCount}`,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      color: 'text-amber-400'
    },
    {
      id: 'chat',
      label: 'Team Chat',
      icon: MessageSquare,
      badge: 'Live',
      badgeColor: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
      color: 'text-purple-400'
    },
    {
      id: 'members',
      label: 'Executive Team',
      icon: Users,
      badge: '12',
      badgeColor: 'bg-slate-800 text-slate-400',
      color: 'text-indigo-400'
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950/60 border-r border-slate-800/80 p-4 shrink-0 min-h-[calc(100vh-4rem)]">
        
        {/* Navigation list */}
        <div className="space-y-1.5 flex-1">
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-blue-600/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : item.color}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Technical Lead Footnote Card */}
        <div className="mt-auto pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                Technical Systems
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-200">
              Technical Head: Smit Barmate
            </p>

            <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Cloud Sync Active
              </span>
              <span className="font-mono text-slate-400">v2.2</span>
            </div>
          </div>
        </div>

      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-1 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[9px] font-medium transition-colors ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[50px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
