import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MEMBERS } from '../data/members';

export const LoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, switchUser, currentUser } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDemoUser, setSelectedDemoUser] = useState(null);

  if (!isLoginModalOpen) return null;

  const handleManualLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter your username/email and password.');
      return;
    }

    const result = login(identifier, password);
    if (!result.success) {
      setErrorMsg(result.error);
    }
  };

  const handleQuickSelect = (member) => {
    setSelectedDemoUser(member);
    setIdentifier(member.username);
    setPassword(member.password);
    setErrorMsg('');
  };

  const handleDirectQuickLogin = (member) => {
    switchUser(member.id);
    setIsLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Decorative header glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Hobby Club 2k26 Portal Login
              </h3>
              <p className="text-xs text-slate-400">
                Restricted to the 12 authorized Executive Council Members
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6">
          
          {/* Quick Demo One-Click Selectors */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Select Your Member Profile (One-Click Sign In)
              </span>
              <span className="text-[10px] text-slate-500">12 Members</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 pr-2">
              {MEMBERS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleQuickSelect(m)}
                  onDoubleClick={() => handleDirectQuickLogin(m)}
                  className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2 ${
                    identifier === m.username || identifier === m.email
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate leading-tight">{m.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{m.role}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5 italic text-right">
              Tip: Click to autofill credentials, or double-click to log in instantly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4 pt-2 border-t border-slate-800/80">
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username or Official Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. smit.barmate or smitbarmate15@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your member password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Default password format: <code className="text-indigo-400">hobby2026@[firstname]</code>
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Sign In to Portal
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
