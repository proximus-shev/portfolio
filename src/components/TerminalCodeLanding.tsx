"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  HeartHandshake,
  Layers3,
  Mail,
  MonitorSmartphone,
} from "lucide-react";
import type { PointerEvent } from "react";
import { useRef } from "react";
import {
  SiFastapi,
  SiGithub,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { PortfolioHeader } from "@/components/PortfolioHeader";
import { SciFiBackground } from "@/components/SciFiBackground";
import { TypewriterHeading } from "@/components/TypewriterHeading";
import { projects } from "@/data/projects";

const backgroundCode = [
  "const craft = createInterface();",
  "type ProjectStatus = 'planned' | 'live';",
  "await deploy('proximus-shev');",
  "def solve(problem): return build(problem)",
  "interface Developer { focus: string[]; }",
  "std::vector<std::string> stack;",
  "SELECT project, stack FROM portfolio;",
  "git commit -m 'ship with purpose'",
  "async function build() { return impact; }",
  "from portfolio import ideas, execution",
  "const quality = tests.every(Boolean);",
  "#include <iostream>",
];

const floatingCode = Array.from({ length: 2 }, (_, layer) =>
  backgroundCode.map((row, index) => ({ row, index, layer })),
).flat();

const tools = [
  {
    name: "React",
    icon: SiReact,
    color: "text-cyan-300",
    accent: "stack-react",
  },
  {
    name: "Next.js",
    icon: SiNextdotjs,
    color: "text-white",
    accent: "stack-next",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    color: "text-blue-400",
    accent: "stack-typescript",
  },
  {
    name: "Python",
    icon: SiPython,
    color: "text-yellow-300",
    accent: "stack-python",
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "text-cyan-300",
    accent: "stack-tailwind",
  },
  {
    name: "Supabase",
    icon: SiSupabase,
    color: "text-emerald-300",
    accent: "stack-supabase",
  },
  {
    name: "PostgreSQL",
    icon: SiPostgresql,
    color: "text-blue-300",
    accent: "stack-postgresql",
  },
  {
    name: "FastAPI",
    icon: SiFastapi,
    color: "text-teal-300",
    accent: "stack-fastapi",
  },
];

const services = [
  {
    icon: MonitorSmartphone,
    title: "Frontend Engineering",
    copy: "Responsive interfaces shaped around clarity, speed, and effortless user flows.",
    accent: "capability-cyan",
  },
  {
    icon: Layers3,
    title: "Full-Stack Systems",
    copy: "Connected products with dependable APIs, databases, authentication, and deployment.",
    accent: "capability-blue",
  },
  {
    icon: HeartHandshake,
    title: "People First",
    copy: "I think about the person using each screen and make decisions that respect their time.",
    accent: "capability-violet",
  },
];

export function TerminalCodeLanding() {
  const mainRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const glowPositionRef = useRef({ x: 0, y: 0 });

  const updateGlowPosition = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }

    glowPositionRef.current = { x: event.clientX, y: event.clientY };

    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      const { x, y } = glowPositionRef.current;

      mainRef.current?.style.setProperty("--mouse-x", `${x}px`);
      mainRef.current?.style.setProperty("--mouse-y", `${y}px`);
      frameRef.current = null;
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

      <div
        className="code-rain pointer-events-none fixed inset-0"
        aria-hidden="true"
      >
        {floatingCode.map(({ row, index, layer }) => (
          <span
            key={`${row}-${index}-${layer}`}
            className="absolute whitespace-nowrap font-mono text-[9px] text-blue-100/70"
            style={{
              left: `${(index * 29 + layer * 17) % 96}%`,
              top: `${(index * 13 + layer * 23) % 94}%`,
              animationDelay: `${index * 0.28 + layer * 0.7}s`,
              animationDuration: `${8 + ((index + layer) % 5) * 1.4}s`,
            }}
          >
            {row}
          </span>
        ))}
      </div>

      <PortfolioHeader />

      <section
        id="top"
        className="relative z-10 mx-auto grid min-h-[calc(100svh-68px)] w-full max-w-[1400px] items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:px-12 lg:py-16"
      >
        <SciFiBackground variant="orbital" priority fullBleed />

        <div className="relative z-10 min-w-0 animate-fade-up">
          <p className="identity-path inline-flex max-w-full items-center gap-3 overflow-hidden border border-blue-300/25 bg-blue-500/10 px-4 py-2 font-mono text-[11px] font-semibold uppercase text-blue-100">
            <span className="text-cyan-300">&gt;_</span>
            <span className="truncate">John Amoako Appiah</span>
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_14px_#22d3ee]" />
          </p>

          <div className="terminal-heading-wrap group relative mt-5 min-w-0 max-w-[640px] overflow-hidden">
            <div
              className="terminal-code-layer absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
              aria-hidden="true"
            >
              {backgroundCode.slice(0, 6).map((row, index) => (
                <span
                  key={row}
                  className="absolute whitespace-nowrap font-mono text-[9px] text-blue-100/35"
                  style={{
                    left: `${index % 2 === 0 ? 2 : 40}%`,
                    top: `${6 + index * 15}%`,
                    animationDelay: `${index * 0.3}s`,
                  }}
                >
                  {row}
                </span>
              ))}
            </div>
            <TypewriterHeading />
          </div>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
            Frontend, full-stack, and software development brought together in
            focused products with clear user flows and dependable code.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="primary-action inline-flex h-12 items-center gap-3 bg-blue-600 px-5 font-mono text-xs font-semibold uppercase text-white shadow-[0_0_28px_rgba(37,99,235,0.32)] transition hover:bg-blue-500"
            >
              View Projects
              <ArrowRight size={16} />
            </Link>
            <a
              href="mailto:jaappiah30@gmail.com"
              className="secondary-action inline-flex h-12 items-center gap-3 border border-white/20 bg-black/20 px-5 font-mono text-xs font-semibold uppercase text-white/80 transition hover:border-cyan-300/60 hover:text-white"
            >
              Email Me
              <Mail size={15} />
            </a>
          </div>

          <div className="mt-8">
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase text-white/45">
              Tech Stack
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </p>
            <div className="flex max-w-2xl flex-wrap gap-2">
              {tools.map(({ name, icon: Icon, color }) => (
                <span
                  key={name}
                  title={name}
                  className="tool-chip group inline-flex h-9 items-center gap-2 border border-blue-300/20 bg-[#07101f]/80 px-3 font-mono text-[10px] text-white/70 transition hover:-translate-y-0.5 hover:border-cyan-300/55 hover:bg-blue-500/10 hover:text-white"
                >
                  <Icon className={`text-base ${color}`} />
                  <span className="hidden sm:inline">{name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <CodeEditor />

        <a
          href="#about"
          className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[9px] uppercase text-white/35 transition hover:text-cyan-300 lg:flex"
        >
          Scroll to explore
          <span className="flex h-7 w-4 justify-center rounded-full border border-cyan-300/60 pt-1">
            <span className="h-1.5 w-1 rounded-full bg-cyan-300" />
          </span>
        </a>
      </section>

      <section
        id="about"
        className="section-band relative z-10 border-y border-white/10 bg-[#050914]/80"
      >
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-12 lg:py-24">
          <div>
            <p className="section-label">01 / About</p>
            <h2 className="section-title mt-4">
              Built with intent.
              <span className="block text-blue-300">Made to work.</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <p className="text-base leading-8 text-white/65 sm:text-lg">
              I&apos;m John, a developer focused on turning ideas into polished,
              practical digital products. I care about the details users notice
              and the engineering decisions they never have to.
            </p>
            <div className="space-y-3 font-mono text-xs text-white/55">
              {[
                "Clear product thinking",
                "Responsive, accessible interfaces",
                "Maintainable application structure",
                "Purposeful motion and interaction",
              ].map((item) => (
                <p
                  key={item}
                  className="flex items-center gap-3 border-b border-white/10 pb-3"
                >
                  <Check size={14} className="text-cyan-300" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="capabilities-section relative z-10 overflow-hidden border-y border-white/10"
      >
        <SciFiBackground variant="network" intensity="soft" />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mb-10 max-w-3xl">
            <p className="section-label">02 / Capabilities</p>
            <h2 className="section-title mt-4">
              From interface to infrastructure.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map(({ icon: Icon, title, copy, accent }, index) => (
              <Link
                key={title}
                href="#contact"
                className={`service-item ${accent} group flex min-h-64 flex-col overflow-hidden border border-white/10 bg-black/15 p-5 transition sm:p-6`}
              >
                <div className="flex items-start justify-between">
                  <span className="service-icon grid h-11 w-11 place-items-center border border-cyan-300/20 bg-cyan-400/[0.06] text-cyan-300">
                    <Icon size={21} />
                  </span>
                  <span className="font-mono text-[9px] text-white/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-8 text-base font-semibold sm:text-lg">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{copy}</p>
                <div className="mt-auto flex items-end justify-between pt-8">
                  <span className="service-accent h-px w-8 bg-cyan-300 transition-all group-hover:w-16" />
                  <ArrowUpRight
                    size={15}
                    className="service-arrow text-white/55 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="tech-stack"
        className="section-band relative z-10 scroll-mt-20 overflow-hidden border-y border-white/10 bg-[#050914]/80"
      >
        <SciFiBackground variant="network" intensity="soft" />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="section-label">03 / Tech Stack</p>
              <h2 className="section-title mt-4">
                The tools behind
                <span className="block text-blue-300">the build.</span>
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/60 lg:justify-self-end">
              A practical toolkit for building responsive interfaces, connected
              systems, Python services, and production-ready applications.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map(({ name, icon: Icon, color, accent }, index) => (
              <article
                key={name}
                className={`tech-card ${accent} group flex min-h-40 flex-col justify-between overflow-hidden border border-white/10 bg-[#030711] p-5 transition sm:p-6`}
              >
                <div className="flex items-start justify-between">
                  <Icon
                    className={`text-3xl transition group-hover:scale-110 ${color}`}
                  />
                  <span className="font-mono text-[9px] text-white/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="font-mono text-sm font-semibold">{name}</h3>
                  <div className="tech-accent mt-3 h-px w-8 bg-blue-400 transition-all group-hover:w-16" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="section-band relative z-10 overflow-hidden border-y border-white/10 bg-[#050914]/80"
      >
        <SciFiBackground variant="horizon" intensity="soft" />
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="section-label">04 / Selected Projects</p>
              <h2 className="section-title mt-4">
                Work in progress. Ideas in motion.
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase text-cyan-300 transition hover:text-white"
            >
              View all projects
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-3">
            {projects.slice(0, 3).map((project, index) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="project-card group relative min-h-80 overflow-hidden bg-[#030711] p-6 transition hover:bg-[#071125] sm:p-8"
              >
                <div className="project-code absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  {backgroundCode
                    .slice(index * 2, index * 2 + 4)
                    .map((code) => (
                      <span
                        key={code}
                        className="block py-3 font-mono text-[9px] text-blue-200/20"
                      >
                        {code}
                      </span>
                    ))}
                </div>
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-cyan-300">0{index + 1}</span>
                    <span className="border border-white/10 px-2 py-1 text-white/45">
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-auto pt-20">
                    <h3 className="max-w-xs text-2xl font-semibold">
                      {project.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">
                      {project.summary}
                    </p>
                    <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase text-blue-300">
                      View case study
                      <ArrowRight
                        size={13}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="contact-section relative z-10 overflow-hidden border-t border-white/10"
      >
        <SciFiBackground variant="horizon" />
        <div className="relative z-10 mx-auto grid w-full max-w-[1400px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12 lg:py-28">
          <div>
            <p className="section-label">05 / Contact</p>
            <h2 className="section-title mt-4 max-w-4xl">
              Have an idea worth building?
              <span className="block text-blue-300">
                Let&apos;s make it real.
              </span>
            </h2>
            <a
              href="mailto:jaappiah30@gmail.com"
              className="contact-email mt-7 inline-flex items-center gap-2 text-lg font-medium text-white/75 underline decoration-blue-400 underline-offset-8 transition sm:text-xl"
            >
              jaappiah30@gmail.com
              <ArrowUpRight className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </a>
          </div>

          <div className="flex gap-6 sm:gap-8">
            <a
              href="mailto:jaappiah30@gmail.com"
              aria-label="Send John an email"
              className="contact-method contact-method-email group flex flex-col items-center gap-4 text-sm text-white/65"
            >
              <span className="icon-button contact-method-icon grid h-20 w-20 place-items-center border border-white/15 text-blue-300 transition sm:h-24 sm:w-24">
                <Mail className="h-8 w-8 sm:h-9 sm:w-9" />
              </span>
              Email
            </a>
            <a
              href="https://github.com/jaashev"
              target="_blank"
              rel="noreferrer"
              aria-label="John's GitHub profile"
              className="contact-method contact-method-github group flex flex-col items-center gap-4 text-sm text-white/65"
            >
              <span className="icon-button contact-method-icon grid h-20 w-20 place-items-center border border-white/15 text-white/80 transition sm:h-24 sm:w-24">
                <SiGithub className="text-[2rem] sm:text-4xl" />
              </span>
              GitHub
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer relative z-10 border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-5 py-6 text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="footer-mark grid h-9 w-9 place-items-center rounded-full border border-blue-300/20">
              <Image
                src="/ps-logo.png"
                alt=""
                width={26}
                height={22}
                className="h-5 w-6 object-contain"
              />
            </span>
            <strong className="text-xs font-semibold text-white/70">
              Proximus Shev
            </strong>
            <span className="hidden text-xs sm:inline">
              Building thoughtful products that solve real problems.
            </span>
          </div>
          <p className="font-mono text-[9px] uppercase">
            &copy; 2026 Proximus Shev
          </p>
        </div>
      </footer>
    </main>
  );
}

function CodeEditor() {
  return (
    <aside className="editor-shell animate-fade-up-delay-2 relative z-10 min-w-0 overflow-hidden border border-blue-400/50 bg-[#030611]/92 font-mono shadow-[0_0_70px_rgba(37,99,235,0.2)]">
      <div className="editor-glow pointer-events-none absolute inset-0" />
      <div className="relative z-10 flex h-12 items-center border-b border-white/10 px-4">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <span className="mx-auto pr-12 text-[11px] text-white/40">
          portfolio.tsx
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-[42px_1fr] text-[11px] leading-7 sm:grid-cols-[54px_1fr] sm:text-[13px] sm:leading-8">
        <div className="border-r border-white/10 py-5 text-right text-white/25">
          {Array.from({ length: 13 }, (_, index) => (
            <span key={index} className="block pr-3">
              {String(index + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
        <pre className="overflow-hidden px-4 py-5 text-white/78 sm:px-5">
          <code>
            <span className="text-emerald-300">$</span> booting portfolio.shell
            {"\n"}
            <span className="text-emerald-300">$</span> loading
            react.next.typescript
            {"\n"}
            <span className="text-emerald-300">$</span> compiling clean
            interfaces
            {"\n"}
            <span className="text-emerald-300">$</span> deploying real-world
            projects
            {"\n\n"}
            <span className="text-fuchsia-300">const</span>{" "}
            <span className="text-sky-300">developer</span> = {"{"}
            {"\n  "}
            <span className="text-violet-300">name</span>:{" "}
            <span className="text-amber-100">
              &apos;John Amoako Appiah&apos;
            </span>
            ,{"\n  "}
            <span className="text-violet-300">focus</span>: [
            <span className="text-amber-100">&apos;frontend&apos;</span>,{" "}
            <span className="text-amber-100">&apos;full-stack&apos;</span>],
            {"\n  "}
            <span className="text-violet-300">mission</span>:{" "}
            <span className="text-amber-100">
              &apos;Build useful solutions&apos;
            </span>
            ,{"\n  "}
            <span className="text-violet-300">nextProject</span>:{" "}
            <span className="text-amber-100">&apos;Portfolio v2.0&apos;</span>
            {"\n"}
            {"};"}
          </code>
        </pre>
      </div>

      <div className="relative z-10 flex items-center gap-3 border-t border-white/10 px-4 py-3 text-[10px] text-white/40 sm:text-xs">
        <Check size={14} className="text-emerald-400" />
        Ready. Let&apos;s build something meaningful.
      </div>
    </aside>
  );
}
