"use client";

import { useState } from "react";

const experiences = [
  {
    id: "01",
    title: "QPRO Sukses Mandiri",
    role: "Application Developer",
    period: "Feb 2026 - Present",
    description:
      "Developed and maintained responsive web application features using Bootstrap and MVC architecture. Built backend APIs for CRUD operations, implemented business logic with JavaScript and C#, and collaborated on creating scalable and maintainable systems with clean code practices.",
    tags: ["MVC", "C#", "REST API", "SQL", ".NET", "Javascript", "Bootstrap"],
    floatDelay: "0s",
    floatDuration: "4.2s",
    rotate: "-2deg",
    photo: "/Photo/Experience/QproPhoto.jpeg",
  },
  {
    id: "02",
    title: "Binus University",
    role: "Assistant Laboratory",
    period: "Sept 2024 — Dec 2025",
    description:
      "Assisted students in understanding programming and software development concepts through hands on mentoring and laboratory sessions. Supported courses involving Python Algorithms, databases, C programming Algorithms, and problem solving while strengthening communication, leadership, and technical guidance skills.",
    tags: ["Public Speaking", "Initative", "Leadership", "Python", "Database", "C", "Problem Solving", "Communication"],
    floatDelay: "0.9s",
    floatDuration: "3.7s",
    rotate: "1.5deg",
    photo: "/Photo/Experience/AssistantLab.png",
  },
  {
    id: "03",
    title: "BURNCUP",
    role: "Vice Project Manager",
    period: "Feb 2025 - Dec 2025",
    description:
      "Coordinated event planning and team collaboration for one of BINUS Bekasi's major student events. Managed project workflows, supported decision-making processes, and worked closely with multiple divisions to ensure smooth execution, effective communication, and timely delivery of responsibilities.",
    tags: ["Leadership", "Management", "Teamwork", "Communication", "Problem Solving", "Critical Thinking"],
    floatDelay: "1.6s",
    floatDuration: "4.8s",
    rotate: "-1deg",
    photo: "/Photo/Experience/Burncup.png",
  },
  {
    id: "04",
    title: "Visecoach",
    role: "IOS Developer & UI/UX Designer",
    period: "Dec 2021 - Aug 2022",
    description:
      "Designed and developed iOS application interfaces using UIKit and Swift while creating user-centered UI/UX designs in Figma. Collaborated on implementing responsive mobile experiences following MVVM architecture and focused on delivering intuitive and visually consistent user interactions.",
    tags: ["Swift", "UIKit", "Figma", "MVVM", "UI/UX"],
    floatDelay: "1.6s",
    floatDuration: "4.8s",
    rotate: "-1deg",
    photo: "/Photo/Experience/Visecoach2.png",
  },
];

// ─── Palette ──────────────────────────────────────────────────────────────────
const BLUE   = "#0135AD";
const YELLOW = "#F4E11B";

export default function ExperienceSection() {
  const [active, setActive] = useState(1);

  return (
    <>
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .float-wrapper { will-change: transform; }
        .xp-card-visual {
          transition:
            transform 0.5s cubic-bezier(0.4,0,0.2,1),
            box-shadow 0.4s ease,
            outline 0.1s ease;
        }
        .xp-card-layout:hover .xp-card-visual {
          box-shadow: 0 16px 32px rgba(0,0,0,0.3) !important;
        }
        .reveal      { animation: revealUp 0.4s ease both; }
        .reveal-late { animation: revealUp 0.4s 0.07s ease both; }
        .nav-pill {
          transition: background 0.2s ease, width 0.35s ease, opacity 0.35s ease;
          border: none; cursor: pointer; padding: 0;
        }
        .nav-arrow-btn { transition: background 0.2s ease, color 0.2s ease; }
        .nav-arrow-btn:hover { background: ${BLUE} !important; color: #fff !important; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <section className="w-full pt-20 px-6 max-w-7xl mx-auto">

        {/* ── Header row ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-8">
          <div className="max-w-xl text-left">

            {/* Yellow pill label */}
            <span
              className="inline-block px-3 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
              style={{ background: YELLOW, color: BLUE }}
            >
              Professional Journey
            </span>

            {/* Title — deep blue */}
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
              style={{ color: BLUE }}
            >
              My Experience
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm tracking-widest uppercase font-mono mb-5" style={{ color: `${BLUE}60` }}>
              2021 — Present
            </p>

            {/* Yellow underline accent */}
            <div className="mb-5 h-[3px] w-16 rounded-full" style={{ background: YELLOW }} />

            {/* Description */}
            <div className="h-[96px] md:h-[120px]">
              <p
                key={`desc-${active}`}
                className="reveal text-sm sm:text-base leading-relaxed"
                style={{ color: `${BLUE}99` }}
              >
                {experiences[active].description}
              </p>
            </div>
          </div>

          {/* ── Arrow nav ── */}
          <div className="flex gap-3 shrink-0">
            {/* Prev — outline blue */}
            <button
              className="nav-arrow-btn"
              onClick={() => setActive((a) => Math.max(0, a - 1))}
              disabled={active === 0}
              style={{
                width: "48px", height: "48px", borderRadius: "50%",
                border: `1.5px solid ${BLUE}`, background: "transparent", color: BLUE,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: active === 0 ? "not-allowed" : "pointer",
                opacity: active === 0 ? 0.25 : 1,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M9.5 3L5 7.5L9.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Next — yellow fill, blue icon */}
            <button
              className="nav-arrow-btn"
              onClick={() => setActive((a) => Math.min(experiences.length - 1, a + 1))}
              disabled={active === experiences.length - 1}
              style={{
                width: "48px", height: "48px", borderRadius: "50%",
                border: "none", background: YELLOW, color: BLUE,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: active === experiences.length - 1 ? "not-allowed" : "pointer",
                opacity: active === experiences.length - 1 ? 0.25 : 1,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M5.5 3L10 7.5L5.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Cards row ── */}
        <div
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: "28px",
            alignItems: "flex-end",
            minHeight: "650px",
            paddingBottom: "80px",
            overflowX: "auto",
            overflowY: "hidden",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
          }}
        >
          <div style={{ flexShrink: 0, width: "24px" }} />

          {experiences.map((exp, i) => {
            const isActive = i === active;
            return (
              <div
                key={exp.id}
                className="xp-card-layout"
                onClick={() => setActive(i)}
                style={{
                  position: "relative",
                  flex: "0 0 auto",
                  flexShrink: 0,
                  width: isActive ? "390px" : "290px",
                  height: isActive ? "530px" : "450px",
                  cursor: "pointer",
                  opacity: i < active ? 0.55 : 1,
                  transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
                  zIndex: isActive ? 2 : 1,
                  scrollSnapAlign: "center",
                }}
              >
                <div
                  className="float-wrapper"
                  style={{
                    width: "100%", height: "100%",
                    animation: `floatUpDown ${exp.floatDuration} ease-in-out ${exp.floatDelay} infinite`,
                  }}
                >
                  <div
                    className={`xp-card-visual${isActive ? " is-active" : ""}`}
                    style={{
                      position: "relative",
                      width: "100%", height: "100%",
                      borderRadius: "18px",
                      overflow: "hidden",
                      backgroundImage: `url(${exp.photo})`,
                      backgroundSize: "cover",
                      backgroundPosition: exp.photo && exp.photo.includes("AssistantLab") ? "70% center" : "center",
                      transform: isActive ? "rotate(0deg) scale(1.02)" : `rotate(${exp.rotate})`,
                      boxShadow: isActive ? `0 12px 28px rgba(1,53,173,0.25)` : "0 4px 12px rgba(0,0,0,0.05)",
                      // Active card gets a yellow outline
                      outline: isActive ? `2.5px solid ${YELLOW}` : "none",
                      outlineOffset: "3px",
                    }}
                  >
                    {/* Scrim */}
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
                    {isActive && (
                      <div style={{ position: "absolute", inset: 0, borderRadius: "18px", border: "1px solid rgba(255,255,255,0.1)", pointerEvents: "none" }} />
                    )}

                    {/* Glass info panel */}
                    <div style={{
                      position: "absolute",
                      bottom: isActive ? "28px" : "20px",
                      left: isActive ? "20px" : "16px",
                      right: isActive ? "20px" : "16px",
                      padding: isActive ? "32px 24px" : "22px 18px",
                      borderRadius: "16px",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(16px) saturate(180%)",
                      WebkitBackdropFilter: "blur(16px) saturate(180%)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
                      transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
                    }}>
                      <h3 style={{
                        fontSize: isActive ? "28px" : "20px",
                        fontWeight: 700,
                        color: "#fff",
                        margin: "0 0 6px",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                        transition: "font-size 0.4s ease",
                        textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}>
                        {exp.role}
                      </h3>

                      <p className={`font-mono text-[11px] text-white/70 tracking-wider uppercase ${isActive ? "mb-4" : "mb-0"}`}>
                        {exp.title} · {exp.period}
                      </p>

                      {isActive && (
                        <div className="reveal" style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {exp.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[9px] tracking-widest uppercase px-2 py-1 rounded-sm"
                              style={{
                                color: YELLOW,
                                border: `1px solid ${BLUE}40`,
                                background: `${BLUE}15`,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{ flexShrink: 0, width: "24px" }} />
        </div>

        {/* ── Dot indicator ── */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "12px" }}>
          {experiences.map((_, i) => (
            <button
              key={i}
              className="nav-pill"
              onClick={() => setActive(i)}
              style={{
                width: i === active ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: i === active ? YELLOW : BLUE,
                opacity: i === active ? 1 : 0.18,
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}