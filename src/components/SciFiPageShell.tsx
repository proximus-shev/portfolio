"use client";

import type { PointerEvent, ReactNode } from "react";
import { useRef } from "react";
import { PortfolioHeader } from "@/components/PortfolioHeader";
import { SciFiBackground } from "@/components/SciFiBackground";

const backgroundCode = [
  "const project = await build(idea);",
  "type Status = 'planned' | 'live';",
  "function ship(feature) { return test(feature); }",
  "def analyze(document): return insights",
  "interface Product { value: true; }",
  "git push origin main",
  "SELECT title, stack FROM projects;",
  "auto result = compile(portfolio);",
];

const floatingCode = Array.from({ length: 4 }, (_, layer) =>
  backgroundCode.map((row, index) => ({ row, index, layer })),
).flat();

type SciFiPageShellProps = {
  children: ReactNode;
};

export function SciFiPageShell({ children }: SciFiPageShellProps) {
  const mainRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);

  const updateGlowPosition = (event: PointerEvent<HTMLElement>) => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = window.requestAnimationFrame(() => {
      mainRef.current?.style.setProperty("--mouse-x", `${event.clientX}px`);
      mainRef.current?.style.setProperty("--mouse-y", `${event.clientY}px`);
    });
  };

  return (
    <main
      ref={mainRef}
      onPointerDown={updateGlowPosition}
      onPointerMove={updateGlowPosition}
      className="mouse-glow relative isolate min-h-screen overflow-x-clip bg-[#02040b] text-white"
    >
      <div className="site-atmosphere pointer-events-none fixed inset-0" />
      <div className="site-grid pointer-events-none fixed inset-0" />
      <SciFiBackground
        variant="orbital"
        priority
        fixed
        intensity="soft"
      />
      <div
        className="code-rain pointer-events-none fixed inset-0"
        aria-hidden="true"
      >
        {floatingCode.map(({ row, index, layer }) => (
          <span
            key={`${row}-${index}-${layer}`}
            className="absolute whitespace-nowrap font-mono text-[9px] text-blue-100/70"
            style={{
              left: `${(index * 31 + layer * 19) % 96}%`,
              top: `${(index * 17 + layer * 23) % 94}%`,
              animationDelay: `${index * 0.3 + layer * 0.8}s`,
            }}
          >
            {row}
          </span>
        ))}
      </div>
      <PortfolioHeader />
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {children}
      </div>
    </main>
  );
}
