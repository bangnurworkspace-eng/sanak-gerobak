/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BRAND_CONFIG } from '../config/brand';
import { createWhatsAppUrl, getGeneralInquiryUrl } from '../utils/whatsapp';
import { MessageCircle, X, ArrowUpRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const WhatsAppCTA: React.FC = () => {
  const { contactInfo } = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const quickTopics = [
    {
      label: 'Konsultasi Pembuatan Gerobak',
      msg: 'Halo SANAK GEROBAK, saya ingin konsultasi mengenai pembuatan gerobak jualan.',
    },
    {
      label: 'Tanya Konsep Gerobak Kopi',
      msg: 'Halo SANAK GEROBAK, saya tertarik konsultasi mengenai pembuatan gerobak kopi keliling / coffee cart.',
    },
    {
      label: 'Tanya Konsep Gerobak Makanan',
      msg: 'Halo SANAK GEROBAK, saya ingin konsultasi mengenai pembuatan gerobak makanan / street food.',
    },
    {
      label: 'Tanya Pembuatan Booth UMKM',
      msg: 'Halo SANAK GEROBAK, saya ingin bertanya mengenai konsep pembuatan booth kontainer / booth UMKM.',
    },
  ];

  return (
    <aside 
      aria-label="Akses Cepat WhatsApp SANAK GEROBAK"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end pointer-events-auto"
    >
      {/* Pop-up Dialog Menu */}
      {isOpen && (
        <div 
          className="mb-2.5 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-[#17191D] border border-[#D6B46A]/40 rounded-xl shadow-2xl p-4 text-white text-xs space-y-3 animate-fade-in"
          role="dialog"
          aria-modal="false"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-white font-['Manrope']">Konsultasi WhatsApp</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="min-h-[44px] min-w-[44px] -mr-2 -my-2 inline-flex items-center justify-center p-2 text-[#A4A7AE] hover:text-white rounded-md transition-colors"
              aria-label="Tutup Menu WhatsApp"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[#A4A7AE] leading-relaxed">
            “{BRAND_CONFIG.officialTagline}”
            <br />
            Pilih topik untuk membuka WhatsApp resmi tim SANAK GEROBAK:
          </p>

          <div className="space-y-1.5">
            {quickTopics.map((topic, i) => (
              <a
                key={i}
                href={createWhatsAppUrl(topic.msg, contactInfo?.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#101827] hover:bg-[#D6B46A] hover:text-[#101827] active:bg-[#D6B46A] active:text-[#101827] text-white border border-white/5 transition-colors group"
              >
                <span className="font-medium text-xs">{topic.label}</span>
                <ArrowUpRight className="w-4 h-4 text-[#D6B46A] group-hover:text-[#101827] shrink-0" />
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A4A7AE]">
            <span>Wilayah Bontang & Kaltim</span>
            <a 
              href={getGeneralInquiryUrl(contactInfo?.whatsappNumber)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="min-h-[36px] inline-flex items-center text-[#D6B46A] hover:underline font-semibold"
            >
              Chat Langsung
            </a>
          </div>
        </div>
      )}

      {/* Floating Pill Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <span className="hidden sm:inline-block px-3 py-1.5 bg-[#17191D]/90 backdrop-blur-md text-[#D6B46A] text-xs font-semibold rounded-full border border-white/10 shadow-lg select-none">
            Konsultasi WhatsApp
          </span>
        )}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#101827] focus:ring-[#25D366]"
          aria-label={isOpen ? 'Tutup Pilihan WhatsApp' : 'Buka WhatsApp SANAK GEROBAK'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5 fill-current" />}
        </button>
      </div>
    </aside>
  );
};
