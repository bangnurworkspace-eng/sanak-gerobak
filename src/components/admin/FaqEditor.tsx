/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getSiteSection, saveSiteSection } from '../../services/cmsService';
import { BRAND_CONFIG, FAQItem } from '../../config/brand';
import { Plus, Trash2, Edit, Save, X, Loader2, HelpCircle, CheckCircle2 } from 'lucide-react';

interface FaqEditorProps {
  onRefreshPublicSite: () => Promise<void>;
}

export const FaqEditor: React.FC<FaqEditorProps> = ({ onRefreshPublicSite }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadFaqs = async () => {
      setIsLoading(true);
      try {
        const data = await getSiteSection('faqs', { items: BRAND_CONFIG.faqs });
        if (data?.items) {
          setFaqs(data.items);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadFaqs();
  }, []);

  const openAdd = () => {
    setCurrentIndex(null);
    setQuestion('');
    setAnswer('');
    setModalOpen(true);
  };

  const openEdit = (item: FAQItem, idx: number) => {
    setCurrentIndex(idx);
    setQuestion(item.question);
    setAnswer(item.answer);
    setModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    let updated = [...faqs];
    if (currentIndex !== null) {
      updated[currentIndex] = { question, answer };
    } else {
      updated.push({ question, answer });
    }

    setIsSaving(true);
    try {
      await saveSiteSection('faqs', {
        title: 'Pertanyaan yang Sering Diajukan',
        items: updated,
      });
      setFaqs(updated);
      setModalOpen(false);
      await onRefreshPublicSite();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Gagal menyimpan FAQ: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (idx: number) => {
    if (!window.confirm('Hapus butir pertanyaan ini?')) return;
    const updated = faqs.filter((_, i) => i !== idx);
    setIsLoading(true);
    try {
      await saveSiteSection('faqs', {
        title: 'Pertanyaan yang Sering Diajukan',
        items: updated,
      });
      setFaqs(updated);
      await onRefreshPublicSite();
    } catch (err) {
      alert('Gagal menghapus FAQ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-['Plus_Jakarta_Sans']">
      
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Manrope']">
            Tanya Jawab (FAQ)
          </h2>
          <p className="text-xs text-[#A4A7AE] mt-0.5">
            Daftar pertanyaan dan jawaban resmi untuk membantu calon pelanggan memahami pemesanan gerobak.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D6B46A] text-[#101827] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C5A154] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pertanyaan</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>FAQ berhasil diperbarui di Cloud Firestore</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex justify-center text-[#A4A7AE]">
          <Loader2 className="w-8 h-8 animate-spin text-[#D6B46A]" />
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#101827] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#D6B46A]/20 text-[#D6B46A] flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-white font-['Manrope']">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-xs text-[#A4A7AE] leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 pt-1">
                <button
                  onClick={() => openEdit(faq, idx)}
                  className="p-2 text-[#A4A7AE] hover:text-[#D6B46A] hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#101827] border border-white/10 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white font-['Manrope']">
                {currentIndex !== null ? 'Edit Pertanyaan FAQ' : 'Tambah Pertanyaan FAQ'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#A4A7AE] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Kalimat Pertanyaan *
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Contoh: Apakah bisa memesan gerobak dengan desain sendiri?"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Jawaban Resmi *
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={4}
                  placeholder="Penjelasan jelas, ramah, dan solutif bagi pelaku usaha..."
                  required
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
                  Simpan Tanya Jawab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
