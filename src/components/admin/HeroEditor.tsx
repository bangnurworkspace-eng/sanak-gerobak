/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getSiteSection, saveSiteSection } from '../../services/cmsService';
import { BRAND_CONFIG } from '../../config/brand';
import { Save, Loader2, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';

interface HeroEditorProps {
  onRefreshPublicSite: () => Promise<void>;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ onRefreshPublicSite }) => {
  const [title, setTitle] = useState('Solusi Gerobak & Booth Usaha Berkelas.');
  const [tagline, setTagline] = useState(BRAND_CONFIG.officialTagline);
  const [supportingText, setSupportingText] = useState(
    'Kami merancang dan memproduksi gerobak jualan serta booth usaha modern dengan material kokoh, tata ruang fungsional, dan estetika yang memikat pelanggan.'
  );
  const [heroImage, setHeroImage] = useState('/src/assets/images/hero_gerobak_bontang_1793275251642.jpg');
  const [badgeText, setBadgeText] = useState('Spesialis Gerobak & Booth Custom Bontang');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadHero = async () => {
      setIsLoading(true);
      try {
        const data = await getSiteSection('hero', {
          title: 'Solusi Gerobak & Booth Usaha Berkelas.',
          tagline: BRAND_CONFIG.officialTagline,
          supportingText:
            'Kami merancang dan memproduksi gerobak jualan serta booth usaha modern dengan material kokoh, tata ruang fungsional, dan estetika yang memikat pelanggan.',
          heroImage: '/src/assets/images/hero_gerobak_bontang_1793275251642.jpg',
          badgeText: 'Spesialis Gerobak & Booth Custom Bontang',
          status: 'published' as const,
        });
        if (data) {
          setTitle(data.title);
          setTagline(data.tagline);
          setSupportingText(data.supportingText);
          setHeroImage(data.heroImage);
          setBadgeText(data.badgeText);
          setStatus(data.status || 'published');
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadHero();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await saveSiteSection('hero', {
        title,
        tagline: BRAND_CONFIG.officialTagline, // Enforce brand compliance
        supportingText,
        heroImage,
        badgeText,
        status,
      });
      setSaveSuccess(true);
      await onRefreshPublicSite();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert('Gagal menyimpan Hero Section: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-['Plus_Jakarta_Sans']">
      
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Manrope']">
            Konten Beranda & Hero Section
          </h2>
          <p className="text-xs text-[#A4A7AE] mt-0.5">
            Atur judul pembuka, visual gerobak utama, dan narasi brand halaman muka.
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
          
          {/* Tagline Lock Notice */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D6B46A]">
              Semboyan Resmi SANAK GEROBAK (Standar Brand)
            </span>
            <p className="text-sm font-bold text-white font-['Manrope']">
              “{BRAND_CONFIG.officialTagline}”
            </p>
            <p className="text-xs text-[#A4A7AE]">
              Tagline resmi terkunci demi konsistensi identitas merek dagang sesuai arahan panduan brand.
            </p>
          </div>

          {/* Badge Text */}
          <div>
            <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
              Teks Lencana (Hero Badge)
            </label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="Spesialis Gerobak & Booth Custom Bontang"
              required
              className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
            />
          </div>

          {/* Hero Headline */}
          <div>
            <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
              Judul Utama (Headline)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Solusi Gerobak & Booth Usaha Berkelas."
              required
              className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
            />
          </div>

          {/* Supporting Paragraph */}
          <div>
            <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
              Paragraf Pendukung (Sub-Headline)
            </label>
            <textarea
              value={supportingText}
              onChange={(e) => setSupportingText(e.target.value)}
              rows={3}
              required
              className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
            />
          </div>

          {/* Hero Image */}
          <div>
            <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
              Foto Gerobak Utama (Visual Hero Full-Viewport)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="URL foto gerobak..."
                required
                className="flex-1 px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
              <button
                type="button"
                onClick={() => setMediaModalOpen(true)}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#D6B46A]" />
                <span>Pustaka Media</span>
              </button>
            </div>

            {/* Live Image Preview */}
            {heroImage && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-white/10 aspect-[16/9] max-w-md bg-[#0B132B]">
                <img src={heroImage} alt="Pratinjau Hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <p className="text-xs text-white/80 font-medium">Pratinjau Visual Hero Publik</p>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D6B46A] text-[#101827] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C5A154] disabled:opacity-50 transition-colors shadow-lg shadow-[#D6B46A]/20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Cloud Firestore...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Hero</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

      {/* Media Picker */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectImage={(url) => setHeroImage(url)}
      />

    </div>
  );
};
