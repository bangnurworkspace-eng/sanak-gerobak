/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BRAND_CONFIG } from '../config/brand';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { ArrowRight, MessageCircle } from 'lucide-react';

interface ClosingCTAProps {
  onExploreCatalog: () => void;
}

export const ClosingCTA: React.FC<ClosingCTAProps> = ({ onExploreCatalog }) => {
  return (
    <section className="relative bg-[#101827] text-white py-16 sm:py-24 lg:py-32 overflow-hidden border-b border-white/10">
      
      {/* Background Ambience with Premium Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/hero_gerobak_premium_1793275251800.jpg"
          alt="Gerobak Impian SANAK GEROBAK"
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-20 filter grayscale contrast-125"
          referrerPolicy="no-referrer"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-[#101827] via-[#101827]/90 to-[#101827]" 
          aria-hidden="true" 
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle Brand Tagline Eyebrow */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D6B46A] mb-3 sm:mb-4">
          <span className="w-6 h-[1px] bg-[#D6B46A]" />
          <span>Langkah Pertama Usaha Anda</span>
          <span className="w-6 h-[1px] bg-[#D6B46A]" />
        </div>

        {/* Headline exact */}
        <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-['Manrope'] mb-4 sm:mb-6 [text-wrap:balance]">
          Punya Ide Gerobak Impian?
        </h2>

        {/* Description exact */}
        <p className="text-[15px] sm:text-xl text-[#A4A7AE] font-light leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 [text-wrap:balance]">
          Ceritakan konsep usaha Anda. Mari diskusikan desain gerobak yang sesuai dengan kebutuhan dan anggaran Anda.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <a
            href={getGeneralInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-xl active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-[#101827]" />
            <span>Mulai Konsultasi</span>
          </a>

          <button
            type="button"
            onClick={onExploreCatalog}
            className="min-h-[48px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs sm:text-sm font-medium text-white hover:text-[#D6B46A] bg-[#17191D] hover:bg-[#1f2228] border border-white/20 rounded-md transition-all cursor-pointer active:scale-[0.98]"
          >
            <span>Jelajahi Katalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Brand Tagline Lockup */}
        <div className="mt-8 sm:mt-12 text-xs font-mono text-[#A4A7AE] tracking-wider">
          “{BRAND_CONFIG.officialTagline}”
        </div>

      </div>
    </section>
  );
};
