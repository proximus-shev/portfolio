import { ProximusOS } from "@/components/os/ProximusOS";
import Link from "next/link";
import { projects } from "@/data/projects";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <ProximusOS />
      <noscript>
        <section className="os-no-script">
          <h2>John Amoako Appiah. Proximus Shev.</h2>
          <p>
            Frontend, full-stack, and software developer. Explore the project
            directory below or email jaappiah30@gmail.com.
          </p>
          <ul>
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`}>{project.title}</Link>{" "}
                . {project.status}
              </li>
            ))}
          </ul>
          <a href="mailto:jaappiah30@gmail.com">Get in touch</a>
        </section>
      </noscript>
    </>
  );
}
