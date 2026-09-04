import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * PATCH /api/notifications/read-all
 * Proxy ke NestJS backend — forward Authorization header dari klien.
 * userId diambil dari JWT di backend.
 */
export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND}/notifications/read-all`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[notifications/read-all] Backend unreachable:", error);
    return NextResponse.json(
      { error: "Backend tidak dapat dijangkau" },
      { status: 503 }
    );
  }
}
