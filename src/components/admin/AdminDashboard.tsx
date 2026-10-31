/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { OverviewView } from './OverviewView';
import { HeroEditor } from './HeroEditor';
import { ProductCatalogEditor } from './ProductCatalogEditor';
import { CategoryEditor } from './CategoryEditor';
import { PortfolioEditor } from './PortfolioEditor';
import { ServicesEditor } from './ServicesEditor';
import { AboutEditor } from './AboutEditor';
import { FaqEditor } from './FaqEditor';
import { ContactEditor } from './ContactEditor';
import { SettingsEditor } from './SettingsEditor';
import { MediaLibraryModal } from './MediaLibraryModal';
import { Menu, ExternalLink, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSiteContent } from '../../context/SiteContentContext';

interface AdminDashboardProps {
  onViewLiveSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewLiveSite }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user } = useAdminAuth();
  const { refreshContent } = useSiteContent();

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await refreshContent();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D19] text-white flex font-['Plus_Jakarta_Sans']">
      
      {/* Responsive Sidebar (11 Modules) */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'media') {
            setMediaModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onViewLiveSite={onViewLiveSite}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#0B132B]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-[#A4A7AE] hover:text-white rounded-lg hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  CMS SANAK GEROBAK
                </span>
              </div>
              <p className="text-[11px] text-[#A4A7AE] hidden sm:block">
                Tersambung ke Cloud Firestore Database & Storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMediaModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white rounded-lg transition-colors"
              title="Buka Pustaka Media"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#D6B46A]" />
              <span className="hidden sm:inline">Pustaka Media</span>
            </button>

            <button
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="p-2 text-[#A4A7AE] hover:text-[#D6B46A] hover:bg-white/5 rounded-lg transition-colors"
              title="Perbarui data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#D6B46A]' : ''}`} />
            </button>

            <button
              onClick={onViewLiveSite}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D6B46A] text-[#101827] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#C5A154] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </button>
          </div>
        </header>

        {/* Tab Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewView
              onNavigateTab={(t) => {
                if (t === 'media') {
                  setMediaModalOpen(true);
                } else {
                  setActiveTab(t);
                }
              }}
              onRefreshAll={handleRefreshAll}
            />
          )}

          {activeTab === 'hero_home' && (
            <HeroEditor onRefreshPublicSite={handleRefreshAll} />
          )}

          {activeTab === 'catalog' && (
            <ProductCatalogEditor onRefreshPublicSite={handleRefreshAll} />
          )}

          {activeTab === 'categories' && (
            <CategoryEditor onRefreshPublicSite={handleRefreshAll} />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioEditor onRefreshPublicSite={handleRefreshAll} />
          )}

          {activeTab === 'services' && (
            <ServicesEditor onRefreshPublicSite={handleRefreshAll} />
          )}

          {activeTab === 'about' && (
            <AboutEditor onRefreshPublicSite={handleRefreshAll} />
          )}

          {activeTab === 'faq' && (
            <FaqEditor onRefreshPublicSite={handleRefreshAll} />
          )}

          {activeTab === 'contact' && (
            <ContactEditor onRefreshPublicSite={handleRefreshAll} />
          )}

          {activeTab === 'settings' && (
            <SettingsEditor onRefreshPublicSite={handleRefreshAll} />
          )}
        </main>

      </div>

      {/* Global Media Library Modal Accessible from any Tab */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectImage={(url) => {
          navigator.clipboard?.writeText(url);
          alert('Tautan gambar berhasil disalin ke clipboard:\n' + url);
        }}
      />

    </div>
  );
};
