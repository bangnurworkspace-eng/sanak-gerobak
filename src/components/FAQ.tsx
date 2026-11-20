/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { getGeneralInquiryUrl } from '../utils/whatsapp';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export const FAQ: React.FC = () => {
  const { faqList, isLoading } = useSiteContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const activeFaqs = faqList || [];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative bg-[#101827] text-white py-16 sm:py-24 lg:py-32 border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D6B46A] mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Tanya Jawab Seputar Pemesanan</span>
          </div>

          <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tight font-['Manrope'] [text-wrap:balance]">
            Pertanyaan yang Sering Ditanyakan.
          </h2>

          <p className="text-[15px] sm:text-base text-[#A4A7AE] mt-2.5 sm:mt-3">
            Rangkuman jawaban seputar cara pemesanan, kustomisasi, dan ketentuan konsultasi di SANAK GEROBAK.
          </p>
        </div>

        {/* Interactive Accordion Items */}
        <div className="space-y-3 sm:space-y-3.5">
          {isLoading && activeFaqs.length === 0 ? (
            [0, 1, 2].map((idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-xl bg-[#17191D] border border-white/10 animate-pulse">
                <div className="h-4 w-2/3 bg-white/10 rounded" />
              </div>
            ))
          ) : (
            activeFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#17191D] rounded-xl border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full min-h-[56px] p-4 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B46A] transition-colors hover:bg-white/5 active:bg-white/10"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  <span className="text-sm sm:text-base font-semibold text-white font-['Manrope'] pr-2 leading-snug">
                    {idx + 1}. {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D6B46A] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-question-${idx}`}
                    className="px-4 sm:px-6 pb-5 sm:pb-6 pt-2 text-[13px] sm:text-sm text-[#A4A7AE] leading-relaxed border-t border-white/5 animate-fade-in"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
          )}
        </div>

        {/* Bottom Help Desk Prompt */}
        <div className="mt-8 sm:mt-12 p-5 sm:p-8 bg-[#17191D] rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-white font-semibold text-sm block">
              Ada pertanyaan lain yang ingin didiskusikan?
            </span>
            <p className="text-xs text-[#A4A7AE]">
              Tim kami siap membantu menjawab pertanyaan teknis seputar tempat jualan Anda.
            </p>
          </div>

          <a
            href={getGeneralInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-md shrink-0 active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-[#101827]" />
            <span>Tanya via WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
