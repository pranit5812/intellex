"use client";

import React from "react";

export const AnimatedBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-20 overflow-hidden pointer-events-none select-none transition-colors duration-700"
    >
      {/* =========================================================================
          1. LIGHT THEME: Crisp, inspiring daylight academic studio
          Subtle cream & azure gradients, warm study sunshine orbs, and fine notebook graph
         ========================================================================= */}
      <div className="dark:hidden absolute inset-0 bg-[#fbfbfe]" />

      {/* Light Mode Notebook / Graph Texture */}
      <div
        className="dark:hidden absolute inset-0 opacity-[0.38]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 85%)",
        }}
      />

      {/* Light Mode Animated Floating Ambient Orbs */}
      <div className="dark:hidden">
        {/* Warm Sunrise Amber Orb (Top-Left) */}
        <div
          className="animate-orb-1 absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full blur-[100px] opacity-70 mix-blend-multiply"
          style={{
            background: "radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(253, 186, 116, 0.2) 50%, transparent 75%)",
          }}
        />

        {/* Clear Sky Cyan Orb (Right-Center) */}
        <div
          className="animate-orb-2 absolute top-1/4 -right-32 w-[38rem] h-[38rem] rounded-full blur-[110px] opacity-65 mix-blend-multiply"
          style={{
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(165, 243, 252, 0.25) 50%, transparent 75%)",
          }}
        />

        {/* Soft Violet / Emerald Focus Glow (Bottom-Center) */}
        <div
          className="animate-orb-3 absolute -bottom-32 left-1/3 w-[38rem] h-[38rem] rounded-full blur-[120px] opacity-55 mix-blend-multiply"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(52, 211, 153, 0.18) 60%, transparent 75%)",
          }}
        />
      </div>

      {/* =========================================================================
          2. DARK THEME: Deep cosmic obsidian academic laboratory
          Electric indigo, cyan aurora drifts, blueprint grid, and pulsing starlight halo
         ========================================================================= */}
      <div className="hidden dark:block absolute inset-0 bg-[#090d16]" />

      {/* Dark Mode Blueprint Grid Overlay */}
      <div
        className="hidden dark:block absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(129, 140, 248, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(129, 140, 248, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 35%, black 25%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 35%, black 25%, transparent 90%)",
        }}
      />

      {/* Dark Mode Animated Floating Aurora Orbs */}
      <div className="hidden dark:block">
        {/* Deep Electric Indigo / Cobalt Glow (Top-Left) */}
        <div
          className="animate-orb-1 absolute -top-36 -left-36 w-[42rem] h-[42rem] rounded-full blur-[130px] opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.42) 0%, rgba(129, 140, 248, 0.18) 50%, transparent 75%)",
          }}
        />

        {/* Cyber Cyan / Emerald Matrix Glow (Right-Center) */}
        <div
          className="animate-orb-2 absolute top-1/3 -right-40 w-[42rem] h-[42rem] rounded-full blur-[140px] opacity-55"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 80%)",
          }}
        />

        {/* Deep Purple / Fuchsia Nebular Bloom (Bottom-Left) */}
        <div
          className="animate-orb-3 absolute -bottom-40 left-1/4 w-[46rem] h-[46rem] rounded-full blur-[150px] opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.38) 0%, rgba(236, 72, 153, 0.15) 55%, transparent 80%)",
          }}
        />

        {/* Pulsing Ambient Aurora Horizon */}
        <div className="animate-aurora absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-transparent to-transparent" />
      </div>
    </div>
  );
};
