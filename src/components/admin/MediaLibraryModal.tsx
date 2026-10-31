/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CMSMediaItem,
  getMediaItems,
  uploadMediaFile,
  saveMediaUrlDirectly,
  deleteMediaItem,
} from '../../services/cmsService';
import { Upload, X, Trash2, Check, Image as ImageIcon, Loader2, Link2 } from 'lucide-react';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const [mediaList, setMediaList] = useState<CMSMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [altTextInput, setAltTextInput] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library');

  const defaultPresets: { url: string; name: string }[] = [
    { url: '/src/assets/images/hero_gerobak_bontang_1793275251642.jpg', name: 'Hero Gerobak Bontang' },
    { url: '/src/assets/images/gerobak_coffee_cart_1793275252747.jpg', name: 'Sanak Artisan Coffee Cart' },
    { url: '/src/assets/images/gerobak_street_food_1793275253637.jpg', name: 'Urban Street Food Cart' },
    { url: '/src/assets/images/gerobak_minimalist_kiosk_1793275672764.jpg', name: 'Minimalist Ivory Kiosk' },
    { url: '/src/assets/images/gerobak_booth_container_1793275253367.jpg', name: 'Modular Container Kiosk' },
    { url: '/src/assets/images/gerobak_bakery_pastry_1793275254248.jpg', name: 'Golden Crust Bakery Cart' },
    { url: '/src/assets/images/gerobak_boba_tea_1793275672520.jpg', name: 'Fresh Boba & Mocktail Station' },
    { url: '/src/assets/images/bontang_local_culinary_1793275672214.jpg', name: 'Kuliner Lokal Bontang' },
  ];

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const items = await getMediaItems();
      setMediaList(items);
    } catch (err) {
      console.warn('Failed to load media items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadMediaFile(file, altTextInput || file.name);
      setMediaList([uploaded, ...mediaList]);
      setActiveTab('library');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Gagal mengunggah file. Pastikan ukuran file sesuai dan koneksi stabil.');
    } finally {
      setIsUploading(false);
      setAltTextInput('');
    }
  };

  const handleAddDirectUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    setIsUploading(true);
    try {
      const filename = urlInput.split('/').pop() || 'Gambar Media';
      const item = await saveMediaUrlDirectly(urlInput, filename, altTextInput || filename);
      setMediaList([item, ...mediaList]);
      setUrlInput('');
      setAltTextInput('');
      setActiveTab('library');
    } catch (err) {
      alert('Gagal menambahkan tautan gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (item: CMSMediaItem) => {
    if (!window.confirm(`Hapus gambar "${item.filename}"?`)) return;
    try {
      await deleteMediaItem(item);
      setMediaList(mediaList.filter((m) => m.id !== item.id));
    } catch (err) {
      alert('Gagal menghapus gambar.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md font-['Plus_Jakarta_Sans']">
      <div className="bg-[#101827] border border-white/10 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B132B]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D6B46A]/20 border border-[#D6B46A]/40 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-[#D6B46A]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Manrope']">
                Media Library SANAK GEROBAK
              </h3>
              <p className="text-xs text-[#A4A7AE]">
                Kelola dan pilih gambar untuk gerobak, booth, dan konten website.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A4A7AE] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-white/5 bg-[#101827]">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'library'
                ? 'bg-[#D6B46A] text-[#101827]'
                : 'text-[#A4A7AE] hover:text-white hover:bg-white/5'
            }`}
          >
            Pustaka Media ({mediaList.length + defaultPresets.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-[#D6B46A] text-[#101827]'
                : 'text-[#A4A7AE] hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah dari Komputer</span>
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-[#D6B46A] text-[#101827]'
                : 'text-[#A4A7AE] hover:text-white hover:bg-white/5'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Tautkan URL Gambar</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'library' && (
            <div className="space-y-6">
              {/* Presets Gallery */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#D6B46A] mb-3">
                  Aset Studio Bawaan
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {defaultPresets.map((preset, idx) => (
                    <div
                      key={idx}
                      className="group relative bg-[#0B132B] border border-white/10 rounded-xl overflow-hidden hover:border-[#D6B46A] transition-all cursor-pointer"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-white truncate">{preset.name}</p>
                        <button
                          onClick={() => {
                            onSelectImage(preset.url);
                            onClose();
                          }}
                          className="mt-2 w-full py-1 text-[11px] font-semibold bg-[#D6B46A] text-[#101827] rounded-md hover:bg-[#C5A154] flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Pilih Gambar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uploaded items */}
              {mediaList.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#D6B46A] mb-3">
                    Unggahan Cloud Firestore / Storage
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {mediaList.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-[#0B132B] border border-white/10 rounded-xl overflow-hidden hover:border-[#D6B46A] transition-all"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={item.url}
                            alt={item.altText || item.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold text-white truncate">{item.filename}</p>
                          <div className="mt-2 flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                onSelectImage(item.url);
                                onClose();
                              }}
                              className="flex-1 py-1 text-[11px] font-semibold bg-[#D6B46A] text-[#101827] rounded-md hover:bg-[#C5A154] flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Pilih</span>
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="max-w-md mx-auto py-10 text-center space-y-4">
              <div className="border-2 border-dashed border-white/20 hover:border-[#D6B46A] rounded-2xl p-8 transition-colors">
                <Upload className="w-12 h-12 text-[#D6B46A] mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white mb-1">
                  Pilih Berkas Foto Gerobak / Booth
                </h4>
                <p className="text-xs text-[#A4A7AE] mb-4">
                  Format JPG, PNG, atau WebP (Disarankan resolusi tajam dengan rasio 16:9 atau 4:3).
                </p>

                <input
                  type="file"
                  id="media-file-input"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />

                <label
                  htmlFor="media-file-input"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D6B46A] text-[#101827] font-semibold text-xs rounded-xl hover:bg-[#C5A154] cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <span>Cari Berkas di Komputer</span>
                  )}
                </label>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <form onSubmit={handleAddDirectUrl} className="max-w-lg mx-auto py-8 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Tautan URL Gambar (HTTP / HTTPS)
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full px-4 py-3 bg-[#0B132B] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Teks Alternatif (Alt Text / Deskripsi Singkat)
                </label>
                <input
                  type="text"
                  value={altTextInput}
                  onChange={(e) => setAltTextInput(e.target.value)}
                  placeholder="Contoh: Gerobak Kopi Kayu Jati Bontang"
                  className="w-full px-4 py-3 bg-[#0B132B] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-[#D6B46A] text-[#101827] font-bold text-xs rounded-xl uppercase tracking-wider hover:bg-[#C5A154]"
              >
                Simpan & Tambahkan ke Pustaka
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#0B132B] flex items-center justify-between text-xs text-[#A4A7AE]">
          <span>Semua aset tersimpan di Cloud Storage SANAK GEROBAK.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
