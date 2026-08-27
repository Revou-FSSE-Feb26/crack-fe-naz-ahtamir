import type { CrudPageConfig } from '@/components/CrudPage';

export const config: CrudPageConfig = {
  categoryId: 'scomp-license',
  title: 'License & Certification',
  description: 'Inventaris lisensi K3, sertifikat kompetensi operator, dan izin kerja khusus.',
  parentLabel: 'Safety Competency',
  fields: [
    {
        "key": "namaKaryawan",
        "label": "Nama Karyawan",
        "type": "text",
        "required": true,
        "showInTable": true
    },
    {
        "key": "jenisLisensi",
        "label": "Jenis Lisensi / Sertifikat",
        "type": "select",
        "required": true,
        "showInTable": true,
        "options": [
            {
                "label": "SIO Crane",
                "value": "SIO Crane"
            },
            {
                "label": "SIO Forklift",
                "value": "SIO Forklift"
            },
            {
                "label": "SIO Rigger",
                "value": "SIO Rigger"
            },
            {
                "label": "AK3 Umum",
                "value": "AK3 Umum"
            },
            {
                "label": "AK3 Kebakaran",
                "value": "AK3 Kebakaran"
            },
            {
                "label": "AK3 Listrik",
                "value": "AK3 Listrik"
            },
            {
                "label": "AK3 Kimia",
                "value": "AK3 Kimia"
            },
            {
                "label": "P3K K3",
                "value": "P3K K3"
            },
            {
                "label": "Lainnya",
                "value": "Lainnya"
            }
        ]
    },
    {
        "key": "nomorSertifikat",
        "label": "Nomor Sertifikat",
        "type": "text",
        "required": true,
        "showInTable": true
    },
    {
        "key": "tanggalTerbit",
        "label": "Tanggal Terbit",
        "type": "date",
        "required": true
    },
    {
        "key": "tanggalKadaluarsa",
        "label": "Tanggal Kadaluarsa",
        "type": "date",
        "required": true
    },
    {
        "key": "penerbitSertifikat",
        "label": "Diterbitkan Oleh",
        "type": "text",
        "placeholder": "Kemnaker, BNSP, dll."
    },
    {
        "key": "statusSertifikat",
        "label": "Status",
        "type": "select",
        "required": true,
        "options": [
            {
                "label": "Aktif",
                "value": "Aktif"
            },
            {
                "label": "Akan Kadaluarsa (< 3 Bulan)",
                "value": "Akan Kadaluarsa"
            },
            {
                "label": "Kadaluarsa",
                "value": "Kadaluarsa"
            },
            {
                "label": "Proses Perpanjangan",
                "value": "Proses Perpanjangan"
            }
        ]
    }
],
};
