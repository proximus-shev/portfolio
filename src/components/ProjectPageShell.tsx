import type { ReactNode } from "react";
import Link from "next/link";
import { ProjectHeader } from "./ProjectHeader";
import styles from "./project-pages.module.css";

export function ProjectPageShell({ children }: { children: ReactNode }) {
  return <div className={styles.page}>
    <ProjectHeader />
    <main id="project-content" className={styles.content}>{children}</main>
    <footer className={styles.footer}><span>John Amoako Appiah. Proximus Shev.</span><Link href="/?app=contact">Let&apos;s build something together.</Link></footer>
  </div>;
}
