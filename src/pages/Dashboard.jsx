import React from 'react';
import { 
  Sparkles, 
  Video, 
  CheckSquare, 
  Calendar, 
  Users, 
  ArrowRight, 
  Clock, 
  ExternalLink, 
  TrendingUp, 
  Plus, 
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClubData } from '../context/ClubDataContext';
import { generateGoogleCalendarUrl } from '../utils/googleMeet';

export const Dashboard = ({ setCurrentTab, onOpenTaskModal, onOpenMeetingModal }) => {
  const { currentUser, allMembers } = useAuth();
  const { tasks, meetings, messages, activities, createInstantMeeting, updateTaskStatus } = useClubData();

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'in_review').length;
  const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id);
  const myPendingTasks = myTasks.filter(t => t.status !== 'done');
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Next upcoming meeting
  const upcomingMeetings = [...meetings].sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`));
  const nextMeeting = upcomingMeetings[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/50 via-slate-900 to-slate-950 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hobby Club 2k26 Executive Headquarters</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{currentUser?.name}</span>! 👋
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Serving as <strong className="text-white">{currentUser?.role}</strong> ({currentUser?.level}). Manage assigned deliverables, conduct synchronized Google Meet sessions, and coordinate with all 12 committee leads.
            </p>
          </div>

          {/* Quick Action Buttons on Hero */}
          <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => createInstantMeeting(currentUser, `Hobby Club 2k26 - ${currentUser?.name} Sync`)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              <Video className="w-4 h-4" />
              <span>Instant Google Meet</span>
            </button>

            <button
              onClick={onOpenTaskModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Delegate Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: My Pending Tasks */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-display font-black text-white">{myPendingTasks.length}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {myPendingTasks.length === 0 ? 'All caught up! 🎉' : `${myTasks.length - myPendingTasks.length} completed`}
            </p>
          </div>
        </div>

        {/* Card 2: Club Tasks Progress */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Task Progress</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-display font-black text-white">{completionRate}%</div>
              <span className="text-[11px] text-slate-400">{completedTasks}/{totalTasks} Done</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Upcoming Meets */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Google Meets</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-display font-black text-white">{upcomingMeetings.length}</div>
            <p className="text-[11px] text-cyan-300/80 mt-0.5 font-medium truncate">
              {nextMeeting ? `${nextMeeting.date} @ ${nextMeeting.startTime}` : 'No upcoming meets'}
            </p>
          </div>
        </div>

        {/* Card 4: Executive Members */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Council Roster</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-display font-black text-white">{allMembers.length} Members</div>
            <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              All 12 Authorized & Active
            </p>
          </div>
        </div>

      </div>

      {/* Main Grid: Next Meeting Spotlight & Tasks Delegations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Next Scheduled Google Meet & Actionable Tasks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Spotlight: Next Scheduled Meeting */}
          {nextMeeting && (
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" /> Next Scheduled Meet
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {nextMeeting.date} • {nextMeeting.startTime} - {nextMeeting.endTime}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {nextMeeting.title}
              </h3>

              <p className="text-xs text-slate-300 mt-1.5 line-clamp-2">
                {nextMeeting.description}
              </p>

              {/* Agenda items */}
              {nextMeeting.agenda && nextMeeting.agenda.length > 0 && (
                <div className="mt-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Meeting Key Topics:
                  </span>
                  <ul className="space-y-1">
                    {nextMeeting.agenda.slice(0, 3).map((ag, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                        <span className="truncate">{ag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Meet CTA buttons */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Host:</span>
                  <span className="text-xs font-semibold text-white">{nextMeeting.hostName || 'Technical Head'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={generateGoogleCalendarUrl(nextMeeting)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Add to Calendar</span>
                  </a>

                  <a
                    href={nextMeeting.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Google Meet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Actionable Tasks Assigned to Current User */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-400" />
                  My Assigned Tasks ({myPendingTasks.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Deliverables assigned specifically to you as {currentUser?.role}
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('tasks')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>View All Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {myPendingTasks.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  🎉 No pending tasks assigned to you right now!
                </div>
              ) : (
                myPendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          task.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          task.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                          {task.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" /> Due {task.dueDate}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => updateTaskStatus(task.id, 'done', currentUser?.name)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-colors"
                      >
                        Mark Done ✓
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Col: 12 Members Presence & Quick Chat preview */}
        <div className="space-y-6">
          
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                Council Roster (12)
              </h3>
              <button
                onClick={() => setCurrentTab('members')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Directory
              </button>
            </div>

            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
              {allMembers.map((m) => {
                const isCurrent = m.id === currentUser?.id;
                const memberTasks = tasks.filter(t => t.assigneeId === m.id && t.status !== 'done').length;
                return (
                  <div
                    key={m.id}
                    className={`p-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                      isCurrent ? 'bg-indigo-950/40 border border-indigo-500/30' : 'bg-slate-950/50 hover:bg-slate-900 border border-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-950"></span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate text-xs">
                          {m.name} {isCurrent && <span className="text-[10px] text-indigo-400 font-normal">(You)</span>}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{m.role}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 shrink-0">
                      {memberTasks} tasks
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Live Channel Preview
              </h3>
              <button
                onClick={() => setCurrentTab('chat')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Open Chat
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {messages.slice(-3).map((msg) => {
                const sender = allMembers.find(m => m.id === msg.senderId);
                return (
                  <div key={msg.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-[11px]">{sender?.name || 'Member'}</span>
                      <span className="text-[9px] text-slate-500">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
