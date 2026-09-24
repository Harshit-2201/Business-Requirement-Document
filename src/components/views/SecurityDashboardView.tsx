import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Copy,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { CredentialItem, VaultHealthStats } from '../../types';
import { FaviconLogo } from '../common/FaviconLogo';

interface SecurityDashboardViewProps {
  credentials: CredentialItem[];
  stats: VaultHealthStats;
  onEditCredential: (item: CredentialItem) => void;
  onOpenGenerator: () => void;
}

export const SecurityDashboardView: React.FC<SecurityDashboardViewProps> = ({
  credentials,
  stats,
  onEditCredential,
  onOpenGenerator,
}) => {
  // Identify exact weak passwords (< 10 chars, or simple)
  const weakCredentials = credentials.filter((c) => {
    const pwd = c.decryptedPassword || '';
    if (!pwd) return false;
    return pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd) || !/[^A-Za-z0-9]/.test(pwd);
  });

  // Identify duplicate/reused passwords
  const passwordMap = new Map<string, CredentialItem[]>();
  credentials.forEach((c) => {
    const pwd = c.decryptedPassword;
    if (pwd) {
      const list = passwordMap.get(pwd) || [];
      list.push(c);
      passwordMap.set(pwd, list);
    }
  });

  const duplicateCredentials: { password: string; items: CredentialItem[] }[] = [];
  passwordMap.forEach((items, pwd) => {
    if (items.length > 1) {
      duplicateCredentials.push({ password: pwd, items });
    }
  });

  // Identify old credentials (> 90 days since passwordUpdated or createdAt)
  const now = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  const oldCredentials = credentials.filter((c) => {
    const ts = c.passwordUpdated ? new Date(c.passwordUpdated).getTime() : new Date(c.createdAt).getTime();
    return now - ts > ninetyDaysMs;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-blue-400" />
          <span>Security Health Audit</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Zero-Knowledge client-side audit evaluating password entropy, reuse, and aging.
        </p>
      </div>

      {/* Main Health Card with Radial Score */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs text-blue-300 font-medium">
            <span>Overall Vault Security Rating</span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            {stats.securityScore >= 85
              ? 'Excellent Vault Posture'
              : stats.securityScore >= 65
              ? 'Moderate Security - Some Attention Needed'
              : 'Critical Risk - Vulnerabilities Detected'}
          </h3>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Eliminating reused passwords and rotating aging secrets protects your accounts against credential stuffing attacks.
          </p>
        </div>

        {/* Score Ring */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <div className="w-28 h-28 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-950/70 shadow-2xl">
            <span className="text-3xl font-bold font-mono text-blue-400 tabular-nums">
              {stats.securityScore}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">SCORE</span>
          </div>
        </div>
      </div>

      {/* Metrics Triplet */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Weak Passwords</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
              {weakCredentials.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">accounts</span>
          </div>
          <p className="text-[11px] text-slate-400">Length &lt; 10 or low complexity</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Reused Passwords</span>
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {duplicateCredentials.reduce((acc, curr) => acc + curr.items.length, 0)}
            </span>
            <span className="text-xs text-slate-400 font-mono">affected</span>
          </div>
          <p className="text-[11px] text-slate-400">Matches another vault item</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Old Passwords</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-400 tabular-nums">
              {oldCredentials.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">unrotated</span>
          </div>
          <p className="text-[11px] text-slate-400">Not updated in &gt; 90 days</p>
        </div>
      </div>

      {/* Actionable List: Weak Passwords */}
      {weakCredentials.length > 0 && (
        <div className="rounded-3xl bg-slate-900/60 border border-rose-500/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-bold text-rose-200">Weak Passwords Needing Upgrade</h4>
            </div>
            <span className="text-xs text-rose-400 font-mono">{weakCredentials.length} detected</span>
          </div>

          <div className="divide-y divide-slate-800/70">
            {weakCredentials.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FaviconLogo url={item.url} name={item.name} type={item.type} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{item.username}</p>
                  </div>
                </div>

                <button
                  onClick={() => onEditCredential(item)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>Update Password</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable List: Reused Passwords */}
      {duplicateCredentials.length > 0 && (
        <div className="rounded-3xl bg-slate-900/60 border border-amber-500/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-amber-200">Reused Passwords</h4>
            </div>
            <span className="text-xs text-amber-400 font-mono">
              {duplicateCredentials.length} password cluster{duplicateCredentials.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {duplicateCredentials.map((dup, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-2">
                <p className="text-xs text-amber-300 font-medium">Shared across these services:</p>
                <div className="flex flex-wrap gap-2">
                  {dup.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onEditCredential(item)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-400 text-xs text-slate-200 transition-colors"
                    >
                      <span>{item.name}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable List: Old Passwords */}
      {oldCredentials.length > 0 && (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-bold text-slate-200">Aging Passwords (&gt; 90 Days)</h4>
            </div>
            <span className="text-xs text-slate-400 font-mono">{oldCredentials.length} items</span>
          </div>

          <div className="divide-y divide-slate-800/70">
            {oldCredentials.slice(0, 5).map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <FaviconLogo url={item.url} name={item.name} type={item.type} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Last rotated {new Date(item.passwordUpdated || item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onEditCredential(item)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Rotate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
