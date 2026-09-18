import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Camera, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateAvatar, allMembers } = useAuth();
  const [previewUrl, setPreviewUrl] = useState(currentUser?.avatar || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen || !currentUser) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      setPreviewUrl(loadEvt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefault = () => {
    const defaultUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=6366f1&color=ffffff&bold=true&size=150`;
    setPreviewUrl(defaultUrl);
  };

  const handleSave = () => {
    if (previewUrl) {
      updateAvatar(currentUser.id, previewUrl);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Customize Profile Photo
              </h3>
              <p className="text-xs text-slate-400">
                Upload your real photo from your phone or PC
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

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Avatar Preview & Upload Area */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img
                src={previewUrl || currentUser.avatar}
                alt={currentUser.name}
                className="w-28 h-28 rounded-3xl object-cover ring-4 ring-slate-800 group-hover:ring-indigo-500 shadow-2xl transition-all"
              />
              <div className="absolute inset-0 rounded-3xl bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1">
                <Camera className="w-6 h-6 text-indigo-400" />
                <span>Upload</span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="text-center">
              <h4 className="font-bold text-white text-sm">{currentUser.name}</h4>
              <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full border ${currentUser.badgeColor} mt-1 font-medium`}>
                {currentUser.role}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Choose Photo</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1 border border-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Initials</span>
              </button>
            </div>
          </div>

          {/* Member Details Read-only card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Council Designation:</span>
              <strong className="text-slate-200">{currentUser.role}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Council Level:</span>
              <span className="text-slate-300 font-medium">{currentUser.level}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Username:</span>
              <code className="text-indigo-400 font-mono">{currentUser.username}</code>
            </div>
          </div>

          {/* Footer save buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Profile Photo</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
