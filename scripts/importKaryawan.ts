import { readFileSync } from "fs";
import { read, utils } from "xlsx";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import path from "path";

const filePath    = path.join(process.cwd(), "db-karyawan.xlsx");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/qmb-ohs";

// ── Whitelist ID yang dijadikan superadmin ──
const ADMIN_IDS: string[] = [
  "82400944", // Naz Ahtamir - Superadmin
];

// ── Keyword jabatan supervisor ──
// Semua yang jabatannya Wakil Foreman ke atas
const SUPERVISOR_KEYWORDS = [
  "wakil foreman",
  "副班长",
  "foreman",
  "班长",
  "supervisor",
  "manager",
  "superintendent",
  "kepala",
  "head",
  "chief",
];

function cleanText(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/\n/g, " ")   // hapus newline
    .replace(/\s+/g, " ")  // hapus spasi berlebih
    .trim();
}

function getRoleFromJabatan(
  idKaryawan: string,
  jabatan: string
): "user" | "supervisor" | "admin" {
  // Cek admin dulu
  if (ADMIN_IDS.includes(idKaryawan)) return "admin";
  
  // Cek supervisor berdasarkan jabatan
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

  console.log(`\n📊 Total karyawan di Excel: ${rows.length}\n`);

  let berhasil = 0;
  let gagal    = 0;
  let adminCount = 0;
  let supervisorCount = 0;

  for (const row of rows) {
    try {
      // Kolom dari Excel Anda
      const idKaryawan = cleanText(row["ID CARD\n工号"]);
      const nama       = cleanText(row["NAMA\n姓名"]);
      const jabatan    = cleanText(row["JABATAN\n岗位"]);
      const departemen = cleanText(row["DEPARTEMEN\n部门"]);

      // Skip jika ID kosong
      if (!idKaryawan || idKaryawan === "undefined" || idKaryawan.length < 5) {
        console.warn("⚠ Skip: ID kosong atau tidak valid");
        continue;
      }

      // Password: idKaryawan + "K3"
      // Contoh: 82400944 → password: 82400944K3
      const rawPassword    = `${idKaryawan}K3`;
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      const role           = getRoleFromJabatan(idKaryawan, jabatan);

      // Hitung role
      if (role === "admin") adminCount++;
      else if (role === "supervisor") supervisorCount++;

      // Upsert ke database
      await User.findOneAndUpdate(
        { idKaryawan },
        { 
          idKaryawan, 
          nama, 
          jabatan, 
          departemen, 
          password: hashedPassword, 
          role, 
          approved: true 
        },
        { upsert: true, new: true }
      );

      berhasil++;
      const roleIcon = role === "admin" ? "👑" : role === "supervisor" ? "👤" : "👨‍💼";
      console.log(`${roleIcon} ${idKaryawan} - ${nama} [${role.toUpperCase()}]`);
    } catch (err: any) {
      gagal++;
      console.error(`✗ Gagal import:`, err.message);
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 HASIL IMPORT:`);
  console.log(`${"=".repeat(50)}`);
  console.log(`  ✓ Total Berhasil  : ${berhasil}`);
  console.log(`  ✗ Total Gagal     : ${gagal}`);
  console.log(`  👑 Admin          : ${adminCount}`);
  console.log(`  👤 Supervisor     : ${supervisorCount}`);
  console.log(`  👨‍💼 User          : ${berhasil - adminCount - supervisorCount}`);
  console.log(`${"=".repeat(50)}`);
  console.log(`\n💡 Info Login:`);
  console.log(`   Username: [ID CARD]`);
  console.log(`   Password: [ID CARD]K3`);
  console.log(`   Contoh: 82400944 / 82400944K3\n`);

  await mongoose.disconnect();
  console.log("✓ Disconnected from MongoDB");
}

importKaryawan().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});