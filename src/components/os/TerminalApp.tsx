"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  applications,
  isAppId,
  profile,
  setTheme,
  technologies,
} from "./registry";
import { projects } from "@/data/projects";
import type { OpenApp } from "./Applications";

type Entry = { command: string; output: string };
export default function TerminalApp({ open }: { open: OpenApp }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showIdentity, setShowIdentity] = useState(true);
  const [input, setInput] = useState("");
  const history = useRef<string[]>([]);
  const position = useRef(0);
  const draft = useRef("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (entries.length) end.current?.scrollIntoView({ block: "nearest" });
  }, [entries]);
  const run = (event: FormEvent) => {
    event.preventDefault();
    const command = input.trim();
    if (!command) return;
    history.current.push(command);
    position.current = history.current.length;
    setInput("");
    const normalized = command.toLowerCase().replace(/\s+/g, " ");
    if (normalized === "clear") {
      setEntries([]);
      setShowIdentity(false);
      return;
    }
    let output: string;
    switch (normalized) {
      case "help":
        output =
          "Available commands:\n  help           Show this guide\n  whoami / about Developer profile\n  projects       Project directory and honest status\n  stack          Technology toolkit\n  contact        Email and GitHub\n  neofetch       System identity\n  open <app>     Open an application\n  theme dark     Switch to dark mode\n  theme light    Switch to light mode\n  replay         Replay the PS introduction\n  clear          Clear terminal\n\nApps: home, projects, about, terminal, stack, resume, contact, code";
        break;
      case "whoami":
      case "about":
        output = `${profile.name} · ${profile.brand}\nFrontend, full-stack, and software developer.\n${profile.intro}`;
        break;
      case "projects":
        output = projects
          .map(
            (project) =>
              `${project.title} [${project.status}]\n  /projects/${project.slug}`,
          )
          .join("\n\n");
        break;
      case "stack":
        output = technologies
          .map((tool) => `${tool.name}, ${tool.group}`)
          .join("\n");
        break;
      case "contact":
        output = `Email: ${profile.email}\nGitHub: ${profile.github}`;
        break;
      case "neofetch":
        setShowIdentity(true);
        output =
          "John's interactive developer portfolio.\nNo simulated device telemetry.";
        break;
      case "theme dark":
      case "theme light":
        setTheme(normalized === "theme dark" ? "dark" : "light");
        output = `Theme changed to ${normalized.split(" ")[1]}.`;
        break;
      case "replay":
        window.dispatchEvent(new Event("ps:replay-intro"));
        output = "Replaying the PS introduction.";
        break;
      default: {
        const requested = normalized.startsWith("open ")
          ? normalized.slice(5)
          : "";
        const id = requested === "home" ? "welcome" : requested;
        if (isAppId(id)) {
          open(id);
          output = `Opened ${applications.find((app) => app.id === id)!.label}.`;
        } else
          output = `Unknown command: ${command}\nType help for available commands.`;
      }
    }
    setEntries((old) => [...old.slice(-79), { command, output }]);
  };
  const key = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (position.current === history.current.length) draft.current = input;
    position.current = Math.max(
      0,
      Math.min(
        history.current.length,
        position.current + (event.key === "ArrowUp" ? -1 : 1),
      ),
    );
    setInput(
      position.current === history.current.length
        ? draft.current
        : history.current[position.current],
    );
  };
  return (
    <div className="os-terminal">
      <div className="os-terminal__scroll">
        {showIdentity && (
          <>
            <p className="os-terminal__prompt">
              <span>proximus@os:~$</span> neofetch
            </p>
            <div className="os-neofetch">
              <Image
                src="/ps-logo.png"
                alt=""
                width={256}
                height={256}
                sizes="180px"
              />
              <dl>
                {[
                  ["Workspace", "Interactive portfolio"],
                  ["User", "Proximus Shev"],
                  ["Role", "Full-stack developer"],
                  ["Focus", "Web, Python, AI"],
                  ["Projects", String(projects.length) + " in the directory"],
                  ["Status", "Building the next…"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}:</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
                <div className="os-terminal__swatches" aria-hidden="true">
                  {["#0864ff", "#9c43f7", "#00cbf2", "#3bdbf6", "#87eafa"].map(
                    (color) => (
                      <i key={color} style={{ background: color }} />
                    ),
                  )}
                </div>
              </dl>
            </div>
          </>
        )}
        <div
          className="os-terminal__history"
          role="log"
          aria-label="Terminal output"
          aria-live="polite"
        >
          {entries.map((entry, index) => (
            <div key={index}>
              <p className="os-terminal__prompt">
                <span>proximus@os:~$</span> {entry.command}
              </p>
              <pre>{entry.output}</pre>
            </div>
          ))}
        </div>
        <form onSubmit={run} className="os-terminal__input">
          <label htmlFor="os-command">proximus@os:~$</label>
          <input
            id="os-command"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-label="Terminal command. Type help for commands."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={key}
          />
          <button type="submit" aria-label="Run command">
            ↵
          </button>
        </form>
        <div ref={end} />
      </div>
      <footer>
        Type <kbd>help</kbd> to explore <span>↑ ↓ history</span>
      </footer>
    </div>
  );
}
