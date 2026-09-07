# C.R.A.C.K Frontend — SMK3 Web App

> **C**ompliance **R**isk **A**ssessment & **C**ontrol **K**nowledge  
> Aplikasi web Next.js untuk sistem manajemen K3 (Keselamatan dan Kesehatan Kerja)

Live Demo: [https://crack-fe-naz-ahtamir.vercel.app](https://crack-fe-naz-ahtamir.vercel.app/)

---

## Tech Stack

| Layer          | Teknologi                    |
|----------------|------------------------------|
| Framework      | Next.js 15 (App Router)      |
| Language       | TypeScript                   |
| Styling        | Tailwind CSS                 |
| Auth           | JWT (via AuthContext)        |
| HTTP Client    | Fetch API (native)           |
| State          | React Context + useState     |
| Runtime        | Bun                          |

---

## Quick Start

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.local.example .env.local  # lalu isi NEXT_PUBLIC_API_URL

# Development mode
bun run dev
```

App berjalan di `http://localhost:3000`

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Struktur Halaman

```
src/app/
├── login/                   # Halaman login
├── forgot-password/         # [Task 7] Request token reset password
├── reset-password/          # Redirect ke /change-password?token=...
├── change-password/         # [Task 8] Ganti password (dual mode)
├── admin/                   # [Task 5&6] Admin panel — user management
├── (authenticated)/
│   ├── dashboard/           # Dashboard KPI + Profile Card [Task 12]
│   ├── findings/            # Manajemen temuan K3
│   └── notifications/       # Notifikasi user
├── smk3/                    # SMK3 sub-element navigation
├── safety-compliance/       # Data kepatuhan K3
├── safety-competency/       # Data kompetensi
├── accident-prevention/     # Data pencegahan kecelakaan
└── admin/                   # Panel admin (user management)
```

---

## User Management Enhancement (Task 1–12)

### Task 1 — Soft Delete (Backend)
Endpoint backend: `PATCH /api/users/:id/deactivate` dan `/activate`

### Task 2 — Update Profil (Backend)
Endpoint backend: `PATCH /api/users/:id`

### Task 3 — Forgot Password Flow (Backend)
Endpoint backend: `POST /api/auth/forgot-password` dan `POST /api/auth/reset-password`

### Task 4 — Change Password (Backend)
Endpoint backend: `POST /api/users/:id/change-password`

### Task 5 — Admin: Soft Delete Toggle
Halaman `/admin` memiliki tombol toggle aktif/nonaktif di tiap baris user tabel.
- Klik ikon ⊘ → nonaktifkan user (`approved=false`)
- Klik ikon ✓ → aktifkan kembali user (`approved=true`)

### Task 6 — Admin: Edit Modal
Halaman `/admin` memiliki tombol edit (ikon pensil) yang membuka modal untuk mengupdate:
- Nama lengkap
- Jabatan
- Departemen
- Email

### Task 7 — Forgot Password Page

Halaman `/forgot-password`:
1. User masukkan ID Karyawan
2. Backend generate token reset (development: token tampil di response)
3. Success state menampilkan token dan tombol langsung ke `/reset-password?token=...`

```
/forgot-password → submit idKaryawan → /reset-password?token=xxx → /change-password (via redirect)
```

### Task 8 — Change Password Page (Dual Mode)

Halaman `/change-password` berjalan dalam dua mode berdasarkan query param `?token=`:

| Mode              | URL                              | Keterangan                      |
|-------------------|----------------------------------|---------------------------------|
| Reset via token   | `/change-password?token=abc123`  | Dari forgot-password flow       |
| Ganti sendiri     | `/change-password`               | User login ingin ganti password |

> Halaman `/reset-password?token=xxx` otomatis redirect ke `/change-password?token=xxx`

### Task 9 — Dokumentasi
README ini.

### Task 10 — Admin: Filter by Status

Halaman `/admin` memiliki tab filter:
- **Semua** — tampilkan semua user
- **Aktif** — hanya `approved=true`
- **Nonaktif** — hanya `approved=false`

Counter ditampilkan di tiap tab.

### Task 11 — Admin: Search User

Search bar di halaman `/admin` mencari secara real-time berdasarkan:
- Nama
- ID Karyawan
- Departemen
- Jabatan

### Task 12 — Dashboard: Profile Card

Profile Card muncul di halaman `/dashboard` tepat di bawah Page Header, menampilkan:
- Avatar dengan inisial nama
- Nama lengkap + role badge (warna berbeda per role)
- ID Karyawan, Departemen, Email
- Tombol **Ganti Password** → `/change-password`
- Tombol **Admin Panel** → `/admin` (hanya untuk role admin)

---

## Authentication Flow

```
Login → JWT token disimpan di localStorage
      → AuthContext decode token → set user state
      → isAuthenticated = true

Refresh halaman → token dibaca dari localStorage
                → decode JWT → restore user state

Logout → clear token → redirect ke /login
```

AuthContext tersedia via hook `useAuth()`:

```tsx
const { user, isAuthenticated, isLoading, login, logout } = useAuth();
```

User object:
```ts
{
  id: string
  idKaryawan: string
  nama: string
  role: 'admin' | 'supervisor' | 'user'
  departemen?: string
  email?: string
}
```

---

## API Proxy

Frontend Next.js meng-proxy semua request ke backend NestJS melalui route handler di `src/app/api/`:

| Frontend Route                        | Backend Target                                    |
|---------------------------------------|---------------------------------------------------|
| `GET /api/users`                      | `GET /api/auth/users`                             |
| `POST /api/users`                     | `POST /api/auth/bulk-create-users`                |
| `PUT /api/users`                      | `PATCH /api/auth/users/:id/role`                  |
| `GET /api/users/:id`                  | `GET /api/auth/users/:id`                         |
| `PATCH /api/users/:id`                | `PATCH /api/auth/users/:id`                       |
| `PATCH /api/users/:id/deactivate`     | `PATCH /api/auth/users/:id/deactivate`            |
| `PATCH /api/users/:id/activate`       | `PATCH /api/auth/users/:id/activate`              |
| `POST /api/users/:id/change-password` | `POST /api/auth/users/:id/change-password`        |
| `POST /api/auth/forgot-password`      | `POST /api/auth/forgot-password`                  |
| `POST /api/auth/reset-password`       | `POST /api/auth/reset-password`                   |

---

## Komponen Utama

| Komponen                  | Lokasi                                          | Keterangan                         |
|---------------------------|--------------------------------------------------|------------------------------------|
| `AuthContext`             | `src/contexts/AuthContext.tsx`                   | State management auth global       |
| `NotificationContext`     | `src/contexts/NotificationContext.tsx`           | Notifikasi polling & state         |
| `ProtectedRoute`          | `src/components/ProtectedRoute.tsx`              | Guard route untuk halaman auth     |
| `ProfileCard`             | `src/app/(authenticated)/dashboard/page.tsx`     | [Task 12] Profile user di dashboard|
| `EditUserModal`           | `src/app/admin/page.tsx`                         | [Task 6] Modal edit user           |
| `RecentFindings`          | `src/components/dashboard/RecentFindings.tsx`    | Widget temuan terbaru              |

---

## Default Password

Saat login pertama kali, password default adalah: `{idKaryawan}K3`

Contoh: ID Karyawan `82400469` → password `82400469K3`

Setelah login, segera ganti password melalui `/change-password`.
