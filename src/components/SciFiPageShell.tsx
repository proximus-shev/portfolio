"use client";

import { useRef } from "react";

const backgroundCode = [
  "const app = createPortfolio({ stack: 'next' });",
  "export type ProjectStatus = 'draft' | 'live';",
  "function ship(feature) { return test(feature); }",
  "await deploy('proximus-shev');",
  "const skills = ['React', 'Next.js', 'TypeScript'];",
  "interface Developer { focus: string[]; }",
  "def build_ui(system): return polish(system)",
  "from portfolio import projects, contact",
  "async def main(): await launch_site()",
  "if __name__ == '__main__': build()",
  "std::vector<std::string> stack = {'ts', 'cpp'};",
  "auto result = compile(portfolio);",
  "#include <iostream>",
  "template <typename T> void render(T component);",
  "console.log('clean user flows');",
  "const response = await fetch('/api/projects');",
  "type Route = '/' | '/projects' | '/contact';",
  "git push origin main",
  "SELECT project, stack FROM portfolio;",
  "docker compose up --build",
];

const floatingCode = Array.from({ length: 3 }, (_, layer) =>
  backgroundCode.map((row, index) => ({ row, index, layer })),
).flat();

type SciFiPageShellProps = {
  children: React.ReactNode;
};

export function SciFiPageShell({ children }: SciFiPageShellProps) {
  const mainRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);

  const updateGlowPosition = (event: React.PointerEvent<HTMLElement>) => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = window.requestAnimationFrame(() => {
      const target = mainRef.current;

      if (!target) {
        return;
      }

      target.style.setProperty("--mouse-x", `${event.clientX}px`);
      target.style.setProperty("--mouse-y", `${event.clientY}px`);
    });
  };

  return (
    <main
      ref={mainRef}
      onPointerDown={updateGlowPosition}
      onPointerMove={updateGlowPosition}
      className="mouse-glow relative min-h-screen overflow-x-hidden bg-[#05070d] px-5 py-6 text-white sm:px-8 lg:px-14"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_8%,rgba(59,130,246,0.22),transparent_28%),linear-gradient(180deg,#05070d_0%,#020617_62%,#000_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(96,165,250,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.08)_1px,transparent_1px)] bg-[size:44px_44px] opacity-35" />
      <div className="code-rain pointer-events-none absolute inset-0" aria-hidden="true">
        {floatingCode.map(({ row, index, layer }) => (
          <span
            key={`${row}-${index}-${layer}`}
            className="absolute whitespace-nowrap font-mono text-[10px] tracking-[0.18em] text-blue-100/70"
            style={{
              left: `${(index * 23 + layer * 11) % 98}%`,
              top: `${(index * 11 + layer * 29) % 94}%`,
              animationDelay: `${index * 0.22 + layer * 0.8}s`,
              animationDuration: `${7 + ((index + layer) % 7) * 1.15}s`,
            }}
          >
            {row}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px bg-blue-300/15 shadow-[0_0_80px_18px_rgba(59,130,246,0.22)] md:block" />
      <div className="relative z-10 mx-auto max-w-7xl">{children}</div>
    </main>
  );
}
