"use client";

// ─── Palette ──────────────────────────────────────────────────────────────────
const BLUE   = "#0135AD";
const YELLOW = "#F4E11B";

// ─── Config ───────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "6281295948194";
const EMAIL           = "hafidzhkareem@email.com";
const LINKEDIN        = "https://linkedin.com/in/kareem-hafidzh-34303421b";
const INSTAGRAM       = "https://instagram.com/kareem_hafidzh";

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M7 17 17 7" /><path d="M9 7h8v8" />
    </svg>
  );
}

export default function Footer() {
  return (
    <>
      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .spin-slow { animation: spinSlow 18s linear infinite; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

        .footer-link {
          transition: color 0.2s, letter-spacing 0.2s;
        }
        .footer-link:hover {
          color: ${YELLOW} !important;
          letter-spacing: 0.08em;
        }

        .cta-btn {
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .cta-btn:hover {
          background: ${YELLOW}dd !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${YELLOW}55;
        }

        .social-chip {
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .social-chip:hover {
          background: ${YELLOW} !important;
          color: ${BLUE} !important;
          transform: translateY(-2px);
        }
      `}</style>

      {/* Outer wrapper — page bottom padding, faint yellow wash */}
      <section className="w-full pb-10 pt-24 bg-[#F4E11B]/[0.06]">

        {/* ── The card ─────────────────────────────────────────────────── */}
        <div
          className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden"
          style={{
            background: BLUE,
            boxShadow: `0 32px 80px ${BLUE}55`,
          }}
        >
          {/* ── Decorative yellow circle top-right ── */}
          <div
            className="pointer-events-none absolute -top-28 -right-28 w-80 h-80 rounded-full opacity-10"
            style={{ background: YELLOW }}
          />
          {/* ── Decorative small circle bottom-left ── */}
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
            style={{ background: YELLOW }}
          />

          {/* ── Card inner ── */}
          <div className="relative z-10 px-8 md:px-16 py-14">

            {/* Top row: label + spinning badge */}
            <div className="flex items-start justify-between mb-8">
              <span
                className="inline-block px-3 py-0.5 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{ background: YELLOW, color: BLUE }}
              >
                Open to freelance
              </span>

              {/* Spinning circular text badge */}
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 80 80" className="spin-slow w-full h-full">
                  <defs>
                    <path id="circle-path" d="M 40,40 m -28,0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0" />
                  </defs>
                  <text className="text-[8.5px] font-bold tracking-widest fill-current" style={{ fill: `${YELLOW}99` }}>
                    <textPath href="#circle-path">
                      · DONT FORGET TO CONTACT ME ·
                    </textPath>
                  </text>
                </svg>
                {/* Center dot */}
                <div
                  className="pulse-dot absolute inset-0 m-auto w-3 h-3 rounded-full"
                  style={{ background: YELLOW }}
                />
              </div>
            </div>

            {/* Main headline */}
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-white mb-3"
            >
              Let&apos;s build something
              <br />
              <span style={{ color: YELLOW }}>remarkable.</span>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed mb-10 max-w-lg" style={{ color: "rgba(255,255,255,0.55)" }}>
              Got a project in mind or just want to say hi? My inbox is always open —
              whether it&apos;s a startup idea, a freelance gig, or a full-time role.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap gap-3 mb-14">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm tracking-wide"
                style={{ background: YELLOW, color: BLUE }}
              >
                WhatsApp Me
                <ArrowUpRightIcon />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="cta-btn inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm tracking-wide"
                style={{
                  background: "transparent",
                  color: YELLOW,
                  border: `1.5px solid ${YELLOW}55`,
                }}
              >
                Send an Email
                <ArrowUpRightIcon />
              </a>
            </div>

            {/* ── Divider ── */}
            <div className="w-full h-px mb-8" style={{ background: "rgba(255,255,255,0.08)" }} />

            {/* ── Bottom row ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

              {/* Name + copyright */}
              <div>
                <p className="text-white font-bold text-base tracking-tight mb-0.5">
                  Kareem Abdul Hafidzh
                </p>
                <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                  © {new Date().getFullYear()} · All rights reserved
                </p>
              </div>

              {/* Social chips */}
              <div className="flex items-center gap-2">
                {[
                  { label: "LinkedIn",  href: LINKEDIN },
                  { label: "Instagram", href: INSTAGRAM },
                  { label: "Email",     href: `mailto:${EMAIL}` },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    className="social-chip inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

          </div>{/* /card inner */}
        </div>{/* /card */}

        {/* Tiny below-card note */}
        <p className="text-center text-[11px] font-mono mt-6" style={{ color: `${BLUE}50` }}>
          coffee make's me focus on coding ☕
        </p>
      </section>
    </>
  );
}