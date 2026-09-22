import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this folder. Without it, Next 16 infers
  // the parent directory as the root and resolves node_modules from there —
  // which is why `tailwindcss` couldn't be found (it lives in this folder's
  // node_modules, not the parent's).
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
