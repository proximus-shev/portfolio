"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, FileText, FolderOpen, LockKeyhole, Moon, Pause, Play, RotateCcw, Sun, VolumeX } from "lucide-react";
import { projects } from "@/data/projects";
import { profile, setTheme, technologies, type AppId, type Theme } from "./registry";
import type { OpenApp } from "./Applications";
import "./desktop-home.css";
import { useFocusTimer } from "./FocusTimer";

function localGreeting() {
  const now = new Date();
  const hour = now.getHours();
  return {
    greeting: hour < 12 ? "Good morning," : hour < 18 ? "Good afternoon," : "Good evening,",
    date: now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
  };
}

export function FocusWidget() {
  const { seconds, running, completed, toggle, reset } = useFocusTimer();
  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return <section className="desktop-focus desktop-glass" aria-label="Focus timer">
    <div className="desktop-focus__scene" aria-hidden="true"><span /><div><i /><i /><i /><i /></div></div>
    <div className="desktop-focus__controls">
      <button className="desktop-focus__play" onClick={toggle} aria-label={running ? "Pause focus timer" : "Start focus timer"}>{running ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}</button>
      <div><h2>Focus Mode</h2><p>{seconds === 25 * 60 && !running ? "Deep work · 25 min" : <><time role="timer" aria-label={`${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds remaining`}>{formatted}</time>{running ? " · focusing" : completed ? " · complete" : " · paused"}</>}</p></div>
      {(running || seconds !== 25 * 60) && <button className="desktop-focus__reset" onClick={reset} aria-label="Reset focus timer"><RotateCcw size={13} /></button>}
    </div>
    <span className="os-sr-only" role="status">{completed ? "Focus session complete. Take a short break." : ""}</span>
  </section>;
}

export function DesktopHome({ open }: { open: OpenApp }) {
  const [clock, setClock] = useState({ greeting: "Hello there,", date: "" });
  const [visited, setVisited] = useState<AppId[]>([]);
  const surface = useRef<HTMLElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const featured = projects.find((project) => project.slug === "proximus-shev-portfolio");
  useEffect(() => {
    const element = surface.current;
    if (!element) return;
    const update = () => setCanScroll(element.scrollHeight > element.clientHeight + 2 && element.scrollTop + element.clientHeight < element.scrollHeight - 8);
    const observer = new ResizeObserver(update);
    observer.observe(element);
    Array.from(element.children).forEach((child) => observer.observe(child));
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setClock(localGreeting()));
    const timer = setInterval(() => { if (!document.hidden) setClock(localGreeting()); }, 60000);
    return () => { cancelAnimationFrame(frame); clearInterval(timer); };
  }, []);
  const shortcuts: { id: AppId; label: string; meta: string }[] = [
    { id: "projects", label: "Explore my projects", meta: `${String(projects.length).padStart(2, "0")} projects` },
    { id: "about", label: "Meet the developer", meta: "Profile" },
    { id: "stack", label: "Discover my toolkit", meta: `${String(technologies.length).padStart(2, "0")} tools` },
    { id: "contact", label: "Start a conversation", meta: "Say hello" },
  ];
  return <><section ref={surface} className="desktop-home" aria-label="Proximus Shev desktop home" tabIndex={0}>
    <div className="desktop-home__greeting"><h1 id="os-desktop-home-heading" tabIndex={-1}>{clock.greeting}<strong>I&apos;m John.</strong></h1><span className="desktop-home__accent" /><p>I turn ambitious ideas into products people remember.</p><span className="os-sr-only">{profile.name}. Frontend, full-stack, and software developer.</span><div className="desktop-home__actions"><button onClick={() => open("projects")}><FolderOpen size={18} /> View my work</button><button onClick={() => open("contact")}>Let&apos;s talk <ArrowUpRight size={18} /></button></div></div>
    <div className="desktop-home__widgets">
      <section className="desktop-explore desktop-glass" aria-label="Portfolio shortcuts"><header><h2>Explore</h2><time>{clock.date}</time></header>
        <div>{shortcuts.map((item) => <button key={item.id} onClick={() => { setVisited((old) => old.includes(item.id) ? old : [...old, item.id]); open(item.id); }}><span className="desktop-explore__check" data-visited={visited.includes(item.id)}>{visited.includes(item.id) && <Check size={12} />}</span><span>{item.label}</span><small>{item.meta}</small></button>)}</div>
        <footer><span>Discover the work behind the workspace.</span><ArrowUpRight size={12} /></footer>
      </section>
      <FocusWidget />
      {featured && <section className="desktop-featured desktop-glass" aria-label="Featured project"><span className="desktop-featured__label"><FolderOpen size={19} /> Inside this build</span><h2>{featured.title}</h2><p>A responsive portfolio with desktop windows, phone layouts, and light and dark themes.</p><button onClick={() => open("projects", featured.slug)}>Explore the build <ArrowRight size={16} /></button></section>}
    </div>
  </section>{canScroll && <button className="desktop-home__scroll-hint" onClick={() => surface.current?.scrollBy({ top: Math.max(180, surface.current.clientHeight * .7), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}>Scroll to explore <ArrowDown size={14} /></button>}</>;
}

function subscribeTheme(update: () => void) {
  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
function readTheme(): Theme { return document.documentElement.dataset.theme === "light" ? "light" : "dark"; }
function serverTheme(): Theme { return "dark"; }

export function DesktopSettings({ quiet, onQuietChange, open, lock }: { quiet: boolean; onQuietChange: (value: boolean) => void; open: OpenApp; lock: () => void }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  return <div className="os-app-padding desktop-settings"><p className="os-eyebrow">MAKE YOURSELF AT HOME</p><h2>Your workspace.</h2><p className="os-description">Choose an appearance and explore the Proximus Shev portfolio your way.</p>
    <h3>Appearance</h3><div className="desktop-settings__themes" aria-label="Choose appearance"><button aria-pressed={theme === "light"} onClick={() => setTheme("light")}><span className="desktop-settings__preview desktop-settings__preview--light" /><Sun size={17} /><span>Daylight</span><Check size={15} /></button><button aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}><span className="desktop-settings__preview desktop-settings__preview--dark" /><Moon size={17} /><span>Nightfall</span><Check size={15} /></button></div>
    <div className="desktop-settings__row"><VolumeX size={20} /><div><strong>Reduce background effects</strong><p>Pause ambient motion and simplify glass effects.</p></div><button role="switch" aria-checked={quiet} aria-label="Reduce background effects" onClick={() => onQuietChange(!quiet)}><span /></button></div>
    <div className="os-actions"><button className="os-button" onClick={lock}><LockKeyhole size={15} /> Lock screen</button><button className="os-button" onClick={() => window.dispatchEvent(new Event("ps:replay-intro"))}><RotateCcw size={15} /> Replay introduction</button></div>
    <h3>More to discover</h3><div className="os-actions"><button className="os-button" onClick={() => open("resume")}><FileText size={15} /> Resume</button><button className="os-button" onClick={() => open("code")}>Source preview <ArrowRight size={15} /></button></div>
    <p className="os-small">Appearance is saved on this browser. Other workspace controls apply to this visit.</p>
  </div>;
}
