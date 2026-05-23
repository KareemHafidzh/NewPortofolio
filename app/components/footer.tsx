"use client";

const BLUE   = "#0135AD";
const YELLOW = "#F4E11B";

const WHATSAPP_NUMBER = "6281295948194";
const EMAIL           = "hafidzhkareem@email.com";
const LINKEDIN        = "https://linkedin.com/in/kareem-hafidzh-34303421b";
const INSTAGRAM       = "https://instagram.com/kareem_hafidzh";

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
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

        .footer-link { transition: color 0.2s, letter-spacing 0.2s; }
        .footer-link:hover { color: ${YELLOW} !important; letter-spacing: 0.08em; }

        .cta-btn { transition: background 0.2s, transform 0.2s, box-shadow 0.2s; }
        .cta-btn:hover {
          background: ${YELLOW}dd !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px ${YELLOW}55;
        }

        .social-chip { transition: background 0.2s, color 0.2s, transform 0.2s; }
        .social-chip:hover {
          background: ${YELLOW} !important;
          color: ${BLUE} !important;
          transform: translateY(-2px);
        }
      `}</style>

      <section className="w-full pb-8 pt-16 sm:pt-20 sm:pb-10 bg-[#F4E11B]/[0.06] px-4 sm:px-6 lg:px-8">

        {/* ── Card ── */}
        <div
          className="relative max-w-7xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{ background: BLUE, boxShadow: `0 32px 80px ${BLUE}55` }}
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -top-16 -right-16 sm:-top-28 sm:-right-28 w-48 sm:w-80 h-48 sm:h-80 rounded-full opacity-10"
            style={{ background: YELLOW }} />
          <div className="pointer-events-none absolute -bottom-10 -left-10 sm:-bottom-16 sm:-left-16 w-32 sm:w-48 h-32 sm:h-48 rounded-full opacity-10"
            style={{ background: YELLOW }} />

          {/* ── Card inner ── */}
          <div className="relative z-10 px-6 sm:px-10 md:px-16 py-10 sm:py-14">

            {/* Top row: label + spinning badge */}
            <div className="flex items-start justify-between mb-6 sm:mb-8">
              <span
                className="inline-block px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase"
                style={{ background: YELLOW, color: BLUE }}
              >
                Open to freelance
              </span>

              {/* Spinning circular badge — smaller on mobile */}
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 shrink-0">
                <svg viewBox="0 0 80 80" className="spin-slow w-full h-full">
                  <defs>
                    <path id="circle-path" d="M 40,40 m -28,0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0" />
                  </defs>
                  <text className="text-[8.5px] font-bold tracking-widest fill-current" style={{ fill: `${YELLOW}99` }}>
                    <textPath href="#circle-path">· DONT FORGET TO CONTACT ME ·</textPath>
                  </text>
                </svg>
                <div className="pulse-dot absolute inset-0 m-auto w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                  style={{ background: YELLOW }} />
              </div>
            </div>

            {/* Headline */}
            <h2 className="font-extrabold leading-[1.05] tracking-tight text-white mb-3"
              style={{ fontSize: "clamp(1.75rem, 6vw, 3.75rem)" }}
            >
              Let&apos;s build something
              <br />
              <span style={{ color: YELLOW }}>remarkable.</span>
            </h2>

            <p className="text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 max-w-lg"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Got a project in mind or just want to say hi? My inbox is always open —
              whether it&apos;s a startup idea, a freelance gig, or a full-time role.
            </p>

            {/* CTA buttons — stack on mobile, row on sm+ */}
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 mb-10 sm:mb-14">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm tracking-wide w-full xs:w-auto"
                style={{ background: YELLOW, color: BLUE }}
              >
                WhatsApp Me
                <ArrowUpRightIcon />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="cta-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm tracking-wide w-full xs:w-auto"
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

            {/* Divider */}
            <div className="w-full h-px mb-6 sm:mb-8" style={{ background: "rgba(255,255,255,0.08)" }} />

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">

              {/* Name + copyright */}
              <div>
                <p className="text-white font-bold text-sm sm:text-base tracking-tight mb-0.5">
                  Kareem Abdul Hafidzh
                </p>
                <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                  © {new Date().getFullYear()} · All rights reserved
                </p>
              </div>

              {/* Social chips — wrap on small screens */}
              <div className="flex items-center flex-wrap gap-2">
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
                    className="social-chip inline-block px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase"
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

          </div>
        </div>

        {/* Below-card note */}
        <p className="text-center text-[11px] font-mono mt-5 sm:mt-6" style={{ color: `${BLUE}50` }}>
          coffee make&apos;s me focus on coding ☕
        </p>
      </section>
    </>
  );
}