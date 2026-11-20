/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  CatalogItem,
  generateDesignInquiryUrl,
} from '../config/catalogData';
import { CatalogDetailModal } from './CatalogDetailModal';
import { useSiteContent } from '../context/SiteContentContext';
import { resolveImageUrl } from '../utils/assets';
import {
  Search,
  X,
  Eye,
  MessageCircle,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export const Catalog: React.FC = () => {
  const { products: cmsProducts, categories: cmsCategories, isLoading } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<CatalogItem | null>(null);

  // Dynamic category tabs strictly from Firestore CMS
  const displayCategories = useMemo(() => {
    const seen = new Set<string>(['all']);
    const uniqueCats = [{ id: 'all', label: 'Semua' }];
    for (const c of cmsCategories || []) {
      const catId = c.slug || c.id;
      if (!seen.has(catId)) {
        seen.add(catId);
        uniqueCats.push({ id: catId, label: c.label });
      }
    }
    return uniqueCats;
  }, [cmsCategories]);

  // Active published products strictly from Firestore CMS, deduplicated by id
  const activeProducts = useMemo(() => {
    const seen = new Set<string>();
    return (cmsProducts || []).filter((item) => {
      if (seen.has(item.id)) return false;
      const status = 'status' in item ? (item as { status?: string }).status : 'published';
      if (status && status !== 'published') return false;
      seen.add(item.id);
      return true;
    });
  }, [cmsProducts]);

  // Check initial URL hash for direct links (e.g., #desain-[slug])
  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#desain-')) {
        const slug = hash.replace('#desain-', '');
        const found = activeProducts.find((item) => item.slug === slug);
        if (found) {
          setActiveModalItem(found);
        }
      }
    };

    handleHashCheck();
    window.addEventListener('popstate', handleHashCheck);
    return () => window.removeEventListener('popstate', handleHashCheck);
  }, [activeProducts]);

  // Listen for category selection triggered from Footer links
  useEffect(() => {
    const handleSelectCategory = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedCategory(customEvent.detail);
      }
    };
    window.addEventListener('sanak:select-category', handleSelectCategory);
    return () => window.removeEventListener('sanak:select-category', handleSelectCategory);
  }, []);

  const handleCloseModal = () => {
    setActiveModalItem(null);
    // Remove the hash without refreshing or jumping
    if (window.location.hash.startsWith('#desain-')) {
      window.history.pushState(null, '', window.location.pathname + '#katalog');
    }
  };

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    const activeCatObj = displayCategories.find((c) => c.id === selectedCategory);
    return activeProducts.filter((item) => {
      // Category match
      const categoryMatch =
        selectedCategory === 'all' ||
        item.category === selectedCategory ||
        (activeCatObj && item.categoryLabel?.toLowerCase() === activeCatObj.label.toLowerCase());

      // Search match
      const query = searchQuery.trim().toLowerCase();
      if (!query) return categoryMatch;

      const nameMatch = (item.name || '').toLowerCase().includes(query);
      const catLabelMatch = (item.categoryLabel || '').toLowerCase().includes(query);
      const tagMatch = (item.designTags || []).some((tag) =>
        (tag || '').toLowerCase().includes(query)
      );
      const descMatch = (item.shortDescription || '').toLowerCase().includes(query);

      return categoryMatch && (nameMatch || catLabelMatch || tagMatch || descMatch);
    });
  }, [activeProducts, displayCategories, selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <section id="katalog" className="relative bg-[#101827] text-white py-16 sm:py-24 lg:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Editorial Header */}
        <div className="max-w-3xl mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D6B46A] mb-3">
            <span className="w-6 h-[1px] bg-[#D6B46A]" />
            <span>Katalog Konsep & Inspirasi</span>
          </div>

          <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tight font-['Manrope'] [text-wrap:balance]">
            Temukan Desain yang Cocok untuk Usaha Anda.
          </h2>

          <p className="text-[15px] sm:text-lg text-[#A4A7AE] mt-2.5 sm:mt-3 leading-relaxed">
            Jelajahi inspirasi gerobak dan booth untuk membantu Anda menemukan konsep usaha yang tepat.
          </p>
        </div>

        {/* Search Bar & Filter Controls Strip */}
        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          
          {/* Search Input (16px font on mobile prevents iOS Safari auto-zoom on focus) */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A4A7AE]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari konsep: Kopi, Bakery, Minimalis..."
              className="w-full min-h-[44px] pl-10 pr-11 py-3 text-base sm:text-sm bg-[#17191D] text-white border border-white/10 rounded-lg focus:border-[#D6B46A] focus:outline-none transition-colors placeholder:text-white/40 placeholder:text-xs sm:placeholder:text-sm"
              aria-label="Cari desain gerobak"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 min-w-[44px] pr-2 flex items-center justify-center text-[#A4A7AE] hover:text-white"
                aria-label="Hapus kata kunci pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Horizontal Category Filter Tabs (edge-to-edge swipe on mobile) */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar snap-x">
            {displayCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`min-h-[44px] sm:min-h-[40px] px-4 py-2.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 snap-start border ${
                    isActive
                      ? 'bg-[#D6B46A] text-[#101827] border-[#D6B46A] font-semibold shadow-sm'
                      : 'bg-[#17191D] text-[#A4A7AE] border-white/10 hover:text-white hover:border-white/20'
                  }`}
                  aria-pressed={isActive}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active Filter Indicator / Result Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#A4A7AE] pt-1">
            <span>
              Menampilkan <strong className="text-white font-mono">{filteredItems.length}</strong> konsep desain
              {selectedCategory !== 'all' && (
                <span> dalam kategori <strong className="text-[#D6B46A]">{displayCategories.find(c => c.id === selectedCategory)?.label}</strong></span>
              )}
              {searchQuery && (
                <span> untuk pencarian <strong className="text-white">"{searchQuery}"</strong></span>
              )}
            </span>

            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="min-h-[36px] px-2 inline-flex items-center gap-1.5 text-xs text-[#D6B46A] hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

        </div>

        {/* Catalog Responsive Grid */}
        {isLoading && activeProducts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className="bg-[#17191D] rounded-xl border border-white/10 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-white/5" />
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="h-3 w-24 bg-white/10 rounded" />
                  <div className="h-6 w-3/4 bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {filteredItems.map((item, idx) => {
              const isHighlight = item.featured && idx === 0;
              return (
                <div
                  key={item.id}
                  className={`group bg-[#17191D] rounded-xl border border-white/10 hover:border-[#D6B46A]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:-translate-y-1 ${
                    isHighlight ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                >
                  <div>
                    {/* Primary Photo: tap anywhere on mobile/desktop to open detail modal */}
                    <div
                      onClick={() => setActiveModalItem(item)}
                      className={`relative w-full ${isHighlight ? 'aspect-[16/10] lg:aspect-[16/10]' : 'aspect-[4/3]'} overflow-hidden bg-[#101827] cursor-pointer`}
                    >
                      <img
                        src={resolveImageUrl(item.image)}
                        alt={`Inspirasi desain gerobak ${item.name} kategori ${item.categoryLabel}`}
                        width={800}
                        height={600}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />

                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-[#17191D] via-[#17191D]/20 to-transparent opacity-60 pointer-events-none" 
                        aria-hidden="true" 
                      />

                      {/* Concept Type Kicker Badge */}
                      <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 bg-[#101827]/95 px-2.5 sm:px-3 py-1 rounded text-[11px] font-medium text-[#D6B46A] border border-white/10 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D6B46A]" aria-hidden="true" />
                        <span>{item.conceptType}</span>
                      </div>

                      {/* Mobile Tap Cue Icon (visible without hover on touch devices) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalItem(item);
                        }}
                        className="sm:hidden absolute top-3 right-3 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg bg-[#101827]/90 text-white border border-white/15"
                        aria-label={`Lihat rincian ${item.name}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Desktop Hover "Lihat Detail" Overlay Trigger */}
                      <div className="hidden sm:flex absolute inset-0 bg-[#101827]/60 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity items-center justify-center p-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModalItem(item);
                          }}
                          className="min-h-[44px] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-colors flex items-center gap-2 shadow-lg"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Lihat Detail Konsep</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Body Content */}
                    <div className="p-5 sm:p-7 space-y-2.5 sm:space-y-3">
                      
                      {/* Category Label */}
                      <div className="flex items-center gap-2 text-xs text-[#A4A7AE] font-mono">
                        <span className="text-[#D6B46A] font-semibold">{item.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>Desain Custom</span>
                      </div>

                      {/* Concept Name */}
                      <h3 className="text-lg sm:text-xl font-bold text-white font-['Manrope'] group-hover:text-[#D6B46A] transition-colors leading-snug">
                        {item.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-[#A4A7AE] leading-relaxed line-clamp-2">
                        {item.shortDescription}
                      </p>

                      {/* Design Character Tags */}
                      <div className="pt-1.5 flex flex-wrap gap-1.5">
                        {item.designTags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono px-2 py-0.5 bg-[#101827] text-white/80 rounded border border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Card Action Buttons (Stacked cleanly on <sm phones so neither label wraps awkwardly) */}
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    
                    {/* Tombol "Lihat Detail" */}
                    <button
                      type="button"
                      onClick={() => setActiveModalItem(item)}
                      className="min-h-[44px] w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-white hover:text-[#D6B46A] bg-[#101827] hover:bg-[#17191D] active:bg-white/5 border border-white/10 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5 shrink-0" />
                      <span>Lihat Detail</span>
                    </button>

                    {/* Tombol "Tanyakan Desain Ini" dengan WhatsApp Pre-filled */}
                    <a
                      href={generateDesignInquiryUrl(item.name, item.categoryLabel)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
                      title={`Tanyakan konsep ${item.name} via WhatsApp`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-[#101827] shrink-0" />
                      <span>Tanyakan Desain Ini</span>
                    </a>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Elegant Empty State (Section A & F) */
          <div className="p-8 sm:p-16 text-center bg-[#17191D] rounded-xl border border-white/10 max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#101827] border border-white/10 flex items-center justify-center text-[#D6B46A] mx-auto">
              <Search className="w-6 h-6" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white font-['Manrope']">
              Tidak Ada Desain yang Sesuai
            </h3>

            <p className="text-xs sm:text-sm text-[#A4A7AE] leading-relaxed">
              Kami tidak menemukan konsep dengan kata kunci <strong>"{searchQuery}"</strong> dalam kategori yang dipilih. Coba gunakan kata kunci umum atau reset filter.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Semua Filter</span>
              </button>

              <a
                href={generateDesignInquiryUrl('Konsep Khusus / Request Sendiri')}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-white hover:text-[#D6B46A] bg-[#101827] border border-white/10 rounded-md transition-colors"
              >
                <span>Konsultasikan Desain Custom</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Bottom Fast Custom Note */}
        <div className="mt-10 sm:mt-16 p-5 sm:p-8 bg-[#17191D] rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-mono uppercase tracking-wider text-[#D6B46A] block">
              Punya Contoh atau Sketsa Mandiri?
            </span>
            <h4 className="text-base sm:text-xl font-bold text-white font-['Manrope']">
              Konsultasikan Konsep Khusus Bersama Tim Desainer SANAK GEROBAK
            </h4>
            <p className="text-xs text-[#A4A7AE] leading-relaxed">
              Semua gambar di atas dapat dimodifikasi dimensi, penataan alat, serta kombinasi material sesuai spesifikasi tempat usaha Anda di Bontang dan Kalimantan Timur.
            </p>
          </div>

          <a
            href={generateDesignInquiryUrl('Konsultasi Konsep Mandiri')}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-colors shrink-0 shadow-md whitespace-nowrap active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-[#101827]" />
            <span>Diskusi Konsep Custom</span>
          </a>
        </div>

      </div>

      {/* Detail Modal Component */}
      <CatalogDetailModal
        item={activeModalItem}
        onClose={handleCloseModal}
      />
    </section>
  );
};
