/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CatalogItem, generateDesignInquiryUrl } from '../config/catalogData';
import { X, MessageCircle, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';

interface CatalogDetailModalProps {
  item: CatalogItem | null;
  onClose: () => void;
}

export const CatalogDetailModal: React.FC<CatalogDetailModalProps> = ({ item, onClose }) => {
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (item) {
      setActiveImage(item.image);
      document.body.style.overflow = 'hidden';

      // Update URL hash without causing page jump
      if (window.location.hash !== `#desain-${item.slug}`) {
        window.history.pushState(null, '', `#desain-${item.slug}`);
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const whatsappInquiryUrl = generateDesignInquiryUrl(item.name, item.categoryLabel);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-catalog-title"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#17191D] border border-white/10 rounded-xl shadow-2xl text-white selection:bg-[#D6B46A] selection:text-[#101827]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Controls */}
        <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-[#17191D]/90 backdrop-blur-md border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#A4A7AE] hover:text-white bg-[#101827] hover:bg-[#101827]/80 rounded border border-white/10 transition-colors focus-visible:ring-1 focus-visible:ring-[#D6B46A]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#A4A7AE] hover:text-white bg-[#101827] hover:bg-white/10 rounded-full border border-white/10 transition-colors"
            aria-label="Tutup Rincian Desain"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Big Main Image & Gallery Strip */}
          <div className="lg:col-span-7 bg-[#101827] p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            <div>
              {/* Main Image Frame */}
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#17191D] border border-white/10 shadow-inner">
                <img
                  src={activeImage || item.image}
                  alt={`Foto detail konsep gerobak ${item.name} (${item.categoryLabel})`}
                  decoding="async"
                  className="w-full h-full object-cover transition-all duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Concept Tag */}
                <div className="absolute top-3 left-3 bg-[#101827]/85 backdrop-blur-md px-3 py-1 rounded text-[11px] font-medium text-[#D6B46A] border border-white/10 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{item.conceptType}</span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {item.gallery && item.gallery.length > 1 && (
                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                  {item.gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-16 h-12 rounded overflow-hidden border shrink-0 transition-all ${
                        activeImage === imgUrl
                          ? 'border-[#D6B46A] ring-1 ring-[#D6B46A]'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${item.name} sudut ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Honest Disclaimer Box (Section C & D) */}
            <div className="mt-6 p-3.5 bg-[#17191D] rounded border border-white/10 text-xs text-[#A4A7AE] space-y-1.5">
              <div className="flex items-center gap-2 text-white font-medium">
                <AlertCircle className="w-4 h-4 text-[#D6B46A] shrink-0" />
                <span>Kustomisasi Spesifikasi</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Ukuran fisik, tata letak peralatan (kompor/mesin kopi), dan spesifikasi detail akan disesuaikan serta dikonfirmasi saat sesi konsultasi desain 3D bersama tim SANAK GEROBAK.
              </p>
            </div>
          </div>

          {/* Right Column: Narrative, Tags, Design Considerations, & WhatsApp CTA */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Category & Tagline */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#D6B46A] block mb-1">
                  {item.categoryLabel} · {item.conceptType}
                </span>
                <h2 id="modal-catalog-title" className="text-2xl font-bold font-['Manrope'] text-white">
                  {item.name}
                </h2>
              </div>

              {/* Character Labels (Design Tags) */}
              <div className="flex flex-wrap gap-1.5">
                {item.designTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2.5 py-1 bg-[#101827] border border-white/10 text-white/90 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Full Concept Description */}
              <div className="space-y-2 text-xs sm:text-sm text-[#A4A7AE] leading-relaxed">
                <p>{item.fullDescription}</p>
              </div>

              {/* Relevant Design Considerations & Features */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white block">
                  Pertimbangan Desain & Fitur:
                </span>
                <ul className="space-y-2 text-xs text-[#A4A7AE]">
                  {item.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-[#D6B46A] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Bottom Primary CTA */}
            <div className="pt-6 border-t border-white/10 space-y-2">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-md active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4 fill-[#101827]" />
                <span>Tanyakan Desain Ini</span>
              </a>

              <p className="text-[11px] text-center text-[#A4A7AE]">
                Konsultasi gratis tanpa komitmen melalui WhatsApp resmi SANAK GEROBAK.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
