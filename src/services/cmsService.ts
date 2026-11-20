/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { BRAND_CONFIG } from '../config/brand';
import { CATALOG_DATA, CatalogItem } from '../config/catalogData';
import { STUDIO_IMAGE_ASSETS, resolveImageUrl } from '../utils/assets';

export interface CMSProduct extends CatalogItem {
  status: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
  sortOrder?: number;
}

export interface CMSCategory {
  id: string;
  slug: string;
  label: string;
  description?: string;
  sortOrder: number;
}

export interface CMSPortfolioItem {
  id: string;
  title: string;
  clientName?: string;
  location?: string;
  category: string;
  image: string;
  gallery: string[];
  year: string;
  description: string;
  isRealProject: boolean;
  status: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

export interface CMSMediaItem {
  id: string;
  url: string;
  storagePath?: string;
  filename: string;
  altText: string;
  uploadedAt: string;
  sizeBytes?: number;
}

export interface CMSHeroSection {
  title: string;
  tagline: string;
  supportingText: string;
  heroImage: string;
  badgeText: string;
  status: 'draft' | 'published';
  updatedAt?: string;
}

export interface CMSAboutSection {
  principles: { number: string; title: string; desc: string }[];
  localTitle: string;
  localDesc: string;
  updatedAt?: string;
}

export interface CMSSettings {
  siteTitle: string;
  metaDescription: string;
  tagline: string;
  supportingSentence: string;
  announcement?: string;
  announcementEnabled?: boolean;
  contact: typeof BRAND_CONFIG.contact;
  updatedAt?: string;
}

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const PORTFOLIO_COLLECTION = 'portfolio';
const SITE_SECTIONS_COLLECTION = 'site_sections';
const MEDIA_COLLECTION = 'media';

const REMOVED_PRODUCT_IDS = new Set([
  'daily-crumb-bakery-cart',
  'flagship-commercial-pavilion',
]);

function stripUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => stripUndefined(item)) as unknown as T;
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj as Record<string, any>)) {
    if (value !== undefined) {
      cleaned[key] = stripUndefined(value);
    }
  }
  return cleaned as T;
}

async function compressImageToDataUrl(file: File, maxDimension = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak valid.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// --- INITIAL CLOUD SEEDING (ONE-TIME WHEN EMPTY IN FIRESTORE) ---

const INITIAL_CATEGORIES_SEED: CMSCategory[] = [
  {
    id: 'gerobak-kopi',
    slug: 'gerobak-kopi',
    label: 'Gerobak Kopi',
    description: 'Konsep coffee cart untuk specialty coffee, es kopi susu, dan slow bar.',
    sortOrder: 1,
  },
  {
    id: 'gerobak-minuman',
    slug: 'gerobak-minuman',
    label: 'Gerobak Minuman',
    description: 'Booth minuman kekinian, teh, boba, dan jus buah segar.',
    sortOrder: 2,
  },
  {
    id: 'gerobak-makanan',
    slug: 'gerobak-makanan',
    label: 'Gerobak Makanan',
    description: 'Gerobak kuliner hangat, mie, bakso, gorengan, dan hidangan utama.',
    sortOrder: 3,
  },
  {
    id: 'roti-bakery',
    slug: 'roti-bakery',
    label: 'Roti dan Bakery',
    description: 'Gerobak etalase roti bakar, pastry, donat, dan kue manis.',
    sortOrder: 4,
  },
  {
    id: 'booth-street-food',
    slug: 'booth-street-food',
    label: 'Booth Street Food',
    description: 'Booth jajanan jalanan malam dan festival kuliner.',
    sortOrder: 5,
  },
  {
    id: 'booth-minimalis',
    slug: 'booth-minimalis',
    label: 'Booth Minimalis',
    description: 'Booth ukuran ringkas dengan estetika bersih untuk ruang terbatas.',
    sortOrder: 6,
  },
  {
    id: 'booth-premium',
    slug: 'booth-premium',
    label: 'Booth Premium',
    description: 'Unit semi-kontainer dan pulau pameran flagship untuk mall atau outdoor.',
    sortOrder: 7,
  },
  {
    id: 'custom-concept',
    slug: 'custom-concept',
    label: 'Custom Concept',
    description: 'Rancangan khusus sesuai karakter dan alur kerja unik brand Anda.',
    sortOrder: 8,
  },
];

const INITIAL_STUDIO_MEDIA_SEED: Omit<CMSMediaItem, 'uploadedAt'>[] = [
  {
    id: 'studio-hero-premium',
    url: STUDIO_IMAGE_ASSETS.heroPremium,
    filename: 'Hero Gerobak Premium',
    altText: 'Gerobak dan Booth Komersial Premium SANAK GEROBAK Bontang',
  },
  {
    id: 'studio-coffee-cart',
    url: STUDIO_IMAGE_ASSETS.coffeeCart,
    filename: 'Sanak Artisan Coffee Cart',
    altText: 'Gerobak kopi keliling modern dengan meja kayu jati',
  },
  {
    id: 'studio-street-food',
    url: STUDIO_IMAGE_ASSETS.streetFood,
    filename: 'Urban Street Food Cart',
    altText: 'Gerobak kuliner dan street food rangka baja',
  },
  {
    id: 'studio-minimalist-kiosk',
    url: STUDIO_IMAGE_ASSETS.minimalistKiosk,
    filename: 'Minimalist Ivory Kiosk',
    altText: 'Booth minuman minimalis dengan panel warna ivory',
  },
  {
    id: 'studio-container-booth',
    url: STUDIO_IMAGE_ASSETS.containerBooth,
    filename: 'Modular Container Kiosk',
    altText: 'Kios kontainer modular untuk usaha outdoor dan komersial',
  },
  {
    id: 'studio-bakery-pastry',
    url: STUDIO_IMAGE_ASSETS.bakeryPastry,
    filename: 'Golden Crust Bakery Cart',
    altText: 'Gerobak etalase kaca untuk roti dan pastry',
  },
  {
    id: 'studio-custom-angular',
    url: STUDIO_IMAGE_ASSETS.customAngular,
    filename: 'Custom Angular Geometric Bar',
    altText: 'Konsep gerobak custom rangka baja geometris',
  },
  {
    id: 'studio-local-culinary',
    url: STUDIO_IMAGE_ASSETS.localCulinary,
    filename: 'Kuliner Lokal Bontang',
    altText: 'Usaha kuliner dan kopi lokal di Kalimantan Timur',
  },
];

let productsInitPromise: Promise<void> | null = null;
let categoriesInitPromise: Promise<void> | null = null;
let portfolioInitPromise: Promise<void> | null = null;
let mediaInitPromise: Promise<void> | null = null;
let sectionsSeedPromise: Promise<void> | null = null;

async function ensureProductsInitialized(): Promise<void> {
  if (productsInitPromise) return productsInitPromise;
  productsInitPromise = (async () => {
    const metaRef = doc(db, SITE_SECTIONS_COLLECTION, 'products_meta');
    const metaSnap = await getDoc(metaRef);
    if (metaSnap.exists() && metaSnap.data()?.initialized === true) {
      return;
    }

    const prodRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(prodRef);
    const existingIds = new Set<string>();
    snapshot.forEach((snap) => existingIds.add(snap.id));

    const now = new Date().toISOString();
    const writes: Promise<void>[] = [];
    for (let i = 0; i < CATALOG_DATA.length; i++) {
      const defProd = CATALOG_DATA[i];
      if (!existingIds.has(defProd.id) && !REMOVED_PRODUCT_IDS.has(defProd.id)) {
        writes.push(
          setDoc(
            doc(db, PRODUCTS_COLLECTION, defProd.id),
            stripUndefined({
              ...defProd,
              image: resolveImageUrl(defProd.image, STUDIO_IMAGE_ASSETS.coffeeCart),
              gallery: defProd.gallery.map((g) => resolveImageUrl(g, STUDIO_IMAGE_ASSETS.coffeeCart)),
              status: 'published',
              sortOrder: i + 1,
              createdAt: now,
              updatedAt: now,
            })
          )
        );
      }
    }
    if (writes.length > 0) {
      await Promise.all(writes);
    }

    await setDoc(
      metaRef,
      { initialized: true, updatedAt: now },
      { merge: true }
    );
  })().finally(() => {
    productsInitPromise = null;
  });
  return productsInitPromise;
}

async function ensureCategoriesInitialized(): Promise<void> {
  if (categoriesInitPromise) return categoriesInitPromise;
  categoriesInitPromise = (async () => {
    const metaRef = doc(db, SITE_SECTIONS_COLLECTION, 'categories_meta');
    const metaSnap = await getDoc(metaRef);
    if (metaSnap.exists() && metaSnap.data()?.initialized === true) {
      return;
    }

    const catRef = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(catRef);
    const existingIds = new Set<string>();
    snapshot.forEach((snap) => existingIds.add(snap.id));

    const writes: Promise<void>[] = [];
    for (const defCat of INITIAL_CATEGORIES_SEED) {
      if (!existingIds.has(defCat.id)) {
        writes.push(setDoc(doc(db, CATEGORIES_COLLECTION, defCat.id), stripUndefined(defCat)));
      }
    }
    if (writes.length > 0) {
      await Promise.all(writes);
    }

    await setDoc(
      metaRef,
      { initialized: true, updatedAt: new Date().toISOString() },
      { merge: true }
    );
  })().finally(() => {
    categoriesInitPromise = null;
  });
  return categoriesInitPromise;
}

async function ensurePortfolioInitialized(): Promise<void> {
  if (portfolioInitPromise) return portfolioInitPromise;
  portfolioInitPromise = (async () => {
    const metaRef = doc(db, SITE_SECTIONS_COLLECTION, 'portfolio_meta');
    const metaSnap = await getDoc(metaRef);
    if (metaSnap.exists() && metaSnap.data()?.initialized === true) {
      return;
    }

    const portRef = collection(db, PORTFOLIO_COLLECTION);
    const snapshot = await getDocs(portRef);
    const existingIds = new Set<string>();
    snapshot.forEach((snap) => existingIds.add(snap.id));

    const now = new Date().toISOString();
    const writes: Promise<void>[] = [];
    for (const item of BRAND_CONFIG.showcase) {
      if (!existingIds.has(item.id)) {
        const imgUrl = resolveImageUrl(item.image, STUDIO_IMAGE_ASSETS.coffeeCart);
        writes.push(
          setDoc(
            doc(db, PORTFOLIO_COLLECTION, item.id),
            stripUndefined({
              id: item.id,
              title: item.title,
              clientName: 'Klien Bontang / Kaltim',
              location: 'Bontang, Kalimantan Timur',
              category: item.categoryLabel,
              image: imgUrl,
              gallery: [imgUrl],
              year: '2024',
              description: item.description,
              isRealProject: false,
              status: 'published',
              createdAt: now,
              updatedAt: now,
            })
          )
        );
      }
    }
    if (writes.length > 0) {
      await Promise.all(writes);
    }

    await setDoc(
      metaRef,
      { initialized: true, updatedAt: now },
      { merge: true }
    );
  })().finally(() => {
    portfolioInitPromise = null;
  });
  return portfolioInitPromise;
}

async function ensureMediaInitialized(): Promise<void> {
  if (mediaInitPromise) return mediaInitPromise;
  mediaInitPromise = (async () => {
    const metaRef = doc(db, SITE_SECTIONS_COLLECTION, 'media_meta');
    const metaSnap = await getDoc(metaRef);
    if (metaSnap.exists() && metaSnap.data()?.initialized === true) {
      return;
    }

    const mediaRef = collection(db, MEDIA_COLLECTION);
    const snapshot = await getDocs(mediaRef);
    const existingIds = new Set<string>();
    snapshot.forEach((snap) => existingIds.add(snap.id));

    const now = new Date().toISOString();
    const writes: Promise<void>[] = [];
    for (const asset of INITIAL_STUDIO_MEDIA_SEED) {
      if (!existingIds.has(asset.id)) {
        writes.push(
          setDoc(
            doc(db, MEDIA_COLLECTION, asset.id),
            stripUndefined({
              ...asset,
              uploadedAt: now,
            })
          )
        );
      }
    }
    if (writes.length > 0) {
      await Promise.all(writes);
    }

    await setDoc(
      metaRef,
      { initialized: true, updatedAt: now },
      { merge: true }
    );
  })().finally(() => {
    mediaInitPromise = null;
  });
  return mediaInitPromise;
}

async function ensureSiteSectionsSeeded(): Promise<void> {
  if (sectionsSeedPromise) return sectionsSeedPromise;
  sectionsSeedPromise = (async () => {
    const [heroSnap, aboutSnap, settingsSnap, servicesSnap, faqsSnap] = await Promise.all([
      getDoc(doc(db, SITE_SECTIONS_COLLECTION, 'hero')),
      getDoc(doc(db, SITE_SECTIONS_COLLECTION, 'about')),
      getDoc(doc(db, SITE_SECTIONS_COLLECTION, 'settings')),
      getDoc(doc(db, SITE_SECTIONS_COLLECTION, 'services')),
      getDoc(doc(db, SITE_SECTIONS_COLLECTION, 'faqs')),
    ]);

    const writes: Promise<void>[] = [];

    if (!heroSnap.exists()) {
      writes.push(
        saveSiteSection('hero', {
          title: 'Solusi Gerobak & Booth Usaha Berkelas.',
          tagline: BRAND_CONFIG.officialTagline,
          supportingText:
            'Kami merancang dan memproduksi gerobak jualan serta booth usaha modern dengan material kokoh, tata ruang fungsional, dan estetika yang memikat pelanggan.',
          heroImage: STUDIO_IMAGE_ASSETS.heroPremium,
          badgeText: 'Spesialis Gerobak & Booth Custom Bontang',
          status: 'published',
        })
      );
    }

    if (!aboutSnap.exists()) {
      writes.push(
        saveSiteSection('about', {
          principles: BRAND_CONFIG.principles,
          localTitle: 'Dari Bontang, untuk Semangat Usaha Kalimantan Timur.',
          localDesc:
            'Kami memahami iklim, karakter pasar, dan tantangan yang dihadapi teman-teman pengusaha di Kalimantan Timur. Mulai dari kebutuhan bahan yang tahan terhadap kelembapan dan panas matahari, hingga pengaturan mobilitas gerobak di berbagai titik lokasi jualan.',
        })
      );
    }

    if (!settingsSnap.exists()) {
      writes.push(
        saveSiteSection('settings', {
          siteTitle: 'SANAK GEROBAK | Desain & Pembuatan Gerobak Usaha Custom Bontang',
          metaDescription:
            'Spesialis desain dan pembuatan gerobak jualan, booth UMKM, coffee cart, dan kuliner modern di Bontang dan Kalimantan Timur.',
          tagline: BRAND_CONFIG.officialTagline,
          supportingSentence: BRAND_CONFIG.supportingSentence,
          contact: BRAND_CONFIG.contact,
        })
      );
    }

    if (!servicesSnap.exists()) {
      writes.push(
        saveSiteSection('services', {
          title: 'Dari Ide Menjadi Identitas Usaha.',
          subtitle:
            'Layanan terintegrasi mulai dari perancangan konsep visual hingga unit gerobak siap pakai untuk menyambut pelanggan pertama Anda.',
          items: [
            {
              id: 'custom-cart',
              number: '01',
              title: 'Pembuatan Gerobak Custom',
              description:
                'Pembuatan gerobak jualan outdoor & indoor dengan spesifikasi material tahan karat, kelistrikan terintegrasi, dan kompartemen ergonomis.',
              deliverables: [
                'Rangka baja & plat galvanis tahan karat',
                'Meja kerja food-grade stainless / solid wood',
                'Instalasi lampu LED & saklar terpadu',
              ],
            },
            {
              id: 'booth-kiosk',
              number: '02',
              title: 'Booth & Kios UMKM Modular',
              description:
                'Pembangunan booth semi-permanen dan kios kontainer berdimensi fleksibel untuk mall, food court, maupun lahan sewa outdoor.',
              deliverables: [
                'Sistem buka-tutup hidrolik / kanopi lipat',
                'Struktur modular mudah dipindahkan',
                'Pilihan finishing powder coating anti-cuaca',
              ],
            },
            {
              id: 'branding-signage',
              number: '03',
              title: 'Visual Branding & Signage',
              description:
                'Penyelarasan palet warna brand, neon flex sign, sticker vinyl laminasi doff/glossy, dan papan nama usaha yang mencolok.',
              deliverables: [
                'Desain logo & penempatan identitas visual',
                'Neon flex / neon box akrilik hemat daya',
                'Sticker decal tahan sinar UV & hujan',
              ],
            },
          ],
        })
      );
    }

    if (!faqsSnap.exists()) {
      writes.push(
        saveSiteSection('faqs', {
          title: 'Pertanyaan yang Sering Diajukan',
          subtitle:
            'Informasi seputar konsultasi, spesifikasi, dan proses pemesanan gerobak di SANAK GEROBAK.',
          items: BRAND_CONFIG.faqs,
        })
      );
    }

    if (writes.length > 0) {
      await Promise.all(writes);
    }
  })().finally(() => {
    sectionsSeedPromise = null;
  });
  return sectionsSeedPromise;
}

// --- PRODUCTS (STRICTLY FROM CLOUD FIRESTORE) ---

export async function getProducts(includeDrafts = false): Promise<CMSProduct[]> {
  try {
    await ensureProductsInitialized();

    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = includeDrafts
      ? query(productsRef)
      : query(productsRef, where('status', '==', 'published'));

    const snapshot = await getDocs(q);
    const items: CMSProduct[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as any;
      if (
        !REMOVED_PRODUCT_IDS.has(docSnap.id) &&
        data.name !== 'Sanak Artisan Bakery & Pastry Cart' &&
        data.name !== 'Sanak Commercial Pavilion Flagship'
      ) {
        const resolvedImg = resolveImageUrl(data.image, STUDIO_IMAGE_ASSETS.coffeeCart);
        items.push({
          id: docSnap.id,
          slug: data.slug || docSnap.id,
          name: data.name || 'Desain Gerobak',
          category: data.category || 'gerobak-kopi',
          categoryLabel: data.categoryLabel || 'Gerobak Kopi',
          shortDescription: data.shortDescription || '',
          fullDescription: data.fullDescription || '',
          image: resolvedImg,
          gallery:
            Array.isArray(data.gallery) && data.gallery.length > 0
              ? data.gallery.map((g: string) => resolveImageUrl(g, resolvedImg))
              : [resolvedImg],
          designTags: Array.isArray(data.designTags) ? data.designTags : [],
          features: Array.isArray(data.features) ? data.features : [],
          conceptType: data.conceptType || 'Inspirasi Desain',
          status: data.status || 'published',
          sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 1,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      }
    });

    return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
  }
}

export async function getProductById(id: string): Promise<CMSProduct | null> {
  try {
    await ensureProductsInitialized();
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data() as any;
    const resolvedImage = resolveImageUrl(data.image, STUDIO_IMAGE_ASSETS.coffeeCart);
    return {
      id: docSnap.id,
      ...data,
      image: resolvedImage,
      gallery:
        Array.isArray(data.gallery) && data.gallery.length > 0
          ? data.gallery.map((g: string) => resolveImageUrl(g, resolvedImage))
          : [resolvedImage],
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function saveProduct(product: CMSProduct): Promise<void> {
  const id = (product.id || `cart-${Date.now()}`).trim();
  try {
    await ensureProductsInitialized();
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const now = new Date().toISOString();
    const resolvedImg = resolveImageUrl(product.image, STUDIO_IMAGE_ASSETS.coffeeCart);

    const dataToSave = stripUndefined({
      ...product,
      id,
      slug: (product.slug || id).trim(),
      name: (product.name || 'Desain Gerobak').trim(),
      category: product.category || 'gerobak-kopi',
      categoryLabel: product.categoryLabel || 'Gerobak Kopi',
      shortDescription: product.shortDescription || '',
      fullDescription: product.fullDescription || '',
      image: resolvedImg,
      gallery:
        Array.isArray(product.gallery) && product.gallery.length > 0
          ? product.gallery.map((g) => resolveImageUrl(g, resolvedImg))
          : [resolvedImg],
      designTags: Array.isArray(product.designTags) ? product.designTags : [],
      features: Array.isArray(product.features) ? product.features : [],
      conceptType: product.conceptType || 'Inspirasi Desain',
      status: product.status || 'published',
      sortOrder: Number(product.sortOrder) || 1,
      updatedAt: now,
      createdAt: product.createdAt || now,
    });

    await setDoc(docRef, dataToSave, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await ensureProductsInitialized();
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function duplicateProduct(id: string): Promise<CMSProduct> {
  const source = await getProductById(id);
  if (!source) throw new Error('Produk sumber tidak ditemukan di Firestore');

  const newId = `cart-${Date.now()}`;
  const now = new Date().toISOString();
  const duplicated: CMSProduct = {
    ...source,
    id: newId,
    slug: `${source.slug}-salinan-${Math.floor(Math.random() * 1000)}`,
    name: `${source.name} (Salinan)`,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };

  await saveProduct(duplicated);
  return duplicated;
}

// --- CATEGORIES (STRICTLY FROM CLOUD FIRESTORE) ---

export async function getCategories(): Promise<CMSCategory[]> {
  try {
    await ensureCategoriesInitialized();
    const catRef = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(catRef);
    const items: CMSCategory[] = [];

    snapshot.forEach((snap) => {
      const data = snap.data() as any;
      items.push({
        id: snap.id,
        slug: data.slug || snap.id,
        label: data.label || snap.id,
        description: data.description || '',
        sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 1,
      });
    });

    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, CATEGORIES_COLLECTION);
  }
}

export async function saveCategory(
  category: CMSCategory,
  previousId?: string,
  previousSlug?: string
): Promise<void> {
  const targetId = (category.id || category.slug).trim();
  try {
    await ensureCategoriesInitialized();

    if (previousId && previousId !== targetId) {
      await deleteDoc(doc(db, CATEGORIES_COLLECTION, previousId));
    }

    const docRef = doc(db, CATEGORIES_COLLECTION, targetId);
    await setDoc(
      docRef,
      stripUndefined({
        ...category,
        id: targetId,
        slug: category.slug.trim(),
        label: category.label.trim(),
        description: (category.description || '').trim(),
        sortOrder: Number(category.sortOrder) || 1,
      }),
      { merge: true }
    );

    // Sync products referencing this category
    try {
      await ensureProductsInitialized();
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const prodSnap = await getDocs(productsRef);
      const oldSlugToMatch = previousSlug || category.slug;
      const updatePromises: Promise<void>[] = [];

      prodSnap.forEach((pDoc) => {
        const pData = pDoc.data();
        if (pData.category === oldSlugToMatch || pData.category === previousId) {
          updatePromises.push(
            setDoc(
              doc(db, PRODUCTS_COLLECTION, pDoc.id),
              {
                category: category.slug.trim(),
                categoryLabel: category.label.trim(),
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            )
          );
        }
      });

      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }
    } catch (syncErr) {
      console.warn('[CMS] Optional product category label sync warning:', syncErr);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${CATEGORIES_COLLECTION}/${targetId}`);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await ensureCategoriesInitialized();
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CATEGORIES_COLLECTION}/${id}`);
  }
}

export async function restoreDefaultCategories(): Promise<void> {
  try {
    for (const defCat of INITIAL_CATEGORIES_SEED) {
      await setDoc(doc(db, CATEGORIES_COLLECTION, defCat.id), stripUndefined(defCat), { merge: true });
    }
    await setDoc(
      doc(db, SITE_SECTIONS_COLLECTION, 'categories_meta'),
      { initialized: true, updatedAt: new Date().toISOString() },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${CATEGORIES_COLLECTION}/restore_defaults`);
  }
}

// --- PORTFOLIO (STRICTLY FROM CLOUD FIRESTORE) ---

export async function getPortfolio(includeDrafts = false): Promise<CMSPortfolioItem[]> {
  try {
    await ensurePortfolioInitialized();
    const portRef = collection(db, PORTFOLIO_COLLECTION);
    const q = includeDrafts
      ? query(portRef)
      : query(portRef, where('status', '==', 'published'));

    const snapshot = await getDocs(q);
    const items: CMSPortfolioItem[] = [];

    snapshot.forEach((snap) => {
      const data = snap.data() as any;
      const resolvedImg = resolveImageUrl(data.image, STUDIO_IMAGE_ASSETS.coffeeCart);
      items.push({
        id: snap.id,
        title: data.title || 'Proyek Gerobak',
        clientName: data.clientName || '',
        location: data.location || 'Bontang, Kalimantan Timur',
        category: data.category || 'Coffee Cart',
        image: resolvedImg,
        gallery:
          Array.isArray(data.gallery) && data.gallery.length > 0
            ? data.gallery.map((g: string) => resolveImageUrl(g, resolvedImg))
            : [resolvedImg],
        year: data.year || '2024',
        description: data.description || '',
        isRealProject: Boolean(data.isRealProject),
        status: data.status || 'published',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });

    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PORTFOLIO_COLLECTION);
  }
}

export async function savePortfolioItem(item: CMSPortfolioItem): Promise<void> {
  const id = (item.id || `portfolio-${Date.now()}`).trim();
  try {
    await ensurePortfolioInitialized();
    const docRef = doc(db, PORTFOLIO_COLLECTION, id);
    const now = new Date().toISOString();
    const resolvedImg = resolveImageUrl(item.image, STUDIO_IMAGE_ASSETS.coffeeCart);
    await setDoc(
      docRef,
      stripUndefined({
        ...item,
        id,
        title: (item.title || 'Proyek Gerobak').trim(),
        clientName: item.clientName || '',
        location: item.location || 'Bontang, Kalimantan Timur',
        category: item.category || 'Coffee Cart',
        image: resolvedImg,
        gallery:
          Array.isArray(item.gallery) && item.gallery.length > 0
            ? item.gallery.map((g) => resolveImageUrl(g, resolvedImg))
            : [resolvedImg],
        year: item.year || '2024',
        description: item.description || '',
        isRealProject: Boolean(item.isRealProject),
        status: item.status || 'published',
        updatedAt: now,
        createdAt: item.createdAt || now,
      }),
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PORTFOLIO_COLLECTION}/${id}`);
  }
}

export async function deletePortfolioItem(id: string): Promise<void> {
  try {
    await ensurePortfolioInitialized();
    const docRef = doc(db, PORTFOLIO_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PORTFOLIO_COLLECTION}/${id}`);
  }
}

// --- SITE SECTIONS (STRICTLY FROM CLOUD FIRESTORE) ---

export async function getSiteSection<T>(sectionName: string, fallback?: T): Promise<T> {
  try {
    await ensureSiteSectionsSeeded();
    const docRef = doc(db, SITE_SECTIONS_COLLECTION, sectionName);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return fallback as T;
    }
    const data = snap.data() as any;
    if (sectionName === 'hero' && data) {
      return {
        ...data,
        heroImage: resolveImageUrl(data.heroImage, STUDIO_IMAGE_ASSETS.heroPremium),
      } as T;
    }
    return data as T;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${SITE_SECTIONS_COLLECTION}/${sectionName}`);
  }
}

export async function saveSiteSection<T extends object>(sectionName: string, data: T): Promise<void> {
  try {
    const docRef = doc(db, SITE_SECTIONS_COLLECTION, sectionName);
    await setDoc(
      docRef,
      stripUndefined({
        ...data,
        updatedAt: new Date().toISOString(),
      }),
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SITE_SECTIONS_COLLECTION}/${sectionName}`);
  }
}

// --- MEDIA ITEMS (STRICTLY FROM CLOUD FIRESTORE / STORAGE) ---

export async function getMediaItems(): Promise<CMSMediaItem[]> {
  try {
    await ensureMediaInitialized();
    const mediaRef = collection(db, MEDIA_COLLECTION);
    const snapshot = await getDocs(mediaRef);
    const items: CMSMediaItem[] = [];
    snapshot.forEach((snap) => {
      const data = snap.data() as any;
      items.push({
        id: snap.id,
        ...data,
        url: resolveImageUrl(data.url, STUDIO_IMAGE_ASSETS.coffeeCart),
      });
    });
    return items.sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, MEDIA_COLLECTION);
  }
}

export async function uploadMediaFile(file: File, altText: string): Promise<CMSMediaItem> {
  const cleanFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storagePath = `uploads/${cleanFilename}`;
  let url = '';
  let savedStoragePath: string | undefined = storagePath;

  try {
    const storageRef = ref(storage, storagePath);
    const uploadResult = await uploadBytes(storageRef, file);
    url = await getDownloadURL(uploadResult.ref);
  } catch (storageErr) {
    console.warn('[CMS] Cloud Storage upload unavailable, saving compressed asset directly in Cloud Firestore:', storageErr);
    url = await compressImageToDataUrl(file);
    savedStoragePath = undefined;
  }

  const mediaItem: CMSMediaItem = stripUndefined({
    id: `media-${Date.now()}`,
    url,
    storagePath: savedStoragePath,
    filename: file.name,
    altText: altText || file.name,
    uploadedAt: new Date().toISOString(),
    sizeBytes: file.size,
  });

  try {
    await ensureMediaInitialized();
    const docRef = doc(db, MEDIA_COLLECTION, mediaItem.id);
    await setDoc(docRef, mediaItem);
    return mediaItem;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${MEDIA_COLLECTION}/${mediaItem.id}`);
  }
}

export async function saveMediaUrlDirectly(url: string, filename: string, altText: string): Promise<CMSMediaItem> {
  const mediaItem: CMSMediaItem = stripUndefined({
    id: `media-${Date.now()}`,
    url: resolveImageUrl(url.trim(), STUDIO_IMAGE_ASSETS.coffeeCart),
    filename: filename.trim() || 'Gambar Media',
    altText: (altText || filename).trim(),
    uploadedAt: new Date().toISOString(),
  });
  try {
    await ensureMediaInitialized();
    const docRef = doc(db, MEDIA_COLLECTION, mediaItem.id);
    await setDoc(docRef, mediaItem);
    return mediaItem;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${MEDIA_COLLECTION}/${mediaItem.id}`);
  }
}

export async function deleteMediaItem(item: CMSMediaItem): Promise<void> {
  try {
    await ensureMediaInitialized();
    if (item.storagePath) {
      try {
        const storageRef = ref(storage, item.storagePath);
        await deleteObject(storageRef);
      } catch (err) {
        console.warn('Storage delete warning:', err);
      }
    }
    const docRef = doc(db, MEDIA_COLLECTION, item.id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${MEDIA_COLLECTION}/${item.id}`);
  }
}

// --- SEED INITIAL DATA TO CLOUD FIRESTORE ---

export async function seedInitialDataIfEmpty(): Promise<boolean> {
  await Promise.all([
    ensureCategoriesInitialized(),
    ensureProductsInitialized(),
    ensurePortfolioInitialized(),
    ensureMediaInitialized(),
    ensureSiteSectionsSeeded(),
  ]);
  return true;
}
