/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CMSCategory,
  CMSProduct,
  getCategories,
  getProducts,
  saveCategory,
  deleteCategory,
  restoreDefaultCategories,
} from '../../services/cmsService';
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  RefreshCw,
  FolderTree,
  AlertTriangle,
} from 'lucide-react';

interface CategoryEditorProps {
  onRefreshPublicSite: () => Promise<void>;
}

export const CategoryEditor: React.FC<CategoryEditorProps> = ({ onRefreshPublicSite }) => {
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [products, setProducts] = useState<CMSProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCat, setCurrentCat] = useState<CMSCategory | null>(null);
  const [label, setLabel] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<CMSCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback Banner State
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [catData, prodData] = await Promise.all([getCategories(), getProducts(true)]);
      setCategories(catData);
      setProducts(prodData);
    } catch (err: any) {
      showFeedback('error', 'Gagal memuat daftar kategori: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const openAdd = () => {
    setCurrentCat(null);
    setLabel('');
    setSlug('');
    setDescription('');
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.sortOrder || 0), 0);
    setSortOrder(maxOrder + 1);
    setModalOpen(true);
  };

  const openEdit = (cat: CMSCategory) => {
    setCurrentCat(cat);
    setLabel(cat.label);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setSortOrder(cat.sortOrder || 1);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLabel = label.trim();
    if (!cleanLabel) {
      showFeedback('error', 'Nama kategori tidak boleh kosong.');
      return;
    }

    const cleanSlug = generateSlug(slug || cleanLabel);
    if (!cleanSlug) {
      showFeedback('error', 'Slug identifier tidak valid.');
      return;
    }

    setIsSaving(true);
    try {
      const targetId = currentCat ? currentCat.id : cleanSlug;
      await saveCategory(
        {
          id: targetId,
          slug: cleanSlug,
          label: cleanLabel,
          description: description.trim(),
          sortOrder: Number(sortOrder) || 1,
        },
        currentCat?.id,
        currentCat?.slug
      );

      setModalOpen(false);
      await loadData();
      await onRefreshPublicSite();
      showFeedback(
        'success',
        currentCat
          ? `Kategori "${cleanLabel}" berhasil diperbarui.`
          : `Kategori "${cleanLabel}" berhasil ditambahkan.`
      );
    } catch (err: any) {
      showFeedback('error', 'Gagal menyimpan kategori: ' + (err.message || 'Terjadi kesalahan.'));
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      const deletedName = deleteTarget.label;
      setDeleteTarget(null);
      await loadData();
      await onRefreshPublicSite();
      showFeedback('success', `Kategori "${deletedName}" berhasil dihapus.`);
    } catch (err: any) {
      showFeedback('error', 'Gagal menghapus kategori: ' + (err.message || 'Terjadi kesalahan.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const itemA = categories[index];
    const itemB = categories[targetIndex];

    const orderA = itemB.sortOrder || targetIndex + 1;
    const orderB = itemA.sortOrder || index + 1;

    setIsLoading(true);
    try {
      await Promise.all([
        saveCategory({ ...itemA, sortOrder: orderA === orderB ? targetIndex + 1 : orderA }),
        saveCategory({ ...itemB, sortOrder: orderA === orderB ? index + 1 : orderB }),
      ]);
      await loadData();
      await onRefreshPublicSite();
      showFeedback('success', 'Urutan kategori berhasil diperbarui.');
    } catch (err: any) {
      showFeedback('error', 'Gagal mengubah urutan kategori.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreDefaults = async () => {
    setIsLoading(true);
    try {
      await restoreDefaultCategories();
      await loadData();
      await onRefreshPublicSite();
      showFeedback('success', 'Kategori bawaan berhasil dipulihkan.');
    } catch (err: any) {
      showFeedback('error', 'Gagal memulihkan kategori bawaan.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProductCountForCategory = (cat: CMSCategory) => {
    return products.filter(
      (p) =>
        p.category === cat.slug ||
        p.category === cat.id ||
        p.categoryLabel?.toLowerCase() === cat.label.toLowerCase()
    ).length;
  };

  return (
    <div className="space-y-6 max-w-5xl font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Manrope']">
            Taksonomi Kategori Usaha
          </h2>
          <p className="text-xs text-[#A4A7AE] mt-0.5">
            Tambah, edit nama/slug, ubah urutan, atau hapus kategori filter pada katalog website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            disabled={isLoading}
            title="Kembalikan kategori standar jika ada yang terhapus"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#A4A7AE] hover:text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pulihkan Bawaan</span>
          </button>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D6B46A] text-[#101827] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C5A154] transition-colors cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kategori</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Table */}
      {isLoading ? (
        <div className="py-20 flex justify-center text-[#A4A7AE]">
          <Loader2 className="w-8 h-8 animate-spin text-[#D6B46A]" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-[#101827] border border-white/10 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D6B46A]/10 border border-[#D6B46A]/20 flex items-center justify-center mx-auto text-[#D6B46A]">
            <FolderTree className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Belum Ada Kategori</h3>
            <p className="text-xs text-[#A4A7AE] max-w-md mx-auto">
              Daftar kategori kosong. Anda dapat menambahkan kategori baru atau memulihkan kategori bawaan.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white cursor-pointer"
            >
              Pulihkan Kategori Bawaan
            </button>
            <button
              type="button"
              onClick={openAdd}
              className="px-4 py-2.5 rounded-xl bg-[#D6B46A] text-[#101827] text-xs font-bold cursor-pointer"
            >
              + Tambah Kategori Baru
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#101827] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B132B] text-[#A4A7AE] uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4 w-24">Urutan</th>
                  <th className="py-3.5 px-4">Nama & Deskripsi Kategori</th>
                  <th className="py-3.5 px-4">Slug Identifier</th>
                  <th className="py-3.5 px-4 text-center">Produk</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {categories.map((c, idx) => {
                  const count = getProductCountForCategory(c);
                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#D6B46A] w-6 text-center">
                            {c.sortOrder}
                          </span>
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(idx, 'up')}
                              disabled={idx === 0}
                              title="Geser ke atas"
                              className="p-0.5 text-[#A4A7AE] hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(idx, 'down')}
                              disabled={idx === categories.length - 1}
                              title="Geser ke bawah"
                              className="p-0.5 text-[#A4A7AE] hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{c.label}</div>
                        {c.description && (
                          <div className="text-[11px] text-[#A4A7AE] mt-0.5 line-clamp-1">
                            {c.description}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-[#0B132B] border border-white/10 text-[#A4A7AE] font-mono text-[11px]">
                          {c.slug}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 text-[#FDFBF7] border border-white/10">
                          {count} item
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#D6B46A] bg-[#D6B46A]/10 hover:bg-[#D6B46A]/20 border border-[#D6B46A]/30 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101827] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white font-['Manrope']">
                {currentCat ? `Edit Kategori: ${currentCat.label}` : 'Tambah Kategori Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#A4A7AE] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLabel(val);
                    if (!currentCat) {
                      setSlug(generateSlug(val));
                    }
                  }}
                  placeholder="Contoh: Gerobak Angkringan Modern"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider">
                    Slug Identifier *
                  </label>
                  <button
                    type="button"
                    onClick={() => setSlug(generateSlug(label))}
                    className="inline-flex items-center gap-1 text-[11px] text-[#D6B46A] hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sesuaikan dari Nama</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="gerobak-angkringan-modern"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Penjelasan singkat mengenai jenis gerobak pada kategori ini..."
                  className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Urutan Tampil (Nomor)
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  min={1}
                  className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#A4A7AE] hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D6B46A] text-[#101827] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C5A154] disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{currentCat ? 'Simpan Perubahan' : 'Simpan Kategori'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101827] border border-red-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-['Manrope']">
                  Hapus Kategori "{deleteTarget.label}"?
                </h3>
                <p className="text-xs text-[#A4A7AE] leading-relaxed">
                  Kategori dengan slug <span className="text-white font-mono">{deleteTarget.slug}</span> akan dihapus dari daftar filter katalog publik.
                </p>
                {getProductCountForCategory(deleteTarget) > 0 && (
                  <p className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 mt-2">
                    Terdapat <strong>{getProductCountForCategory(deleteTarget)} produk</strong> pada kategori ini. Produk tidak akan ikut terhapus, namun Anda dapat memperbarui kategori produk tersebut di menu Katalog Gerobak.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-[#A4A7AE] hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Ya, Hapus Kategori</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
