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
  const { contactInfo } = useSiteContent();
  const activeContact = contactInfo || BRAND_CONFIG.contact;

  return (
    <footer className="bg-[#101827] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Wordmark & Brand Narrative (Cols 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <a 
              href="#beranda" 
              className="group inline-flex items-center gap-3.5 text-xl font-bold tracking-tight text-white focus:outline-none"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/15 shadow-lg bg-[#0B132B] flex items-center justify-center shrink-0 group-hover:border-[#38bdf8]/60 transition-all">
                <img
                  src={BRAND_CONFIG.logoUrl}
                  alt="Logo SANAK GEROBAK"
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

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#A4A7AE]">
              <a 
                href={activeContact.instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#D6B46A] flex items-center gap-1.5 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>{activeContact.instagramHandle}</span>
              </a>
              <span aria-hidden="true">·</span>
              <a 
                href={getGeneralInquiryUrl()}
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#D6B46A] flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{activeContact.whatsappDisplay}</span>
              </a>
              <span aria-hidden="true">·</span>
              <a 
                href={`mailto:${activeContact.email}`}
                className="hover:text-[#D6B46A] flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{activeContact.email}</span>
              </a>
            </div>
          </div>

          {/* Navigation Links (Cols 6-7) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D6B46A] block">
              Navigasi
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[#A4A7AE]">
              <li>
                <a href="#beranda" className="hover:text-white transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-white transition-colors">
                  Katalog
                </a>
              </li>
              <li>
                <a href="#proses" className="hover:text-white transition-colors">
                  Proses Pemesanan
                </a>
              </li>
              <li>
                <a href="#tentang-kami" className="hover:text-white transition-colors">
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Catalog Categories (Cols 8-9) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D6B46A] block">
              Kategori Desain
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[#A4A7AE]">
              <li>
                <a href="#katalog" className="hover:text-white transition-colors">
                  Coffee Cart
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-white transition-colors">
                  Gerobak Minuman
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-white transition-colors">
                  Gerobak Makanan
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-white transition-colors">
                  Booth UMKM
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-white transition-colors">
                  Booth Minimalis
                </a>
              </li>
              <li>
                <a href="#katalog" className="hover:text-white transition-colors">
                  Custom Concept
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Workshop (Cols 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D6B46A] block">
              Workshop & Wilayah
            </span>
            
            <div className="text-xs text-[#A4A7AE] space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5" />
                <span>{activeContact.workshopAddress}</span>
              </div>
              <p className="text-[11px] text-[#A4A7AE] pt-1">
                Layanan konsultasi & pemesanan untuk wilayah Kota Bontang, Samarinda, Balikpapan, dan seluruh Kalimantan Timur.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={getGeneralInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#D6B46A] hover:text-[#C5A154] font-semibold tracking-wide uppercase transition-colors"
              >
                <span>Hubungi via WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Admin CMS Entry */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A4A7AE]">
          <p>
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. Seluruh Hak Cipta Dilindungi.
          </p>
          
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-white/40">Didedikasikan untuk pelaku UMKM Kalimantan Timur.</span>
            <span className="text-white/20">|</span>
            <button
              type="button"
              onClick={() => {
                if (onOpenAdmin) {
                  onOpenAdmin();
                } else {
                  window.location.hash = '#/admin';
                }
              }}
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-[#D6B46A] transition-colors focus:outline-none"
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
