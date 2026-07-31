"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Home", href: "/#top" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/projects" },
  { label: "Tech Stack", href: "/#tech-stack" },
  { label: "Contact", href: "/#contact" },
];

export function PortfolioHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("ps-theme", nextTheme);
  };

  return (
    <header className="site-header sticky top-0 z-50 border-b border-white/10 bg-[#02040b]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/#top"
          aria-label="Proximus Shev home"
          className="brand-link flex items-center gap-3 text-white"
        >
          <Image
            src="/ps-logo.png"
            alt=""
            width={46}
            height={38}
            priority
            className="h-9 w-11 object-contain"
          />
          <span className="hidden font-mono text-xs font-semibold uppercase sm:block">
            Proximus Shev
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden h-full items-stretch lg:flex"
        >
          {navigation.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-link group relative flex min-w-20 items-center justify-center px-3 font-mono text-[11px] uppercase text-white/60 transition-colors hover:text-white"
            >
              {item.label}
              <span
                className={`absolute bottom-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] transition-all ${
                  index === 0
                    ? "w-5 opacity-100"
                    : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title="Toggle light and dark mode"
            className="icon-button grid h-10 w-10 place-items-center border border-white/15 bg-white/[0.03] text-white/75 transition hover:border-cyan-400/60 hover:text-cyan-300"
          >
            <Sun size={17} className="theme-icon theme-icon-sun" />
            <Moon size={17} className="theme-icon theme-icon-moon" />
          </button>

          <Link
            href="/#contact"
            className="primary-action hidden h-10 items-center gap-3 border border-blue-400/60 bg-blue-500/10 px-5 font-mono text-xs font-semibold uppercase text-white transition hover:border-cyan-300 hover:bg-blue-500/20 sm:inline-flex"
          >
            Let&apos;s Talk
            <ArrowUpRight size={14} />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            className="icon-button grid h-10 w-10 place-items-center border border-white/15 bg-white/[0.03] text-white lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-[#02040b]/96 lg:hidden"
        >
          <div className="mx-auto grid max-w-[1400px] px-5 py-3 sm:px-8">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/10 py-4 font-mono text-xs uppercase text-white/70 transition hover:text-cyan-300 last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="primary-action mt-3 inline-flex h-11 items-center justify-center gap-3 border border-blue-400/60 bg-blue-500/15 font-mono text-xs font-semibold uppercase text-white sm:hidden"
            >
              Let&apos;s Talk
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
