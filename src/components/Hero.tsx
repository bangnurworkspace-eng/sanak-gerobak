/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { ArrowDown, MessageCircle, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { resolveImageUrl, STUDIO_IMAGE_ASSETS } from '../utils/assets';

interface HeroProps {
  onExploreCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog }) => {
  const { heroContent, contactInfo } = useSiteContent();
  const heroImageSrc = resolveImageUrl(heroContent?.heroImage, STUDIO_IMAGE_ASSETS.heroPremium);
  const supportingText = heroContent?.supportingText || 'Wujudkan gerobak jualan sesuai kebutuhan usaha Anda. Temukan inspirasi desain, jelajahi berbagai konsep, dan konsultasikan ide Anda bersama SANAK GEROBAK.';

  return (
    <section 
      id="beranda"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#101827] pt-20 pb-14 sm:pt-24 sm:pb-16"
    >
      {/* Cinematic Full-Bleed Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageSrc}
          alt="Gerobak dan Booth Komersial Premium SANAK GEROBAK Bontang"
          width={1920}
          height={1080}
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
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center my-auto w-full">
        
        {/* Editorial Kicker (R-09: No pill badge above H1) */}
        <div className="inline-flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-semibold tracking-widest text-[#D6B46A] uppercase mb-5 sm:mb-8 max-w-full">
          <span className="w-4 sm:w-6 h-[1px] bg-[#D6B46A] shrink-0" aria-hidden="true" />
          <span className="[text-wrap:balance]">{heroContent?.badgeText || 'SOLUSI GEROBAK USAHA • BONTANG, KALIMANTAN TIMUR'}</span>
          <span className="w-4 sm:w-6 h-[1px] bg-[#D6B46A] shrink-0" aria-hidden="true" />
        </div>

        {/* Headline Artistik (Strict & Exact Text) */}
        <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-8">
          <h1 className="text-[1.9rem] leading-[1.12] sm:text-5xl md:text-6xl lg:text-7xl font-black text-white sm:leading-[1.08] tracking-tight font-['Manrope'] [text-wrap:balance]">
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
        <p className="max-w-2xl text-[15px] sm:text-lg md:text-xl text-[#F6F2E9]/90 font-light leading-relaxed mb-7 sm:mb-10 [text-wrap:balance]">
          {supportingText}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 w-full sm:w-auto mb-8 sm:mb-10">
          <button
            type="button"
            onClick={onExploreCatalog}
            className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-xl hover:shadow-[#D6B46A]/20 active:scale-[0.98] cursor-pointer"
          >
            <span>Jelajahi Katalog</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <a
            href={getGeneralInquiryUrl(contactInfo?.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white hover:text-[#D6B46A] bg-[#17191D]/90 hover:bg-[#1f2228] border border-white/20 rounded-md transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
            <span>Konsultasi via WhatsApp</span>
          </a>
        </div>

        {/* Small Label Line */}
        <div className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#A4A7AE] flex items-center gap-2">
          <span className="w-4 h-[1px] bg-white/20" />
          <span>CUSTOM GEROBAK & BOOTH UMKM</span>
          <span className="w-4 h-[1px] bg-white/20" />
        </div>

      </div>

      {/* Subtle Scroll Indicator (hidden on compact mobile screens to keep hero clean) */}
      <a 
        href="#filosofi" 
        className="group hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 min-h-[44px] min-w-[44px] px-3 flex-col items-center justify-center gap-1.5 text-xs text-[#A4A7AE] hover:text-[#D6B46A] transition-colors focus:outline-none"
        aria-label="Gulir ke Bawah"
      >
        <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
        <ArrowDown className="w-4 h-4 text-[#D6B46A] transition-transform duration-300 group-hover:translate-y-1" />
      </a>
    </section>
  );
};
