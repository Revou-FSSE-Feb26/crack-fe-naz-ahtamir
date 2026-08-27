import { NextRequest, NextResponse } from "next/server";

// In-memory notification store — no DB needed for this feature
let notificationsStore: any[] = [
  {
    id: "notif-1",
    userId: "user-1",
    type: "finding_submitted",
    title: "Finding Submitted",
    message: "Finding 'Electrical Hazard' telah disubmit",
    findingId: "finding-1",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "notif-2",
    userId: "user-1",
    type: "approval_required",
    title: "New Finding Requires Approval",
    message: "Finding baru memerlukan approval: 'Machine Safety Issue'",
    findingId: "finding-2",
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "notif-3",
    userId: "user-1",
    type: "finding_approved",
    title: "Finding Approved",
    message: "Finding 'Electrical Hazard' telah diapprove oleh Safety Supervisor",
    findingId: "finding-1",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// GET /api/notifications
export async function GET(request: NextRequest) {
  // Auth is handled by the NestJS backend; frontend passes the JWT in
  // Authorization header directly to /api/... calls. This Next.js route
  // is only used for in-memory demo notifications, so no session check needed.
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");

  const sorted = [...notificationsStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(sorted.slice(0, limit), { status: 200 });
}
