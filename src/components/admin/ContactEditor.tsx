/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { getSiteSection, saveSiteSection } from '../../services/cmsService';
import { BRAND_CONFIG } from '../../config/brand';
import { Save, Loader2, CheckCircle2, PhoneCall, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ContactEditorProps {
  onRefreshPublicSite: () => Promise<void>;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({ onRefreshPublicSite }) => {
  const [whatsappNumber, setWhatsappNumber] = useState(BRAND_CONFIG.contact.whatsappNumber);
  const [whatsappDisplay, setWhatsappDisplay] = useState(BRAND_CONFIG.contact.whatsappDisplay);
  const [instagramUrl, setInstagramUrl] = useState(BRAND_CONFIG.contact.instagramUrl);
  const [instagramHandle, setInstagramHandle] = useState(BRAND_CONFIG.contact.instagramHandle);
  const [email, setEmail] = useState(BRAND_CONFIG.contact.email);
  const [serviceArea, setServiceArea] = useState(BRAND_CONFIG.contact.serviceArea);
  const [workshopAddress, setWorkshopAddress] = useState(BRAND_CONFIG.contact.workshopAddress);
  const [businessHours, setBusinessHours] = useState(BRAND_CONFIG.contact.businessHours);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  useEffect(() => {
    const loadContact = async () => {
      setIsLoading(true);
      try {
        const data = await getSiteSection('settings', { contact: BRAND_CONFIG.contact });
        if (data?.contact) {
          const isOldPlaceholder = data.contact.whatsappNumber === '6282154321098';
          setWhatsappNumber(
            isOldPlaceholder
              ? BRAND_CONFIG.contact.whatsappNumber
              : data.contact.whatsappNumber || BRAND_CONFIG.contact.whatsappNumber
          );
          setWhatsappDisplay(
            isOldPlaceholder
              ? BRAND_CONFIG.contact.whatsappDisplay
              : data.contact.whatsappDisplay || BRAND_CONFIG.contact.whatsappDisplay
          );
          setInstagramUrl(data.contact.instagramUrl || BRAND_CONFIG.contact.instagramUrl);
          setInstagramHandle(data.contact.instagramHandle || BRAND_CONFIG.contact.instagramHandle);
          setEmail(data.contact.email || BRAND_CONFIG.contact.email);
          setServiceArea(data.contact.serviceArea || BRAND_CONFIG.contact.serviceArea);
          setWorkshopAddress(data.contact.workshopAddress || BRAND_CONFIG.contact.workshopAddress);
          setBusinessHours(data.contact.businessHours || BRAND_CONFIG.contact.businessHours);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadContact();
  }, []);

  const handleWhatsappNumberChange = (val: string) => {
    // Clean non-digits and convert leading 08... to 628...
    let cleaned = val.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    setWhatsappNumber(cleaned);

    if (val.includes('+') || val.includes(' ') || val.includes('-')) {
      setValidationWarning('Simbol (+, spasi, tanda hubung) otomatis dibersihkan agar tautan WhatsApp berjalan sempurna.');
    } else {
      setValidationWarning(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumber || whatsappNumber.length < 9) {
      setValidationWarning('Mohon masukkan nomor WhatsApp yang valid (contoh: 6282344628667 atau 082344628667).');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const normalizedNumber = whatsappNumber.startsWith('0')
        ? '62' + whatsappNumber.slice(1)
        : whatsappNumber;

      const existingSettings = await getSiteSection('settings', {});
      await saveSiteSection('settings', {
        ...existingSettings,
        contact: {
          whatsappNumber: normalizedNumber,
          whatsappDisplay: whatsappDisplay || '0823-4462-8667',
          instagramUrl,
          instagramHandle,
          email,
          serviceArea,
          workshopAddress,
          businessHours,
        },
      });

      BRAND_CONFIG.contact.whatsappNumber = normalizedNumber;
      BRAND_CONFIG.contact.whatsappDisplay = whatsappDisplay || '0823-4462-8667';

      setSaveSuccess(true);
      await onRefreshPublicSite();
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setValidationWarning('Gagal menyimpan kontak: ' + (err.message || 'Terjadi kesalahan.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl font-['Plus_Jakarta_Sans']">
      
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Manrope']">
            Informasi Kontak & Workshop Resmi
          </h2>
          <p className="text-xs text-[#A4A7AE] mt-0.5">
            Sumber tunggal (Single Source of Truth) untuk integrasi WhatsApp, Instagram, dan lokasi workshop.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Kontak Tersimpan di Cloud</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center text-[#A4A7AE]">
          <Loader2 className="w-8 h-8 animate-spin text-[#D6B46A]" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-[#101827] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
          
          {/* Important WhatsApp Notice */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-blue-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Standar Integrasi WhatsApp SANAK GEROBAK</span>
            </div>
            <p className="leading-relaxed">
              Nomor WhatsApp digunakan langsung oleh seluruh tombol konsultasi dan pemesanan katalog. Sistem otomatis merangkai pesan pembuka dengan format URL-encoded resmi tanpa perantara bot pihak ketiga.
            </p>
          </div>

          {validationWarning && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{validationWarning}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Nomor WhatsApp Internasional (Hanya Angka) *
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => handleWhatsappNumberChange(e.target.value)}
                placeholder="6282344628667"
                required
                className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A] font-mono"
              />
              <p className="text-[11px] text-[#A4A7AE] mt-1">Format: 6282344628667 (untuk nomor 082344628667)</p>
            </div>

            {/* WhatsApp Display */}
            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Format Teks Tampilan Nomor (Untuk UI Pengunjung)
              </label>
              <input
                type="text"
                value={whatsappDisplay}
                onChange={(e) => setWhatsappDisplay(e.target.value)}
                placeholder="0823-4462-8667"
                required
                className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
              <p className="text-[11px] text-[#A4A7AE] mt-1">Teks rapi yang terbaca di navbar dan footer.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Instagram Handle */}
            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Username Instagram (Handle)
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@sanakgerobak"
                className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
            </div>

            {/* Instagram URL */}
            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Tautan Profil Instagram Resmi
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/sanakgerobak"
                className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Email Korespondensi Bisnis
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="halo@sanakgerobak.com"
                className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
            </div>

            {/* Business Hours */}
            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Jam Operasional & Konsultasi
              </label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="Senin – Sabtu (Sesuai kesepakatan jadwal)"
                className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Service Area */}
            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Wilayah Cakupan Layanan
              </label>
              <input
                type="text"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                placeholder="Bontang, Samarinda, Balikpapan & Kalimantan Timur"
                className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
            </div>

            {/* Workshop Address */}
            <div>
              <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                Lokasi Basis Workshop
              </label>
              <input
                type="text"
                value={workshopAddress}
                onChange={(e) => setWorkshopAddress(e.target.value)}
                placeholder="Kota Bontang, Kalimantan Timur"
                className="w-full px-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D6B46A] text-[#101827] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C5A154] disabled:opacity-50 transition-colors shadow-lg shadow-[#D6B46A]/20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Cloud...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Informasi Kontak</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
