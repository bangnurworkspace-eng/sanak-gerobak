/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BRAND_CONFIG } from '../config/brand';

/**
 * Validates and sanitizes international phone number format.
 * Returns only digits, removing spaces, plus sign, and hyphens,
 * and normalizes leading '0' (e.g. 082344628667) to '62' (6282344628667).
 */
export function sanitizeWhatsAppNumber(rawNumber: string): string {
  const digits = rawNumber.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  return digits;
}

/**
 * Central WhatsApp URL Generator
 * Generates properly URL-encoded WhatsApp click-to-chat links.
 */
export function createWhatsAppUrl(messageText: string): string {
  const sanitizedNumber = sanitizeWhatsAppNumber(BRAND_CONFIG.contact.whatsappNumber);
  
  if (!sanitizedNumber || sanitizedNumber.length < 9) {
    console.warn('[SANAK GEROBAK] Nomor WhatsApp belum dikonfigurasi dengan benar.');
    return '#';
  }

  const encodedText = encodeURIComponent(messageText.trim());
  return `https://wa.me/${sanitizedNumber}?text=${encodedText}`;
}

/**
 * Pesan Konsultasi Umum (Prompt B)
 * "Halo SANAK GEROBAK, saya ingin konsultasi mengenai pembuatan gerobak jualan."
 */
export function getGeneralInquiryUrl(): string {
  const message = `Halo SANAK GEROBAK, saya ingin konsultasi mengenai pembuatan gerobak jualan.`;
  return createWhatsAppUrl(message);
}

/**
 * Pesan Katalog Khusus (Prompt B)
 * "Halo SANAK GEROBAK, saya tertarik dengan desain [NAMA DESAIN]. Bisa saya konsultasikan detail dan estimasi biayanya?"
 */
export function getCatalogInquiryUrl(designName: string): string {
  const cleanName = designName.trim();
  const message = `Halo SANAK GEROBAK, saya tertarik dengan desain ${cleanName}. Bisa saya konsultasikan detail dan estimasi biayanya?`;
  return createWhatsAppUrl(message);
}

/**
 * Pesan Formulir Konsultasi Terstruktur (Prompt C)
 */
export interface ConsultationFormData {
  fullName: string;
  customerPhone?: string;
  businessType: string;
  cartType: string;
  designConcept?: string;
  estimatedBudget?: string;
  additionalNotes?: string;
}

export function compileConsultationMessage(data: ConsultationFormData): string {
  const lines: string[] = [
    `Halo SANAK GEROBAK, saya ingin berkonsultasi mengenai rencana pembuatan gerobak/booth usaha:`,
    ``,
    `👤 Nama: ${data.fullName.trim()}`,
  ];

  if (data.customerPhone?.trim()) {
    lines.push(`📱 Nomor Kontak: ${data.customerPhone.trim()}`);
  }

  lines.push(`🏷️ Jenis Usaha: ${data.businessType.trim()}`);
  lines.push(`🛒 Jenis Gerobak / Booth: ${data.cartType.trim()}`);

  if (data.designConcept?.trim()) {
    lines.push(`💡 Konsep yang Diinginkan: ${data.designConcept.trim()}`);
  }

  if (data.estimatedBudget?.trim()) {
    lines.push(`💰 Perkiraan Anggaran: ${data.estimatedBudget.trim()}`);
  }

  if (data.additionalNotes?.trim()) {
    lines.push(`📝 Catatan Tambahan: ${data.additionalNotes.trim()}`);
  }

  lines.push(``);
  lines.push(`“${BRAND_CONFIG.officialTagline}”`);
  lines.push(`Mohon informasi jadwal dan langkah konsultasinya. Terima kasih!`);

  return lines.join('\n');
}

export function getConsultationFormUrl(data: ConsultationFormData): string {
  const message = compileConsultationMessage(data);
  return createWhatsAppUrl(message);
}
