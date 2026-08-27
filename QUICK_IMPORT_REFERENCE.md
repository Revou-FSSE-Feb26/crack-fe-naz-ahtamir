# ⚡ Quick Reference - Import Karyawan

## 🚀 Langkah Cepat

```bash
# 1. Pastikan file Excel di root folder
# File: db-karyawan.xlsx

# 2. Jalankan import
bun run import-karyawan

# Atau pakai npm/npx
npm run import-karyawan
# atau
npx tsx scripts/importKaryawan.ts
```

## 🔐 Format Login

| User | Username | Password |
|------|----------|----------|
| Semua karyawan | `[ID Card]` | `[ID Card]K3` |
| **Contoh** | `82400944` | `82400944K3` |

## 👥 Role Assignment

```typescript
// Superadmin (manual)
ID: 82400944 → Role: admin

// Supervisor (auto-detect dari jabatan)
Jabatan mengandung:
  - wakil foreman / 副班长
  - foreman / 班长  
  - supervisor
  - manager
  → Role: supervisor

// User (default)
Semua lainnya → Role: user
```

## 📊 Expected Result

```
✓ Connected to MongoDB
📊 Total karyawan di Excel: 32

👑 82400944 - NAZ AHTAMIR [ADMIN]
👤 82401850 - LEO PALA'BIRAN [SUPERVISOR]
👨‍💼 82400469 - RACHMAT, S.KM [USER]
...

==================================================
📊 HASIL IMPORT:
==================================================
  ✓ Total Berhasil  : 32
  ✗ Total Gagal     : 0
  👑 Admin          : 1
  👤 Supervisor     : 3
  👨‍💼 User          : 28
==================================================
```

## 🔧 Troubleshooting

| Error | Solution |
|-------|----------|
| File not found | Pastikan `db-karyawan.xlsx` di root folder |
| MongoDB connection | `net start MongoDB` (Windows) |
| Missing xlsx module | `npm install xlsx` |

## ✅ Verifikasi

Setelah import, test login:
1. Buka `/login`
2. Username: `82400944`
3. Password: `82400944K3`
4. Cek role di dashboard

---

**File Location**: `scripts/importKaryawan.ts`
**Database**: MongoDB (`qmb-ohs`)
**Safe to re-run**: ✅ Yes (upsert mode)
