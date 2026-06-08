import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://nasaruddinahtamir_db_user:n8pM44td13Gxc7AI@cluster0.ohvv5bg.mongodb.net/qmb-ohs?retryWrites=true&w=majority&appName=Cluster0";

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB!");

    // Definisi schema user
    const UserSchema = new mongoose.Schema({
      idKaryawan: { type: String, required: true, unique: true },
      nama: { type: String, required: true },
      jabatan: { type: String, required: true },
      departemen: { type: String, required: true },
      password: { type: String, required: true },
      role: { type: String, enum: ["user", "supervisor", "admin"], default: "user" },
      approved: { type: Boolean, default: true },
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    // Cek apakah admin sudah ada
    const existingAdmin = await User.findOne({ idKaryawan: "admin" });

    if (existingAdmin) {
      console.log("User admin sudah ada!");
      console.log("Data admin:");
      console.log(`  ID: ${existingAdmin.idKaryawan}`);
      console.log(`  Nama: ${existingAdmin.nama}`);
      console.log(`  Role: ${existingAdmin.role}`);
      console.log(`  Approved: ${existingAdmin.approved}`);

      // Update password admin
      const newPassword = "admin123";
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.updateOne(
        { idKaryawan: "admin" },
        { 
          $set: { 
            password: hashedPassword,
            approved: true 
          } 
        }
      );

      console.log(`\n✅ Password admin berhasil di-update ke: ${newPassword}`);
      console.log("Login dengan:");
      console.log("  ID Karyawan: admin");
      console.log("  Password: admin123");
    } else {
      // Buat user admin baru
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const admin = new User({
        idKaryawan: "admin",
        nama: "Administrator",
        jabatan: "System Administrator",
        departemen: "IT",
        password: hashedPassword,
        role: "admin",
        approved: true,
      });

      await admin.save();

      console.log("\n✅ User admin berhasil dibuat!");
      console.log("Login dengan:");
      console.log("  ID Karyawan: admin");
      console.log("  Password: admin123");
    }

    await mongoose.disconnect();
    console.log("\nDone!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

createAdmin();
