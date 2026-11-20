/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BRAND_CONFIG } from '../config/brand';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { MessageCircle, Instagram, Mail, MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { contactInfo, categories } = useSiteContent();

  const footerCategories = React.useMemo(() => {
    const seen = new Set<string>();
    return (categories || [])
      .map((c) => ({ id: c.slug || c.id, label: c.label }))
      .filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
  }, [categories]);

  const handleCategoryClick = (categoryId: string) => {
    window.dispatchEvent(new CustomEvent('sanak:select-category', { detail: categoryId }));
  };

  return (
    <footer className="bg-[#101827] text-white border-t border-white/10 pt-12 pb-20 sm:pt-16 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/10">
          
          {/* Wordmark & Brand Narrative (Cols 1-5) */}
          <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
            <a 
              href="#beranda" 
              className="group inline-flex items-center gap-3.5 text-xl font-bold tracking-tight text-white focus:outline-none"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-white/15 shadow-lg bg-[#0B132B] flex items-center justify-center shrink-0 group-hover:border-[#38bdf8]/60 transition-all">
                <img
                  src={BRAND_CONFIG.logoUrl}
                  alt="Logo SANAK GEROBAK"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-wider font-['Manrope'] text-white">
                  {BRAND_CONFIG.name}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-[#D6B46A] font-semibold">
                  Bontang, Kalimantan Timur
                </span>
              </div>
            </a>

            {/* Exact Required Official Tagline */}
            <p className="text-base font-bold text-white font-['Manrope']">
              “{BRAND_CONFIG.officialTagline}”
            </p>

            <p className="text-xs text-[#D6B46A] tracking-wide font-medium">
              {BRAND_CONFIG.supportingSentence}
            </p>

            <p className="text-xs sm:text-sm text-[#A4A7AE] leading-relaxed max-w-sm">
              Layanan desain, kustomisasi, dan pembuatan gerobak jualan serta booth UMKM di Kota Bontang dan Kalimantan Timur. Disesuaikan dengan kebutuhan operasional dan anggaran Anda.
            </p>

            {contactInfo && (
              <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#A4A7AE]">
                <a 
                  href={contactInfo.instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="min-h-[36px] hover:text-[#D6B46A] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Instagram className="w-4 h-4 shrink-0" />
                  <span>{contactInfo.instagramHandle}</span>
                </a>
                <a 
                  href={getGeneralInquiryUrl(contactInfo.whatsappNumber)}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="min-h-[36px] hover:text-[#D6B46A] inline-flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{contactInfo.whatsappDisplay}</span>
                </a>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="min-h-[36px] hover:text-[#D6B46A] inline-flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="break-all">{contactInfo.email}</span>
                </a>
              </div>
            )}
          </div>

          {/* Navigation + Categories grouped side-by-side on mobile */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Navigation Links */}
            <div className="space-y-2.5 sm:space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D6B46A] block">
                Navigasi
              </span>
              <ul className="space-y-1 text-xs sm:text-sm text-[#A4A7AE]">
                <li>
                  <a href="#beranda" className="min-h-[36px] inline-flex items-center hover:text-white transition-colors">
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="#katalog" className="min-h-[36px] inline-flex items-center hover:text-white transition-colors">
                    Katalog
                  </a>
                </li>
                <li>
                  <a href="#proses" className="min-h-[36px] inline-flex items-center hover:text-white transition-colors">
                    Proses Pemesanan
                  </a>
                </li>
                <li>
                  <a href="#tentang-kami" className="min-h-[36px] inline-flex items-center hover:text-white transition-colors">
                    Tentang Kami
                  </a>
                </li>
              </ul>
            </div>

            {/* Catalog Categories */}
            <div className="space-y-2.5 sm:space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D6B46A] block">
                Kategori Desain
              </span>
              <ul className="space-y-1 text-xs sm:text-sm text-[#A4A7AE]">
                {footerCategories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href="#katalog"
                      onClick={() => handleCategoryClick(cat.id)}
                      className="min-h-[36px] inline-flex items-center hover:text-white transition-colors"
                    >
                      {cat.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Location & Workshop (Cols 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D6B46A] block">
              Workshop & Wilayah
            </span>
            
            <div className="text-xs text-[#A4A7AE] space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5" />
                <span>{contactInfo?.workshopAddress || 'Kota Bontang, Kalimantan Timur'}</span>
              </div>
              <p className="text-[11px] text-[#A4A7AE] pt-1 leading-relaxed">
                Layanan konsultasi & pemesanan untuk wilayah Kota Bontang, Samarinda, Balikpapan, dan seluruh Kalimantan Timur.
              </p>
            </div>

            <div className="pt-1">
              <a
                href={getGeneralInquiryUrl(contactInfo?.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] inline-flex items-center gap-1.5 text-xs text-[#D6B46A] hover:text-[#C5A154] font-semibold tracking-wide uppercase transition-colors"
              >
                <span>Hubungi via WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Admin CMS Entry */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-[#A4A7AE] text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. Seluruh Hak Cipta Dilindungi.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
            <span className="text-[#A4A7AE]">Didedikasikan untuk pelaku UMKM Kalimantan Timur.</span>
            <span className="hidden sm:inline text-white/25">|</span>
            <button
              type="button"
              onClick={() => {
                if (onOpenAdmin) {
                  onOpenAdmin();
                } else {
                  window.location.hash = '#/admin';
                }
              }}
              className="min-h-[44px] sm:min-h-[36px] px-3 sm:px-2 inline-flex items-center gap-1.5 text-[#A4A7AE] hover:text-[#D6B46A] transition-colors focus:outline-none"
              title="Portal Khusus Administrator SANAK GEROBAK"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6B46A]" />
              <span>Akses CMS Admin</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
