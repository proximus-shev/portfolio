"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { setTheme } from "./os/registry";
import styles from "./project-pages.module.css";

export function ProjectHeader() {
  const pathname = usePathname();
  return <header className={styles.header}>
    <a className={styles.skip} href="#project-content">Skip to content</a>
    <Link className={styles.brand} href="/" aria-label="Portfolio home"><Image src="/ps-logo.png" alt="" width={42} height={42} /></Link>
    <nav className={styles.navigation} aria-label="Portfolio navigation">
      <Link href="/">Home</Link>
      <Link href="/projects" aria-current={pathname.startsWith("/projects") ? "page" : undefined}>Projects</Link>
      <Link href="/?app=about">About</Link>
      <Link href="/?app=resume">Resume</Link>
    </nav>
    <div className={styles.headerActions}>
      <button onClick={() => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light")} aria-label="Toggle light and dark mode"><Sun className={styles.sun} size={19} /><Moon className={styles.moon} size={19} /></button>
      <Link href="/?app=contact">Let&apos;s talk <ArrowUpRight size={16} /></Link>
    </div>
  </header>;
}
