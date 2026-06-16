"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// ── Palette ───────────────────────────────────────────────────────────────────
const BLUE   = "#0135AD";
const YELLOW = "#F4E11B";

interface NavLink {
  key: string;
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { key: "skills",     label: "Skills",     href: "#skills"     },
  { key: "experience", label: "Experience", href: "#experience" },
  { key: "projects",   label: "Projects",   href: "#projects"   },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Navigation ── */}
      <nav className="hidden md:flex fixed top-4 left-0 right-0 z-40 justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-auto flex items-center gap-1 px-4 py-2.5 rounded-full"
          style={{
            // ── Glassmorphism ──────────────────────────────────────────────────
            background: `linear-gradient(
              135deg,
              rgba(1, 53, 173, 0.18) 0%,
              rgba(244, 225, 27, 0.10) 100%
            )`,
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            border: `1px solid rgba(1, 53, 173, 0.25)`,
            boxShadow: `
              0 4px 24px rgba(1, 53, 173, 0.15),
              0 1px 0 rgba(255, 255, 255, 0.35) inset,
              0 -1px 0 rgba(1, 53, 173, 0.10) inset
            `,
          }}
        >
          {navLinks.map((link: NavLink) => (
            <NavItem key={link.key} link={link} />
          ))}
        </motion.div>
      </nav>

      {/* ── Mobile Navigation ── */}
      <nav className="md:hidden fixed top-4 right-4 z-50 pointer-events-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: `linear-gradient(135deg, rgba(1, 53, 173, 0.18) 0%, rgba(244, 225, 27, 0.10) 100%)`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid rgba(1, 53, 173, 0.25)`,
            color: BLUE,
          }}
        >
          {/* Hamburger Icon */}
          <div className="flex flex-col gap-1.5 items-center justify-center">
            <span className={`block w-5 h-0.5 bg-current transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block w-5 h-0.5 bg-current transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 right-0 min-w-[160px] p-2 rounded-2xl flex flex-col gap-1"
              style={{
                background: `linear-gradient(135deg, rgba(1, 53, 173, 0.95) 0%, rgba(20, 70, 190, 0.95) 100%)`,
                backdropFilter: "blur(16px)",
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                boxShadow: `0 8px 32px rgba(1, 53, 173, 0.25)`,
              }}
            >
              {navLinks.map((link: NavLink) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-colors duration-200 text-right"
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

// ── NavItem with hover highlight (Desktop) ────────────────────────────────────
function NavItem({ link }: { link: NavLink }) {
  return (
    <Link
      href={link.href}
      className="relative px-3 py-1 text-sm font-semibold rounded-full
                 transition-colors duration-200 tracking-wide whitespace-nowrap
                 group"
      style={{ color: BLUE }}
    >
      <span
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                   transition-opacity duration-200"
        style={{ backgroundColor: YELLOW }}
        aria-hidden
      />
      <span className="relative z-10 group-hover:text-[#0135AD] transition-colors duration-200">
        {link.label}
      </span>
    </Link>
  );
}