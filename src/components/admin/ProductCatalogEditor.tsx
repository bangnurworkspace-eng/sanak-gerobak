/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CMSProduct,
  CMSCategory,
  getProducts,
  getCategories,
  saveProduct,
  deleteProduct,
  duplicateProduct,
} from '../../services/cmsService';
import {
  Plus,
  Search,
  Filter,
  Copy,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  FileEdit,
  Image as ImageIcon,
  Loader2,
  X,
  Save,
  Tag,
  ListPlus,
} from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';

interface ProductCatalogEditorProps {
  onRefreshPublicSite: () => Promise<void>;
}

export const ProductCatalogEditor: React.FC<ProductCatalogEditorProps> = ({
  onRefreshPublicSite,
}) => {
  const [products, setProducts] = useState<CMSProduct[]>([]);
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<CMSProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<'image' | 'gallery'>('image');

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState<any>('gerobak-kopi');
  const [formCategoryLabel, setFormCategoryLabel] = useState('Gerobak Kopi');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formGallery, setFormGallery] = useState<string[]>([]);
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [formConceptType, setFormConceptType] = useState<'Inspirasi Desain' | 'Konsep Desain'>('Inspirasi Desain');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formSortOrder, setFormSortOrder] = useState<number>(1);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prod, cat] = await Promise.all([getProducts(true), getCategories()]);
      setProducts(prod);
      setCategories(cat);
    } catch (err) {
      console.warn('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setCurrentProduct(null);
    setFormName('');
    setFormSlug('');
    setFormCategory('gerobak-kopi');
    setFormCategoryLabel('Gerobak Kopi');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormImage('/src/assets/images/gerobak_coffee_cart_1793275252747.jpg');
    setFormGallery(['/src/assets/images/gerobak_coffee_cart_1793275252747.jpg']);
    setFormTags(['Rangka Baja', 'Custom Desain']);
    setFormFeatures(['Meja Food-Grade Stainless Steel', 'Rangka Galvanis Kokoh', 'Instalasi Listrik Terpadu']);
    setFormConceptType('Inspirasi Desain');
    setFormStatus('published');
    setFormSortOrder(products.length + 1);
    setEditModalOpen(true);
  };

  const openEditModal = (p: CMSProduct) => {
    setCurrentProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormCategory(p.category);
    setFormCategoryLabel(p.categoryLabel);
    setFormShortDesc(p.shortDescription);
    setFormFullDesc(p.fullDescription);
    setFormImage(p.image);
    setFormGallery(p.gallery || [p.image]);
    setFormTags(p.designTags || []);
    setFormFeatures(p.features || []);
    setFormConceptType(p.conceptType || 'Inspirasi Desain');
    setFormStatus(p.status || 'published');
    setFormSortOrder(p.sortOrder ?? 1);
    setEditModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!currentProduct) {
      // Auto-generate slug for new products
      const slugVal = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormSlug(slugVal);
    }
  };

  const handleCategorySelect = (slug: string) => {
    setFormCategory(slug);
    const found = categories.find((c) => c.slug === slug || c.id === slug);
    if (found) setFormCategoryLabel(found.label);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!formTags.includes(tagInput.trim())) {
      setFormTags([...formTags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (index: number) => {
    setFormTags(formTags.filter((_, idx) => idx !== index));
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    if (!formFeatures.includes(featureInput.trim())) {
      setFormFeatures([...formFeatures, featureInput.trim()]);
    }
    setFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormFeatures(formFeatures.filter((_, idx) => idx !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Nama produk tidak boleh kosong');
      return;
    }

    setIsSaving(true);
    try {
      const productData: CMSProduct = {
        id: currentProduct?.id || `cart-${Date.now()}`,
        slug: formSlug || `cart-${Date.now()}`,
        name: formName,
        category: formCategory,
        categoryLabel: formCategoryLabel,
        shortDescription: formShortDesc,
        fullDescription: formFullDesc,
        image: formImage,
        gallery: formGallery.length > 0 ? formGallery : [formImage],
        designTags: formTags,
        features: formFeatures,
        conceptType: formConceptType,
        status: formStatus,
        sortOrder: Number(formSortOrder) || 1,
        createdAt: currentProduct?.createdAt,
      };

      await saveProduct(productData);
      setEditModalOpen(false);
      await loadData();
      await onRefreshPublicSite();
    } catch (err: any) {
      alert('Gagal menyimpan produk: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!window.confirm('Duplikasi item ini sebagai draf baru?')) return;
    setIsLoading(true);
    try {
      await duplicateProduct(id);
      await loadData();
    } catch (err) {
      alert('Gagal menduplikasi produk.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus desain "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setIsLoading(true);
    try {
      await deleteProduct(id);
      await loadData();
      await onRefreshPublicSite();
    } catch (err) {
      alert('Gagal menghapus produk.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (p: CMSProduct) => {
    const nextStatus = p.status === 'published' ? 'draft' : 'published';
    try {
      await saveProduct({ ...p, status: nextStatus });
      await loadData();
      await onRefreshPublicSite();
    } catch (err) {
      alert('Gagal mengubah status publikasi.');
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans']">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Manrope']">
            Katalog Gerobak & Booth
          </h2>
          <p className="text-xs text-[#A4A7AE] mt-0.5">
            Kelola foto, spesifikasi material, dan status publikasi desain jualan.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D6B46A] text-[#101827] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C5A154] transition-colors shadow-lg shadow-[#D6B46A]/10"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Desain Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#101827] p-4 rounded-2xl border border-white/10">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-[#A4A7AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari konsep gerobak atau material..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D6B46A]"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
          >
            <option value="all">Semua Kategori ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
          >
            <option value="all">Semua Status</option>
            <option value="published">Hanya Terbit</option>
            <option value="draft">Hanya Draf</option>
          </select>
        </div>
      </div>

      {/* Product List Table / Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#A4A7AE] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#D6B46A]" />
          <p className="text-xs">Memuat katalog gerobak dari Firestore...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-[#101827] rounded-2xl border border-white/10 p-8 space-y-3">
          <p className="text-sm font-semibold text-white">Tidak ada desain gerobak ditemukan</p>
          <p className="text-xs text-[#A4A7AE]">Coba ubah kata kunci pencarian atau bersihkan filter.</p>
        </div>
      ) : (
        <div className="bg-[#101827] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B132B] text-[#A4A7AE] uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Visual & Nama</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Karakter Desain</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Visual & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-11 object-cover rounded-lg border border-white/10 bg-[#0B132B] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-xs">{item.name}</p>
                          <p className="text-[11px] text-[#A4A7AE] truncate max-w-xs">{item.shortDescription}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[#D6B46A] font-semibold text-[11px]">
                        {item.categoryLabel}
                      </span>
                    </td>

                    {/* Tags */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.designTags?.slice(0, 2).map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-[#A4A7AE] text-[10px]">
                            {t}
                          </span>
                        ))}
                        {(item.designTags?.length || 0) > 2 && (
                          <span className="text-[10px] text-[#A4A7AE] self-center">
                            +{(item.designTags?.length || 0) - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          item.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                        title="Klik untuk ubah status"
                      >
                        {item.status === 'published' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Terbit</span>
                          </>
                        ) : (
                          <>
                            <FileEdit className="w-3 h-3" />
                            <span>Draf</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-[#A4A7AE] hover:text-[#D6B46A] hover:bg-white/5 rounded-lg transition-colors"
                          title="Edit Desain"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(item.id)}
                          className="p-1.5 text-[#A4A7AE] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="Duplikasi Item"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Hapus Desain"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-[#101827] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0B132B] border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-['Manrope']">
                  {currentProduct ? 'Edit Desain Gerobak' : 'Tambah Desain Gerobak Baru'}
                </h3>
                <p className="text-xs text-[#A4A7AE]">
                  Informasi akan langsung tersimpan ke Cloud Firestore.
                </p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 text-[#A4A7AE] hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                    Nama Konsep / Gerobak *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Contoh: Sanak Artisan Coffee Cart"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                    Slug URL (Unik)
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="sanak-artisan-coffee-cart"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                    Kategori Usaha
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Concept Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                    Tipe Desain
                  </label>
                  <select
                    value={formConceptType}
                    onChange={(e) => setFormConceptType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  >
                    <option value="Inspirasi Desain">Inspirasi Desain</option>
                    <option value="Konsep Desain">Konsep Desain</option>
                  </select>
                </div>

                {/* Status Publikasi */}
                <div>
                  <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                    Status Publikasi
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  >
                    <option value="published">Terbit (Live di Website)</option>
                    <option value="draft">Draf (Disimpan Internal)</option>
                  </select>
                </div>
              </div>

              {/* Main Image */}
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Foto Utama Gerobak *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="URL gambar foto..."
                    required
                    className="flex-1 px-3.5 py-2.5 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTargetField('image');
                      setMediaModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shrink-0"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#D6B46A]" />
                    <span>Pilih dari Media</span>
                  </button>
                </div>
                {formImage && (
                  <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-white/10 bg-[#0B132B]">
                    <img src={formImage} alt="Pratinjau" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Deskripsi Singkat (Tampil pada Kartu Katalog)
                </label>
                <textarea
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  rows={2}
                  placeholder="Ringkasan konsep, peruntukan usaha, dan material unggulan..."
                  className="w-full px-3.5 py-2 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Deskripsi Lengkap & Spesifikasi Operasional
                </label>
                <textarea
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  rows={3}
                  placeholder="Detail alur kerja, dimensi rekomendasi, penempatan peralatan, ventilasi..."
                  className="w-full px-3.5 py-2 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                />
              </div>

              {/* Design Tags */}
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Label Karakter Desain
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Ketik tag lalu tekan Enter atau Tambah (mis: Charcoal Matte, Meja Kayu Jati)..."
                    className="flex-1 px-3.5 py-2 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-[#D6B46A] font-semibold"
                  >
                    Tambah Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        className="text-red-400 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Features / Spesifikasi Material */}
              <div>
                <label className="block text-xs font-semibold text-[#FDFBF7] uppercase tracking-wider mb-2">
                  Daftar Fitur & Material Konstruksi
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Contoh: Rangka Baja Galvanis Anti-Karat 1.4mm..."
                    className="flex-1 px-3.5 py-2 bg-[#0B132B] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D6B46A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-[#D6B46A] font-semibold"
                  >
                    Tambah Fitur
                  </button>
                </div>
                <div className="space-y-1.5">
                  {formFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#0B132B] border border-white/5 text-xs text-white"
                    >
                      <span>• {feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-[#A4A7AE] hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D6B46A] text-[#101827] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#C5A154] disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectImage={(url) => {
          if (mediaTargetField === 'image') {
            setFormImage(url);
          } else {
            setFormGallery([...formGallery, url]);
          }
        }}
      />

    </div>
  );
};
