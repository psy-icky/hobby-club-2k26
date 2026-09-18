import React, { useState } from 'react';
import { 
  Video, 
  PlusCircle, 
  Bell, 
  LogOut, 
  Sparkles, 
  ChevronDown, 
  ExternalLink,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClubData } from '../context/ClubDataContext';
import { getRealInstantMeetUrl } from '../utils/googleMeet';

export const Navbar = ({ onOpenTaskModal, onOpenMeetingModal }) => {
  const { currentUser, logout } = useAuth();
  const { activities, tasks } = useClubData();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const pendingTasksCount = tasks.filter(t => t.assigneeId === currentUser?.id && t.status !== 'done').length;

  const handleInstantMeet = () => {
    window.open(getRealInstantMeetUrl(), '_blank');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-display font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  HC
                </span>
              </div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white">
                HOBBY CLUB
              </span>
              <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                2k26
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Executive Council Portal • Realtime Sync Active
            </p>
          </div>
        </div>

        {/* Center: Quick Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={handleInstantMeet}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Launch Google Meet</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <button
            onClick={onOpenMeetingModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-medium hover:bg-slate-800 hover:border-slate-600 transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Schedule Meeting</span>
          </button>

          <button
            onClick={onOpenTaskModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 text-xs font-medium hover:bg-indigo-600/30 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Assign Task</span>
          </button>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Activity / Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowUserMenu(false);
              }}
              className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors relative"
              title="Activity Feed"
            >
              <Bell className="w-4 h-4" />
              {activities.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900/95 border border-slate-800 shadow-2xl p-4 z-50 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Club Live Activity
                  </h4>
                  <span className="text-[10px] text-slate-400">{activities.length} updates</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2.5 mt-3 pr-1">
                  {activities.map((act) => (
                    <div key={act.id} className="text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0" />
                      <div>
                        <p className="text-slate-200 text-xs leading-relaxed">{act.text}</p>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill / Menu */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                    {currentUser.name}
                    {currentUser.role === 'Technical Head' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900/95 border border-slate-800 shadow-2xl p-3 z-50 backdrop-blur-xl">
                  {/* Member info card */}
                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{currentUser.name}</p>
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium border ${currentUser.badgeColor} mt-0.5`}>
                          {currentUser.role}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                      <span>My Pending Tasks:</span>
                      <span className="text-indigo-300 font-bold">{pendingTasksCount}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
