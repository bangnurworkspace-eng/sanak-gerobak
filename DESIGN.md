# DESIGN.md: Sistem & Arah Visual SANAK GEROBAK

> **Design Read:**
> Reading this as: Commercial product showcase & custom fabrication studio website for UMKM entrepreneurs in Bontang & East Kalimantan, in an Industrial Architectural Craftsmanship style, dial `ENERGY 2 / RHYTHM 3 / MOTION 2`.

---

## 1. Identitas & Karakter Merek

- **Nama Merek:** SANAK GEROBAK
- **Tagline Resmi:** “Butuh Gerobak Jualan? SANAK GEROBAK Aja!”
- **Kalimat Pendukung:** “Desain Custom, Usaha Makin Berkelas.”
- **Basis Operasional:** Kota Bontang, Kalimantan Timur (melayani Bontang, Samarinda, Balikpapan, dan sekitarnya).
- **Kepribadian Visual:**
  - **Modern, Berani, dan Membumi:** Memadukan ketegasan material konstruksi gerobak (besi hollow galvanis, plat baja, kayu solid, stainless steel) dengan sapaan akrab khas Kalimantan (*"Sanak"* berarti saudara/kerabat).
  - **Bukan Template SaaS AI:** Tampilan dirancang menyerupai katalog studio fabrikasi arsitektural, bukan landing page software generik.
  - **Komersial & Jelas:** Setiap bagian mengarahkan pengunjung (pedagang, perintis usaha kuliner/kopi, keluarga, dan pelaku UMKM) untuk menemukan referensi desain dan langsung berkonsultasi via WhatsApp (`0823-4462-8667`).

---

## 2. Three Dials (Liveliness Toolkit)

- **ENERGY: 2 (Balanced — Berwibawa & Mengundang)**
  Kontras kuat antara *Midnight Navy* (`#101827`), *Warm Ivory* (`#F6F2E9`), dan aksen *Champagne Gold* (`#D6B46A`) yang memberi kesan gerobak naik kelas tanpa terasa berlebihan.
- **RHYTHM: 3 (Varied — Komposisi Bervariasi)**
  Setiap section memiliki komposisi berbeda sesuai fungsi kontennya:
  1. *Hero*: Full-viewport fotografi sinematik dengan fokus terpusat pada tagline dan 2 CTA utama.
  2. *Brand Statement (Filosofi)*: Latar terang *Warm Ivory* (`#F6F2E9`) sebagai jeda visual dari latar gelap, menggunakan tata letak editorial 3 prinsip bernomor `01–03`.
  3. *Visual Showcase*: Grid asimetris 12 kolom (`col-span-7` dan `col-span-5`) dengan filter kategori interaktif dan modal pratinjau ukuran penuh.
  4. *Katalog Konsep & Inspirasi*: Pencarian langsung + tab kategori dinamis CMS + kartu produk dengan item unggulan melebar (`md:col-span-2`).
  5. *Proses Pemesanan*: Alur kerja 4 tahap berurutan (`01` s.d. `04`) disertai catatan transparansi pengerjaan.
  6. *Komitmen Lokal*: Komposisi 2 kolom asimetris (visual kuliner lokal Bontang di kiri, narasi & nilai konstruksi di kanan).
  7. *FAQ*: Akordion 1 kolom terfokus untuk menjawab pertanyaan nyata calon pemesan.
- **MOTION: 2 (Purposeful Transitions)**
  Transisi halus pada perubahan warna navbar saat digulir, zoom lembut (`group-hover:scale-105 duration-700`) pada foto gerobak untuk menonjolkan detail material, serta transisi buka/tutup modal. Seluruh animasi menghormati `prefers-reduced-motion: reduce` dan tidak ada animasi berulang tanpa henti.

---

## 3. Palet Warna & Standar Kontras (R-25 & R-29)

Palet dibatasi secara disiplin pada **3 warna inti + 1 warna aksen**:

| Peran | Nama Warna | Kode Hex | Penggunaan & Kontras WCAG AA |
| :--- | :--- | :--- | :--- |
| **Core 1 (Kanvas Utama)** | Midnight Navy | `#101827` | Latar utama halaman publik & CMS. Memberi kontras tinggi agar foto gerobak menyala. |
| **Core 2 (Permukaan Kartu)** | Industrial Charcoal | `#17191D` | Latar kartu katalog, proses, akordion FAQ, dan modal. |
| **Core 3 (Kanvas Editorial Terang)** | Warm Ivory | `#F6F2E9` | Latar section Filosofi (`BrandStatement`) dengan teks `#17191D` (rasio kontras **15.4:1**). |
| **Accent (Aksen Tunggal)** | Champagne Gold | `#D6B46A` | Tombol CTA utama (dengan teks gelap `#101827`, rasio kontras **8.7:1**), nomor urut, dan penanda aktif. Hover: `#C5A154`. |
| **Teks Utama & Sekunder** | Pure White / Muted Steel | `#FFFFFF` / `#A4A7AE` | `#FFFFFF` untuk judul (kontras **17.4:1** di atas `#101827`); `#A4A7AE` untuk teks deskripsi sekunder (kontras **6.9:1** di atas `#101827` dan **6.4:1** di atas `#17191D`, lulus WCAG AA). |

**Aturan Kontras Ketat:**
- Dilarang menggunakan `text-white/40` atau `text-white/50` untuk teks informasi berukuran kecil di atas latar gelap karena menurunkan kontras di bawah 4.5:1. Gunakan `#A4A7AE` atau minimal `text-white/75`.

---

## 4. Tipografi & Hierarki Teks (R-06)

- **Heading & Display:** `'Manrope'` (`font-extrabold` / `font-black`, `tracking-tight`). Dipilih karena karakter geometrisnya tegas dan kokoh seperti struktur rangka besi hollow gerobak modern.
- **Body & UI:** `'Plus Jakarta Sans'` (`font-normal` / `font-medium` / `font-semibold`). Dipilih karena keterbacaannya sangat tinggi pada layar ponsel dan bernuansa hangat bagi pelaku usaha di Indonesia.
- **Angka & Label Teknis:** `font-mono` (`tabular-nums`) hanya digunakan secara fungsional untuk nomor tahap (`01`–`04`), jumlah item hasil filter, dan penanda spesifikasi material—bukan untuk heading bergaya terminal.
- **Larangan Tanda Baca AI (R-02):** Dilarang menggunakan karakter em dash (`—`) pada seluruh judul, deskripsi, maupun metadata. Gunakan koma, titik, titik dua, atau tanda pipa (`|`).

---

## 5. Layout, Spacing, dan Responsivitas Mobile (R-03 & R-39)

- **Kontainer Utama:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Target Sentuh Mobile (R-03):** Seluruh tombol interaktif, tautan navigasi mobile, tombol filter, dan tombol penutup modal wajib memiliki area sentuh minimal `44px × 44px` (`min-h-[44px]`).
- **Affordance Kursor & Fokus (R-32 & R-39):**
  - Aturan dasar CSS menetapkan `cursor: pointer` pada seluruh kontrol interaktif aktif dan `cursor: not-allowed` pada kontrol `disabled`.
  - Indikator fokus keyboard (`:focus-visible`) menggunakan garis tegas `2px solid #D6B46A` dengan `outline-offset: 2px`.
  - Seluruh dialog/modal (`CatalogDetailModal`, `VisualShowcase` lightbox, `WhatsAppCTA` popup) wajib dapat ditutup dengan tombol `Escape`.

---

## 6. Penggunaan Foto Produk & Performa Media (R-23 & R-40)

- **Utamakan Aset Asli:** Gunakan foto-foto gerobak, booth kontainer, dan kuliner lokal yang sudah ada di proyek (`/src/assets/images/...` dan `/assets/aistudio/...`) serta foto yang diunggah melalui CMS. Jangan pernah menggantinya dengan ilustrasi vektor generik atau placeholder palsu.
- **Atribut Dimensi Eksplisit (R-40):** Setiap elemen `<img>` wajib memiliki atribut `width` dan `height` eksplisit (serta `aspect-*` pada pembungkusnya) agar tidak menimbulkan pergeseran tata letak (*layout shift*).
- **Prioritas Pemuatan:** Gambar utama pada `Hero` wajib menggunakan `fetchPriority="high"` tanpa `loading="lazy"`, sedangkan gambar di bawah lipatan layar menggunakan `loading="lazy"` dan `decoding="async"`.

---

## 7. Pola Desain yang Dihindari untuk Proyek Ini

1. **Dilarang menggunakan ikon `Sparkles` / bintang sihir (R-04):** SANAK GEROBAK adalah bisnis fabrikasi fisik, bukan produk sulap AI. Gunakan ikon yang relevan dengan ketukangan dan struktur (`PenTool`, `Compass`, `Layers`, `Hammer`, `Shield`, `Check`) atau garis aksen tipografi.
2. **Dilarang menggunakan kapsul pill berlapis blur di atas H1 (R-09):** Gunakan kicker editorial bersih dengan garis aksen horizontal `#D6B46A`.
3. **Dilarang menggunakan `window.alert()` atau `window.confirm()` (R-26):** Seluruh konfirmasi hapus dan notifikasi pada CMS Admin wajib menggunakan modal konfirmasi dan banner status di dalam antarmuka.
4. **Dilarang menampilkan statistik atau testimoni fiktif (R-17, R-18, R-36):** Tampilkan hanya informasi nyata seputar alur kerja, material, cakupan layanan Kalimantan Timur, dan katalog konsep.

---

## 8. One-Line Reasons untuk Keputusan Desain Utama (R-31)

- **Mengapa warna Midnight Navy (`#101827`) & Champagne Gold (`#D6B46A`)?** Agar foto gerobak berlampu hangat tampil menonjol sekaligus mengangkat citra gerobak UMKM menjadi produk komersial berkelas.
- **Mengapa menyisipkan satu section berlatar Warm Ivory (`#F6F2E9`) setelah Hero?** Untuk memberikan jeda ritme visual yang terang dan nyaman dibaca saat menjelaskan filosofi merek sebelum masuk ke galeri foto gelap.
- **Mengapa menggunakan tipografi Manrope + Plus Jakarta Sans?** Manrope memberikan struktur judul yang kokoh seperti rangka konstruksi, sedangkan Plus Jakarta Sans menjaga penjelasan spesifikasi tetap ramah dan mudah dipahami pelaku usaha.
- **Mengapa menggunakan grid asimetris pada Visual Showcase dan kartu lebar pada Katalog?** Untuk memecah kesan monoton grid kartu AI yang seragam dan memberi penekanan visual pada desain unggulan.
- **Mengapa seluruh CTA utama mengarah ke WhatsApp dengan teks terformat otomatis?** Karena proses pemesanan gerobak custom selalu membutuhkan diskusi ukuran, peralatan, dan anggaran secara langsung dengan tim workshop di Bontang.
