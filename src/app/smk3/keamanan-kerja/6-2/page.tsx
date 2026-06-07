"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { subSubElements } from "@/data/subSubElements";

export default function SubElement62Page() {
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

  const subSubElementsList = subSubElements["6.2"] || [];

  return (
    <>
      {/* Page Header */}
      <div className="bg-[#231f20] py-[calc(72px+64px)] px-5 md:px-10 border-b-[4px] border-b-[#f15a22]">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <Link href="/smk3" className="text-[#c5c0bb] hover:text-[#f15a22] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </Link>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#c5c0bb]">SMK3</div>
            <div className="text-[#c5c0bb]">/</div>
            <Link href="/smk3/keamanan-kerja" className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#c5c0bb] hover:text-[#f15a22] transition-colors">
              Elemen 6
            </Link>
            <div className="text-[#c5c0bb]">/</div>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22]">Sub-Elemen 6.2</div>
          </div>

          {/* Title Section */}
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-[#f15a22] px-4 py-2 flex items-center justify-center text-white font-barlow-condensed font-extrabold text-[20px]">
              6.2
            </div>
            <div className="flex-1">
              <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] mb-2">
                Sub-Elemen 6.2
              </div>
              <h1 className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(28px,4vw,48px)]">
                Pengawasan
              </h1>
            </div>
          </div>
          <p className="text-[#c5c0bb] text-[14px] max-w-3xl">
            Sistem pengawasan pelaksanaan pekerjaan
          </p>
        </div>
      </div>

      {/* Sub-Sub Elements Grid */}
      <section className="py-16 md:py-24 px-5 md:px-10 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] flex items-center gap-3 mb-4">
              <span>{subSubElementsList.length} Sub-Sub Elemen</span>
              <span className="w-10 h-0.5 bg-[#f15a22]"></span>
            </div>
            <h2 className="font-barlow-condensed font-extrabold text-[#231f20] uppercase leading-tight text-[clamp(28px,4vw,48px)]">
              Komponen Pengawasan
            </h2>
          </div>

          {/* Grid of Sub-Sub Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subSubElementsList.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white border-t-4 border-t-[#f15a22] p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Number Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#f15a22] text-white font-barlow-condensed font-extrabold text-[14px] px-3 py-1.5 group-hover:bg-[#f7941d] transition-colors">
                    {item.id}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#f15a22]/10 flex items-center justify-center text-[#f15a22] font-barlow-condensed font-bold text-[14px]">
                    {index + 1}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-barlow-condensed font-bold text-[16px] uppercase text-[#231f20] leading-tight mb-3 group-hover:text-[#f15a22] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[#6b6560] text-[13px] leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Action Button */}
                <Link
                  href={`/smk3/keamanan-kerja/6-2/${item.id.replace(/\./g, '-')}`}
                  className="block w-full px-4 py-2.5 bg-[#f15a22] text-white font-barlow-condensed font-bold text-[11px] tracking-[0.08em] uppercase hover:bg-[#f7941d] transition-colors text-center"
                >
                  Kelola Data
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
