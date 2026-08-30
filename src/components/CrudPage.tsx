'use client';

/**
 * CrudPage — template reusable untuk semua 31 halaman CRUD
 * Safety Compliance / Accident Prevention / Safety Competency
 *
 * Fitur:
 *  - Tabel dengan search realtime
 *  - Modal tambah / edit record (role: semua user)
 *  - Detail view (slide-over panel)
 *  - Hapus record (role: admin only)
 *  - Toast notification
 *  - Upload file (PDF, gambar, dll)
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { recordsApi, k3PolicyApi, findingsApi, SafetyRecord } from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CrudField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'number' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  /** Apakah ditampilkan sebagai kolom di tabel */
  showInTable?: boolean;
  /** Apakah ditampilkan di panel detail */
  showInDetail?: boolean;
  /** Untuk tipe file: ekstensi yang diizinkan, misal '.pdf,.docx' */
  accept?: string;
  /**
   * Conditional display — field hanya muncul jika field lain punya value tertentu.
   * Contoh: { field: 'tipeTemuan', value: 'hazard' }
   */
  showWhen?: { field: string; value: string };
}

export interface CrudPageConfig {
  /** ID unik yang dipakai sebagai subElementId di backend */
  categoryId: string;
  /** Judul halaman */
  title: string;
  /** Sub-judul / deskripsi */
  description: string;
  /** Breadcrumb label induk, mis. "Safety Compliance" */
  parentLabel: string;
  /** Fields form & tabel */
  fields: CrudField[];
  /**
   * Jika true: aktifkan sistem approval INPG/CLSD.
   * - Semua record baru masuk dengan status INPG (In Progress — menunggu approval atasan).
   * - Supervisor/admin dapat menutup temuan (→ CLSD) dari detail panel.
   * - User biasa tidak bisa mengubah status sendiri.
   */
  enableApproval?: boolean;
}

// ── Helper ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function Badge({ value }: { value: string }) {
  const map: Record<string, string> = {
    memenuhi: 'bg-green-100 text-green-700',
    aktif: 'bg-green-100 text-green-700',
    selesai: 'bg-green-100 text-green-700',
    'tidak memenuhi': 'bg-red-100 text-red-700',
    kadaluarsa: 'bg-red-100 text-red-700',
    open: 'bg-red-100 text-red-700',
    'dalam proses': 'bg-amber-100 text-amber-700',
    'sebagian memenuhi': 'bg-amber-100 text-amber-700',
    'akan kadaluarsa': 'bg-amber-100 text-amber-700',
    ditutup: 'bg-[#e5e0db] text-[#6b6560]',
  };
  const cls = map[value?.toLowerCase()] ?? 'bg-[#e5e0db] text-[#6b6560]';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
      {value}
    </span>
  );
}

function ApprovalBadge({ status }: { status: 'INPG' | 'CLSD' | string }) {
  if (status === 'CLSD') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        CLSD — Closed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      INPG — Pending Approval
    </span>
  );
}

// ── Form Modal ────────────────────────────────────────────────────────────────

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (v: { title: string; data: Record<string, string> }) => Promise<void>;
  onSubmitFormData: (formData: FormData) => Promise<void>;
  fields: CrudField[];
  modalTitle: string;
  initialValues?: { title: string; data: Record<string, any> } | null;
  /** Jika true: tidak perlu field 'title', dan kirim flat fields ke backend */
  isK3Policy?: boolean;
  /** Jika true: mode approval — record selalu mulai INPG, judul diambil dari field data */
  enableApproval?: boolean;
}

function FormModal({
  isOpen,
  onClose,
  onSubmit,
  onSubmitFormData,
  fields,
  modalTitle,
  initialValues,
  isK3Policy = false,
  enableApproval = false,
}: FormModalProps) {
  const [title, setTitle] = useState('');
  const [data, setData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  // Support multiple file fields (dokumentasiHazard, dokumentasiPerbaikan, etc.)
  const [files, setFiles] = useState<Record<string, File>>({});
  // Legacy single-file support
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialValues?.title ?? '');
      const d: Record<string, string> = {};
      fields.forEach((f) => {
        if (isK3Policy && f.type === 'file') {
          d[f.key] = String((initialValues?.data as any)?.fileUrl ?? '');
        } else {
          d[f.key] = String(initialValues?.data?.[f.key] ?? '');
        }
      });
      setData(d);
      setErrors({});
      setFile(null);
      setFiles({});
      setFilePreview(null);
    }
  }, [isOpen, initialValues, fields, isK3Policy]);

  // ── showWhen evaluation ──
  const isFieldVisible = (f: CrudField): boolean => {
    if (!f.showWhen) return true;
    return data[f.showWhen.field] === f.showWhen.value;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    // K3 Policy dan approval pages tidak punya field 'title' terpisah
    if (!isK3Policy && !enableApproval && !title.trim()) {
      e.title = 'Judul tidak boleh kosong';
    }
    fields.forEach((f) => {
      // Jangan validasi field yang disembunyikan oleh showWhen
      if (!isFieldVisible(f)) return;
      if (f.required && f.type !== 'file' && !data[f.key]?.trim()) {
        e[f.key] = `${f.label} wajib diisi`;
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (isK3Policy) {
        // K3 Policy: flat fields sebagai FormData
        const formData = new FormData();
        fields.forEach((f) => {
          if (f.type === 'file') return;
          if (data[f.key] !== undefined && data[f.key] !== '') {
            formData.append(f.key, data[f.key]);
          }
        });
        if (file) formData.append('file', file);
        await onSubmitFormData(formData);

      } else if (enableApproval) {
        // Approval mode: kirim sebagai FormData — backend expects subElementId + title + data + files
        const formData = new FormData();
        // Auto-generate title dari field pertama yang terisi, atau dari deskripsi
        const autoTitle =
          data['deskripsiKetidaksesuaian'] ||
          data['judulKebijakan'] ||
          data['areaInspeksiSpesifik'] ||
          data['lokasiUtama'] ||
          'Record Baru';
        formData.append('title', autoTitle.slice(0, 120));
        formData.append('data', JSON.stringify(
          // Hanya sertakan field yang visible (respek showWhen)
          Object.fromEntries(
            Object.entries(data).filter(([k]) => {
              const field = fields.find((f) => f.key === k);
              return field ? isFieldVisible(field) : true;
            })
          )
        ));
        // Append semua files (dokumentasiHazard, dokumentasiPerbaikan, dst.)
        Object.entries(files).forEach(([fieldKey, fileObj]) => {
          formData.append(fieldKey, fileObj);
        });
        // findingStatus selalu INPG untuk record baru
        formData.append('findingStatus', 'INPG');
        await onSubmitFormData(formData);

      } else if (Object.keys(files).length > 0 || file) {
        // Generic record dengan file
        const formData = new FormData();
        formData.append('title', title);
        formData.append('data', JSON.stringify(data));
        if (file) formData.append('file', file);
        Object.entries(files).forEach(([k, f]) => formData.append(k, f));
        await onSubmitFormData(formData);

      } else {
        // Generic record tanpa file
        await onSubmit({ title: title.trim(), data });
      }
      onClose();
    } catch (err: any) {
      // error sudah dihandle di parent via showToast
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (fieldKey: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    // Support multiple file fields
    setFiles((prev) => ({ ...prev, [fieldKey]: selected }));
    // Legacy single-file preview
    setFile(selected);
    if (selected.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(selected));
    } else {
      setFilePreview(null);
    }
  };

  if (!isOpen) return null;

  // Fields yang perlu dirender — filter showWhen secara reaktif
  const visibleFields = fields.filter(isFieldVisible);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e0db] flex-shrink-0">
          <h2 className="font-bold text-[15px] text-[#231f20]">{modalTitle}</h2>
          <button onClick={onClose} className="text-[#6b6560] hover:text-[#231f20] p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Approval mode notice */}
        {enableApproval && (
          <div className="mx-6 mt-4 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-700 flex items-start gap-2 flex-shrink-0">
            <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>Record baru akan masuk status <strong>INPG — Pending Approval</strong>. Supervisor/admin perlu menutup temuan setelah perbaikan selesai.</span>
          </div>
        )}

        {/* body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Judul Record — hanya untuk generic pages */}
          {!isK3Policy && !enableApproval && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-[#231f20] mb-1.5">
                Judul Record <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul singkat yang mendeskripsikan record ini"
                className={`w-full px-3.5 py-2.5 text-[14px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f15a22]/30 focus:border-[#f15a22] transition-colors ${
                  errors.title ? 'border-red-400 bg-red-50' : 'border-[#c5c0bb]'
                }`}
              />
              {errors.title && <p className="text-red-500 text-[11px] mt-1">{errors.title}</p>}
            </div>
          )}

          {/* Dynamic fields — hanya render field yang visible (showWhen) */}
          {fields.map((f) => {
            // Evaluasi showWhen — sembunyikan field jika kondisi tidak terpenuhi
            if (!isFieldVisible(f)) return null;

            return (
              <div key={f.key}>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-[#231f20] mb-1.5">
                  {f.label}
                  {f.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>

                {f.type === 'textarea' && (
                  <textarea
                    rows={3}
                    value={data[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => setData((p) => ({ ...p, [f.key]: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 text-[14px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f15a22]/30 focus:border-[#f15a22] transition-colors resize-none ${
                      errors[f.key] ? 'border-red-400 bg-red-50' : 'border-[#c5c0bb]'
                    }`}
                  />
                )}

                {f.type === 'select' && (
                  <select
                    value={data[f.key] ?? ''}
                    onChange={(e) => setData((p) => ({ ...p, [f.key]: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 text-[14px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f15a22]/30 focus:border-[#f15a22] transition-colors ${
                      errors[f.key] ? 'border-red-400 bg-red-50' : 'border-[#c5c0bb]'
                    }`}
                  >
                    <option value="">-- Select {f.label} --</option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                )}

                {f.type === 'file' && (
                  <div>
                    <input
                      type="file"
                      accept={f.accept || '.pdf,.doc,.docx,.jpg,.jpeg,.png'}
                      onChange={handleFileChange(f.key)}
                      className="w-full px-3.5 py-2.5 text-[14px] border border-[#c5c0bb] rounded-xl file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#f15a22] file:text-white hover:file:bg-[#d44d1a] focus:outline-none"
                    />
                    {/* Image preview untuk file yang baru dipilih */}
                    {files[f.key] && files[f.key].type.startsWith('image/') && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(files[f.key])}
                          alt="Preview"
                          className="max-h-24 rounded-lg border border-[#e5e0db] object-cover"
                        />
                      </div>
                    )}
                    {/* Tampilkan link file existing saat edit */}
                    {data[f.key] && !files[f.key] && (
                      <p className="text-[11px] text-[#6b6560] mt-1">
                        File saat ini:{' '}
                        <a href={data[f.key]} target="_blank" rel="noopener noreferrer"
                          className="text-[#f15a22] hover:underline">
                          Lihat file
                        </a>
                      </p>
                    )}
                  </div>
                )}

                {f.type !== 'textarea' && f.type !== 'select' && f.type !== 'file' && (
                  <input
                    type={f.type}
                    value={data[f.key] ?? ''}
                    placeholder={f.placeholder}
                    onChange={(e) => setData((p) => ({ ...p, [f.key]: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 text-[14px] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f15a22]/30 focus:border-[#f15a22] transition-colors ${
                      errors[f.key] ? 'border-red-400 bg-red-50' : 'border-[#c5c0bb]'
                    }`}
                  />
                )}

                {errors[f.key] && <p className="text-red-500 text-[11px] mt-1">{errors[f.key]}</p>}
              </div>
            );
          })}
        </form>

        {/* footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e0db] flex-shrink-0">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-[13px] font-semibold text-[#231f20] bg-[#f1f0ee] rounded-xl hover:bg-[#e5e0db] transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={(e) => handleSubmit(e as any)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-[#f15a22] rounded-xl hover:bg-[#d44d1a] transition-colors disabled:opacity-60"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Menyimpan...
              </>
            ) : (
              <>{initialValues ? 'Simpan Perubahan' : 'Tambah Record'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

interface DetailPanelProps {
  record: SafetyRecord | null;
  fields: CrudField[];
  onClose: () => void;
  onEdit: () => void;
  isAdmin: boolean;
  onDelete: () => void;
  isK3Policy?: boolean;
  enableApproval?: boolean;
  isSupervisor?: boolean;
  onApprove?: (id: string) => Promise<void>;
}

function DetailPanel({
  record, fields, onClose, onEdit, isAdmin, onDelete,
  isK3Policy = false, enableApproval = false, isSupervisor = false, onApprove,
}: DetailPanelProps) {
  const [approving, setApproving] = useState(false);

  if (!record) return null;

  const findingStatus = (record as any).findingStatus as string | undefined;
  const isInpg = findingStatus === 'INPG';
  const canApprove = enableApproval && isSupervisor && isInpg && onApprove;

  const handleApprove = async () => {
    if (!onApprove) return;
    if (!confirm('Tutup temuan ini sebagai CLSD? Pastikan perbaikan sudah selesai.')) return;
    setApproving(true);
    try {
      await onApprove(record.id);
      onClose();
    } finally {
      setApproving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[450] transition-opacity duration-300" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[460] flex flex-col transition-transform duration-300 translate-x-0">
        {/* header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#e5e0db] flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#f15a22] mb-1">Detail Record</p>
            <h3 className="font-bold text-[16px] text-[#231f20] leading-snug">
              {isK3Policy ? (record as any).judulKebijakan : record.title}
            </h3>
            {/* Approval status badge */}
            {enableApproval && findingStatus && (
              <div className="mt-2">
                <ApprovalBadge status={findingStatus} />
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-[#6b6560] hover:text-[#231f20] flex-shrink-0 p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#a09b96] mb-0.5">Dibuat Oleh</p>
              <p className="text-[#231f20] font-medium">
                {isK3Policy ? (record as any).createdBy?.nama : record.createdByName || '—'}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#a09b96] mb-0.5">Tanggal Dibuat</p>
              <p className="text-[#231f20] font-medium">{formatDate(record.createdAt)}</p>
            </div>
            {/* Approval info */}
            {enableApproval && findingStatus === 'CLSD' && (record as any).approvedByName && (
              <>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#a09b96] mb-0.5">Disetujui Oleh</p>
                  <p className="text-green-700 font-semibold">{(record as any).approvedByName}</p>
                </div>
                {(record as any).approvedAt && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#a09b96] mb-0.5">Tanggal Ditutup</p>
                    <p className="text-[#231f20] font-medium">{formatDate((record as any).approvedAt)}</p>
                  </div>
                )}
              </>
            )}
            {record.updatedAt && record.updatedAt !== record.createdAt && (
              <div className="col-span-2">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#a09b96] mb-0.5">Terakhir Diubah</p>
                <p className="text-[#231f20]">{formatDate(record.updatedAt)}</p>
              </div>
            )}
          </div>

          <hr className="border-[#e5e0db]" />

          {/* Approval note jika ada */}
          {enableApproval && (record as any).approvalNote && (
            <div className="px-4 py-3 bg-green-50 rounded-xl border border-green-200">
              <p className="text-[11px] font-bold uppercase tracking-wide text-green-700 mb-1">Catatan Penutupan</p>
              <p className="text-[13px] text-green-800">{(record as any).approvalNote}</p>
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            {fields
              .filter((f) => f.showInDetail !== false)
              .map((f) => {
                const rawVal = isK3Policy
                  ? (record as any)[f.key] ?? (record as any)['fileUrl']
                  : record.data?.[f.key];
                const val = (isK3Policy && f.type === 'file') ? (record as any)['fileUrl'] : rawVal;

                if (!val) return null;
                const isStatusField = f.key.toLowerCase().includes('status');
                const isFile = f.type === 'file';
                const fileHref = isK3Policy && isFile
                  ? `http://localhost:3001${String(val)}`
                  : String(val);

                return (
                  <div key={f.key}>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#a09b96] mb-0.5">{f.label}</p>
                    {isStatusField ? (
                      <Badge value={String(val)} />
                    ) : isFile ? (
                      <a href={fileHref} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#f15a22] hover:underline text-[13px] font-medium">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        View File / Photo
                      </a>
                    ) : f.type === 'textarea' ? (
                      <p className="text-[#231f20] text-[13px] leading-relaxed whitespace-pre-wrap">{String(val)}</p>
                    ) : f.type === 'date' ? (
                      <p className="text-[#231f20] font-medium text-[13px]">{formatDate(String(val))}</p>
                    ) : (
                      <p className="text-[#231f20] font-medium text-[13px]">{String(val)}</p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* footer actions */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-[#e5e0db] flex-shrink-0 flex-wrap">
          {/* Close Finding — supervisor/admin only, hanya jika INPG */}
          {canApprove && (
            <button
              onClick={handleApprove}
              disabled={approving}
              className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60"
            >
              {approving ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              Close Finding (CLSD)
            </button>
          )}
          {/* Edit — hanya untuk INPG atau non-approval */}
          {(!enableApproval || isInpg || isAdmin) && (
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-white bg-[#f15a22] rounded-xl hover:bg-[#d44d1a] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
          )}
          {isAdmin && (
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
              Hapus
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[600] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-[14px] font-medium animate-in slide-in-from-bottom-4 ${
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      }`}
    >
      {type === 'success' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}
      {msg}
    </div>
  );
}

// ── Main CrudPage component ───────────────────────────────────────────────────

export function CrudPage({ config }: { config: CrudPageConfig }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isSupervisor = user?.role === 'supervisor' || isAdmin;
  const enableApproval = !!config.enableApproval;

  const [records, setRecords] = useState<SafetyRecord[]>([]);
  const [filtered, setFiltered] = useState<SafetyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  // Approval filter: '' = semua, 'INPG' = pending, 'CLSD' = closed
  const [statusFilter, setStatusFilter] = useState<'' | 'INPG' | 'CLSD'>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SafetyRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<SafetyRecord | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch ──
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      // Use dedicated K3 Policy API if categoryId is 'sc-k3-policy'
      if (config.categoryId === 'sc-k3-policy') {
        const data = await k3PolicyApi.getAll();
        setRecords(data);
      } else {
        const data = await recordsApi.getAll(config.categoryId as any);
        setRecords(data);
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  }, [config.categoryId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // ── Search + status filter (client-side) ──
  useEffect(() => {
    let result = [...records];

    // Status filter (hanya untuk approval pages)
    if (enableApproval && statusFilter) {
      result = result.filter((r) => (r as any).findingStatus === statusFilter);
    }

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) => {
        if (config.categoryId === 'sc-k3-policy') {
          const k3 = r as any;
          return (
            k3.judulKebijakan?.toLowerCase().includes(q) ||
            k3.jenisKebijakan?.toLowerCase().includes(q) ||
            k3.penandatangan?.toLowerCase().includes(q)
          );
        }
        return (
          r.title?.toLowerCase().includes(q) ||
          Object.values(r.data ?? {}).some((v) => String(v).toLowerCase().includes(q))
        );
      });
    }

    setFiltered(result);
  }, [search, statusFilter, records, config.categoryId, enableApproval]);

  // ── Add/Edit (tanpa file) — hanya untuk non-K3 Policy ──
  const handleSubmit = async (values: { title: string; data: Record<string, string> }) => {
    if (editTarget) {
      await recordsApi.update(editTarget.id, values);
      showToast('Record berhasil diperbarui', 'success');
    } else {
      await recordsApi.create(config.categoryId as any, values);
      showToast('Record berhasil ditambahkan', 'success');
    }
    await fetchRecords();
  };

  // ── Add/Edit (dengan file) ──
  const handleSubmitFormData = async (formData: FormData) => {
    if (editTarget) {
      // Use dedicated K3 Policy API if categoryId is 'sc-k3-policy'
      if (config.categoryId === 'sc-k3-policy') {
        await k3PolicyApi.updateWithFile(editTarget.id, formData);
      } else {
        await recordsApi.updateWithFile(editTarget.id, formData);
      }
      showToast('Record berhasil diperbarui', 'success');
    } else {
      // Use dedicated K3 Policy API if categoryId is 'sc-k3-policy'
      if (config.categoryId === 'sc-k3-policy') {
        await k3PolicyApi.createWithFile(formData);
      } else {
        await recordsApi.createWithFile(config.categoryId as any, formData);
      }
      showToast('Record berhasil ditambahkan', 'success');
    }
    await fetchRecords();
  };

  // ── Delete ──
  const handleDelete = async (record: SafetyRecord) => {
    // For K3 Policy, use judulKebijakan as title
    const displayTitle = config.categoryId === 'sc-k3-policy' 
      ? (record as any).judulKebijakan 
      : record.title;
    
    if (!confirm(`Hapus record "${displayTitle}"?`)) return;
    try {
      // Use dedicated K3 Policy API if categoryId is 'sc-k3-policy'
      if (config.categoryId === 'sc-k3-policy') {
        await k3PolicyApi.delete(record.id);
      } else {
        await recordsApi.delete(record.id);
      }
      showToast('Record berhasil dihapus', 'success');
      if (detailRecord?.id === record.id) setDetailRecord(null);
      await fetchRecords();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus', 'error');
    }
  };

  // ── Approve (Close Finding: INPG → CLSD) — supervisor/admin only ──
  const handleApprove = async (id: string) => {
    try {
      await findingsApi.updateStatus(id, 'CLSD');
      showToast('Temuan berhasil ditutup (CLSD)', 'success');
      await fetchRecords();
    } catch (err: any) {
      showToast(err.message || 'Gagal menutup temuan', 'error');
      throw err; // re-throw agar DetailPanel bisa reset loading state
    }
  };

  // Kolom yang tampil di tabel (max 3 kolom data + judul)
  const tableCols = config.fields.filter((f) => f.showInTable !== false).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f1f0ee]">
      {/* ── Page Header ── */}
      <div className="bg-[#231f20] px-6 md:px-10 py-8 border-b-[3px] border-b-[#f15a22]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] mb-2">
            {config.parentLabel}
          </p>
          <h1 className="font-bold text-white text-[clamp(22px,4vw,38px)] leading-tight">
            {config.title}
          </h1>
          <p className="text-[#8a8580] text-[13px] mt-1.5">{config.description}</p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a09b96]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Cari ${config.title}...`}
              className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-[#c5c0bb] rounded-xl focus:outline-none focus:border-[#f15a22] focus:ring-2 focus:ring-[#f15a22]/20 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a09b96] hover:text-[#231f20]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          {/* Add button */}
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#f15a22] text-white text-[13px] font-semibold rounded-xl hover:bg-[#d44d1a] transition-colors whitespace-nowrap"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Record
          </button>
        </div>

        {/* Approval status filter tabs */}
        {enableApproval && (
          <div className="flex items-center gap-2 mb-4">
            {(['', 'INPG', 'CLSD'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-colors border ${
                  statusFilter === s
                    ? s === 'CLSD'
                      ? 'bg-green-600 text-white border-green-600'
                      : s === 'INPG'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-[#231f20] text-white border-[#231f20]'
                    : 'bg-white text-[#6b6560] border-[#e5e0db] hover:border-[#c5c0bb]'
                }`}
              >
                {s === '' ? 'All' : s === 'INPG' ? '⏳ Pending Approval' : '✅ Closed'}
                {!loading && s !== '' && (
                  <span className="ml-1.5 opacity-70">
                    ({records.filter((r) => (r as any).findingStatus === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Info bar */}
        <div className="flex items-center justify-between mb-3 px-1 flex-wrap gap-2">
          <p className="text-[12px] text-[#6b6560]">
            {loading
              ? 'Memuat data...'
              : `Menampilkan ${filtered.length} record${search ? ` dari ${records.length}` : ''}`}
          </p>
          {isAdmin && !loading && (
            <span className="text-[11px] px-2.5 py-0.5 bg-[#f15a22]/10 text-[#f15a22] rounded-full font-semibold border border-[#f15a22]/20">
              Mode Admin
            </span>
          )}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-[#e5e0db] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-[#f1f0ee] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#f1f0ee] flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5c0bb" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <p className="font-semibold text-[#231f20] text-[14px] mb-1">
                {search ? 'Tidak ada hasil pencarian' : 'Belum ada record'}
              </p>
              <p className="text-[#6b6560] text-[13px]">
                {search
                  ? `Tidak ditemukan record untuk "${search}"`
                  : 'Klik "Tambah Record" untuk menambahkan data pertama.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[#e5e0db] bg-[#faf9f7]">
                    <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#6b6560] uppercase tracking-wide w-10">#</th>
                    <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#6b6560] uppercase tracking-wide">Judul</th>
                    {tableCols.map((f) => (
                      <th key={f.key} className="text-left py-3 px-4 text-[11px] font-semibold text-[#6b6560] uppercase tracking-wide hidden md:table-cell">
                        {f.label}
                      </th>
                    ))}
                    {/* Status approval column */}
                    {enableApproval && (
                      <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#6b6560] uppercase tracking-wide hidden md:table-cell">
                        Status
                      </th>
                    )}
                    <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#6b6560] uppercase tracking-wide hidden lg:table-cell">Dibuat Oleh</th>
                    <th className="text-left py-3 px-4 text-[11px] font-semibold text-[#6b6560] uppercase tracking-wide hidden lg:table-cell">Tanggal</th>
                    <th className="text-right py-3 px-4 text-[11px] font-semibold text-[#6b6560] uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f0ee]">
                  {filtered.map((rec, idx) => {
                    const isK3Policy = config.categoryId === 'sc-k3-policy';
                    const displayTitle = isK3Policy ? (rec as any).judulKebijakan : rec.title;
                    const findingStatus = (rec as any).findingStatus as string | undefined;

                    return (
                    <tr key={rec.id} className="hover:bg-[#faf9f7] transition-colors">
                      <td className="py-3 px-4 text-[#a09b96]">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setDetailRecord(rec)}
                          className="font-medium text-[#231f20] hover:text-[#f15a22] text-left transition-colors leading-snug"
                        >
                          {displayTitle}
                        </button>
                      </td>
                      {tableCols.map((f) => {
                        const val = isK3Policy ? (rec as any)[f.key] : rec.data?.[f.key];
                        const isStatus = f.key.toLowerCase().includes('status');
                        return (
                          <td key={f.key} className="py-3 px-4 hidden md:table-cell max-w-[160px]">
                            {val ? (
                              isStatus ? <Badge value={String(val)} /> : (
                                <span className="text-[#6b6560] truncate block">{String(val)}</span>
                              )
                            ) : (
                              <span className="text-[#c5c0bb]">—</span>
                            )}
                          </td>
                        );
                      })}
                      {/* Approval status column */}
                      {enableApproval && (
                        <td className="py-3 px-4 hidden md:table-cell">
                          {findingStatus ? <ApprovalBadge status={findingStatus} /> : <span className="text-[#c5c0bb]">—</span>}
                        </td>
                      )}
                      <td className="py-3 px-4 text-[#6b6560] hidden lg:table-cell">
                        {isK3Policy ? (rec as any).createdBy?.nama : rec.createdByName || '—'}
                      </td>
                      <td className="py-3 px-4 text-[#6b6560] hidden lg:table-cell whitespace-nowrap">
                        {formatDate(rec.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Detail */}
                          <button
                            onClick={() => setDetailRecord(rec)}
                            className="p-1.5 text-[#6b6560] hover:text-[#f15a22] hover:bg-[#f1f0ee] rounded-lg transition-colors"
                            title="Lihat detail"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => {
                              setEditTarget(rec);
                              setModalOpen(true);
                            }}
                            className="p-1.5 text-[#6b6560] hover:text-[#f15a22] hover:bg-[#f1f0ee] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          {/* Delete — admin only */}
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(rec)}
                              className="p-1.5 text-[#6b6560] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4h6v2" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSubmit={handleSubmit}
        onSubmitFormData={handleSubmitFormData}
        fields={config.fields}
        modalTitle={editTarget ? `Edit — ${config.title}` : `Tambah Record — ${config.title}`}
        isK3Policy={config.categoryId === 'sc-k3-policy'}
        enableApproval={enableApproval}
        initialValues={
          editTarget
            ? config.categoryId === 'sc-k3-policy'
              ? { title: (editTarget as any).judulKebijakan ?? '', data: editTarget as any }
              : { title: editTarget.title, data: editTarget.data }
            : null
        }
      />

      {/* Detail Panel */}
      <DetailPanel
        record={detailRecord}
        fields={config.fields}
        isK3Policy={config.categoryId === 'sc-k3-policy'}
        enableApproval={enableApproval}
        isSupervisor={isSupervisor}
        onApprove={handleApprove}
        onClose={() => setDetailRecord(null)}
        onEdit={() => {
          setEditTarget(detailRecord);
          setDetailRecord(null);
          setModalOpen(true);
        }}
        isAdmin={isAdmin}
        onDelete={() => { if (detailRecord) handleDelete(detailRecord); }}
      />

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}