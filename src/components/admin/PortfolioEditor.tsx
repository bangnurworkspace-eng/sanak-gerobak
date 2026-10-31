/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CMSPortfolioItem,
  getPortfolio,
  savePortfolioItem,
  deletePortfolioItem,
} from '../../services/cmsService';
import { Plus, Trash2, Edit, Save, X, Loader2, Image as ImageIcon, Briefcase, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';

interface PortfolioEditorProps {
  onRefreshPublicSite: () => Promise<void>;
}

export const PortfolioEditor: React.FC<PortfolioEditorProps> = ({ onRefreshPublicSite }) => {
  const [portfolio, setPortfolio] = useState<CMSPortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<CMSPortfolioItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('Bontang, Kalimantan Timur');
  const [category, setCategory] = useState('Coffee Cart');
  const [image, setImage] = useState('/src/assets/images/gerobak_coffee_cart_1793275252747.jpg');
  const [year, setYear] = useState('2024');
  const [description, setDescription] = useState('');
  const [isRealProject, setIsRealProject] = useState<boolean>(true); // Proyek Nyata vs Inspirasi Desain
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getPortfolio(true);
      setPortfolio(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setCurrentItem(null);
    setTitle('');
    setClientName('');
    setLocation('Kota Bontang, Kalimantan Timur');
    setCategory('Coffee Cart');
    setImage('/src/assets/images/gerobak_coffee_cart_1793275252747.jpg');
    setYear(new Date().getFullYear().toString());
    setDescription('');
    setIsRealProject(true);
    setStatus('published');
    setModalOpen(true);
  };

  const openEdit = (item: CMSPortfolioItem) => {
    setCurrentItem(item);
    setTitle(item.title);
    setClientName(item.clientName || '');
    setLocation(item.location || 'Bontang, Kalimantan Timur');
    setCategory(item.category);
    setImage(item.image);
    setYear(item.year || '2024');
    setDescription(item.description);
    setIsRealProject(item.isRealProject);
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    try {
      await savePortfolioItem({
        id: currentItem?.id || `portfolio-${Date.now()}`,
        title,
        clientName,
        location,
        category,
        image,
        gallery: [image],
        year,
        description,
        isRealProject,
        status,
        createdAt: currentItem?.createdAt,
      });

      setModalOpen(false);
      await loadData();
      await onRefreshPublicSite();
    } catch (err: any) {
      alert('Gagal menyimpan portofolio: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Hapus portofolio "${name}"?`)) return;
    setIsLoading(true);
    try {
      await deletePortfolioItem(id);
      await loadData();
      await onRefreshPublicSite();
    } catch (err) {
      alert('Gagal menghapus item.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl font-['Plus_Jakarta_Sans']">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Manrope']">
            Portofolio & Hasil Produksi
          </h2>
          <p className="text-xs text-[#A4A7AE] mt-0.5">
            Dokumentasi unit gerobak nyata yang telah diserahterimakan ke klien di Bontang & Kaltim.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D6B46A] text-[#101827] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C5A154] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek Portofolio</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center text-[#A4A7AE]">
          <Loader2 className="w-8 h-8 animate-spin text-[#D6B46A]" />
        </div>
      ) : portfolio.length === 0 ? (
        <div className="py-16 text-center bg-[#101827] rounded-2xl border border-white/10 p-8 space-y-3">
          <p className="text-sm font-semibold text-white">Belum ada portofolio terdaftar</p>
          <p className="text-xs text-[#A4A7AE]">Mulai tambahkan proyek nyata atau showcase karya SANAK GEROBAK.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="bg-[#101827] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D6B46A]/50 transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0B132B]">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      item.isRealProject
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-blue-500/90 text-white'
                    }`}
                  >
                    {item.isRealProject ? 'Proyek Nyata' : 'Inspirasi Desain'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'published'
                        ? 'bg-white/20 text-white backdrop-blur-md'
                        : 'bg-amber-500/80 text-black'
                    }`}
                  >
                    {item.status === 'published' ? 'Terbit' : 'Draf'}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6B46A]">
                    {item.category} • {item.year}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-[#A4A7AE] line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#A4A7AE]">
                  <span className="flex items-center gap-1 text-[11px] truncate max-w-[150px]">
                    <MapPin className="w-3 h-3 text-[#D6B46A] shrink-0" />
                    <span>{item.location || 'Bontang'}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 text-[#A4A7AE] hover:text-[#D6B46A] hover:bg-white/5 rounded-lg"
                      title="Edit Portofolio"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101827] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="px-6 py-4 bg-[#0B132B] border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-['Manrope']">
                {currentItem ? 'Edit Item Portofolio' : 'Tambah Proyek Portofolio'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#A4A7AE] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Type distinction: Proyek Nyata vs Inspirasi Desain */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Klasifikasi Karya *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRealProject(true)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isRealProject
                        ? 'bg-emerald-500/20 border-emerald-400 text-white'
                        : 'bg-[#0B132B] border-white/10 text-[#A4A7AE]'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">✓ Proyek Nyata Klien</p>
                    <p className="text-[11px] text-[#A4A7AE] mt-0.5">Unit gerobak yang diproduksi dan diserahterimakan.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRealProject(false)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      !isRealProject
                        ? 'bg-blue-500/20 border-blue-400 text-white'
                        : 'bg-[#0B132B] border-white/10 text-[#A4A7AE]'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">✓ Inspirasi / Konsep Desain</p>
                    <p className="text-[11px] text-[#A4A7AE] mt-0.5">Rancangan 3D / eksplorasi visual arsitektur gerobak.</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Nama Proyek / Judul Karya *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Mobile Coffee Booth - Kedai Kopi Bontang Baru"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                    Nama Klien / Brand (Opsional)
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Contoh: Kopi Sanak Kaltim"
                    className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                    Lokasi Workshop / Operasional
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bontang, Samarinda, Balikpapan"
                    className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Coffee Cart / Gerobak Makanan"
                    className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                    Tahun Pengerjaan
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024"
                    className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  >
                    <option value="published">Terbit (Publik)</option>
                    <option value="draft">Draf</option>
                  </select>
                </div>
              </div>

              {/* Foto Proyek */}
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Foto Utama Proyek *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                    className="flex-1 px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                  <button
                    type="button"
                    onClick={() => setMediaModalOpen(true)}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#D6B46A]" />
                    <span>Pilih Foto</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Deskripsi Proyek & Detail Spesifikasi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Catatan pengerjaan, material khusus, durasi produksi, dan kebutuhan operasional..."
                  className="w-full px-3.5 py-2 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#A4A7AE] hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#D6B46A] text-[#101827] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C5A154]"
                >
                  Simpan Portofolio
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectImage={(url) => setImage(url)}
      />

    </div>
  );
};
