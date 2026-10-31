/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BRAND_CONFIG } from '../config/brand';
import { createWhatsAppUrl, getGeneralInquiryUrl } from '../utils/whatsapp';
import { MessageCircle, X, ArrowUpRight } from 'lucide-react';

export const WhatsAppCTA: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

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
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end pointer-events-auto"
    >
      {/* Pop-up Dialog Menu */}
      {isOpen && (
        <div 
          className="mb-2 w-72 sm:w-80 bg-[#17191D] border border-[#D6B46A]/40 rounded-xl shadow-2xl p-4 text-white text-xs space-y-3 animate-fade-in"
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
              className="p-1 text-[#A4A7AE] hover:text-white rounded transition-colors"
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
                href={createWhatsAppUrl(topic.msg)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#101827] hover:bg-[#D6B46A] hover:text-[#101827] text-white border border-white/5 transition-colors group"
              >
                <span className="font-medium text-[11px] sm:text-xs">{topic.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D6B46A] group-hover:text-[#101827]" />
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A4A7AE]">
            <span>Wilayah Bontang & Kaltim</span>
            <a 
              href={getGeneralInquiryUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#D6B46A] hover:underline font-semibold"
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
