"use client";
import Link from "next/link";
import { motion } from "framer-motion";

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
  return (
    <nav className="fixed top-4 left-0 right-0 z-40 flex justify-center pointer-events-none">
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
  );
}

// ── NavItem with hover highlight ──────────────────────────────────────────────
function NavItem({ link }: { link: NavLink }) {
  return (
    <Link
      href={link.href}
      className="relative px-3 py-1 text-sm font-semibold rounded-full
                 transition-colors duration-200 tracking-wide whitespace-nowrap
                 group"
      style={{ color: BLUE }}
    >
      {/* Yellow pill highlight on hover */}
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