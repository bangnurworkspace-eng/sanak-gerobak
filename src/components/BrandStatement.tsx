/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BRAND_CONFIG } from '../config/brand';
import { Sparkles, Compass, TrendingUp } from 'lucide-react';

export const BrandStatement: React.FC = () => {
  const icons = [Sparkles, Compass, TrendingUp];

  return (
    <section 
      id="filosofi" 
      className="relative bg-[#F6F2E9] text-[#17191D] py-24 sm:py-32 overflow-hidden border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header with Generous Whitespace */}
        <div className="max-w-4xl mb-20">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#17191D]/70 mb-4">
            <span className="w-8 h-[2px] bg-[#D6B46A]" />
            <span>Filosofi SANAK GEROBAK</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#17191D] tracking-tight font-['Manrope'] leading-[1.12] mb-6 [text-wrap:balance]">
            Bukan Sekadar Gerobak. Ini Wajah Bisnis Anda.
          </h2>

          <p className="text-lg sm:text-xl text-[#17191D]/80 font-normal leading-relaxed max-w-3xl [text-wrap:balance]">
            Setiap usaha memiliki karakter dan cerita. Kami ingin membantu menghadirkan tempat berjualan yang sesuai dengan kebutuhan, identitas, dan impian pemiliknya.
          </p>
        </div>

        {/* Three Principles — Asymmetric & Editorial */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pt-4">
          {BRAND_CONFIG.principles.map((p, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div 
                key={p.number}
                className="relative bg-white/80 backdrop-blur-sm p-8 sm:p-10 rounded-xl border border-black/5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl font-black font-mono text-[#D6B46A] tabular-nums">
                      {p.number}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#101827] text-[#D6B46A] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#17191D] font-['Manrope'] mb-3">
                    {p.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#17191D]/75 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-black/5 text-[11px] font-mono uppercase tracking-wider text-[#17191D]/50 flex items-center justify-between">
                  <span>Prinsip Usaha</span>
                  <span>SANAK GEROBAK</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
