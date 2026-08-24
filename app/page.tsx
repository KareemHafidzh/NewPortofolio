"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navigation";
import HeroSection from "./page/heroPage";
import TechStackSection from "./page/my-skills";
import MyProjects from "./page/my-projects";
import MyExperience from "./page/my-experience";
import Footer from "./components/footer";
import AnimatedLogo from "./components/AnimatedLogo";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const handleAnimationComplete = useCallback(() => setShowContent(true), []);

  return (
    // Same backdrop as <body>, repeated on a real element: body's background
    // propagates to the page canvas, which mix-blend-mode can't blend against —
    // without this the hero's Spider-Man layer disappears. Identical origin, so
    // the dot grid stays in phase.
    <div className="relative flex flex-col flex-1 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">

      <Navbar/>
      <AnimatedLogo onAnimationComplete={handleAnimationComplete} />

      {showContent && (
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col flex-1 w-full pt-16"
        >
          <HeroSection />
          <TechStackSection />
          <MyExperience />
          <MyProjects />
          <Footer />
        </motion.main>
      )}
    </div>
  );
}