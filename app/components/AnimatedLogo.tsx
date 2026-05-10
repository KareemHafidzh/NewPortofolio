"use client";

import { motion, type Transition } from "framer-motion";
import { useEffect, useState } from "react";

// ── Palette ───────────────────────────────────────────────────────────────────
const BLUE   = "#0135AD";
const YELLOW = "#F4E11B";

// ── Constants ─────────────────────────────────────────────────────────────────
const TIMING = {
  START_TYPING: 500,
  MOVE_TO_CORNER: 2500,
  COLLAPSE: 3500,
  NOTIFY_COMPLETE: 4000,
} as const;

const ANIMATION = {
  COLLAPSE_DURATION: 0.5,
  TYPING_DURATION: 0.2,
  EASE: "easeInOut",
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────
type Phase = 0 | 1 | 2 | 3;

interface NameBlockProps {
  letters: string;
  anchor: string;
  anchorIndex: number;
  letterStartIndex: number;
  collapsed: boolean;
  slideDirection: "left" | "right";
  phase: Phase;
  color: string;
  /** If true, z-index ascends toward the last letter (last letter = front) */
  lastLetterOnTop?: boolean;
}

// ── Sub-component ─────────────────────────────────────────────────────────────
function NameBlock({
  letters,
  anchor,
  anchorIndex,
  letterStartIndex,
  collapsed,
  slideDirection,
  phase,
  color,
  lastLetterOnTop = false,
}: NameBlockProps) {
  const slideOut = slideDirection === "left" ? "-100%" : "100%";
  const total    = letters.length;

  const typingProps = (index: number) => ({
    initial: { opacity: 0, x: -10 },
    animate: {
      opacity: phase >= 1 ? 1 : 0,
      x:       phase >= 1 ? 0  : -10,
    },
    transition: {
      duration: ANIMATION.TYPING_DURATION,
      delay:    phase === 1 ? index * 0.1 : 0,
      ease:     ANIMATION.EASE,
    } as Transition,
  });

  const collapseAnim = {
    animate: {
      width:   collapsed ? 0    : "auto",
      opacity: collapsed ? 0    : 1,
    },
    transition: { duration: ANIMATION.COLLAPSE_DURATION, ease: ANIMATION.EASE },
  };

  const letterSpans = letters.split("").map((letter, i) => (
    <motion.span
      key={i}
      className="inline-block"
      style={{
        color,
        position: "relative",
        // last letter gets the highest z-index when lastLetterOnTop is set
        zIndex: lastLetterOnTop ? (i === total - 1 ? 100 : i + 1) : total - i,
      }}
      {...typingProps(letterStartIndex + i)}
    >
      {letter}
    </motion.span>
  ));

  const anchorSpan = (
    <motion.span
      layout
      className="inline-block"
      style={{ color }}
      {...typingProps(anchorIndex)}
    >
      {anchor}
    </motion.span>
  );

  const collapsibleBlock = (
    <motion.div
      layout
      animate={collapseAnim.animate}
      transition={collapseAnim.transition}
      className="flex overflow-hidden"
    >
      <motion.div
        animate={{ x: collapsed ? slideOut : "0%" }}
        transition={{ duration: ANIMATION.COLLAPSE_DURATION, ease: ANIMATION.EASE }}
        className="flex whitespace-nowrap"
      >
        {letterSpans}
      </motion.div>
    </motion.div>
  );

  if (slideDirection === "left") {
    return (
      <div className="flex items-center">
        {anchorSpan}
        {collapsibleBlock}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {collapsibleBlock}
      {anchorSpan}
    </div>
  );
}

// ── NameBlocks ────────────────────────────────────────────────────────────────
function NameBlocks({ phase, isCollapsed }: { phase: Phase; isCollapsed: boolean }) {
  return (
    <>
      {/* KAREEM → blue */}
      <NameBlock
        letters="AREEM"
        anchor="K"
        anchorIndex={0}
        letterStartIndex={1}
        collapsed={isCollapsed}
        slideDirection="left"
        phase={phase}
        color={BLUE}
      />

      {/* Spacer */}
      <motion.div
        layout
        animate={{ width: isCollapsed ? 0 : "1rem" }}
        transition={{ duration: ANIMATION.COLLAPSE_DURATION, ease: ANIMATION.EASE }}
      />

      {/* HAFIDZ → yellow, Z rendered on top */}
      <NameBlock
        letters="HAFIDZ"
        anchor="H"
        anchorIndex={12}
        letterStartIndex={6}
        collapsed={isCollapsed}
        slideDirection="right"
        phase={phase}
        color={YELLOW}
        lastLetterOnTop
      />
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AnimatedLogo({ onAnimationComplete }: { onAnimationComplete?: () => void }) {
  const [isMounted, setIsMounted] = useState(false);
  const [phase, setPhase]         = useState<Phase>(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("portfolio_visited", "true");
    setIsMounted(true);

    const timers = [
      setTimeout(() => setPhase(1), TIMING.START_TYPING),
      setTimeout(() => setPhase(2), TIMING.MOVE_TO_CORNER),
      setTimeout(() => setPhase(3), TIMING.COLLAPSE),
      setTimeout(() => { if (onAnimationComplete) onAnimationComplete(); }, TIMING.NOTIFY_COMPLETE),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onAnimationComplete]);

  if (!isMounted) return null;

  const isCollapsed = phase === 3 && !isHovered;

  return (
    <div className={`fixed inset-0 pointer-events-none flex z-50 ${
      phase >= 2
        ? "items-start justify-start p-6"
        : "items-center justify-center"
    }`}>
      <motion.div
        layout
        className="flex text-4xl font-bold pointer-events-auto cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NameBlocks phase={phase} isCollapsed={isCollapsed} />
      </motion.div>
    </div>
  );
}