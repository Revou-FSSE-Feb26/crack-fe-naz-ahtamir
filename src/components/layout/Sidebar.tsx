'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  user?: {
    name: string;
    role: string;
    email: string;
  } | null;
  onLogout?: () => void;
}

interface SubItem {
  label: string;
  href?: string;
  /** Jika ada children, item ini jadi sub-group yang bisa di-expand */
  children?: { label: string; href: string }[];
}

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
  subItems?: SubItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'safety-compliance',
    label: 'Safety Compliance',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    subItems: [
      { label: 'Semua Record', href: '/safety-compliance' },
      { label: 'K3 Policy', href: '/safety-compliance/k3-policy' },
      { label: 'Organization & Responsibility', href: '/safety-compliance/organization-responsibility' },
      { label: 'Worker Consultation (P2K3)', href: '/safety-compliance/worker-consultation' },
      { label: 'K3 Planning & Risk Assessment', href: '/safety-compliance/k3-planning' },
      {
        label: 'Documentation & Records',
        children: [
          { label: 'Master List Documents', href: '/safety-compliance/documentation-records/master-list-documents' },
          { label: 'Safety Activities', href: '/safety-compliance/documentation-records/safety-activities' },
        ],
      },
      { label: 'Legal Compliance', href: '/safety-compliance/legal-compliance' },
      { label: 'Design & Change Management', href: '/safety-compliance/design-change-management' },
      { label: 'Procurement & Contractor Control', href: '/safety-compliance/procurement-contractor' },
      { label: 'Occupational Health Management', href: '/safety-compliance/occupational-health' },
    ],
  },
  {
    id: 'accident-prevention',
    label: 'Accident Prevention',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    subItems: [
      { label: 'Semua Record', href: '/accident-prevention' },
      { label: 'Hazard Identification', href: '/accident-prevention/hazard-identification' },
      { label: 'Risk Control Implementation', href: '/accident-prevention/risk-control' },
      { label: 'Work Permit System', href: '/accident-prevention/work-permit' },
      { label: 'PPE Management', href: '/accident-prevention/ppe-management' },
      {
        label: 'Safety Inspection',
        children: [
          { label: 'Non-Conformity', href: '/accident-prevention/safety-inspection/non-conformity' },
          { label: 'Heavy Equipment', href: '/accident-prevention/safety-inspection/heavy-equipment' },
          { label: 'Electrical Safety', href: '/accident-prevention/safety-inspection/electrical-safety' },
          { label: 'Fire Safety', href: '/accident-prevention/safety-inspection/fire-safety' },
          { label: 'General Workplace', href: '/accident-prevention/safety-inspection/general-workplace' },
        ],
      },
      { label: 'Safety Observation', href: '/accident-prevention/safety-observation' },
      { label: 'Workplace Monitoring', href: '/accident-prevention/workplace-monitoring' },
      { label: 'Equipment Safety', href: '/accident-prevention/equipment-safety' },
      { label: 'LOTO / Tag Out', href: '/accident-prevention/loto' },
      { label: 'Chemical Safety', href: '/accident-prevention/chemical-safety' },
      { label: 'Emergency Preparedness', href: '/accident-prevention/emergency-preparedness' },
      { label: 'Incident & Near Miss', href: '/accident-prevention/incident-near-miss' },
    ],
  },
  {
    id: 'safety-competency',
    label: 'Safety Competency',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    subItems: [
      { label: 'Semua Record', href: '/safety-competency' },
      { label: 'Training Management', href: '/safety-competency/training-management' },
      { label: 'Training Needs Analysis', href: '/safety-competency/training-needs-analysis' },
      { label: 'Safety Induction', href: '/safety-competency/safety-induction' },
      { label: 'Safety Training', href: '/safety-competency/safety-training' },
      { label: 'Refreshment Training', href: '/safety-competency/refreshment-training' },
      { label: 'Competency Management', href: '/safety-competency/competency-management' },
      { label: 'License & Certification', href: '/safety-competency/license-certification' },
      { label: 'Job Competency', href: '/safety-competency/job-competency' },
      { label: 'Safety Briefing / Toolbox Talk', href: '/safety-competency/safety-briefing' },
      { label: 'Safety Culture Program', href: '/safety-competency/safety-culture' },
    ],
  },
  {
    id: 'smk3-audit',
    label: 'Audit SMK3',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    subItems: [
      // Elemen 1
      { label: '1. Pembangunan & Pemeliharaan Komitmen', href: '/smk3/komitmen' },
      { label: '1.1 Kebijakan K3', href: '/smk3/komitmen/1-1' },
      { label: '1.2 Tanggung Jawab & Wewenang', href: '/smk3/komitmen/1-2' },
      { label: '1.3 Tinjauan Ulang & Evaluasi SMK3', href: '/smk3/komitmen/1-3' },
      { label: '1.4 Keterlibatan & Konsultasi (P2K3)', href: '/smk3/komitmen/1-4' },
      // Elemen 2
      { label: '2. Pembuatan & Pendokumentasian Rencana K3', href: '/smk3/rencana-k3' },
      { label: '2.1 Rencana Strategi K3 (HIRADC)', href: '/smk3/rencana-k3/2-1' },
      { label: '2.2 Manual SMK3', href: '/smk3/rencana-k3/2-2' },
      { label: '2.3 Peraturan & Persyaratan Lain K3', href: '/smk3/rencana-k3/2-3' },
      { label: '2.4 Informasi K3', href: '/smk3/rencana-k3/2-4' },
      // Elemen 3
      { label: '3. Pengendalian Perancangan & Peninjauan Kontrak', href: '/smk3/perancangan-kontrak' },
      { label: '3.1 Pengendalian Perancangan', href: '/smk3/perancangan-kontrak/3-1' },
      { label: '3.2 Peninjauan Ulang Kontrak', href: '/smk3/perancangan-kontrak/3-2' },
      // Elemen 4
      { label: '4. Pengendalian Dokumen', href: '/smk3/dokumen' },
      { label: '4.1 Persetujuan & Pengeluaran Dokumen', href: '/smk3/dokumen/4-1' },
      { label: '4.2 Perubahan & Modifikasi Dokumen', href: '/smk3/dokumen/4-2' },
      // Elemen 5
      { label: '5. Pembelian & Pengendalian Produk', href: '/smk3/pembelian' },
      { label: '5.1 Spesifikasi Pembelian Barang/Jasa', href: '/smk3/pembelian/5-1' },
      { label: '5.2 Verifikasi Barang/Jasa yang Dibeli', href: '/smk3/pembelian/5-2' },
      { label: '5.3 Pengendalian Barang/Jasa dari Pelanggan', href: '/smk3/pembelian/5-3' },
      { label: '5.4 Kemampuan Telusur Produk', href: '/smk3/pembelian/5-4' },
      // Elemen 6
      { label: '6. Keamanan Bekerja Berdasarkan SMK3', href: '/smk3/keamanan-kerja' },
      { label: '6.1 Sistem Kerja (prosedur, izin kerja, APD)', href: '/smk3/keamanan-kerja/6-1' },
      { label: '6.2 Pengawasan', href: '/smk3/keamanan-kerja/6-2' },
      { label: '6.3 Seleksi & Penempatan Personil', href: '/smk3/keamanan-kerja/6-3' },
      { label: '6.4 Area Terbatas (LOTO, rambu K3)', href: '/smk3/keamanan-kerja/6-4' },
      { label: '6.5 Pemeliharaan, Perbaikan & Perubahan Sarana', href: '/smk3/keamanan-kerja/6-5' },
      { label: '6.6 Pelayanan (kontrak jasa K3)', href: '/smk3/keamanan-kerja/6-6' },
      { label: '6.7 Kesiapan Tanggap Darurat', href: '/smk3/keamanan-kerja/6-7' },
      { label: '6.8 Pertolongan Pertama pada Kecelakaan', href: '/smk3/keamanan-kerja/6-8' },
      { label: '6.9 Rencana Pemulihan Kondisi Darurat', href: '/smk3/keamanan-kerja/6-9' },
      // Elemen 7
      { label: '7. Standar Pemantauan', href: '/smk3/pemantauan' },
      { label: '7.1 Pemeriksaan Bahaya (Inspeksi)', href: '/smk3/pemantauan/7-1' },
      { label: '7.2 Pemantauan/Pengukuran Lingkungan Kerja', href: '/smk3/pemantauan/7-2' },
      { label: '7.3 Peralatan Pemeriksaan & Pengujian', href: '/smk3/pemantauan/7-3' },
      { label: '7.4 Pemantauan Kesehatan Tenaga Kerja (MCU)', href: '/smk3/pemantauan/7-4' },
      // Elemen 8
      { label: '8. Pelaporan & Perbaikan Kekurangan', href: '/smk3/pelaporan' },
      { label: '8.1 Pelaporan Bahaya', href: '/smk3/pelaporan/8-1' },
      { label: '8.2 Pelaporan Kecelakaan & Penyakit Akibat Kerja', href: '/smk3/pelaporan/8-2' },
      { label: '8.3 Pemeriksaan & Pengkajian Kecelakaan', href: '/smk3/pelaporan/8-3' },
      { label: '8.4 Penanganan Masalah K3', href: '/smk3/pelaporan/8-4' },
      // Elemen 9
      { label: '9. Pengelolaan Material & Perpindahannya', href: '/smk3/material' },
      { label: '9.1 Penanganan Material Manual & Mekanis', href: '/smk3/material/9-1' },
      { label: '9.2 Sistem Pengangkutan, Penyimpanan & Pembuangan', href: '/smk3/material/9-2' },
      { label: '9.3 Pengendalian Bahan Kimia Berbahaya (B3)', href: '/smk3/material/9-3' },
      // Elemen 10
      { label: '10. Pengumpulan & Penggunaan Data', href: '/smk3/data' },
      { label: '10.1 Pengumpulan & Pengarsipan Catatan K3', href: '/smk3/data/10-1' },
      { label: '10.2 Analisis Data & Laporan Kinerja K3', href: '/smk3/data/10-2' },
      // Elemen 11
      { label: '11. Pemeriksaan SMK3', href: '/smk3/pemeriksaan' },
      { label: '11.1 Audit Internal SMK3', href: '/smk3/pemeriksaan/11-1' },
      // Elemen 12
      { label: '12. Pengembangan Keterampilan & Kemampuan', href: '/smk3/pelatihan' },
      { label: '12.1 Strategi Pelatihan (TNA, program)', href: '/smk3/pelatihan/12-1' },
      { label: '12.2 Pelatihan bagi Manajemen & Penyelia', href: '/smk3/pelatihan/12-2' },
      { label: '12.3 Pelatihan bagi Tenaga Kerja', href: '/smk3/pelatihan/12-3' },
      { label: '12.4 Pelatihan Pengenalan (Safety Induction)', href: '/smk3/pelatihan/12-4' },
      { label: '12.5 Pelatihan Keahlian Khusus (Sertifikasi)', href: '/smk3/pelatihan/12-5' },
    ],
  },
];

export function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Track which menus are open — default open the one matching current path
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.subItems?.some((s) =>
        (s.href && pathname.startsWith(s.href)) ||
        s.children?.some((c) => pathname.startsWith(c.href))
      )) {
        initial[item.id] = true;
      }
    });
    return initial;
  });

  // Track sub-group expand (misal Documentation & Records)
  const [openSubGroups, setOpenSubGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      item.subItems?.forEach((sub) => {
        if (sub.children?.some((c) => pathname.startsWith(c.href))) {
          initial[sub.label] = true;
        }
      });
    });
    return initial;
  });

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSubGroup = (label: string) => {
    setOpenSubGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const userInitial = user?.name?.charAt(0).toUpperCase() ?? 'U';

  // ── Search logic ──────────────────────────────────────────────────────────
  const q = search.trim().toLowerCase();

  // Filter menu items berdasarkan query pencarian
  const filteredMenuItems = q
    ? menuItems
        .map((item) => {
          // Cek apakah label menu utama cocok
          const menuMatches = item.label.toLowerCase().includes(q);

          // Filter sub-items yang cocok (termasuk children di sub-group)
          const matchedSubs = item.subItems
            ?.map((s) => {
              // Sub-item biasa
              if (!s.children) {
                return s.label.toLowerCase().includes(q) ? s : null;
              }
              // Sub-group (punya children): filter children yang cocok
              const matchedChildren = s.children.filter((c) =>
                c.label.toLowerCase().includes(q)
              );
              const groupMatches = s.label.toLowerCase().includes(q);
              if (groupMatches || matchedChildren.length > 0) {
                return { ...s, children: groupMatches ? s.children : matchedChildren };
              }
              return null;
            })
            .filter(Boolean) as typeof item.subItems;

          if (menuMatches || (matchedSubs && matchedSubs.length > 0)) {
            return {
              ...item,
              subItems: menuMatches ? item.subItems : matchedSubs,
            };
          }
          return null;
        })
        .filter(Boolean) as MenuItem[]
    : menuItems;

  return (
    <>
      {/* ── Hamburger button (MOBILE ONLY) — di luar aside agar selalu terlihat ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-[400] bg-[#231f20] text-white rounded-lg p-2.5 border border-[#3a3535] shadow-lg"
        aria-label="Buka menu sidebar"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* ── Overlay (mobile) ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[350] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-[280px] z-[360]
          bg-[#231f20] text-[#c5c0bb] flex flex-col
          border-r-[3px] border-r-[#f15a22]
          overflow-y-auto
          transition-transform duration-300
          md:translate-x-0 md:sticky md:top-0 md:h-screen md:z-auto md:flex-shrink-0
          [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#f15a22] [&::-webkit-scrollbar-thumb]:rounded
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand + close button (mobile) */}
        <div className="flex items-center gap-3.5 px-6 py-5 border-b border-[#3a3535] flex-shrink-0">
          <div className="w-10 h-10 bg-[#f15a22] rounded-lg flex items-center justify-center font-extrabold text-lg text-white flex-shrink-0">
            K3
          </div>
          <div className="flex-1">
            <div className="font-bold text-base text-white tracking-wide leading-tight">SMK3 System</div>
            <div className="text-[10px] text-[#6b6560] tracking-widest uppercase mt-0.5">PT. QMB New Energy Materials</div>
          </div>
          {/* Close button — hanya terlihat di mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-[#6b6560] hover:text-white transition-colors p-1 ml-auto"
            aria-label="Tutup sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search box */}
        <div className="px-4 py-3 border-b border-[#3a3535] flex-shrink-0">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6560] pointer-events-none"
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu..."
              className="w-full bg-[#2e2a2b] text-[#c5c0bb] text-[12px] placeholder-[#6b6560] pl-8 pr-7 py-2 rounded-lg border border-[#3a3535] focus:outline-none focus:border-[#f15a22] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b6560] hover:text-white transition-colors"
                aria-label="Hapus pencarian"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Quick navigation links */}
        <div className="px-4 py-3 border-b border-[#3a3535] flex-shrink-0 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] text-[#8a8580] hover:bg-[rgba(241,90,34,0.12)] hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Kembali ke Home</span>
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] text-[#8a8580] hover:bg-[rgba(241,90,34,0.12)] hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Safety Complaint</span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-2">
          {filteredMenuItems.length === 0 && q && (
            <div className="px-3 py-6 text-center">
              <p className="text-[12px] text-[#6b6560]">Tidak ada menu yang cocok</p>
              <p className="text-[11px] text-[#4a4545] mt-1">&ldquo;{search}&rdquo;</p>
            </div>
          )}
          {filteredMenuItems.map((item, index) => {
            // Sembunyikan divider jika sedang search
            const isDivider = !q && index === filteredMenuItems.findIndex(i => i.id === 'safety-compliance');
            const isMenuActive =
              item.href
                ? isActive(item.href)
                : item.subItems?.some((s) =>
                    (s.href ? isActive(s.href) : false) ||
                    s.children?.some((c) => isActive(c.href))
                  );

            // Saat ada query: paksa buka semua menu yang masuk hasil filter
            const isOpen = q ? true : openMenus[item.id];

            return (
              <React.Fragment key={item.id}>
                {isDivider && <div className="h-px bg-[#3a3535] my-2 mx-2" />}

                <div className="mb-0.5">
                  {/* Menu header */}
                  {item.href ? (
                    // Direct link (Dashboard)
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                        isMenuActive
                          ? 'bg-[rgba(241,90,34,0.18)] text-[#f15a22] font-semibold'
                          : 'text-[#a09b96] hover:bg-[rgba(241,90,34,0.12)] hover:text-white'
                      }`}
                    >
                      <span className="w-5 flex justify-center flex-shrink-0">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  ) : (
                    // Collapsible menu
                    <button
                      onClick={() => !q && toggleMenu(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors text-left ${
                        isMenuActive
                          ? 'bg-[rgba(241,90,34,0.18)] text-[#f15a22] font-semibold'
                          : 'text-[#a09b96] hover:bg-[rgba(241,90,34,0.12)] hover:text-white'
                      }`}
                    >
                      <span className="w-5 flex justify-center flex-shrink-0">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {!q && (
                        <svg
                          width="11" height="11"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          className={`flex-shrink-0 text-[#6b6560] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      )}
                    </button>
                  )}

                  {/* Sub-items */}
                  {item.subItems && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen
                          ? item.id === 'smk3-audit' ? 'max-h-[3000px] opacity-100' : 'max-h-[600px] opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pl-2 mt-0.5">
                        {item.subItems.map((sub) => {
                          const isElementHeader = /^\d+\.\s/.test(sub.label);

                          // Highlight teks yang cocok dengan query
                          const highlightLabel = (label: string) => {
                            if (!q) return label;
                            const idx = label.toLowerCase().indexOf(q);
                            if (idx === -1) return label;
                            return (
                              <>
                                {label.slice(0, idx)}
                                <mark className="bg-[#f15a22]/30 text-white rounded px-0.5">
                                  {label.slice(idx, idx + q.length)}
                                </mark>
                                {label.slice(idx + q.length)}
                              </>
                            );
                          };

                          // ── Sub-group (punya children, misal Documentation & Records) ──
                          if (sub.children) {
                            const subGroupOpen = q ? true : !!openSubGroups[sub.label];
                            const subGroupActive = sub.children.some((c) => isActive(c.href));
                            return (
                              <div key={sub.label}>
                                {/* Header sub-group */}
                                <button
                                  onClick={() => !q && toggleSubGroup(sub.label)}
                                  className={`w-full flex items-center gap-2.5 rounded-md text-[12px] my-px py-1.5 px-3 pl-11 transition-colors text-left ${
                                    subGroupActive
                                      ? 'text-[#f15a22] bg-[rgba(241,90,34,0.06)]'
                                      : 'text-[#8a8580] hover:bg-[rgba(241,90,34,0.06)] hover:text-white'
                                  }`}
                                >
                                  <span className={`w-1 h-1 rounded-full flex-shrink-0 ${subGroupActive ? 'bg-[#f15a22]' : 'bg-[#6b6560]'}`} />
                                  <span className="flex-1">{highlightLabel(sub.label)}</span>
                                  {!q && (
                                    <svg
                                      width="10" height="10"
                                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                      className={`flex-shrink-0 text-[#6b6560] transition-transform duration-200 ${subGroupOpen ? 'rotate-90' : ''}`}
                                    >
                                      <path d="m9 18 6-6-6-6" />
                                    </svg>
                                  )}
                                </button>
                                {/* Children sub-group */}
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${subGroupOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                  <div className="pl-2">
                                    {sub.children.map((child) => {
                                      const childActive = isActive(child.href);
                                      return (
                                        <Link
                                          key={child.href}
                                          href={child.href}
                                          onClick={() => { setMobileOpen(false); setSearch(''); }}
                                          className={`flex items-center gap-2 rounded-md text-[11px] my-px py-1.5 px-3 pl-14 transition-colors ${
                                            childActive
                                              ? 'text-[#f15a22] bg-[rgba(241,90,34,0.06)]'
                                              : 'text-[#8a8580] hover:bg-[rgba(241,90,34,0.06)] hover:text-white'
                                          }`}
                                        >
                                          <span className={`w-1 h-1 rounded-full flex-shrink-0 ${childActive ? 'bg-[#f15a22]' : 'bg-[#6b6560]'}`} />
                                          {highlightLabel(child.label)}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // ── Sub-item biasa (punya href) ──
                          const subActive = isActive(sub.href!);
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href!}
                              onClick={() => { setMobileOpen(false); setSearch(''); }}
                              className={`flex items-center gap-2.5 rounded-md text-[12px] my-px transition-colors ${
                                isElementHeader
                                  ? `py-2 px-3 pl-8 font-semibold tracking-wide ${
                                      subActive
                                        ? 'text-[#f15a22] bg-[rgba(241,90,34,0.08)]'
                                        : 'text-[#c5c0bb] hover:bg-[rgba(241,90,34,0.08)] hover:text-white'
                                    }`
                                  : `py-1.5 px-3 pl-11 ${
                                      subActive
                                        ? 'text-[#f15a22] bg-[rgba(241,90,34,0.06)]'
                                        : 'text-[#8a8580] hover:bg-[rgba(241,90,34,0.06)] hover:text-white'
                                    }`
                              }`}
                            >
                              {!isElementHeader && (
                                <span className={`w-1 h-1 rounded-full flex-shrink-0 ${subActive ? 'bg-[#f15a22]' : 'bg-[#6b6560]'}`} />
                              )}
                              {highlightLabel(sub.label)}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-[#3a3535]">
          {/* Admin panel link (hanya untuk admin) */}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-5 py-3 text-[12px] text-[#8a8580] hover:bg-[rgba(241,90,34,0.12)] hover:text-[#f15a22] transition-colors border-b border-[#3a3535]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M20 21a8 8 0 1 0-16 0" />
                <path d="M16 11l1.5 1.5L20 10" />
              </svg>
              <span>Admin Panel</span>
            </Link>
          )}

          {/* User info + logout */}
          <div className="flex items-center gap-2.5 px-5 py-4">
            <div className="w-7 h-7 rounded-full bg-[#f15a22] flex items-center justify-center font-semibold text-[12px] text-white flex-shrink-0">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-[#e5e0db] truncate">{user?.name ?? 'User'}</div>
              <div className="text-[10px] text-[#6b6560] truncate">{user?.email ?? ''}</div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="text-[#6b6560] hover:text-[#f15a22] transition-colors ml-1 flex-shrink-0"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
