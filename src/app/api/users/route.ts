import { NextRequest, NextResponse } from "next/server";

/**
 * /api/users — thin proxy to NestJS backend.
 * MongoDB is no longer used here; all user data lives in PostgreSQL via NestJS.
 */

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function forwardHeaders(request: NextRequest): HeadersInit {
  const auth = request.headers.get("Authorization");
  return {
    "Content-Type": "application/json",
    ...(auth ? { Authorization: auth } : {}),
  };
}

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND}/users`, {
      headers: forwardHeaders(request),
    });
    const body = await res.json();
    return NextResponse.json(body, { status: res.status });
  } catch (err) {
    console.error("GET /api/users proxy error:", err);
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res  = await fetch(`${BACKEND}/users`, {
      method:  "POST",
      headers: forwardHeaders(request),
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("POST /api/users proxy error:", err);
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}

// PUT /api/users
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const res  = await fetch(`${BACKEND}/users`, {
      method:  "PUT",
      headers: forwardHeaders(request),
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("PUT /api/users proxy error:", err);
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}

// DELETE /api/users?id=...
export async function DELETE(request: NextRequest) {
  try {
    const id  = new URL(request.url).searchParams.get("id");
    const res = await fetch(`${BACKEND}/users${id ? `?id=${id}` : ""}`, {
      method:  "DELETE",
      headers: forwardHeaders(request),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("DELETE /api/users proxy error:", err);
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 });
  }
}
