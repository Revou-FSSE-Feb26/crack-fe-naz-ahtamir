import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/qmb-ohs";

async function addAdmin() {
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

  // Ganti data di bawah sesuai kebutuhan
  const idKaryawan = "82400944";
  const password   = await bcrypt.hash("taubah88", 10);

  await User.findOneAndUpdate(
    { idKaryawan },
    {
      idKaryawan,
      nama:       "Administrator",
      jabatan:    "System Administrator",
      departemen: "IT",
      password,
      role:       "admin",
      approved:   true,
    },
    { upsert: true, new: true }
  );

  console.log("✓ Admin berhasil dibuat");
  console.log("  ID Karyawan : 82400944");
  console.log("  Password    : taubah88");
  await mongoose.disconnect();
}

addAdmin();