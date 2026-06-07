import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth.config";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// In-memory storage (replace with database in production)
interface KebijakanK3 {
  id: string;
  title: string;
  tanggalPenetapan: string;
  penandatangan: string;
  jabatan: string;
  nomorDokumen: string;
  deskripsi: string;
  fileUrl: string;
  fileName: string;
  status: "draft" | "active" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

let kebijakanData: KebijakanK3[] = [];

// GET - Fetch all kebijakan
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(kebijakanData);
}

// POST - Create new kebijakan with file upload
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const tanggalPenetapan = formData.get("tanggalPenetapan") as string;
    const penandatangan = formData.get("penandatangan") as string;
    const jabatan = formData.get("jabatan") as string;
    const nomorDokumen = formData.get("nomorDokumen") as string;
    const deskripsi = formData.get("deskripsi") as string;

    if (!file || !title || !tanggalPenetapan || !penandatangan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", "kebijakan");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create new kebijakan entry
    const newKebijakan: KebijakanK3 = {
      id: String(Date.now()),
      title,
      tanggalPenetapan,
      penandatangan,
      jabatan,
      nomorDokumen,
      deskripsi,
      fileUrl: `/uploads/kebijakan/${fileName}`,
      fileName: file.name,
      status: "active",
      createdBy: session.user.name || "Unknown",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    kebijakanData.push(newKebijakan);

    return NextResponse.json(
      { message: "Kebijakan created successfully", data: newKebijakan },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating kebijakan:", error);
    return NextResponse.json(
      { error: "Failed to create kebijakan" },
      { status: 500 }
    );
  }
}

// PUT - Update kebijakan
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const tanggalPenetapan = formData.get("tanggalPenetapan") as string;
    const penandatangan = formData.get("penandatangan") as string;
    const jabatan = formData.get("jabatan") as string;
    const nomorDokumen = formData.get("nomorDokumen") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const file = formData.get("file") as File | null;

    const index = kebijakanData.findIndex((k) => k.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Kebijakan not found" }, { status: 404 });
    }

    let fileUrl = kebijakanData[index].fileUrl;
    let fileName = kebijakanData[index].fileName;

    // If new file is uploaded
    if (file && file.size > 0) {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Only PDF files are allowed" },
          { status: 400 }
        );
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads", "kebijakan");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const timestamp = Date.now();
      const newFileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(uploadDir, newFileName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      fileUrl = `/uploads/kebijakan/${newFileName}`;
      fileName = file.name;
    }

    // Update kebijakan
    kebijakanData[index] = {
      ...kebijakanData[index],
      title,
      tanggalPenetapan,
      penandatangan,
      jabatan,
      nomorDokumen,
      deskripsi,
      fileUrl,
      fileName,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      message: "Kebijakan updated successfully",
      data: kebijakanData[index],
    });
  } catch (error) {
    console.error("Error updating kebijakan:", error);
    return NextResponse.json(
      { error: "Failed to update kebijakan" },
      { status: 500 }
    );
  }
}

// DELETE - Delete kebijakan
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const index = kebijakanData.findIndex((k) => k.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Kebijakan not found" }, { status: 404 });
    }

    kebijakanData.splice(index, 1);

    return NextResponse.json({ message: "Kebijakan deleted successfully" });
  } catch (error) {
    console.error("Error deleting kebijakan:", error);
    return NextResponse.json(
      { error: "Failed to delete kebijakan" },
      { status: 500 }
    );
  }
}
