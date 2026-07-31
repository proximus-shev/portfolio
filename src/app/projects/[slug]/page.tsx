import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { SciFiPageShell } from "@/components/SciFiPageShell";
import { getProject, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: "Project Not Found | John Amoako Appiah" };
  }

  return {
    title: `${project.title} | John Amoako Appiah`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <SciFiPageShell>
      <section className="py-12 sm:py-16 lg:py-20">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase text-white/45 transition hover:text-cyan-300"
        >
          <ArrowLeft size={14} />
          All projects
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.48fr] lg:items-end">
          <div>
            <p className="section-label">./{project.slug}</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.94] sm:text-6xl lg:text-7xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">
              {project.summary}
            </p>
          </div>

          <aside className="border border-white/10 bg-black/25 p-5 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[10px] uppercase">
              <span className="text-white/35">Status</span>
              <span className="text-cyan-300">{project.status}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="border border-blue-300/15 bg-blue-500/[0.07] px-3 py-2 text-[9px] text-blue-100/75"
                >
                  {item}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-px border border-white/10 bg-white/10 lg:grid-cols-2">
        <article className="surface-card bg-[#030711] p-6 sm:p-8">
          <p className="section-label">The problem</p>
          <p className="mt-5 leading-8 text-white/65">{project.problem}</p>
        </article>
        <article className="surface-card bg-[#030711] p-6 sm:p-8">
          <p className="section-label">The solution</p>
          <p className="mt-5 leading-8 text-white/65">{project.solution}</p>
        </article>
      </section>

      <section className="py-16 sm:py-20">
        <p className="section-label">Core features</p>
        <div className="mt-7 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
          {project.features.map((feature) => (
            <div
              key={feature}
              className="surface-card flex items-center gap-3 bg-[#030711] px-5 py-5 text-sm text-white/70"
            >
              <Check size={15} className="shrink-0 text-cyan-300" />
              {feature}
            </div>
          ))}
        </div>

        {(project.liveUrl || project.githubUrl) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="primary-action inline-flex h-11 items-center gap-2 bg-blue-600 px-4 font-mono text-xs uppercase"
              >
                Live project
                <ArrowUpRight size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="secondary-action inline-flex h-11 items-center gap-2 border border-white/20 px-4 font-mono text-xs uppercase"
              >
                Source code
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        )}
      </section>
    </SciFiPageShell>
  );
}
