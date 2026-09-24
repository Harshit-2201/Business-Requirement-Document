import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap,
  Copy,
  RefreshCw,
  Check,
  ShieldCheck,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { passwordApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { PasswordGenerateResult } from '../../types';

export const PasswordGeneratorView: React.FC = () => {
  const { copyToClipboard } = useToast();
  const [length, setLength] = useState(20);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);

  const [result, setResult] = useState<PasswordGenerateResult>({
    password: '',
    length: 20,
    entropyBits: 130,
    strength: 'Very Strong',
  });
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await passwordApi.generate({
        length,
        uppercase,
        lowercase,
        numbers,
        symbols,
        excludeAmbiguous,
      });
      setResult(res);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [length, uppercase, lowercase, numbers, symbols, excludeAmbiguous]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = () => {
    if (result.password) {
      copyToClipboard(result.password, 'Password');
    }
  };

  const strengthColors = {
    'Very Weak': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    Weak: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Fair: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Strong: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Very Strong': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400" />
          <span>Password Generator</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically random passwords generated via SecureRandom and Shannon entropy calculations.
        </p>
      </div>

      {/* Main Generator Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6">
        {/* Output Box */}
        <div className="relative p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full overflow-x-auto text-center sm:text-left py-1">
            <span className="font-mono text-lg sm:text-xl font-semibold tracking-wider text-slate-100 selection:bg-blue-600 selection:text-white break-all">
              {result.password || 'Generating...'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={generate}
              disabled={loading}
              title="Generate New"
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Strength & Entropy Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Strength:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                strengthColors[result.strength]
              }`}
            >
              {result.strength}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Entropy:</span>
            <span className="text-blue-400 font-semibold">{result.entropyBits} bits</span>
          </div>
        </div>

        {/* Length Slider */}
        <div className="space-y-2 pt-2 border-t border-slate-800/70">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Password Length</label>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30">
              {length} characters
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>8 (Basic)</span>
            <span>20 (Recommended)</span>
            <span>64 (Ultra Secure)</span>
          </div>
        </div>

        {/* Character Set Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-200">Uppercase Letters</span>
              <p className="text-[11px] text-slate-400 font-mono">A-Z</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-200">Lowercase Letters</span>
              <p className="text-[11px] text-slate-400 font-mono">a-z</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={numbers}
              onChange={(e) => setNumbers(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-200">Numbers</span>
              <p className="text-[11px] text-slate-400 font-mono">0-9</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={symbols}
              onChange={(e) => setSymbols(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-200">Symbols & Punctuation</span>
              <p className="text-[11px] text-slate-400 font-mono">!@#$%^&*()</p>
            </div>
          </label>
        </div>

        {/* Ambiguous Filter */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={excludeAmbiguous}
            onChange={(e) => setExcludeAmbiguous(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-0"
          />
          <div className="text-xs">
            <span className="font-semibold text-slate-200">
              Exclude Ambiguous / Confusing Characters
            </span>
            <p className="text-[11px] text-slate-400">
              Filters out easily confused glyphs like <code className="text-blue-400 font-mono">0, O, 1, l, I</code>
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
