import mongoose, { Schema, Document } from "mongoose";

export interface IFinding extends Document {
  subSubElementId: string;
  title: string;
  data: Record<string, any>;
  files: Array<{
    fieldName: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    uploadedAt: string;
  }>;
  findingStatus: "pending_approval" | "INPG" | "CLSD";
  approval?: {
    requestedAt?: string;
    requestedBy?: string;
    requestedById?: string;
    note?: string;
    approvedAt?: string;
    approvedBy?: string;
    rejectedAt?: string;
    rejectedBy?: string;
    rejectionNote?: string;
  };
  createdBy: string;       // nama
  createdById: string;     // idKaryawan
  createdAt: Date;
  updatedAt: Date;
}

const FindingSchema = new Schema<IFinding>(
  {
    subSubElementId: { type: String, required: true },
    title:           { type: String, required: true },
    data:            { type: Schema.Types.Mixed, default: {} },
    files:           { type: Schema.Types.Mixed, default: [] },
    findingStatus: {
      type: String,
      enum: ["pending_approval", "INPG", "CLSD"],
      default: "pending_approval",
    },
    approval:    { type: Schema.Types.Mixed },
    createdBy:   { type: String, required: true },
    createdById: { type: String, required: true },
  },
  { timestamps: true }
);

export const Finding =
  mongoose.models.Finding ||
  mongoose.model<IFinding>("Finding", FindingSchema);