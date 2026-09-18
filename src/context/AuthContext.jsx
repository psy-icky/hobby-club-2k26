import React, { createContext, useContext, useState, useEffect } from 'react';
import { MEMBERS } from '../data/members';

const AuthContext = createContext();

const STORAGE_KEY = 'hobby_club_2k26_current_user';
const PASSWORDS_KEY = 'hobby_club_2k26_custom_passwords';
const SETTINGS_KEY = 'hobby_club_2k26_settings';

export const AuthProvider = ({ children }) => {
  // Passwords store to allow updating passwords
  const [passwords, setPasswords] = useState(() => {
    try {
      const saved = localStorage.getItem(PASSWORDS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Settings store (e.g. permanent Google Meet link)
  const [clubSettings, setClubSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved) : {
        permanentMeetUrl: 'https://meet.google.com/new?authuser=smitbarmate15@gmail.com',
        hostEmail: 'smitbarmate15@gmail.com',
      };
    } catch {
      return {
        permanentMeetUrl: 'https://meet.google.com/new?authuser=smitbarmate15@gmail.com',
        hostEmail: 'smitbarmate15@gmail.com',
      };
    }
  });

  // Start with null by default, only retrieve if explicitly saved in this browser session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const member = MEMBERS.find(m => m.id === parsed.id);
        if (member) return member;
      }
    } catch (e) {
      console.error('Failed to retrieve user session', e);
    }
    return null; // Require login first!
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  }, [passwords]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(clubSettings));
  }, [clubSettings]);

  const login = (identifier, password) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Find member by username or email
    const member = MEMBERS.find(
      m => (m.username.toLowerCase() === cleanId || m.email.toLowerCase() === cleanId)
    );

    if (!member) {
      return { 
        success: false, 
        error: 'Access Denied: This username or email is not in the authorized Hobby Club 2k26 roster.' 
      };
    }

    // Check custom password or default password
    const validPassword = passwords[member.id] || member.password;

    if (cleanPass !== validPassword) {
      return { 
        success: false, 
        error: 'Incorrect password. Please verify your credentials or contact Technical Head Smit Barmate.' 
      };
    }

    setCurrentUser(member);
    return { success: true, member };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const changePassword = (memberId, newPassword) => {
    setPasswords(prev => ({
      ...prev,
      [memberId]: newPassword
    }));
    return true;
  };

  const updateClubSettings = (newSettings) => {
    setClubSettings(prev => ({ ...prev, ...newSettings }));
  };

  const switchUser = (memberId) => {
    const member = MEMBERS.find(m => m.id === memberId);
    if (member) {
      setCurrentUser(member);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchUser,
        changePassword,
        passwords,
        clubSettings,
        updateClubSettings,
        allMembers: MEMBERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
