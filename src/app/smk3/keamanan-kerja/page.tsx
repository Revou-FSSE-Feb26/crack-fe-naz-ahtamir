"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const subElements = [
  { id: "6.1", title: "Sistem Kerja (prosedur, izin kerja, APD)", description: "Prosedur kerja aman, work permit, dan penggunaan APD" },
  { id: "6.2", title: "Pengawasan", description: "Sistem supervisi dan monitoring keselamatan kerja" },
  { id: "6.3", title: "Seleksi & Penempatan Personil", description: "Proses seleksi dan penempatan berdasarkan kompetensi K3" },
  { id: "6.4", title: "Area Terbatas (LOTO, rambu K3)", description: "Pengendalian area terbatas, LOTO, dan signage K3" },
  { id: "6.5", title: "Pemeliharaan, Perbaikan & Perubahan Sarana Produksi", description: "Maintenance dan modifikasi dengan mempertimbangkan K3" },
  { id: "6.6", title: "Pelayanan (kontrak jasa K3)", description: "Pengelolaan kontraktor dan jasa K3" },
  { id: "6.7", title: "Kesiapan Tanggap Darurat", description: "Emergency response plan dan drill" },
  { id: "6.8", title: "Pertolongan Pertama pada Kecelakaan (P3K)", description: "Fasilitas dan prosedur P3K" },
  { id: "6.9", title: "Rencana Pemulihan Kondisi Darurat", description: "Business continuity dan recovery plan" },
];

export default function KeamananKerjaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <div className="bg-[#231f20] py-[calc(72px+64px)] px-5 md:px-10 border-b-[4px] border-b-[#f7941d]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/smk3" className="text-[#c5c0bb] hover:text-[#f7941d] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            </Link>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#c5c0bb]">Dashboard</div>
            <div className="text-[#c5c0bb]">/</div>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f7941d]">Elemen 6</div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#f7941d] w-16 h-16 flex items-center justify-center text-white font-barlow-condensed font-extrabold text-[24px]">6</div>
            <div><h1 className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(32px,5vw,56px)]">Keamanan Bekerja<br />Berdasarkan SMK3</h1></div>
          </div>
          <p className="text-[#c5c0bb] text-[14px] max-w-3xl">Standar keamanan kerja sesuai SMK3 termasuk prosedur, pengawasan, dan tanggap darurat</p>
        </div>
      </div>

      <section className="py-16 md:py-24 px-5 md:px-10 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f7941d] flex items-center gap-3 mb-4">
              <span>9 Sub-Elemen</span><span className="w-10 h-0.5 bg-[#f7941d]"></span>
            </div>
            <h2 className="font-barlow-condensed font-extrabold text-[#231f20] uppercase leading-tight text-[clamp(28px,4vw,48px)]">Pilih Sub-Elemen</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subElements.map((subElement) => (
              <Link key={subElement.id} href={`/smk3/keamanan-kerja/${subElement.id.replace(".", "-")}`}
                className="group bg-white border-l-4 border-l-[#f7941d] p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-l-[#f15a22]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#f7941d] text-white font-barlow-condensed font-extrabold text-[14px] px-3 py-1.5 group-hover:bg-[#f15a22] transition-colors">{subElement.id}</div>
                </div>
                <h3 className="font-barlow-condensed font-bold text-[16px] uppercase text-[#231f20] leading-tight mb-3 group-hover:text-[#f7941d] transition-colors">{subElement.title}</h3>
                <p className="text-[#6b6560] text-[12px] leading-relaxed mb-3">{subElement.description}</p>
                <div className="flex items-center gap-2 text-[#f7941d] font-barlow-condensed font-bold text-[11px] tracking-[0.08em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Lihat Detail</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
