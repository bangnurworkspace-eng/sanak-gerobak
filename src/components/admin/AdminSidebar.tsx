/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard,
  Home,
  Store,
  FolderTree,
  Briefcase,
  Wrench,
  HelpCircle,
  PhoneCall,
  Settings,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';

export type AdminTab =
  | 'overview'
  | 'hero_home'
  | 'catalog'
  | 'categories'
  | 'portfolio'
  | 'services'
  | 'about'
  | 'faq'
  | 'contact'
  | 'settings'
  | 'media';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onViewLiveSite: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onViewLiveSite,
  isOpen,
  onCloseMobile,
}) => {
  const { user, logout } = useAdminAuth();

  const menuItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'hero_home', label: 'Konten Beranda', icon: Home },
    { id: 'catalog', label: 'Katalog Gerobak', icon: Store },
    { id: 'categories', label: 'Kategori', icon: FolderTree },
    { id: 'portfolio', label: 'Portofolio', icon: Briefcase },
    { id: 'services', label: 'Layanan', icon: Wrench },
    { id: 'about', label: 'Tentang Kami', icon: Info },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Kontak', icon: PhoneCall },
    { id: 'settings', label: 'Pengaturan Website', icon: Settings },
    { id: 'media', label: 'Pustaka Media', icon: ImageIcon },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#0B132B] border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ease-in-out font-['Plus_Jakarta_Sans'] ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/15 shadow bg-[#070D19] shrink-0">
              <img
                src={BRAND_CONFIG.logoUrl}
                alt="Logo SANAK GEROBAK"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-sm font-extrabold text-white tracking-wider font-['Manrope'] block leading-tight">
                {BRAND_CONFIG.name}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D6B46A] block mt-0.5">
                Panel CMS
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-[#A4A7AE] hover:text-white rounded-lg hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 bg-[#101827] rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 flex items-center justify-center text-[#D6B46A] font-bold text-xs uppercase">
              {user?.email?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.displayName || user?.email?.split('@')[0] || 'Administrator'}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-[#D6B46A]">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span className="font-semibold uppercase tracking-wider">Superadmin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Modules (11 modules) */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#A4A7AE]/70 block mb-2">
            Kelola Konten & Data
          </span>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#D6B46A] text-[#101827] font-bold shadow-md shadow-[#D6B46A]/20'
                    : 'text-[#A4A7AE] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#101827]' : 'text-[#A4A7AE]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#101827]" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            onClick={onViewLiveSite}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-[#A4A7AE] hover:text-[#D6B46A] rounded-lg hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website Publik</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#D6B46A] font-semibold">Live</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
