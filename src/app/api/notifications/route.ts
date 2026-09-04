import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * GET /api/notifications?limit=10
 * Proxy ke NestJS backend — forward Authorization header dari klien.
 * userId diambil dari JWT di backend, bukan dari query param.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const qs = limit ? `?limit=${limit}` : "";

  try {
    const res = await fetch(`${BACKEND}/notifications${qs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      // Jangan cache — notifikasi harus selalu fresh
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[notifications/route] Backend unreachable:", error);
    return NextResponse.json([], { status: 200 });
  }
}
