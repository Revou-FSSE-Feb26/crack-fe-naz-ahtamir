import type { CrudPageConfig } from '@/components/CrudPage';

export const config: CrudPageConfig = {
  categoryId: 'ap-equipment-safety',
  title: 'Equipment Safety',
  description: 'Inspeksi dan pemeliharaan keselamatan peralatan kerja, mesin, dan instalasi.',
  parentLabel: 'Accident Prevention',
  fields: [
    {
        "key": "namaPeralatan",
        "label": "Nama Peralatan",
        "type": "text",
        "required": true,
        "showInTable": true
    },
    {
        "key": "nomorAset",
        "label": "Nomor Aset / ID",
        "type": "text",
        "showInTable": true
    },
    {
        "key": "lokasiPeralatan",
        "label": "Lokasi",
        "type": "text",
        "required": true,
        "showInTable": true
    },
    {
        "key": "jenisInspeksi",
        "label": "Jenis Inspeksi",
        "type": "select",
        "required": true,
        "options": [
            {
                "label": "Inspeksi Harian",
                "value": "Inspeksi Harian"
            },
            {
                "label": "Inspeksi Mingguan",
                "value": "Inspeksi Mingguan"
            },
            {
                "label": "Inspeksi Bulanan",
                "value": "Inspeksi Bulanan"
            },
            {
                "label": "Inspeksi Tahunan",
                "value": "Inspeksi Tahunan"
            },
            {
                "label": "Sertifikasi Uji Berkala",
                "value": "Sertifikasi Uji Berkala"
            }
        ]
    },
    {
        "key": "tanggalInspeksi",
        "label": "Tanggal Inspeksi",
        "type": "date",
        "required": true
    },
    {
        "key": "kondisiPeralatan",
        "label": "Kondisi Peralatan",
        "type": "select",
        "required": true,
        "options": [
            {
                "label": "Baik",
                "value": "Baik"
            },
            {
                "label": "Perlu Perbaikan",
                "value": "Perlu Perbaikan"
            },
            {
                "label": "Tidak Layak Pakai",
                "value": "Tidak Layak Pakai"
            }
        ]
    },
    {
        "key": "temuanKerusakan",
        "label": "Temuan / Kerusakan",
        "type": "textarea",
        "placeholder": "Uraikan temuan atau kerusakan..."
    },
    {
        "key": "tindakLanjut",
        "label": "Tindak Lanjut",
        "type": "textarea"
    }
],
};
