/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BRAND_CONFIG } from './brand';

export type CatalogCategory =
  | 'all'
  | 'gerobak-kopi'
  | 'gerobak-minuman'
  | 'gerobak-makanan'
  | 'roti-bakery'
  | 'booth-street-food'
  | 'booth-minimalis'
  | 'booth-premium'
  | 'custom-concept';

export interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  category: CatalogCategory;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  gallery: string[];
  designTags: string[];
  features: string[];
  conceptType: 'Inspirasi Desain' | 'Konsep Desain';
  aspectRatioHint?: 'landscape' | 'square' | 'portrait';
  featured?: boolean;
}

export const CATALOG_CATEGORIES: { id: CatalogCategory; label: string }[] = [
  { id: 'all', label: 'Semua Desain' },
  { id: 'gerobak-kopi', label: 'Gerobak Kopi' },
  { id: 'gerobak-minuman', label: 'Gerobak Minuman' },
  { id: 'gerobak-makanan', label: 'Gerobak Makanan' },
  { id: 'roti-bakery', label: 'Roti dan Bakery' },
  { id: 'booth-street-food', label: 'Booth Street Food' },
  { id: 'booth-minimalis', label: 'Booth Minimalis' },
  { id: 'booth-premium', label: 'Booth Premium' },
  { id: 'custom-concept', label: 'Custom Concept' },
];

export const CATALOG_DATA: CatalogItem[] = [
  {
    id: 'barista-artisan-cart',
    slug: 'barista-artisan-cart',
    name: 'Sanak Artisan Espresso Cart',
    category: 'gerobak-kopi',
    categoryLabel: 'Gerobak Kopi',
    shortDescription: 'Inspirasi gerobak kopi keliling premium dengan meja kayu jati solid, rangka charcoal, dan rel champagne gold.',
    fullDescription: 'Konsep gerobak kopi mobile yang dirancang untuk kedai kopi modern, pop-up cafe, maupun katering acara. Mengedepankan ruang kerja yang kompak namun efisien untuk mesin espresso komersial 2-group, grinder, knockbox, serta kompartemen penyimpanan galon air bersih dan buang.',
    image: '/src/assets/images/gerobak_coffee_cart_1793275252747.jpg',
    gallery: [
      '/src/assets/images/gerobak_coffee_cart_1793275252747.jpg',
      '/src/assets/images/bontang_local_culinary_1793275672214.jpg',
    ],
    designTags: ['Industrial Charcoal', 'Teak Wood Finish', 'Ergonomic Barista'],
    features: [
      'Struktur dudukan mesin espresso bertulang baja ganda',
      'Area knockbox terintegrasi dan lubang selang kabel tertanam',
      'Rak gantung display cangkir dan toples biji kopi',
      'Laci penyimpanan kasir dengan slot gembok',
      'Pilihan roda kastor ganda dengan pengunci atau roda ban luar',
    ],
    conceptType: 'Inspirasi Desain',
    aspectRatioHint: 'landscape',
    featured: true,
  },
  {
    id: 'minimalist-tea-beverage-cart',
    slug: 'minimalist-tea-beverage-cart',
    name: 'Sanak Bloom & Brew Cart',
    category: 'gerobak-minuman',
    categoryLabel: 'Gerobak Minuman',
    shortDescription: 'Konsep gerobak minuman modern berpalet warm ivory, aksen gold, dan kanopi kain krem yang elegan.',
    fullDescription: 'Inspirasi gerobak minuman dengan visual bersih dan estetik, sangat pas untuk usaha teh artisan, matcha bar, jus segar, atau mocktail kekinian. Dilengkapi papan menu vertikal gantung terintegrasi dan meja saji kayu pinus alami dengan lapisan pelindung tahan air.',
    image: '/src/assets/images/gerobak_minimalist_kiosk_1793275672764.jpg',
    gallery: [
      '/src/assets/images/gerobak_minimalist_kiosk_1793275672764.jpg',
      '/src/assets/images/gerobak_coffee_cart_1793275252747.jpg',
    ],
    designTags: ['Warm Ivory Aesthetic', 'Champagne Gold Trim', 'Minimalist Awning'],
    features: [
      'Papan menu frame aluminium gantung dapat diganti kontennya',
      'Kanopi kain kanvas lipat dengan sudut kemiringan anggun',
      'Kabinet bawah berkapasitas besar dengan pintu geser',
      'Jalur kabel listrik tersembunyi untuk blender atau sealer cup',
      'Roda kastor silent-roll halus untuk lantai indoor maupun teras ruko',
    ],
    conceptType: 'Konsep Desain',
    aspectRatioHint: 'square',
    featured: false,
  },
  {
    id: 'urban-bites-culinary-stall',
    slug: 'urban-bites-culinary-stall',
    name: 'Sanak Urban Street Food Kitchen',
    category: 'gerobak-makanan',
    categoryLabel: 'Gerobak Makanan',
    shortDescription: 'Gerobak kuliner malam hari dengan etalase kaca tempered, lampu filamen gantung, dan meja stainless.',
    fullDescription: 'Rancangan gerobak kuliner modern yang memadukan daya tahan plat midnight navy dengan meja kerja stainless steel higienis. Mengakomodasi kebutuhan kompor gas, panggangan, atau penggorengan dengan kompartemen tabung gas berventilasi aman.',
    image: '/src/assets/images/gerobak_street_food_1793275253637.jpg',
    gallery: [
      '/src/assets/images/gerobak_street_food_1793275253637.jpg',
      '/src/assets/images/bontang_local_culinary_1793275672214.jpg',
    ],
    designTags: ['Midnight Navy', 'Food-Grade Stainless', 'Night Market Lighting'],
    features: [
      'Etalase kaca display tahan panas untuk memajang makanan matang',
      'Lampu bohlam filamen gantung penarik perhatian pelanggan',
      'Kompartemen penyimpanan tabung LPG terpisah bersirkulasi udara',
      'Rak gantung peralatan masak (capitan, spatula, wadah saus)',
      'Meja lipat samping untuk area serah terima pesanan pembeli',
    ],
    conceptType: 'Inspirasi Desain',
    aspectRatioHint: 'landscape',
    featured: true,
  },
  {
    id: 'borneo-street-coffee-stall',
    slug: 'borneo-street-coffee-stall',
    name: 'Sanak Warung Kopi Borneo Stall',
    category: 'booth-street-food',
    categoryLabel: 'Booth Street Food',
    shortDescription: 'Inspirasi warung kopi dan street food bernuansa kayu Kalimantan dengan kanopi seng industrial kokoh.',
    fullDescription: 'Konsep tempat jualan berkarakter lokal yang merangkul kehangatan nongkrong khas Indonesia. Menggunakan kayu palet treatment anti rayap dan rangka besi hollow tebal. Cocok untuk usaha kopi tubruk, angkringan modern, pisang goreng, hingga aneka sarapan pagi.',
    image: '/src/assets/images/bontang_local_culinary_1793275672214.jpg',
    gallery: [
      '/src/assets/images/bontang_local_culinary_1793275672214.jpg',
      '/src/assets/images/gerobak_street_food_1793275253637.jpg',
    ],
    designTags: ['Local Heritage Wood', 'Industrial Canopy', 'Street Commerce'],
    features: [
      'Kanopi seng gelombang penahan panas dan hujan lebat',
      'Meja bar kayu panjang tempat pelanggan bisa duduk dan memesan langsung',
      'Papan nama kayu gantung dengan penerangan lampu filamen Edison',
      'Struktur kokoh tahan goncangan dan awet di udara terbuka',
      'Ruang luas untuk dandang air panas, toples camilan, dan termos es',
    ],
    conceptType: 'Inspirasi Desain',
    aspectRatioHint: 'landscape',
    featured: false,
  },
  {
    id: 'modular-kiosk-container',
    slug: 'modular-kiosk-container',
    name: 'Sanak Modular Kiosk Container',
    category: 'booth-minimalis',
    categoryLabel: 'Booth Minimalis',
    shortDescription: 'Konsep gerai semi-permanen panel kontainer corrugated dengan jendela hidrolik gas-spring.',
    fullDescription: 'Booth usaha mandiri yang siap diletakkan di halaman parkir ruko, pujasera, atau area taman kuliner. Dinding spandek gelombang memberikan perlindungan keamanan maksimal di malam hari karena seluruh jendela dan pintu dapat dikunci rapat.',
    image: '/src/assets/images/gerobak_booth_container_1793275253367.jpg',
    gallery: [
      '/src/assets/images/gerobak_booth_container_1793275253367.jpg',
      '/src/assets/images/hero_gerobak_premium_1793275251800.jpg',
    ],
    designTags: ['Corrugated Container', 'Gas-Spring Window', 'All-Weather Shelter'],
    features: [
      'Jendela hidrolik penopang gas-spring yang enteng dibuka tutup',
      'Meja bar luar kayu solid untuk interaksi dengan pelanggan',
      'Plafon insulasi penahan panas matahari tropis Kalimantan',
      'Instalasi kelistrikan MCB dan stop kontak internal terpasang',
      'Pintu akses belakang dengan kunci ganda pengaman',
    ],
    conceptType: 'Konsep Desain',
    aspectRatioHint: 'square',
    featured: true,
  },
  {
    id: 'avant-garde-geometric-bar',
    slug: 'avant-garde-geometric-bar',
    name: 'Sanak Aeterna Geometric Concept Bar',
    category: 'custom-concept',
    categoryLabel: 'Custom Concept',
    shortDescription: 'Eksplorasi konsep futuristik dengan rangka baja bersudut geometris presisi dan lis champagne gold.',
    fullDescription: 'Sebuah studi desain arsitektural untuk usaha minuman kekinian, mocktail, atau event exhibition khusus yang ingin tampil paling berani. Konstruksi rangka trapesium geometris dengan aksen garis gold memberikan siluet visual yang sangat ikonik dan mudah diingat.',
    image: '/src/assets/images/gerobak_custom_angular_1793275937077.jpg',
    gallery: [
      '/src/assets/images/gerobak_custom_angular_1793275937077.jpg',
      '/src/assets/images/gerobak_minimalist_kiosk_1793275672764.jpg',
    ],
    designTags: ['Geometric Avant-Garde', 'Architectural Steel', 'Exhibition Grade'],
    features: [
      'Rangka baja hollow asimetris dengan sambungan las presisi tinggi',
      'Rak bertingkat ganda di kedua sisi untuk penataan botol sirup atau bahan',
      'Under-counter lighting warm LED menyorot area kerja bartender',
      'Meja solid kayu jati tebal dengan beveling halus',
      'Roda kastor industri heavy-duty disamarkan dalam sudut chassis',
    ],
    conceptType: 'Konsep Desain',
    aspectRatioHint: 'portrait',
    featured: false,
  },
];

import { getCatalogInquiryUrl } from '../utils/whatsapp';

/**
 * Generator Pesan WhatsApp Khusus per Desain Katalog (Prompt B & E)
 * "Halo SANAK GEROBAK, saya tertarik dengan desain [NAMA DESAIN]. Bisa saya konsultasikan detail dan estimasi biayanya?"
 */
export function generateDesignInquiryUrl(designName: string, _categoryLabel?: string): string {
  return getCatalogInquiryUrl(designName);
}
