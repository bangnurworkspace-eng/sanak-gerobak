/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BRAND_CONFIG, ShowcaseItem } from '../config/brand';
import { ArrowRight, Sparkles, Eye, X } from 'lucide-react';

interface VisualShowcaseProps {
  onExploreCatalog: () => void;
}

export const VisualShowcase: React.FC<VisualShowcaseProps> = ({ onExploreCatalog }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  const filterTabs = [
    { id: 'all', label: 'Semua Inspirasi' },
    { id: 'coffee-cart', label: 'Coffee Cart' },
    { id: 'makanan', label: 'Gerobak Makanan' },
    { id: 'booth-umkm', label: 'Booth UMKM' },
    { id: 'booth-minimalis', label: 'Booth Minimalis' },
  ];

  const filteredShowcase = activeFilter === 'all'
    ? BRAND_CONFIG.showcase
    : BRAND_CONFIG.showcase.filter(item => item.category === activeFilter);

  return (
    <section className="relative bg-[#101827] text-white py-24 sm:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D6B46A] mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Inspirasi Visual Konseptual</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Manrope'] [text-wrap:balance]">
              Desain yang Punya Karakter.
            </h2>
            
            <p className="text-base sm:text-lg text-[#A4A7AE] mt-3 leading-relaxed">
              Temukan inspirasi gerobak dan booth untuk berbagai jenis usaha.
            </p>
          </div>

          {/* Interactive Category Filter */}
          <div className="flex items-center flex-wrap gap-1.5 p-1 bg-[#17191D] rounded-lg border border-white/10 shrink-0">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  activeFilter === tab.id
                    ? 'bg-[#D6B46A] text-[#101827] font-semibold shadow-sm'
                    : 'text-[#A4A7AE] hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric Visual Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {filteredShowcase.map((item, idx) => (
            <div
              key={item.id}
              className={`${item.colSpanClass} group relative rounded-xl overflow-hidden bg-[#17191D] border border-white/10 hover:border-[#D6B46A]/50 transition-all duration-500 shadow-xl flex flex-col justify-between`}
            >
              {/* Image Frame with Intentional Crop */}
              <div className={`relative w-full ${item.aspectClass} overflow-hidden bg-[#101827]`}>
                <img
                  src={item.image}
                  alt={`Inspirasi desain ${item.title} - ${item.categoryLabel}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Contrast Scrim */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-[#101827] via-[#101827]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" 
                  aria-hidden="true" 
                />

                {/* Subtle Reference Badge - Non-pill editorial label */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#101827]/80 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-xs text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A]" />
                  <span className="font-medium text-[11px] tracking-wide">{item.highlightTag}</span>
                </div>

                {/* Quick Expand Button */}
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="absolute top-4 right-4 z-10 p-2 rounded bg-[#101827]/80 hover:bg-[#D6B46A] hover:text-[#101827] text-white backdrop-blur-md border border-white/10 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Buka pratinjau ${item.title}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Editorial Card Footing */}
              <div className="p-6 sm:p-8 bg-[#17191D] flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#A4A7AE] mb-2 font-mono">
                    <span className="text-[#D6B46A]">{item.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>Konsep Desain Referensi</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white font-['Manrope'] mb-2 group-hover:text-[#D6B46A] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#A4A7AE] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#A4A7AE] italic">
                    *Visual referensi konsep custom SANAK GEROBAK
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="font-semibold text-[#D6B46A] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Perbesar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA */}
        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={onExploreCatalog}
            className="inline-flex items-center gap-3 px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-lg active:scale-[0.99] cursor-pointer"
          >
            <span>Lihat Semua Desain</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* Lightbox / Concept Preview Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="relative max-w-4xl w-full bg-[#17191D] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#101827]/90 text-white hover:text-[#D6B46A] border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#101827]">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 sm:p-8 bg-[#17191D] space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#D6B46A] font-semibold uppercase tracking-wider">
                <span>{selectedItem.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>Inspirasi Visual Konseptual</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-['Manrope']">
                {selectedItem.title}
              </h3>
              <p className="text-sm text-[#A4A7AE] leading-relaxed">
                {selectedItem.description}
              </p>
              <p className="text-xs text-white/50 italic pt-2 border-t border-white/5">
                Catatan: Gambar ini merupakan referensi inspirasi desain estetika komersial untuk membantu Anda mendiskusikan konsep custom bersama tim SANAK GEROBAK.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
