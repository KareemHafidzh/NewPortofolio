// small = 1col × 1row  240 × 220px
// thin  = 2col × 1row  488 × 220px
// med   = 1col × 3row  240 × 668px
// hero  = 2col × 2row  488 × 448px

// ─── Column map (10 cols total) ───────────────────────────────────────────────
//  1–2  : ToDoList (row 1) + KojekApp (rows 2–3)
//  3–4  : KChat (rows 1–2) + Kshop (row 3)
//  5    : Portfolio (rows 1–3)
//  6–7  : HackerNews (row 1) / Weather (row 2) / Geodashboard (row 3)
//  8    : JivaSport (rows 1–2)
//  8–9  : ByteCoin (row 3)
//  9    : Tipsy (rows 1–2)

// ─── Types ────────────────────────────────────────────────────────────────────
export type CardSize         = "hero" | "med" | "small" | "thin";
export type ImageOrientation = "landscape" | "portrait";

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
  githubUrl?: string;
  images?: string[];
  imageOrientation?: ImageOrientation;
}

// ─── Project Data ─────────────────────────────────────────────────────────────
export const PROJECTS: Project[] = [
  // ── cols 1–2 (leftmost) ─────────────────────────────────────────────────────
  {
    id: 11,
    num: "11",
    title: "To Do List App",
    desc: "Not just a simple to-do list app built with Swift and UIKit. It features a calendar that we can pick where ever we want to add a task, and also support for adding tasks with specific dates.",
    tags: ["Swift", "UIKit", "Supabase", "MVVM"],
    wallpaper: "/Photo/Project/ToDoList/ToDoList.png",
    wallpaperColor: "from-amber-200 via-orange-300 to-yellow-200",
    col: "1/3",   // ← was 8/10
    row: "1/2",
    size: "hero",
    year: "2025",
    githubUrl: "https://github.com/yourusername/ToDoList",
    images: [
      "/Photo/Project/ToDoList/1.png",
      "/Photo/Project/ToDoList/2.png",
      "/Photo/Project/ToDoList/3.png",
      "/Photo/Project/ToDoList/4.png",
    ],
    imageOrientation: "portrait",
  },
  {
    id: 10,
    num: "10",
    title: "Kojek App",
    desc: "A customer-focused ride-hailing application that allows users to search destinations, choose pickup locations, and receive optimized route recommendations with dynamically calculated pricing based on predefined business logic. Drivers can switch between online and offline status, receive real-time ride notifications, and accept booking requests based on availability. Built using SwiftUI with an MVVM architecture, Supabase, and Node.js as the backend.",
    tags: ["Swift", "SwiftUI", "Node.JS", "Supabase", "Role Based User", "MVVM"],
    wallpaper: "/Photo/Project/Kojek/KojekApp.png",
    wallpaperColor: "from-amber-200 via-orange-300 to-yellow-200",
    col: "1/3",   // ← was 8/10
    row: "2/4",
    size: "hero",
    year: "2026",
    githubUrl: "https://github.com/yourusername/tipsy",
    images: [
      "/Photo/Project/Kojek/1.png",
      "/Photo/Project/Kojek/2.png",
      "/Photo/Project/Kojek/3.png",
      "/Photo/Project/Kojek/4.png",
      "/Photo/Project/Kojek/5.png",
      "/Photo/Project/Kojek/6.png",
      "/Photo/Project/Kojek/7.png",
      "/Photo/Project/Kojek/8.png",
    ],
    imageOrientation: "portrait",
  },

  // ── cols 3–4 (was 1–2) ──────────────────────────────────────────────────────
  {
    id: 1,
    num: "01",
    title: "KChat App",
    desc: "IOS Mobile Application for chatting between users. Built with SwiftUI and Firebase.",
    tags: ["Swift", "Firebase", "MVVM", "SwiftUI"],
    wallpaper: "/Photo/Project/kchat.png",
    wallpaperColor: "from-orange-300 via-red-200 to-rose-300",
    col: "3/5",   // ← was 1/3
    row: "1/3",
    size: "hero",
    year: "2025",
    githubUrl: "https://github.com/yourusername/kchat",
    images: ["/Photo/Project/kchat.png"],
    imageOrientation: "portrait",
  },
  {
    id: 2,
    num: "02",
    title: "Kshop Ecommerce",
    desc: "Ecommerce platform for selling products online. Built with Swift and Firebase, featuring MVVM and multi-user support.",
    tags: ["Swift", "Firebase", "MVVM", "Multi-User", "SwiftUI"],
    wallpaper: "/Photo/Project/kshop.jpg",
    wallpaperColor: "from-emerald-300 via-teal-200 to-cyan-300",
    col: "3/5",   // ← was 1/3
    row: "3/4",   // ← was 3/3 (typo fixed)
    size: "hero",
    year: "2025",
    githubUrl: "https://github.com/yourusername/kshop",
    images: ["/Photo/Project/kshop.jpg"],
    imageOrientation: "portrait",
  },

  // ── col 5 (was 3) ────────────────────────────────────────────────────────────
  {
    id: 3,
    num: "03",
    title: "First Portofolio App",
    desc: "Animation Three.js, 3D visualization, and Tailwind CSS for portofolio app.",
    tags: ["Three.js", "Tailwind CSS"],
    wallpaper: "/Photo/Project/Portofolio.png",
    wallpaperColor: "from-violet-300 via-purple-200 to-fuchsia-300",
    col: "5/6",   // ← was 3/4
    row: "1/4",
    size: "med",
    year: "2025",
    githubUrl: "https://github.com/yourusername/portfolio",
    images: ["/Photo/Project/Portofolio.png"],
    imageOrientation: "landscape",
  },

  // ── cols 6–7 (was 4–5) ──────────────────────────────────────────────────────
  {
    id: 4,
    num: "04",
    title: "Hacker News App",
    desc: "Simple Hacker News built with SwiftUI and fetching data from the official Hacker News API.",
    tags: ["API", "Swift", "MVVM", "SwiftUI"],
    wallpaper: "/Photo/Project/hackernews.png",
    wallpaperColor: "from-blue-300 via-sky-200 to-indigo-300",
    col: "6/8",   // ← was 4/6
    row: "1/2",
    size: "med",
    year: "2025",
    githubUrl: "https://github.com/yourusername/hackernews",
    images: ["/Photo/Project/hackernews.png"],
    imageOrientation: "portrait",
  },
  {
    id: 5,
    num: "05",
    title: "Weather App",
    desc: "Simple weather app built with SwiftUI and fetching data from the official weather API.",
    tags: ["API", "Swift", "MVVM", "UIkit"],
    wallpaper: "/Photo/Project/weatherApp.jpg",
    wallpaperColor: "from-rose-300 via-pink-200 to-fuchsia-300",
    col: "6/8",   // ← was 4/6
    row: "2/3",
    size: "med",
    year: "2025",
    githubUrl: "https://github.com/yourusername/weather-app",
    images: ["/Photo/Project/weatherApp.jpg"],
    imageOrientation: "portrait",
  },
  {
    id: 6,
    num: "06",
    title: "Geodashboard",
    desc: "Interactive geospatial dashboard with vector tiles, real-time data visualization, and machine learning integration built on MapLibre GL JS.",
    tags: ["React", "NextJS", "Tailwind CSS", "Vector Tiles", "MapLibre GL JS", "Machine Learning Integration", "Geoman"],
    wallpaper: "/Photo/Project/geodashboard.jpg",
    wallpaperColor: "from-amber-300 via-yellow-200 to-orange-300",
    col: "6/8",   // ← was 4/6
    row: "3/4",
    size: "med",
    year: "2026",
    githubUrl: "https://github.com/yourusername/geodashboard",
    images: ["/Photo/Project/geodashboard.jpg"],
    imageOrientation: "landscape",
  },

  // ── cols 8–9 (was 6–7) ──────────────────────────────────────────────────────
  {
    id: 7,
    num: "07",
    title: "JivaSport Brand Identity",
    desc: "First client project: crafting a dynamic brand identity for JivaSport. The project encompassed typography, and a vibrant color palette, all tailored to capture the energy and spirit of the brand.",
    tags: ["React", "NextJS", "Tailwind CSS", "Branding"],
    wallpaper: "/Photo/Project/jivasport.png",
    wallpaperColor: "from-amber-200 via-orange-300 to-yellow-200",
    col: "8/9",   // ← was 6/7
    row: "1/3",
    size: "hero",
    year: "2026",
    githubUrl: "https://github.com/yourusername/jivasport",
    images: ["/Photo/Project/jivasport.png"],
    imageOrientation: "landscape",
  },
  {
    id: 8,
    num: "08",
    title: "ByteCoin Price RealTime",
    desc: "Real-time cryptocurrency price tracker built with Swift and UIKit.",
    tags: ["Swift", "UIKit"],
    wallpaper: "/Photo/Project/bytecoin.png",
    wallpaperColor: "from-amber-200 via-orange-300 to-yellow-200",
    col: "8/10",  // ← was 6/8
    row: "3/4",
    size: "hero",
    year: "2025",
    githubUrl: "https://github.com/yourusername/bytecoin",
    images: ["/Photo/Project/bytecoin.png"],
    imageOrientation: "portrait",
  },
  {
    id: 9,
    num: "09",
    title: "Tipsy App",
    desc: "An App to split bill with friends and supported tax percentage, built with Swift and Firebase, use MVVM.",
    tags: ["Swift", "UIKit"],
    wallpaper: "/Photo/Project/tipsy.png",
    wallpaperColor: "from-amber-200 via-orange-300 to-yellow-200",
    col: "9/10",
    row: "1/3",
    size: "hero",
    year: "2025",
    githubUrl: "https://github.com/yourusername/tipsy",
    images: ["/Photo/Project/tipsy.png"],
    imageOrientation: "portrait",
  },
];