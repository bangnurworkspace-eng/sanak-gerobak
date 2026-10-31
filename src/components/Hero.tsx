/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BRAND_CONFIG } from '../config/brand';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { ArrowDown, MessageCircle, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface HeroProps {
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog }) => {
  const { heroContent } = useSiteContent();
  const heroImageSrc = heroContent?.heroImage || '/src/assets/images/hero_gerobak_premium_1793275251800.jpg';
  const supportingText = heroContent?.supportingText || 'Wujudkan gerobak jualan sesuai kebutuhan usaha Anda. Temukan inspirasi desain, jelajahi berbagai konsep, dan konsultasikan ide Anda bersama SANAK GEROBAK.';

  return (
    <section 
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#101827] pt-24 pb-16"
    >
      {/* Cinematic Full-Bleed Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageSrc}
          alt="Gerobak dan Booth Komersial Premium SANAK GEROBAK Bontang"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center scale-[1.03] transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        
        {/* Layered Cinematic Overlays for Maximum Text Legibility */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-[#101827] via-[#101827]/85 to-[#101827]/60 backdrop-blur-[1px]" 
          aria-hidden="true" 
        />
        <div 
          className="absolute inset-0 bg-radial from-transparent via-[#101827]/40 to-[#101827]/90" 
          aria-hidden="true" 
        />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center my-auto">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[11px] sm:text-xs font-semibold tracking-widest text-[#D6B46A] uppercase mb-6 sm:mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A]" />
          <span>{heroContent?.badgeText || 'SOLUSI GEROBAK USAHA • BONTANG, KALIMANTAN TIMUR'}</span>
        </div>

        {/* Headline Artistik (Strict & Exact Text) */}
        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight font-['Manrope'] [text-wrap:balance]">
            <span>Butuh Gerobak Jualan?</span>
            <br />
            <span className="text-[#D6B46A] relative inline-block mt-1 sm:mt-2">
              SANAK GEROBAK Aja!
              <span 
                className="absolute -bottom-1.5 left-0 right-0 h-[2px] sm:h-[3px] bg-gradient-to-r from-transparent via-[#D6B46A] to-transparent opacity-80" 
                aria-hidden="true" 
              />
            </span>
          </h1>
        </div>

        {/* Deskripsi Resmi */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-[#F6F2E9]/90 font-light leading-relaxed mb-8 sm:mb-10 [text-wrap:balance]">
          {supportingText}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full sm:w-auto mb-10">
          <button
            type="button"
            onClick={onExploreCatalog}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-xl hover:shadow-[#D6B46A]/20 active:scale-[0.99] cursor-pointer"
          >
            <span>Jelajahi Katalog</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <a
            href={getGeneralInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white hover:text-[#D6B46A] bg-[#17191D]/90 hover:bg-[#1f2228] border border-white/20 rounded-md backdrop-blur-md transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
            <span>Konsultasi via WhatsApp</span>
          </a>
        </div>

        {/* Small Label Pill */}
        <div className="text-[11px] font-mono tracking-widest uppercase text-[#A4A7AE] flex items-center gap-2">
          <span className="w-4 h-[1px] bg-white/20" />
          <span>CUSTOM GEROBAK & BOOTH UMKM</span>
          <span className="w-4 h-[1px] bg-white/20" />
        </div>

      </div>

      {/* Elegant Subtle Scroll Indicator */}
      <a 
        href="#filosofi" 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-xs text-[#A4A7AE] hover:text-[#D6B46A] transition-colors focus:outline-none"
        aria-label="Gulir ke Bawah"
      >
        <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-bounce text-[#D6B46A]" />
      </a>
    </section>
  );
};
