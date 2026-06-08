import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero Section with Video Background */}
      <section className="relative w-full h-screen min-h-[600px] bg-[#231f20] flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          aria-label="K3 Implementation Video Background"
        >
          <source src="/videos/Video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/28 z-1"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f15a22] z-3"></div>

        <div className="relative z-2 text-center px-6 max-w-[900px]">
          <div className="inline-block bg-[#f15a22] text-white font-barlow-condensed font-bold text-[11px] tracking-[0.2em] uppercase px-4 py-1.5 mb-7">
            Emergency Response Management Department
          </div>
          <h1 className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] tracking-[-0.01em] mb-6 text-[clamp(39px,7vw,62px)]">
            Life Above Everything<br />
            <span className="text-[#f7941d]">No Safety No Work</span>
          </h1>
          <p className="font-barlow font-normal text-white/85 max-w-[580px] mx-auto mb-10 leading-relaxed text-[clamp(14px,2vw,16px)] tracking-wide">
            Public Safety Reports & Performance KPIs — Transparent since 2019.
            Real data. Real accountability. A safer workplace, every shift.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2.5 bg-[#f15a22] text-white border-2 border-[#f15a22] font-barlow-condensed font-bold text-sm tracking-[0.12em] uppercase px-8 py-4 btn-transition hover:bg-white hover:text-[#f15a22] hover:border-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M18 9l-5 5-4-4-3 3" />
              </svg>
              View Latest Public Report
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2.5 bg-transparent text-white border-2 border-white font-barlow-condensed font-bold text-sm tracking-[0.12em] uppercase px-8 py-4 btn-transition hover:bg-[#f15a22] hover:border-[#f15a22]"
            >
              Report a Safety Concern
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-3 flex flex-col items-center gap-2 text-white/50 font-barlow-condensed text-[10px] tracking-[0.15em] uppercase">
          <div className="w-px h-10 bg-[#f15a22] animate-scroll-pulse"></div>
          Scroll
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#f15a22]">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Card 1 */}
          <div className="p-12 md:p-[52px] border-r border-white/20 relative">
            <div className="absolute top-6 right-6 w-2 h-2 bg-white rounded-full opacity-40 stat-dot"></div>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 mb-4">
              Days Since Last Lost Time Injury
            </div>
            <div className="font-barlow-condensed font-extrabold text-white text-[clamp(42px,6vw,72px)] leading-none mb-2">
              487
            </div>
            <div className="font-barlow text-sm text-white/65">
              consecutive safe days
            </div>
          </div>
          {/* Card 2 */}
          <div className="p-12 md:p-[52px] border-r border-white/20 relative">
            <div className="absolute top-6 right-6 w-2 h-2 bg-white rounded-full opacity-40"></div>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 mb-4">
              Safe Manhours Achieved
            </div>
            <div className="font-barlow-condensed font-extrabold text-white text-[clamp(42px,6vw,72px)] leading-none mb-2">
              12.45
              <small className="text-[0.4em] align-super">M</small>
            </div>
            <div className="font-barlow text-sm text-white/65">
              manhours without LTI — YTD
            </div>
          </div>
          {/* Card 3 */}
          <div className="p-12 md:p-[52px] relative">
            <div className="absolute top-6 right-6 w-2 h-2 bg-white rounded-full opacity-40"></div>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-white/70 mb-4">
              Certified Trainings Completed
            </div>
            <div className="font-barlow-condensed font-extrabold text-white text-[clamp(42px,6vw,72px)] leading-none mb-2">
              1,280
            </div>
            <div className="font-barlow text-sm text-white/65">
              certifications issued YTD
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Strip */}
      <div className="bg-[#231f20] py-7 px-5 md:px-10 flex flex-wrap md:flex-nowrap items-center gap-8 overflow-hidden">
        <span className="font-barlow-condensed text-[10px] font-bold tracking-[0.2em] uppercase text-[#f15a22] whitespace-nowrap shrink-0">
          Latest
        </span>
        <div className="w-px h-5 bg-[#3a3535] shrink-0"></div>
        <div className="flex gap-12 overflow-hidden flex-wrap md:flex-nowrap">
          <span className="font-barlow-condensed text-[13px] font-semibold tracking-[0.08em] uppercase text-[#c5c0bb] whitespace-nowrap">
            National Safety Month Campaign Active
          </span>
          <span className="text-[#f15a22] whitespace-nowrap">&bull;</span>
          <span className="font-barlow-condensed text-[13px] font-semibold tracking-[0.08em] uppercase text-[#c5c0bb] whitespace-nowrap">
            BNSP Certification Batch 12 — Completed
          </span>
          <span className="text-[#f15a22] whitespace-nowrap">&bull;</span>
          <span className="font-barlow-condensed text-[13px] font-semibold tracking-[0.08em] uppercase text-[#c5c0bb] whitespace-nowrap">
            Emergency Response Drill Q2 — Passed
          </span>
          <span className="text-[#f15a22] whitespace-nowrap">&bull;</span>
          <span className="font-barlow-condensed text-[13px] font-semibold tracking-[0.08em] uppercase text-[#c5c0bb] whitespace-nowrap">
            LTIFR: 0.12 — New Record Low
          </span>
        </div>
      </div>

      {/* Programs Preview */}
      <div className="py-16 md:py-24 px-5 md:px-10 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] flex items-center gap-3 mb-4">
              <span>Programs & Initiatives</span>
              <span className="w-10 h-0.5 bg-[#f15a22]"></span>
            </div>
            <h2 className="font-barlow-condensed font-extrabold text-[#231f20] uppercase leading-tight text-[clamp(36px,5vw,60px)]">
              Safety is<br />built, daily.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px]">
            {/* Card 1 */}
            <div className="bg-white border-l-4 border-l-[#f7941d] p-[40px_36px] program-card-hover hover:border-l-[#f15a22] hover:bg-[#f2f0ee] transition-all cursor-default">
              <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] text-[#f7941d] mb-5">
                01 — Annual Campaign
              </div>
              <div className="font-barlow-condensed font-bold text-xl md:text-[22px] uppercase text-[#231f20] mb-3 leading-tight">
                National Safety Month<br />(Bulan K3)
              </div>
              <p className="text-sm text-[#6b6560] leading-relaxed">
                Annual month-long campaign aligned with Indonesian K3 National
                Day, featuring competitions, seminars, and recognition events to
                embed safety culture across all work units.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white border-l-4 border-l-[#f7941d] p-[40px_36px] program-card-hover hover:border-l-[#f15a22] hover:bg-[#f2f0ee] transition-all cursor-default">
              <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] text-[#f7941d] mb-5">
                02 — Competency
              </div>
              <div className="font-barlow-condensed font-bold text-xl md:text-[22px] uppercase text-[#231f20] mb-3 leading-tight">
                BNSP Certification<br />Training
              </div>
              <p className="text-sm text-[#6b6560] leading-relaxed">
                Nationally accredited occupational competency certification
                through BNSP, ensuring workers meet Indonesian national standards
                for their safety-critical roles.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white border-l-4 border-l-[#f7941d] p-[40px_36px] program-card-hover hover:border-l-[#f15a22] hover:bg-[#f2f0ee] transition-all cursor-default">
              <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] text-[#f7941d] mb-5">
                03 — Emergency Preparedness
              </div>
              <div className="font-barlow-condensed font-bold text-xl md:text-[22px] uppercase text-[#231f20] mb-3 leading-tight">
                Emergency Response<br />Simulation
              </div>
              <p className="text-sm text-[#6b6560] leading-relaxed">
                Full-scale emergency drills conducted quarterly including fire
                evacuation, chemical spill containment, and medical response
                scenarios specific to nickel smelting hazards.
              </p>
            </div>
            {/* Card 4 */}
            <div className="bg-white border-l-4 border-l-[#f7941d] p-[40px_36px] program-card-hover hover:border-l-[#f15a22] hover:bg-[#f2f0ee] transition-all cursor-default">
              <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] text-[#f7941d] mb-5">
                04 — Daily Culture
              </div>
              <div className="font-barlow-condensed font-bold text-xl md:text-[22px] uppercase text-[#231f20] mb-3 leading-tight">
                Daily Safety Awareness<br />Briefings
              </div>
              <p className="text-sm text-[#6b6560] leading-relaxed">
                Pre-shift safety briefings (Toolbox Talk) conducted daily at every
                work area, reinforcing hazard identification, near-miss reporting,
                and PPE compliance.
              </p>
            </div>
          </div>

          <div className="mt-8 text-right">
            <a
              href="/programs"
              className="inline-flex items-center gap-2.5 bg-[#f15a22] text-white border-2 border-[#f15a22] font-barlow-condensed font-bold text-sm tracking-[0.12em] uppercase px-8 py-4 btn-transition hover:bg-white hover:text-[#f15a22]"
            >
              View All Programs
            </a>
          </div>
        </div>
      </div>

      {/* CTA Band */}
      <div className="bg-[#f15a22] py-16 md:py-20 px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-lg">
          <h2 className="font-barlow-condensed font-extrabold text-white uppercase leading-tight text-[clamp(28px,4vw,48px)] mb-2">
            Public KPI Dashboard
          </h2>
          <p className="text-[15px] text-white/80 leading-relaxed">
            Full transparency on our safety performance data — LTIFR, TRIR,
            manhours, and annual reports available for public access.
          </p>
        </div>
        <a
          href="/dashboard"
          className="bg-[#231f20] text-white border-2 border-[#231f20] font-barlow-condensed font-bold text-sm tracking-[0.12em] uppercase px-8 py-4 btn-transition whitespace-nowrap hover:bg-transparent hover:border-white"
        >
          Access Dashboard
        </a>
      </div>

      {/* Compliance Section */}
      <div className="bg-[#231f20] py-16 md:py-20 px-5 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f7941d] flex items-center gap-3 mb-4">
            <span>Regulatory Framework</span>
            <span className="w-10 h-0.5 bg-[#f7941d]"></span>
          </div>
          <h2 className="font-barlow-condensed font-extrabold text-white uppercase leading-tight text-[clamp(36px,5vw,60px)]">
            Compliance &<br />Governance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] mt-12">
            <div className="bg-[#2d2929] p-[36px_30px] border-t-[3px] border-t-[#f7941d]">
              <div className="font-barlow-condensed text-[13px] font-bold tracking-[0.1em] uppercase text-[#f7941d] mb-3">
                PP No. 55 Tahun 2010
              </div>
              <p className="text-sm text-[#c5c0bb] leading-relaxed">
                Pembinaan dan Pengawasan Penyelenggaraan Pengelolaan Usaha
                Pertambangan Mineral dan Batubara — our primary regulatory
                reference for OHS in mining operations.
              </p>
            </div>
            <div className="bg-[#2d2929] p-[36px_30px] border-t-[3px] border-t-[#f7941d]">
              <div className="font-barlow-condensed text-[13px] font-bold tracking-[0.1em] uppercase text-[#f7941d] mb-3">
                ISO 45001:2018
              </div>
              <p className="text-sm text-[#c5c0bb] leading-relaxed">
                Occupational Health & Safety Management System certification,
                integrated with our operational procedures and audited annually by
                an independent body.
              </p>
            </div>
            <div className="bg-[#2d2929] p-[36px_30px] border-t-[3px] border-t-[#f7941d]">
              <div className="font-barlow-condensed text-[13px] font-bold tracking-[0.1em] uppercase text-[#f7941d] mb-3">
                ESG Social Pillar
              </div>
              <p className="text-sm text-[#c5c0bb] leading-relaxed">
                Strong OHS performance underpins our Social pillar in ESG,
                building investor and community trust through transparent public
                reporting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
