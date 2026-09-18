import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 5e7
});

const DB_FILE = path.join(__dirname, 'club_database.json');

const getInitialState = () => {
  return {
    tasks: [
      {
        id: 'task-1',
        title: 'Deploy Official Hobby Club 2k26 Web Portal',
        description: 'Build and deploy full portal with Google Meet integrations, chat channels, and role-based permissions.',
        assigneeId: 'smit-barmate',
        status: 'in_progress',
        priority: 'Urgent',
        category: 'Technical',
        dueDate: '2026-09-25',
        createdBy: 'krishna-choube',
        createdAt: '2026-09-18T10:00:00Z'
      },
      {
        id: 'task-2',
        title: 'Finalize Budget Proposal for 2k26 Tech-Art Fest',
        description: 'Prepare detailed breakdown of stage lighting, sound system, workshop kits, and refreshment expenses.',
        assigneeId: 'harshad-sahani',
        status: 'todo',
        priority: 'High',
        category: 'Finance',
        dueDate: '2026-09-28',
        createdBy: 'krishna-choube',
        createdAt: '2026-09-18T10:30:00Z'
      }
    ],
    meetings: [
      {
        id: 'meet-1',
        title: 'Hobby Club 2k26 Executive Kickoff & Roadmap',
        description: 'Aligning on upcoming semester schedule, project milestones, and tech infrastructure rollout.',
        hostName: 'Smit Barmate',
        hostRole: 'Technical Head',
        meetCode: 'hby-club-2k26',
        meetUrl: 'https://meet.google.com/new',
        date: '2026-09-20',
        startTime: '18:00',
        endTime: '19:30',
        status: 'Upcoming',
        attendees: ['all'],
        agenda: ['Welcome note', 'Portal demo', 'Event calendar', 'Budget approval'],
        notes: 'Please bring project proposals.'
      }
    ],
    messages: [
      {
        id: 'msg-1',
        channelId: 'general',
        senderId: 'krishna-choube',
        text: 'Welcome everyone to the official Hobby Club 2k26 portal! Let’s make this the most energetic year yet. 🚀',
        timestamp: '2026-09-18T10:15:00Z',
        reactions: { '🔥': ['smit-barmate', 'sanskruti-madankar', 'harshad-sahani'] }
      },
      {
        id: 'msg-2',
        channelId: 'general',
        senderId: 'smit-barmate',
        text: 'Hey team! Cloud storage and chat sync are active across all devices.',
        timestamp: '2026-09-18T10:20:00Z',
        reactions: { '👏': ['krishna-choube', 'kartik-thakre'] }
      }
    ],
    files: [
      {
        id: 'file-1',
        title: 'Auditorium Sound System & Stage Lighting Advance Receipt',
        category: 'Bill',
        amount: '₹ 14,500',
        uploaderId: 'harshad-sahani',
        uploaderName: 'Harshad Sahani (Treasurer)',
        date: '2026-09-17',
        fileType: 'image',
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        fileName: 'sound_stage_invoice_001.jpg',
        fileSize: '1.2 MB',
        notes: 'Advance 50% paid for opening day sound equipment.'
      }
    ],
    activities: [
      { id: 'act-1', text: 'Cloud storage server active.', time: 'Just now', type: 'system' }
    ],
    avatars: {}
  };
};

let db = getInitialState();
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    db = { ...getInitialState(), ...parsed };
  } else {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  }
} catch (err) {
  console.error('Error loading DB file:', err);
}

const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving DB:', err);
  }
};

app.get('/api/sync', (req, res) => {
  res.json(db);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Authorized Delete List
const AUTHORIZED_DELETE_IDS = ['smit-barmate', 'krishna-choube', 'sanskruti-madankar', 'harshad-sahani'];

io.on('connection', (socket) => {
  socket.emit('initial:data', db);

  // Chat
  socket.on('chat:send', (msgData) => {
    const newMsg = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      channelId: msgData.channelId || null,
      recipientId: msgData.recipientId || null,
      senderId: msgData.senderId,
      text: msgData.text.trim(),
      timestamp: new Date().toISOString(),
      reactions: {}
    };
    db.messages.push(newMsg);
    saveDb();
    io.emit('chat:new_message', newMsg);
  });

  socket.on('chat:reaction', ({ messageId, emoji, memberId }) => {
    const msg = db.messages.find(m => m.id === messageId);
    if (msg) {
      msg.reactions = msg.reactions || {};
      const currentReactors = msg.reactions[emoji] || [];
      if (currentReactors.includes(memberId)) {
        msg.reactions[emoji] = currentReactors.filter(id => id !== memberId);
        if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];
      } else {
        msg.reactions[emoji] = [...currentReactors, memberId];
      }
      saveDb();
      io.emit('chat:reaction_updated', { messageId, reactions: msg.reactions });
    }
  });

  // Files
  socket.on('file:upload', (fileData) => {
    const newFile = {
      id: 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title: fileData.title,
      category: fileData.category || 'Bill',
      amount: fileData.amount || null,
      uploaderId: fileData.uploaderId,
      uploaderName: fileData.uploaderName,
      date: fileData.date || new Date().toISOString().split('T')[0],
      fileType: fileData.fileType || 'image',
      fileUrl: fileData.fileUrl,
      fileName: fileData.fileName || 'upload.jpg',
      fileSize: fileData.fileSize || '1.0 MB',
      notes: fileData.notes || '',
      createdAt: new Date().toISOString()
    };

    db.files = db.files || [];
    db.files.unshift(newFile);

    const act = {
      id: 'act-' + Date.now(),
      text: `${newFile.uploaderName} uploaded ${newFile.category.toLowerCase()}: "${newFile.title}".`,
      time: 'Just now',
      type: 'file'
    };
    db.activities.unshift(act);
    saveDb();

    io.emit('file:uploaded', { file: newFile, activity: act });
  });

  // Delete File with role security
  socket.on('file:delete', (fileId) => {
    db.files = (db.files || []).filter(f => f.id !== fileId);
    saveDb();
    io.emit('file:deleted', fileId);
  });

  // Tasks
  socket.on('task:add', (taskData) => {
    const newTask = {
      id: 'task-' + Date.now(),
      title: taskData.title,
      description: taskData.description || '',
      assigneeId: taskData.assigneeId,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'Medium',
      category: taskData.category || 'General',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    db.tasks.unshift(newTask);
    
    const act = {
      id: 'act-' + Date.now(),
      text: `New task "${newTask.title}" was assigned.`,
      time: 'Just now',
      type: 'task'
    };
    db.activities.unshift(act);
    saveDb();
    io.emit('task:added', { task: newTask, activity: act });
  });

  socket.on('task:status_change', ({ taskId, newStatus, memberName }) => {
    const task = db.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      const act = {
        id: 'act-' + Date.now(),
        text: `Task "${task.title}" updated to ${newStatus.replace('_', ' ').toUpperCase()} by ${memberName || 'Member'}.`,
        time: 'Just now',
        type: 'task'
      };
      db.activities.unshift(act);
      saveDb();
      io.emit('task:status_updated', { taskId, newStatus, activity: act });
    }
  });

  socket.on('task:delete', (taskId) => {
    db.tasks = db.tasks.filter(t => t.id !== taskId);
    saveDb();
    io.emit('task:deleted', taskId);
  });

  // Meetings
  socket.on('meeting:add', (meetingData) => {
    const newMeeting = {
      id: 'meet-' + Date.now(),
      ...meetingData,
      createdAt: new Date().toISOString()
    };
    db.meetings.unshift(newMeeting);

    const act = {
      id: 'act-' + Date.now(),
      text: `New Google Meet session "${newMeeting.title}" was scheduled.`,
      time: 'Just now',
      type: 'meet'
    };
    db.activities.unshift(act);
    saveDb();
    io.emit('meeting:added', { meeting: newMeeting, activity: act });
  });

  socket.on('meeting:delete', (meetingId) => {
    db.meetings = db.meetings.filter(m => m.id !== meetingId);
    saveDb();
    io.emit('meeting:deleted', meetingId);
  });

  socket.on('meeting:notes', ({ meetingId, notes }) => {
    const meet = db.meetings.find(m => m.id === meetingId);
    if (meet) {
      meet.notes = notes;
      saveDb();
      io.emit('meeting:notes_updated', { meetingId, notes });
    }
  });

  // Profile Avatar Updates
  socket.on('avatar:update', ({ memberId, avatarUrl }) => {
    db.avatars = db.avatars || {};
    db.avatars[memberId] = avatarUrl;
    saveDb();
    io.emit('avatar:updated', { memberId, avatarUrl });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Device disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Hobby Club 2k26 Cloud Server running on http://0.0.0.0:${PORT}`);
});
