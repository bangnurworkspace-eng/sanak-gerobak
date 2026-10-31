/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CMSProduct,
  CMSCategory,
  CMSPortfolioItem,
  getProducts,
  getCategories,
  getPortfolio,
  seedInitialDataIfEmpty,
} from '../../services/cmsService';
import {
  Store,
  FolderTree,
  Briefcase,
  CheckCircle2,
  FileEdit,
  Database,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { AdminTab } from './AdminSidebar';

interface OverviewViewProps {
  onNavigateTab: (tab: AdminTab) => void;
  onRefreshAll: () => Promise<void>;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateTab, onRefreshAll }) => {
  const [products, setProducts] = useState<CMSProduct[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [portfolio, setPortfolio] = useState<CMSPortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prod, cat, port] = await Promise.all([
        getProducts(true),
        getCategories(),
        getPortfolio(true),
      ]);
      setProducts(prod);
      setCategories(cat);
      setPortfolio(port);
    } catch (err) {
      console.warn('Overview load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeedDatabase = async () => {
    if (!window.confirm('Inisialisasi data bawaan SANAK GEROBAK ke Cloud Firestore?')) return;
    setIsSeeding(true);
    setSeedMessage(null);
    try {
      const result = await seedInitialDataIfEmpty();
      if (result) {
        setSeedMessage('Data bawaan berhasil disimpan ke Cloud Firestore!');
        await loadData();
        await onRefreshAll();
      } else {
        setSeedMessage('Data produk sudah ada di Firestore. Tidak ditimpa.');
      }
    } catch (err: any) {
      setSeedMessage('Gagal inisialisasi: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const publishedCount = products.filter((p) => p.status === 'published').length;
  const draftCount = products.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans']">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#101827] to-[#0B132B] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B46A]/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panel Manajemen Konten Realtime</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Manrope']">
            Selamat Datang di CMS {BRAND_CONFIG.name}
          </h1>

          <p className="text-sm text-[#A4A7AE] leading-relaxed">
            Kelola katalog gerobak, layanan, portofolio, dan nomor kontak resmi usaha secara langsung. Semua perubahan langsung terhubung ke Cloud Firestore dan tercermin pada website publik.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('catalog')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D6B46A] text-[#101827] rounded-xl font-bold text-xs uppercase tracking-wide hover:bg-[#C5A154] transition-colors"
            >
              <span>Kelola Katalog Gerobak</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:border-[#D6B46A]/40 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D6B46A]" />
                  <span>Menginisialisasi...</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-[#D6B46A]" />
                  <span>Sinkronisasi Data Awal</span>
                </>
              )}
            </button>
          </div>

          {seedMessage && (
            <p className="text-xs text-[#D6B46A] pt-1 font-medium">{seedMessage}</p>
          )}
        </div>
      </div>

      {/* Real Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Desain Gerobak */}
        <div className="bg-[#101827] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-[#A4A7AE]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Produk</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-['Manrope']">
              {isLoading ? '...' : products.length}
            </div>
            <p className="text-xs text-[#A4A7AE] mt-1">Item dalam basis data</p>
          </div>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-green-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>{publishedCount} Terbit</span>
            </span>
            <span className="text-amber-400 flex items-center gap-1 font-medium">
              <FileEdit className="w-3 h-3" />
              <span>{draftCount} Draf</span>
            </span>
          </div>
        </div>

        {/* Kategori Desain */}
        <div className="bg-[#101827] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-[#A4A7AE]">
            <span className="text-xs font-semibold uppercase tracking-wider">Kategori Usaha</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-['Manrope']">
              {isLoading ? '...' : categories.length}
            </div>
            <p className="text-xs text-[#A4A7AE] mt-1">Taksonomi aktif</p>
          </div>
          <div className="pt-2 border-t border-white/5">
            <button
              onClick={() => onNavigateTab('categories')}
              className="text-xs text-[#D6B46A] hover:underline flex items-center gap-1"
            >
              <span>Atur Kategori</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Portofolio & Proyek */}
        <div className="bg-[#101827] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-[#A4A7AE]">
            <span className="text-xs font-semibold uppercase tracking-wider">Portofolio</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-['Manrope']">
              {isLoading ? '...' : portfolio.length}
            </div>
            <p className="text-xs text-[#A4A7AE] mt-1">Proyek & Desain Showcase</p>
          </div>
          <div className="pt-2 border-t border-white/5">
            <button
              onClick={() => onNavigateTab('portfolio')}
              className="text-xs text-[#D6B46A] hover:underline flex items-center gap-1"
            >
              <span>Lihat Portofolio</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-[#101827] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-[#A4A7AE]">
            <span className="text-xs font-semibold uppercase tracking-wider">Cloud Backend</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firestore Aktif</span>
            </div>
            <p className="text-[11px] text-[#A4A7AE] mt-1">RBAC & Aturan Keamanan Diterapkan</p>
          </div>
          <div className="pt-2 border-t border-white/5 text-[11px] text-white/50 truncate">
            DB: ai-studio-sanakgerobak
          </div>
        </div>

      </div>

      {/* Quick Launchpad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section Management Quick Links */}
        <div className="bg-[#101827] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white font-['Manrope']">
            Modul Pengaturan Cepat
          </h3>
          <p className="text-xs text-[#A4A7AE]">
            Klik salah satu modul di bawah untuk langsung memperbarui bagian tertentu pada website:
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('hero_home')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D6B46A]/30 text-left transition-colors"
            >
              <p className="text-xs font-bold text-white">Hero & Semboyan</p>
              <p className="text-[11px] text-[#A4A7AE] mt-0.5">Tagline & gambar utama</p>
            </button>

            <button
              onClick={() => onNavigateTab('contact')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D6B46A]/30 text-left transition-colors"
            >
              <p className="text-xs font-bold text-white">Kontak WhatsApp</p>
              <p className="text-[11px] text-[#A4A7AE] mt-0.5">Nomor resmi & Instagram</p>
            </button>

            <button
              onClick={() => onNavigateTab('services')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D6B46A]/30 text-left transition-colors"
            >
              <p className="text-xs font-bold text-white">Daftar Layanan</p>
              <p className="text-[11px] text-[#A4A7AE] mt-0.5">Poin pengerjaan gerobak</p>
            </button>

            <button
              onClick={() => onNavigateTab('faq')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D6B46A]/30 text-left transition-colors"
            >
              <p className="text-xs font-bold text-white">Tanya Jawab (FAQ)</p>
              <p className="text-[11px] text-[#A4A7AE] mt-0.5">7 jawaban resmi pelanggan</p>
            </button>
          </div>
        </div>

        {/* Security & Access Information */}
        <div className="bg-[#101827] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-[#D6B46A]">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-bold text-white font-['Manrope']">
              Keamanan & Verifikasi Hak Akses
            </h3>
          </div>

          <div className="space-y-2 text-xs text-[#A4A7AE] leading-relaxed">
            <p>
              • Akses perubahan konten dibatasi secara ketat menggunakan <strong>Firestore Security Rules</strong>.
            </p>
            <p>
              • Hanya pengguna terverifikasi di dokumen <code className="text-[#D6B46A]">admins</code> atau email superadmin <span className="text-white">bangnurworkspace@gmail.com</span> yang diizinkan menulis data.
            </p>
            <p>
              • Seluruh input formulir disanitasi dan dilengkapi pratinjau sebelum diterbitkan ke publik.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <span className="text-xs text-[#A4A7AE]">Status Sinkronisasi Publik</span>
            <span className="text-xs font-bold text-emerald-400">Aktif & Beroperasi</span>
          </div>
        </div>

      </div>

    </div>
  );
};
