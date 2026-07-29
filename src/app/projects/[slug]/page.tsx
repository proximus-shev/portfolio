import Link from "next/link";
import { notFound } from "next/navigation";
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
    return {
      title: "Project Not Found | John Amoako Appiah",
    };
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
    <main className="min-h-screen bg-[#05070d] px-5 py-6 text-white sm:px-8 lg:px-14">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_74%_10%,rgba(59,130,246,0.2),transparent_28%),linear-gradient(180deg,#05070d_0%,#020617_62%,#000_100%)]" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <Link
            href="/projects"
            className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-blue-100 transition hover:text-white sm:text-sm"
          >
            ./projects
          </Link>
          <Link
            href="/"
            className="border border-blue-200/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-blue-100 transition hover:border-blue-200/60 hover:bg-blue-500/10"
          >
            Home
          </Link>
        </header>

        <section className="grid gap-10 py-16 lg:grid-cols-[1fr_0.72fr] lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-200">
              ./{project.slug}
            </p>
            <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-tight">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/64">
              {project.summary}
            </p>
          </div>

          <aside className="border border-blue-200/14 bg-black/38 p-5 font-mono backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs uppercase tracking-[0.2em] text-white/42">
                status
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-blue-100">
                {project.status}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="bg-blue-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-blue-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-4 pb-16 lg:grid-cols-2">
          <article className="border border-blue-200/14 bg-black/34 p-5 backdrop-blur-md">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-200">
              Problem
            </p>
            <p className="mt-4 leading-8 text-white/66">{project.problem}</p>
          </article>

          <article className="border border-blue-200/14 bg-black/34 p-5 backdrop-blur-md">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-200">
              Solution
            </p>
            <p className="mt-4 leading-8 text-white/66">{project.solution}</p>
          </article>

          <article className="border border-blue-200/14 bg-black/34 p-5 backdrop-blur-md lg:col-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-200">
              Features
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {project.features.map((feature) => (
                <div
                  key={feature}
                  className="border border-white/10 bg-white/[0.03] px-4 py-3 text-white/72"
                >
                  {feature}
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
