"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { type Project } from "../data/projects";

const BLUE   = "#0135AD";
const YELLOW = "#F4E11B";

// ─── Hook: detects if viewport is mobile (<768px) ────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

// ─── Hero image block ─────────────────────────────────────────────────────────
// Portrait screenshots (phone apps) → object-contain + blurred gradient bg
// Landscape images (web/dashboard)  → object-cover  + 16:9 crop
function HeroImage({
  project,
  activeImg,
  images,
  isMobile,
}: {
  project: Project;
  activeImg: number;
  images: string[];
  isMobile: boolean;
}) {
  const isPortrait = project.imageOrientation === "portrait";

  return (
    <div
      className="relative w-full overflow-hidden flex-shrink-0 flex items-center justify-center"
      style={{
        // Portrait: taller canvas so phone screenshots breathe
        // Landscape: classic 16:9
        aspectRatio: isPortrait ? "4/3" : "16/9",
        background: "#f3f4f6",
      }}
    >
      {/* ── Blurred background fill (portrait only) ── */}
      {isPortrait && images.length > 0 && (
        <Image
          src={images[activeImg]}
          alt=""
          fill
          aria-hidden
          className="object-cover scale-110 blur-xl opacity-40"
          sizes="480px"
        />
      )}

      {/* ── Gradient fallback when no image ── */}
      {images.length === 0 && (
        <div className={`absolute inset-0 bg-gradient-to-br ${project.wallpaperColor}`} />
      )}

      {/* ── Main image ── */}
      {images.length > 0 && (
        <div
          className="relative z-10 transition-opacity duration-300"
          style={
            isPortrait
              ? {
                  // Let the image size itself naturally inside the container
                  height: "100%",
                  width: "auto",
                  maxWidth: "100%",
                  position: "relative",
                  aspectRatio: "9/19.5",  // standard iPhone ratio
                }
              : { position: "absolute", inset: 0 }
          }
        >
          <Image
            src={images[activeImg]}
            alt={project.title}
            fill={!isPortrait}
            {...(isPortrait
              ? { width: 390, height: 844 }  // intrinsic hint, displayed via CSS
              : {})}
            className={isPortrait ? "object-contain h-full w-auto" : "object-cover"}
            sizes={isMobile ? "100vw" : "480px"}
          />
        </div>
      )}

      {/* ── Close button ── */}
      <button
        onClick={undefined /* passed from parent via wrapper */}
        className="absolute top-3.5 left-4 z-20 flex items-center justify-center w-8 h-8 rounded-full transition-opacity duration-150 hover:opacity-70"
        style={{
          background: "rgba(0,0,0,0.45)",
          color: "#fff",
          backdropFilter: "blur(6px)",
          fontSize: "16px",
        }}
        aria-label="Close"
        id="drawer-close-btn"
      >
        ←
      </button>

      {/* ── Number badge ── */}
      <span
        className="absolute top-3.5 right-4 z-20 text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full"
        style={{ background: YELLOW, color: BLUE }}
      >
        {project.num}
      </span>

      {/* ── Year badge ── */}
      <span
        className="absolute bottom-3 left-4 z-20 text-[10px] font-mono px-2 py-0.5 rounded-md"
        style={{
          background: "rgba(0,0,0,0.55)",
          color: YELLOW,
          backdropFilter: "blur(6px)",
        }}
      >
        {project.year}
      </span>
    </div>
  );
}

// ─── Shared inner content ─────────────────────────────────────────────────────
function DrawerContent({
  project,
  onClose,
  activeImg,
  setActiveImg,
  images,
  isMobile,
}: {
  project: Project;
  onClose: () => void;
  activeImg: number;
  setActiveImg: (i: number) => void;
  images: string[];
  isMobile: boolean;
}) {
  return (
    <div
      className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ maxHeight: isMobile ? "85vh" : "100vh" }}
    >
      {/* ── Hero image ── */}
      <div className="relative" onClick={(e) => {
        // forward close-btn clicks
        if ((e.target as HTMLElement).closest("#drawer-close-btn")) onClose();
      }}>
        <HeroImage
          project={project}
          activeImg={activeImg}
          images={images}
          isMobile={isMobile}
        />
      </div>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && (
        <div className="flex gap-2 px-5 py-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className="relative flex-shrink-0 overflow-hidden transition-all duration-150"
              style={{
                // Portrait thumbnails taller, landscape square-ish
                width:  project.imageOrientation === "portrait" ? "40px" : "64px",
                height: project.imageOrientation === "portrait" ? "72px" : "64px",
                borderRadius: project.imageOrientation === "portrait" ? "8px" : "8px",
                outline: i === activeImg ? `2px solid ${BLUE}` : `2px solid transparent`,
                outlineOffset: "2px",
                opacity: i === activeImg ? 1 : 0.5,
              }}
            >
              <Image
                src={src}
                alt={`Screenshot ${i + 1}`}
                fill
                className="object-cover"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      <div className="px-5 pt-5 pb-8 space-y-6">

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold leading-tight mb-1" style={{ color: BLUE }}>
            {project.title}
          </h2>
          <div className="h-[2px] w-10 rounded-full mt-2" style={{ background: YELLOW }} />
        </div>

        {/* Description */}
        {project.desc && (
          <div>
            <p
              className="text-xs font-mono uppercase tracking-widest mb-2 font-semibold"
              style={{ color: `${BLUE}60` }}
            >
              About
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#1a1a2e", opacity: 0.75 }}>
              {project.desc}
            </p>
          </div>
        )}

        {/* Tech stack */}
        <div>
          <p
            className="text-xs font-mono uppercase tracking-widest mb-3 font-semibold"
            style={{ color: `${BLUE}60` }}
          >
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.filter(Boolean).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg"
                style={{
                  color: BLUE,
                  background: `${BLUE}10`,
                  border: `1px solid ${BLUE}25`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: `${BLUE}12` }} />

        {/* GitHub link */}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl font-mono text-sm font-semibold transition-all duration-150 group/gh hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: BLUE, color: "#fff" }}
          >
            <span className="flex items-center gap-2.5">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              View on GitHub
            </span>
            <span
              className="text-base group-hover/gh:translate-x-0.5 transition-transform duration-150"
              style={{ color: YELLOW }}
            >
              ↗
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  const [activeImg, setActiveImg] = useState(0);
  const isMobile = useIsMobile();
  const isOpen = project !== null;

  useEffect(() => { setActiveImg(0); }, [project?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const images = project?.images?.length
    ? project.images
    : project?.wallpaper
    ? [project.wallpaper]
    : [];

  // ── Mobile: centered modal ────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <div
          onClick={onClose}
          className="fixed inset-0 z-40"
          style={{
            background: "rgba(1,53,173,0.45)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            transition: "opacity 0.28s ease",
          }}
        />
        <div
          className="fixed z-50 flex flex-col overflow-hidden rounded-2xl"
          style={{
            top: "50%",
            left: "50%",
            width: "min(92vw, 440px)",
            maxHeight: "85vh",
            transform: isOpen
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -48%) scale(0.96)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            transition: "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.28s ease",
            background: "#fff",
            boxShadow: "0 24px 80px rgba(1,53,173,0.22), 0 4px 16px rgba(0,0,0,0.12)",
          }}
        >
          {project && (
            <DrawerContent
              project={project}
              onClose={onClose}
              activeImg={activeImg}
              setActiveImg={setActiveImg}
              images={images}
              isMobile
            />
          )}
        </div>
      </>
    );
  }

  // ── Desktop: right-side drawer ────────────────────────────────────────────
  return (
    <>
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col overflow-hidden"
        style={{
          width: "min(480px, 100vw)",
          background: "#fff",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)",
          boxShadow: "-8px 0 48px rgba(1,53,173,0.12)",
        }}
      >
        {project && (
          <DrawerContent
            project={project}
            onClose={onClose}
            activeImg={activeImg}
            setActiveImg={setActiveImg}
            images={images}
            isMobile={false}
          />
        )}
      </div>
    </>
  );
}