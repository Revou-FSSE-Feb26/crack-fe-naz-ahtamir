"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const subElements = [
  { id: "11.1", title: "Audit Internal SMK3", description: "Internal audit dan compliance check" },
];

export default function PemeriksaanPage() {
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
      <div className="bg-[#231f20] py-[calc(72px+64px)] px-5 md:px-10 border-b-[4px] border-b-[#f15a22]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/smk3" className="text-[#c5c0bb] hover:text-[#f15a22] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            </Link>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#c5c0bb]">Dashboard</div>
            <div className="text-[#c5c0bb]">/</div>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22]">Elemen 11</div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#f15a22] w-16 h-16 flex items-center justify-center text-white font-barlow-condensed font-extrabold text-[24px]">11</div>
            <div><h1 className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(32px,5vw,56px)]">Pemeriksaan<br />SMK3</h1></div>
          </div>
          <p className="text-[#c5c0bb] text-[14px] max-w-3xl">Audit dan inspeksi sistem SMK3 untuk memastikan compliance dan efektivitas</p>
        </div>
      </div>

      <section className="py-16 md:py-24 px-5 md:px-10 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] flex items-center gap-3 mb-4">
              <span>1 Sub-Elemen</span><span className="w-10 h-0.5 bg-[#f15a22]"></span>
            </div>
            <h2 className="font-barlow-condensed font-extrabold text-[#231f20] uppercase leading-tight text-[clamp(28px,4vw,48px)]">Pilih Sub-Elemen</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subElements.map((subElement) => (
              <Link key={subElement.id} href="/smk3/pemeriksaan/11-1"
                className="group bg-white border-l-4 border-l-[#f15a22] p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-l-[#f7941d]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#f15a22] text-white font-barlow-condensed font-extrabold text-[16px] px-4 py-2 group-hover:bg-[#f7941d] transition-colors">{subElement.id}</div>
                  <h3 className="font-barlow-condensed font-bold text-[18px] uppercase text-[#231f20] leading-tight group-hover:text-[#f15a22] transition-colors">{subElement.title}</h3>
                </div>
                <p className="text-[#6b6560] text-[13px] leading-relaxed mb-4">{subElement.description}</p>
                <div className="flex items-center gap-2 text-[#f15a22] font-barlow-condensed font-bold text-[12px] tracking-[0.08em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Lihat Detail</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
