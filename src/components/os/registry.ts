import {
  Braces,
  FileText,
  FolderOpen,
  Home,
  Layers3,
  Send,
  TerminalSquare,
  UserRound,
  Settings,
} from "lucide-react";
import {
  SiFastapi,
  SiGithub,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

export const applications = [
  {
    id: "welcome",
    label: "Home",
    title: "Proximus Shev",
    icon: Home,
    color: "blue",
  },
  {
    id: "projects",
    label: "Projects",
    title: "Project Explorer",
    icon: FolderOpen,
    color: "cyan",
  },
  {
    id: "about",
    label: "About",
    title: "About John",
    icon: UserRound,
    color: "sky",
  },
  {
    id: "terminal",
    label: "Terminal",
    title: "Terminal, proximus@os",
    icon: TerminalSquare,
    color: "ink",
  },
  {
    id: "stack",
    label: "Tech Stack",
    title: "Tech Stack",
    icon: Layers3,
    color: "violet",
  },
  {
    id: "resume",
    label: "Resume",
    title: "Resume",
    icon: FileText,
    color: "blue",
  },
  {
    id: "contact",
    label: "Contact",
    title: "Contact",
    icon: Send,
    color: "cyan",
  },
  {
    id: "code",
    label: "Code",
    title: "Code, portfolio.tsx",
    icon: Braces,
    color: "ink",
  },
  {
    id: "settings",
    label: "Settings",
    title: "Workspace Settings",
    icon: Settings,
    color: "sky",
  },
] as const;
export type AppId = (typeof applications)[number]["id"];
export type Theme = "light" | "dark";
export const visibleApplications = applications.filter((app) => app.id !== "terminal");
export const launcherApps = visibleApplications.filter(
  (app) => ["welcome", "projects", "about", "contact", "settings"].includes(app.id),
);
export const mobileApps = visibleApplications.filter(
  (app) => !["welcome", "code", "settings"].includes(app.id),
);
export const dockApps = visibleApplications.filter((app) => ["welcome", "projects", "stack", "settings"].includes(app.id));
export const isAppId = (value: string | null): value is AppId =>
  value !== "terminal" && applications.some((app) => app.id === value);
export const profile = {
  name: "John Amoako Appiah",
  brand: "Proximus Shev",
  portrait: "/john-amoako-appiah-portrait.png",
  email: "jaappiah30@gmail.com",
  github: "https://github.com/jaashev",
  intro:
    "I'm John. I bring ideas to life with thoughtful design, strong engineering, and careful execution. From the first conversation to the final detail, I put care into building products that are clear, useful, and enjoyable to use. Have an idea? Let's build something you'll be proud of.",
};
export const technologies = [
  {
    name: "React",
    group: "Frontend",
    icon: SiReact,
    color: "#18bfee",
    description: "Component-driven interfaces",
  },
  {
    name: "Next.js",
    group: "Frontend",
    icon: SiNextdotjs,
    color: "currentColor",
    description: "Routing and full-stack React",
  },
  {
    name: "TypeScript",
    group: "Frontend",
    icon: SiTypescript,
    color: "#3188f6",
    description: "Typed application code",
  },
  {
    name: "Tailwind CSS",
    group: "Frontend",
    icon: SiTailwindcss,
    color: "#0cc9e7",
    description: "Responsive design systems",
  },
  {
    name: "Python",
    group: "Backend",
    icon: SiPython,
    color: "#e4b743",
    description: "Services and automation",
  },
  {
    name: "FastAPI",
    group: "Backend",
    icon: SiFastapi,
    color: "#06b9a1",
    description: "Python API services",
  },
  {
    name: "Supabase",
    group: "Databases",
    icon: SiSupabase,
    color: "#31c88a",
    description: "Data and authentication",
  },
  {
    name: "PostgreSQL",
    group: "Databases",
    icon: SiPostgresql,
    color: "#5c9ade",
    description: "Relational data",
  },
  {
    name: "Git & GitHub",
    group: "Developer Tools",
    icon: SiGithub,
    color: "currentColor",
    description: "Version control and collaboration",
  },
];
export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem("ps-theme", theme);
  } catch {
    /* Preference works without storage. */
  }
}
