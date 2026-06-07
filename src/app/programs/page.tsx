import { Section, MaxWidth } from "@/app/components/Section";

const programs = [
  {
    number: "01",
    category: "Annual Campaign",
    title: "National Safety Month (Bulan K3 Nasional)",
    description:
      "Held every January aligned with the Indonesian National K3 Day (12 January), Bulan K3 is our largest annual safety culture event. Activities include safety competitions among work units, external seminars with government inspectors and BNSP officials, safety stand-downs, leadership safety walks, and recognition ceremonies for workers with outstanding safety contributions.",
    tags: ["Annual", "All Departments", "Mandatory", "Regulatory"],
    frequency: "Annual — January",
    participants: "4,200+ workers",
    duration: "Full month",
  },
  {
    number: "02",
    category: "Competency Development",
    title: "BNSP Certification Training",
    description:
      "Nationally accredited occupational competency training and certification through Badan Nasional Sertifikasi Profesi (BNSP). Workers in safety-critical roles — including blast operators, crane operators, LOTO supervisors, and emergency response team leaders — must hold valid BNSP certifications.",
    tags: ["Quarterly Batches", "BNSP Accredited", "Role-Based"],
    frequency: "Quarterly",
    certifications: "1,280 issued",
    accreditation: "BNSP National",
  },
  {
    number: "03",
    category: "Emergency Preparedness",
    title: "Emergency Response Simulation",
    description:
      "Full-scale emergency response drills conducted quarterly across all operational areas. Scenarios are designed specifically for nickel smelting hazards: furnace runout events, molten metal spills, gas leaks, structural fires, and mass casualty incidents.",
    tags: ["Quarterly", "ERT Teams", "BPBD Coordination", "Scenario-Based"],
    frequency: "Quarterly drills",
    lastResult: "PASS — Q2 2024",
    ertMembers: "320 trained",
  },
  {
    number: "04",
    category: "Daily Safety Culture",
    title: "Daily Safety Awareness Briefings (Toolbox Talk)",
    description:
      "Pre-shift Toolbox Talk (TBT) is conducted every day at every work area, led by the area supervisor. Topics rotate based on the Safety Topic Calendar and are supplemented by relevant near-miss reports, recent incidents, or hazard alerts from across the site.",
    tags: ["Daily", "All Shifts", "Mandatory", "Pre-Shift"],
    frequency: "Daily, all shifts",
    attendance: "97.4%",
    topics: "52 rotating",
  },
];

export default function ProgramsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-[#f7941d] py-[calc(72px+64px)] px-5 md:px-10">
        <MaxWidth>
          <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-white/65 mb-4">
            What We Do
          </div>
          <h1 className="font-barlow-condensed font-extrabold text-white uppercase leading-[0.95] tracking-[-0.01em] text-[clamp(48px,7vw,88px)]">
            Programs &<br />Initiatives
          </h1>
        </MaxWidth>
      </div>

      {/* Programs */}
      <Section className="bg-[#faf9f7]">
        <div className="mb-16">
          <div className="font-barlow-condensed text-[11px] font-bold tracking-[0.2em] uppercase text-[#f15a22] flex items-center gap-3 mb-4">
            <span>Active Programs</span>
            <span className="w-10 h-0.5 bg-[#f15a22]"></span>
          </div>
          <h2 className="font-barlow-condensed font-extrabold text-[#231f20] uppercase leading-tight text-[clamp(32px,4vw,56px)]">
            Four Pillars of<br />Safety Culture
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-[2px]">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white border-l-5 border-l-[#f7941d] flex flex-col md:flex-row"
            >
              <div
                className={`font-barlow-condensed font-extrabold text-[28px] text-white min-h-[160px] w-full md:w-[80px] flex items-center justify-center ${
                  index % 2 === 1 ? "bg-[#f7941d]" : "bg-[#f15a22]"
                }`}
              >
                {program.number}
              </div>
              <div className="p-[36px] flex-1">
                <div className="font-barlow-condensed text-[10px] font-bold tracking-[0.2em] uppercase text-[#f7941d] mb-4">
                  {program.category}
                </div>
                <div className="font-barlow-condensed text-[26px] font-extrabold uppercase text-[#231f20] mb-4">
                  {program.title}
                </div>
                <p className="text-[14px] text-[#6b6560] leading-relaxed mb-6">
                  {program.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {program.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-barlow-condensed text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-2 border border-[#c5c0bb] text-[#6b6560]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-[#f2f0ee] p-[28px_24px] min-w-[180px] space-y-6">
                <div>
                  <div className="font-barlow-condensed text-[9px] font-bold tracking-[0.2em] uppercase text-[#6b6560] mb-2">
                    Frequency
                  </div>
                  <div className="font-barlow-condensed text-[15px] font-bold text-[#231f20]">
                    {program.frequency}
                  </div>
                </div>
                {program.participants && (
                  <div>
                    <div className="font-barlow-condensed text-[9px] font-bold tracking-[0.2em] uppercase text-[#6b6560] mb-2">
                      Participants
                    </div>
                    <div className="font-barlow-condensed text-[15px] font-bold text-[#231f20]">
                      {program.participants}
                    </div>
                  </div>
                )}
                {program.duration && (
                  <div>
                    <div className="font-barlow-condensed text-[9px] font-bold tracking-[0.2em] uppercase text-[#6b6560] mb-2">
                      Duration
                    </div>
                    <div className="font-barlow-condensed text-[15px] font-bold text-[#231f20]">
                      {program.duration}
                    </div>
                  </div>
                )}
                {program.certifications && (
                  <div>
                    <div className="font-barlow-condensed text-[9px] font-bold tracking-[0.2em] uppercase text-[#6b6560] mb-2">
                      Certifications 2024
                    </div>
                    <div className="font-barlow-condensed text-[15px] font-bold text-[#231f20]">
                      {program.certifications}
                    </div>
                  </div>
                )}
                {program.accreditation && (
                  <div>
                    <div className="font-barlow-condensed text-[9px] font-bold tracking-[0.2em] uppercase text-[#6b6560] mb-2">
                      Accreditation
                    </div>
                    <div className="font-barlow-condensed text-[15px] font-bold text-[#231f20]">
                      {program.accreditation}
                    </div>
                  </div>
                )}
                {program.lastResult && (
                  <div>
                    <div className="font-barlow-condensed text-[9px] font-bold tracking-[0.2em] uppercase text-[#6b6560] mb-2">
                      Last Drill Result
                    </div>
                    <div className="font-barlow-condensed text-[15px] font-bold text-[#f15a22]">
                      {program.lastResult}
                    </div>
                  </div>
                )}
                {program.ertMembers && (
                  <div>
                    <div className="font-barlow-condensed text-[9px] font-bold tracking-[0.2em] uppercase text-[#6b6560] mb-2">
                      ERT Members
                    </div>
                    <div className="font-barlow-condensed text-[15px] font-bold text-[#231f20]">
                      {program.ertMembers}
                    </div>
                  </div>
                )}
                {program.attendance && (
                  <div>
                    <div className="font-barlow-condensed text-[9px] font-bold tracking-[0.2em] uppercase text-[#6b6560] mb-2">
                      Avg Attendance
                    </div>
                    <div className="font-barlow-condensed text-[15px] font-bold text-[#231f20]">
                      {program.attendance}
                    </div>
                  </div>
                )}
                {program.topics && (
                  <div>
                    <div className="font-barlow-condensed text-[9px] font-bold tracking-[0.2em] uppercase text-[#6b6560] mb-2">
                      Topics per Year
                    </div>
                    <div className="font-barlow-condensed text-[15px] font-bold text-[#231f20]">
                      {program.topics}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats Bar */}
      <div className="bg-[#231f20] py-12 px-5 md:px-10">
        <MaxWidth>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[2px]">
            <div className="bg-[#2d2929] p-[28px_24px] border-t-3 border-t-[#f7941d]">
              <div className="font-barlow-condensed font-extrabold text-[40px] text-[#f15a22] mb-1">
                4
              </div>
              <div className="text-[13px] text-[#c5c0bb]">
                core safety programs running year-round
              </div>
            </div>
            <div className="bg-[#2d2929] p-[28px_24px] border-t-3 border-t-[#f7941d]">
              <div className="font-barlow-condensed font-extrabold text-[40px] text-[#f15a22] mb-1">
                45,200
              </div>
              <div className="text-[13px] text-[#c5c0bb]">
                training hours delivered YTD 2024
              </div>
            </div>
            <div className="bg-[#2d2929] p-[28px_24px] border-t-3 border-t-[#f7941d]">
              <div className="font-barlow-condensed font-extrabold text-[40px] text-[#f15a22] mb-1">
                1,280
              </div>
              <div className="text-[13px] text-[#c5c0bb]">
                BNSP certifications issued in 2024
              </div>
            </div>
            <div className="bg-[#2d2929] p-[28px_24px] border-t-3 border-t-[#f15a22]">
              <div className="font-barlow-condensed font-extrabold text-[40px] text-[#f15a22] mb-1">
                97.4%
              </div>
              <div className="text-[13px] text-[#c5c0bb]">
                average toolbox talk attendance rate
              </div>
            </div>
          </div>
        </MaxWidth>
      </div>
    </>
  );
}
