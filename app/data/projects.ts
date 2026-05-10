// ─── Types ────────────────────────────────────────────────────────────────────
export type CardSize = "hero" | "med" | "small" | "thin";

export interface Project {
  id: number;
  num: string;
  title: string;
  desc?: string;
  tags: string[];
  wallpaper: string | null;
  wallpaperColor: string;
  col: string;
  row: string;
  size: CardSize;
  year: string;
}

// ─── Project Data ─────────────────────────────────────────────────────────────
export const PROJECTS: Project[] = [
  {
    id: 1,
    num: "01",
    title: "KChat App",
    desc: "IOS Mobile Application for chatting between users. Built with SwiftUI and Firebase.",
    tags: ["Swift", "Firebase", "MVVM", "SwiftUI"],
    wallpaper: "/Photo/Project/kchat.png",
    wallpaperColor: "from-orange-300 via-red-200 to-rose-300",
    col: "1/3",
    row: "1/3",
    size: "hero",
    year: "2025",
  },
  {
    id: 2,
    num: "02",
    title: "Kshop Ecommerce",
    desc: "Ecommerce platform for selling products online. Built with Swift and Firebase, featuring MVVM and multi-user support.",
    tags: ["Swift", "Firebase", "MVVM", "Multi-User", "SwiftUI"],
    wallpaper: "/Photo/Project/kshop.jpg",
    wallpaperColor: "from-emerald-300 via-teal-200 to-cyan-300",
    col: "1/3",
    row: "3/3",
    size: "hero",
    year: "2025",
  },
  {
    id: 3,
    num: "03",
    title: "First Portofolio App",
    desc: "Animation Three.js, 3D visualization, and Tailwind CSS for portofolio app.",
    tags: ["Three.js", "Tailwind CSS"],
    wallpaper: "/Photo/Project/Portofolio.png",
    wallpaperColor: "from-violet-300 via-purple-200 to-fuchsia-300",
    col: "3/4",
    row: "1/4",
    size: "med",
    year: "2025",
  },
  {
    id: 4,
    num: "04",
    title: "Hacker News App",
    desc: "Simple Hacker News built with SwiftUI and fetching data from the official Hacker News API.",
    tags: ["API", "Swift", "MVVM", "SwiftUI"],
    wallpaper: "/Photo/Project/hackernews.png",
    wallpaperColor: "from-blue-300 via-sky-200 to-indigo-300",
    col: "4/6",
    row: "1/2",
    size: "med",
    year: "2025",
  },
  {
    id: 5,
    num: "05",
    title: "Weather App",
    desc: "Simple weather app built with SwiftUI and fetching data from the official weather API.",
    tags: ["API", "Swift", "MVVM", "UIkit"],
    wallpaper: "/Photo/Project/weatherApp.jpg",
    wallpaperColor: "from-rose-300 via-pink-200 to-fuchsia-300",
    col: "4/6",
    row: "2/3",
    size: "med",
    year: "2025",
  },
  {
    id: 6,
    num: "06",
    title: "Geodashboard",
    tags: ["React", "NextJS", "Tailwind CSS", "Vector Tiles", "MapLibre GL JS", "Machine Learning Integration", "Geoman"],
    wallpaper: "/Photo/Project/geodashboard.jpg",
    wallpaperColor: "from-amber-300 via-yellow-200 to-orange-300",
    col: "4/6",
    row: "3/4",
    size: "med",
    year: "2026",
  },
  {
    id: 7,
    num: "07",
    title: "JivaSport Brand Identity",
    desc: "First client project: crafting a dynamic brand identity for JivaSport. The project encompassed typography, and a vibrant color palette, all tailored to capture the energy and spirit of the brand.",
    tags: ["React", "NextJS", "Tailwind CSS", "Branding"],
    wallpaper: "/Photo/Project/jivasport.png",
    wallpaperColor: "from-amber-200 via-orange-300 to-yellow-200",
    col: "6/7",
    row: "1/3",
    size: "hero",
    year: "2026",
  },
  {
    id: 8,
    num: "08",
    title: "ByteCoin Price RealTime",
    desc: "testtest",
    tags: ["Swift", "UIKit"],
    wallpaper: "/Photo/Project/bytecoin.png",
    wallpaperColor: "from-amber-200 via-orange-300 to-yellow-200",
    col: "6/8",
    row: "3/4",
    size: "hero",
    year: "2025",
  },
  {
    id: 9,
    num: "09",
    title: "Tipsy App",
    desc: "An App to split bill with friends and supported tax percentage, built with Swift and Firebase, use MVVM.",
    tags: ["Swift", "UIKit"],
    wallpaper: "/Photo/Project/tipsy.png",
    wallpaperColor: "from-amber-200 via-orange-300 to-yellow-200",
    col: "7/8",
    row: "1/3",
    size: "hero",
    year: "2025",
  },
];