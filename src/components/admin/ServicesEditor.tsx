/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getSiteSection, saveSiteSection } from '../../services/cmsService';
import { ServiceItem } from '../../config/brand';
import { Save, Loader2, CheckCircle2, Wrench, Plus, Trash2 } from 'lucide-react';

interface ServicesEditorProps {
  onRefreshPublicSite: () => Promise<void>;
}

export const ServicesEditor: React.FC<ServicesEditorProps> = ({ onRefreshPublicSite }) => {
  const [title, setTitle] = useState('Dari Ide Menjadi Identitas Usaha.');
  const [subtitle, setSubtitle] = useState(
    'Layanan terintegrasi mulai dari perancangan konsep visual hingga unit gerobak siap pakai untuk menyambut pelanggan pertama Anda.'
  );
  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: 'custom-cart',
      number: '01',
      title: 'Pembuatan Gerobak Custom',
      description: 'Pembuatan gerobak jualan outdoor & indoor dengan spesifikasi material tahan karat, kelistrikan terintegrasi, dan kompartemen ergonomis.',
      deliverables: ['Rangka baja & plat galvanis tahan karat', 'Meja kerja food-grade stainless / solid wood', 'Instalasi lampu LED & saklar terpadu'],
    },
    {
      id: 'booth-kiosk',
      number: '02',
      title: 'Booth & Kios UMKM Modular',
      description: 'Pembangunan booth semi-permanen dan kios kontainer berdimensi fleksibel untuk mall, food court, maupun lahan sewa outdoor.',
      deliverables: ['Sistem buka-tutup hidrolik / kanopi lipat', 'Struktur modular mudah dipindahkan', 'Pilihan finishing powder coating anti-cuaca'],
    },
    {
      id: 'branding-signage',
      number: '03',
      title: 'Visual Branding & Signage',
      description: 'Penyelarasan palet warna brand, neon flex sign, sticker vinyl laminasi doff/glossy, dan papan nama usaha yang mencolok.',
      deliverables: ['Desain logo & penempatan identitas visual', 'Neon flex / neon box akrilik hemat daya', 'Sticker decal tahan sinar UV & hujan'],
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      try {
        const data = await getSiteSection('services', null as any);
        if (data) {
          if (data.title) setTitle(data.title);
          if (data.subtitle) setSubtitle(data.subtitle);
          if (data.items) setServices(data.items);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadServices();
  }, []);

  const handleUpdateDeliverable = (sIndex: number, dIndex: number, val: string) => {
    const updated = [...services];
    updated[sIndex].deliverables[dIndex] = val;
    setServices(updated);
  };

  const handleAddDeliverable = (sIndex: number) => {
    const updated = [...services];
    updated[sIndex].deliverables.push('Poin fitur atau layanan baru...');
    setServices(updated);
  };

  const handleRemoveDeliverable = (sIndex: number, dIndex: number) => {
    const updated = [...services];
    updated[sIndex].deliverables = updated[sIndex].deliverables.filter((_, idx) => idx !== dIndex);
    setServices(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await saveSiteSection('services', {
        title,
        subtitle,
        items: services,
      });
      setSaveSuccess(true);
      await onRefreshPublicSite();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Gagal menyimpan layanan: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-['Plus_Jakarta_Sans']">
      
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Manrope']">
            Pengelolaan Layanan Usaha
          </h2>
          <p className="text-xs text-[#A4A7AE] mt-0.5">
            Kelola judul section, deskripsi, dan poin deliverables pada 3 pilar layanan SANAK GEROBAK.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Tersimpan di Cloud</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center text-[#A4A7AE]">
          <Loader2 className="w-8 h-8 animate-spin text-[#D6B46A]" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-[#101827] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Judul Section Layanan
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Sub-Judul / Keterangan Pendukung
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
            </div>
          </div>

          <div className="space-y-5 pt-3 border-t border-white/10">
            <h3 className="text-sm font-bold text-white font-['Manrope']">
              Tiga Pilar Layanan Utama
            </h3>

            {services.map((item, sIndex) => (
              <div key={item.id} className="p-5 rounded-2xl bg-[#0B132B] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#D6B46A]/20 text-[#D6B46A] flex items-center justify-center font-bold text-xs font-mono">
                    {item.number}
                  </span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...services];
                      updated[sIndex].title = e.target.value;
                      setServices(updated);
                    }}
                    placeholder="Nama Layanan"
                    className="flex-1 px-3 py-1.5 bg-[#101827] border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                </div>

                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...services];
                    updated[sIndex].description = e.target.value;
                    setServices(updated);
                  }}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#101827] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#A4A7AE] uppercase tracking-wider text-[10px]">
                      Poin Deliverables / Spesifikasi
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddDeliverable(sIndex)}
                      className="text-[#D6B46A] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Poin</span>
                    </button>
                  </div>

                  {item.deliverables.map((deliv, dIndex) => (
                    <div key={dIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={deliv}
                        onChange={(e) => handleUpdateDeliverable(sIndex, dIndex, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-[#101827] border border-white/5 rounded-lg text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(sIndex, dIndex)}
                        className="p-1.5 text-red-400 hover:text-red-300 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D6B46A] text-[#101827] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C5A154] disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Cloud...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Layanan</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
