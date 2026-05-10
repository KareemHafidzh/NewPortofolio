"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PROJECTS, type Project } from "../data/projects";

// ─── Palette ──────────────────────────────────────────────────────────────────
const BLUE   = "#0135AD";
const YELLOW = "#F4E11B";

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const { num, title, desc, tags, wallpaper, wallpaperColor, col, row, size, year } = project;

  const isHero  = size === "hero";
  const isThin  = size === "thin";
  const isSmall = size === "small";

  const tagStyle = {
    color: YELLOW,
    border: `1px solid ${BLUE}40`,
    background: `${BLUE}15`,
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl cursor-pointer select-none"
      style={{ gridColumn: col, gridRow: row }}
    >
      {/* ── Background: image or gradient ── */}
      {wallpaper ? (
        <Image
          src={wallpaper}
          alt={title}
          fill
          draggable={false}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 480px"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${wallpaperColor} transition-transform duration-500 group-hover:scale-105`}
        />
      )}

      {/* ── Scrim overlay ── */}
      {isThin ? (
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: isSmall
              ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)"
              : "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
          }}
        />
      )}

      {/* ── Number (top-left) ── */}
      <span className="absolute top-3.5 left-4 text-[10px] font-mono text-white/50 z-10">
        {num}
      </span>

      {/* ── Year (top-right) ── */}
      <span className="absolute top-3.5 right-4 text-[10px] font-mono text-white/50 z-10">
        {year}
      </span>

      {/* ── Hover arrow — yellow on hover ── */}
      <span
        className="absolute bottom-4 right-4 text-xs z-10 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
        style={{ color: YELLOW }}
      >
        ↗
      </span>

      {/* ── Content ── */}
      {isThin ? (
        <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
          <h3 className="text-sm font-semibold text-white leading-snug">{title}</h3>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-sm"
                style={tagStyle}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3
            className={`font-semibold text-white leading-snug mb-2 ${
              isHero ? "text-xl" : isSmall ? "text-sm" : "text-base"
            }`}
          >
            {title}
          </h3>

          {desc && !isSmall && (
            <p className="text-[11px] font-mono text-white/60 leading-relaxed mb-2.5">
              {desc}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-sm"
                style={tagStyle}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProjectGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    dragState.current = {
      startX: e.pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
    };
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp    = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x    = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.4;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  return (
    <section className="w-full pt-25 px-6">

      {/* ── Header ── */}
      <div className="flex flex-col items-center justify-center text-center mb-10 mt-12">
        {/* Yellow pill label */}
        <span
          className="inline-block px-3 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
          style={{ background: YELLOW, color: BLUE }}
        >
          Selected Work
        </span>

        {/* Title — deep blue */}
        <h2
          className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
          style={{ color: BLUE }}
        >
          Featured Projects
        </h2>

        {/* Yellow underline accent */}
        <div className="mb-3 h-[3px] w-16 rounded-full" style={{ background: YELLOW }} />

        {/* Subtitle */}
        <p
          className="text-xs sm:text-sm tracking-widest uppercase font-mono"
          style={{ color: `${BLUE}60` }}
        >
          2024 — 2026 <span className="mx-2 opacity-50">|</span> scroll to explore →
        </p>
      </div>

      {/* ── Scrollable wrapper ── */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-3 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div
          className="grid gap-2"
          style={{
            gridTemplateRows: "repeat(3, 220px)",
            gridAutoColumns: "240px",
            width: "max-content",
          }}
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}