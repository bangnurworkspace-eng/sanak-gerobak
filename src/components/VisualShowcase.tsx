/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ShowcaseItem } from '../config/brand';
import { ArrowRight, Eye, X } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { resolveImageUrl } from '../utils/assets';

interface VisualShowcaseProps {
  onExploreCatalog: () => void;
}

export const VisualShowcase: React.FC<VisualShowcaseProps> = ({ onExploreCatalog }) => {
  const { portfolio, isLoading } = useSiteContent();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  useEffect(() => {
    if (!selectedItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  // Live published portfolio items strictly from Cloud Firestore
  const allShowcaseItems: ShowcaseItem[] = useMemo(() => {
    const publishedPortfolio = (portfolio || []).filter((p) => p.status === 'published');
    const seenIds = new Set<string>();
    const mappedPortfolio: ShowcaseItem[] = [];

    publishedPortfolio.forEach((item, idx) => {
      if (seenIds.has(item.id)) return;
      seenIds.add(item.id);

      const catLower = (item.category || '').toLowerCase();
      let normalizedCat: ShowcaseItem['category'] = 'booth-umkm';
      if (catLower.includes('kopi') || catLower.includes('coffee')) normalizedCat = 'coffee-cart';
      else if (catLower.includes('makan') || catLower.includes('food')) normalizedCat = 'makanan';
      else if (catLower.includes('minimal')) normalizedCat = 'booth-minimalis';

      const isWide = idx % 2 === 0;
      mappedPortfolio.push({
        id: item.id,
        title: item.title,
        category: normalizedCat,
        categoryLabel: item.category,
        description: item.description,
        image: resolveImageUrl(item.image),
        aspectClass: isWide ? 'aspect-[16/10]' : 'aspect-[4/3]',
        colSpanClass: isWide ? 'lg:col-span-7' : 'lg:col-span-5',
        highlightTag: item.isRealProject
          ? `Proyek Klien • ${item.location || 'Bontang'}`
          : 'Inspirasi Visual Konseptual',
      });
    });

    return mappedPortfolio;
  }, [portfolio]);

  const filterTabs = [
    { id: 'all', label: 'Semua Inspirasi' },
    { id: 'coffee-cart', label: 'Coffee Cart' },
    { id: 'makanan', label: 'Gerobak Makanan' },
    { id: 'booth-umkm', label: 'Booth UMKM' },
    { id: 'booth-minimalis', label: 'Booth Minimalis' },
  ];

  const filteredShowcase = activeFilter === 'all'
    ? allShowcaseItems
    : allShowcaseItems.filter(item => item.category === activeFilter);

  return (
    <section className="relative bg-[#101827] text-white py-16 sm:py-24 lg:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D6B46A] mb-3">
              <span className="w-6 h-[1px] bg-[#D6B46A]" />
              <span>Inspirasi Visual & Karya</span>
            </div>
            
            <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tight font-['Manrope'] [text-wrap:balance]">
              Desain yang Punya Karakter.
            </h2>
            
            <p className="text-[15px] sm:text-lg text-[#A4A7AE] mt-2.5 sm:mt-3 leading-relaxed">
              Temukan inspirasi gerobak dan booth untuk berbagai jenis usaha.
            </p>
          </div>

          {/* Interactive Category Filter (edge-to-edge swipe strip on mobile, segmented bar on tablet/desktop) */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-1 flex items-center gap-2 sm:gap-1.5 overflow-x-auto no-scrollbar snap-x sm:flex-wrap sm:p-1 sm:bg-[#17191D] sm:rounded-lg sm:border sm:border-white/10 shrink-0">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`min-h-[44px] sm:min-h-[40px] px-4 sm:px-3.5 py-2 text-xs font-medium rounded-lg sm:rounded-md transition-all whitespace-nowrap shrink-0 snap-start border sm:border-transparent ${
                  activeFilter === tab.id
                    ? 'bg-[#D6B46A] text-[#101827] border-[#D6B46A] font-semibold shadow-sm'
                    : 'bg-[#17191D] sm:bg-transparent text-[#A4A7AE] border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric Visual Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-stretch">
          {isLoading && filteredShowcase.length === 0 ? (
            [0, 1].map((idx) => (
              <div
                key={idx}
                className={`${idx === 0 ? 'lg:col-span-7' : 'lg:col-span-5'} rounded-xl overflow-hidden bg-[#17191D] border border-white/10 animate-pulse`}
              >
                <div className="aspect-[16/10] bg-white/5" />
                <div className="p-5 sm:p-8 space-y-3">
                  <div className="h-3 w-28 bg-white/10 rounded" />
                  <div className="h-6 w-2/3 bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/5 rounded" />
                </div>
              </div>
            ))
          ) : (
            filteredShowcase.map((item) => (
            <div
              key={item.id}
              className={`${item.colSpanClass} group relative rounded-xl overflow-hidden bg-[#17191D] border border-white/10 hover:border-[#D6B46A]/50 transition-all duration-500 shadow-xl flex flex-col justify-between`}
            >
              {/* Image Frame with Intentional Crop & Direct Tap Preview */}
              <div
                onClick={() => setSelectedItem(item)}
                className={`relative w-full ${item.aspectClass} overflow-hidden bg-[#101827] cursor-pointer`}
              >
                <img
                  src={item.image}
                  alt={`Inspirasi desain ${item.title} - ${item.categoryLabel}`}
                  width={800}
                  height={600}
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
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2 bg-[#101827]/95 px-2.5 sm:px-3 py-1.5 rounded border border-white/10 text-xs text-white/90 max-w-[calc(100%-5rem)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A] shrink-0" />
                  <span className="font-medium text-[11px] tracking-wide truncate">{item.highlightTag}</span>
                </div>

                {/* Quick Expand Button (Visible on touch devices, hover-reveal on desktop) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                  }}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2.5 rounded-lg bg-[#101827]/90 hover:bg-[#D6B46A] hover:text-[#101827] text-white border border-white/15 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label={`Buka pratinjau ${item.title}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Editorial Card Footing */}
              <div className="p-5 sm:p-8 bg-[#17191D] flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#A4A7AE] mb-2 font-mono">
                    <span className="text-[#D6B46A]">{item.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>Konsep Desain Referensi</span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-bold text-white font-['Manrope'] mb-2 group-hover:text-[#D6B46A] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#A4A7AE] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 sm:pt-6 mt-5 sm:mt-6 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-[#A4A7AE] italic">
                    *Visual referensi konsep custom SANAK GEROBAK
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="min-h-[44px] px-2.5 font-semibold text-[#D6B46A] hover:text-white flex items-center gap-1 transition-colors shrink-0"
                  >
                    <span>Perbesar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
          )}
        </div>

        {/* Global CTA */}
        <div className="mt-10 sm:mt-16 text-center">
          <button
            type="button"
            onClick={onExploreCatalog}
            className="min-h-[48px] w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-lg active:scale-[0.98] cursor-pointer"
          >
            <span>Lihat Semua Desain</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* Lightbox / Concept Preview Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Pratinjau ${selectedItem.title}`}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92dvh] overflow-y-auto overscroll-contain bg-[#17191D] border-t sm:border border-white/15 rounded-t-2xl sm:rounded-xl shadow-2xl pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Sheet Handle */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-[#101827]">
              <div className="w-10 h-1 rounded-full bg-white/25" aria-hidden="true" />
            </div>

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2.5 rounded-full bg-[#101827]/90 text-white hover:text-[#D6B46A] border border-white/15 transition-colors"
              aria-label="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#101827]">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-5 sm:p-8 bg-[#17191D] space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#D6B46A] font-semibold uppercase tracking-wider">
                <span>{selectedItem.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>Inspirasi Visual Konseptual</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white font-['Manrope']">
                {selectedItem.title}
              </h3>
              <p className="text-sm text-[#A4A7AE] leading-relaxed">
                {selectedItem.description}
              </p>
              <p className="text-xs text-[#A4A7AE] italic pt-2 border-t border-white/10">
                Catatan: Gambar ini merupakan referensi inspirasi desain estetika komersial untuk membantu Anda mendiskusikan konsep custom bersama tim SANAK GEROBAK.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
