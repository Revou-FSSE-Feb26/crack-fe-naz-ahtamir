import * as XLSX from "xlsx";
import * as bcrypt from "bcryptjs";
import mongoose from "mongoose";
import * as path from "path";

// @ts-ignore - __dirname available in Node.js
const scriptDir = __dirname;

// Paste model User langsung di sini karena script jalan di luar Next.js
const MONGODB_URI = "mongodb+srv://nasaruddinahtamir_db_user:n8pM44td13Gxc7AI@cluster0.ohvv5bg.mongodb.net/qmb-ohs?retryWrites=true&w=majority&appName=Cluster0";

// Jabatan yang termasuk supervisor
const SUPERVISOR_KEYWORDS = [
  "foreman",
  "wakil foreman",
  "supervisor",
  "manager",
];

function getRoleFromJabatan(jabatan: string): "user" | "supervisor" | "admin" {
  const lower = jabatan.toLowerCase();
  if (SUPERVISOR_KEYWORDS.some(k => lower.includes(k))) return "supervisor";
  return "user";
}

async function importKaryawan() {
  // 1. Connect ke MongoDB
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // 2. Baca file Excel
  // Ganti path sesuai lokasi file Excel kamu
  const filePath = path.join(scriptDir, "karyawan.xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet) as any[];

  console.log(`Total karyawan di Excel: ${rows.length}`);

  // 3. Definisikan model langsung
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

  let berhasil = 0;
  let gagal = 0;

  for (const row of rows) {
    try {
      // Sesuaikan nama kolom dengan header Excel kamu
      const idKaryawan  = String(row["ID Karyawan"]).trim();
      const nama        = String(row["Nama"]).trim();
      const jabatan     = String(row["Jabatan"]).trim();
      const departemen  = String(row["Departemen"]).trim();

      // Password: IDKaryawan + "HSE"
      const rawPassword = `${idKaryawan}HSE`;
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const role = getRoleFromJabatan(jabatan);

      // Upsert — kalau sudah ada update, kalau belum ada insert
      await User.findOneAndUpdate(
        { idKaryawan },
        { idKaryawan, nama, jabatan, departemen, password: hashedPassword, role, approved: true },
        { upsert: true, new: true }
      );

      berhasil++;
      console.log(`✓ ${idKaryawan} - ${nama} (${role})`);
    } catch (err) {
      gagal++;
      console.error(`✗ Gagal import baris:`, row, err);
    }
  }

  console.log(`\nSelesai: ${berhasil} berhasil, ${gagal} gagal`);
  await mongoose.disconnect();
}

importKaryawan();