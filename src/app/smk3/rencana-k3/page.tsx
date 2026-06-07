"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const subElements = [
  {
    id: "2.1",
    title: "Rencana Strategi K3 (HIRADC)",
    description: "Hazard Identification, Risk Assessment, and Determining Control",
  },
  {
    id: "2.2",
    title: "Manual SMK3",
    description: "Dokumen manual sistem manajemen K3",
  },
  {
    id: "2.3",
    title: "Peraturan & Persyaratan Lain K3",
    description: "Identifikasi dan pemeliharaan peraturan K3",
  },
  {
    id: "2.4",
    title: "Informasi K3",
    description: "Sistem komunikasi dan penyebaran informasi K3",
  },
];

export default function RencanaK3Page() {
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
      {/* Page Header */}
      <div className="bg-[#231f20] py-[calc(72px+64px)] px-5 md:px-10 border-b-[4px] border-b-[#f7941d]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/smk3" className="text-[#c5c0bb] hover:text-[#f7941d] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </Link>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#c5c0bb]">Dashboard</div>
            <div className="text-[#c5c0bb]">/</div>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f7941d]">Elemen 2</div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#f7941d] w-16 h-16 flex items-center justify-center text-white font-barlow-condensed font-extrabold text-[24px]">2</div>
            <div>
              <h1 className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(32px,5vw,56px)]">
                Pembuatan &<br />Pendokumentasian Rencana K3
              </h1>
            </div>
          </div>
          <p className="text-[#c5c0bb] text-[14px] max-w-3xl">
            Perencanaan dan dokumentasi program K3 termasuk HIRADC, manual SMK3, dan peraturan terkait
          </p>
        </div>
      </div>

      {/* Sub Elements Grid */}
      <section className="py-16 md:py-24 px-5 md:px-10 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f7941d] flex items-center gap-3 mb-4">
              <span>4 Sub-Elemen</span>
              <span className="w-10 h-0.5 bg-[#f7941d]"></span>
            </div>
            <h2 className="font-barlow-condensed font-extrabold text-[#231f20] uppercase leading-tight text-[clamp(28px,4vw,48px)]">
              Pilih Sub-Elemen
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subElements.map((subElement) => (
              <Link
                key={subElement.id}
                href={`/smk3/rencana-k3/${subElement.id.replace(".", "-")}`}
                className="group bg-white border-l-4 border-l-[#f7941d] p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-l-[#f15a22]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#f7941d] text-white font-barlow-condensed font-extrabold text-[16px] px-4 py-2 group-hover:bg-[#f15a22] transition-colors">
                    {subElement.id}
                  </div>
                  <h3 className="font-barlow-condensed font-bold text-[18px] uppercase text-[#231f20] leading-tight group-hover:text-[#f7941d] transition-colors">
                    {subElement.title}
                  </h3>
                </div>
                <p className="text-[#6b6560] text-[13px] leading-relaxed mb-4">{subElement.description}</p>
                <div className="flex items-center gap-2 text-[#f7941d] font-barlow-condensed font-bold text-[12px] tracking-[0.08em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Lihat Detail</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-5 md:px-10 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#f8f7f5] border-l-4 border-l-[#f7941d] p-8">
            <h3 className="font-barlow-condensed font-bold text-[18px] uppercase text-[#231f20] mb-4">Tentang Elemen 2</h3>
            <div className="text-[#6b6560] text-[14px] leading-relaxed space-y-3">
              <p>
                <strong>Pembuatan dan Pendokumentasian Rencana K3</strong> mencakup seluruh proses perencanaan 
                strategis K3 yang dimulai dari identifikasi bahaya dan penilaian risiko (HIRADC).
              </p>
              <p>
                Elemen ini memastikan bahwa semua rencana K3 terdokumentasi dengan baik dalam Manual SMK3, 
                sesuai dengan peraturan yang berlaku, dan dikomunikasikan kepada seluruh pihak terkait.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
