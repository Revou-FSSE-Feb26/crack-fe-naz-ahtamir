"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const subSubElements = [
  {
    id: "1.1.1",
    title: "Penetapan Kebijakan K3",
    description: "Proses penetapan dan pengesahan kebijakan K3 oleh manajemen puncak",
  },
  {
    id: "1.1.2",
    title: "Konsultasi Penyusunan Kebijakan K3",
    description: "Konsultasi dengan stakeholder dalam penyusunan kebijakan K3",
  },
  {
    id: "1.1.3",
    title: "Sosialisasi Kebijakan K3",
    description: "Program sosialisasi dan komunikasi kebijakan K3 ke seluruh organisasi",
  },
  {
    id: "1.1.4",
    title: "Kebijakan Khusus K3",
    description: "Kebijakan K3 spesifik untuk area atau aktivitas tertentu",
  },
  {
    id: "1.1.5",
    title: "Tinjauan Berkala Kebijakan K3",
    description: "Review dan update berkala terhadap kebijakan K3",
  },
];

export default function KebijakanK3Page() {
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
            <Link href="/smk3/komitmen" className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#c5c0bb] hover:text-[#f15a22] transition-colors">
              Elemen 1
            </Link>
            <div className="text-[#c5c0bb]">/</div>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22]">Sub-Elemen 1.1</div>
          </div>

          {/* Title Section */}
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-[#f15a22] px-4 py-2 flex items-center justify-center text-white font-barlow-condensed font-extrabold text-[20px]">
              1.1
            </div>
            <div className="flex-1">
              <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] mb-2">
                Sub-Elemen 1.1
              </div>
              <h1 className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(32px,5vw,56px)]">
                Kebijakan K3
              </h1>
            </div>
          </div>
          <p className="text-[#c5c0bb] text-[14px] max-w-3xl">
            Penetapan dan sosialisasi kebijakan K3 perusahaan sebagai komitmen manajemen puncak terhadap keselamatan dan kesehatan kerja
          </p>
        </div>
      </div>

      {/* Sub-Sub Elements Grid */}
      <section className="py-16 md:py-24 px-5 md:px-10 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] flex items-center gap-3 mb-4">
              <span>5 Sub-Sub Elemen</span>
              <span className="w-10 h-0.5 bg-[#f15a22]"></span>
            </div>
            <h2 className="font-barlow-condensed font-extrabold text-[#231f20] uppercase leading-tight text-[clamp(28px,4vw,48px)]">
              Komponen Kebijakan K3
            </h2>
          </div>

          {/* Grid of Sub-Sub Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subSubElements.map((item, index) => (
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
                {item.id === "1.1.1" ? (
                  <Link
                    href="/smk3/komitmen/1-1/penetapan"
                    className="block w-full px-4 py-2.5 bg-[#f15a22] text-white font-barlow-condensed font-bold text-[11px] tracking-[0.08em] uppercase hover:bg-[#f7941d] transition-colors text-center"
                  >
                    Kelola Data
                  </Link>
                ) : item.id === "1.1.2" ? (
                  <Link
                    href="/smk3/komitmen/1-1/konsultasi"
                    className="block w-full px-4 py-2.5 bg-[#f15a22] text-white font-barlow-condensed font-bold text-[11px] tracking-[0.08em] uppercase hover:bg-[#f7941d] transition-colors text-center"
                  >
                    Kelola Data
                  </Link>
                ) : (
                  <Link
                  href={`/smk3/komitmen/1-1/${item.id.replace(/\./g, '-')}`}
                  className="block w-full px-4 py-2.5 bg-[#f15a22] text-white font-barlow-condensed font-bold text-[11px] tracking-[0.08em] uppercase hover:bg-[#f7941d] transition-colors text-center"
                >
                  Kelola Data
                </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-5 md:px-10 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - About */}
            <div className="bg-[#f8f7f5] border-l-4 border-l-[#f15a22] p-8">
              <h3 className="font-barlow-condensed font-bold text-[18px] uppercase text-[#231f20] mb-4">
                Tentang Kebijakan K3
              </h3>
              <div className="text-[#6b6560] text-[14px] leading-relaxed space-y-3">
                <p>
                  <strong>Kebijakan K3</strong> merupakan pernyataan tertulis yang ditandatangani oleh 
                  pengusaha atau pengurus yang memuat keseluruhan visi dan tujuan perusahaan, komitmen 
                  dan tekad melaksanakan K3, kerangka dan program kerja yang mencakup kegiatan perusahaan 
                  secara menyeluruh yang bersifat umum dan/atau operasional.
                </p>
                <p>
                  Kebijakan K3 harus dikonsultasikan dengan wakil tenaga kerja, dikomunikasikan kepada 
                  seluruh tenaga kerja, tamu, kontraktor, pelanggan dan pemasok, dan ditinjau ulang 
                  secara berkala untuk menjamin bahwa kebijakan tersebut masih sesuai dengan perubahan 
                  yang terjadi dalam perusahaan dan peraturan perundangan.
                </p>
              </div>
            </div>

            {/* Right Column - Requirements */}
            <div className="bg-[#f8f7f5] border-l-4 border-l-[#f15a22] p-8">
              <h3 className="font-barlow-condensed font-bold text-[18px] uppercase text-[#231f20] mb-4">
                Persyaratan Kebijakan K3
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f15a22] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-[#6b6560] text-[13px] leading-relaxed">
                    Ditandatangani oleh pengusaha atau pengurus perusahaan
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f15a22] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-[#6b6560] text-[13px] leading-relaxed">
                    Memuat visi, tujuan, dan komitmen K3 perusahaan
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f15a22] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-[#6b6560] text-[13px] leading-relaxed">
                    Dikonsultasikan dengan wakil tenaga kerja
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f15a22] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-[#6b6560] text-[13px] leading-relaxed">
                    Disosialisasikan kepada seluruh pihak terkait
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f15a22] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-[#6b6560] text-[13px] leading-relaxed">
                    Ditinjau ulang secara berkala minimal 1 tahun sekali
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#f15a22] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-[#6b6560] text-[13px] leading-relaxed">
                    Terdokumentasi dan mudah diakses oleh semua pihak
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-5 md:px-10 bg-[#f8f7f5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {subSubElements.map((item, index) => (
              <div key={item.id} className="bg-white p-6 text-center border-t-2 border-t-[#f15a22]">
                <div className="font-barlow-condensed font-extrabold text-[32px] text-[#f15a22] mb-2">
                  {index + 1}
                </div>
                <div className="font-barlow-condensed font-bold text-[11px] tracking-[0.08em] uppercase text-[#6b6560]">
                  {item.title.split(' ').slice(0, 2).join(' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
