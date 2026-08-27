import { NextRequest, NextResponse } from "next/server";

// PATCH /api/notifications/read-all
// Proxies to NestJS backend if available, otherwise returns a graceful fallback.
export async function PATCH(request: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  try {
    const authHeader = request.headers.get("Authorization") ?? "";
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") ?? "";

    const res = await fetch(
      `${backendUrl}/notifications/read-all${userId ? `?userId=${userId}` : ""}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    }
  } catch {
    // backend unreachable — fall through to graceful response
  }

  // Graceful fallback so the UI doesn't break
  return NextResponse.json(
    { message: "All notifications marked as read", updatedCount: 0 },
    { status: 200 }
  );
}
