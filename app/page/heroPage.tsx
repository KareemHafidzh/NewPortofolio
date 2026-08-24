"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PROJECTS } from "../data/projects";
import {
  approach,
  BLOB_LOBES,
  blobLobes,
  blobPhases,
  clampToFigure,
  constrainLobe,
  driftTarget,
  rectDistance,
  spring,
} from "./spotlight";

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

// ─── SPIDER SPOTLIGHT ─────────────────────────────────────────────────────────
// SpiderManImage.png sits on top of HeroImage.png. A radial-gradient mask follows
// the pointer: the suit is punched out there, the same hole reveals the photo
// underneath. Tune these until the two heads line up.
const SPIDER_CONFIG = {
  scale: 0.9,          // Spidey is framed tighter than HeroImage — shrink to match
  offsetX: "0%",
  offsetY: "1.5%",     // …and nudge down so the heads overlap
  radiusRatio: 0.22,   // blob radius as a fraction of the image width
  feather: "55%",      // where each lobe's soft edge starts
  // Per-lobe spring. Lower stiffness lags further behind the cursor, so giving
  // each lobe a slightly softer spring than the one before makes the blob string
  // out behind a fast move and gather itself back up afterwards. Uniform values
  // here would put every lobe on the same trajectory — a rigid slide again.
  stiffness: 0.14,
  stiffnessFalloff: 0.13, // each successive lobe is this much slacker
  damping: 0.76,          // < 1 keeps a little overshoot, which is the wobble
  radar: 180,          // px around the image where the cursor takes over the drift
  ease: 0.08,          // per-frame fraction of the gap closed — lower is lazier
  driftSpeed: 0.004,   // radians per frame of the idle wander
};

// ponytail: SpiderManImage.png still carries a white studio backdrop. multiply
// against the white page turns that white transparent — no cutout needed.
/**
 * Both layers are cut from one identical stack of lobe gradients — the photo
 * shows the blob, the suit shows everything but it.
 *
 * The suit gets its hole by compositing an opaque layer over the blob with
 * `exclude`, i.e. XOR, which against alpha 1 works out to exactly 1 - blob. That
 * exactness is the point: build the hole out of its own inverted gradients
 * instead and the two only cancel where the gradients are hard, so every soft
 * overlap shows up as a grey smudge on the edge. Sharing one stack means the
 * feather can be as wide as it likes and the lobes as many as they like.
 */
function spotlightMask(fadeStart: string, showBlob: boolean) {
  const lobes = Array.from(
    { length: BLOB_LOBES },
    (_, i) =>
      // Absolute positions, not centre-plus-offset: each lobe trails the centre
      // on its own spring, so there is no single point they all hang off.
      `radial-gradient(circle calc(var(--spot-r) * var(--lobe-${i}-r, 0.5)) at ` +
      `var(--lobe-${i}-x, 50%) var(--lobe-${i}-y, 50%), ` +
      `#000 0%, #000 ${SPIDER_CONFIG.feather}, transparent 100%)`,
  );

  const fade = `linear-gradient(to bottom, #000 ${fadeStart}, transparent 100%)`;
  const opaque = "linear-gradient(#000, #000)";

  // Layers composite bottom-up and the first listed is topmost: the lobes union
  // into the blob, the opaque layer inverts it for the suit, the fade trims the
  // result.
  // ponytail: unprefixed only. Adding -webkit-mask-image alongside mask-image
  // resets mask-composite and the element stops rendering entirely.
  const union = lobes.map(() => "add");
  return showBlob
    ? {
        maskImage: [fade, ...lobes].join(", "),
        maskComposite: ["intersect", ...union].join(", "),
      }
    : {
        maskImage: [fade, opaque, ...lobes].join(", "),
        maskComposite: ["intersect", "exclude", ...union].join(", "),
      };
}

function HeroPortrait({
  width,
  height,
  fadeStart,
  imgClassName,
  imgStyle,
  wrapperClassName = "",
  wrapperStyle,
  transform = "",
}: {
  width: number;
  height: number;
  fadeStart: string;
  imgClassName: string;
  imgStyle?: React.CSSProperties;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  transform?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // One rAF loop drives both behaviours: it always eases the spotlight toward a
  // target, and the only thing that changes is where that target comes from —
  // the cursor inside the radar, the idle drift outside it. That's what makes
  // entering and leaving the radar a glide instead of a jump.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Cursor position as a fraction of the box, or null when out of radar range.
    const cursor = { current: null as { x: number; y: number } | null };

    const onMove = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      cursor.current =
        rectDistance(e.clientX, e.clientY, box) <= SPIDER_CONFIG.radar
          ? { x: (e.clientX - box.left) / box.width, y: (e.clientY - box.top) / box.height }
          : null;
    };
    // A finger has no hover, so hand the spotlight back to the drift on lift-off.
    const onRelease = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") cursor.current = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onRelease, { passive: true });
    window.addEventListener("pointercancel", onRelease, { passive: true });

    // Reduced motion keeps the cursor tracking but parks the idle wander.
    const wander = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Drawn once per mount, so the blob doesn't start from the same shape on
    // every visit — and so the three breakpoint copies aren't in lockstep.
    const phases = blobPhases();

    let raf = 0;
    let t = 0;
    let { x, y } = driftTarget(0);

    // Each lobe carries its own position and momentum in px.
    const trail = Array.from({ length: BLOB_LOBES }, () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
    }));
    let settled = false;
    const box = { width: 0, height: 0 };

    const tick = () => {
      if (box.width === 0) {
        raf = requestAnimationFrame(tick);
        return; // nothing measured yet, nothing meaningful to place
      }

      if (wander) t += SPIDER_CONFIG.driftSpeed;
      const target = clampToFigure(cursor.current ?? driftTarget(t));
      x = approach(x, target.x, SPIDER_CONFIG.ease);
      y = approach(y, target.y, SPIDER_CONFIG.ease);

      const centreX = x * box.width;
      const centreY = y * box.height;
      const radius = box.width * SPIDER_CONFIG.radiusRatio;

      // First real frame: drop every lobe straight onto the centre rather than
      // letting them spring in from the corner of the box.
      if (!settled) {
        trail.forEach((lobe) => {
          lobe.x = centreX;
          lobe.y = centreY;
        });
        settled = true;
      }

      blobLobes(t, phases).forEach((shape, i) => {
        const lobe = trail[i];
        const stiffness =
          SPIDER_CONFIG.stiffness * (1 - SPIDER_CONFIG.stiffnessFalloff * i);

        const nextX = spring(
          lobe.x, lobe.vx, centreX + shape.x * radius, stiffness, SPIDER_CONFIG.damping,
        );
        const nextY = spring(
          lobe.y, lobe.vy, centreY + shape.y * radius, stiffness, SPIDER_CONFIG.damping,
        );
        lobe.x = nextX.position;
        lobe.vx = nextX.velocity;
        lobe.y = nextY.position;
        lobe.vy = nextY.velocity;

        // Tether, so a fast throw stretches the blob but never tears it apart.
        const held = constrainLobe((lobe.x - centreX) / radius, (lobe.y - centreY) / radius);
        el.style.setProperty(`--lobe-${i}-x`, `${(centreX + held.x * radius).toFixed(2)}px`);
        el.style.setProperty(`--lobe-${i}-y`, `${(centreY + held.y * radius).toFixed(2)}px`);
        el.style.setProperty(`--lobe-${i}-r`, shape.r.toFixed(3));
      });

      raf = requestAnimationFrame(tick);
    };

    // The radius only changes when the box does — measuring it per frame would
    // force a layout on every one of them.
    const sizer = new ResizeObserver(([entry]) => {
      box.width = entry.contentRect.width;
      box.height = entry.contentRect.height;
      el.style.setProperty("--spot-r", `${box.width * SPIDER_CONFIG.radiusRatio}px`);
    });
    sizer.observe(el);

    // All three breakpoint copies of this component are mounted at once and two
    // are display:none, so gate the loop on actually being visible. That also
    // stops it burning frames once the hero scrolls out of view.
    const watcher = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    watcher.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      sizer.disconnect();
      watcher.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
    };
  }, []);

  return (
    <div
      ref={ref}
      // ponytail: no transform on this wrapper — it would open a stacking
      // context and isolate the suit's multiply blend into a white box.
      className={`relative ${wrapperClassName}`}
      // pan-y keeps vertical scrolling alive; a sideways drag reveals instead
      style={{ touchAction: "pan-y", ...wrapperStyle }}
    >
      <Image
        src="/HeroImage.png"
        alt="Kareem Hafidzh"
        width={width}
        height={height}
        className={imgClassName}
        style={{ ...imgStyle, transform: transform || undefined, ...spotlightMask(fadeStart, true) }}
        priority
      />
      {/* ponytail: the blend lives on this div, the mask on the image inside.
          On one element Chrome drops the layer entirely and Spidey vanishes. */}
      <div className="absolute inset-0" style={{ mixBlendMode: "multiply" }}>
        <Image
          src="/SpiderManImage2.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 640px) 60vw, (max-width: 1024px) 40vw, 700px"
          draggable={false}
          // SpiderManImage.png is a 1:1 pad of a 0.8-ratio photo — cover crops the
          // transparent side bars back off, landing it on top of HeroImage.
          className="object-cover object-bottom select-none"
          style={{
            // the studio backdrop bottoms out at 252, not 255 — the last 1% is
            // what multiply would otherwise leave as a grey rectangle
            filter: "brightness(1.02)",
            transform: `${transform} translate(${SPIDER_CONFIG.offsetX}, ${SPIDER_CONFIG.offsetY}) scale(${SPIDER_CONFIG.scale})`,
            ...spotlightMask(fadeStart, false),
          }}
          priority
        />
      </div>
    </div>
  );
}

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

const WHATSAPP_NUMBER = "YOUR_WHATSAPP_NUMBER";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/kareem_hafidzh",           icon: InstagramIcon },
  { label: "LinkedIn",  href: "https://linkedin.com/in/kareem-hafidzh-34303421b", icon: LinkedinIcon },
  { label: "Email",     href: "mailto:hafidzhkareem@email.com",                  icon: MailIcon },
];

const PROJECT_COUNT = String(PROJECTS.length).padStart(2, "0");

// ─── Shared sub-components ────────────────────────────────────────────────────

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="font-bold text-[#0135AD] leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
        {value}
      </span>
      <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#F4E11B] text-[#0135AD] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

function SocialRow() {
  return (
    <div className="flex items-center gap-3">
      {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="group flex items-center justify-center w-9 h-9 rounded-full border border-[#F4E11B] text-[#0135AD]/60 hover:bg-[#F4E11B] hover:text-[#0135AD] transition-all duration-200"
        >
          <div className="w-4 h-4 transition-transform duration-200 group-hover:scale-110">
            <Icon />
          </div>
        </a>
      ))}
    </div>
  );
}

function CTAButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#F4E11B] text-[#0135AD] text-sm font-bold tracking-wide hover:bg-[#F4E11B]/80 transition-all duration-200 shadow-sm"
    >
      Let&apos;s get in touch!
      <span className="inline-block w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRightIcon />
      </span>
    </a>
  );
}

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

  // ─── Shared typing UI ──────────────────────────────────────────────────────
  const NameHeading = ({ className }: { className?: string }) => (
    <h1 className={`font-bold tracking-tight text-[#0135AD] min-h-[1.2em] ${className}`}>
      {displayedName}
      {!nameComplete && (
        <span className="inline-block w-[3px] h-[1em] bg-[#F4E11B] ml-0.5 align-middle animate-blink" />
      )}
    </h1>
  );

  const RoleHeading = ({ className }: { className?: string }) => (
    <h2 className={`font-medium text-[#0135AD]/80 min-h-[1.4em] ${className}`}>
      {nameComplete ? (
        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#F4E11B]/30 border border-[#F4E11B]">
          {displayedRole}
          <span className="inline-block w-[2px] h-[0.9em] bg-[#0135AD] ml-0.5 align-middle animate-blink" />
        </span>
      ) : null}
    </h2>
  );

  return (
    <section className="relative w-full overflow-hidden">

      {/* ════════════════════════════════════════════════════════
          MOBILE  — default, hidden from sm up
      ════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:hidden min-h-[100svh]">
        <div className="flex flex-col items-start px-6 pt-10 pb-4 z-10">
          <NameHeading className="text-3xl" />
          <RoleHeading className="mt-3 text-lg" />
          <p className="mt-4 text-sm leading-relaxed text-[#0135AD]/55">
            I specialize in architecting high-performance web applications and
            native mobile experiences — bridging complex logic with intuitive design.
          </p>
          <div className="mt-5 flex flex-col items-start gap-4">
            <CTAButton />
            <SocialRow />
          </div>
        </div>

        {/* Hero image */}
        <div className="relative w-full flex justify-center items-end mt-2 flex-1">
          <HeroPortrait
            width={600}
            height={500}
            fadeStart="55%"
            imgClassName="w-auto object-contain object-bottom"
            imgStyle={{ maxHeight: "42vh" }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around px-6 py-5 border-t border-[#0135AD]/10 mx-4 mb-6">
          <StatPill value={PROJECT_COUNT} label="Completed Projects" />
          <div className="w-px h-12 bg-[#0135AD]/15" />
          <StatPill value="02+" label="Years of Experience" />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          TABLET PORTRAIT  (sm–md: 640–767px)
          TABLET LANDSCAPE (md–lg: 768–1023px)
          Hidden below sm and from lg up
      ════════════════════════════════════════════════════════ */}
      <div className="hidden sm:flex lg:hidden min-h-[100svh] flex-col">

        {/* Top: two columns — text left, image right */}
        <div className="flex flex-row flex-1 items-end overflow-hidden">

          {/* Left column */}
          <div className="flex flex-col justify-center px-8 md:px-12 pt-12 pb-6 flex-1 min-w-0 z-10">
            <NameHeading className="text-4xl md:text-5xl" />
            <RoleHeading className="mt-4 text-xl md:text-2xl" />
            <p className="mt-5 text-sm md:text-base leading-relaxed text-[#0135AD]/55 max-w-sm">
              I specialize in architecting high-performance web applications and
              native mobile experiences. From dynamic frontends using Next.js to
              robust iOS ecosystems, I bridge the gap between complex logic and
              intuitive design.
            </p>

            {/* Stats inline */}
            <div className="mt-6 flex items-center gap-6">
              <StatPill value={PROJECT_COUNT} label="Completed Projects" />
              <div className="w-px h-10 bg-[#0135AD]/15" />
              <StatPill value="02+" label="Years of Experience" />
            </div>

            {/* CTA + socials */}
            <div className="mt-6 flex flex-col items-start gap-4">
              <CTAButton />
              <SocialRow />
            </div>

            {/* Quote */}
            <blockquote className="mt-6 max-w-[240px] border-l-2 border-[#F4E11B] pl-3">
              <p className="text-sm font-semibold italic leading-snug text-[#0135AD] tracking-tight">
                &ldquo;Tell me what can&apos;t be built with code.&rdquo;
              </p>
              <span className="mt-1 block text-xs font-medium tracking-widest text-[#0135AD]/40 uppercase">
                — Kareem
              </span>
            </blockquote>
          </div>

          {/* Right column — image */}
          <div className="relative flex items-end justify-center flex-shrink-0"
            style={{ width: "clamp(220px, 42%, 380px)" }}
          >
            <HeroPortrait
              width={700}
              height={600}
              fadeStart="60%"
              wrapperClassName="w-full"
              imgClassName="w-full h-auto object-contain object-bottom"
              imgStyle={{ maxHeight: "75vh" }}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          DESKTOP  — lg and up (1024px+), your original layout
      ════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block relative w-full h-[90vh] overflow-hidden">

        {/* Top Text Block */}
        <div className="z-10 flex flex-col items-start text-left px-8 md:px-16 lg:px-24 mt-10 max-w-2xl w-full">
          <NameHeading className="text-4xl sm:text-5xl lg:text-6xl" />
          <RoleHeading className="mt-4 text-xl sm:text-2xl lg:text-3xl" />
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#0135AD]/55 max-w-xl">
            I specialize in architecting high-performance web applications and
            native mobile experiences. From dynamic frontends using Next.js to
            robust iOS ecosystems, I bridge the gap between complex logic and
            intuitive design.
          </p>
        </div>

        {/* Image Anchor with arrows */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 sm:px-8 flex justify-center items-end pointer-events-none">

          {/* Left Arrow */}
          <div className="relative flex items-center justify-center mb-15" style={{ marginRight: "-140px" }}>
            <Image src="/Arrow/Left.png" alt="Arrow left" width={300} height={300} className="object-contain" />
            <div className="absolute bottom-28 -left-20 flex flex-col items-center">
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#F4E11B] text-[#0135AD] text-xs sm:text-sm font-bold tracking-widest uppercase mb-1 whitespace-nowrap">
                Completed Projects
              </span>
              <p className="text-6xl font-bold text-[#0135AD] drop-shadow-sm">{PROJECT_COUNT}</p>
            </div>
          </div>

          {/* Hero Image */}
          <HeroPortrait
            width={1000}
            height={800}
            fadeStart={IMAGE_CONFIG.fadeStart}
            wrapperClassName="pointer-events-auto"
            wrapperStyle={{ maxWidth: IMAGE_CONFIG.maxWidth }}
            transform={`translate(${IMAGE_CONFIG.horizontalOffset}, ${IMAGE_CONFIG.verticalOffset}) scale(${IMAGE_CONFIG.scale})`}
            imgClassName="w-auto h-auto max-w-full object-contain object-bottom"
            imgStyle={{ maxHeight: "75vh" }}
          />

          {/* Right Arrow */}
          <div className="relative flex items-center justify-center mb-80" style={{ marginLeft: "-160px" }}>
            <Image src="/Arrow/Right.png" alt="Arrow right" width={300} height={300} className="object-contain" />
            <div className="absolute top-32 -right-20 flex flex-col items-center text-center">
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#F4E11B] text-[#0135AD] text-xs sm:text-sm font-bold tracking-widest uppercase mb-1 whitespace-nowrap">
                Years Of Experience
              </span>
              <p className="text-6xl font-bold text-[#0135AD] drop-shadow-sm">02+</p>
            </div>
          </div>
        </div>

        {/* Bottom Right: Quote + Socials + CTA */}
        <div className="absolute bottom-16 md:bottom-20 right-12 md:right-24 lg:right-40 z-20 pointer-events-auto flex flex-col items-center gap-5 text-center select-none">
          <blockquote className="max-w-[220px] border-l-2 border-[#F4E11B] pl-3 text-left">
            <p className="text-sm sm:text-base font-semibold italic leading-snug text-[#0135AD] tracking-tight">
              &ldquo;Tell me what can&apos;t be built with code.&rdquo;
            </p>
            <span className="mt-2 block text-xs font-medium tracking-widest text-[#0135AD]/40 uppercase">
              — Kareem
            </span>
          </blockquote>

          <div className="w-3/4 max-w-[150px] h-[2px] bg-[#F4E11B]" />

          <SocialRow />
          <CTAButton />
        </div>
      </div>

    </section>
  );
}