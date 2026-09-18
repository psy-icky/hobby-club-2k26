import React, { useState } from 'react';
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Trash2, 
  FileText, 
  ShieldCheck,
  Settings
} from 'lucide-react';
import { useClubData } from '../context/ClubDataContext';
import { useAuth } from '../context/AuthContext';
import { 
  generateGoogleCalendarUrl, 
  downloadIcsFile, 
  getRealInstantMeetUrl 
} from '../utils/googleMeet';

export const MeetingsPage = ({ onOpenMeetingModal }) => {
  const { meetings, deleteMeeting, updateMeetingNotes } = useClubData();
  const { currentUser, clubSettings, updateClubSettings } = useAuth();

  const [copiedMeetId, setCopiedMeetId] = useState(null);
  const [activeNotesMeetId, setActiveNotesMeetId] = useState(null);
  const [tempNotes, setTempNotes] = useState('');
  const [isEditingPermanentMeet, setIsEditingPermanentMeet] = useState(false);
  const [permMeetUrlInput, setPermMeetUrlInput] = useState(clubSettings.permanentMeetUrl || '');

  const handleCopyLink = (meetUrl, id) => {
    navigator.clipboard.writeText(meetUrl);
    setCopiedMeetId(id);
    setTimeout(() => setCopiedMeetId(null), 2000);
  };

  const handleOpenNotes = (meeting) => {
    setActiveNotesMeetId(meeting.id);
    setTempNotes(meeting.notes || '');
  };

  const handleSaveNotes = (id) => {
    updateMeetingNotes(id, tempNotes);
    setActiveNotesMeetId(null);
  };

  const handleStartRealInstantMeet = () => {
    window.open(getRealInstantMeetUrl(), '_blank');
  };

  const handleSavePermanentMeet = () => {
    updateClubSettings({ permanentMeetUrl: permMeetUrlInput.trim() });
    setIsEditingPermanentMeet(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-black text-white flex items-center gap-2.5">
            <Video className="w-6 h-6 text-cyan-400" />
            Google Meet Virtual Assembly Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conduct live, real-time Google Meet sessions for Hobby Club 2k26 executive council.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleStartRealInstantMeet}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Google Meet</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          <button
            onClick={onOpenMeetingModal}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Integration Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border border-cyan-500/30 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Live Google Meet Assembly System
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Managed by Technical Head Smit Barmate • Instant HD Video Conferencing
              </p>
            </div>
          </div>
        </div>

        {/* Permanent Meeting Room Config */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Video className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-400 text-xs">Official Permanent Room:</span>
            {isEditingPermanentMeet ? (
              <input
                type="text"
                value={permMeetUrlInput}
                onChange={(e) => setPermMeetUrlInput(e.target.value)}
                placeholder="https://meet.google.com/xxx-yyyy-zzz"
                className="px-2 py-1 rounded bg-slate-900 border border-cyan-500/50 text-cyan-300 font-mono text-xs focus:outline-none"
              />
            ) : (
              <a
                href={clubSettings.permanentMeetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 font-mono text-xs hover:underline truncate max-w-xs"
              >
                {clubSettings.permanentMeetUrl}
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isEditingPermanentMeet ? (
              <>
                <button
                  onClick={() => setIsEditingPermanentMeet(false)}
                  className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePermanentMeet}
                  className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                >
                  Save Link
                </button>
              </>
            ) : (
              <>
                {currentUser?.id === 'smit-barmate' || currentUser?.role === 'President' ? (
                  <button
                    onClick={() => setIsEditingPermanentMeet(true)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 text-xs flex items-center gap-1"
                    title="Change permanent room URL"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Change Link</span>
                  </button>
                ) : null}

                <a
                  href={clubSettings.permanentMeetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5 text-xs transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Official Room</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No meetings currently scheduled. Click "Schedule Meeting" or "Launch Google Meet" above.
          </div>
        ) : (
          meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 transition-all space-y-4 shadow-xl"
            >
              {/* Meeting Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      meeting.status === 'Ongoing'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {meeting.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {meeting.date}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> {meeting.startTime} {meeting.endTime ? `- ${meeting.endTime}` : ''}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {meeting.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(meeting.meetUrl, meeting.id)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                    title="Copy Google Meet URL"
                  >
                    {copiedMeetId === meeting.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px] font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px]">Copy Link</span>
                      </>
                    )}
                  </button>

                  <a
                    href={meeting.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Google Meet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => deleteMeeting(meeting.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete meeting"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Meeting Details Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* Left Description & Agenda */}
                <div className="md:col-span-2 space-y-3">
                  {meeting.description && (
                    <p className="text-slate-300 leading-relaxed">
                      {meeting.description}
                    </p>
                  )}

                  {meeting.agenda && meeting.agenda.length > 0 && (
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Meeting Agenda & Discussion Topics
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {meeting.agenda.map((ag, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-200 text-xs">
                            <span className="w-4 h-4 rounded-full bg-slate-800 text-[9px] flex items-center justify-center font-bold text-cyan-400 shrink-0">
                              {idx + 1}
                            </span>
                            <span className="truncate">{ag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meeting Notes section */}
                  <div>
                    {activeNotesMeetId === meeting.id ? (
                      <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <label className="text-[11px] font-bold text-slate-300">
                          Edit Meeting Minutes & Action Items:
                        </label>
                        <textarea
                          rows={3}
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Type notes, decisions, follow-ups..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveNotesMeetId(null)}
                            className="px-3 py-1 rounded text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(meeting.id)}
                            className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                          >
                            Save Notes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[11px] text-slate-400">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate italic">
                            {meeting.notes ? `Minutes: "${meeting.notes}"` : 'No meeting notes recorded yet.'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleOpenNotes(meeting)}
                          className="text-indigo-400 hover:text-indigo-300 font-semibold shrink-0 ml-2"
                        >
                          {meeting.notes ? 'Edit Minutes' : '+ Add Minutes'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Host & Calendar Integrations */}
                <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Host Lead
                    </span>

                    <div className="text-xs">
                      <span className="font-semibold text-white">{meeting.hostName || 'Technical Head'}</span>
                      <span className="block text-[10px] text-cyan-400">{meeting.hostRole || 'Technical Council'}</span>
                    </div>

                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px]">Google Meet Video Link:</span>
                      <a
                        href={meeting.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 font-mono text-[11px] hover:underline truncate block"
                      >
                        {meeting.meetUrl}
                      </a>
                    </div>
                  </div>

                  {/* Calendar Export Buttons */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <a
                      href={generateGoogleCalendarUrl(meeting)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Add to Google Calendar</span>
                    </a>

                    <button
                      onClick={() => downloadIcsFile(meeting)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800/60 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>Download .ics Calendar Invite</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
