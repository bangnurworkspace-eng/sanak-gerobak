/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let liveWhatsAppNumber = '';
let liveOfficialTagline = 'Butuh Gerobak Jualan? SANAK GEROBAK Aja!';

/**
 * Syncs WhatsApp configuration directly from Cloud Firestore settings.
 */
export function setLiveWhatsAppConfig(config: {
  whatsappNumber?: string;
  officialTagline?: string;
}): void {
  if (typeof config.whatsappNumber === 'string' && config.whatsappNumber.trim()) {
    liveWhatsAppNumber = config.whatsappNumber.trim();
  }
  if (typeof config.officialTagline === 'string' && config.officialTagline.trim()) {
    liveOfficialTagline = config.officialTagline.trim();
  }
}

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
 * Generates properly URL-encoded WhatsApp click-to-chat links from Firestore settings.
 */
export function createWhatsAppUrl(messageText: string, explicitNumber?: string): string {
  const sanitizedNumber = sanitizeWhatsAppNumber(explicitNumber || liveWhatsAppNumber);

  if (!sanitizedNumber || sanitizedNumber.length < 9) {
    return '#';
  }

  const encodedText = encodeURIComponent(messageText.trim());
  return `https://wa.me/${sanitizedNumber}?text=${encodedText}`;
}

/**
 * Pesan Konsultasi Umum
 */
export function getGeneralInquiryUrl(explicitNumber?: string): string {
  const message = `Halo SANAK GEROBAK, saya ingin konsultasi mengenai pembuatan gerobak jualan.`;
  return createWhatsAppUrl(message, explicitNumber);
}

/**
 * Pesan Katalog Khusus
 */
export function getCatalogInquiryUrl(designName: string, explicitNumber?: string): string {
  const cleanName = designName.trim();
  const message = `Halo SANAK GEROBAK, saya tertarik dengan desain ${cleanName}. Bisa saya konsultasikan detail dan estimasi biayanya?`;
  return createWhatsAppUrl(message, explicitNumber);
}

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
  lines.push(`“${liveOfficialTagline}”`);
  lines.push(`Mohon informasi jadwal dan langkah konsultasinya. Terima kasih!`);

  return lines.join('\n');
}

export function getConsultationFormUrl(data: ConsultationFormData, explicitNumber?: string): string {
  const message = compileConsultationMessage(data);
  return createWhatsAppUrl(message, explicitNumber);
}
