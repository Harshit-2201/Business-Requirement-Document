import React from 'react';
import {
  ShieldCheck,
  KeyRound,
  Star,
  AlertTriangle,
  Copy,
  Clock,
  Zap,
  Plus,
  Lock,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import { CredentialItem, VaultHealthStats } from '../../types';
import { FaviconLogo } from '../common/FaviconLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ActiveView } from '../layout/Sidebar';

interface DashboardViewProps {
  credentials: CredentialItem[];
  stats: VaultHealthStats;
  onOpenAddModal: () => void;
  setActiveView: (view: ActiveView) => void;
  onEditCredential: (item: CredentialItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  credentials,
  stats,
  onOpenAddModal,
  setActiveView,
  onEditCredential,
}) => {
  const { user, lockVault } = useAuth();
  const { copyToClipboard } = useToast();

  const recentCredentials = [...credentials]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/60 border border-blue-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-[11px] text-blue-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Knowledge Vault Active</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {user?.username || 'Security Officer'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your credentials are encrypted client-side using AES-256-GCM and Argon2id. Your master key never touches server disks unencrypted.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Credential</span>
            </button>
            <button
              onClick={() => setActiveView('generator')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Password Generator</span>
            </button>
            <button
              onClick={lockVault}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-all active:scale-95"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Lock Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Level Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Credentials */}
        <div
          onClick={() => setActiveView('vault')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Total Credentials</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-105 transition-transform">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              {stats.total}
            </span>
            <span className="text-xs text-slate-400 font-mono">items</span>
          </div>
        </div>

        {/* Favorites */}
        <div
          onClick={() => setActiveView('vault')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Favorite Logins</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
              <Star className="w-4 h-4 fill-amber-400/30" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              {stats.favorites}
            </span>
            <span className="text-xs text-slate-400 font-mono">starred</span>
          </div>
        </div>

        {/* Security Health Score */}
        <div
          onClick={() => setActiveView('security')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Security Score</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              {stats.securityScore}%
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getScoreColor(
                stats.securityScore
              )}`}
            >
              {stats.securityScore >= 80 ? 'Optimal' : stats.securityScore >= 60 ? 'Fair' : 'Risk'}
            </span>
          </div>
        </div>

        {/* Weak or Duplicate Passwords Warning */}
        <div
          onClick={() => setActiveView('security')}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/40 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Vulnerable Items</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-400 tabular-nums">
              {stats.weakCount + stats.duplicateCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({stats.weakCount} weak, {stats.duplicateCount} dup)
            </span>
          </div>
        </div>
      </div>

      {/* Password Health Banner if vulnerable items exist */}
      {(stats.weakCount > 0 || stats.duplicateCount > 0) && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-rose-300">
                Security Attention Needed ({stats.weakCount + stats.duplicateCount} Issues)
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                We detected {stats.weakCount} weak passwords and {stats.duplicateCount} reused passwords in your vault.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('security')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-900/30 transition-all shrink-0"
          >
            <span>Review & Fix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Recent Credentials Section */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100">Recent Credentials</h3>
          </div>
          <button
            onClick={() => setActiveView('vault')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
          >
            <span>View All ({credentials.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentCredentials.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No recent credentials added.</p>
        ) : (
          <div className="divide-y divide-slate-800/70">
            {recentCredentials.map((item) => (
              <div
                key={item.id}
                onClick={() => onEditCredential(item)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-800/40 px-3 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FaviconLogo url={item.url} name={item.name} type={item.type} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {item.username || '(No username)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    {item.type}
                  </span>
                  {item.username && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.username!, 'Username');
                      }}
                      title="Copy Username"
                      className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-700/60 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
