import React from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  KeyRound,
  PlusCircle,
  Search,
  Zap,
  FolderLock,
  Tag,
  ShieldAlert,
  User as UserIcon,
  Settings,
  LogOut,
  Lock,
  Unlock,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export type ActiveView =
  | 'dashboard'
  | 'vault'
  | 'search'
  | 'generator'
  | 'security'
  | 'folders'
  | 'tags'
  | 'profile'
  | 'settings';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenAddModal: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onOpenAddModal,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { user, logout, isVaultLocked, lockVault, backendConnected } = useAuth();
  const { showToast } = useToast();

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setIsMobileOpen(false);
  };

  const handleLockClick = async () => {
    await lockVault();
    showToast('Vault locked securely', 'info');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vault', label: 'My Vault', icon: KeyRound },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'generator', label: 'Password Generator', icon: Zap },
    { id: 'folders', label: 'Folders', icon: FolderLock },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'security', label: 'Security Dashboard', icon: ShieldAlert },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-950/90 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Quick Add */}
        <div>
          {/* Logo Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-800/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  FortressPass
                </h1>
                <p className="text-[10px] text-blue-400 font-mono tracking-wider">ZERO-KNOWLEDGE</p>
              </div>
            </div>

            {/* Backend Connection Indicator */}
            <div
              title={
                backendConnected === true
                  ? 'Spring Boot Backend: Connected'
                  : 'Spring Boot Backend: Disconnected (Demo Mode)'
              }
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900 border border-slate-800"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  backendConnected === true
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-amber-400'
                }`}
              />
            </div>
          </div>

          {/* Quick Add CTA */}
          <div className="p-4">
            <button
              onClick={() => {
                onOpenAddModal();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all transform active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Credential</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ActiveView)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Vault Status, User Card, Lock & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* Vault Lock Quick Toggle */}
          <button
            onClick={handleLockClick}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              {isVaultLocked ? (
                <Lock className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{isVaultLocked ? 'Vault is Locked' : 'Vault is Unlocked'}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">LOCK</span>
          </button>

          {/* User Profile Info */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user?.username || 'Security User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'user@vault.io'}</p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                logout();
                showToast('Logged out of session', 'info');
              }}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
