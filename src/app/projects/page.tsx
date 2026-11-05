import Link from "next/link";
import { ArrowRight, FolderOpen } from "lucide-react";
import { ProjectPageShell } from "@/components/ProjectPageShell";
import styles from "@/components/project-pages.module.css";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Projects | John Amoako Appiah",
  description: "Explore what John Amoako Appiah is building, from product ideas to working interfaces.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | John Amoako Appiah",
    description: "Explore what I'm building and the thinking behind each project.",
    url: "/projects",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Proximus Shev, the portfolio of John Amoako Appiah" }],
  },
};

export default function ProjectsPage() {
  const ordered = [...projects].sort((a, b) =>
    Number(b.slug === "proximus-shev-portfolio") - Number(a.slug === "proximus-shev-portfolio"),
  );
  return <ProjectPageShell>
    <section className={styles.hero}>
      <p className={styles.eyebrow}>Projects and ideas</p>
      <h1>Ideas I&apos;m<span>bringing to life.</span></h1>
      <p className={styles.intro}>Here are the products I&apos;m building, why they matter to me, and the progress I&apos;ve made so far. Each project shows its current stage.</p>
    </section>
    <section className={styles.grid} aria-label="Project directory">
      {ordered.map((project) => <Link className={styles.card} key={project.slug} href={`/projects/${project.slug}`}>
        <div className={styles.cardTop}><FolderOpen size={26} /><span className={styles.badge}>{project.status}</span></div>
        <h2>{project.title}</h2><p>{project.summary}</p>
        <div className={styles.tags}>{project.stack.slice(0, 3).map((tool) => <span key={tool}>{tool}</span>)}</div>
        <span className={styles.cardLink}>{project.status === "Planned" ? "Read the project plan" : "Explore the project"}<ArrowRight size={17} /></span>
      </Link>)}
    </section>
    <section className={styles.cta}><div><h2>Have something in mind?</h2><p>I&apos;d love to hear about it.</p></div><Link className={styles.primaryAction} href="/?app=contact">Start a conversation <ArrowRight size={17} /></Link></section>
  </ProjectPageShell>;
}
