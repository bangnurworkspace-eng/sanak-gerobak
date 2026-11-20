/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CMSProduct,
  CMSPortfolioItem,
  CMSCategory,
  CMSHeroSection,
  CMSAboutSection,
  CMSSettings,
  getProducts,
  getPortfolio,
  getCategories,
  getSiteSection,
  seedInitialDataIfEmpty,
} from '../services/cmsService';
import { testFirestoreConnection } from '../lib/firebase';
import { resolveImageUrl, STUDIO_IMAGE_ASSETS } from '../utils/assets';
import { setLiveWhatsAppConfig } from '../utils/whatsapp';

interface SiteContentContextType {
  products: CMSProduct[];
  portfolio: CMSPortfolioItem[];
  categories: CMSCategory[];
  heroContent: CMSHeroSection | null;
  aboutContent: CMSAboutSection | null;
  contactInfo: CMSSettings['contact'] | null;
  faqList: { question: string; answer: string }[];
  isLoading: boolean;
  loadError: string | null;
  refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<CMSProduct[]>([]);
  const [portfolio, setPortfolio] = useState<CMSPortfolioItem[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [heroContent, setHeroContent] = useState<CMSHeroSection | null>(null);
  const [aboutContent, setAboutContent] = useState<CMSAboutSection | null>(null);
  const [contactInfo, setContactInfo] = useState<CMSSettings['contact'] | null>(null);
  const [faqList, setFaqList] = useState<{ question: string; answer: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    testFirestoreConnection().catch(() => {});
  }, []);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      await seedInitialDataIfEmpty();

      const [fetchedProducts, fetchedCats, fetchedPort, hero, aboutData, settings, faqsData] =
        await Promise.all([
          getProducts(false),
          getCategories(),
          getPortfolio(false),
          getSiteSection<CMSHeroSection | null>('hero', null),
          getSiteSection<CMSAboutSection | null>('about', null),
          getSiteSection<CMSSettings | null>('settings', null),
          getSiteSection<{ items?: { question: string; answer: string }[] } | null>('faqs', null),
        ]);

      setProducts(fetchedProducts);
      setCategories(fetchedCats);
      setPortfolio(fetchedPort);

      if (hero) {
        setHeroContent({
          ...hero,
          heroImage: resolveImageUrl(hero.heroImage, STUDIO_IMAGE_ASSETS.heroPremium),
        });
      } else {
        setHeroContent(null);
      }

      setAboutContent(aboutData || null);

      if (settings) {
        if (typeof document !== 'undefined') {
          if (settings.siteTitle) {
            document.title = settings.siteTitle;
          }
          if (settings.metaDescription) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', settings.metaDescription);
          }
        }

        if (settings.contact) {
          setContactInfo(settings.contact);
          setLiveWhatsAppConfig({
            whatsappNumber: settings.contact.whatsappNumber,
            officialTagline: settings.tagline,
          });
        } else {
          setContactInfo(null);
        }
      }

      if (faqsData && Array.isArray(faqsData.items)) {
        setFaqList(faqsData.items);
      } else {
        setFaqList([]);
      }
    } catch (err: any) {
      console.error('[SiteContentContext] Gagal memuat data dari Cloud Firestore:', err);
      setLoadError(err?.message || 'Gagal memuat data dari Cloud Firestore.');
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
        aboutContent,
        contactInfo,
        faqList,
        isLoading,
        loadError,
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
