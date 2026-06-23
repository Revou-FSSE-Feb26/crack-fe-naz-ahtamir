# Contoh Penggunaan Proxy & API Client

## Quick Start

### 1. Menggunakan API Client (Recommended)

```typescript
import { api } from "@/lib/api";

// GET request
const { data, error } = await api.get("/api/users");
if (error) {
  console.error(error);
} else {
  console.log(data);
}

// POST request
const { data, error } = await api.post("/api/users", {
  name: "John Doe",
  email: "john@example.com"
});

// PUT request
const { data, error } = await api.put("/api/users/123", {
  name: "Jane Doe"
});

// DELETE request
const { data, error } = await api.delete("/api/users/123");

// Upload file
const formData = new FormData();
formData.append("file", file);
const { data, error } = await api.upload("/api/upload", formData);
```

### 2. Menggunakan Convenience Functions

```typescript
import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from "@/lib/api";

// GET
const { data } = await apiGet("/api/users");

// POST
const { data } = await apiPost("/api/users", { name: "John" });

// PUT
const { data } = await apiPut("/api/users/123", { name: "Jane" });

// DELETE
const { data } = await apiDelete("/api/users/123");

// Upload
const formData = new FormData();
formData.append("file", file);
const { data } = await apiUpload("/api/upload", formData);
```

## Contoh Praktis dalam Component

### Client Component - Fetch Data

```tsx
"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const { data, error } = await api.get<User[]>("/api/users");
      
      if (error) {
        setError(error);
      } else {
        setUsers(data || []);
      }
      
      setLoading(false);
    }
    
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Users</h1>
      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
```

### Client Component - Form Submit

```tsx
"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

export default function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { data, error: apiError } = await apiPost("/api/users", {
      name,
      email,
    });

    if (apiError) {
      setError(apiError);
    } else {
      // Success! Reset form
      setName("");
      setEmail("");
      alert("User created successfully!");
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create User"}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### Client Component - File Upload

```tsx
"use client";

import { useState } from "react";
import { apiUpload } from "@/lib/api";

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "documents");

    const { data, error: apiError } = await apiUpload<{ url: string }>(
      "/api/upload",
      formData
    );

    if (apiError) {
      setError(apiError);
    } else if (data) {
      setUploadedUrl(data.url);
      alert("File uploaded successfully!");
    }

    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />
      <button type="submit" disabled={uploading || !file}>
        {uploading ? "Uploading..." : "Upload File"}
      </button>
      {error && <div className="error">{error}</div>}
      {uploadedUrl && (
        <div>
          Uploaded: <a href={uploadedUrl}>{uploadedUrl}</a>
        </div>
      )}
    </form>
  );
}
```

### Server Component

```tsx
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

export default async function UsersPage() {
  const { data: users, error } = await api.get<User[]>("/api/users");

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Users</h1>
      {users?.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
```

### API Route Handler

```typescript
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";

// GET handler
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const { data, error } = await api.get(`/api/external/users/${id}`);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST handler
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, error } = await api.post("/api/external/users", body);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
```

## Custom Hooks untuk React

### useApi Hook

```typescript
// src/hooks/useApi.ts
import { useState, useEffect } from "react";
import { api, ApiResponse } from "@/lib/api";

export function useApi<T>(path: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await api.get<T>(path, options);
      
      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data || null);
      }
      
      setLoading(false);
    }

    fetchData();
  }, [path]);

  return { data, loading, error };
}
```

Penggunaan:

```tsx
"use client";

import { useApi } from "@/hooks/useApi";

export default function UsersPage() {
  const { data: users, loading, error } = useApi<User[]>("/api/users");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Error Handling Best Practices

```typescript
import { api } from "@/lib/api";

async function handleApiCall() {
  try {
    const { data, error, status } = await api.post("/api/users", userData);

    if (error) {
      // Handle different error types
      switch (status) {
        case 400:
          alert("Invalid data provided");
          break;
        case 401:
          alert("Please login");
          break;
        case 403:
          alert("You don't have permission");
          break;
        case 404:
          alert("Resource not found");
          break;
        case 500:
          alert("Server error, please try again");
          break;
        default:
          alert(error);
      }
      return;
    }

    // Success
    console.log("Success:", data);
  } catch (err) {
    // Network error or other unexpected errors
    console.error("Unexpected error:", err);
    alert("Network error, please check your connection");
  }
}
```

## TypeScript Tips

### Typed API Response

```typescript
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserResponse {
  user: User;
  message: string;
}

async function createUser(userData: Partial<User>) {
  const { data, error } = await api.post<CreateUserResponse>(
    "/api/users",
    userData
  );

  if (error) {
    throw new Error(error);
  }

  return data;
}
```

## Migrasi dari Fetch Biasa

### Before (Fetch biasa)

```typescript
const response = await fetch("/api/users");
const data = await response.json();
```

### After (Dengan API Client)

```typescript
const { data } = await api.get("/api/users");
```

### Before (Fetch dengan error handling)

```typescript
try {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  return data;
} catch (error) {
  console.error(error);
}
```

### After (Dengan API Client)

```typescript
const { data, error } = await api.post("/api/users", userData);

if (error) {
  console.error(error);
  return;
}

return data;
```

Lebih simple dan clean! 🚀
