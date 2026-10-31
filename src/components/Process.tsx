/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BRAND_CONFIG } from '../config/brand';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { ArrowRight, MessageCircle, AlertCircle } from 'lucide-react';

export const Process: React.FC = () => {
  return (
    <section id="proses" className="relative bg-[#101827] text-white py-24 sm:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D6B46A] mb-3">
            <span className="w-6 h-[1px] bg-[#D6B46A]" />
            <span>Alur Pemesanan Transparan</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Manrope'] [text-wrap:balance]">
            Empat Tahap Menuju Gerobak Impian Anda.
          </h2>

          <p className="text-base sm:text-lg text-[#A4A7AE] mt-4 leading-relaxed">
            Kami menjaga komunikasi terbuka di setiap langkah agar bentuk dan fungsi gerobak benar-benar sesuai dengan kenyamanan usaha Anda.
          </p>
        </div>

        {/* 4-Stage Visual Timeline Grid (Prompt D) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {BRAND_CONFIG.processSteps.map((step, idx) => (
            <div
              key={step.stageNumber}
              className="relative p-7 sm:p-8 bg-[#17191D] rounded-xl border border-white/10 hover:border-[#D6B46A]/50 transition-colors flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Number & Step Tag */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black font-mono text-[#D6B46A] tabular-nums">
                    {step.stageNumber}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#A4A7AE]">
                    {step.step}
                  </span>
                </div>

                {/* Stage Title */}
                <h3 className="text-xl font-bold text-white font-['Manrope'] mb-3 group-hover:text-[#D6B46A] transition-colors">
                  {step.title}
                </h3>

                {/* Exact Description */}
                <p className="text-xs sm:text-sm text-[#A4A7AE] leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              {/* Note */}
              <div className="pt-4 border-t border-white/5 text-[11px] text-white/50 italic">
                {step.note}
              </div>
            </div>
          ))}
        </div>

        {/* Honest Agreement Notice (Prompt D Requirement) */}
        <div className="mt-12 p-5 bg-[#17191D] rounded-xl border border-white/10 flex items-start sm:items-center gap-3.5 text-xs text-[#A4A7AE]">
          <AlertCircle className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong className="text-white font-medium">Catatan Pengerjaan:</strong> Rincian spesifikasi teknis, waktu penyelesaian, dan ketentuan pengerjaan bergantung pada kebutuhan serta kesepakatan masing-masing proyek yang telah dikonfirmasi bersama.
          </p>
        </div>

        {/* Fast Action CTA */}
        <div className="mt-10 text-center">
          <a
            href={getGeneralInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-md active:scale-[0.99]"
          >
            <MessageCircle className="w-4 h-4 fill-[#101827]" />
            <span>Mulai Tahap 01: Konsultasi Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
