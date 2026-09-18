import React, { useState } from 'react';
import { 
  X, 
  Video, 
  Calendar, 
  Clock, 
  Link as LinkIcon, 
  Plus, 
  Trash2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { MEMBERS } from '../data/members';
import { useClubData } from '../context/ClubDataContext';
import { useAuth } from '../context/AuthContext';
import { formatMeetUrl, getRealInstantMeetUrl } from '../utils/googleMeet';

export const MeetingModal = ({ isOpen, onClose }) => {
  const { addMeeting } = useClubData();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customMeetUrl, setCustomMeetUrl] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:00');
  const [attendees, setAttendees] = useState(['all']);
  const [agendaItems, setAgendaItems] = useState([
    'Review progress of 2k26 event deliverables',
    'Technical updates from Smit Barmate'
  ]);
  const [newAgendaItem, setNewAgendaItem] = useState('');

  if (!isOpen) return null;

  const handleAddAgenda = () => {
    if (!newAgendaItem.trim()) return;
    setAgendaItems([...agendaItems, newAgendaItem.trim()]);
    setNewAgendaItem('');
  };

  const handleRemoveAgenda = (index) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index));
  };

  const handleOpenGoogleMeetToCreateRoom = () => {
    window.open(getRealInstantMeetUrl(), '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalMeetUrl = customMeetUrl.trim() ? formatMeetUrl(customMeetUrl) : getRealInstantMeetUrl();

    addMeeting({
      title,
      description,
      meetCode: finalMeetUrl.replace('https://meet.google.com/', ''),
      meetUrl: finalMeetUrl,
      date,
      startTime,
      endTime,
      attendees,
      agenda: agendaItems
    }, currentUser);

    setTitle('');
    setDescription('');
    setCustomMeetUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Schedule Google Meet Session
              </h3>
              <p className="text-xs text-slate-400">
                Host: <span className="text-cyan-400 font-semibold">{currentUser?.name || 'Technical Head'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Meeting Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hobby Club 2k26 Executive Standup & Event Planning"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Real Google Meet Linking Box */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                Google Meet Video Link
              </span>
              <button
                type="button"
                onClick={handleOpenGoogleMeetToCreateRoom}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1 transition-all"
              >
                <Sparkles className="w-3 h-3" />
                <span>Launch Google Meet Room</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div>
              <input
                type="text"
                value={customMeetUrl}
                onChange={(e) => setCustomMeetUrl(e.target.value)}
                placeholder="Paste Google Meet URL (e.g. https://meet.google.com/abc-defg-hij) or leave blank"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Agenda & Notes
            </label>
            <div className="space-y-1.5 mb-2">
              {agendaItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  <span className="flex items-center gap-2 truncate">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-[9px] flex items-center justify-center font-bold text-cyan-400">
                      {idx + 1}
                    </span>
                    <span className="truncate">{item}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAgenda(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAgendaItem}
                onChange={(e) => setNewAgendaItem(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAgenda(); } }}
                placeholder="Add agenda topic..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddAgenda}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              Save & Schedule Meeting
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
