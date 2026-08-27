'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { recordsApi, SafetyRecord, RecordCategory } from '@/lib/api';
import { RecordTable } from '@/components/RecordTable';
import { RecordFormModal, FormField } from '@/components/RecordFormModal';

// ─── Konfigurasi field untuk Safety Competency ────────────────────────────────
const CATEGORY: RecordCategory = 'safety-competency';

const FIELDS: FormField[] = [
  {
    key: 'namaKaryawan',
    label: 'Nama Karyawan',
    type: 'text',
    required: true,
    placeholder: 'Nama lengkap karyawan',
  },
  {
    key: 'jenisKompetensi',
    label: 'Jenis Kompetensi / Pelatihan',
    type: 'select',
    required: true,
    options: [
      { label: 'Safety Induction', value: 'Safety Induction' },
      { label: 'Fire Fighting', value: 'Fire Fighting' },
      { label: 'First Aid / P3K', value: 'First Aid / P3K' },
      { label: 'Working at Height', value: 'Working at Height' },
      { label: 'Confined Space', value: 'Confined Space' },
      { label: 'LOTO / Lockout Tagout', value: 'LOTO / Lockout Tagout' },
      { label: 'Forklift Operator', value: 'Forklift Operator' },
      { label: 'Crane Operator', value: 'Crane Operator' },
      { label: 'Chemical Safety', value: 'Chemical Safety' },
      { label: 'SMK3 Awareness', value: 'SMK3 Awareness' },
      { label: 'Lainnya', value: 'Lainnya' },
    ],
  },
  {
    key: 'nomorSertifikat',
    label: 'Nomor Sertifikat / Lisensi',
    type: 'text',
    placeholder: 'Nomor sertifikat jika ada',
  },
  {
    key: 'tanggalPelatihan',
    label: 'Tanggal Pelatihan / Sertifikasi',
    type: 'date',
    required: true,
  },
  {
    key: 'tanggalKadaluarsa',
    label: 'Tanggal Kadaluarsa',
    type: 'date',
  },
  {
    key: 'statusKompetensi',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { label: 'Aktif', value: 'Aktif' },
      { label: 'Akan Kadaluarsa (< 3 bulan)', value: 'Akan Kadaluarsa' },
      { label: 'Kadaluarsa', value: 'Kadaluarsa' },
      { label: 'Dalam Proses Renewal', value: 'Dalam Proses Renewal' },
    ],
  },
  {
    key: 'penyelenggara',
    label: 'Penyelenggara Pelatihan',
    type: 'text',
    placeholder: 'Nama lembaga / vendor pelatihan',
  },
  {
    key: 'keterangan',
    label: 'Keterangan',
    type: 'textarea',
    placeholder: 'Catatan tambahan...',
  },
];

// ─── Komponen utama ───────────────────────────────────────────────────────────
export default function SafetyCompetencyPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [records, setRecords] = useState<SafetyRecord[]>([]);
  const [filtered, setFiltered] = useState<SafetyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SafetyRecord | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // ── Fetch data ──
  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await recordsApi.getAll(CATEGORY);
      setRecords(data);
      setFiltered(data);
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // ── Search ──
  useEffect(() => {
    if (!search.trim()) { setFiltered(records); return; }
    const q = search.toLowerCase();
    setFiltered(
      records.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          Object.values(r.data ?? {}).some((v) => String(v).toLowerCase().includes(q))
      )
    );
  }, [search, records]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (values: { title: string; data: Record<string, any> }) => {
    if (editTarget) {
      await recordsApi.update(editTarget.id, values);
      showToast('Record berhasil diperbarui', 'success');
    } else {
      await recordsApi.create(CATEGORY, values);
      showToast('Record berhasil ditambahkan', 'success');
    }
    await fetchRecords();
  };

  const handleDelete = async (record: SafetyRecord) => {
    if (!confirm(`Hapus record "${record.title}"?`)) return;
    try {
      await recordsApi.delete(record.id);
      showToast('Record berhasil dihapus', 'success');
      await fetchRecords();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f0ee]">
      {/* ── Header ── */}
      <div className="bg-[#231f20] px-6 md:px-10 py-8 border-b-[3px] border-b-[#f15a22]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] mb-2">
            Safety Management
          </p>
          <h1 className="font-bold text-white text-[clamp(24px,4vw,40px)] leading-tight">
            Safety Competency
          </h1>
          <p className="text-[#8a8580] text-[13px] mt-1">
            Kelola kompetensi, sertifikasi, dan riwayat pelatihan K3 karyawan
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a09b96]"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan nama, kompetensi, sertifikat..."
              className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-[#c5c0bb] rounded-lg focus:outline-none focus:border-[#f15a22] focus:ring-2 focus:ring-[#f15a22]/20 transition-colors"
            />
          </div>
          <button
            onClick={() => { setEditTarget(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#f15a22] text-white text-[13px] font-semibold rounded-lg hover:bg-[#d44d1a] transition-colors whitespace-nowrap"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Record
          </button>
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[12px] text-[#6b6560]">
            Menampilkan <span className="font-semibold text-[#231f20]">{filtered.length}</span> dari{' '}
            <span className="font-semibold text-[#231f20]">{records.length}</span> record
          </p>
          {isAdmin && (
            <span className="text-[11px] px-2 py-0.5 bg-[#f15a22]/10 text-[#f15a22] rounded-full font-semibold">
              Mode Admin — Edit & Hapus Aktif
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#e5e0db] shadow-sm overflow-hidden">
          <RecordTable
            records={filtered}
            fields={FIELDS}
            isAdmin={isAdmin}
            isLoading={isLoading}
            onEdit={(r) => { setEditTarget(r); setModalOpen(true); }}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <RecordFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSubmit={handleSubmit}
        fields={FIELDS}
        title={editTarget ? 'Edit Record Safety Competency' : 'Tambah Record Safety Competency'}
        initialValues={editTarget ? { title: editTarget.title, data: editTarget.data } : null}
      />

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[600] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-[14px] font-medium ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
