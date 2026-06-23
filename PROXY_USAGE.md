# Proxy Configuration Guide

## Overview

Project ini menggunakan proxy configuration sederhana untuk Next.js terbaru yang memudahkan komunikasi dengan backend API.

## File Proxy

- **`src/lib/proxy.ts`** - Konfigurasi dan helper functions untuk proxy

## Konfigurasi Environment

Tambahkan ke file `.env.local`:

```env
# API Backend URL (opsional, default: http://localhost:3000)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Upload/Static Files URL (opsional, default: sama dengan API_URL)
NEXT_PUBLIC_UPLOAD_URL=http://localhost:3000

# Backend API eksternal untuk rewrites (opsional)
BACKEND_API_URL=http://api.backend.com
```

## Cara Penggunaan

### 1. Menggunakan Helper Function `proxyFetch`

```typescript
import { proxyFetch } from "@/lib/proxy";

// Fetch API request
const response = await proxyFetch("/api/users");
const data = await response.json();

// Dengan options
const response = await proxyFetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "John" }),
});
```

### 2. Menggunakan Standard Fetch dengan `buildProxyUrl`

```typescript
import { buildProxyUrl, proxyConfig } from "@/lib/proxy";

const url = buildProxyUrl("/api/users", proxyConfig.api);
const response = await fetch(url);
```

### 3. Mendapatkan Base URL

```typescript
import { getProxyBaseUrl } from "@/lib/proxy";

const apiUrl = getProxyBaseUrl("api");
// Returns: "http://localhost:3000"

const uploadUrl = getProxyBaseUrl("uploads");
// Returns: "http://localhost:3000"
```

## Contoh Implementasi

### Client Component

```tsx
"use client";

import { useState, useEffect } from "react";
import { proxyFetch } from "@/lib/proxy";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await proxyFetch("/api/users");
      const data = await response.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Server Component

```tsx
import { proxyFetch } from "@/lib/proxy";

export default async function UsersPage() {
  const response = await proxyFetch("/api/users");
  const users = await response.json();

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### API Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { proxyFetch } from "@/lib/proxy";

export async function GET(request: NextRequest) {
  try {
    // Forward request ke backend eksternal
    const response = await proxyFetch("/api/external-data");
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
```

## Next.js Rewrites

File `next.config.ts` sudah dikonfigurasi dengan rewrites untuk proxy di production:

```typescript
async rewrites() {
  const backendUrl = process.env.BACKEND_API_URL;
  
  if (backendUrl) {
    return [
      {
        source: "/api/external/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  }
  
  return [];
}
```

Dengan konfigurasi ini, request ke `/api/external/*` akan di-forward ke `BACKEND_API_URL`.

## CORS Headers

CORS headers sudah dikonfigurasi di `next.config.ts` untuk semua API routes (`/api/*`).

## Tips

1. **Development**: Gunakan `NEXT_PUBLIC_API_URL` untuk development
2. **Production**: Gunakan environment variables di platform hosting (Vercel, etc)
3. **External API**: Gunakan `BACKEND_API_URL` untuk rewrites ke backend eksternal
4. **Uploads**: Konfigurasi `NEXT_PUBLIC_UPLOAD_URL` jika upload server terpisah

## Troubleshooting

### CORS Error

Pastikan backend API mendukung CORS atau gunakan Next.js rewrites untuk bypass CORS.

### Connection Refused

Periksa:
1. Backend API sudah running
2. URL di environment variables benar
3. Port tidak di-block oleh firewall

### 502 Bad Gateway

Backend API tidak merespons atau down. Periksa status backend API.

## Migration dari Middleware

Project ini **tidak menggunakan middleware** karena Next.js terbaru merekomendasikan penggunaan:
- API Routes untuk server-side logic
- Rewrites untuk proxy di production
- Client-side fetch untuk client components

Jika perlu middleware untuk authentication, gunakan next-auth atau custom middleware terpisah.
