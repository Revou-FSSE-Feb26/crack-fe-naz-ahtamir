import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = "mongodb://localhost:27017/qmb-ohs";

async function resetAdminPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Hash password "admin123"
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Update user dengan idKaryawan "82400944"
    const result = await mongoose.connection.db!.collection("users").updateOne(
      { idKaryawan: "82400944" },
      { 
        $set: { 
          password: hashedPassword, 
          role: "admin", 
          approved: true,
          jabatan: "System Administrator",
          departemen: "IT"
        } 
      },
      { upsert: true }
    );

    if (result.matchedCount > 0) {
      console.log("✓ Password 82400944 berhasil di-reset");
    } else if (result.upsertedCount > 0) {
      console.log("✓ User 82400944 baru dibuat sebagai admin");
    }

    // Verifikasi
    const user = await mongoose.connection.db!.collection("users").findOne(
      { idKaryawan: "82400944" }
    );

    if (user) {
      console.log("\nUser admin 82400944 sekarang:");
      console.log("- ID Karyawan:", user.idKaryawan);
      console.log("- Nama:", user.nama || "(none)");
      console.log("- Jabatan:", user.jabatan);
      console.log("- Departemen:", user.departemen);
      console.log("- Role:", user.role);
      console.log("- Approved:", user.approved);
    }

    await mongoose.disconnect();
    console.log("\nDone! Login dengan ID: 82400944, Password: admin123");
  } catch (error) {
    console.error("Error:", error);
  }
}

resetAdminPassword();
