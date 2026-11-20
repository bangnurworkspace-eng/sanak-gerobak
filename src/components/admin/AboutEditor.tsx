/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getSiteSection, saveSiteSection, CMSAboutSection } from '../../services/cmsService';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';

interface AboutEditorProps {
  onRefreshPublicSite: () => Promise<void>;
}

export const AboutEditor: React.FC<AboutEditorProps> = ({ onRefreshPublicSite }) => {
  const [principles, setPrinciples] = useState<CMSAboutSection['principles']>([]);
  const [localTitle, setLocalTitle] = useState('');
  const [localDesc, setLocalDesc] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadAbout = async () => {
      setIsLoading(true);
      try {
        const data = await getSiteSection<CMSAboutSection>('about');
        if (data) {
          if (Array.isArray(data.principles)) setPrinciples(data.principles);
          if (data.localTitle) setLocalTitle(data.localTitle);
          if (data.localDesc) setLocalDesc(data.localDesc);
        }
      } catch (err: any) {
        setErrorMsg('Gagal memuat data dari Firestore: ' + (err.message || ''));
      } finally {
        setIsLoading(false);
      }
    };
    loadAbout();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);
    try {
      await saveSiteSection('about', {
        principles,
        localTitle,
        localDesc,
      });
      setSaveSuccess(true);
      await onRefreshPublicSite();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg('Gagal menyimpan Tentang Kami: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-['Plus_Jakarta_Sans']">
      
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Manrope']">
            Tentang Kami & Prinsip Nilai Brand
          </h2>
          <p className="text-xs text-[#A4A7AE] mt-0.5">
            Narasi filosofi pengerjaan gerobak dan komitmen lokal di Bontang & Kalimantan Timur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersimpan di Cloud</span>
            </div>
          )}
          {errorMsg && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              <span>{errorMsg}</span>
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
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white font-['Manrope']">
              Tiga Prinsip Inti Brand Statement
            </h3>

            {principles.map((pr, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0B132B] border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#D6B46A]/20 text-[#D6B46A] flex items-center justify-center font-bold text-xs font-mono">
                    {pr.number}
                  </span>
                  <input
                    type="text"
                    value={pr.title}
                    onChange={(e) => {
                      const updated = [...principles];
                      updated[idx].title = e.target.value;
                      setPrinciples(updated);
                    }}
                    className="flex-1 px-3 py-1.5 bg-[#101827] border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                </div>

                <textarea
                  value={pr.desc}
                  onChange={(e) => {
                    const updated = [...principles];
                    updated[idx].desc = e.target.value;
                    setPrinciples(updated);
                  }}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#101827] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-white font-['Manrope']">
              Narasi Komitmen Lokal Bontang & Kaltim
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Judul Komitmen Wilayah
              </label>
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Paragraf Narasi Wilayah
              </label>
              <textarea
                value={localDesc}
                onChange={(e) => setLocalDesc(e.target.value)}
                rows={3}
                required
                className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
            </div>
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
                  <span>Simpan Narasi Brand</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
