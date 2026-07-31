import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SciFiPageShell } from "@/components/SciFiPageShell";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Projects | John Amoako Appiah",
  description:
    "Selected frontend, full-stack, software, and Python projects by John Amoako Appiah.",
};

export default function ProjectsPage() {
  return (
    <SciFiPageShell>
      <section className="py-16 sm:py-20 lg:py-24">
        <p className="section-label">Projects / 01-06</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.92] sm:text-6xl lg:text-7xl">
          Ideas designed
          <span className="block text-blue-300">to become useful.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">
          A growing collection of products exploring interface craft,
          full-stack architecture, Python, AI, and practical problem-solving.
        </p>
      </section>

      <section className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="project-card group relative min-h-[360px] overflow-hidden bg-[#030711] p-6 transition hover:bg-[#071125] sm:p-8"
          >
            <div className="project-code absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
              {[
                `const project = "${project.slug}";`,
                `status: "${project.status.toLowerCase()}";`,
                `stack: [${project.stack.slice(0, 3).join(", ")}];`,
                "return solve(realWorldProblem);",
              ].map((code) => (
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
                <span className="text-cyan-300">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="border border-white/10 px-2 py-1 text-white/45">
                  {project.status}
                </span>
              </div>

              <div className="mt-auto pt-20">
                <h2 className="max-w-xs text-2xl font-semibold">
                  {project.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">
                  {project.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="border border-blue-300/15 bg-blue-500/[0.06] px-2 py-1 font-mono text-[9px] text-blue-100/70"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase text-cyan-300">
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
      </section>

      <div className="flex justify-center py-14">
        <Link
          href="/#contact"
          className="primary-action inline-flex h-12 items-center gap-3 bg-blue-600 px-5 font-mono text-xs font-semibold uppercase text-white transition hover:bg-blue-500"
        >
          Start a conversation
          <ArrowRight size={15} />
        </Link>
      </div>
    </SciFiPageShell>
  );
}
