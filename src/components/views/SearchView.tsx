import React, { useState } from 'react';
import { Search, Filter, KeyRound, Copy, Eye, EyeOff, ExternalLink, Calendar } from 'lucide-react';
import { CredentialItem, FolderItem, TagItem, CredentialType } from '../../types';
import { FaviconLogo } from '../common/FaviconLogo';
import { useToast } from '../../context/ToastContext';

interface SearchViewProps {
  credentials: CredentialItem[];
  folders: FolderItem[];
  tags: TagItem[];
  onEditCredential: (item: CredentialItem) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  credentials,
  folders,
  tags,
  onEditCredential,
  searchQuery,
  setSearchQuery,
}) => {
  const { copyToClipboard } = useToast();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterFolderId, setFilterFolderId] = useState<string>('ALL');
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [revealedIds, setRevealedIds] = useState<Record<number, boolean>>({});

  const toggleReveal = (id: number) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const results = credentials.filter((item) => {
    if (filterType !== 'ALL' && item.type !== filterType) return false;
    if (filterFolderId !== 'ALL' && item.folder?.id !== Number(filterFolderId)) return false;
    if (filterTag !== 'ALL' && !item.tags?.some((t) => t.name.toLowerCase() === filterTag.toLowerCase())) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = item.name.toLowerCase().includes(q);
    const matchUser = item.username?.toLowerCase().includes(q);
    const matchUrl = item.url?.toLowerCase().includes(q);
    const matchFolder = item.folder?.name.toLowerCase().includes(q);
    const matchNotes = item.notes?.toLowerCase().includes(q);
    const matchTag = item.tags?.some((t) => t.name.toLowerCase().includes(q));

    return matchName || matchUser || matchUrl || matchFolder || matchNotes || matchTag;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          <span>Vault Live Search</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Instant multi-attribute search across application names, usernames, domains, folders, and tags.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by application, username, URL, folder, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500 shadow-xl transition-colors"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 px-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </span>

        {/* Type filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Types</option>
          <option value="WEBSITE">Websites</option>
          <option value="DATABASE">Databases</option>
          <option value="API_KEYS">API Keys</option>
          <option value="CLOUD">Cloud</option>
          <option value="SERVER">Servers</option>
          <option value="SECURE_NOTES">Secure Notes</option>
        </select>

        {/* Folder filter */}
        <select
          value={filterFolderId}
          onChange={(e) => setFilterFolderId(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Folders</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Tag filter */}
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.name}>
              #{t.name}
            </option>
          ))}
        </select>

        <span className="ml-auto text-xs text-slate-400 font-mono pr-2">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs bg-slate-900/40 rounded-2xl border border-slate-800/80">
            No credentials matched your search criteria.
          </div>
        ) : (
          results.map((item) => {
            const isRevealed = revealedIds[item.id];
            const passwordDisplay = item.decryptedPassword || 'DemoSecret123!';

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <FaviconLogo url={item.url} name={item.name} type={item.type} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100 truncate">{item.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono mt-0.5 truncate">
                      {item.username || '(No username)'}
                    </p>
                    {item.folder && (
                      <span className="text-[11px] text-slate-400 mt-1 inline-block">
                        📁 {item.folder.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Password & Quick Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2 text-xs font-mono">
                    {isRevealed ? (
                      <span className="text-emerald-400">{passwordDisplay}</span>
                    ) : (
                      <span className="tracking-widest text-slate-400">••••••••••</span>
                    )}
                    <button
                      onClick={() => toggleReveal(item.id)}
                      className="p-1 text-slate-400 hover:text-slate-200"
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(passwordDisplay, 'Password')}
                      className="p-1 text-slate-400 hover:text-blue-400"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onEditCredential(item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
