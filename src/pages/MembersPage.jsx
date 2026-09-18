import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckSquare, 
  MessageSquare, 
  Sparkles, 
  Plus, 
  ExternalLink 
} from 'lucide-react';
import { MEMBERS } from '../data/members';
import { useClubData } from '../context/ClubDataContext';
import { useAuth } from '../context/AuthContext';

export const MembersPage = ({ setCurrentTab, onOpenTaskModal }) => {
  const { tasks } = useClubData();
  const { currentUser } = useAuth();
  const [filterLevel, setFilterLevel] = useState('all');

  const levels = [
    { id: 'all', name: 'All Council (12)' },
    { id: 'Core Council', name: 'Core Council' },
    { id: 'Operations', name: 'Operations & Events' },
    { id: 'Executive Body', name: 'Executive Body' }
  ];

  const filteredMembers = filterLevel === 'all' 
    ? MEMBERS 
    : MEMBERS.filter(m => m.level === filterLevel);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-black text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-400" />
            Executive Council Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official 12-member governing roster for Hobby Club 2k26.
          </p>
        </div>

        {/* Level filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
          {levels.map(lvl => (
            <button
              key={lvl.id}
              onClick={() => setFilterLevel(lvl.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterLevel === lvl.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 12 Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => {
          const isCurrentUser = member.id === currentUser?.id;
          const memberTasks = tasks.filter(t => t.assigneeId === member.id);
          const pendingTasks = memberTasks.filter(t => t.status !== 'done');

          return (
            <div
              key={member.id}
              className={`glass-card glass-card-hover rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isCurrentUser ? 'border-indigo-500/50 bg-indigo-950/20 shadow-indigo-500/10' : 'border-slate-800'
              }`}
            >
              {/* Header with Avatar & Designation */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-700 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-950"></span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${member.badgeColor}`}>
                      {member.role}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      {member.level}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {member.name}
                    {isCurrentUser && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-normal">
                        Your Profile
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Contact card */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <a href={`mailto:${member.email}`} className="truncate hover:text-cyan-300 transition-colors">
                      {member.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </div>

              {/* Workload and Quick Action buttons */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="text-xs">
                  <span className="text-slate-400 text-[10px] block">Assigned Tasks:</span>
                  <span className="font-bold text-white">
                    {pendingTasks.length} pending <span className="text-slate-500 font-normal">({memberTasks.length} total)</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setCurrentTab('chat');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Send Direct Message"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
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
