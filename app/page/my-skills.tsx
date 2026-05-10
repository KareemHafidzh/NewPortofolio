import React from 'react';

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

// ─── EACH SKILL ITEM ──────────────────────────────────────────────────
const SkillItem = ({ name, logo }: Skill) => (
  <div className="group flex flex-col items-center justify-center text-center p-4 rounded-2xl transition-all duration-200 hover:bg-white/90 hover:backdrop-blur-sm hover:shadow-md">
    <img
      src={logo}
      alt={`${name} logo`}
      className="w-16 h-16 object-contain mb-3 transition-transform duration-200 group-hover:scale-110"
    />
    <p className="text-sm font-semibold text-[#0135AD] leading-normal">
      {name}
    </p>
  </div>
);

// ─── TECH STACK SECTION ───────────────────────────────────────────────
const TechStackSection = () => {
  return (
    <section className="pt-25 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">

        <div className="text-center mb-16 max-w-2xl">
          {/* Subtext — yellow pill, matching the hero role badge */}
          <span className="inline-block px-3 py-0.5 rounded-full bg-[#F4E11B] text-[#0135AD] text-xs font-bold tracking-widest uppercase mb-4">
            Skills &amp; Experience
          </span>
          {/* Title — deep blue */}
          <h2 className="text-4xl font-extrabold text-[#0135AD] leading-tight">
            Working with Latest Technologies &amp; Stack
          </h2>
          {/* Yellow underline accent */}
          <div className="mx-auto mt-4 h-[3px] w-16 rounded-full bg-[#F4E11B]" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-8 w-full">
          {skillsData.map((skill, index) => (
            <SkillItem key={index} name={skill.name} logo={skill.logo} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TechStackSection;