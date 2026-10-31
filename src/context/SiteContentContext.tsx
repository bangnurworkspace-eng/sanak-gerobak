/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CMSProduct,
  CMSPortfolioItem,
  CMSCategory,
  getProducts,
  getPortfolio,
  getCategories,
  getSiteSection,
  seedInitialDataIfEmpty,
} from '../services/cmsService';
import { BRAND_CONFIG } from '../config/brand';
import { CATALOG_DATA, CatalogItem } from '../config/catalogData';

interface SiteContentContextType {
  products: CMSProduct[];
  portfolio: CMSPortfolioItem[];
  categories: CMSCategory[];
  heroContent: {
    title: string;
    tagline: string;
    supportingText: string;
    heroImage: string;
    badgeText: string;
  };
  contactInfo: typeof BRAND_CONFIG.contact;
  faqList: { question: string; answer: string }[];
  isLoading: boolean;
  refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<CMSProduct[]>(
    CATALOG_DATA.map((item, idx) => ({ ...item, status: 'published', sortOrder: idx }))
  );
  const [portfolio, setPortfolio] = useState<CMSPortfolioItem[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [heroContent, setHeroContent] = useState({
    title: 'Solusi Gerobak & Booth Usaha Berkelas.',
    tagline: BRAND_CONFIG.officialTagline,
    supportingText: 'Kami merancang dan memproduksi gerobak jualan serta booth usaha modern dengan material kokoh, tata ruang fungsional, dan estetika yang memikat pelanggan.',
    heroImage: '/src/assets/images/hero_gerobak_bontang_1793275251642.jpg',
    badgeText: 'Spesialis Gerobak & Booth Custom Bontang',
  });
  const [contactInfo, setContactInfo] = useState(BRAND_CONFIG.contact);
  const [faqList, setFaqList] = useState(BRAND_CONFIG.faqs);
  const [isLoading, setIsLoading] = useState(true);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch live products from Firestore (falls back to local catalog if empty)
      const fetchedProducts = await getProducts(false);
      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      }

      // 2. Fetch categories
      const fetchedCats = await getCategories();
      if (fetchedCats) {
        setCategories(fetchedCats);
      }

      // 3. Fetch portfolio items
      const fetchedPort = await getPortfolio(false);
      if (fetchedPort && fetchedPort.length > 0) {
        setPortfolio(fetchedPort);
      }

      // 4. Fetch Hero Section
      const hero = await getSiteSection('hero', heroContent);
      if (hero) setHeroContent(hero);

      // 5. Fetch Settings / Contact
      const settings = await getSiteSection('settings', { contact: BRAND_CONFIG.contact });
      if (settings?.contact) {
        const isOldPlaceholder = settings.contact.whatsappNumber === '6282154321098';
        const resolvedContact = {
          ...BRAND_CONFIG.contact,
          ...settings.contact,
          whatsappNumber: isOldPlaceholder
            ? BRAND_CONFIG.contact.whatsappNumber
            : settings.contact.whatsappNumber || BRAND_CONFIG.contact.whatsappNumber,
          whatsappDisplay: isOldPlaceholder
            ? BRAND_CONFIG.contact.whatsappDisplay
            : settings.contact.whatsappDisplay || BRAND_CONFIG.contact.whatsappDisplay,
        };
        BRAND_CONFIG.contact.whatsappNumber = resolvedContact.whatsappNumber;
        BRAND_CONFIG.contact.whatsappDisplay = resolvedContact.whatsappDisplay;
        setContactInfo(resolvedContact);
      }

      // 6. Fetch FAQs
      const faqsData = await getSiteSection('faqs', { items: BRAND_CONFIG.faqs });
      if (faqsData?.items) setFaqList(faqsData.items);

    } catch (err) {
      console.warn('[SiteContentContext] Using local configuration defaults:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return (
    <SiteContentContext.Provider
      value={{
        products,
        portfolio,
        categories,
        heroContent,
        contactInfo,
        faqList,
        isLoading,
        refreshContent: loadContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }
  return context;
};
