"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { PROJECTS } from "../data/projects";

function IconBase({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function InstagramIcon() {
  return (
    <IconBase>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

function LinkedinIcon() {
  return (
    <IconBase>
      <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4V8h4v2" />
      <rect x="2" y="9" width="4" height="11" rx="1" />
      <circle cx="4" cy="4" r="1.5" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

function MailIcon() {
  return (
    <IconBase>
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </IconBase>
  );
}

function ArrowUpRightIcon() {
  return (
    <IconBase>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </IconBase>
  );
}

// ─── IMAGE CONFIG ─────────────────────────────────────────────────────────────
const IMAGE_CONFIG = {
  verticalOffset: "0px",
  horizontalOffset: "0px",
  scale: 1,
  maxWidth: "700px",
  fadeStart: "65%",
};

// ─── TYPING ANIMATION ─────────────────────────────────────────────────────────
const NAME = "Kareem Abdul Hafidzh.";
const ROLES = [
  "Software Engineer",
  "IOS Developer",
  "Application Developer",
  "Fullstack Developer",
  "Web Developer",
  "Vibe Coder",
];

const TYPING_SPEED       = 60;
const DELETING_SPEED     = 35;
const PAUSE_AFTER_TYPE   = 1800;
const PAUSE_AFTER_DELETE = 400;

// ─── SOCIAL / CTA CONFIG ──────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "YOUR_WHATSAPP_NUMBER";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/kareem_hafidzh", icon: InstagramIcon },
  { label: "LinkedIn",  href: "https://linkedin.com/in/kareem-hafidzh-34303421b", icon: LinkedinIcon },
  { label: "Email",     href: "mailto:hafidzhkareem@email.com", icon: MailIcon },
];

// ─── Derived stat — updates automatically when PROJECTS changes ───────────────
const PROJECT_COUNT = String(PROJECTS.length).padStart(2, "0"); // "09", "10", etc.

// ─────────────────────────────────────────────────────────────────────────────

export default function HeroSection() {

  // ── Name typing
  const [displayedName, setDisplayedName] = useState("");
  const [nameComplete, setNameComplete]   = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedName(NAME.slice(0, i));
      if (i >= NAME.length) {
        clearInterval(interval);
        setNameComplete(true);
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, []);

  // ── Role typing
  const [roleIndex, setRoleIndex]         = useState(0);
  const [displayedRole, setDisplayedRole] = useState("");
  const [isDeleting, setIsDeleting]       = useState(false);

  useEffect(() => {
    if (!nameComplete) return;

    const currentRole = ROLES[roleIndex];

    if (!isDeleting && displayedRole === currentRole) {
      const pause = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
      return () => clearTimeout(pause);
    }

    if (isDeleting && displayedRole === "") {
      const pause = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
      }, PAUSE_AFTER_DELETE);
      return () => clearTimeout(pause);
    }

    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    const timeout = setTimeout(() => {
      setDisplayedRole(
        isDeleting
          ? currentRole.slice(0, displayedRole.length - 1)
          : currentRole.slice(0, displayedRole.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayedRole, isDeleting, roleIndex, nameComplete]);

  return (
    <section className="relative w-full h-[90vh] flex flex-col justify-start mt-0 overflow-hidden">

      {/* ─── Top Text Block ───────────────────────────────────────── */}
      <div className="z-10 flex flex-col items-start text-left px-8 md:px-16 lg:px-24 mt-10 max-w-2xl w-full">

        {/* Name — deep blue */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0135AD] min-h-[1.2em]">
          {displayedName}
          {!nameComplete && (
            <span className="inline-block w-[3px] h-[1em] bg-[#F4E11B] ml-0.5 align-middle animate-blink" />
          )}
        </h1>

        {/* Role — wrapped in a yellow pill badge */}
        <h2 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-medium text-[#0135AD]/80 min-h-[1.4em]">
          {nameComplete ? (
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#F4E11B]/30 border border-[#F4E11B]">
              {displayedRole}
              <span className="inline-block w-[2px] h-[0.9em] bg-[#0135AD] ml-0.5 align-middle animate-blink" />
            </span>
          ) : null}
        </h2>

        {/* Body copy — muted blue */}
        <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#0135AD]/55 max-w-xl">
          I specialize in architecting high-performance web applications and
          native mobile experiences. From dynamic frontends using Next.js to
          robust iOS ecosystems, I bridge the gap between complex logic and
          intuitive design.
        </p>
      </div>

      {/* ─── Image Anchor ─────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 sm:px-8 flex justify-center items-end pointer-events-none">

        {/* Left Arrow — Completed Projects */}
        <div
          className="relative flex items-center justify-center mb-15"
          style={{ marginRight: "-140px" }}
        >
          <Image src="/Arrow/Left.png" alt="Arrow left" width={300} height={300} className="object-contain" />
          <div className="absolute bottom-28 -left-20 flex flex-col items-center">
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#F4E11B] text-[#0135AD] text-xs sm:text-sm font-bold tracking-widest uppercase mb-1 whitespace-nowrap">
              Completed Projects
            </span>
            {/* ↓ Dynamic: reads PROJECTS.length, zero-padded */}
            <p className="text-6xl font-bold text-[#0135AD] drop-shadow-sm">
              {PROJECT_COUNT}
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <Image
          src="/HeroImage.png"
          alt="Kareem Hafidzh"
          width={1000}
          height={800}
          className="w-auto h-auto object-contain object-bottom pointer-events-auto"
          style={{
            transform: `translate(${IMAGE_CONFIG.horizontalOffset}, ${IMAGE_CONFIG.verticalOffset}) scale(${IMAGE_CONFIG.scale})`,
            maxWidth: IMAGE_CONFIG.maxWidth,
            maxHeight: "75vh",
            maskImage: `linear-gradient(to bottom, black ${IMAGE_CONFIG.fadeStart}, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, black ${IMAGE_CONFIG.fadeStart}, transparent 100%)`,
          }}
          priority
        />

        {/* Right Arrow — Years of Experience */}
        <div
          className="relative flex items-center justify-center mb-80"
          style={{ marginLeft: "-160px" }}
        >
          <Image src="/Arrow/Right.png" alt="Arrow right" width={300} height={300} className="object-contain" />
          <div className="absolute top-32 -right-20 flex flex-col items-center text-center">
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#F4E11B] text-[#0135AD] text-xs sm:text-sm font-bold tracking-widest uppercase mb-1 whitespace-nowrap">
              Years Of Experience
            </span>
            <p className="text-6xl font-bold text-[#0135AD] drop-shadow-sm">05</p>
          </div>
        </div>
      </div>

      {/* ─── Bottom Right: Quote + Socials + CTA ──────────────────── */}
      <div className="absolute bottom-16 md:bottom-20 right-12 md:right-24 lg:right-40 z-20 pointer-events-auto flex flex-col items-center gap-5 text-center select-none">

        {/* Quote */}
        <blockquote className="max-w-[220px] border-l-2 border-[#F4E11B] pl-3 text-left">
          <p className="text-sm sm:text-base font-semibold italic leading-snug text-[#0135AD] tracking-tight">
            &ldquo;Tell me what can&apos;t be built with code.&rdquo;
          </p>
          <span className="mt-2 block text-xs font-medium tracking-widest text-[#0135AD]/40 uppercase">
            — Kareem
          </span>
        </blockquote>

        {/* Divider */}
        <div className="w-3/4 max-w-[150px] h-[2px] bg-[#F4E11B]" />

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-3">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="
                group flex items-center justify-center
                w-9 h-9 rounded-full
                border border-[#F4E11B]
                text-[#0135AD]/60
                hover:bg-[#F4E11B] hover:text-[#0135AD] hover:border-[#F4E11B]
                transition-all duration-200
              "
            >
              <div className="w-4 h-4 transition-transform duration-200 group-hover:scale-110">
                <Icon />
              </div>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group inline-flex items-center justify-center gap-2
            px-5 py-2.5 rounded-full
            bg-[#F4E11B]
            text-[#0135AD]
            text-xs sm:text-sm font-bold tracking-wide
            hover:bg-[#F4E11B]/80
            transition-all duration-200 shadow-sm
          "
        >
          Let&apos;s get in touch!
          <span className="inline-block w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRightIcon />
          </span>
        </a>
      </div>

    </section>
  );
}