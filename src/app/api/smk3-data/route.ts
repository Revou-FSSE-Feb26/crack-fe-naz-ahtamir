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
  const tanggalDari = searchParams.get("tanggalDari");
  const tanggalSampai = searchParams.get("tanggalSampai");
  const statusFilter = searchParams.get("status");
  const idKaryawan = searchParams.get("idKaryawan");

  let filteredData = smk3DataStore;

  if (subSubElementId) {
    filteredData = filteredData.filter(item => item.subSubElementId === subSubElementId);
  }

  // User biasa hanya bisa lihat data sendiri
  if (session.user.role === "user") {
    filteredData = filteredData.filter(item => item.createdById === (session.user as any).idKaryawan);
  }

  // Filter pendingApprovalOnly dihapus karena tidak ada lagi status pending_approval
  // Sekarang hanya ada OPEN, INPG, CLSD

  if (tanggalDari) {
    filteredData = filteredData.filter(item => {
      const itemDate = item.data.tanggalInspeksi || item.createdAt;
      return itemDate >= tanggalDari;
    });
  }

  if (tanggalSampai) {
    filteredData = filteredData.filter(item => {
      const itemDate = item.data.tanggalInspeksi || item.createdAt;
      return itemDate <= tanggalSampai;
    });
  }

  if (statusFilter) {
    filteredData = filteredData.filter(item => item.findingStatus === statusFilter);
  }

  if (idKaryawan) {
    filteredData = filteredData.filter(item => 
      item.createdById?.includes(idKaryawan) || 
      item.createdBy.toLowerCase().includes(idKaryawan.toLowerCase())
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      item.createdBy.toLowerCase().includes(searchLower) ||
      (item.createdById && item.createdById.toLowerCase().includes(searchLower)) ||
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
    const findingStatus = (formData.get("findingStatus") as FindingStatus) || "OPEN";
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

    // Simpan langsung dengan status yang dikirim (OPEN/INPG/CLSD)
    const newEntry: SubSubElementData = {
      id: String(Date.now()),
      subSubElementId,
      title,
      data,
      files,
      status: "active",
      findingStatus: findingStatus, // Langsung pakai OPEN/INPG/CLSD
      createdBy: session.user.name || "Unknown",
      createdById: (session.user as any).idKaryawan || undefined,
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

// PATCH - Approval action (approve / reject) atau submit_inpg
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, action, approvalNote } = body as {
      id: string;
      action: "approve" | "reject" | "submit_inpg";
      approvalNote?: string;
    };

    if (!id || !action) {
      return NextResponse.json({ error: "ID dan action diperlukan" }, { status: 400 });
    }

    const index = smk3DataStore.findIndex(item => item.id === id);
    if (index === -1) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });

    const entry = smk3DataStore[index];

    // Action: submit_inpg (user submit dari OPEN ke INPG)
    if (action === "submit_inpg") {
      if (entry.findingStatus !== "OPEN") {
        return NextResponse.json(
          { error: "Data ini sudah disubmit sebelumnya" },
          { status: 400 }
        );
      }

      smk3DataStore[index] = {
        ...entry,
        findingStatus: "INPG",
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        message: "Data berhasil disubmit dengan status INPG",
        data: smk3DataStore[index],
      });
    }

    // Action: approve / reject (hanya admin/supervisor untuk CLSD)
    // Workflow baru: INPG → CLSD dilakukan di page 7.1.7
    if (session.user.role !== "admin" && session.user.role !== "supervisor") {
      return NextResponse.json({ error: "Forbidden: Hanya admin/atasan yang dapat menutup temuan" }, { status: 403 });
    }

    if (entry.findingStatus !== "INPG") {
      return NextResponse.json(
        { error: "Hanya temuan dengan status INPG yang bisa ditutup (CLSD)" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Approve = CLSD (temuan sudah diperbaiki dan ditutup)
      smk3DataStore[index] = {
        ...entry,
        findingStatus: "CLSD",
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Reject = kembalikan ke INPG dengan catatan
      smk3DataStore[index] = {
        ...entry,
        findingStatus: "INPG",
        updatedAt: new Date().toISOString(),
      };
    }

    return NextResponse.json({
      message: action === "approve" ? "Temuan ditutup (CLSD)" : "Temuan dikembalikan ke INPG",
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
