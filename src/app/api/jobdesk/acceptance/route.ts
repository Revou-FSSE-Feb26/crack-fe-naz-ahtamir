// src/app/api/jobdesk/acceptance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

// Definisikan schema JobAcceptance (sementara di sini saja)
const JobAcceptanceSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  departemen: { type: String, required: true },
  jabatan: { type: String, required: true },
  jobdesk: { type: Object, required: true },
  signature: { type: String, required: true },
  acceptedAt: { type: Date, default: Date.now },
  userId: { type: String, default: "" },
});

// Hindari re-compile model jika sudah ada
const JobAcceptance = mongoose.models.JobAcceptance || mongoose.model("JobAcceptance", JobAcceptanceSchema);

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { nama, departemen, jabatan, jobdesk, signature, acceptedAt } = body;

    const newRecord = new JobAcceptance({
      nama,
      departemen,
      jabatan,
      jobdesk,
      signature,
      acceptedAt: new Date(acceptedAt),
      userId: session.user?.id || "",
    });

    await newRecord.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving job acceptance:", error);
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const records = await JobAcceptance.find({}).sort({ acceptedAt: -1 });
    return NextResponse.json({ records });
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}