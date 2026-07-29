"use client";

import { useState } from "react";

const navLinks = ["Projects", "Skills", "About", "Contact"];

const projects = [
  "AI Study Assistant",
  "Finance Dashboard",
  "Appointment Booking",
  "Mini E-Commerce",
  "Portfolio Website",
];

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_24%,rgba(59,130,246,0.28),transparent_28%),radial-gradient(circle_at_18%_74%,rgba(14,165,233,0.18),transparent_26%),linear-gradient(135deg,#020617_0%,#030712_42%,#000000_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
      <div className="absolute left-1/2 top-0 h-full w-px -rotate-12 bg-blue-300/20 shadow-[0_0_80px_20px_rgba(59,130,246,0.25)]" />
      <div className="absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.22),transparent_55%)] hero-glow" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16 lg:py-7">
        <a
          href="#top"
          className="text-xl font-black uppercase tracking-[0.28em] text-white sm:text-2xl"
        >
          Proximus Shev
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70 transition hover:text-white"
            >
              {link}
            </a>
          ))}
        </nav>

        <a
          href="mailto:jaappiah30@gmail.com"
          className="hidden border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:border-blue-300 hover:bg-white/10 md:inline-flex"
        >
          Get in touch
        </a>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="space-y-1.5 md:hidden"
        >
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-4 bg-white" />
        </button>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-black/95 px-6 py-5 backdrop-blur-md transition-all duration-500 md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xl font-black uppercase tracking-[0.28em]">
            Proximus Shev
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="grid h-10 w-10 place-items-center border border-white/20 text-2xl"
          >
            x
          </button>
        </div>

        <nav className="flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center">
          {navLinks.map((link, index) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: `${index * 80 + 100}ms` }}
              className={`text-4xl font-black uppercase tracking-[0.14em] transition-all duration-500 sm:text-5xl ${
                menuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }`}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>

      <section
        id="top"
        className="relative z-10 flex min-h-[calc(100vh-88px)] items-center px-6 pb-16 pt-8 sm:px-10 lg:px-16"
      >
        <div className="max-w-5xl lg:max-w-3xl xl:max-w-4xl">
          <div className="animate-fade-up mb-6 inline-flex items-center gap-3 border border-blue-300/30 bg-blue-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-blue-100">
            <span className="h-2 w-2 bg-blue-300" />
            Frontend / Full-stack / Software Developer
          </div>

          <h1 className="animate-fade-up-delay-1 max-w-4xl text-[clamp(3.2rem,10vw,8.6rem)] font-black uppercase leading-[0.86] tracking-tight">
            John
            <span className="block text-blue-200">Amoako</span>
            <span className="block text-white">Appiah.</span>
          </h1>

          <p className="animate-fade-up-delay-2 mt-7 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
            I build sharp, responsive web experiences with a product mind:
            clean interfaces, practical systems, and projects that feel ready
            for real users.
          </p>

          <div className="animate-fade-up-delay-3 mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="group bg-white px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-blue-100 sm:px-8"
            >
              See my work
              <span className="ml-2 inline-block transition group-hover:translate-x-1">
                /
              </span>
            </a>
            <a
              href="mailto:jaappiah30@gmail.com"
              className="border border-white/25 px-6 py-4 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:border-blue-300 hover:bg-blue-500/10 sm:px-8"
            >
              Contact me
            </a>
          </div>

          <div
            id="projects"
            className="animate-fade-up-delay-4 mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-5"
          >
            {projects.map((project, index) => (
              <div
                key={project}
                className="border border-white/12 bg-white/[0.04] p-4 backdrop-blur-sm"
              >
                <p className="text-2xl font-black text-blue-200">
                  0{index + 1}
                </p>
                <p className="mt-3 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/60">
                  {project}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
