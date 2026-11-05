import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { ProjectPageShell } from "@/components/ProjectPageShell";
import styles from "@/components/project-pages.module.css";
import { getProject, projects } from "@/data/projects";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project Not Found | John Amoako Appiah" };
  return {
    title: `${project.title} | John Amoako Appiah`,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: `${project.title} | John Amoako Appiah`, description: project.summary, url: `/projects/${project.slug}`, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Proximus Shev, the portfolio of John Amoako Appiah" }] },
    twitter: { card: "summary_large_image", title: `${project.title} | John Amoako Appiah`, description: project.summary, images: ["/opengraph-image"] },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const planned = project.status === "Planned";
  return <ProjectPageShell>
    <section className={styles.hero}>
      <Link className={styles.back} href="/projects"><ArrowLeft size={17} /> All projects</Link>
      <div className={styles.detailHeading}><div>
        <p className={styles.eyebrow}>{planned ? "Project plan" : "Inside the build"}</p>
        <h1>{project.title}</h1><p className={styles.intro}>{project.summary}</p>
      </div><aside className={styles.summary} aria-label="Project overview">
        <div className={styles.summaryStatus}><span>Current stage</span><strong>{project.status}</strong></div>
        <div className={styles.tags}>{project.stack.map((tool) => <span key={tool}>{tool}</span>)}</div>
      </aside></div>
    </section>
    <section className={styles.columns} aria-label="The thinking behind the project">
      <article className={styles.sectionCard}><h2>The problem</h2><p>{project.problem}</p></article>
      <article className={styles.sectionCard}><h2>{planned ? "The approach" : "What I'm building"}</h2><p>{project.solution}</p></article>
    </section>
    <section className={styles.features}><h2>{planned ? "Planned features" : "Core features"}</h2>
      <ul className={styles.featureGrid}>{project.features.map((feature) => <li key={feature}><Check size={18} aria-hidden="true" />{feature}</li>)}</ul>
      {(project.liveUrl || project.githubUrl) && <div className={styles.externalLinks}>
        {project.liveUrl && <a className={styles.primaryAction} href={project.liveUrl} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={16} /></a>}
        {project.githubUrl && <a className={styles.secondaryAction} href={project.githubUrl} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={16} /></a>}
      </div>}
    </section>
    <section className={styles.cta}><div><h2>Let&apos;s talk about your idea.</h2><p>Tell me what you want to build and who it&apos;s for.</p></div><Link className={styles.primaryAction} href="/?app=contact">Get in touch <ArrowUpRight size={17} /></Link></section>
  </ProjectPageShell>;
}
