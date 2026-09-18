import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { INITIAL_TASKS, INITIAL_MEETINGS, INITIAL_CHANNELS, INITIAL_MESSAGES } from '../data/members';
import { generateMeetCode, createMeetUrl } from '../utils/googleMeet';

const ClubDataContext = createContext();

export const ClubDataProvider = ({ children }) => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [channels] = useState(INITIAL_CHANNELS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [files, setFiles] = useState([
    {
      id: 'file-1',
      title: 'Auditorium Sound System & Stage Lighting Advance Receipt',
      category: 'Bill',
      amount: '14,500',
      uploaderId: 'harshad-sahani',
      uploaderName: 'Harshad Sahani (Treasurer)',
      date: '2026-09-17',
      fileType: 'image',
      fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      fileName: 'sound_stage_invoice_001.jpg',
      fileSize: '1.2 MB',
      notes: 'Advance 50% paid for opening day sound equipment.'
    }
  ]);
  const [activities, setActivities] = useState([
    { id: 'act-1', text: 'Real-time synchronization active across all devices.', time: 'Just now', type: 'system' }
  ]);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);

  // Initialize Socket.io connection to backend
  useEffect(() => {
    const serverHost = window.location.hostname || 'localhost';
    const socketUrl = `http://${serverHost}:5000`;

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      timeout: 5000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('⚡ Connected to Hobby Club Realtime Sync Server:', socketUrl);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('⚠️ Disconnected from Realtime Sync Server');
      setIsConnected(false);
    });

    // Receive initial synced state from server
    socket.on('initial:data', (db) => {
      if (db.tasks && db.tasks.length > 0) setTasks(db.tasks);
      if (db.meetings && db.meetings.length > 0) setMeetings(db.meetings);
      if (db.messages && db.messages.length > 0) setMessages(db.messages);
      if (db.files && db.files.length > 0) setFiles(db.files);
      if (db.activities && db.activities.length > 0) setActivities(db.activities);
    });

    // Real-time Chat
    socket.on('chat:new_message', (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    socket.on('chat:reaction_updated', ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, reactions } : msg))
      );
    });

    // Real-time File Uploads
    socket.on('file:uploaded', ({ file, activity }) => {
      setFiles((prev) => {
        if (prev.some((f) => f.id === file.id)) return prev;
        return [file, ...prev];
      });
      if (activity) {
        setActivities((prev) => [activity, ...prev.slice(0, 19)]);
      }
    });

    socket.on('file:deleted', (fileId) => {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    });

    // Real-time Tasks
    socket.on('task:added', ({ task, activity }) => {
      setTasks((prev) => {
        if (prev.some((t) => t.id === task.id)) return prev;
        return [task, ...prev];
      });
      if (activity) {
        setActivities((prev) => [activity, ...prev.slice(0, 19)]);
      }
    });

    socket.on('task:status_updated', ({ taskId, newStatus, activity }) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      if (activity) {
        setActivities((prev) => [activity, ...prev.slice(0, 19)]);
      }
    });

    socket.on('task:deleted', (taskId) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    });

    // Real-time Meetings
    socket.on('meeting:added', ({ meeting, activity }) => {
      setMeetings((prev) => {
        if (prev.some((m) => m.id === meeting.id)) return prev;
        return [meeting, ...prev];
      });
      if (activity) {
        setActivities((prev) => [activity, ...prev.slice(0, 19)]);
      }
    });

    socket.on('meeting:deleted', (meetingId) => {
      setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
    });

    socket.on('meeting:notes_updated', ({ meetingId, notes }) => {
      setMeetings((prev) =>
        prev.map((m) => (m.id === meetingId ? { ...m, notes } : m))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ----------------- Actions -----------------

  const uploadFile = (fileData) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('file:upload', fileData);
    } else {
      const newFile = {
        id: 'file-' + Date.now(),
        ...fileData,
        createdAt: new Date().toISOString()
      };
      setFiles((prev) => [newFile, ...prev]);
    }
  };

  const deleteFile = (fileId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('file:delete', fileId);
    } else {
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  const sendMessage = (targetId, text, senderId, isDirect = false) => {
    if (!text.trim()) return;

    const payload = {
      channelId: isDirect ? null : targetId,
      recipientId: isDirect ? targetId : null,
      senderId: senderId,
      text: text.trim()
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('chat:send', payload);
    } else {
      const newMsg = {
        id: 'msg-' + Date.now(),
        ...payload,
        timestamp: new Date().toISOString(),
        reactions: {}
      };
      setMessages((prev) => [...prev, newMsg]);
    }
  };

  const toggleReaction = (messageId, emoji, memberId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('chat:reaction', { messageId, emoji, memberId });
    } else {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;
          const reactions = { ...(msg.reactions || {}) };
          const currentReactors = reactions[emoji] || [];
          if (currentReactors.includes(memberId)) {
            reactions[emoji] = currentReactors.filter((id) => id !== memberId);
            if (reactions[emoji].length === 0) delete reactions[emoji];
          } else {
            reactions[emoji] = [...currentReactors, memberId];
          }
          return { ...msg, reactions };
        })
      );
    }
  };

  const addTask = (taskData, creatorName = 'Admin') => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('task:add', taskData);
    } else {
      const newTask = {
        id: 'task-' + Date.now(),
        ...taskData,
        createdAt: new Date().toISOString()
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const updateTaskStatus = (taskId, newStatus, memberName = 'Member') => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('task:status_change', { taskId, newStatus, memberName });
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    }
  };

  const deleteTask = (taskId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('task:delete', taskId);
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const addMeeting = (meetingData, hostMember) => {
    const meetUrl = meetingData.meetUrl || createMeetUrl(meetingData.meetCode);
    const newMeeting = {
      title: meetingData.title,
      description: meetingData.description || '',
      hostName: hostMember?.name || 'Smit Barmate',
      hostRole: hostMember?.role || 'Technical Head',
      meetCode: meetingData.meetCode || 'hby-club-2k26',
      meetUrl: meetUrl,
      date: meetingData.date,
      startTime: meetingData.startTime,
      endTime: meetingData.endTime || meetingData.startTime,
      status: 'Upcoming',
      attendees: meetingData.attendees || ['all'],
      agenda: meetingData.agenda || [],
      notes: meetingData.notes || ''
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('meeting:add', newMeeting);
    } else {
      setMeetings((prev) => [{ ...newMeeting, id: 'meet-' + Date.now() }, ...prev]);
    }
  };

  const createInstantMeeting = (hostMember, customTopic) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    const instantMeeting = {
      title: customTopic || `Hobby Club 2k26 Instant Sync (${timeStr})`,
      description: 'Instant Google Meet session initiated via Hobby Club 2k26 Dashboard.',
      hostName: hostMember?.name || 'Smit Barmate',
      hostRole: hostMember?.role || 'Technical Head',
      meetCode: 'instant-meet',
      meetUrl: `https://meet.google.com/new`,
      date: dateStr,
      startTime: timeStr,
      endTime: timeStr,
      status: 'Ongoing',
      attendees: ['all'],
      agenda: ['Live team sync & problem solving'],
      notes: 'Instant Google Meet room live now.'
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('meeting:add', instantMeeting);
    } else {
      setMeetings((prev) => [{ ...instantMeeting, id: 'meet-' + Date.now() }, ...prev]);
    }

    return instantMeeting;
  };

  const deleteMeeting = (meetingId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('meeting:delete', meetingId);
    } else {
      setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
    }
  };

  const updateMeetingNotes = (meetingId, notes) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('meeting:notes', { meetingId, notes });
    } else {
      setMeetings((prev) =>
        prev.map((m) => (m.id === meetingId ? { ...m, notes } : m))
      );
    }
  };

  return (
    <ClubDataContext.Provider
      value={{
        tasks,
        addTask,
        updateTaskStatus,
        deleteTask,
        meetings,
        addMeeting,
        createInstantMeeting,
        deleteMeeting,
        updateMeetingNotes,
        files,
        uploadFile,
        deleteFile,
        channels,
        messages,
        sendMessage,
        toggleReaction,
        activities,
        isConnected
      }}
    >
      {children}
    </ClubDataContext.Provider>
  );
};

export const useClubData = () => {
  const context = useContext(ClubDataContext);
  if (!context) {
    throw new Error('useClubData must be used within a ClubDataProvider');
  }
  return context;
};
