"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PROJECTS, type Project } from "../data/projects";
import ProjectDrawer from "../components/ProjectDrawer";

// ─── Palette ──────────────────────────────────────────────────────────────────
const BLUE   = "#0135AD";
const YELLOW = "#F4E11B";

// ─── Word-limit truncation ────────────────────────────────────────────────────
// Adjust these limits to taste for each card size.
const WORD_LIMITS: Record<string, number> = {
  hero:  20,  // 2×2 card — most space, but still bounded
  thin:  12,  // thin cards don't even render desc, but defined for safety
  small:  8,  // 1×1 — barely any room
};

/**
 * Truncates `text` to at most `limit` words.
 * Appends "…" only when text was actually cut.
 */
function truncateWords(text: string, limit: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "…";
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onClick,
  isActive,
}: {
  project: Project;
  onClick: () => void;
  isActive: boolean;
}) {
  const { num, title, desc, tags, wallpaper, wallpaperColor, videos, col, row, size, year } = project;

  const isHero  = size === "hero";
  const isThin  = size === "thin";
  const isSmall = size === "small";

  // Truncate description based on card size
  const wordLimit  = WORD_LIMITS[size] ?? 15;
  const shortDesc  = desc ? truncateWords(desc, wordLimit) : undefined;

  const tagStyle = {
    color: YELLOW,
    border: `1px solid ${BLUE}40`,
    background: `${BLUE}15`,
  };

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer select-none transition-all duration-200"
      style={{
        gridColumn: col,
        gridRow: row,
        outline: isActive ? `2.5px solid ${YELLOW}` : "2.5px solid transparent",
        outlineOffset: "2px",
        boxShadow: isActive ? `0 0 0 4px ${BLUE}25` : "none",
      }}
    >
      {/* ── Background ── */}
      {videos?.length ? (
        <video
          src={videos[0]}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : wallpaper ? (
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

      {/* ── Hover arrow ── */}
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

          {/* ── Truncated description (hero only; hidden on small) ── */}
          {shortDesc && !isSmall && (
            <p
              className="text-[11px] font-mono text-white/60 leading-relaxed mb-2.5"
              title={desc} // full text on hover tooltip
            >
              {shortDesc}
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
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });
  const [activeProject, setActiveProject] = useState<Project | null>(null);

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

  const handleCardClick = (project: Project) => {
    setActiveProject((prev) => (prev?.id === project.id ? null : project));
  };

  return (
    <>
      <section className="w-full pt-25 px-6">

        {/* ── Header ── */}
        <div className="flex flex-col items-center justify-center text-center mb-10 mt-12">
          <span
            className="inline-block px-3 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
            style={{ background: YELLOW, color: BLUE }}
          >
            Selected Work
          </span>

          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
            style={{ color: BLUE }}
          >
            Featured Projects
          </h2>

          <div className="mb-3 h-[3px] w-16 rounded-full" style={{ background: YELLOW }} />

          <p
            className="text-xs sm:text-sm tracking-widest uppercase font-mono"
            style={{ color: `${BLUE}60` }}
          >
            2024 — 2026 <span className="mx-2 opacity-50">|</span> scroll to explore →
          </p>
        </div>

        {/* ── Scrollable grid ── */}
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
            className="grid gap-2 auto-cols-[180px] md:auto-cols-[240px] grid-rows-[repeat(6,76px)] md:grid-rows-[repeat(6,106px)] w-max"
          >
            {PROJECTS.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleCardClick(project)}
                isActive={activeProject?.id === project.id}
              />
            ))}
          </div>
        </div>
      </section>

      <ProjectDrawer
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
}