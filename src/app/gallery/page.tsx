import { Section, MaxWidth } from "@/app/components/Section";

const galleryItems = [
  {
    id: 1,
    category: "Safety Training",
    title: "Safety Training Session",
    date: "Bulan K3 — January 2024",
    colorClass: "bg-[#2a2020]",
  },
  {
    id: 2,
    category: "LOTO Procedure",
    title: "LOTO Procedure Demo",
    date: "OHS Field Inspection — March 2024",
    colorClass: "bg-[#3a2510]",
  },
  {
    id: 3,
    category: "Fire Drill",
    title: "Fire Drill Q1",
    date: "Emergency Response — February 2024",
    colorClass: "bg-[#1a1f2a]",
  },
  {
    id: 4,
    category: "Hazard Inspection",
    title: "Hazard Inspection Round",
    date: "Monthly Inspection — April 2024",
    colorClass: "bg-[#2a1a10]",
  },
  {
    id: 5,
    category: "Safety Award",
    title: "Safety Award Ceremony",
    date: "Annual K3 Award — January 2024",
    colorClass: "bg-[#202a20]",
  },
  {
    id: 6,
    category: "Morning Briefing",
    title: "Morning Safety Briefing",
    date: "Daily Toolbox Talk — May 2024",
    colorClass: "bg-[#231f20]",
  },
];

const resources = [
  {
    type: "Safety Communication",
    title: "Safety Alert Poster",
    meta: "PDF • A3 Print-ready • Updated June 2024",
    href: "#",
  },
  {
    type: "Monthly Publication",
    title: "Monthly Safety Bulletin",
    meta: "PDF • Digital Edition • July 2024",
    href: "#",
  },
  {
    type: "Emergency Reference",
    title: "Emergency Response Pocket Guide",
    meta: "PDF • Pocket-sized A6 • Version 3.2",
    href: "#",
  },
  {
    type: "Training Material",
    title: "PPE Selection Guide",
    meta: "PDF • Illustrated Guide • 2024 Edition",
    href: "#",
  },
];

export default function GalleryPage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-[#231f20] py-[calc(72px+64px)] px-5 md:px-10 border-b-[4px] border-b-[#f15a22]">
        <MaxWidth>
          <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] mb-4">
            Visual Documentation
          </div>
          <h1 className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(48px,7vw,88px)]">
            Gallery &<br />Resources
          </h1>
        </MaxWidth>
      </div>

      {/* Gallery Section */}
      <Section className="bg-[#faf9f7]">
        <div className="mb-16">
          <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] flex items-center gap-3 mb-4">
            <span>Photo Documentation</span>
            <span className="w-10 h-0.5 bg-[#f15a22]"></span>
          </div>
          <h2 className="font-barlow-condensed font-extrabold text-[#231f20] uppercase leading-tight text-[clamp(32px,4vw,56px)]">
            Safety Activities<br />in the Field
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden aspect-[4/3] cursor-pointer group"
            >
              <div
                className={`w-full h-full ${item.colorClass} flex items-end transition-transform duration-300 group-hover:scale-105`}
              ></div>
              <div className="absolute bottom-0 left-0 right-0 bg-[#f15a22] p-5 translate-y-full transition-transform duration-250 group-hover:translate-y-0">
                <div className="font-barlow-condensed text-[16px] font-bold uppercase text-white mb-2">
                  {item.title}
                </div>
                <div className="text-[12px] text-white/70">{item.date}</div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="font-barlow-condensed text-[13px] font-bold tracking-[0.1em] uppercase text-white/30 text-center">
                  {item.category}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[14px] text-[#6b6560] mt-6">
          Hover over each photo for details. All images document actual OHS
          activities. No video content is embedded on this page.
        </p>
      </Section>

      {/* Resources Section */}
      <Section className="bg-[#ffffff]">
        <div className="mb-16">
          <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] flex items-center gap-3 mb-4">
            <span>Downloadable Resources</span>
            <span className="w-10 h-0.5 bg-[#f15a22]"></span>
          </div>
          <h2 className="font-barlow-condensed font-extrabold text-[#231f20] uppercase leading-tight text-[clamp(32px,4vw,56px)]">
            Safety<br />Publications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="bg-[#f2f0ee] border-l-4 border-l-[#f15a22] p-[36px_32px] flex items-center justify-between gap-6"
            >
              <div>
                <div className="font-barlow-condensed text-[10px] font-bold tracking-[0.2em] uppercase text-[#f15a22] mb-3">
                  {resource.type}
                </div>
                <div className="font-barlow-condensed text-[20px] font-bold uppercase text-[#231f20] mb-2">
                  {resource.title}
                </div>
                <div className="text-[13px] text-[#6b6560]">{resource.meta}</div>
              </div>
              <a
                href={resource.href}
                className="inline-flex items-center gap-2 bg-[#231f20] text-white border-2 border-[#231f20] font-barlow-condensed font-bold text-[12px] tracking-[0.12em] uppercase px-5 py-3 hover:bg-[#f15a22] hover:border-[#f15a22] transition-colors whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* Notice Strip */}
      <div className="bg-[#f7941d] py-5 px-5 md:px-10">
        <MaxWidth>
          <div className="font-barlow-condensed text-[14px] font-semibold tracking-[0.05em] text-white">
            No videos are embedded or autoplayed on this page. For video
            documentation, contact the OHS Department directly.
          </div>
        </MaxWidth>
      </div>
    </>
  );
}
