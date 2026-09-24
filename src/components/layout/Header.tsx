import React from 'react';
import { Menu, Search, Plus, Lock, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ActiveView } from './Sidebar';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenAddModal: () => void;
  onToggleMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenAddModal,
  onToggleMobileMenu,
  searchQuery,
  setSearchQuery,
}) => {
  const { lockVault, isVaultLocked } = useAuth();

  const viewTitles: Record<ActiveView, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview & Security Posture' },
    vault: { title: 'My Vault', subtitle: 'Encrypted Credential Repository' },
    search: { title: 'Vault Search', subtitle: 'Real-time multi-attribute query' },
    generator: { title: 'Password Generator', subtitle: 'Cryptographic Shannon Entropy' },
    folders: { title: 'Folders', subtitle: 'Hierarchical vault categorization' },
    tags: { title: 'Tags', subtitle: 'Color-coded security labels' },
    security: { title: 'Security Dashboard', subtitle: 'Vault health, weak & duplicate audit' },
    profile: { title: 'Security Profile', subtitle: 'Master key derivation & settings' },
    settings: { title: 'Settings', subtitle: 'Zero-Knowledge configuration' },
  };

  const current = viewTitles[activeView] || { title: 'Vault', subtitle: 'Secure Manager' };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-400 hover:text-slate-100 rounded-xl hover:bg-slate-900 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base font-bold text-slate-100">{current.title}</h2>
          <p className="text-xs text-slate-400 hidden sm:block">{current.subtitle}</p>
        </div>
      </div>

      {/* Middle/Right: Quick Search bar, Lock Vault, Add Credential */}
      <div className="flex items-center gap-3">
        {/* Search input in header */}
        <div className="relative hidden md:block w-64 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vault (Ctrl + K)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeView !== 'search' && activeView !== 'vault') {
                setActiveView('vault');
              }
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Lock Vault Button */}
        <button
          onClick={lockVault}
          title={isVaultLocked ? 'Vault Locked' : 'Lock Vault Now'}
          className="p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-900 border border-slate-800/80 transition-colors"
        >
          <Lock className="w-4 h-4" />
        </button>

        {/* Add Credential Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Item</span>
        </button>
      </div>
    </header>
  );
};
