import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  idKaryawan: string;
  nama: string;
  jabatan: string;
  departemen: string;
  password: string;
  role: "user" | "supervisor" | "admin";
  approved: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    idKaryawan: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    jabatan: {
      type: String,
      required: true,
    },
    departemen: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "supervisor", "admin"],
      default: "user",
    },
    approved: {
      type: Boolean,
      default: true, // langsung approved karena diimport dari data resmi
    },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);