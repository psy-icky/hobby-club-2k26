import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Trash2, 
  ChevronRight, 
  LayoutGrid, 
  List,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useClubData } from '../context/ClubDataContext';
import { useAuth } from '../context/AuthContext';

export const TasksPage = ({ onOpenTaskModal }) => {
  const { tasks, updateTaskStatus, deleteTask } = useClubData();
  const { currentUser, allMembers } = useAuth();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-slate-700', bg: 'bg-slate-900/40', badge: 'bg-slate-800 text-slate-300' },
    { id: 'in_progress', title: 'In Progress', color: 'border-blue-500/40', bg: 'bg-blue-950/20', badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
    { id: 'in_review', title: 'Under Review', color: 'border-amber-500/40', bg: 'bg-amber-950/20', badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
    { id: 'done', title: 'Completed', color: 'border-emerald-500/40', bg: 'bg-emerald-950/20', badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' }
  ];

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filterAssignee === 'me' && task.assigneeId !== currentUser?.id) return false;
    if (filterAssignee !== 'all' && filterAssignee !== 'me' && task.assigneeId !== filterAssignee) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const assigneeName = allMembers.find(m => m.id === task.assigneeId)?.name.toLowerCase() || '';
      if (!matchTitle && !matchDesc && !assigneeName.includes(q)) return false;
    }
    return true;
  });

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus, currentUser?.name);
    if (newStatus === 'done') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {}
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'High': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Medium': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-black text-white flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            Task Management & Delegation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Assign and monitor club deliverables across all 12 executive members.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* View switcher */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <button
            onClick={onOpenTaskModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search task title, description or member..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Member filter */}
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Assignee: All (12 Members)</option>
            <option value="me">Assigned to Me ({currentUser?.name})</option>
            {allMembers.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Priority: All</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Category: All</option>
            <option value="Technical">Technical</option>
            <option value="Event">Event</option>
            <option value="Finance">Finance</option>
            <option value="Organization">Organization</option>
            <option value="Creative">Creative</option>
            <option value="Operations">Operations</option>
          </select>

        </div>
      </div>

      {/* Task Views */}
      {viewMode === 'kanban' ? (
        /* Kanban Columns View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                className={`rounded-2xl border ${col.color} ${col.bg} p-4 flex flex-col min-h-[500px]`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    {col.title}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${col.badge}`}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-800/80 rounded-xl">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map(task => {
                      const assignee = allMembers.find(m => m.id === task.assigneeId);
                      return (
                        <div
                          key={task.id}
                          className="glass-card rounded-xl p-3.5 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2.5 shadow-lg group relative"
                        >
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityStyle(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                              {task.category}
                            </span>
                          </div>

                          {/* Task Title */}
                          <h4 className="text-xs font-bold text-white leading-snug">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Assignee & Due Date */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {assignee && (
                                <img
                                  src={assignee.avatar}
                                  alt={assignee.name}
                                  title={`${assignee.name} (${assignee.role})`}
                                  className="w-5 h-5 rounded-md object-cover ring-1 ring-slate-700 shrink-0"
                                />
                              )}
                              <span className="text-[11px] text-slate-300 font-medium truncate">
                                {assignee?.name.split(' ')[0]}
                              </span>
                            </div>

                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3" /> {task.dueDate}
                            </span>
                          </div>

                          {/* Status Shift Selector & Actions */}
                          <div className="pt-2 flex items-center justify-between gap-1 text-[11px]">
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] focus:outline-none focus:border-indigo-500"
                            >
                              <option value="todo">Move to To Do</option>
                              <option value="in_progress">Move to In Progress</option>
                              <option value="in_review">Move to In Review</option>
                              <option value="done">Move to Completed</option>
                            </select>

                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-3.5 pl-5">Task Details</th>
                  <th className="p-3.5">Assigned To</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No tasks found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map(task => {
                    const assignee = allMembers.find(m => m.id === task.assigneeId);
                    return (
                      <tr key={task.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3.5 pl-5">
                          <div className="font-bold text-white">{task.title}</div>
                          {task.description && (
                            <div className="text-[11px] text-slate-400 line-clamp-1">{task.description}</div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            {assignee && (
                              <img src={assignee.avatar} alt={assignee.name} className="w-6 h-6 rounded-md object-cover" />
                            )}
                            <div>
                              <div className="font-semibold text-slate-200">{assignee?.name}</div>
                              <div className="text-[10px] text-slate-400">{assignee?.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400 font-medium">
                          {task.category}
                        </td>
                        <td className="p-3.5 font-mono text-slate-400">
                          {task.dueDate}
                        </td>
                        <td className="p-3.5">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="in_review">In Review</option>
                            <option value="done">Completed</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right pr-5">
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
