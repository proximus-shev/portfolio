import Link from "next/link";
import { projects } from "@/data/projects";
import { SciFiPageShell } from "@/components/SciFiPageShell";

export const metadata = {
  title: "Projects | John Amoako Appiah",
  description: "Portfolio projects by John Amoako Appiah.",
};

export default function ProjectsPage() {
  return (
    <SciFiPageShell>
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-blue-100 transition hover:text-white sm:text-sm"
          >
            Proximus Shev
          </Link>
          <Link
            href="/"
            className="border border-blue-200/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-blue-100 transition hover:border-blue-200/60 hover:bg-blue-500/10"
          >
            Home
          </Link>
        </header>

        <section className="py-16 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-200">
            ./projects
          </p>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,8vw,6rem)] font-black uppercase leading-[0.9] tracking-tight">
            Things I am
            <span className="block text-blue-200">building.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/64">
            A growing collection of personal projects designed to show product
            thinking, interface craft, full-stack structure, and practical
            software development.
          </p>
        </section>

        <section className="grid gap-4 pb-16 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="code-chip group relative overflow-hidden border border-blue-200/14 bg-black/38 p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-blue-200/50 hover:bg-blue-500/10 hover:shadow-[0_0_70px_rgba(37,99,235,0.2)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(96,165,250,0.1),transparent_42%)] opacity-0 transition group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-blue-200">
                    0{index + 1}
                  </span>
                  <span className="border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/52">
                    {project.status}
                  </span>
                </div>
                <h2 className="mt-8 text-2xl font-black uppercase tracking-tight">
                  {project.title}
                </h2>
                <p className="mt-4 min-h-24 text-sm leading-7 text-white/62">
                  {project.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="bg-blue-500/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-blue-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </section>
    </SciFiPageShell>
  );
}
