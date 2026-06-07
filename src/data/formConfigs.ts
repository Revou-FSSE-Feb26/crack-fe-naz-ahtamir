import { SubSubElementFormConfig, FormField } from "@/types/subSubElement";

// Default template for generic sub-sub elements
const getDefaultFields = (): FormField[] => [
  { name: "judul", label: "Judul", type: "text", required: true },
  { name: "tanggal", label: "Tanggal", type: "date", required: true },
  { name: "penanggungJawab", label: "Penanggung Jawab", type: "text", required: true },
  { name: "deskripsi", label: "Deskripsi/Keterangan", type: "textarea", required: true, rows: 6 },
  { name: "dokumen", label: "Dokumen Pendukung (PDF)", type: "file", accept: ".pdf", maxSize: 5 },
  { name: "foto", label: "Foto/Gambar (opsional)", type: "file", accept: ".jpg,.jpeg,.png", maxSize: 2 },
];

// Helper function to get form config
export const getFormConfig = (subSubElementId: string): SubSubElementFormConfig => {
  // Check if specific config exists
  if (formConfigs[subSubElementId]) {
    return formConfigs[subSubElementId];
  }
  
  // Return default config
  return {
    subSubElementId,
    fields: getDefaultFields(),
  };
};

// Specific form configurations for sub-sub elements that need custom fields
// For elements not listed here, the default template will be used
export const formConfigs: Record<string, SubSubElementFormConfig> = {
  // ELEMEN 1: KOMITMEN - Kebijakan K3
  "1.1.1": {
    subSubElementId: "1.1.1",
    fields: [
      { name: "nomorKebijakan", label: "Nomor Kebijakan", type: "text", required: true },
      { name: "tanggalPenetapan", label: "Tanggal Penetapan", type: "date", required: true },
      { name: "penandatangan", label: "Penandatangan", type: "text", required: true },
      { name: "jabatan", label: "Jabatan", type: "text", required: true },
      { name: "isiKebijakan", label: "Isi Kebijakan", type: "textarea", required: true, rows: 6 },
      { name: "dokumenKebijakan", label: "Dokumen Kebijakan (PDF)", type: "file", accept: ".pdf", maxSize: 5, required: true },
    ],
  },

  // ELEMEN 6: Keamanan Bekerja - Inspeksi & Pemeliharaan
  "6.5.1": {
    subSubElementId: "6.5.1",
    fields: [
      { name: "namaPeralatan", label: "Nama Peralatan/Sarana", type: "text", required: true },
      { name: "tanggalPemeriksaan", label: "Tanggal Pemeriksaan", type: "date", required: true },
      { name: "petugasPemeriksa", label: "Petugas Pemeriksa", type: "text", required: true },
      { name: "hasilPemeriksaan", label: "Hasil Pemeriksaan", type: "textarea", required: true, rows: 4 },
      { name: "tindakLanjut", label: "Tindak Lanjut", type: "textarea", rows: 4 },
      { name: "laporanPemeriksaan", label: "Laporan Pemeriksaan (PDF)", type: "file", accept: ".pdf", maxSize: 3 },
      { name: "fotoDokumentasi", label: "Foto Dokumentasi", type: "file", accept: ".jpg,.jpeg,.png", maxSize: 2 },
    ],
  },

  // ELEMEN 7: Pemantauan - Inspeksi K3

  // 7.1.1.1: Inspeksi Ketidaksesuaian (Non-Conformance Inspection)
  "7.1.1-inspeksi-ketidaksesuaian": {
    subSubElementId: "7.1.1-inspeksi-ketidaksesuaian",
    fields: [
      { name: "tanggalInspeksi", label: "Tanggal Inspeksi", type: "date", required: true },
      { name: "lokasiKetidaksesuaian", label: "Lokasi Ketidaksesuaian", type: "text", required: true },
      { name: "petugasInspeksi", label: "Petugas Inspeksi", type: "text", required: true },
      { name: "jenisKetidaksesuaian", label: "Jenis Ketidaksesuaian", type: "select", required: true, options: ["Minor", "Major", "Critical"] },
      { name: "deskripsiKetidaksesuaian", label: "Deskripsi Ketidaksesuaian", type: "textarea", required: true, rows: 6 },
      { name: "standarYangDilanggar", label: "Standar/Regulasi yang Dilanggar", type: "textarea", rows: 3 },
      { name: "rekomendasiPerbaikan", label: "Rekomendasi Perbaikan (Corrective Action)", type: "textarea", required: true, rows: 4 },
      { name: "penanggungJawabPerbaikan", label: "Penanggung Jawab Perbaikan", type: "text", required: true },
      { name: "targetPenyelesaian", label: "Target Penyelesaian", type: "date", required: true },
      { name: "dokumenLaporan", label: "Laporan Inspeksi (PDF)", type: "file", accept: ".pdf", maxSize: 3 },
      { name: "fotoDokumentasi", label: "Foto Dokumentasi", type: "file", accept: ".jpg,.jpeg,.png", maxSize: 2, multiple: true },
    ],
  },

  // 7.1.1.2: Inspeksi Sarana Prasarana (Facility Inspection)
  "7.1.1-inspeksi-sarana-prasarana": {
    subSubElementId: "7.1.1-inspeksi-sarana-prasarana",
    fields: [
      { name: "tanggalInspeksi", label: "Tanggal Inspeksi", type: "date", required: true },
      { name: "namaSaranaPrasarana", label: "Nama Sarana/Prasarana", type: "text", required: true },
      { name: "lokasi", label: "Lokasi Sarana/Prasarana", type: "text", required: true },
      { name: "petugasInspeksi", label: "Petugas Inspeksi", type: "text", required: true },
      { name: "komponenYangDIperiksa", label: "Komponen yang Diperiksa", type: "textarea", required: true, rows: 4 },
      { name: "kondisiSaatIni", label: "Kondisi Saat Ini", type: "select", required: true, options: ["Baik Sekali", "Baik", "Cukup", "Buruk", "Kritis"] },
      { name: "masalahYangDitemukan", label: "Masalah yang Ditemukan", type: "textarea", rows: 4 },
      { name: "tindakLanjutDiperlukan", label: "Tindak Lanjut yang Diperlukan", type: "textarea", rows: 4 },
      { name: "penanggungJawabTindakLanjut", label: "Penanggung Jawab Tindak Lanjut", type: "text" },
      { name: "dokumenLaporan", label: "Laporan Inspeksi (PDF)", type: "file", accept: ".pdf", maxSize: 3 },
      { name: "fotoDokumentasi", label: "Foto Dokumentasi", type: "file", accept: ".jpg,.jpeg,.png", maxSize: 2, multiple: true },
    ],
  },

  // 7.1.1.3: Inspeksi Kotak P3K (First Aid Kit Inspection)
  "7.1.1-inspeksi-kotak-p3k": {
    subSubElementId: "7.1.1-inspeksi-kotak-p3k",
    fields: [
      { name: "tanggalInspeksi", label: "Tanggal Inspeksi", type: "date", required: true },
      { name: "lokasiKotakP3K", label: "Lokasi Kotak P3K", type: "text", required: true },
      { name: "petugasInspeksi", label: "Petugas Inspeksi", type: "text", required: true },
      { name: "kondisiKotak", label: "Kondisi Kotak", type: "select", required: true, options: ["Baik", "Cukup Baik", "Buruk"] },
      { name: "ketersediaanObat", label: "Ketersediaan Obat & Obat-obatan", type: "textarea", required: true },
      { name: "ketersediaanAlat", label: "Ketersediaan Peralatan P3K", type: "textarea", required: true },
      { name: "jumlahObat", label: "Jumlah Obat (unit)", type: "number", required: true },
      { name: "jumlahAlat", label: "Jumlah Peralatan (unit)", type: "number", required: true },
      { name: "masalahKetidaklengkapan", label: "Masalah/Ketidaklengkapan", type: "textarea", rows: 3 },
      { name: "tindakLanjut", label: "Tindak Lanjut (Pengisian Ulang/Penggantian)", type: "textarea", rows: 3 },
      { name: "penanggungJawab", label: "Penanggung Jawab Pemeliharaan", type: "text" },
      { name: "dokumenLaporan", label: "Laporan Inspeksi (PDF)", type: "file", accept: ".pdf", maxSize: 2 },
      { name: "fotoDokumentasi", label: "Foto Kotak P3K", type: "file", accept: ".jpg,.jpeg,.png", maxSize: 2 },
    ],
  },

  // 7.1.1.4: Inspeksi APD (PPE Inspection)
  "7.1.1-inspeksi-apd": {
    subSubElementId: "7.1.1-inspeksi-apd",
    fields: [
      { name: "tanggalInspeksi", label: "Tanggal Inspeksi", type: "date", required: true },
      { name: "lokasiPenyimpanan", label: "Lokasi Penyimpanan APD", type: "text", required: true },
      { name: "petugasInspeksi", label: "Petugas Inspeksi", type: "text", required: true },
      { name: "jenisAPD", label: "Jenis APD", type: "select", required: true, options: ["Helmet/Topi Keselamatan", "Kacamata Pengaman", "Pelindung Telinga", "Masker/Respirator", "Sarung Tangan", "Sepatu Keselamatan", "Rompi Reflektif", "Harness Keselamatan"] },
      { name: "jumlahAPD", label: "Jumlah APD yang Diperiksa", type: "number", required: true },
      { name: "kondisiFisik", label: "Kondisi Fisik APD", type: "select", required: true, options: ["Baik Sekali", "Baik", "Cukup", "Buruk (Tidak Layak)", "Hilang"] },
      { name: "ketersediaan", label: "Ketersediaan", type: "select", required: true, options: ["Lengkap", "Tidak Lengkap", "Kurang"] },
      { name: "masalahYangDitemukan", label: "Masalah yang Ditemukan", type: "textarea", rows: 4 },
      { name: "tindakLanjut", label: "Tindak Lanjut (Perbaikan/Penggantian)", type: "textarea", required: true, rows: 4 },
      { name: "penanggungJawab", label: "Penanggung Jawab Pemeliharaan", type: "text" },
      { name: "dokumenLaporan", label: "Laporan Inspeksi (PDF)", type: "file", accept: ".pdf", maxSize: 2 },
      { name: "fotoDokumentasi", label: "Foto APD", type: "file", accept: ".jpg,.jpeg,.png", maxSize: 2, multiple: true },
    ],
  },

  "7.1.1": {
    subSubElementId: "7.1.1",
    fields: [
      { name: "tanggalInspeksi", label: "Tanggal Inspeksi", type: "date", required: true },
      { name: "areaInspeksi", label: "Area Inspeksi", type: "text", required: true },
      { name: "petugasInspeksi", label: "Petugas Inspeksi", type: "text", required: true },
      { name: "temuanInspeksi", label: "Temuan Inspeksi", type: "textarea", required: true, rows: 6 },
      { name: "rekomendasiPerbaikan", label: "Rekomendasi Perbaikan", type: "textarea", required: true, rows: 4 },
      { name: "laporanInspeksi", label: "Laporan Inspeksi (PDF)", type: "file", accept: ".pdf", maxSize: 3 },
      { name: "fotoTemuan", label: "Foto Temuan", type: "file", accept: ".jpg,.jpeg,.png", maxSize: 2, multiple: true },
    ],
  },

  // ELEMEN 8: Pelaporan - Investigasi Kecelakaan
  "8.3.1": {
    subSubElementId: "8.3.1",
    fields: [
      { name: "tanggalKecelakaan", label: "Tanggal Kecelakaan", type: "date", required: true },
      { name: "lokasiKecelakaan", label: "Lokasi Kecelakaan", type: "text", required: true },
      { name: "korban", label: "Nama Korban", type: "text", required: true },
      { name: "kronologi", label: "Kronologi Kejadian", type: "textarea", required: true, rows: 6 },
      { name: "penyebab", label: "Analisis Penyebab", type: "textarea", required: true, rows: 4 },
      { name: "tindakanKorektif", label: "Tindakan Korektif", type: "textarea", required: true, rows: 4 },
      { name: "laporanInvestigasi", label: "Laporan Investigasi (PDF)", type: "file", accept: ".pdf", maxSize: 5, required: true },
      { name: "fotoBukti", label: "Foto Bukti", type: "file", accept: ".jpg,.jpeg,.png", maxSize: 2, multiple: true },
    ],
  },

  // ELEMEN 9: Pengelolaan Material - Bahan Kimia Berbahaya
  "9.3.1": {
    subSubElementId: "9.3.1",
    fields: [
      { name: "namaBahan", label: "Nama Bahan Kimia", type: "text", required: true },
      { name: "nomorCAS", label: "Nomor CAS", type: "text" },
      { name: "kategoriBahaya", label: "Kategori Bahaya", type: "select", required: true, options: ["Mudah Terbakar", "Korosif", "Beracun", "Reaktif", "Oksidator"] },
      { name: "jumlahStok", label: "Jumlah Stok", type: "text", required: true },
      { name: "lokasiPenyimpanan", label: "Lokasi Penyimpanan", type: "text", required: true },
      { name: "tanggalMasuk", label: "Tanggal Masuk", type: "date", required: true },
      { name: "msds", label: "MSDS (PDF)", type: "file", accept: ".pdf", maxSize: 5, required: true },
      { name: "fotoLabel", label: "Foto Label", type: "file", accept: ".jpg,.jpeg,.png", maxSize: 2 },
    ],
  },

  // ELEMEN 11: Pemeriksaan SMK3 - Audit Internal
  "11.1.1": {
    subSubElementId: "11.1.1",
    fields: [
      { name: "tanggalAudit", label: "Tanggal Audit", type: "date", required: true },
      { name: "ruangLingkup", label: "Ruang Lingkup Audit", type: "text", required: true },
      { name: "timAuditor", label: "Tim Auditor", type: "textarea", required: true, rows: 3 },
      { name: "temuanAudit", label: "Temuan Audit", type: "textarea", required: true, rows: 6 },
      { name: "rekomendasiPerbaikan", label: "Rekomendasi Perbaikan", type: "textarea", required: true, rows: 4 },
      { name: "laporanAudit", label: "Laporan Audit (PDF)", type: "file", accept: ".pdf", maxSize: 5, required: true },
    ],
  },

  // ELEMEN 12: Pelatihan - Analisis Kebutuhan Pelatihan
  "12.1.1": {
    subSubElementId: "12.1.1",
    fields: [
      { name: "tahunPeriode", label: "Tahun/Periode", type: "text", required: true },
      { name: "departemen", label: "Departemen", type: "text", required: true },
      { name: "kebutuhanPelatihan", label: "Kebutuhan Pelatihan", type: "textarea", required: true, rows: 6 },
      { name: "jumlahPeserta", label: "Jumlah Peserta Target", type: "number", required: true },
      { name: "prioritas", label: "Prioritas", type: "select", required: true, options: ["Tinggi", "Sedang", "Rendah"] },
      { name: "dokumenTNA", label: "Dokumen TNA (PDF)", type: "file", accept: ".pdf", maxSize: 3 },
    ],
  },
};
