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
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { BRAND_CONFIG, ServiceItem, ProcessStep, FAQItem } from '../config/brand';
import { CATALOG_DATA, CatalogItem, CatalogCategory } from '../config/catalogData';

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
  isRealProject: boolean; // true = Proyek Nyata, false = Konsep Desain
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

export interface CMSSettings {
  siteTitle: string;
  metaDescription: string;
  tagline: string;
  supportingSentence: string;
  contact: typeof BRAND_CONFIG.contact;
  updatedAt?: string;
}

// Collections names
const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const PORTFOLIO_COLLECTION = 'portfolio';
const SITE_SECTIONS_COLLECTION = 'site_sections';
const MEDIA_COLLECTION = 'media';

// --- PRODUCTS ---

const REMOVED_PRODUCT_IDS = new Set([
  'daily-crumb-bakery-cart',
  'flagship-commercial-pavilion',
]);

export async function getProducts(includeDrafts = false): Promise<CMSProduct[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = includeDrafts
      ? query(productsRef)
      : query(productsRef, where('status', '==', 'published'));
    
    const snapshot = await getDocs(q);
    if (snapshot.empty && !includeDrafts) {
      // Return local fallback catalog data if database not yet populated
      return CATALOG_DATA.map((item, idx) => ({
        ...item,
        status: 'published',
        sortOrder: idx,
      }));
    }

    const items: CMSProduct[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as any;
      if (
        !REMOVED_PRODUCT_IDS.has(docSnap.id) &&
        data.name !== 'Sanak Artisan Bakery & Pastry Cart' &&
        data.name !== 'Sanak Commercial Pavilion Flagship'
      ) {
        items.push({ id: docSnap.id, ...data });
      }
    });

    if (items.length === 0 && !includeDrafts) {
      return CATALOG_DATA.map((item, idx) => ({
        ...item,
        status: 'published',
        sortOrder: idx,
      }));
    }

    // Sort by sortOrder or name
    return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  } catch (error) {
    console.warn('[CMS] Failed to fetch products from Firestore, returning static fallback:', error);
    return CATALOG_DATA.map((item, idx) => ({
      ...item,
      status: 'published',
      sortOrder: idx,
    }));
  }
}

export async function getProductById(id: string): Promise<CMSProduct | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...(docSnap.data() as any) };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function saveProduct(product: CMSProduct): Promise<void> {
  try {
    const id = product.id || `cart-${Date.now()}`;
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const now = new Date().toISOString();

    const dataToSave = {
      ...product,
      id,
      updatedAt: now,
      createdAt: product.createdAt || now,
    };

    await setDoc(docRef, dataToSave, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${product.id}`);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function duplicateProduct(id: string): Promise<CMSProduct> {
  const source = await getProductById(id);
  if (!source) throw new Error('Produk sumber tidak ditemukan');

  const newId = `cart-${Date.now()}`;
  const duplicated: CMSProduct = {
    ...source,
    id: newId,
    slug: `${source.slug}-salinan-${Math.floor(Math.random() * 1000)}`,
    name: `${source.name} (Salinan)`,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveProduct(duplicated);
  return duplicated;
}

// --- CATEGORIES ---

export const DEFAULT_CATEGORIES: CMSCategory[] = [
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

async function ensureCategoriesInitialized(): Promise<void> {
  const metaRef = doc(db, SITE_SECTIONS_COLLECTION, 'categories_meta');
  const metaSnap = await getDoc(metaRef);
  if (metaSnap.exists() && metaSnap.data()?.initialized === true) {
    return;
  }

  const catRef = collection(db, CATEGORIES_COLLECTION);
  const snapshot = await getDocs(catRef);
  const existingIds = new Set<string>();
  snapshot.forEach((snap) => existingIds.add(snap.id));

  for (const defCat of DEFAULT_CATEGORIES) {
    if (!existingIds.has(defCat.id)) {
      await setDoc(doc(db, CATEGORIES_COLLECTION, defCat.id), defCat);
    }
  }

  await setDoc(metaRef, {
    initialized: true,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function getCategories(): Promise<CMSCategory[]> {
  try {
    const catRef = collection(db, CATEGORIES_COLLECTION);
    const metaRef = doc(db, SITE_SECTIONS_COLLECTION, 'categories_meta');
    const [snapshot, metaSnap] = await Promise.all([getDocs(catRef), getDoc(metaRef)]);
    const isInitialized = metaSnap.exists() && metaSnap.data()?.initialized === true;

    if (snapshot.empty) {
      if (isInitialized) {
        return [];
      }
      return [...DEFAULT_CATEGORIES];
    }

    const itemsMap = new Map<string, CMSCategory>();
    if (!isInitialized) {
      for (const defCat of DEFAULT_CATEGORIES) {
        itemsMap.set(defCat.id, defCat);
      }
    }

    snapshot.forEach((snap) => {
      const data = snap.data() as any;
      itemsMap.set(snap.id, {
        id: snap.id,
        slug: data.slug || snap.id,
        label: data.label || snap.id,
        description: data.description || '',
        sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 1,
      });
    });

    return Array.from(itemsMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    console.warn('[CMS] Failed to fetch categories, returning default:', error);
    return [...DEFAULT_CATEGORIES];
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
      {
        ...category,
        id: targetId,
        slug: category.slug.trim(),
        label: category.label.trim(),
        description: (category.description || '').trim(),
        sortOrder: Number(category.sortOrder) || 1,
      },
      { merge: true }
    );

    // Sync products that reference this category so their label & slug stay accurate
    try {
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
    for (const defCat of DEFAULT_CATEGORIES) {
      await setDoc(doc(db, CATEGORIES_COLLECTION, defCat.id), defCat, { merge: true });
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

// --- PORTFOLIO ---

export async function getPortfolio(includeDrafts = false): Promise<CMSPortfolioItem[]> {
  try {
    const portRef = collection(db, PORTFOLIO_COLLECTION);
    const q = includeDrafts
      ? query(portRef)
      : query(portRef, where('status', '==', 'published'));
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Default initial portfolio matching showcase
      return BRAND_CONFIG.showcase.map((item, idx) => ({
        id: item.id,
        title: item.title,
        clientName: 'Klien Bontang / Kaltim',
        location: 'Bontang, Kalimantan Timur',
        category: item.categoryLabel,
        image: item.image,
        gallery: [item.image],
        year: '2024',
        description: item.description,
        isRealProject: false, // Concept Inspiration
        status: 'published',
      }));
    }

    const items: CMSPortfolioItem[] = [];
    snapshot.forEach((snap) => {
      items.push({ id: snap.id, ...(snap.data() as any) });
    });
    return items;
  } catch (error) {
    console.warn('[CMS] Portfolio fetch error, returning fallback:', error);
    return BRAND_CONFIG.showcase.map((item) => ({
      id: item.id,
      title: item.title,
      clientName: 'Klien Bontang',
      location: 'Bontang, Kalimantan Timur',
      category: item.categoryLabel,
      image: item.image,
      gallery: [item.image],
      year: '2024',
      description: item.description,
      isRealProject: false,
      status: 'published',
    }));
  }
}

export async function savePortfolioItem(item: CMSPortfolioItem): Promise<void> {
  try {
    const id = item.id || `portfolio-${Date.now()}`;
    const docRef = doc(db, PORTFOLIO_COLLECTION, id);
    const now = new Date().toISOString();
    await setDoc(docRef, { ...item, id, updatedAt: now, createdAt: item.createdAt || now }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PORTFOLIO_COLLECTION}/${item.id}`);
  }
}

export async function deletePortfolioItem(id: string): Promise<void> {
  try {
    const docRef = doc(db, PORTFOLIO_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PORTFOLIO_COLLECTION}/${id}`);
  }
}

// --- SITE SECTIONS ---

export async function getSiteSection<T>(sectionName: string, fallback: T): Promise<T> {
  try {
    const docRef = doc(db, SITE_SECTIONS_COLLECTION, sectionName);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return fallback;
    return snap.data() as T;
  } catch (error) {
    console.warn(`[CMS] Could not load section ${sectionName}, using fallback`, error);
    return fallback;
  }
}

export async function saveSiteSection<T extends object>(sectionName: string, data: T): Promise<void> {
  try {
    const docRef = doc(db, SITE_SECTIONS_COLLECTION, sectionName);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SITE_SECTIONS_COLLECTION}/${sectionName}`);
  }
}

// --- MEDIA ITEMS ---

export async function getMediaItems(): Promise<CMSMediaItem[]> {
  try {
    const mediaRef = collection(db, MEDIA_COLLECTION);
    const snapshot = await getDocs(mediaRef);
    const items: CMSMediaItem[] = [];
    snapshot.forEach((snap) => {
      items.push({ id: snap.id, ...(snap.data() as any) });
    });
    return items.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  } catch (error) {
    console.warn('[CMS] Failed to fetch media items:', error);
    return [];
  }
}

export async function uploadMediaFile(file: File, altText: string): Promise<CMSMediaItem> {
  try {
    const cleanFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storagePath = `uploads/${cleanFilename}`;
    const storageRef = ref(storage, storagePath);

    const uploadResult = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(uploadResult.ref);

    const mediaItem: CMSMediaItem = {
      id: `media-${Date.now()}`,
      url,
      storagePath,
      filename: file.name,
      altText: altText || file.name,
      uploadedAt: new Date().toISOString(),
      sizeBytes: file.size,
    };

    const docRef = doc(db, MEDIA_COLLECTION, mediaItem.id);
    await setDoc(docRef, mediaItem);

    return mediaItem;
  } catch (error) {
    console.error('[CMS] Storage upload error:', error);
    throw error;
  }
}

export async function saveMediaUrlDirectly(url: string, filename: string, altText: string): Promise<CMSMediaItem> {
  const mediaItem: CMSMediaItem = {
    id: `media-${Date.now()}`,
    url,
    filename,
    altText,
    uploadedAt: new Date().toISOString(),
  };
  const docRef = doc(db, MEDIA_COLLECTION, mediaItem.id);
  await setDoc(docRef, mediaItem);
  return mediaItem;
}

export async function deleteMediaItem(item: CMSMediaItem): Promise<void> {
  try {
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

// --- SEED INITIAL DATA ---

export async function seedInitialDataIfEmpty(): Promise<boolean> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snap = await getDocs(productsRef);
    if (!snap.empty) {
      return false; // already seeded
    }

    console.log('[CMS] Firestore empty. Seeding initial products and sections...');

    // 1. Seed Products
    for (let i = 0; i < CATALOG_DATA.length; i++) {
      const item = CATALOG_DATA[i];
      const docRef = doc(db, PRODUCTS_COLLECTION, item.id);
      await setDoc(docRef, {
        ...item,
        status: 'published',
        sortOrder: i + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 2. Seed Hero Section
    await saveSiteSection('hero', {
      title: 'Solusi Gerobak & Booth Usaha Berkelas.',
      tagline: BRAND_CONFIG.officialTagline,
      supportingText: 'Kami merancang dan memproduksi gerobak jualan serta booth usaha modern dengan material kokoh, tata ruang fungsional, dan estetika yang memikat pelanggan.',
      heroImage: '/src/assets/images/hero_gerobak_bontang_1793275251642.jpg',
      badgeText: 'Spesialis Gerobak & Booth Custom Bontang',
      status: 'published',
    });

    // 3. Seed Contact & Settings
    await saveSiteSection('settings', {
      siteTitle: 'SANAK GEROBAK | Desain & Pembuatan Gerobak Usaha Custom Bontang',
      metaDescription: 'Spesialis desain dan pembuatan gerobak jualan, booth UMKM, coffee cart, dan kuliner modern di Bontang dan Kalimantan Timur.',
      tagline: BRAND_CONFIG.officialTagline,
      supportingSentence: BRAND_CONFIG.supportingSentence,
      contact: BRAND_CONFIG.contact,
    });

    // 4. Seed Services
    await saveSiteSection('services', {
      title: 'Dari Ide Menjadi Identitas Usaha.',
      subtitle: 'Layanan terintegrasi mulai dari perancangan konsep visual hingga unit gerobak siap pakai untuk menyambut pelanggan pertama Anda.',
      items: [
        {
          id: 'custom-cart',
          number: '01',
          title: 'Pembuatan Gerobak Custom',
          description: 'Pembuatan gerobak jualan outdoor & indoor dengan spesifikasi material tahan karat, kelistrikan terintegrasi, dan kompartemen ergonomis.',
          deliverables: ['Rangka baja & plat galvanis tahan karat', 'Meja kerja food-grade stainless / solid wood', 'Instalasi lampu LED & saklar terpadu'],
        },
        {
          id: 'booth-kiosk',
          number: '02',
          title: 'Booth & Kios UMKM Modular',
          description: 'Pembangunan booth semi-permanen dan kios kontainer berdimensi fleksibel untuk mall, food court, maupun lahan sewa outdoor.',
          deliverables: ['Sistem buka-tutup hidrolik / kanopi lipat', 'Struktur modular mudah dipindahkan', 'Pilihan finishing powder coating anti-cuaca'],
        },
        {
          id: 'branding-signage',
          number: '03',
          title: 'Visual Branding & Signage',
          description: 'Penyelarasan palet warna brand, neon flex sign, sticker vinyl laminasi doff/glossy, dan papan nama usaha yang mencolok.',
          deliverables: ['Desain logo & penempatan identitas visual', 'Neon flex / neon box akrilik hemat daya', 'Sticker decal tahan sinar UV & hujan'],
        },
      ],
    });

    // 5. Seed FAQs
    await saveSiteSection('faqs', {
      title: 'Pertanyaan yang Sering Diajukan',
      subtitle: 'Informasi seputar konsultasi, spesifikasi, dan proses pemesanan gerobak di SANAK GEROBAK.',
      items: BRAND_CONFIG.faqs,
    });

    console.log('[CMS] Initial seeding completed successfully.');
    return true;
  } catch (error) {
    console.error('[CMS] Seeding error:', error);
    return false;
  }
}
