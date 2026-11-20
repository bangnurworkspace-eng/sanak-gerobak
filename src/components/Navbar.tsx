/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BRAND_CONFIG } from '../config/brand';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { Menu, X, MessageCircle, ChevronRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const Navbar: React.FC = () => {
  const { contactInfo } = useSiteContent();
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
          const top = el.getBoundingClientRect().top + window.scrollY;
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

  // Lock background scroll & support Escape key when mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Beranda', href: '#beranda', id: 'beranda' },
    { label: 'Katalog', href: '#katalog', id: 'katalog' },
    { label: 'Proses Pemesanan', href: '#proses', id: 'proses' },
    { label: 'Tentang Kami', href: '#tentang-kami', id: 'tentang-kami' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? 'bg-[#101827]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-2.5 sm:py-3'
            : 'bg-transparent border-b border-white/10 py-3 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-6">
            
            {/* Left: Wordmark & Logo SANAK GEROBAK */}
            <a
              href="#beranda"
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-center gap-2.5 sm:gap-3 text-base sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 transition-opacity hover:opacity-95 focus:outline-none min-h-[44px]"
              aria-label="SANAK GEROBAK Beranda"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-white/15 shadow-md bg-[#0B132B] flex items-center justify-center shrink-0 group-hover:border-[#38bdf8]/60 transition-colors">
                <img
                  src={BRAND_CONFIG.logoUrl}
                  alt="Logo SANAK GEROBAK"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-wider font-['Manrope'] text-white leading-tight text-sm sm:text-xl">
                  {BRAND_CONFIG.name}
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-widest text-[#D6B46A] uppercase font-semibold">
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
                href={getGeneralInquiryUrl(contactInfo?.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 fill-[#101827]" />
                <span>Konsultasi Gratis</span>
              </a>
            </div>

            {/* Mobile hamburger & quick WhatsApp */}
            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <a
                href={getGeneralInquiryUrl(contactInfo?.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 text-xs font-semibold text-[#101827] bg-[#D6B46A] active:bg-[#C5A154] rounded-md whitespace-nowrap"
                aria-label="Konsultasi WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-[#101827]" />
                <span>Konsul</span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2.5 text-white/90 hover:text-white rounded-md border border-white/10 bg-[#17191D]/85 backdrop-blur-sm active:scale-95 transition-transform"
                aria-label={mobileMenuOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer + Backdrop */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            aria-label="Navigasi Mobile"
            className="relative top-[64px] mx-3 rounded-2xl border border-white/15 bg-[#17191D]/98 backdrop-blur-xl p-4 space-y-3 shadow-2xl"
          >
            <div className="flex flex-col space-y-1 text-sm text-[#A4A7AE] font-medium">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`min-h-[44px] px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-[#101827] text-[#D6B46A] font-semibold border border-[#D6B46A]/30'
                        : 'hover:bg-white/5 active:bg-white/10 text-white/90'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#D6B46A]' : 'text-white/30'}`} />
                  </a>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/10">
              <a
                href={getGeneralInquiryUrl(contactInfo?.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] active:scale-[0.99] rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-[#101827]" />
                <span>Konsultasi Gratis via WhatsApp</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
