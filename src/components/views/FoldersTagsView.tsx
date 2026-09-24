import React, { useState } from 'react';
import { FolderLock, Tag, Plus, Edit2, Trash2, Folder, Check } from 'lucide-react';
import { FolderItem, TagItem, CredentialItem } from '../../types';
import { foldersApi, tagsApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Modal } from '../common/Modal';

interface FoldersTagsViewProps {
  folders: FolderItem[];
  tags: TagItem[];
  credentials: CredentialItem[];
  onRefresh: () => void;
  initialTab?: 'folders' | 'tags';
}

export const FoldersTagsView: React.FC<FoldersTagsViewProps> = ({
  folders,
  tags,
  credentials,
  onRefresh,
  initialTab = 'folders',
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'folders' | 'tags'>(initialTab);

  // Folder modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null);
  const [folderName, setFolderName] = useState('');

  // Tag modal state
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#3B82F6');

  // Deletion confirm
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'folder' | 'tag'; item: any } | null>(null);

  const colorPresets = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];

  const getFolderCount = (folderId: number) => {
    return credentials.filter((c) => c.folder?.id === folderId).length;
  };

  const getTagCount = (tagId: number) => {
    return credentials.filter((c) => c.tags?.some((t) => t.id === tagId)).length;
  };

  const handleSaveFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    try {
      if (editingFolder) {
        await foldersApi.update(editingFolder.id, folderName.trim());
        showToast('Folder updated', 'success');
      } else {
        await foldersApi.create(folderName.trim());
        showToast('Folder created', 'success');
      }
      setIsFolderModalOpen(false);
      setFolderName('');
      setEditingFolder(null);
      onRefresh();
    } catch {
      showToast('Failed to save folder', 'error');
    }
  };

  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;

    try {
      if (editingTag) {
        await tagsApi.update(editingTag.id, tagName.trim(), tagColor);
        showToast('Tag updated', 'success');
      } else {
        await tagsApi.create(tagName.trim(), tagColor);
        showToast('Tag created', 'success');
      }
      setIsTagModalOpen(false);
      setTagName('');
      setEditingTag(null);
      onRefresh();
    } catch {
      showToast('Failed to save tag', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'folder') {
        await foldersApi.delete(deleteTarget.item.id);
        showToast(`Folder "${deleteTarget.item.name}" deleted`, 'success');
      } else {
        await tagsApi.delete(deleteTarget.item.id);
        showToast(`Tag "${deleteTarget.item.name}" deleted`, 'success');
      }
      setDeleteTarget(null);
      onRefresh();
    } catch {
      showToast('Deletion failed', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-blue-400" />
            <span>Vault Taxonomy Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize credentials into logical hierarchy and security label tags.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('folders')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'folders'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Folders ({folders.length})
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tags'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tags ({tags.length})
          </button>
        </div>
      </div>

      {/* FOLDERS TAB */}
      {activeTab === 'folders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Vault Folders</span>
            <button
              onClick={() => {
                setEditingFolder(null);
                setFolderName('');
                setIsFolderModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Folder</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {folders.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{f.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {getFolderCount(f.id)} credential{getFolderCount(f.id) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingFolder(f);
                      setFolderName(f.name);
                      setIsFolderModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'folder', item: f })}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAGS TAB */}
      {activeTab === 'tags' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Security Tags</span>
            <button
              onClick={() => {
                setEditingTag(null);
                setTagName('');
                setTagColor('#3B82F6');
                setIsTagModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Tag</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tags.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: t.colorHex }}
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">#{t.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {getTagCount(t.id)} item{getTagCount(t.id) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingTag(t);
                      setTagName(t.name);
                      setTagColor(t.colorHex);
                      setIsTagModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: 'tag', item: t })}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Folder Modal */}
      <Modal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        title={editingFolder ? 'Edit Folder' : 'New Folder'}
        maxWidth="sm"
      >
        <form onSubmit={handleSaveFolder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Folder Name</label>
            <input
              type="text"
              placeholder="e.g. Production Infrastructure"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFolderModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20"
            >
              Save Folder
            </button>
          </div>
        </form>
      </Modal>

      {/* Tag Modal */}
      <Modal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        title={editingTag ? 'Edit Tag' : 'New Tag'}
        maxWidth="sm"
      >
        <form onSubmit={handleSaveTag} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tag Name</label>
            <input
              type="text"
              placeholder="e.g. high-security"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Color Accent</label>
            <div className="flex items-center gap-2">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setTagColor(c)}
                  className="w-7 h-7 rounded-full flex items-center justify-center border border-white/20 transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                >
                  {tagColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsTagModalOpen(false)}
              className="px-3.5 py-2 text-xs font-medium text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20"
            >
              Save Tag
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteTarget?.type === 'folder' ? 'Folder' : 'Tag'}`}
        message={`Are you sure you want to remove "${deleteTarget?.item?.name}"? Associated credentials will not be deleted, but will be unassigned.`}
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div>
  );
};
