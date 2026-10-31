/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface ProcessStep {
  step: string;
  stageNumber: string;
  title: string;
  description: string;
  note?: string;
}

export interface ShowcaseItem {
  id: string;
  title: string;
  category: 'coffee-cart' | 'minuman' | 'makanan' | 'booth-umkm' | 'booth-minimalis' | 'custom';
  categoryLabel: string;
  image: string;
  description: string;
  aspectClass: string;
  colSpanClass: string;
  highlightTag: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const BRAND_CONFIG = {
  // A. Identitas Utama & Semboyan Resmi
  name: 'SANAK GEROBAK',
  officialTagline: 'Butuh Gerobak Jualan? SANAK GEROBAK Aja!',
  supportingSentence: 'Desain Custom, Usaha Makin Berkelas.',
  logoUrl: '/assets/aistudio/WhatsApp_Image_2026-10-10_at_21.15.53_7e96d713.jpeg',

  /**
   * PANDUAN KONFIGURASI SEBELUM PUBLIKASI (HANDOVER):
   * Ganti nilai di bawah ini dengan kontak operasional resmi SANAK GEROBAK:
   * - whatsappNumber: Format nomor internasional tanpa simbol (+) atau spasi, contoh: "628xxxxxxxxxx"
   * - instagramUrl & instagramHandle: Tautan akun media sosial Instagram resmi
   * - email: Alamat email bisnis resmi untuk korespondensi pelanggan
   * - serviceArea & workshopAddress: Wilayah basis operasional & workshop
   */
  contact: {
    whatsappNumber: '6282344628667', // Nomor WhatsApp resmi SANAK GEROBAK (082344628667)
    whatsappDisplay: '0823-4462-8667', // Teks tampilan di UI
    instagramUrl: 'https://instagram.com/sanakgerobak',
    instagramHandle: '@sanakgerobak',
    email: 'halo@sanakgerobak.com',
    serviceArea: 'Bontang, Kalimantan Timur',
    workshopAddress: 'Kota Bontang, Kalimantan Timur',
    businessHours: 'Senin – Sabtu (Sesuai kesepakatan jadwal konsultasi)',
  },

  // Cakupan Layanan Wilayah
  serviceRegions: [
    { city: 'Kota Bontang', note: 'Area workshop & konsultasi tatap muka' },
    { city: 'Kota Samarinda', note: 'Koordinasi pemesanan & pengiriman' },
    { city: 'Kota Balikpapan', note: 'Koordinasi pemesanan & pengiriman' },
    { city: 'Wilayah Kalimantan Timur Lainnya', note: 'Dikonfirmasi sesuai kesepakatan logistik' },
  ],

  // Tiga Prinsip Brand Statement (Section C)
  principles: [
    {
      number: '01',
      title: 'Dirancang dengan Karakter.',
      desc: 'Setiap lekuk, warna, dan material disesuaikan agar mewakili keunikan identitas usaha Anda. Menjadikan tempat jualan Anda magnet perhatian di tengah keramaian.',
    },
    {
      number: '02',
      title: 'Disesuaikan dengan Kebutuhan.',
      desc: 'Kami memperhatikan alur kerja barista, penempatan kompor koki, ruang penyimpanan bahan baku, hingga ventilasi sirkulasi udara yang nyaman dan ergonomis.',
    },
    {
      number: '03',
      title: 'Mendukung Perjalanan Usaha.',
      desc: 'Konstruksi tangguh berbahan baja galvanis dan finishing tahan cuaca untuk mendampingi langkah pengusaha dari lapak pertama hingga berkembang menjadi brand besar.',
    },
  ],

  // Inspirasi Desain Showcase
  showcase: [
    {
      id: 'showcase-coffee-artisan',
      title: 'Mobile Espresso Barista Cart',
      category: 'coffee-cart',
      categoryLabel: 'Coffee Cart',
      image: '/src/assets/images/gerobak_coffee_cart_1793275252747.jpg',
      description: 'Konsep gerobak kopi keliling premium dengan rangka charcoal matte, meja kayu jati tebal, dan rel champagne gold.',
      aspectClass: 'aspect-[4/3] lg:aspect-[16/11]',
      colSpanClass: 'lg:col-span-7',
      highlightTag: 'Inspirasi Coffee Shop',
    },
    {
      id: 'showcase-street-culinary',
      title: 'Urban Street Food Kitchen Stall',
      category: 'makanan',
      categoryLabel: 'Gerobak Makanan',
      image: '/src/assets/images/gerobak_street_food_1793275253637.jpg',
      description: 'Inspirasi gerobak makanan street food dengan etalase kaca tempered dan pencahayaan bohlam filamen hangat.',
      aspectClass: 'aspect-[4/3] lg:aspect-[16/11]',
      colSpanClass: 'lg:col-span-5',
      highlightTag: 'Konsep Street Food',
    },
    {
      id: 'showcase-minimalist-ivory',
      title: 'Minimalist Ivory & Gold Beverage Cart',
      category: 'booth-minimalis',
      categoryLabel: 'Booth Minimalis',
      image: '/src/assets/images/gerobak_minimalist_kiosk_1793275672764.jpg',
      description: 'Desain bersih bernuansa warm ivory dan aksen gold, sangat cocok untuk brand teh artisan, matcha bar, atau cafe estetik.',
      aspectClass: 'aspect-[4/3] lg:aspect-[1/1]',
      colSpanClass: 'lg:col-span-5',
      highlightTag: 'Inspirasi Minimalis',
    },
    {
      id: 'showcase-container-modular',
      title: 'Modular Corrugated Container Kiosk',
      category: 'booth-umkm',
      categoryLabel: 'Booth UMKM',
      image: '/src/assets/images/gerobak_booth_container_1793275253367.jpg',
      description: 'Konsep booth kontainer semi-permanen yang kokoh dengan bukaan hidrolik dan meja bar melingkar untuk outdoor.',
      aspectClass: 'aspect-[4/3] lg:aspect-[16/11]',
      colSpanClass: 'lg:col-span-7',
      highlightTag: 'Konsep Container',
    },
  ] as ShowcaseItem[],

  // D. Alur Proses Pemesanan (Persis 4 Tahap Sesuai Prompt D)
  processSteps: [
    {
      stageNumber: '01',
      step: 'Tahap 01',
      title: 'Konsultasi',
      description: 'Pelanggan menyampaikan ide, jenis usaha, dan kebutuhan gerobak atau booth yang diinginkan.',
      note: 'Dapat dimulai melalui WhatsApp atau pertemuan langsung.',
    },
    {
      stageNumber: '02',
      step: 'Tahap 02',
      title: 'Pembahasan Konsep',
      description: 'Diskusikan desain, ukuran lapak, kebutuhan operasional peralatan, serta penyesuaian anggaran.',
      note: 'Penyusunan visualisasi dan sketsa tata letak.',
    },
    {
      stageNumber: '03',
      step: 'Tahap 03',
      title: 'Konfirmasi Penawaran',
      description: 'Spesifikasi, harga, material, biaya, dan ketentuan pengerjaan dikonfirmasi sebelum persetujuan bersama.',
      note: 'Transparan tanpa biaya tersembunyi.',
    },
    {
      stageNumber: '04',
      step: 'Tahap 04',
      title: 'Pengerjaan',
      description: 'Produksi dan serah terima mengikuti kesepakatan yang telah dikonfirmasi.',
      note: 'Detail pengerjaan bergantung pada kebutuhan proyek.',
    },
  ] as ProcessStep[],

  // E. FAQ Accordion (Persis 7 Pertanyaan Sesuai Prompt E)
  faqs: [
    {
      question: 'Apakah bisa memesan gerobak dengan desain sendiri?',
      answer: 'Bisa. Kami menerima konsep khusus, sketsa ide, maupun gambar referensi yang Anda miliki. Penyesuaian bentuk, dimensi, dan warna akan dibahas saat sesi konsultasi agar sesuai dengan kebutuhan operasional usaha Anda.',
    },
    {
      question: 'Bagaimana cara memulai konsultasi?',
      answer: 'Anda dapat memulai dengan menekan tombol konsultasi WhatsApp di website ini atau mengisi formulir konsultasi singkat. Sampaikan jenis produk jualan Anda, ukuran lapak, dan ide awal yang Anda rencanakan.',
    },
    {
      question: 'Bagaimana cara mengetahui estimasi harga?',
      answer: 'Estimasi biaya dihitung berdasarkan dimensi gerobak, kompleksitas bentuk, material rangka dan meja, serta fitur tambahan yang dipilih. Rincian penawaran biaya akan kami sampaikan setelah konsep awal didiskusikan bersama.',
    },
    {
      question: 'Apakah ukuran dan tampilan bisa disesuaikan?',
      answer: 'Ya, seluruh gerobak dan booth yang kami buat bersifat custom. Ukuran dapat disesuaikan dengan luas lahan sewa tempat jualan Anda, serta tampilan warna diselaraskan dengan identitas brand usaha Anda.',
    },
    {
      question: 'Bagaimana proses pemesanan gerobak?',
      answer: 'Proses pemesanan terbagi dalam empat tahap: (1) Konsultasi kebutuhan awal, (2) Pembahasan konsep dan ukuran, (3) Konfirmasi spesifikasi, material, dan rincian penawaran, serta (4) Pengerjaan dan serah terima unit sesuai kesepakatan.',
    },
    {
      question: 'Apakah melayani wilayah di luar Bontang?',
      answer: 'Workshop kami berbasis di Kota Bontang, namun kami juga terbuka melayani pemesanan untuk wilayah Kalimantan Timur lainnya seperti Samarinda, Balikpapan, dan sekitarnya. Pengiriman dan teknis perakitan akan dikoordinasikan sesuai kesepakatan.',
    },
    {
      question: 'Berapa lama pengerjaan gerobak?',
      answer: 'Durasi pengerjaan bergantung pada dimensi, ketersediaan material khusus, tingkat kerumitan desain, dan antrean produksi. Jadwal serta target penyelesaian akan disepakati bersama sebelum tahap pengerjaan dimulai.',
    },
  ] as FAQItem[],
};
