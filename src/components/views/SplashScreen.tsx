import React from 'react';
import { ShieldCheck, Lock, Key, ArrowRight, Database, Server } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted, onSignIn }) => {
  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background radial blurs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">FortressPass</h1>
            <p className="text-[10px] text-blue-400 font-mono tracking-wider">ZERO-KNOWLEDGE ARCHITECTURE</p>
          </div>
        </div>

        <button
          onClick={onSignIn}
          className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors"
        >
          Sign In
        </button>
      </header>

      {/* Center Hero Section */}
      <main className="relative z-10 max-w-3xl mx-auto w-full text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>Zero-Knowledge AES-256-GCM + Spring Boot 3</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Next-Generation Security for Every Password & Secret
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Designed with the architectural elegance of Bitwarden and 1Password. Your secrets are encrypted before they ever leave your device.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <span>Launch Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onSignIn}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 text-slate-200 font-semibold text-sm border border-slate-700/60 transition-colors"
          >
            Unlock Existing Vault
          </button>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Key className="w-4 h-4 text-blue-400" />
              <span>Argon2id KDF</span>
            </div>
            <p className="text-[11px] text-slate-400">
              GPU-resistant memory-hard key derivation calculated in-browser.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Docker MySQL</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Enterprise persistence with encrypted ciphertext payloads only.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Server className="w-4 h-4 text-purple-400" />
              <span>Spring Boot REST</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Java 21 layered controller, service, repository architecture.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full text-center text-xs text-slate-400 py-3 border-t border-slate-800/60">
        <p>FortressPass Zero-Knowledge Architecture · No plaintext secrets ever logged or stored</p>
      </footer>
    </div>
  );
};
