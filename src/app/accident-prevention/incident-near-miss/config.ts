import type { CrudPageConfig } from '@/components/CrudPage';

export const config: CrudPageConfig = {
  categoryId: 'ap-incident',
  title: 'Incident & Near Miss',
  description: 'Pelaporan dan investigasi kecelakaan kerja, insiden, dan near miss.',
  parentLabel: 'Accident Prevention',
  fields: [
    {
        "key": "tanggalKejadian",
        "label": "Tanggal Kejadian",
        "type": "date",
        "required": true,
        "showInTable": true
    },
    {
        "key": "jenisKejadian",
        "label": "Jenis Kejadian",
        "type": "select",
        "required": true,
        "showInTable": true,
        "options": [
            {
                "label": "Near Miss",
                "value": "Near Miss"
            },
            {
                "label": "First Aid Case",
                "value": "First Aid Case"
            },
            {
                "label": "Medical Treatment Case",
                "value": "Medical Treatment Case"
            },
            {
                "label": "Lost Time Injury",
                "value": "Lost Time Injury"
            },
            {
                "label": "Fatality",
                "value": "Fatality"
            },
            {
                "label": "Property Damage",
                "value": "Property Damage"
            }
        ]
    },
    {
        "key": "lokasi",
        "label": "Lokasi Kejadian",
        "type": "text",
        "required": true,
        "showInTable": true
    },
    {
        "key": "deskripsiKejadian",
        "label": "Deskripsi Kejadian",
        "type": "textarea",
        "required": true,
        "placeholder": "Uraikan kronologi kejadian..."
    },
    {
        "key": "penyebabLangsung",
        "label": "Penyebab Langsung",
        "type": "textarea",
        "placeholder": "Unsafe act / unsafe condition yang menyebabkan kejadian..."
    },
    {
        "key": "penyebabDasar",
        "label": "Penyebab Dasar (Root Cause)",
        "type": "textarea",
        "placeholder": "Faktor manusia, sistem, atau lingkungan..."
    },
    {
        "key": "tindakanKorektif",
        "label": "Tindakan Korektif",
        "type": "textarea",
        "required": true
    },
    {
        "key": "statusInvestigasi",
        "label": "Status Investigasi",
        "type": "select",
        "required": true,
        "options": [
            {
                "label": "Selesai",
                "value": "Selesai"
            },
            {
                "label": "Dalam Investigasi",
                "value": "Dalam Investigasi"
            },
            {
                "label": "Belum Diinvestigasi",
                "value": "Belum Diinvestigasi"
            }
        ]
    }
],
};
