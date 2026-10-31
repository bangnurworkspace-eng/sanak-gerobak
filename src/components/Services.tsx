/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { Palette, Truck, Store, Wrench, ArrowRight, Check } from 'lucide-react';

export const Services: React.FC = () => {
  return (
    <section id="layanan" className="relative bg-[#17191D] text-white py-24 sm:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D6B46A] mb-3">
            <span className="w-6 h-[1px] bg-[#D6B46A]" />
            <span>Solusi & Layanan Usaha</span>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Manrope'] [text-wrap:balance]">
            Dari Ide Menjadi Identitas Usaha.
          </h2>
          
          <p className="text-base sm:text-lg text-[#A4A7AE] mt-4 leading-relaxed">
            Kami mendampingi proses perwujudan gerobak dan booth jualan Anda dari tahap curah ide, perancangan visual, fabrikasi fisik, hingga siap pakai beroperasi di lapangan.
          </p>
        </div>

        {/* Varied Layout: 1 Wide Hero Feature + 4-Box Grid (Anti-Card-Clone) */}
        <div className="space-y-6">
          
          {/* Top Wide Highlight Feature: Konsultasi & Kustomisasi 3D */}
          <div className="p-8 sm:p-12 bg-[#101827] rounded-xl border border-white/10 hover:border-[#D6B46A]/40 transition-colors grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D6B46A]/10 border border-[#D6B46A]/30 flex items-center justify-center text-[#D6B46A]">
                  <Palette className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#D6B46A]">
                  Layanan Unggulan
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white font-['Manrope']">
                Konsultasi Konsep & Kustomisasi Desain
              </h3>

              <p className="text-sm sm:text-base text-[#A4A7AE] leading-relaxed">
                Setiap pemilik bisnis memiliki kebutuhan berbeda. Kami membantu merumuskan konsep gerobak yang proporsional dengan luas lapak sewa, tata letak peralatan (kompor, blender, mesin espresso), serta identitas grafis yang ingin ditonjolkan kepada pembeli.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-white/90">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D6B46A] shrink-0" />
                  <span>Diskusi ukuran lapak & ergonomi barista/koki</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D6B46A] shrink-0" />
                  <span>Visualisasi rancangan sebelum produksi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D6B46A] shrink-0" />
                  <span>Pemilihan kombinasi warna & bahan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D6B46A] shrink-0" />
                  <span>Penyesuaian estimasi sesuai bujet</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#17191D] p-6 rounded-lg border border-white/5 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-white block">
                Alur Konsultasi Awal:
              </span>
              <ol className="space-y-3 text-xs text-[#A4A7AE] list-decimal list-inside leading-relaxed">
                <li><strong className="text-white font-medium">Kirim Konsep:</strong> Bagikan sketsa kasaran atau foto referensi yang Anda sukai.</li>
                <li><strong className="text-white font-medium">Review Teknis:</strong> Tim kami meninjau kelayakan ukuran rangka & jalur utilitas.</li>
                <li><strong className="text-white font-medium">Estimasi Realistis:</strong> Menghitung opsi bahan terbaik tanpa membebani modal Anda.</li>
              </ol>
              <div className="pt-2">
                <a
                  href={getGeneralInquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded transition-colors"
                >
                  <span>Mulai Konsultasi Konsep</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 3 Secondary Services: Varied Asymmetric Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Service 1: Gerobak Jualan */}
            <div className="p-8 bg-[#101827] rounded-xl border border-white/10 flex flex-col justify-between group hover:border-[#D6B46A]/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#D6B46A] mb-5">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#D6B46A] block mb-1">Fabrikasi Fisik</span>
                <h4 className="text-xl font-bold text-white font-['Manrope'] mb-2">
                  Gerobak Jualan
                </h4>
                <p className="text-xs sm:text-sm text-[#A4A7AE] leading-relaxed">
                  Pembuatan gerobak dorong, gerobak motor/sepeda, maupun gerobak stasioner dengan rangka hollow galvanis kokoh dan pilihan meja stainless food-grade atau kayu solid.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 text-[11px] text-[#A4A7AE]">
                Cocok untuk: Kuliner, minuman boba, kopi, gorengan modern
              </div>
            </div>

            {/* Service 2: Booth UMKM */}
            <div className="p-8 bg-[#101827] rounded-xl border border-white/10 flex flex-col justify-between group hover:border-[#D6B46A]/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#D6B46A] mb-5">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#D6B46A] block mb-1">Struktur Komersial</span>
                <h4 className="text-xl font-bold text-white font-['Manrope'] mb-2">
                  Booth UMKM & Mini Kiosk
                </h4>
                <p className="text-xs sm:text-sm text-[#A4A7AE] leading-relaxed">
                  Konstruksi booth semi-permanen model kontainer spandek, mini outlet mall, serta kios outdoor yang dapat dikunci aman saat jam operasional selesai.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 text-[11px] text-[#A4A7AE]">
                Cocok untuk: Pujasera, pelataran ruko, area komersial outdoor
              </div>
            </div>

            {/* Service 3: Penyesuaian Operasional */}
            <div className="p-8 bg-[#101827] rounded-xl border border-white/10 flex flex-col justify-between group hover:border-[#D6B46A]/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#D6B46A] mb-5">
                  <Wrench className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#D6B46A] block mb-1">Kelengkapan Utilitas</span>
                <h4 className="text-xl font-bold text-white font-['Manrope'] mb-2">
                  Penyesuaian Kebutuhan Operasional
                </h4>
                <p className="text-xs sm:text-sm text-[#A4A7AE] leading-relaxed">
                  Pemasangan instalasi listrik berstandar SNI (MCB, stop kontak, lampu sorot LED), jalur inlet/outlet air bersih, serta titik dudukan reklame signage.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 text-[11px] text-[#A4A7AE]">
                Cocok untuk: Kebutuhan daya listrik teratur & sanitasi
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
