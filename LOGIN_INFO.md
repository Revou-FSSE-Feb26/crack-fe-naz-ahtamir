# Informasi Login OHS Portal

## Kredensial Login Admin

Untuk akses sebagai **Administrator**:
- **ID Karyawan:** `admin`
- **Password:** `admin123`

## Cara Setup Admin

Jika admin belum dibuat di database, jalankan:

```bash
bun run create-admin
```

Script ini akan:
- Membuat user admin baru jika belum ada
- Update password admin jika sudah ada
- Set role sebagai "admin"
- Approve user secara otomatis

## Import Data Karyawan

Untuk import data karyawan dari Excel:

```bash
bun run import-karyawan
```

**Ketentuan:**
- File Excel harus bernama `karyawan.xlsx` dan ada di folder `scripts/`
- Header Excel harus: `ID Karyawan`, `Nama`, `Jabatan`, `Departemen`
- Password otomatis: `[ID_Karyawan]HSE`
  - Contoh: ID Karyawan `123456` → Password: `123456HSE`

## Sistem Roles

### 1. Admin
- Akses penuh ke sistem
- Dapat mengelola user (approve, reject, ubah role)
- Akses ke halaman `/admin`

### 2. Supervisor
- Ditentukan otomatis berdasarkan jabatan yang mengandung:
  - "foreman"
  - "wakil foreman"
  - "supervisor"
  - "manager"

### 3. User
- Role default untuk semua karyawan

## Approval System

- User baru yang dibuat admin perlu approval (approved: false)
- Admin dapat approve/reject di halaman `/admin`
- User yang diimport dari Excel otomatis approved

## Halaman Login

Akses login di: `http://localhost:3000/login`

## Troubleshooting

### Login Gagal
1. Pastikan MongoDB terhubung
2. Jalankan `bun run create-admin` untuk memastikan admin ada
3. Cek console browser dan terminal untuk error

### User Tidak Bisa Login
1. Pastikan user sudah approved (cek di `/admin`)
2. Pastikan ID Karyawan dan password benar
3. Password case-sensitive

### Lupa Password
Admin dapat reset password user dengan:
1. Login sebagai admin
2. Buka `/admin`
3. Delete user yang lupa password
4. Buat user baru dengan password baru
