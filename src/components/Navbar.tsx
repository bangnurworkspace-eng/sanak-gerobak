/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BRAND_CONFIG } from '../config/brand';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { Menu, X, MessageCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('beranda');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check current section for active indicator
      const sections = ['beranda', 'katalog', 'proses', 'tentang-kami'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#beranda', id: 'beranda' },
    { label: 'Katalog', href: '#katalog', id: 'katalog' },
    { label: 'Proses Pemesanan', href: '#proses', id: 'proses' },
    { label: 'Tentang Kami', href: '#tentang-kami', id: 'tentang-kami' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#101827]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-3'
          : 'bg-transparent border-b border-white/10 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          
          {/* Left: Wordmark & Logo SANAK GEROBAK */}
          <a
            href="#beranda"
            className="group flex items-center gap-3 text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 transition-opacity hover:opacity-95 focus:outline-none"
            aria-label="SANAK GEROBAK Beranda"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-white/15 shadow-md bg-[#0B132B] flex items-center justify-center shrink-0 group-hover:border-[#38bdf8]/60 transition-colors">
              <img
                src={BRAND_CONFIG.logoUrl}
                alt="Logo SANAK GEROBAK"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider font-['Manrope'] text-white leading-tight">
                {BRAND_CONFIG.name}
              </span>
              <span className="text-[10px] tracking-widest text-[#D6B46A] uppercase font-semibold">
                Bontang, Kaltim
              </span>
            </div>
          </a>

          {/* Center: Clean Text Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/80">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    isActive ? 'text-[#D6B46A] font-semibold' : 'hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D6B46A] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right: Tombol "Konsultasi Gratis" dengan ikon WhatsApp */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href={getGeneralInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 fill-[#101827]" />
              <span>Konsultasi Gratis</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={getGeneralInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-[#101827] bg-[#D6B46A] rounded"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#101827]" />
              <span>Konsul</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/90 hover:text-white rounded-md border border-white/10 bg-[#17191D]/80 backdrop-blur-sm"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 border-t border-white/10 bg-[#17191D]/98 backdrop-blur-xl px-6 py-6 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-2 text-sm text-[#A4A7AE] font-medium">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-md transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#101827] text-[#D6B46A] font-semibold'
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10">
            <a
              href={getGeneralInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-[#101827]" />
              <span>Konsultasi Gratis via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
