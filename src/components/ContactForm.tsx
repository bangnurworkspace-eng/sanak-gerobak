/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BRAND_CONFIG } from '../config/brand';
import {
  ConsultationFormData,
  compileConsultationMessage,
  getConsultationFormUrl,
  getGeneralInquiryUrl,
} from '../utils/whatsapp';
import {
  MessageCircle,
  MapPin,
  Clock,
  Instagram,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Edit3,
} from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: '',
    customerPhone: '',
    businessType: '',
    cartType: '',
    designConcept: '',
    estimatedBudget: '',
    additionalNotes: '',
  });

  const [errors, setErrors] = useState<{
    fullName?: string;
    businessType?: string;
    cartType?: string;
  }>({});

  const [showPreview, setShowPreview] = useState<boolean>(false);

  const businessTypeOptions = [
    'Kopi',
    'Minuman',
    'Makanan',
    'Roti dan bakery',
    'Usaha lainnya',
  ];

  const cartTypeOptions = [
    'Gerobak jualan',
    'Booth UMKM',
    'Booth makanan/minuman',
    'Custom sesuai kebutuhan',
    'Masih ingin berkonsultasi',
  ];

  const budgetOptions = [
    'Belum menentukan anggaran',
    'Di bawah Rp 8.000.000',
    'Rp 8.000.000 – Rp 15.000.000',
    'Rp 15.000.000 – Rp 25.000.000',
    'Di atas Rp 25.000.000',
  ];

  const validate = (): boolean => {
    const newErrors: {
      fullName?: string;
      businessType?: string;
      cartType?: string;
    } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Nama minimal terdiri dari 2 karakter.';
    } else if (formData.fullName.length > 70) {
      newErrors.fullName = 'Nama terlalu panjang (maksimal 70 karakter).';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Silakan pilih jenis usaha Anda.';
    }

    if (!formData.cartType) {
      newErrors.cartType = 'Silakan pilih jenis gerobak atau booth.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowPreview(true);
    }
  };

  const handleOpenWhatsApp = () => {
    const url = getConsultationFormUrl(formData);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const compiledMessagePreview = compileConsultationMessage(formData);

  return (
    <section id="kontak" className="relative bg-[#17191D] text-white py-24 sm:py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Prompt G) */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D6B46A] mb-3">
            <span className="w-6 h-[1px] bg-[#D6B46A]" />
            <span>Mulai Langkah Usaha</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Manrope'] [text-wrap:balance]">
            Ceritakan Rencana Usaha Anda.
          </h2>

          <p className="text-base sm:text-lg text-[#A4A7AE] mt-4 leading-relaxed">
            Mulai dari ide sederhana. Kami siap membantu Anda mendiskusikan konsep gerobak yang sesuai dengan kebutuhan usaha.
          </p>
        </div>

        {/* 2-Column Split: Business Info & Consultation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct WhatsApp & Confirmed Business Details */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Direct Quick WhatsApp Box */}
            <div className="p-6 sm:p-8 bg-[#101827] rounded-xl border border-[#D6B46A]/30 space-y-4 shadow-xl">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D6B46A] block">
                Konsultasi Cepat Tanpa Formulir
              </span>

              <h3 className="text-xl font-bold text-white font-['Manrope']">
                Ingin Langsung Chat dengan Tim Kami?
              </h3>

              <p className="text-xs sm:text-sm text-[#A4A7AE] leading-relaxed">
                Anda juga dapat langsung menghubungi WhatsApp resmi untuk sekadar bertanya seputar konsep gerobak atau penjadwalan diskusi.
              </p>

              <div className="pt-2">
                <a
                  href={getGeneralInquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-md transition-all shadow-md active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 fill-[#101827]" />
                  <span>Chat WhatsApp Langsung</span>
                </a>
              </div>
            </div>

            {/* Official Confirmed Business Information (Prompt A & G) */}
            <div className="space-y-4 text-xs sm:text-sm text-[#A4A7AE]">
              <span className="text-xs font-semibold uppercase tracking-wider text-white block">
                Informasi Workshop & Layanan:
              </span>

              <div className="flex items-start gap-3 p-4 bg-[#101827] rounded-lg border border-white/5">
                <MapPin className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Wilayah Workshop:</span>
                  <span>{BRAND_CONFIG.contact.serviceArea}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#101827] rounded-lg border border-white/5">
                <Clock className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Jam Konsultasi:</span>
                  <span>{BRAND_CONFIG.contact.businessHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#101827] rounded-lg border border-white/5">
                <Instagram className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Instagram Resmi:</span>
                  <a
                    href={BRAND_CONFIG.contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D6B46A] hover:underline"
                  >
                    {BRAND_CONFIG.contact.instagramHandle}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#101827] rounded-lg border border-white/5">
                <Mail className="w-4 h-4 text-[#D6B46A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold block">Email:</span>
                  <span>{BRAND_CONFIG.contact.email}</span>
                </div>
              </div>
            </div>

            {/* Official Tagline Lockup */}
            <div className="p-4 bg-[#101827] rounded-lg border border-white/5 text-center">
              <p className="text-sm font-bold text-white font-['Manrope']">
                “{BRAND_CONFIG.officialTagline}”
              </p>
              <p className="text-xs text-[#D6B46A] mt-0.5">
                {BRAND_CONFIG.supportingSentence}
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Consultation Form */}
          <div className="lg:col-span-7 bg-[#101827] p-6 sm:p-10 rounded-xl border border-white/10 shadow-2xl">
            
            {!showPreview ? (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-['Manrope'] mb-1">
                    Formulir Rencana Konsultasi
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A4A7AE]">
                    Isi informasi dasar di bawah ini untuk membantu kami memahami konsep gerobak yang Anda butuhkan.
                  </p>
                </div>

                {/* 1. Nama Lengkap (Wajib) */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5"
                  >
                    1. Nama Lengkap <span className="text-[#D6B46A]">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    maxLength={70}
                    placeholder="Nama Anda atau nama brand usaha Anda"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                    }}
                    className={`w-full px-4 py-3 text-xs sm:text-sm bg-[#17191D] text-white border rounded-lg focus:outline-none transition-colors placeholder:text-white/30 ${
                      errors.fullName
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-white/10 focus:border-[#D6B46A]'
                    }`}
                    aria-invalid={errors.fullName ? 'true' : 'false'}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* 2. Nomor WhatsApp Pelanggan (Opsional) */}
                <div>
                  <label
                    htmlFor="customerPhone"
                    className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5"
                  >
                    2. Nomor WhatsApp Anda <span className="text-white/40 font-normal lowercase">(opsional)</span>
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    maxLength={20}
                    placeholder="Contoh: 0812-3456-7890"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#17191D] text-white border border-white/10 rounded-lg focus:border-[#D6B46A] focus:outline-none transition-colors placeholder:text-white/30"
                  />
                </div>

                {/* 3. Jenis Usaha (Wajib) */}
                <div>
                  <label
                    htmlFor="businessType"
                    className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5"
                  >
                    3. Jenis Usaha <span className="text-[#D6B46A]">*</span>
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={(e) => {
                      setFormData({ ...formData, businessType: e.target.value });
                      if (errors.businessType) setErrors({ ...errors, businessType: undefined });
                    }}
                    className={`w-full px-4 py-3 text-xs sm:text-sm bg-[#17191D] text-white border rounded-lg focus:outline-none transition-colors ${
                      errors.businessType
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-white/10 focus:border-[#D6B46A]'
                    }`}
                    aria-invalid={errors.businessType ? 'true' : 'false'}
                    aria-describedby={errors.businessType ? 'businessType-error' : undefined}
                  >
                    <option value="" disabled>Pilih jenis usaha Anda...</option>
                    {businessTypeOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#17191D] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.businessType && (
                    <p id="businessType-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.businessType}</span>
                    </p>
                  )}
                </div>

                {/* 4. Jenis Gerobak atau Booth (Wajib) */}
                <div>
                  <label
                    htmlFor="cartType"
                    className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5"
                  >
                    4. Jenis Gerobak atau Booth <span className="text-[#D6B46A]">*</span>
                  </label>
                  <select
                    id="cartType"
                    name="cartType"
                    value={formData.cartType}
                    onChange={(e) => {
                      setFormData({ ...formData, cartType: e.target.value });
                      if (errors.cartType) setErrors({ ...errors, cartType: undefined });
                    }}
                    className={`w-full px-4 py-3 text-xs sm:text-sm bg-[#17191D] text-white border rounded-lg focus:outline-none transition-colors ${
                      errors.cartType
                        ? 'border-rose-500 focus:border-rose-400'
                        : 'border-white/10 focus:border-[#D6B46A]'
                    }`}
                    aria-invalid={errors.cartType ? 'true' : 'false'}
                    aria-describedby={errors.cartType ? 'cartType-error' : undefined}
                  >
                    <option value="" disabled>Pilih jenis gerobak / booth yang direncanakan...</option>
                    {cartTypeOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#17191D] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.cartType && (
                    <p id="cartType-error" className="mt-1.5 text-xs text-rose-400 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.cartType}</span>
                    </p>
                  )}
                </div>

                {/* 5. Konsep Desain yang Diinginkan (Opsional) */}
                <div>
                  <label
                    htmlFor="designConcept"
                    className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5"
                  >
                    5. Konsep Desain yang Diinginkan <span className="text-white/40 font-normal lowercase">(opsional)</span>
                  </label>
                  <input
                    type="text"
                    id="designConcept"
                    name="designConcept"
                    maxLength={100}
                    placeholder="Contoh: Industrial modern, minimalis kayu, etalase kaca lengkung..."
                    value={formData.designConcept}
                    onChange={(e) => setFormData({ ...formData, designConcept: e.target.value })}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#17191D] text-white border border-white/10 rounded-lg focus:border-[#D6B46A] focus:outline-none transition-colors placeholder:text-white/30"
                  />
                </div>

                {/* 6. Perkiraan Anggaran (Opsional) */}
                <div>
                  <label
                    htmlFor="estimatedBudget"
                    className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5"
                  >
                    6. Perkiraan Anggaran <span className="text-white/40 font-normal lowercase">(opsional)</span>
                  </label>
                  <select
                    id="estimatedBudget"
                    name="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#17191D] text-white border border-white/10 rounded-lg focus:border-[#D6B46A] focus:outline-none transition-colors"
                  >
                    <option value="">Pilih perkiraan anggaran jika sudah ada...</option>
                    {budgetOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#17191D] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 7. Catatan Tambahan (Opsional) */}
                <div>
                  <label
                    htmlFor="additionalNotes"
                    className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5"
                  >
                    7. Catatan Tambahan <span className="text-white/40 font-normal lowercase">(opsional)</span>
                  </label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    rows={3}
                    maxLength={300}
                    placeholder="Tuliskan ukuran lapak atau peralatan yang akan digunakan (misal: mesin espresso, deep fryer, kompor)..."
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    className="w-full px-4 py-3 text-xs sm:text-sm bg-[#17191D] text-white border border-white/10 rounded-lg focus:border-[#D6B46A] focus:outline-none transition-colors placeholder:text-white/30 resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-lg transition-all shadow-lg active:scale-[0.99] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Lanjutkan & Siapkan Pesan WhatsApp</span>
                  </button>

                  <p className="mt-3 text-[11px] text-center text-[#A4A7AE] leading-relaxed">
                    *Formulir ini menyusun pesan konsultasi Anda agar langsung terbuka di WhatsApp. Tidak ada data yang disimpan ke database.
                  </p>
                </div>
              </form>
            ) : (
              /* Message Summary & WhatsApp Launch Preview (Prompt C) */
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-[#D6B46A]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pesan Konsultasi Siap Dikirim</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white font-['Manrope']">
                    Pratinjau Pesan Anda
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A4A7AE]">
                    Periksa kembali rincian di bawah ini sebelum aplikasi WhatsApp dibuka.
                  </p>
                </div>

                {/* Compiled WhatsApp text preview box */}
                <div className="p-5 bg-[#17191D] rounded-lg border border-white/10 font-mono text-xs text-white/90 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
                  {compiledMessagePreview}
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleOpenWhatsApp}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#101827] bg-[#D6B46A] hover:bg-[#C5A154] rounded-lg transition-all shadow-xl active:scale-[0.99] cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-[#101827]" />
                    <span>Buka WhatsApp Sekarang</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-[#A4A7AE] hover:text-white bg-transparent border border-white/10 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Ubah Kembali Data Formulir</span>
                  </button>
                </div>

                <div className="p-3 bg-[#17191D] rounded text-[11px] text-[#A4A7AE] text-center border border-white/5">
                  WhatsApp akan terbuka dengan pesan yang sudah terisi otomatis. Anda dapat menambahkan foto atau catatan lain di chat.
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
