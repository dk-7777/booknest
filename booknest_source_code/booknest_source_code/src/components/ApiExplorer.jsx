import React, { useState } from 'react';
import { Terminal, Send, Check, Copy, Code, Globe, Shield, Zap, Sparkles, Layers, BookOpen } from 'lucide-react';

export default function ApiExplorer({ currentUser }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState('get_stats');
  const [responseOutput, setResponseOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';

  const endpoints = [
    {
      id: 'get_stats',
      name: 'Get User Streaks & Heatmap',
      method: 'GET',
      path: `/api/stats?userId=${currentUser?.id || 'user-1'}`,
      description: 'Calculates active streaks, consistency matrix, monthly completion percentage, and badges.',
      payload: null
    },
    {
      id: 'get_books',
      name: 'Fetch Private Library Books',
      method: 'GET',
      path: `/api/books?userId=${currentUser?.id || 'user-1'}`,
      description: 'Returns private collection of owned books with status, pages read, and reviews.',
      payload: null
    },
    {
      id: 'log_session',
      name: 'Log Verified 20-Min Reading Session',
      method: 'POST',
      path: '/api/reading-logs',
      description: 'Records verified reading session with exact elapsed minutes and page progress, boosting streaks.',
      payload: JSON.stringify({
        userId: currentUser?.id || 'user-1',
        bookId: 'book-1',
        pagesRead: 18,
        minutesRead: 20,
        date: new Date().toISOString().split('T')[0],
        note: 'Completed 20-min reading focus session ⚡'
      }, null, 2)
    },
    {
      id: 'get_leaderboard',
      name: 'Get Global Squad Scoreboard',
      method: 'GET',
      path: '/api/leaderboard',
      description: 'Returns friend rankings sorted by active streaks and books read.',
      payload: null
    },
    {
      id: 'get_feed',
      name: 'Get Live Social Activity Stream',
      method: 'GET',
      path: '/api/feed?limit=20',
      description: 'Real-time activity stream of squad completions, hype reactions, and reading updates.',
      payload: null
    },
    {
      id: 'auth_register',
      name: 'Register Account (Email + Private Password)',
      method: 'POST',
      path: '/api/auth/register',
      description: 'Creates a new user account with unique email and cryptographically tied password.',
      payload: JSON.stringify({
        name: 'Alex Rivera',
        email: 'alex@gmail.com',
        password: 'secure_password_123',
        readingGoalYear: 30,
        favoriteGenre: 'Cyberpunk'
      }, null, 2)
    }
  ];

  const currentEp = endpoints.find(e => e.id === selectedEndpoint) || endpoints[0];

  const handleExecute = async () => {
    setIsLoading(true);
    setResponseOutput(null);
    try {
      let res;
      if (currentEp.method === 'GET') {
        res = await fetch(currentEp.path);
      } else {
        res = await fetch(currentEp.path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: currentEp.payload
        });
      }
      const data = await res.json();
      setResponseOutput(data);
    } catch (err) {
      setResponseOutput({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const curlCommand = currentEp.method === 'GET'
    ? `curl -X GET "${baseOrigin}${currentEp.path}"`
    : `curl -X POST "${baseOrigin}${currentEp.path}" \\\n  -H "Content-Type: application/json" \\\n  -d '${currentEp.payload?.replace(/\n/g, '')}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0a0f1d] via-[#090d18] to-[#0a0f1d] p-6 rounded-3xl border border-cyber-500/30 shadow-glow-blue">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                Public Backend & REST API Sandbox ⚡
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                Live & Open
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Fully transparent backend API. Use these endpoints to build mobile apps (Flutter, React Native, Swift, Kotlin) or publish to app stores.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-obsidian-900 px-4 py-2 rounded-2xl border border-obsidian-750 text-xs font-mono text-cyber-300">
            <Globe className="w-4 h-4 text-cyber-400" />
            <span>Base URL: <strong className="text-white">{baseOrigin}/api</strong></span>
          </div>
        </div>
      </div>

      {/* Grid: Endpoint Selector & Interactive Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Endpoint List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-[#090d18] rounded-3xl p-4 border border-obsidian-750 shadow-glass-card space-y-2">
            <h2 className="text-xs font-mono font-bold uppercase text-slate-400 px-2 py-1">
              Available REST Endpoints
            </h2>
            <div className="space-y-1.5">
              {endpoints.map(ep => {
                const isSelected = selectedEndpoint === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setSelectedEndpoint(ep.id);
                      setResponseOutput(null);
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyber-500/15 border-cyber-400 text-white shadow-glow-blue'
                        : 'bg-obsidian-900 border-obsidian-750 text-slate-400 hover:text-slate-200 hover:bg-obsidian-850'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-md ${
                          ep.method === 'GET' ? 'bg-blue-500/20 text-cyan-300 border border-blue-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {ep.method}
                        </span>
                        <span className="text-xs font-bold truncate text-slate-100">{ep.name}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                        {ep.path}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Endpoint Sandbox & Live Runner */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#090d18] rounded-3xl p-6 border border-obsidian-750 shadow-glass-card space-y-4">
            
            {/* Active Endpoint Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-obsidian-750">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                    currentEp.method === 'GET' ? 'bg-blue-500/20 text-cyan-300 border border-blue-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {currentEp.method}
                  </span>
                  <h3 className="font-display font-bold text-base text-white">{currentEp.name}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">{currentEp.description}</p>
              </div>

              <button
                onClick={handleExecute}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-glow-cyan transition-all transform active:scale-95 flex items-center justify-center gap-2 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Executing...' : 'Test / Execute Request ⚡'}</span>
              </button>
            </div>

            {/* Path & Payload Display */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Request URL:</span>
                <div className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-obsidian-750 font-mono text-xs text-cyan-300 break-all">
                  {baseOrigin}{currentEp.path}
                </div>
              </div>

              {currentEp.payload && (
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Request Body (JSON):</span>
                  <pre className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-750 font-mono text-xs text-slate-300 overflow-x-auto">
                    {currentEp.payload}
                  </pre>
                </div>
              )}

              {/* cURL Snippet */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">cURL Command:</span>
                  <button
                    onClick={handleCopyCurl}
                    className="text-[11px] font-mono text-cyber-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-obsidian-950 border border-obsidian-750 font-mono text-[11px] text-slate-400 overflow-x-auto">
                  {curlCommand}
                </pre>
              </div>

              {/* Live Response Box */}
              {responseOutput && (
                <div className="mt-4 pt-4 border-t border-obsidian-750 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Live Response (HTTP 200 OK):</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">JSON</span>
                  </div>
                  <pre className="p-4 rounded-2xl bg-obsidian-950 border border-emerald-500/30 font-mono text-xs text-emerald-300 max-h-72 overflow-y-auto leading-relaxed">
                    {JSON.stringify(responseOutput, null, 2)}
                  </pre>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
