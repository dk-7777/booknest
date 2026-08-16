import React, { useState } from 'react';
import { BookOpen, Flame, Lock, Mail, User, Target, Link2, Zap, ArrowRight, ShieldCheck, Sparkles, Check, Globe, QrCode, KeyRound, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import ShareAppModal from './ShareAppModal';

const COOL_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80"
];

export default function LoginPage({ onLoginSuccess, api }) {
  // Mode: 'login', 'register', 'forgot_password'
  const [authMode, setAuthMode] = useState('login');

  // Sign In Fields
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regAvatar, setRegAvatar] = useState(COOL_AVATARS[0]);
  const [regGoal, setRegGoal] = useState('25');
  const [regGenre, setRegGenre] = useState('Sci-Fi / Cyberpunk');

  // Forgot Password Fields
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sign In Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!emailOrUsername.trim() || !password) {
      setErrorMessage('Please enter both your email/username and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.login({ emailOrUsername: emailOrUsername.trim(), password });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onLoginSuccess(res.data);
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Incorrect email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regEmail.trim() || !regPassword || !regName.trim()) {
      setErrorMessage('Full name, email address, and a private password are required.');
      return;
    }
    if (regPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        username: regUsername.trim() || regEmail.trim().split('@')[0],
        avatar: regAvatar,
        readingGoalYear: regGoal,
        favoriteGenre: regGenre
      });
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
      onLoginSuccess(res.data);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. This email may already be registered.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password / Reset Handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setResetSuccessMessage('');

    if (!resetEmail.trim() || !resetNewPassword) {
      setErrorMessage('Please enter your registered email and a new password.');
      return;
    }
    if (resetNewPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.resetPassword({
        email: resetEmail.trim(),
        newPassword: resetNewPassword
      });
      setResetSuccessMessage('Password reset successfully! You can now sign in with your new password.');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        setEmailOrUsername(resetEmail.trim());
        setAuthMode('login');
        setResetSuccessMessage('');
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Could not reset password. Please verify the email address.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-32 w-[650px] h-[650px] rounded-full bg-cyan-500/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mb-32 w-[550px] h-[550px] rounded-full bg-blue-600/15 blur-[130px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-glow-cyan border border-cyber-400/40 p-0.5 bg-obsidian-950">
            <img
              src="/logo.png"
              alt="BookNest Logo"
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl text-white tracking-tight gradient-text-cyan">BookNest ⚡</span>
            <span className="ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyber-500/20 text-cyber-300 border border-cyber-500/40 font-bold">
              Global Edition
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-obsidian-900 border border-cyber-500/40 hover:border-cyber-400 text-cyber-300 text-xs font-mono font-bold transition-all shadow-glow-blue"
        >
          <QrCode className="w-4 h-4" />
          <span>Share & Install App</span>
        </button>
      </header>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto px-4 py-6 relative z-10">
        <div className="bg-[#090d18] border border-cyber-500/30 rounded-3xl p-6 sm:p-8 shadow-glow-blue">
          
          {/* Header Title with Logo */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden shadow-glow-cyan border-2 border-cyber-400/40 p-1 bg-obsidian-950 transform hover:scale-105 transition-all">
              <img
                src="/logo.png"
                alt="BookNest Official Logo"
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyber-500/10 border border-cyber-500/30 text-cyber-300 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>
                {authMode === 'forgot_password' ? 'Account Recovery' : 'Personal Account Access'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              {authMode === 'register' && 'Create Your Account'}
              {authMode === 'login' && 'Sign In to BookNest'}
              {authMode === 'forgot_password' && 'Reset Your Password'}
            </h1>
            <p className="text-xs text-slate-400">
              {authMode === 'register' && 'Enter your email and private password to create your private library'}
              {authMode === 'login' && 'Enter your registered email and your private password'}
              {authMode === 'forgot_password' && 'Enter your registered email address and create a new password'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 text-center font-medium">
              {errorMessage}
            </div>
          )}

          {/* Success Banner */}
          {resetSuccessMessage && (
            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 text-center font-medium flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{resetSuccessMessage}</span>
            </div>
          )}

          {/* Form Content */}
          <div className="mt-6 space-y-4">
            
            {/* 1. Sign In Mode */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyber-400" />
                    <span>Your Email Address or Username *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyber-400" />
                      <span>Your Private Password *</span>
                    </label>
                    
                    {/* Clickable Forgot Password Link */}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('forgot_password'); setErrorMessage(''); }}
                      className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter your personal password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-extrabold text-xs shadow-glow-cyan transition-all transform active:scale-95"
                >
                  {isLoading ? 'Verifying Credentials...' : 'Sign In to My Library ⚡'}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
                    className="text-xs font-semibold text-cyber-400 hover:text-cyan-300 transition-colors"
                  >
                    Don't have an account? Register new account →
                  </button>
                </div>
              </form>
            )}

            {/* 2. Register Mode */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Reed"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                    <input
                      type="text"
                      placeholder="jordan_reads"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email (Gmail, Yahoo, Outlook) *</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Set Private Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Create a secure password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Choose Avatar</label>
                  <div className="flex gap-2 items-center overflow-x-auto pb-1 no-scrollbar">
                    {COOL_AVATARS.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Avatar ${idx}`}
                        onClick={() => setRegAvatar(url)}
                        className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition-all shrink-0 ${
                          regAvatar === url ? 'border-cyber-400 scale-110 shadow-glow-blue' : 'border-obsidian-750 opacity-50 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">2026 Goal</label>
                    <input
                      type="number"
                      min="1"
                      value={regGoal}
                      onChange={(e) => setRegGoal(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs font-mono text-white focus:outline-none focus:border-cyber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Favorite Genre</label>
                    <input
                      type="text"
                      value={regGenre}
                      onChange={(e) => setRegGenre(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white focus:outline-none focus:border-cyber-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-extrabold text-xs shadow-glow-cyan transition-all transform active:scale-95 mt-2"
                >
                  {isLoading ? 'Creating Account...' : 'Register & Start Reading 🚀'}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                    className="text-xs font-semibold text-cyber-400 hover:text-cyan-300 transition-colors"
                  >
                    Already have an account? Sign In →
                  </button>
                </div>
              </form>
            )}

            {/* 3. Forgot Password / Reset Mode */}
            {authMode === 'forgot_password' && (
              <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Your Registered Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your account email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Create New Private Password *</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your new password"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyber-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-extrabold text-xs shadow-glow-cyan transition-all transform active:scale-95"
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password & Save ⚡'}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                    className="text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

        {/* Security & Account Privacy */}
        <div className="mt-4 p-3.5 rounded-2xl bg-obsidian-900/60 border border-obsidian-750 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-cyber-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Account Privacy</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Every account requires its own unique password. Nobody can access or edit another person's library.
          </p>
        </div>

      </div>

      {/* Footer Share Info */}
      <footer className="p-4 text-center text-xs text-slate-500 relative z-10 border-t border-obsidian-750">
        <div className="max-w-md mx-auto flex flex-col items-center gap-1.5">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="text-cyan-300 hover:underline font-mono text-xs font-bold"
          >
            🔗 Tap to Share Live Worldwide Link & QR Code
          </button>
          <span>BookNest ⚡ — Global Social Reading & Habit Engine</span>
        </div>
      </footer>

      {/* Share App Modal */}
      <ShareAppModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

    </div>
  );
}
