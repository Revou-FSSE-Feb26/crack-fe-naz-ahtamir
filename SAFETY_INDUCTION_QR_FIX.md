# Safety Induction QR Code - Fix Documentation

## 🐛 Masalah yang Diperbaiki

**Gejala**: Setelah scan QR Code, muncul error "This site can't be reached" atau page kosong.

**Penyebab**: URL di dalam QR Code tidak lengkap (hanya path relatif, bukan URL lengkap dengan domain).

## ✅ Solusi yang Diterapkan

### 1. Menambahkan Environment Variable Baru

File `.env.local` sekarang memiliki variabel baru:

```env
# Frontend URL (untuk QR Code dan external links)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### 2. Update Fungsi Generate URL

Fungsi `getScanPageUrl()` dan `getVerifyCardUrl()` di `src/lib/inductionApi.ts` sudah diperbaiki untuk:
- Prioritas 1: Gunakan `window.location.origin` (jika di browser)
- Prioritas 2: Gunakan `NEXT_PUBLIC_FRONTEND_URL` dari environment variable
- Fallback: `http://localhost:3000` untuk development

### 3. Status Sesi Diubah Jadi INPG/CLSD

Untuk konsistensi dengan modul lain (Finding), status Safety Induction diubah dari DRAFT/ACTIVE/COMPLETED menjadi **INPG** dan **CLSD**:

- **INPG** (In Progress) = Sesi sedang berlangsung, QR Code aktif, peserta bisa daftar
- **CLSD** (Closed) = Sesi selesai, semua dokumen lengkap (absensi manual, foto dokumentasi sudah upload)

### 4. Fitur Delete Sesi

Admin sekarang bisa menghapus sesi Safety Induction:
- **Di list page**: Tombol merah dengan icon trash di setiap card sesi
- **Di detail page**: Tombol merah di header (sebelah dropdown status)
- Konfirmasi akan muncul sebelum menghapus
- Menghapus sesi akan otomatis menghapus semua peserta dan dokumen terkait (cascade delete)

### 5. File yang Diubah

**Backend:**
- ✅ `prisma/schema.prisma` - Update default status
- ✅ `prisma/migrations/xxx_change_induction_status_to_inpg_clsd/migration.sql` - Migrate data lama
- ✅ `src/modules/induction/induction.service.ts` - Update logic check status

**Frontend:**
- ✅ `.env.local` - Tambah `NEXT_PUBLIC_FRONTEND_URL`
- ✅ `.env.local.example` - Tambah contoh konfigurasi
- ✅ `src/lib/inductionApi.ts` - Fix URL generation & update status types
- ✅ `src/app/safety-competency/safety-induction/scan/[kode]/page.tsx` - Check INPG
- ✅ `src/app/safety-competency/safety-induction/[id]/page.tsx` - Update dropdown status
- ✅ `src/app/safety-competency/safety-induction/page.tsx` - Update list & filter status

## 🚀 Cara Menggunakan

### Development (Local)

```env
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### Production / Staging

Ganti dengan URL production Anda:

```env
# Contoh untuk production
NEXT_PUBLIC_FRONTEND_URL=https://smk3.yourcompany.com

# Atau untuk staging
NEXT_PUBLIC_FRONTEND_URL=https://staging.yourcompany.com
```

## 📋 Langkah-Langkah Testing

### 1. Restart Development Server

Setelah menambahkan environment variable, **restart server Next.js**:

```bash
# Stop server (Ctrl+C)
# Lalu jalankan ulang
npm run dev
```

### 2. Buat Sesi Induction Baru

1. Login sebagai admin
2. Buka menu **Safety Competency → Safety Induction**
3. Klik **Buat Sesi Baru**
4. Isi data sesi:
   - Tanggal
   - Lokasi
   - Topik (opsional)
   - PIC (opsional)
   - Status: pilih **"INPG"** (Berlangsung)

### 3. Download QR Code

1. Buka detail sesi yang baru dibuat
2. Status akan otomatis **"INPG"** (Berlangsung)
3. Klik tombol **"QR Code"**
4. Di modal yang muncul:
   - Periksa URL yang ditampilkan, pastikan lengkap dengan domain
   - Contoh: `http://localhost:3000/safety-competency/safety-induction/scan/SI-2609-001`
5. Klik **"Download QR"**

### 4. Test Scan QR Code

**Opsi A: Scan dengan HP**
1. Buka kamera HP atau aplikasi QR scanner
2. Scan QR Code yang sudah di-download
3. Pastikan terbuka halaman form absensi

**Opsi B: Test Manual (Copy URL)**
1. Copy URL dari modal QR Code
2. Buka di browser lain / incognito mode
3. Pastikan halaman form absensi muncul

### 5. Test Registrasi

1. Isi form absensi:
   - Nama Lengkap (required)
   - Status/Kategori (required)
   - Data lain (optional)
2. Klik **"Daftar Hadir"**
3. Pastikan muncul halaman sukses dengan kartu induksi

### 6. Tutup Sesi (Set CLSD)

Setelah sesi selesai dan semua dokumen lengkap:
1. Buka detail sesi
2. Pastikan semua peserta sudah absen
3. Upload foto dokumentasi (jika ada)
4. Upload absensi manual (jika ada)
5. Ubah status menjadi **"CLSD"** (Selesai)

## 🔍 Troubleshooting

### Error: "This site can't be reached"

**Kemungkinan penyebab**:
1. Environment variable belum di-set
2. Server belum di-restart setelah update .env
3. URL di environment variable salah

**Solusi**:
1. Cek file `.env.local`, pastikan ada `NEXT_PUBLIC_FRONTEND_URL`
2. Restart server: `Ctrl+C` lalu `npm run dev`
3. Pastikan URL tidak ada typo dan bisa diakses

### Error: "Sesi Tidak Ditemukan"

**Penyebab**: Kode sesi salah atau sesi sudah dihapus

**Solusi**: Pastikan kode sesi di URL sama dengan kode sesi yang ada di database

### Error: "Sesi Sudah Selesai"

**Penyebab**: Status sesi adalah "CLSD"

**Solusi**: 
1. Buka detail sesi di admin panel
2. Ubah status menjadi **"INPG"** (Berlangsung)

### Form Absensi Tidak Muncul

**Kemungkinan**:
1. Status sesi bukan INPG → ubah status
2. JavaScript error → cek console browser (F12)
3. API error → cek network tab di developer tools

## 🌐 Production Deployment

Saat deploy ke production, pastikan:

### 1. Update Environment Variable

```env
# Production
NEXT_PUBLIC_FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### 2. Build & Deploy

```bash
npm run build
npm run start
```

### 3. Verifikasi

1. Buat sesi test di production
2. Download QR Code
3. Scan dengan HP
4. Pastikan URL yang terbuka benar (https://yourdomain.com/...)

## 📝 Status Sesi

### INPG (In Progress / Berlangsung)
- Sesi sedang aktif
- QR Code bisa di-scan
- Peserta bisa daftar hadir
- Admin bisa tambah peserta manual
- Bisa upload foto dokumentasi

### CLSD (Closed / Selesai)
- Sesi sudah selesai
- QR Code tidak bisa digunakan untuk registrasi
- Peserta tidak bisa daftar lagi
- Data untuk arsip dan laporan
- **Set ke CLSD setelah**: Semua peserta absen, foto dokumentasi upload, absensi manual upload

## 🎯 Flow Lengkap

```
1. Admin buat sesi induction (status: INPG)
2. Admin download QR Code
3. Admin bagikan QR Code (print/display di lokasi sesi)
4. Peserta scan QR Code
5. Peserta isi form absensi
6. Sistem generate kartu induksi
7. Peserta download/print kartu
8. Admin bisa lihat daftar peserta real-time
9. Admin upload foto dokumentasi
10. Admin upload absensi manual (jika ada)
11. Admin set status → CLSD (Selesai)
```

## 🔗 Related Files

- Frontend API: `src/lib/inductionApi.ts`
- Scan Page: `src/app/safety-competency/safety-induction/scan/[kode]/page.tsx`
- Detail Page: `src/app/safety-competency/safety-induction/[id]/page.tsx`
- List Page: `src/app/safety-competency/safety-induction/page.tsx`
- Backend Controller: `src/modules/induction/induction.controller.ts`
- Backend Service: `src/modules/induction/induction.service.ts`
- Schema: `prisma/schema.prisma`

---

**Last Updated**: 2026-09-04
**Issue**: QR Code URL tidak lengkap + Status tidak konsisten
**Status**: ✅ Fixed
