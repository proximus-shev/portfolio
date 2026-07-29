"use client";

import Link from "next/link";
import { TypewriterHeading } from "@/components/TypewriterHeading";
import type { MouseEvent, PointerEvent } from "react";
import { useRef } from "react";
import {
  SiFastapi,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

const logs = [
  "booting portfolio_shell",
  "loading react.next.typescript",
  "compiling clean interfaces",
  "deploying real-world projects",
];

const codeRows = [
  "const craft = 'frontend';",
  "npm run build --portfolio",
  "type Stack = React | Next | TS",
  "deploy('proximus-shev')",
  "interface Project { polish: true }",
  "git commit -m 'ship details'",
];

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
  "class Developer: pass",
  "if __name__ == '__main__': build()",
  "std::vector<std::string> stack = {'ts', 'cpp'};",
  "auto result = compile(portfolio);",
  "#include <iostream>",
  "template <typename T> void render(T component);",
  "console.log('clean user flows');",
  "document.querySelector('#work')",
  "const response = await fetch('/api/projects');",
  "type Route = '/' | '/projects' | '/contact';",
  "git push origin main",
  "SELECT project, stack FROM portfolio;",
  "CREATE INDEX idx_projects_status;",
  "docker compose up --build",
  "pnpm lint && pnpm build",
];

const floatingCode = Array.from({ length: 3 }, (_, layer) =>
  backgroundCode.map((row, index) => ({ row, index, layer })),
).flat();

const tools = [
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Python", icon: SiPython },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "Supabase", icon: SiSupabase },
  { name: "OpenAI", icon: null },
  { name: "FastAPI", icon: SiFastapi },
  { name: "PostgreSQL", icon: SiPostgresql },
];

export function TerminalCodeLanding() {
  const mainRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);

  const updateGlowPosition = (
    event: MouseEvent<HTMLElement> | PointerEvent<HTMLElement>,
  ) => {
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
      onMouseMove={updateGlowPosition}
      className="mouse-glow relative isolate min-h-screen overflow-x-hidden bg-[#05070d] text-white"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.26),transparent_28%),linear-gradient(180deg,#05070d_0%,#020617_58%,#000_100%)]" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(96,165,250,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.08)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40" />
      <div
        className="code-rain pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
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
      <div className="absolute left-1/2 top-0 z-[2] hidden h-full w-px bg-blue-300/15 shadow-[0_0_80px_18px_rgba(59,130,246,0.22)] md:block" />

      <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
        <a
          href="#top"
          className="brand-hover relative overflow-hidden py-2 font-mono text-xs font-bold uppercase tracking-[0.24em] text-blue-100 transition duration-300 hover:tracking-[0.3em] hover:text-white sm:text-sm sm:tracking-[0.28em]"
        >
          Proximus Shev
        </a>
        <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs text-white/55 md:block">
          status: available_for_projects
        </div>
      </header>

      <section
        id="top"
        className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-5 pb-10 pt-5 sm:px-8 sm:pb-14 sm:pt-8 lg:min-h-[calc(100vh-80px)] lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:px-14"
      >
        <div className="animate-fade-up relative text-left">
          <p className="identity-path relative z-10 inline-flex max-w-full items-center gap-2 overflow-hidden border border-blue-200/20 bg-blue-500/10 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100 shadow-[0_0_32px_rgba(37,99,235,0.16)] transition duration-300 hover:-translate-y-0.5 hover:border-blue-200/55 hover:bg-blue-400/15 hover:text-white hover:shadow-[0_0_44px_rgba(37,99,235,0.34)] sm:gap-3 sm:px-4 sm:text-xs sm:tracking-[0.28em]">
            <span className="text-blue-300">./</span>
            <span className="truncate">John-Amoako-Appiah</span>
            <span className="identity-cursor h-4 w-2 bg-blue-200" />
          </p>
          <div className="terminal-heading-wrap group relative mt-5 max-w-3xl overflow-hidden border border-blue-200/0 p-1 transition duration-500 hover:border-blue-200/25 sm:mt-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(96,165,250,0.2),transparent_32%),linear-gradient(90deg,rgba(37,99,235,0.08),transparent)] opacity-0 transition duration-500 group-hover:opacity-100" />
            <div
              className="terminal-code-layer absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
              aria-hidden="true"
            >
              {codeRows.map((row, index) => (
                <span
                  key={row}
                  className="absolute whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.22em] text-blue-100/35"
                  style={{
                    left: `${index % 2 === 0 ? 2 : 38}%`,
                    top: `${8 + index * 14}%`,
                    animationDelay: `${index * 0.28}s`,
                  }}
                >
                  {row}
                </span>
              ))}
            </div>
            <TypewriterHeading />
          </div>
          <p className="relative z-10 mt-5 max-w-xl text-sm leading-7 text-white/66 sm:text-base lg:text-lg lg:leading-8">
            Frontend, full-stack, and software development brought together in
            focused portfolio projects with clear user flows.
          </p>
          <div className="relative z-10 mt-6 flex flex-wrap gap-2 sm:gap-3 lg:mt-8">
            <Link
              href="/projects"
              className="code-chip relative overflow-hidden border border-blue-200/40 bg-blue-500/20 px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-blue-50 transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:bg-blue-400/25 hover:shadow-[0_0_28px_rgba(59,130,246,0.26)] sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.18em]"
            >
              View Projects
            </Link>
            {tools.map(({ name, icon: Icon }) => (
              <span
                className="tool-chip code-chip group relative grid min-h-10 min-w-24 place-items-center overflow-hidden border border-blue-200/18 bg-blue-500/10 px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-blue-100 transition duration-300 hover:-translate-y-1 hover:border-blue-200/60 hover:bg-blue-400/15 hover:shadow-[0_0_34px_rgba(59,130,246,0.3)] sm:min-h-11 sm:min-w-28 sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.18em]"
                key={name}
                title={name}
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 hover:opacity-100" />
                <span className="tool-name transition duration-300 group-hover:scale-75 group-hover:opacity-0">
                  {name}
                </span>
                {Icon ? (
                  <Icon className="tool-icon absolute text-2xl text-blue-100 opacity-0 drop-shadow-[0_0_14px_rgba(147,197,253,0.7)] transition duration-300 group-hover:scale-110 group-hover:opacity-100" />
                ) : (
                  <span className="tool-icon absolute grid h-7 w-7 place-items-center rounded-full border border-blue-100/70 text-sm font-black text-blue-100 opacity-0 shadow-[0_0_20px_rgba(147,197,253,0.42)] transition duration-300 group-hover:scale-110 group-hover:opacity-100">
                    AI
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <aside className="terminal-panel animate-fade-up-delay-2 relative overflow-hidden border border-blue-200/18 bg-black/45 p-3 font-mono shadow-[0_0_70px_rgba(37,99,235,0.16)] backdrop-blur-md transition duration-500 hover:border-blue-200/45 hover:shadow-[0_0_96px_rgba(37,99,235,0.24)] sm:p-4">
          <div
            className="terminal-code-layer pointer-events-none absolute inset-0 opacity-35"
            aria-hidden="true"
          >
            {codeRows.concat(logs).map((row, index) => (
              <span
                key={`${row}-panel-${index}`}
                className="absolute whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-blue-100/25"
                style={{
                  left: `${(index * 19) % 70}%`,
                  top: `${6 + ((index * 11) % 78)}%`,
                  animationDelay: `${index * 0.32}s`,
                }}
              >
                {row}
              </span>
            ))}
          </div>
          <div className="relative z-10 flex items-center gap-2 border-b border-white/10 pb-3 sm:pb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400 sm:h-3 sm:w-3" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-300 sm:h-3 sm:w-3" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400 sm:h-3 sm:w-3" />
            <span className="ml-3 text-xs text-white/40">portfolio.tsx</span>
          </div>
          <div className="relative z-10 space-y-2 py-4 text-xs leading-6 text-white/74 sm:space-y-3 sm:py-5 sm:text-sm lg:space-y-4 lg:py-6 lg:leading-7">
            {logs.map((log, index) => (
              <p
                className="rounded border border-transparent bg-black/20 px-3 py-2 transition hover:border-blue-200/25 hover:bg-blue-500/10 hover:text-blue-50"
                key={log}
              >
                <span className="text-blue-300">0{index + 1}</span>{" "}
                <span className="text-white/35">$</span> {log}
              </p>
            ))}
            <pre className="hidden overflow-hidden rounded border border-blue-200/15 bg-black/45 p-4 text-xs leading-6 text-blue-100 shadow-[inset_0_0_30px_rgba(37,99,235,0.08)] transition hover:border-blue-200/40 hover:bg-blue-500/10 sm:block">
              {`const developer = {
  name: "John Amoako Appiah",
  brand: "Proximus Shev",
  focus: ["frontend", "full-stack", "software"],
  nextProject: "portfolio ecosystem"
};`}
            </pre>
          </div>
        </aside>
      </section>
    </main>
  );
}
