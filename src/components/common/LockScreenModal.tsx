import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, Unlock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LockScreenModal: React.FC = () => {
  const { isVaultLocked, unlockVault, user, logout } = useAuth();
  const { showToast } = useToast();
  const [masterPassword, setMasterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isVaultLocked) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterPassword) {
      setError('Please enter your Master Password');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await unlockVault(masterPassword);
      showToast('Vault decrypted successfully', 'success');
      setMasterPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Invalid Master Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
        {/* Lock Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 shadow-lg shadow-blue-500/10">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">Vault is Locked</h3>
        <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
          Enter your Master Password to derive your AES-256 decryption key for{' '}
          <span className="text-slate-200 font-medium">{user?.username || 'this vault'}</span>.
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 text-left">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUnlock} className="mt-6 space-y-4">
          <div className="relative text-left">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Enter master password..."
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 text-sm transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Hint: In preview demo mode, any master password (4+ chars) unlocks the vault.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deriving Key & Decrypting...</span>
              </span>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Unlock Vault</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Logged in as {user?.email}</span>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-rose-400 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
