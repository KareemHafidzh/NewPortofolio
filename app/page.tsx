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
    <div className="relative flex flex-col flex-1">

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