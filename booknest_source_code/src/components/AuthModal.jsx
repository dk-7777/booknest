import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User, Target, Link2, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const COOL_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80"
];

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  api
}) {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState('login'); // 'login' | 'register' | 'invite'
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regBio, setRegBio] = useState('Building my reading era! ⚡📖');
  const [regAvatar, setRegAvatar] = useState(COOL_AVATARS[0]);
  const [regGoal, setRegGoal] = useState('25');
  const [regGenre, setRegGenre] = useState('Sci-Fi / Cyberpunk');

  // Google quick login modal input
  const [googleEmail, setGoogleEmail] = useState('');
  const [isGooglePromptOpen, setIsGooglePromptOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);

  const inviteLink = `${window.location.origin}/?join=true&club=booknest-squad-2026`;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const res = await api.login({ emailOrUsername, password });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      onLoginSuccess(res.data);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const res = await api.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        username: regUsername,
        avatar: regAvatar,
        bio: regBio,
        readingGoalYear: regGoal,
        favoriteGenre: regGenre
      });
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      onLoginSuccess(res.data);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;
    setErrorMessage('');
    setIsLoading(true);
    try {
      const cleanEmail = googleEmail.trim().toLowerCase();
      const userName = cleanEmail.split('@')[0];
      const res = await api.googleLogin({
        email: cleanEmail,
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`
      });
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      onLoginSuccess(res.data);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#090d18] border border-cyber-500/30 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-glow-blue relative overflow-hidden max-h-[92vh] overflow-y-auto">
        
        {/* Ambient Neon Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-52 h-52 rounded-full bg-cyber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-52 h-52 rounded-full bg-electric-indigo/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-750 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyber-500/10 text-cyber-400 border border-cyber-500/30 shadow-glow-blue">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-1.5">
                <span>BookNest Squad</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyber-500/20 text-cyber-300 border border-cyber-500/40">
                  Gen Z
                </span>
              </h2>
              <p className="text-xs text-slate-400">Join the circle • Flex streaks • Share reads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-obsidian-900 border border-obsidian-750 rounded-2xl mt-5">
          <button
            onClick={() => { setActiveMode('login'); setErrorMessage(''); }}
            className={`py-2 text-xs font-semibold rounded-xl transition-all ${
              activeMode === 'login'
                ? 'bg-cyber-500 text-obsidian-950 font-bold shadow-glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveMode('register'); setErrorMessage(''); }}
            className={`py-2 text-xs font-semibold rounded-xl transition-all ${
              activeMode === 'register'
                ? 'bg-cyber-500 text-obsidian-950 font-bold shadow-glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Join Squad ⚡
          </button>
          <button
            onClick={() => { setActiveMode('invite'); setErrorMessage(''); }}
            className={`py-2 text-xs font-semibold rounded-xl transition-all ${
              activeMode === 'invite'
                ? 'bg-cyber-500 text-obsidian-950 font-bold shadow-glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Invite Link 🔗
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* --- 1. SIGN IN MODE --- */}
        {activeMode === 'login' && (
          <div className="mt-5 space-y-4">
            
            {/* Google Quick Sign-In Button */}
            <button
              onClick={() => setIsGooglePromptOpen(!isGooglePromptOpen)}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all transform active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google / Gmail</span>
            </button>

            {isGooglePromptOpen && (
              <form onSubmit={handleGoogleLogin} className="p-3.5 bg-obsidian-850 rounded-2xl border border-cyber-500/30 space-y-2.5 animate-in fade-in">
                <div className="text-[11px] text-cyber-300 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Enter your Gmail address to instantly connect:</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-3.5 py-1.5 rounded-xl bg-cyber-500 hover:bg-cyber-400 text-obsidian-950 font-bold text-xs"
                  >
                    Go
                  </button>
                </div>
              </form>
            )}

            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-obsidian-750" />
              <span className="px-3 text-[10px] uppercase font-mono text-slate-500">Or use squad login</span>
              <div className="flex-1 border-t border-obsidian-750" />
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyber-400" />
                  <span>Email or Username</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ashish@gmail.com or ashish"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyber-400" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
                />
                <p className="text-[10px] text-slate-500 mt-1">Default friend passwords: <code className="text-cyber-400 font-mono">password123</code></p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyber-500 to-electric-blue hover:from-cyber-400 hover:to-cyber-500 text-obsidian-950 font-bold text-xs shadow-glow-blue transition-all"
              >
                {isLoading ? 'Authenticating...' : 'Enter BookNest ⚡'}
              </button>
            </form>

          </div>
        )}

        {/* --- 2. REGISTER / JOIN SQUAD MODE --- */}
        {activeMode === 'register' && (
          <form onSubmit={handleRegister} className="mt-5 space-y-3.5">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="alex_reads"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gmail / Email *</label>
              <input
                type="email"
                required
                placeholder="alex@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Create Password *</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-400"
              />
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pick Your Squad Avatar</label>
              <div className="flex gap-2 items-center overflow-x-auto pb-1 no-scrollbar">
                {COOL_AVATARS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx}`}
                    onClick={() => setRegAvatar(url)}
                    className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition-all shrink-0 ${
                      regAvatar === url ? 'border-cyber-400 scale-110 shadow-glow-blue' : 'border-obsidian-750 opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">2026 Reading Goal</label>
                <input
                  type="number"
                  min="1"
                  value={regGoal}
                  onChange={(e) => setRegGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs font-mono text-white focus:outline-none focus:border-cyber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Favorite Genre</label>
                <input
                  type="text"
                  value={regGenre}
                  onChange={(e) => setRegGenre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs text-white focus:outline-none focus:border-cyber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyber-400 to-cyber-500 hover:from-cyber-300 hover:to-cyber-400 text-obsidian-950 font-bold text-xs shadow-glow-blue transition-all mt-2"
            >
              {isLoading ? 'Creating Profile...' : 'Claim Profile & Start Streak 🚀'}
            </button>

          </form>
        )}

        {/* --- 3. INVITE LINK SHARING MODE --- */}
        {activeMode === 'invite' && (
          <div className="mt-5 space-y-4">
            <div className="p-4 bg-obsidian-850 rounded-2xl border border-cyber-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyber-500/20 text-cyber-400 flex items-center justify-center mx-auto border border-cyber-500/40 shadow-glow-blue">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-white text-base">Squad Invite Link</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Send this instant link to your friend! When they click it, they will automatically join your BookNest reading circle.
              </p>

              <div className="flex items-center gap-2 bg-obsidian-950 p-2 rounded-xl border border-obsidian-750">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="bg-transparent text-xs text-cyber-300 font-mono flex-1 outline-none truncate"
                />
                <button
                  onClick={handleCopyInvite}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    copiedInvite
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-cyber-500 hover:bg-cyber-400 text-obsidian-950'
                  }`}
                >
                  {copiedInvite ? 'Copied! ✓' : 'Copy Link'}
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[11px] text-slate-500">
                Friends can sign in with Gmail or create a custom reader handle.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
