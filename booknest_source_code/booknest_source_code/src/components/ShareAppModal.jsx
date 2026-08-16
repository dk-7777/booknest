import React, { useState } from 'react';
import { X, Copy, Check, Share2, QrCode, Smartphone, Globe, ExternalLink, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ShareAppModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('link'); // 'link', 'qr', 'store'

  // Permanent Worldwide Live HTTPS URL (Vercel Production)
  const globalUrl = 'https://booknest-blush-psi.vercel.app';
  const primaryShareUrl = globalUrl;

  const handleCopy = (urlToCopy) => {
    navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BookNest ⚡ Social Reading & Habit Squad',
          text: 'Join my reading squad on BookNest! Track 20-minute focus sessions, maintain streaks, and share books from anywhere in the world.',
          url: primaryShareUrl
        });
      } catch (err) {
        console.log('Share canceled or not supported');
      }
    } else {
      handleCopy(primaryShareUrl);
    }
  };

  // QR Code generator for worldwide URL
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(primaryShareUrl)}&bgcolor=090d18&color=00f2fe&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#090d18] border border-cyber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-glow-blue relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-obsidian-750">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-cyber-400/40 p-0.5 bg-obsidian-950 shadow-glow-cyan">
              <img
                src="/logo.png"
                alt="BookNest Logo"
                className="w-full h-full object-cover rounded-[13px]"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">BookNest Worldwide App ⚡</h2>
              <p className="text-xs text-slate-400">Share with anyone across any country, network, or device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="mt-4 flex rounded-2xl bg-obsidian-900 p-1 border border-obsidian-750">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'link'
                ? 'bg-cyber-500 text-obsidian-950 shadow-glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Global Link</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-cyber-500 text-obsidian-950 shadow-glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'store'
                ? 'bg-cyber-500 text-obsidian-950 shadow-glow-blue'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install as App</span>
          </button>
        </div>

        {/* Tab 1: Share Link */}
        {activeTab === 'link' && (
          <div className="mt-5 space-y-4">
            
            {/* Primary Share Box */}
            <div className="p-4 rounded-2xl bg-obsidian-900 border border-cyber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Worldwide HTTPS Link:
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                  Global 24/7
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={primaryShareUrl}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-750 text-xs font-mono text-white select-all focus:outline-none focus:border-cyber-400"
                />
                <button
                  onClick={() => handleCopy(primaryShareUrl)}
                  className="px-4 py-2.5 rounded-xl bg-cyber-500 hover:bg-cyber-400 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan shrink-0 transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Native Mobile Share Button */}
            <button
              onClick={handleNativeShare}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyber-400 via-cyber-500 to-electric-blue hover:from-cyan-300 hover:to-blue-500 text-obsidian-950 font-extrabold text-xs shadow-glow-cyan transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via WhatsApp / Messages / Instagram</span>
            </button>

            {/* Worldwide info */}
            <div className="p-3.5 rounded-2xl bg-obsidian-850 border border-obsidian-750 space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-cyber-400 font-bold">
                <Globe className="w-4 h-4" />
                <span>Works on Any Network in Any Country</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your friends can open this link on 4G/5G mobile data, office Wi-Fi, or home internet without needing to be connected to your Wi-Fi!
              </p>
            </div>

          </div>
        )}

        {/* Tab 2: Live QR Code */}
        {activeTab === 'qr' && (
          <div className="mt-5 space-y-4 text-center">
            <p className="text-xs text-slate-300">
              Scan with any phone camera from anywhere in the world to open BookNest:
            </p>
            <div className="p-4 bg-obsidian-950 rounded-2xl border-2 border-cyber-500/40 inline-block shadow-glow-cyan">
              <img
                src={qrSvgUrl}
                alt="BookNest Worldwide QR Code"
                className="w-48 h-48 mx-auto rounded-xl"
              />
            </div>
            <p className="text-[11px] text-cyan-300 font-mono break-all px-4">
              {primaryShareUrl}
            </p>
          </div>
        )}

        {/* Tab 3: App Store & Play Store Installation Guide */}
        {activeTab === 'store' && (
          <div className="mt-5 space-y-3.5 text-xs text-slate-300">
            
            {/* Android */}
            <div className="p-3.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="text-base">🤖</span>
                <span>Android Chrome / Google Play PWA</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Open <code className="text-cyan-300 font-mono">{primaryShareUrl}</code> in Chrome → Tap the <strong>3 dots (top right)</strong> → Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.
              </p>
            </div>

            {/* iOS */}
            <div className="p-3.5 rounded-2xl bg-obsidian-900 border border-obsidian-750 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="text-base">🍏</span>
                <span>iPhone / iPad (Apple App Experience)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Open in <strong>Safari</strong> → Tap the <strong>Share icon (bottom center)</strong> → Scroll down & tap <strong>"Add to Home Screen"</strong>. Runs full-screen just like a native App Store app!
              </p>
            </div>

            {/* Play Store / App Store Publishing Config */}
            <div className="p-3.5 rounded-2xl bg-cyber-500/10 border border-cyber-500/30 space-y-1">
              <div className="flex items-center gap-2 font-bold text-cyber-300">
                <Sparkles className="w-4 h-4" />
                <span>Ready for Google Play Store & Apple App Store</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Pre-configured with <code className="text-white font-mono">manifest.json</code> and <code className="text-white font-mono">capacitor.config.json</code> (<code className="text-cyan-300">com.booknest.readingapp</code>) for 1-click APK or IPA export.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
