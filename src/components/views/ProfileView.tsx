import React from 'react';
import { User as UserIcon, ShieldCheck, Key, Lock, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CredentialItem } from '../../types';

interface ProfileViewProps {
  credentials: CredentialItem[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({ credentials }) => {
  const { user, lockVault, isVaultLocked } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-blue-400" />
          <span>Security Profile</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Identity, key derivation parameters, and active cryptographic session.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-blue-500/20 shrink-0">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>

        <div className="space-y-3 flex-1 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-white">{user?.username || 'Security User'}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.email || 'user@vault.io'}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Knowledge Vault Initialized</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono">
              <span>{credentials.length} Encrypted Items</span>
            </span>
          </div>
        </div>

        <button
          onClick={lockVault}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 flex items-center gap-2 transition-colors shrink-0"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Lock Vault</span>
        </button>
      </div>

      {/* Cryptographic Specifications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Key className="w-4 h-4 text-blue-400" />
            <span>Key Derivation Function (KDF)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Uses <strong>Argon2id</strong> with 64MB memory limit, 3 iterations, and 4 lanes. GPU and ASIC brute-forcing is rendered computationally impractical.
          </p>
          <div className="pt-2 text-[11px] text-slate-400 font-mono">
            Algorithm: Argon2id v19
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Cipher Suite & Integrity</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Data payloads are encrypted with <strong>AES-256-GCM</strong> (Galois/Counter Mode). Authenticated tags ensure zero ciphertext tampering or bit-flipping.
          </p>
          <div className="pt-2 text-[11px] text-slate-400 font-mono">
            Cipher: AES/GCM/NoPadding (256-bit)
          </div>
        </div>
      </div>
    </div>
  );
};
