import { Section, MaxWidth } from "@/app/components/Section";

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-[#f15a22] py-[calc(72px+64px)] px-5 md:px-10">
        <MaxWidth>
          <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-white/65 mb-4">
            Our Commitment
          </div>
          <h1 className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(48px,7vw,88px)]">
            OHS Policy<br />PT. QMB New Energy Materials
          </h1>
        </MaxWidth>
      </div>

      {/* Vision Section */}
      <Section className="bg-[#231f20]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f7941d] mb-4">
              Our Philosophy
            </div>
            <div className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] text-[clamp(32px,4vw,56px)] mb-6">
              Life Above<br />Everything.<br />No Safety<br />No Work.
            </div>
            <p className="text-[15px] text-[#c5c0bb] leading-relaxed mb-6">
              PT. QMB New Energy Materials is committed to becoming an accomplished enterprise by consistently and sustainably implementing an Occupational Health and Safety Management System (OHSMS) across all operational stages. This ensures optimal work quality, establishes a healthy and safe workplace for all employees, and guarantees compliance with all applicable laws and regulations.
            </p>
          </div>
          <div className="space-y-2">
            <div className="bg-[#2d2929] border-l-4 border-l-[#f7941d] p-7">
              <div className="font-barlow-condensed text-[18px] font-bold uppercase text-white mb-2">
                Prevent Accidents & Occupational Diseases
              </div>
              <p className="text-[14px] text-[#c5c0bb] leading-relaxed">
                Enhance stakeholder satisfaction and awareness by preventing workplace accidents and occupational illnesses.
              </p>
            </div>
            <div className="bg-[#2d2929] border-l-4 border-l-[#f7941d] p-7">
              <div className="font-barlow-condensed text-[18px] font-bold uppercase text-white mb-2">
                No Safety, No Work
              </div>
              <p className="text-[14px] text-[#c5c0bb] leading-relaxed">
                Apply the concept "Life Above Everything. No Safety, No Work" and comply with applicable regulations.
              </p>
            </div>
            <div className="bg-[#2d2929] border-l-4 border-l-[#f7941d] p-7">
              <div className="font-barlow-condensed text-[18px] font-bold uppercase text-white mb-2">
                Competent & Professional Workforce
              </div>
              <p className="text-[14px] text-[#c5c0bb] leading-relaxed">
                Develop human resources with OHS culture who are competent and professional.
              </p>
            </div>
            <div className="bg-[#2d2929] border-l-4 border-l-[#f7941d] p-7">
              <div className="font-barlow-condensed text-[18px] font-bold uppercase text-white mb-2">
                OHSMS Implementation & Continuous Improvement
              </div>
              <p className="text-[14px] text-[#c5c0bb] leading-relaxed">
                Review OHSMS implementation and promote continuous improvement of performance.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* GENERAL & SPECIFIC POLICIES */}
      <Section className="bg-[#faf9f7]">
        <div className="mb-16">
          <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] flex items-center gap-3 mb-4">
            <span>Official Documents</span>
            <span className="w-10 h-0.5 bg-[#f15a22]"></span>
          </div>
          <h2 className="font-barlow-condensed font-extrabold text-[#231f20] uppercase leading-tight text-[clamp(32px,4vw,56px)]">
            Occupational Health and<br />Safety Policy
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* General Policy */}
          <div className="bg-white border-t-4 border-t-[#f15a22] shadow-md p-8 md:p-10">
            <div className="flex items-center justify-between mb-6">
              <span className="font-barlow-condensed text-[22px] font-bold tracking-[0.2em] uppercase text-[#f15a22] bg-[#faf9f7] px-3 py-1">
                General Policy
              </span>              
            </div>
            <p className="text-[14px] text-[#231f20] leading-relaxed mb-6 border-l-4 border-l-[#f7941d] pl-4">
              PT. QMB New Energy Materials is dedicated to becoming an outstanding company by consistently and sustainably implementing the Occupational Safety and Health Management System (SMK3) at every stage of work. This commitment ensures high-quality performance, a safe and healthy workplace for all employees, and full compliance with applicable laws and regulations. Therefore, PT. QMB New Energy Materials is committed to:
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f15a22] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p className="text-[14px] text-[#6b6560] leading-relaxed">Implementing the safety concept, <span className="font-semibold">“Life Above Everything. No Safety, No Work”</span>, and complying with all occupational safety and health requirements.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f15a22] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p className="text-[14px] text-[#6b6560] leading-relaxed">Enhancing stakeholder trust by preventing workplace accidents and occupational diseases.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f15a22] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p className="text-[14px] text-[#6b6560] leading-relaxed">Developing competent, professional, and safety‑culture‑oriented human resources.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f15a22] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</div>
                <p className="text-[14px] text-[#6b6560] leading-relaxed">Conducting regular reviews of SMK3 implementation and continuously driving performance improvement.</p>
              </div>
            </div>
            <div className="pt-6 text-[14px] text-[#6b6560]">
              This General Policy shall be communicated to all employees, implemented across all work processes, and regularly evaluated to ensure alignment with the company’s needs.
            </div>
          </div>

          {/* Specific Policy */}
          <div className="bg-white border-t-4 border-t-[#f7941d] shadow-md p-8 md:p-10">
            <div className="flex items-center justify-between mb-6">
              <span className="font-barlow-condensed text-[22px] font-bold tracking-[0.2em] uppercase text-[#f7941d] bg-[#faf9f7] px-3 py-1">
                Specific Policy
              </span>              
            </div>
            <p className="text-[14px] text-[#231f20] leading-relaxed mb-6 border-l-4 border-l-[#f15a22] pl-4">
              PT. QMB New Energy Materials is committed to excellence in Occupational Safety and Health Management by consistently ensuring a safe and healthy work environment for all employees and complying with the laws and regulations of the Republic of Indonesia. Therefore, PT. QMB New Energy Materials is committed to:
            </p>
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f7941d] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <p className="text-[14px] text-[#6b6560] leading-relaxed">Becoming a company free from the misuse of narcotics, psychotropics, addictive substances, alcoholic beverages, and cigarettes in the workplace, by implementing prevention and mitigation programs and appointing the Occupational Safety and Health Committee (P2K3) as the responsible holder for the program.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#f7941d] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <p className="text-[14px] text-[#6b6560] leading-relaxed">Preventing the spread of HIV/AIDS in the workplace and protecting employees with HIV/AIDS from discrimination, in accordance with applicable laws and regulations.</p>
                </div>
              </div>
            </div>
            <div className="pt-6 text-[14px] text-[#6b6560]">
              This Specific Policy is designed to be understood by all workers, communicated and implemented throughout every work process, and evaluated by management for continuous improvement.
            </div>
          </div>
        </div>
      </Section>

      {/* Management Commitment */}
      <Section className="bg-[#ffffff]">
        <div className="text-center max-w-3xl mx-auto">
          <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] mb-4">
            Top Management Commitment
          </div>
          <div className="font-barlow-condensed text-[clamp(24px,3vw,36px)] font-bold text-[#231f20] leading-[1.35] mb-8">
            "Safety is the uncompromising foundation of every operational decision. We affirm that no production target will ever take precedence over the safety and health of our employees."
          </div>
          <div className="bg-[#f15a22] p-7 inline-block text-center">
            <div className="font-barlow-condensed text-[20px] font-extrabold uppercase text-white mb-1">
              Peng Yaguang
            </div>
            <div className="text-[13px] text-white/75">
              President Director – PT. QMB New Energy Materials
            </div>
          </div>
        </div>
      </Section>

      {/* Regulatory Framework */}
      <section className="bg-[#231f20] py-20 px-5 md:px-10">
        <MaxWidth>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
            <div>
              <div className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] text-[clamp(28px,4vw,48px)]">
                Regulatory<br />Framework
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="inline-block bg-[#f15a22] text-white font-barlow-condensed font-bold text-[13px] tracking-[0.1em] uppercase px-4 py-2 mb-4">
                Government Regulation No. 50 of 2012
              </div>
              <p className="text-[15px] text-[#c5c0bb] leading-relaxed">
                Government Regulation No. 50 of 2012 concerning the Implementation of Occupational Health and Safety Management Systems (OHSMS) serves as the primary reference for OHS policy implementation at PT. QMB. All programs, reporting structures, and OHS personnel competencies are aligned with this regulation. Annual compliance verification is conducted by certified internal and external auditors.
              </p>
            </div>
          </div>
        </MaxWidth>
      </section>
    </>
  );
}
