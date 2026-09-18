import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Hash, 
  ShieldCheck, 
  Users, 
  Smile, 
  Search, 
  Sparkles,
  Paperclip,
  CheckCheck
} from 'lucide-react';
import { useClubData } from '../context/ClubDataContext';
import { useAuth } from '../context/AuthContext';
import { MEMBERS, INITIAL_CHANNELS } from '../data/members';

export const ChatPage = () => {
  const { messages, sendMessage, toggleReaction } = useClubData();
  const { currentUser } = useAuth();

  const [activeType, setActiveType] = useState('channel'); // 'channel' | 'dm'
  const [activeTargetId, setActiveTargetId] = useState('general');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);

  // Filter messages for current channel or DM
  const currentMessages = messages.filter(msg => {
    if (activeType === 'channel') {
      return msg.channelId === activeTargetId;
    } else {
      // Direct message between currentUser and activeTargetId
      return (
        (msg.senderId === currentUser?.id && msg.recipientId === activeTargetId) ||
        (msg.senderId === activeTargetId && msg.recipientId === currentUser?.id)
      );
    }
  }).filter(msg => {
    if (!searchQuery.trim()) return true;
    return msg.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeChannel = INITIAL_CHANNELS.find(c => c.id === activeTargetId);
  const activeDmUser = MEMBERS.find(m => m.id === activeTargetId);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, activeTargetId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(
      activeTargetId,
      inputText,
      currentUser?.id || 'smit-barmate',
      activeType === 'dm'
    );

    setInputText('');
    setShowEmojiPicker(false);
  };

  const quickEmojis = ['🔥', '🚀', '❤️', '👏', '👍', '💯', '✨', '⚡'];

  const addEmojiToInput = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex rounded-2xl glass-card border border-slate-800 overflow-hidden">
      
      {/* Left Chat Sidebar (Channels & 12 Members DMs) */}
      <div className="w-64 sm:w-72 bg-slate-950/80 border-r border-slate-800 flex flex-col shrink-0">
        
        {/* Search header */}
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat history..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Channels & DMs List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          
          {/* Discussion Channels */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-2 block mb-1.5">
              Club Channels
            </span>
            <div className="space-y-1">
              {INITIAL_CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveType('channel');
                    setActiveTargetId(ch.id);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeType === 'channel' && activeTargetId === ch.id
                      ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{ch.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages (12 Council Members) */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Direct Messages
              </span>
              <span className="text-[10px] text-slate-500">12 Members</span>
            </div>
            
            <div className="space-y-1">
              {MEMBERS.map(m => {
                const isMe = m.id === currentUser?.id;
                const isSelected = activeType === 'dm' && activeTargetId === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveType('dm');
                      setActiveTargetId(m.id);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="relative shrink-0">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-800"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-950"></span>
                      </div>
                      <span className="truncate font-medium">
                        {m.name} {isMe && '(You)'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Right Chat Main Feed */}
      <div className="flex-1 flex flex-col bg-slate-900/40">
        
        {/* Chat Feed Header */}
        <div className="p-3.5 px-5 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeType === 'channel' ? (
              <>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    #{activeChannel?.name}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {activeChannel?.description}
                  </p>
                </div>
              </>
            ) : (
              <>
                <img
                  src={activeDmUser?.avatar}
                  alt={activeDmUser?.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700"
                />
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                    {activeDmUser?.name}
                    <span className="text-[10px] font-normal text-emerald-400">• Online</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {activeDmUser?.role} ({activeDmUser?.email})
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <MessageSquare className="w-8 h-8 mb-2 opacity-40 text-indigo-400" />
              <p className="text-xs font-semibold text-slate-400">No messages in this conversation yet</p>
              <p className="text-[11px] text-slate-500 mt-1">Start the conversation with your team!</p>
            </div>
          ) : (
            currentMessages.map(msg => {
              const sender = MEMBERS.find(m => m.id === msg.senderId);
              const isMe = msg.senderId === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-xs ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <img
                    src={sender?.avatar}
                    alt={sender?.name}
                    className="w-8 h-8 rounded-xl object-cover shrink-0 ring-1 ring-slate-700 mt-0.5"
                  />

                  <div className={`space-y-1 max-w-[80%] ${isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                    {/* Header */}
                    <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className="font-bold text-white text-xs">{sender?.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Bubble */}
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed inline-block ${
                        isMe
                          ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Reactions */}
                    <div className={`flex items-center gap-1.5 mt-1 flex-wrap ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {Object.entries(msg.reactions || {}).map(([emoji, reactors]) => (
                        <button
                          key={emoji}
                          onClick={() => toggleReaction(msg.id, emoji, currentUser?.id)}
                          className={`text-[11px] px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                            reactors.includes(currentUser?.id)
                              ? 'bg-indigo-500/20 border-indigo-500/40 text-white'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="text-[10px] font-bold">{reactors.length}</span>
                        </button>
                      ))}

                      {/* Add quick reaction button */}
                      <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                        {['🔥', '🚀', '❤️', '👍'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => toggleReaction(msg.id, emoji, currentUser?.id)}
                            className="p-1 rounded hover:bg-slate-800 text-[11px]"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800">
          
          {/* Quick emoji ribbon */}
          {showEmojiPicker && (
            <div className="flex items-center gap-1 pb-2 border-b border-slate-800 mb-2">
              <span className="text-[10px] text-slate-500 uppercase mr-1">Quick:</span>
              {quickEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmojiToInput(emoji)}
                  className="p-1 hover:bg-slate-800 rounded text-sm transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="Insert Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${activeType === 'channel' ? activeChannel?.name : activeDmUser?.name}...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all shadow-md shadow-indigo-600/20 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
