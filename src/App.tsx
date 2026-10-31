/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandStatement } from './components/BrandStatement';
import { VisualShowcase } from './components/VisualShowcase';
import { Catalog } from './components/Catalog';
import { Process } from './components/Process';
import { LocalSection } from './components/LocalSection';
import { FAQ } from './components/FAQ';
import { ClosingCTA } from './components/ClosingCTA';
import { Footer } from './components/Footer';
import { WhatsAppCTA } from './components/WhatsAppCTA';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useAdminAuth } from './context/AdminAuthContext';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, isAdmin, loading } = useAdminAuth();
  const [currentRoute, setCurrentRoute] = useState<'site' | 'admin' | 'admin_login'>('site');

  const catalogRef = useRef<HTMLDivElement>(null);

  // URL / Hash Route synchronization
  useEffect(() => {
    const syncRouteFromUrl = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path === '/admin/login' || hash === '#/admin/login' || hash === '#admin/login') {
        setCurrentRoute('admin_login');
      } else if (path === '/admin' || hash === '#/admin' || hash === '#admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('site');
      }
    };

    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    window.addEventListener('hashchange', syncRouteFromUrl);
    return () => {
      window.removeEventListener('popstate', syncRouteFromUrl);
      window.removeEventListener('hashchange', syncRouteFromUrl);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    if (path.includes('login')) {
      setCurrentRoute('admin_login');
    } else if (path.includes('admin')) {
      setCurrentRoute('admin');
    } else {
      setCurrentRoute('site');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('katalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Route 1: Admin Login
  if (currentRoute === 'admin_login') {
    if (loading) {
      return (
        <div className="min-h-screen bg-[#0B132B] flex items-center justify-center text-[#D6B46A]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }
    if (isAdmin) {
      // Already authenticated, forward to dashboard
      return <AdminDashboard onViewLiveSite={() => navigateTo('/')} />;
    }
    return (
      <AdminLoginPage
        onBackToSite={() => navigateTo('/')}
        onLoginSuccess={() => navigateTo('/admin')}
      />
    );
  }

  // Route 2: Admin Dashboard (Protected Route)
  if (currentRoute === 'admin') {
    if (loading) {
      return (
        <div className="min-h-screen bg-[#070D19] flex items-center justify-center text-[#D6B46A]">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#D6B46A]" />
            <p className="text-xs text-[#A4A7AE] uppercase tracking-wider font-semibold">
              Memverifikasi Kredensial Administrator...
            </p>
          </div>
        </div>
      );
    }

    if (!user || !isAdmin) {
      return (
        <AdminLoginPage
          onBackToSite={() => navigateTo('/')}
          onLoginSuccess={() => navigateTo('/admin')}
        />
      );
    }

    return <AdminDashboard onViewLiveSite={() => navigateTo('/')} />;
  }

  // Route 3: Public Website
  return (
    <div className="min-h-screen bg-[#101827] text-white flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-[#D6B46A] selection:text-[#101827] overflow-x-hidden">
      {/* A. Navbar (Scroll-reactive transparent to solid, Top Bar Contract, WhatsApp action) */}
      <Navbar />

      <main className="flex-1">
        {/* B. Hero Section (Cinematic full-viewport, exact headline, artistic typography) */}
        <Hero onExploreCatalog={scrollToCatalog} />

        {/* C. Brand Statement (Warm Ivory background, 3 principles, editorial typography) */}
        <BrandStatement />

        {/* D. Visual Showcase (Asymmetric layout, character designs, concept inspiration) */}
        <VisualShowcase onExploreCatalog={scrollToCatalog} />

        {/* Catalog Collection & Detailed Specifications */}
        <div ref={catalogRef}>
          <Catalog />
        </div>

        {/* Section Proses Pemesanan (Alur kerja 4 tahap) */}
        <Process />

        {/* F. Section Lokal ("Dari Bontang, untuk Semangat Usaha Kalimantan Timur.") */}
        <LocalSection />

        {/* Tanya Jawab (FAQ) */}
        <FAQ />

        {/* G. CTA Penutup ("Punya Ide Gerobak Impian?", Midnight Navy + Gold) */}
        <ClosingCTA onExploreCatalog={scrollToCatalog} />
      </main>

      {/* H. Footer (Wordmark, exact tagline, clean categories & links) */}
      <Footer onOpenAdmin={() => navigateTo('/admin')} />

      {/* Floating WhatsApp CTA */}
      <WhatsAppCTA />
    </div>
  );
}
