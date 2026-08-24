"use client";

import React, { useRef, useState, useSyncExternalStore } from 'react';
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';
import { GAP, clamp01, point, webPath } from './spiral';

interface Skill {
  name: string;
  logo: string;
}

// ─── SKILLS DATA ──────────────────────────────────────────────────────
const skillsData: Skill[] = [
  { name: 'React', logo: '/skill-logo/1.png' },
  { name: 'MySQL', logo: '/skill-logo/2.png' },
  { name: '.NET', logo: '/skill-logo/3.png' },
  { name: 'Tailwind CSS', logo: '/skill-logo/4.png' },
  { name: 'Bootstrap', logo: '/skill-logo/5.png' },
  { name: 'Python', logo: '/skill-logo/6.png' },
  { name: 'C#', logo: '/skill-logo/7.png' },
  { name: 'C', logo: '/skill-logo/8.png' },
  { name: 'Swift', logo: '/skill-logo/9.png' },
  { name: 'Java', logo: '/skill-logo/10.png' },
  { name: 'Javascript', logo: '/skill-logo/11.png' },
  { name: 'Rest API', logo: '/skill-logo/12.png' },
  { name: 'Firebase', logo: '/skill-logo/13.png' },
  { name: 'GIT', logo: '/skill-logo/14.png' },
  { name: 'Three JS', logo: '/skill-logo/15.png' },
  { name: 'Next JS', logo: '/skill-logo/16.png' },
];

// Spiral geometry lives in ./spiral so the check file can exercise it.
const HEADING_DOCK = 0.18;  // scroll progress where the heading has finished
                            // sliding from centre to its left-hand berth

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const isReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

// ─── ONE SKILL ON THE SPIRAL ──────────────────────────────────────────
const SpiralItem = ({
  skill,
  index,
  spiral,
  isNewest,
}: {
  skill: Skill;
  index: number;
  spiral: MotionValue<number>;
  isNewest: boolean;
}) => {
  // Every item rides the same path, each lagging the one before it by GAP —
  // that lag is what makes them appear one by one and trail like a snake.
  const t = useTransform(spiral, (v) => clamp01(v - index * GAP));

  const left = useTransform(t, (v) => `${point(v)[0]}%`);
  const top = useTransform(t, (v) => `${point(v)[1]}%`);
  const scale = useTransform(t, [0, 0.85, 1], [1.05, 0.4, 0.12]);
  const opacity = useTransform(t, [0, 0.02, 0.8, 0.97], [0, 1, 1, 0]);
  const rotate = useTransform(t, [0, 1], [0, -540]);

  return (
    <motion.div
      style={{ left, top, x: '-50%', y: '-50%', scale, opacity, zIndex: index }}
      className="absolute flex flex-col items-center"
    >
      <motion.img
        src={skill.logo}
        alt={`${skill.name} logo`}
        style={{ rotate }}
        className="w-11 h-11 md:w-16 md:h-16 object-contain drop-shadow-sm"
      />
      {/* Only the item that just arrived is named. Scrolling back up makes an
          earlier item the newest again, so its name returns. */}
      <p
        className={`absolute top-full mt-1.5 whitespace-nowrap text-[11px] md:text-sm font-semibold text-[#0135AD] transition-opacity duration-300 ${
          isNewest ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {skill.name}
      </p>
    </motion.div>
  );
};

const Heading = ({ docked = false }: { docked?: boolean }) => (
  <>
    <span className="inline-block px-3 py-0.5 rounded-full bg-[#F4E11B] text-[#0135AD] text-xs font-bold tracking-widest uppercase mb-4">
      Skills &amp; Experience
    </span>
    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0135AD] leading-tight">
      Working with Latest Technologies &amp; Stack
    </h2>
    <div className={`mt-4 h-[3px] w-16 rounded-full bg-[#F4E11B] ${docked ? '' : 'mx-auto'}`} />
  </>
);

// ─── TECH STACK SECTION ───────────────────────────────────────────────
const TechStackSection = () => {
  const ref = useRef<HTMLElement>(null);
  const webRef = useRef<SVGPathElement>(null);

  // Own scroll progress instead of useScroll({ target }): framer measures the
  // target's offset once, and the intro animation + late-loading images shift
  // the page under it. Reading the rect per frame is always right.
  // ponytail: one rect read every frame, page-wide. Gate it on an
  // IntersectionObserver if the frame budget ever gets tight.
  const scrollYProgress = useMotionValue(0);
  useAnimationFrame(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const progress = span > 0 ? clamp01(-r.top / span) : 0;
    scrollYProgress.set(progress);
    // One attribute write a frame, cheaper than a motion value per segment.
    const spiral = clamp01((progress - HEADING_DOCK) / (1 - HEADING_DOCK));
    webRef.current?.setAttribute('d', webPath(spiral, skillsData.length));
  });

  // Centred over the whole pane at rest, then slid into its left berth. Both
  // halves of the centring (left 50% and the -50% self-offset) unwind together.
  const headingLeft = useTransform(scrollYProgress, [0, HEADING_DOCK], ['50%', '4%']);
  const headingX = useTransform(scrollYProgress, [0, HEADING_DOCK], ['-50%', '0%']);
  const spiral = useTransform(scrollYProgress, [HEADING_DOCK, 1], [0, 1]);

  const [docked, setDocked] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const d = v > HEADING_DOCK / 2;
    setDocked((prev) => (prev === d ? prev : d));
  });

  const [newest, setNewest] = useState(-1);
  useMotionValueEvent(spiral, 'change', (v) => {
    const i = v <= 0 ? -1 : Math.min(Math.floor(v / GAP), skillsData.length - 1);
    setNewest((prev) => (prev === i ? prev : i));
  });

  const reduced = useSyncExternalStore(subscribeReducedMotion, isReducedMotion, () => false);

  if (reduced) {
    return (
      <section ref={ref} className="pt-25 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-10 md:mb-16 max-w-2xl">
            <Heading />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-x-3 gap-y-4 md:gap-x-6 md:gap-y-8 w-full">
            {skillsData.map((skill) => (
              <div key={skill.name} className="flex flex-col items-center text-center p-2 md:p-4">
                <img src={skill.logo} alt={`${skill.name} logo`} className="w-10 h-10 md:w-16 md:h-16 object-contain mb-1.5 md:mb-3" />
                <p className="text-[11px] md:text-sm font-semibold text-[#0135AD]">{skill.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    // Tall wrapper = the scroll budget the pinned spiral spends.
    <section ref={ref} className="relative h-[350vh]">
      <div className="sticky top-0 h-screen overflow-hidden px-6 md:px-10">

        {/* Title: centred over the pane on arrival, then parked on the left,
            text left-aligned, and left there for the rest of the section. */}
        <motion.div
          style={{ left: headingLeft, x: headingX, y: '-50%' }}
          className={`absolute top-[16%] md:top-1/2 z-20 w-[min(84vw,26rem)] pointer-events-none ${
            docked ? 'text-left' : 'text-center'
          }`}
        >
          <Heading docked={docked} />
        </motion.div>

        {/* Skills coil: lower band on phones, right-hand side from md up. */}
        <div className="absolute inset-0 flex items-end justify-center pb-[6%] md:items-center md:justify-end md:pb-0 md:pr-[3%]">
          <div className="relative aspect-square w-[min(86vw,44vh)] md:w-[min(52vw,80vh)]">
            {/* preserveAspectRatio="none" maps the viewBox 1:1 onto the canvas %,
                so the thread lands exactly on the logo centres at any size. */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
              aria-hidden
            >
              <path
                ref={webRef}
                fill="none"
                stroke="#0135AD"
                strokeOpacity={0.55}
                strokeWidth={3.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {skillsData.map((skill, index) => (
              <SpiralItem
                key={skill.name}
                skill={skill}
                index={index}
                spiral={spiral}
                isNewest={index === newest}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TechStackSection;
