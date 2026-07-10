import { readFileSync } from "fs";
import { read, utils } from "xlsx";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import path from "path";

const filePath    = path.join(process.cwd(), "scripts", "karyawan.xlsx");
const MONGODB_URI = "mongodb://localhost:27017/qmb-ohs";

// ── Whitelist ID yang dijadikan admin ──
// Ganti dengan ID karyawan yang mau dijadikan superadmin
const ADMIN_IDS: string[] = [
  // "82400944",
];

// ── Keyword jabatan supervisor ──
const SUPERVISOR_KEYWORDS = [
  "foreman",
  "wakil foreman",
  "副班长",
  "班长",
  "supervisor",
  "manager",
  "superintendent",
  "kepala",
  "head",
];

function cleanText(text: string): string {
  return String(text)
    .replace(/\n/g, " ")   // hapus newline
    .replace(/\s+/g, " ")  // hapus spasi berlebih
    .trim();
}

function getRoleFromJabatan(
  idKaryawan: string,
  jabatan: string
): "user" | "supervisor" | "admin" {
  if (ADMIN_IDS.includes(idKaryawan)) return "admin";
  const lower = jabatan.toLowerCase();
  if (SUPERVISOR_KEYWORDS.some(k => lower.includes(k))) return "supervisor";
  return "user";
}

async function importKaryawan() {
  await mongoose.connect(MONGODB_URI);
  console.log("✓ Connected to MongoDB");

  const UserSchema = new mongoose.Schema({
    idKaryawan:  { type: String, required: true, unique: true },
    nama:        { type: String, required: true },
    jabatan:     { type: String, required: true },
    departemen:  { type: String, required: true },
    password:    { type: String, required: true },
    role:        { type: String, enum: ["user", "supervisor", "admin"], default: "user" },
    approved:    { type: Boolean, default: true },
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const fileBuffer = readFileSync(filePath);
  const workbook   = read(fileBuffer, { type: "buffer" });
  const sheet      = workbook.Sheets[workbook.SheetNames[0]];
  const rows       = utils.sheet_to_json(sheet) as any[];

  console.log(`Total karyawan di Excel: ${rows.length}`);

  let berhasil = 0;
  let gagal    = 0;
  let supervisor = 0;

  for (const row of rows) {
    try {
      const idKaryawan = cleanText(row["ID Karyawan"]);
      const nama       = cleanText(row["Nama"]);
      const jabatan    = cleanText(row["Jabatan"]);
      const departemen = cleanText(row["Departemen"]);

      if (!idKaryawan || idKaryawan === "undefined") {
        console.warn("⚠ Skip baris kosong");
        continue;
      }

      const rawPassword    = `${idKaryawan}HSE`;
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      const role           = getRoleFromJabatan(idKaryawan, jabatan);

      if (role === "supervisor") supervisor++;

      await User.findOneAndUpdate(
        { idKaryawan },
        { idKaryawan, nama, jabatan, departemen, password: hashedPassword, role, approved: true },
        { upsert: true, new: true }
      );

      berhasil++;
      console.log(`✓ ${idKaryawan} - ${nama} [${role}]`);
    } catch (err) {
      gagal++;
      console.error(`✗ Gagal:`, row, err);
    }
  }

  console.log(`\n══════════════════════════════`);
  console.log(`Selesai import:`);
  console.log(`  ✓ Berhasil   : ${berhasil}`);
  console.log(`  ✗ Gagal      : ${gagal}`);
  console.log(`  👤 Supervisor : ${supervisor}`);
  console.log(`  👤 User       : ${berhasil - supervisor}`);
  console.log(`══════════════════════════════`);

  await mongoose.disconnect();
}

importKaryawan();