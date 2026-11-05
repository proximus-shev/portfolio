"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  FileText,
  FolderOpen,
  HeartHandshake,
  Mail,
  MonitorSmartphone,
  Layers3,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { projects, type Project } from "@/data/projects";
import { mobileApps, profile, technologies, type AppId } from "./registry";

export type OpenApp = (id: AppId, slug?: string) => void;

export function BrandMark({ large = false }: { large?: boolean }) {
  return (
    <div className={`os-brand-mark ${large ? "os-brand-mark--large" : ""}`}>
      <Image
        src="/ps-logo.png"
        alt="Proximus Shev PS monogram"
        width={1024}
        height={1024}
        loading="eager"
        sizes={large ? "(max-width: 767px) 280px, 440px" : "160px"}
        className="os-logo"
      />
      <p>PROXIMUS SHEV</p>
      <span>DEVELOPER × CREATIVE × PROBLEM SOLVER</span>
    </div>
  );
}

export function WelcomeApp({ open }: { open: OpenApp }) {
  return (
    <div className="os-welcome">
      <span className="os-version">
        <span className="os-dot" /> PORTFOLIO OS v2.0
      </span>
      <div className="os-welcome__main">
        <BrandMark large />
        <div className="os-welcome__copy">
          <p className="os-eyebrow">FROM IDEA TO IMPACT</p>
          <h1>
            BUILD WHAT
            <br />
            <span>PEOPLE REMEMBER.</span>
          </h1>
          <p className="os-description">
            I turn ambitious ideas into polished digital products. They are
            clear in purpose, strong in execution, and built for real people.
          </p>
          <div className="os-actions">
            <button
              className="os-button os-button--primary"
              onClick={() => open("projects")}
            >
              <span className="os-play">▶</span> Explore the Work{" "}
              <ArrowRight size={16} />
            </button>
            <button className="os-button" onClick={() => open("resume")}>
              <FileText size={16} /> View Resume
            </button>
          </div>
        </div>
      </div>
      <div className="os-welcome__footer">
        <span>
          IDEAS <ArrowRight /> CLARITY <ArrowRight /> PRODUCTS <ArrowRight />{" "}
          IMPACT
        </span>
        <span>BUILT BY PROXIMUS SHEV</span>
      </div>
    </div>
  );
}

const portfolioProject = projects.find(
  (project) => project.slug === "proximus-shev-portfolio",
)!;
const showcase = [
  portfolioProject,
  ...projects.filter((project) => project !== portfolioProject),
];

function ProjectArtwork({ project }: { project: Project }) {
  return (
    <div
      className={`os-project-art ${project === portfolioProject ? "os-project-art--portfolio" : ""}`}
      aria-label={`${project.title}: ${project.status}`}
    >
      {project === portfolioProject ? (
        <>
          <Image
            src="/ps-logo.png"
            alt=""
            width={256}
            height={256}
            sizes="240px"
          />
          <span>JOHN AMOAKO APPIAH</span>
          <small>PORTFOLIO IDENTITY</small>
        </>
      ) : (
        <>
          <FolderOpen size={48} strokeWidth={1} />
          <span>{project.title}</span>
          <small>{project.status.toUpperCase()} · PROJECT OUTLINE</small>
        </>
      )}
      <i aria-hidden="true" />
    </div>
  );
}

export function FeaturedProject({ open }: { open: OpenApp }) {
  const [index, setIndex] = useState(0);
  const project = showcase[index];
  return (
    <div className="os-featured">
      <div className="os-featured__counter">
        <span className="os-eyebrow">SELECTED WORK</span>
        <div>
          <button
            aria-label="Previous featured project"
            onClick={() =>
              setIndex((index + showcase.length - 1) % showcase.length)
            }
          >
            <ChevronLeft size={15} />
          </button>
          <button
            aria-label="Next featured project"
            onClick={() => setIndex((index + 1) % showcase.length)}
          >
            <ChevronRight size={15} />
          </button>
          <span>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(showcase.length).padStart(2, "0")}
          </span>
        </div>
      </div>
      <ProjectArtwork project={project} />
      <div className="os-featured__copy" key={project.slug}>
        <p className="os-project-status">
          <span className="os-dot" />
          {project.status}
        </p>
        <h2>{project.title}</h2>
        <p>{project.summary}</p>
        <button
          className="os-button"
          onClick={() => open("projects", project.slug)}
        >
          Explore project <ArrowRight size={15} />
        </button>
      </div>
      <div className="os-featured__dots" aria-label="Choose featured project">
        {showcase.map((item, i) => (
          <button
            key={item.slug}
            aria-label={`Feature ${item.title}`}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export function ProjectsApp({
  selected,
  select,
}: {
  selected: string | null;
  select: (slug: string | null) => void;
}) {
  const [filter, setFilter] = useState("All");
  const project = projects.find((item) => item.slug === selected);
  if (project)
    return (
      <div className="os-app-padding os-project-detail">
        <button className="os-text-button" onClick={() => select(null)}>
          <ArrowLeft size={15} /> All projects
        </button>
        <div className="os-project-detail__heading">
          <div>
            <p className="os-project-status">{project.status}</p>
            <h2>{project.title}</h2>
            <p className="os-description">{project.summary}</p>
          </div>
          <ProjectArtwork project={project} />
        </div>
        <div className="os-tags">
          {project.stack.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="os-detail-columns">
          <section>
            <p className="os-eyebrow">THE PROBLEM</p>
            <p>{project.problem}</p>
          </section>
          <section>
            <p className="os-eyebrow">
              {project.status === "Planned"
                ? "PROPOSED SOLUTION"
                : "THE APPROACH"}
            </p>
            <p>{project.solution}</p>
          </section>
        </div>
        <h3>
          {project.status === "Planned"
            ? "Planned features"
            : "Project features"}
        </h3>
        <ul className="os-checklist">
          {project.features.map((feature) => (
            <li key={feature}>
              <Check size={14} />
              {feature}
            </li>
          ))}
        </ul>
        <div className="os-actions">
          <Link
            className="os-button os-button--primary"
            href={`/projects/${project.slug}`}
          >
            Full case study <ArrowUpRight size={15} />
          </Link>
          {project.githubUrl && (
            <a
              className="os-button"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              Source code <SiGithub />
            </a>
          )}
          {project.liveUrl && (
            <a
              className="os-button"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              Live project <ArrowUpRight size={15} />
            </a>
          )}
        </div>
        <div className="os-project-pagination">
          <button
            onClick={() =>
              select(
                projects[
                  (projects.indexOf(project) + projects.length - 1) %
                    projects.length
                ].slug,
              )
            }
          >
            <ChevronLeft size={15} /> Previous project
          </button>
          <button
            onClick={() =>
              select(
                projects[(projects.indexOf(project) + 1) % projects.length]
                  .slug,
              )
            }
          >
            Next project <ChevronRight size={15} />
          </button>
        </div>
      </div>
    );
  const filtered = projects.filter(
    (item) => filter === "All" || item.status === filter,
  );
  return (
    <div className="os-app-padding os-project-directory">
      <header className="os-project-directory__hero">
        <p className="os-eyebrow">PROJECTS I CARE ABOUT</p>
        <h2>Ideas I&apos;m <span>bringing to life.</span></h2>
        <p className="os-description">
          Here are the products I&apos;m building, the problems behind them, and
          the progress I&apos;ve made so far.
        </p>
      </header>
      <div className="os-project-directory__content">
        <div className="os-filter-row" aria-label="Filter projects">
          {["All", "In progress", "Planned"].map((item) => (
            <button
              key={item}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
          <Link href="/projects" className="os-text-button">
            Project index <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="os-project-grid">
          {filtered.map((item) => (
            <button
              className="os-project-tile"
              key={item.slug}
              onClick={() => select(item.slug)}
            >
              <ProjectArtwork project={item} />
              <div className="os-project-tile__copy">
                <span className="os-project-tile__identity">
                  <FolderOpen size={22} strokeWidth={1.6} />
                  <span>{item === portfolioProject ? "Portfolio identity" : "Project outline"}</span>
                </span>
                <h3>{item.title}</h3>
                <span className="os-project-status"><span className="os-dot" />{item.status}</span>
                <p>{item.summary}</p>
                <span className="os-project-tile__link">
                  Explore project <ArrowRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AboutApp({ open }: { open: OpenApp }) {
  return (
    <div className="os-app-padding os-about">
      <p className="os-eyebrow">A LITTLE ABOUT ME</p>
      <h2>
        I care about the people who use what I build.
        <br />
        <span className="os-accent">That shapes every decision.</span>
      </h2>
      <div className="os-about__identity">
        <div className="os-about__portrait">
          <Image
            src={profile.portrait}
            alt="Portrait illustration of John Amoako Appiah"
            width={1024}
            height={1536}
            sizes="(max-width: 767px) 92px, 112px"
          />
        </div>
        <div>
          <strong>{profile.name}</strong>
          <p>Developer, problem solver, and thoughtful builder</p>
        </div>
      </div>
      <p className="os-description">{profile.intro}</p>
      <ul className="os-checklist">
        {[
          "I listen before I start building",
          "I keep complex ideas clear and approachable",
          "I care about speed, accessibility, and detail",
          "I build with the long term in mind",
        ].map((item) => (
          <li key={item}>
            <Check size={15} />
            {item}
          </li>
        ))}
      </ul>
      <div className="os-capabilities">
        {[
          {
            icon: MonitorSmartphone,
            title: "Frontend Experiences",
            copy: "I create interfaces that feel clear, welcoming, and easy to use on every screen.",
          },
          {
            icon: Layers3,
            title: "Full-Stack Products",
            copy: "I connect the interface, data, and logic so the whole product works reliably together.",
          },
          {
            icon: HeartHandshake,
            title: "People First",
            copy: "I think about the person using each screen and make decisions that respect their time.",
          },
        ].map(({ icon: Icon, title, copy }) => (
          <section key={title}>
            <Icon size={22} />
            <h3>{title}</h3>
            <p>{copy}</p>
          </section>
        ))}
      </div>
      <button
        className="os-button os-button--primary"
        onClick={() => open("projects")}
      >
        See what I&apos;ve been building <ArrowRight size={15} />
      </button>
    </div>
  );
}

export function TechStackApp({
  compact = false,
  open,
}: {
  compact?: boolean;
  open: OpenApp;
}) {
  const [group, setGroup] = useState("All");
  return (
    <div className={compact ? "os-stack-compact" : "os-app-padding"}>
      {!compact && (
        <>
          <p className="os-eyebrow">THE TOOLS BEHIND THE BUILD</p>
          <h2>A practical toolkit.</h2>
          <p className="os-description">
            Tools for responsive interfaces, connected systems, Python services,
            and production-ready applications.
          </p>
          <div className="os-filter-row" aria-label="Filter technologies">
            {["All", "Frontend", "Backend", "Databases", "Developer Tools"].map(
              (item) => (
                <button
                  key={item}
                  aria-pressed={group === item}
                  onClick={() => setGroup(item)}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </>
      )}
      <div className={`os-tech-grid ${compact ? "os-tech-grid--compact" : ""}`}>
        {technologies
          .filter((item) => compact || group === "All" || item.group === group)
          .map(({ name, icon: Icon, color, description }) => (
            <div className="os-tech-tile" key={name} title={description}>
              <Icon style={{ color }} />
              <span>{name}</span>
              {!compact && <small>{description}</small>}
            </div>
          ))}
      </div>
      {compact && (
        <button
          className="os-text-button os-stack-all"
          onClick={() => open("stack")}
        >
          Explore the toolkit <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}

export function ResumeApp() {
  return (
    <div className="os-app-padding os-resume">
      <div className="os-document-icon">
        <FileText size={40} strokeWidth={1.2} />
      </div>
      <p className="os-eyebrow">PROFESSIONAL PROFILE</p>
      <h2>{profile.name}</h2>
      <p className="os-description">
        Frontend, full-stack, and software developer.
      </p>
      <div className="os-resume__notice">
        <FileText size={19} />
        <div>
          <strong>Resume available on request</strong>
          <p>
            Email me for my current resume and details about my work.
          </p>
        </div>
      </div>
      <a
        className="os-button os-button--primary"
        href={`mailto:${profile.email}?subject=Resume%20request`}
      >
        Request my resume <ArrowUpRight size={15} />
      </a>
      <h3>Development focus</h3>
      <ul className="os-checklist">
        <li>
          <Check size={14} />
          Responsive and accessible frontend interfaces
        </li>
        <li>
          <Check size={14} />
          Connected APIs, databases, and authentication
        </li>
        <li>
          <Check size={14} />
          Python services and practical automation
        </li>
      </ul>
    </div>
  );
}

export function ContactApp() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };
  return (
    <div className="os-app-padding os-contact">
      <span className="os-eyebrow">LET&apos;S BUILD SOMETHING</span>
      <h2>
        Have an idea
        <br />
        worth building?
      </h2>
      <p className="os-description">
        Let&apos;s make it real. Tell me about your project, the problem
        you&apos;re solving, and where you want to take it.
      </p>
      <a className="os-contact__email" href={`mailto:${profile.email}`}>
        {profile.email}
        <ArrowUpRight size={20} />
      </a>
      <div className="os-actions">
        <a
          className="os-button os-button--primary"
          href={`mailto:${profile.email}`}
        >
          <Mail size={16} /> Get in touch
        </a>
        <button className="os-button" onClick={copy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Email copied" : "Copy email"}
        </button>
      </div>
      <p className="os-small" role="status">
        {copyError
          ? `Copy unavailable. Select the email address above: ${profile.email}`
          : copied
            ? "Email address copied to your clipboard."
            : ""}
      </p>
      <a
        className="os-contact__social"
        href={profile.github}
        target="_blank"
        rel="noreferrer"
      >
        <SiGithub size={22} />
        <div>
          <strong>GitHub</strong>
          <span>Explore my code and repositories</span>
        </div>
        <ArrowUpRight size={17} />
      </a>
    </div>
  );
}

export function CodeApp() {
  const [tab, setTab] = useState("portfolio.tsx");
  const snippets: Record<string, string> = {
    "portfolio.tsx": `import { ProximusOS } from '@/components/os/ProximusOS';\n\nexport default function Home() {\n  return <ProximusOS />;\n}\n\n// Clear in purpose. Sharp in execution.`,
    "profile.ts": `export const developer = {\n  name: '${profile.name}',\n  alias: '${profile.brand}',\n  focus: ['frontend', 'full-stack', 'software'],\n  email: '${profile.email}',\n  philosophy: 'Build with intent. Make it work.',\n};`,
    "projects.ts": `// Current portfolio directory\n${projects.map((project) => `// ${project.title}\n// Status: ${project.status}\n// Stack: ${project.stack.join(", ")}`).join("\n\n")}`,
  };
  return (
    <div className="os-editor">
      <div className="os-editor__tabs" aria-label="Read source previews">
        {Object.keys(snippets).map((name) => (
          <button
            key={name}
            aria-pressed={tab === name}
            onClick={() => setTab(name)}
          >
            <Code2 size={12} />
            {name}
          </button>
        ))}
      </div>
      <div className="os-editor__content">
        <pre aria-label={`${tab} read-only source preview`}>
          {snippets[tab].split("\n").map((line, index) => (
            <span key={index}>
              <i aria-hidden="true">{index + 1}</i>
              <code>{line || " "}</code>
            </span>
          ))}
        </pre>
      </div>
      <footer>
        <span>
          <span className="os-dot" /> Read-only source preview
        </span>
        <span>TypeScript</span>
      </footer>
    </div>
  );
}

export function MobileHome({ open }: { open: OpenApp }) {
  return (
    <div className="os-mobile-home">
      <div className="os-mobile-home__intro">
        <p className="os-eyebrow">FROM IDEA TO IMPACT</p>
        <BrandMark large />
        <h1>
          BUILD WHAT
          <br />
          <span>PEOPLE REMEMBER.</span>
        </h1>
        <p>
          I turn ambitious ideas into polished products built for real people.
        </p>
        <button
          className="os-button os-button--primary"
          onClick={() => open("projects")}
        >
          <span className="os-play">▶</span> Explore the Work{" "}
          <ArrowRight size={17} />
        </button>
      </div>
      <div className="os-mobile-grid">
        {mobileApps.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => open(id)}>
            <span className={`os-app-icon os-app-icon--${id}`}>
              <Icon size={28} strokeWidth={1.5} />
            </span>
            <span>{id === "stack" ? "Stack" : label}</span>
          </button>
        ))}
      </div>
      <section className="os-mobile-featured">
        <header>
          <FolderOpen size={15} />
          Featured Project
        </header>
        <FeaturedProject open={open} />
      </section>
      <footer className="os-mobile-footer">
        <p>CLEAR IN PURPOSE. SHARP IN EXECUTION.</p>
        <span>© 2026 Proximus Shev</span>
        <Link href="/projects">
          Browse all case studies <ArrowUpRight size={12} />
        </Link>
      </footer>
    </div>
  );
}
