export interface SubSubElementFormConfig {
  subSubElementId: string;
  fields: FormField[];
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "date" | "textarea" | "select" | "file";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  rows?: number;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export interface FileAttachment {
  fieldName: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

// Status lifecycle:
// INPG  → pending_approval → CLSD  (jika ada perbaikan, butuh approval)
// CLSD langsung submit tanpa approval
export type FindingStatus = "CLSD" | "INPG" | "pending_approval";

export interface ApprovalInfo {
  requestedAt: string;
  requestedBy: string;
  note?: string;
  approvedAt?: string;
  approvedBy?: string;
  approvalNote?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionNote?: string;
}

export interface SubSubElementData {
  id: string;
  subSubElementId: string;
  title: string;
  data: Record<string, any>;
  files: FileAttachment[];
  // status record-level (active/archived)
  status: string;
  // status temuan spesifik untuk inspeksi ketidaksesuaian
  findingStatus?: FindingStatus;
  approval?: ApprovalInfo;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}