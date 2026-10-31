/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { MapPin, Heart, Shield, ArrowRight } from 'lucide-react';

export const LocalSection: React.FC = () => {
  return (
    <section 
      id="tentang-kami" 
      className="relative bg-[#101827] text-white py-24 sm:py-32 border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authentic Local Culinary Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#17191D] group">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/src/assets/images/bontang_local_culinary_1793275672214.jpg"
                  alt="Usaha Kuliner dan Kopi Lokal di Kalimantan Timur"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Contrast Gradient */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-[#101827] via-transparent to-transparent opacity-70" 
                  aria-hidden="true" 
                />

                <div className="absolute bottom-4 left-4 right-4 bg-[#101827]/85 backdrop-blur-md p-3.5 rounded border border-white/10 text-xs text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D6B46A]" />
                    <span className="font-medium">Semangat Kewirausahaan Lokal</span>
                  </div>
                  <span className="text-[#A4A7AE] font-mono text-[11px]">Bontang & Kaltim</span>
                </div>
              </div>
            </div>

            {/* Accent Border Frame */}
            <div 
              className="absolute -bottom-3 -left-3 w-full h-full border border-[#D6B46A]/20 rounded-xl pointer-events-none -z-10 hidden sm:block" 
              aria-hidden="true" 
            />
          </div>

          {/* Right Column: Editorial Narrative & Exact Headline */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D6B46A]">
              <MapPin className="w-4 h-4" />
              <span>Komitmen & Kedekatan Lokal</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Manrope'] leading-[1.15] [text-wrap:balance]">
              Dari Bontang, untuk Semangat Usaha Kalimantan Timur.
            </h2>

            <p className="text-base sm:text-lg text-[#A4A7AE] font-normal leading-relaxed">
              Kami ingin membantu pelaku usaha menghadirkan tempat berjualan yang menarik, memiliki karakter, dan sesuai dengan kebutuhan bisnis mereka.
            </p>

            <p className="text-sm sm:text-base text-[#A4A7AE] leading-relaxed">
              Kami memahami iklim, karakter pasar, dan tantangan yang dihadapi teman-teman pengusaha di Kalimantan Timur. Mulai dari kebutuhan bahan yang tahan terhadap kelembapan dan panas matahari, hingga pengaturan mobilitas gerobak di berbagai titik lokasi jualan.
            </p>

            {/* Verified Focus Badges */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#A4A7AE]">
              <div className="flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Pendekatan Ramah:</span>
                  <span>Diskusi santai dan terbuka mengenai anggaran serta rencana bisnis Anda.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Standar Konstruksi:</span>
                  <span>Pengelasan rapi dengan pemilihan material tahan karat untuk jangka panjang.</span>
                </div>
              </div>
            </div>

            {/* Direct Link */}
            <div className="pt-2">
              <a
                href={getGeneralInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D6B46A] hover:text-[#C5A154] transition-colors"
              >
                <span>Hubungi Workshop Kami di Bontang</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
