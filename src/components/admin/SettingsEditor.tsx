/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getSiteSection, saveSiteSection } from '../../services/cmsService';
import { BRAND_CONFIG } from '../../config/brand';
import { Save, Loader2, CheckCircle2, Globe, ShieldCheck } from 'lucide-react';

interface SettingsEditorProps {
  onRefreshPublicSite: () => Promise<void>;
}

export const SettingsEditor: React.FC<SettingsEditorProps> = ({ onRefreshPublicSite }) => {
  const [siteTitle, setSiteTitle] = useState(
    'SANAK GEROBAK | Desain & Pembuatan Gerobak Usaha Custom Bontang'
  );
  const [metaDescription, setMetaDescription] = useState(
    'Spesialis desain dan pembuatan gerobak jualan, booth UMKM, coffee cart, dan kuliner modern di Bontang dan Kalimantan Timur. Desain Custom, Usaha Makin Berkelas.'
  );
  const [announcement, setAnnouncement] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await getSiteSection('settings', null as any);
        if (data) {
          if (data.siteTitle) setSiteTitle(data.siteTitle);
          if (data.metaDescription) setMetaDescription(data.metaDescription);
          if (data.announcement) setAnnouncement(data.announcement);
          if (typeof data.announcementEnabled === 'boolean') {
            setAnnouncementEnabled(data.announcementEnabled);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);
    try {
      const existing = await getSiteSection('settings', {});
      await saveSiteSection('settings', {
        ...existing,
        siteTitle,
        metaDescription,
        announcement,
        announcementEnabled,
        tagline: BRAND_CONFIG.officialTagline,
        supportingSentence: BRAND_CONFIG.supportingSentence,
      });

      // Update document title dynamically
      if (typeof document !== 'undefined') {
        document.title = siteTitle;
      }

      setSaveSuccess(true);
      await onRefreshPublicSite();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage('Gagal menyimpan pengaturan: ' + (err.message || 'Terjadi kesalahan sistem.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-['Plus_Jakarta_Sans']">
      
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Manrope']">
            Pengaturan Website & SEO
          </h2>
          <p className="text-xs text-[#A4A7AE] mt-0.5">
            Konfigurasi metadata mesin pencari, judul browser, dan pengumuman siaran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pengaturan Tersimpan</span>
            </div>
          )}
          {errorMessage && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center text-[#A4A7AE]">
          <Loader2 className="w-8 h-8 animate-spin text-[#D6B46A]" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-[#101827] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          
          {/* Brand Tagline Display */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D6B46A] block">
                Tagline Resmi (Brand Identity Standard)
              </span>
              <p className="text-sm font-bold text-white font-['Manrope'] mt-0.5">
                “{BRAND_CONFIG.officialTagline}”
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-[#D6B46A]" />
          </div>

          {/* Logo & Identitas Brand Resmi */}
          <div className="p-4 rounded-xl bg-[#0B132B] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/20 bg-[#070D19] shrink-0 shadow-md">
              <img
                src={BRAND_CONFIG.logoUrl}
                alt="Logo SANAK GEROBAK"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Logo Brand Resmi SANAK GEROBAK</p>
              <p className="text-[11px] text-[#A4A7AE] mt-0.5 leading-relaxed">
                Asset logo resmi telah terpasang di Navbar, Footer, Favicon browser tab, dan Portal Admin CMS.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
              Judul Dokumen Web (HTML Title / Google Search Result) *
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
            />
            <p className="text-[11px] text-[#A4A7AE] mt-1">Disarankan 50-60 karakter untuk keterbacaan optimal di Google Search.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
              Deskripsi Meta SEO (Snippet Cuplikan Pencarian) *
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              required
              className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
            />
            <p className="text-[11px] text-[#A4A7AE] mt-1">Rangkuman ringkas layanan gerobak di Bontang dan Kalimantan Timur.</p>
          </div>

          {/* SERP Search Preview */}
          <div className="p-4 rounded-xl bg-[#0B132B] border border-white/10 space-y-1">
            <span className="text-[10px] font-semibold text-[#A4A7AE] uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#D6B46A]" />
              <span>Pratinjau Hasil Pencarian Google</span>
            </span>
            <div className="pt-1">
              <p className="text-sm font-semibold text-[#8AB4F8] hover:underline cursor-pointer truncate">
                {siteTitle}
              </p>
              <p className="text-[11px] text-[#008744] font-mono">
                https://sanakgerobak.com/
              </p>
              <p className="text-xs text-[#BDC1C6] line-clamp-2 mt-0.5">
                {metaDescription}
              </p>
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider">
                Bilah Pengumuman Khusus (Top Announcement Bar)
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D6B46A]"></div>
              </label>
            </div>

            {announcementEnabled && (
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Contoh: Buka slot produksi gerobak custom bulan ini untuk wilayah Bontang & Samarinda!"
                className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
            )}
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
                  <span>Simpan Pengaturan Website</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
