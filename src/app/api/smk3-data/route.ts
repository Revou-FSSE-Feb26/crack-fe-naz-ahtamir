import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth.config";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { SubSubElementData, FindingStatus } from "@/types/subSubElement";

// In-memory storage (replace with database in production)
let smk3DataStore: SubSubElementData[] = [];

// GET - Fetch data by subSubElementId
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const subSubElementId = searchParams.get("subSubElementId");
  const search = searchParams.get("search");
  const pendingApprovalOnly = searchParams.get("pendingApprovalOnly") === "true";

  let filteredData = smk3DataStore;

  if (subSubElementId) {
    filteredData = filteredData.filter(item => item.subSubElementId === subSubElementId);
  }

  if (pendingApprovalOnly) {
    filteredData = filteredData.filter(item => item.findingStatus === "pending_approval");
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      JSON.stringify(item.data).toLowerCase().includes(searchLower)
    );
  }

  return NextResponse.json(filteredData);
}

// POST - Create new data entry
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const subSubElementId = formData.get("subSubElementId") as string;
    const title = formData.get("title") as string;
    const findingStatus = (formData.get("findingStatus") as FindingStatus) || "INPG";
    const approvalNote = formData.get("approvalNote") as string | null;

    if (!subSubElementId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const data: Record<string, any> = {};
    const files: any[] = [];

    const uploadDir = path.join(
      process.cwd(), "public", "uploads", "smk3",
      subSubElementId.replace(/\./g, "-")
    );
    if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

    for (const [key, value] of formData.entries()) {
      if (["subSubElementId", "title", "findingStatus", "approvalNote"].includes(key)) continue;

      if (value instanceof File && value.size > 0) {
        const maxSize = 5 * 1024 * 1024;
        if (value.size > maxSize) {
          return NextResponse.json({ error: `File ${value.name} melebihi batas 5MB` }, { status: 400 });
        }
        const timestamp = Date.now();
        const fileName = `${timestamp}-${value.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const bytes = await value.arrayBuffer();
        await writeFile(path.join(uploadDir, fileName), Buffer.from(bytes));
        files.push({
          fieldName: key,
          fileName: value.name,
          fileUrl: `/uploads/smk3/${subSubElementId.replace(/\./g, "-")}/${fileName}`,
          fileSize: value.size,
          uploadedAt: new Date().toISOString(),
        });
      } else if (!(value instanceof File)) {
        data[key] = value;
      }
    }

    // Tentukan findingStatus final
    // CLSD → langsung simpan sebagai CLSD
    // INPG → simpan sebagai pending_approval, tunggu atasan
    const finalFindingStatus: FindingStatus =
      findingStatus === "CLSD" ? "CLSD" : "pending_approval";

    const approvalInfo =
      findingStatus === "INPG"
        ? {
            requestedAt: new Date().toISOString(),
            requestedBy: session.user.name || "Unknown",
            note: approvalNote || undefined,
          }
        : undefined;

    const newEntry: SubSubElementData = {
      id: String(Date.now()),
      subSubElementId,
      title,
      data,
      files,
      status: "active",
      findingStatus: finalFindingStatus,
      approval: approvalInfo,
      createdBy: session.user.name || "Unknown",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    smk3DataStore.push(newEntry);
    return NextResponse.json({ message: "Data berhasil disimpan", data: newEntry }, { status: 201 });
  } catch (error) {
    console.error("Error creating data:", error);
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}

// PATCH - Approval action (approve / reject) — khusus admin/atasan
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.role !== "admin" && session.user.role !== "supervisor") {
    return NextResponse.json({ error: "Forbidden: Hanya admin/atasan yang dapat menyetujui" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, action, approvalNote } = body as {
      id: string;
      action: "approve" | "reject";
      approvalNote?: string;
    };

    if (!id || !action) {
      return NextResponse.json({ error: "ID dan action diperlukan" }, { status: 400 });
    }

    const index = smk3DataStore.findIndex(item => item.id === id);
    if (index === -1) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });

    const entry = smk3DataStore[index];

    if (entry.findingStatus !== "pending_approval") {
      return NextResponse.json(
        { error: "Data ini tidak sedang menunggu persetujuan" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      smk3DataStore[index] = {
        ...entry,
        // Setelah diapprove, status temuan tetap INPG (belum ada perbaikan)
        findingStatus: "INPG",
        approval: {
          ...entry.approval!,
          approvedAt: new Date().toISOString(),
          approvedBy: session.user.name || "Unknown",
          approvalNote: approvalNote || undefined,
        },
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Reject → kembalikan ke pending_approval dengan info rejection
      // Submitter bisa revisi dan submit ulang
      smk3DataStore[index] = {
        ...entry,
        findingStatus: "pending_approval",
        approval: {
          ...entry.approval!,
          rejectedAt: new Date().toISOString(),
          rejectedBy: session.user.name || "Unknown",
          rejectionNote: approvalNote || undefined,
        },
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      message: action === "approve" ? "Temuan disetujui" : "Temuan ditolak",
      data: smk3DataStore[index],
    });
  } catch (error) {
    console.error("Error approval:", error);
    return NextResponse.json({ error: "Gagal memproses approval" }, { status: 500 });
  }
}

// PUT - Update data entry (Admin only)
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;

    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

    const index = smk3DataStore.findIndex(item => item.id === id);
    if (index === -1) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });

    const existingEntry = smk3DataStore[index];
    const data: Record<string, any> = {};
    const files: any[] = [...existingEntry.files];

    const uploadDir = path.join(
      process.cwd(), "public", "uploads", "smk3",
      existingEntry.subSubElementId.replace(/\./g, "-")
    );
    if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

    for (const [key, value] of formData.entries()) {
      if (["id", "subSubElementId", "title"].includes(key)) continue;

      if (value instanceof File && value.size > 0) {
        const maxSize = 5 * 1024 * 1024;
        if (value.size > maxSize) {
          return NextResponse.json({ error: `File ${value.name} melebihi batas 5MB` }, { status: 400 });
        }
        const timestamp = Date.now();
        const fileName = `${timestamp}-${value.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const bytes = await value.arrayBuffer();
        await writeFile(path.join(uploadDir, fileName), Buffer.from(bytes));

        const fileIndex = files.findIndex(f => f.fieldName === key);
        if (fileIndex !== -1) files.splice(fileIndex, 1);

        files.push({
          fieldName: key,
          fileName: value.name,
          fileUrl: `/uploads/smk3/${existingEntry.subSubElementId.replace(/\./g, "-")}/${fileName}`,
          fileSize: value.size,
          uploadedAt: new Date().toISOString(),
        });
      } else if (!(value instanceof File)) {
        data[key] = value;
      }
    }

    smk3DataStore[index] = {
      ...existingEntry,
      title: title || existingEntry.title,
      data,
      files,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ message: "Data berhasil diperbarui", data: smk3DataStore[index] });
  } catch (error) {
    console.error("Error updating data:", error);
    return NextResponse.json({ error: "Gagal memperbarui data" }, { status: 500 });
  }
}

// DELETE - Delete data entry (Admin only)
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

    const index = smk3DataStore.findIndex(item => item.id === id);
    if (index === -1) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });

    smk3DataStore.splice(index, 1);
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}
