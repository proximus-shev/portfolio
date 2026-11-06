"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { ArrowRight, ChevronUp, FolderOpen, Home, LockKeyhole, LockKeyholeOpen, Mail, Moon, Plus, Search, Settings, Sun } from "lucide-react";
import { applications, profile, setTheme, visibleApplications, type AppId } from "./registry";
import { projects } from "@/data/projects";
import type { OpenApp } from "./Applications";
import { FocusWidget } from "./DesktopHome";
import { HomeTagline } from "./HomeTagline";
import { PhoneLockTagline } from "./PhoneLockTagline";
import "./phone-experience.css";

function usePhoneClock(enabled = true) {
  const [clock, setClock] = useState({ time: "--:--", period: "", date: "", shortDate: "", iso: "", greeting: "Hello there," });
  useEffect(() => {
    if (!enabled) return;
    const update = () => {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).formatToParts(now);
      const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
      setClock({
        time: `${value("hour")}:${value("minute")}`,
        period: value("dayPeriod"),
        date: now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }),
        shortDate: now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
        iso: now.toISOString(),
        greeting: now.getHours() < 12 ? "Good morning," : now.getHours() < 18 ? "Good afternoon," : "Good evening,",
      });
    };
    const frame = requestAnimationFrame(update);
    const timer = window.setInterval(() => { if (!document.hidden) update(); }, 15000);
    document.addEventListener("visibilitychange", update);
    return () => { cancelAnimationFrame(frame); window.clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, [enabled]);
  return clock;
}

function togglePhoneTheme() { setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"); }

export function PhoneLockScreen({ locked, onUnlock }: { locked: boolean; onUnlock: (destination?: AppId) => void }) {
  const clock = usePhoneClock(locked);
  const [leaving, setLeaving] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const busy = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const unlock = useCallback((destination?: AppId) => {
    if (busy.current || !window.matchMedia("(max-width: 767px)").matches) return;
    busy.current = true;
    ref.current?.style.setProperty("--phone-drag", "90px");
    ref.current?.style.setProperty("--phone-unlock-progress", "1");
    setLeaving(true);
    timeout.current = setTimeout(() => {
      onUnlock(destination);
      setLeaving(false);
      busy.current = false;
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 60 : 560);
  }, [onUnlock]);
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);

  const begin = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("[data-phone-lock-control]")) return;
    drag.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.style.setProperty("--phone-drag", "0px");
    event.currentTarget.style.setProperty("--phone-unlock-progress", "0");
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "true";
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    if (!drag.current || busy.current) return;
    const delta = Math.max(0, drag.current.y - event.clientY);
    event.currentTarget.style.setProperty("--phone-drag", `${Math.min(delta * .35, 90)}px`);
    event.currentTarget.style.setProperty("--phone-unlock-progress", String(Math.min(delta / 65, 1)));
  };
  const end = (event: PointerEvent<HTMLElement>) => {
    const start = drag.current;
    drag.current = null;
    event.currentTarget.removeAttribute("data-dragging");
    if (!start) return;
    const vertical = start.y - event.clientY;
    if (event.type === "pointerup" && vertical >= 65 && vertical > Math.abs(event.clientX - start.x) * 1.3) unlock();
    else {
      event.currentTarget.style.removeProperty("--phone-drag");
      event.currentTarget.style.removeProperty("--phone-unlock-progress");
    }
  };

  if (!locked) return null;
  return <section ref={ref} className="phone-lock" data-leaving={leaving} aria-label="Portfolio phone lock screen" onPointerDown={begin} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
    <div className="phone-wallpaper" aria-hidden="true" />
    <header className="phone-lock__brand"><span>PROXIMUS SHEV</span></header>
    <div className="phone-lock__body"><div className="phone-lock__clock"><time dateTime={clock.iso || undefined}>{clock.date || "\u00a0"}</time><div><time dateTime={clock.iso || undefined}>{clock.time}</time><span>{clock.period}</span></div><PhoneLockTagline /></div>
      <div className="phone-lock__entry"><button data-phone-lock-control className="phone-lock__unlock phone-glass" onClick={() => unlock()} aria-label="Unlock the portfolio" disabled={leaving}><LockKeyhole className="phone-lock__closed-icon" size={25} strokeWidth={1.7} aria-hidden="true" /><LockKeyholeOpen className="phone-lock__open-icon" size={25} strokeWidth={1.7} aria-hidden="true" /></button><p>{leaving ? "Opening your workspace" : "Swipe up to unlock"}</p>{!leaving && <ChevronUp className="phone-lock__swipe-arrow" size={19} aria-hidden="true" />}</div></div>
    <div className="phone-lock__shortcuts"><button data-phone-lock-control onClick={togglePhoneTheme} aria-label="Switch light and dark appearance"><Sun className="phone-dark" size={21} /><Moon className="phone-light" size={21} /></button><button data-phone-lock-control onClick={() => unlock("contact")} aria-label="Unlock and contact John"><Mail size={21} /></button></div>
  </section>;
}

export function PhoneHome({ open, search, lock, enabled }: { open: OpenApp; search: () => void; lock: () => void; enabled: boolean }) {
  const clock = usePhoneClock(enabled);
  const [page, setPage] = useState(0);
  const [visited, setVisited] = useState<AppId[]>([]);
  const primary = applications.filter((app) => ["projects", "about", "stack", "resume"].includes(app.id));
  const explore: { id: AppId; label: string; meta: string }[] = [
    { id: "projects", label: "Explore my projects", meta: `${projects.length} projects` },
    { id: "about", label: "Meet the developer", meta: "Profile" },
    { id: "contact", label: "Start a conversation", meta: "Say hello" },
  ];
  const launch = (id: AppId) => { setVisited((old) => old.includes(id) ? old : [...old, id]); open(id); };
  return <div className="phone-home">
    <div className="phone-home__status"><Image src="/ps-logo.png" width={40} height={40} sizes="40px" alt="Proximus Shev" /><div className="phone-home__controls"><button className="phone-home__lock" onClick={lock} aria-label="Lock the portfolio" title="Lock screen"><LockKeyhole size={21} /></button><button className="phone-home__theme-toggle" onClick={togglePhoneTheme} aria-label="Switch light and dark appearance"><Sun className="phone-dark" size={21} /><Moon className="phone-light" size={21} /></button></div></div>
    <header className="phone-home__intro"><div><h1 id="os-home-heading" tabIndex={-1}>{clock.greeting}<strong>I&apos;m John.</strong></h1><HomeTagline enabled={enabled} /></div><button className="phone-avatar" onClick={() => open("about")} aria-label={`About ${profile.name}`}><Image src={profile.portrait} fill sizes="128px" quality={90} alt="" /></button></header>
    <button className="phone-home__search phone-glass" onClick={search}><Search size={21} /><span>Search apps, projects, and more...</span><ArrowRight size={18} /></button>
    <section key={page} className="phone-home__page" id="phone-home-panel" role="tabpanel" aria-labelledby={`phone-tab-${page}`}>
      {page === 0 && <><div className="phone-home__scenery" aria-hidden="true" /><section className="phone-agenda phone-glass"><header><h2>{clock.shortDate || "Explore the portfolio"}</h2><button onClick={search} aria-label="Find more portfolio apps"><Plus size={21} /></button></header><div>{explore.map((item, index) => <button key={item.id} onClick={() => launch(item.id)}><i data-index={index} data-visited={visited.includes(item.id)} /><span>{item.label}</span><small>{item.meta}</small></button>)}</div></section>
        <div className="phone-home__apps">{primary.map((app) => <button key={app.id} onClick={() => launch(app.id)}><span className={`phone-app phone-app--${app.id} phone-glass`}><app.icon size={30} strokeWidth={1.6} /><span>{app.label === "Tech Stack" ? "Stack" : app.label}</span></span></button>)}</div>
        <div className="phone-home__widgets"><button className="phone-appearance phone-glass" onClick={togglePhoneTheme} aria-label="Change phone appearance"><h2>Appearance</h2><div><span><Moon className="phone-dark" size={27} /><Sun className="phone-light" size={27} /></span><strong><span className="phone-dark">Nightfall</span><span className="phone-light">Daylight</span></strong></div><p>Tap to switch</p><small>Saved on this browser</small></button><FocusWidget /></div></>}
      {page === 1 && <div className="phone-app-library"><h2>Your workspace.</h2><p>Everything in the Proximus Shev portfolio.</p><div className="phone-home__apps">{visibleApplications.filter((app) => app.id !== "welcome").map((app) => <button key={app.id} onClick={() => launch(app.id)}><span className={`phone-app phone-app--${app.id} phone-glass`}><app.icon size={28} strokeWidth={1.6} /><span>{app.label}</span></span></button>)}</div></div>}
      {page === 2 && <div className="phone-projects"><h2>What I&apos;m working on.</h2><p>Take a closer look at what I&apos;m building and how each idea is growing.</p>{[...projects].sort((a, b) => Number(b.slug === "proximus-shev-portfolio") - Number(a.slug === "proximus-shev-portfolio")).map((project) => <button className="phone-glass" key={project.slug} onClick={() => open("projects", project.slug)}><span><FolderOpen size={18} /><small>{project.status}</small></span><h3>{project.title}</h3><p>{project.summary}</p><span className="phone-projects__link">Explore project <ArrowRight size={13} /></span></button>)}</div>}
    </section>
    <nav className="phone-home__pages" role="tablist" aria-label="Phone home pages">{["Home", "Apps", "Projects"].map((label, index) => <button key={label} id={`phone-tab-${index}`} role="tab" tabIndex={page === index ? 0 : -1} aria-label={label} aria-selected={page === index} aria-controls="phone-home-panel" onClick={() => setPage(index)} onKeyDown={(event) => { const next = event.key === "ArrowRight" ? (page + 1) % 3 : event.key === "ArrowLeft" ? (page + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : null; if (next !== null) { event.preventDefault(); setPage(next); document.getElementById(`phone-tab-${next}`)?.focus(); } }} />)}</nav>
  </div>;
}

export function PhoneDock({ active, open }: { active: AppId; open: OpenApp }) {
  return <nav className="phone-dock phone-glass" aria-label="Phone navigation">{[
    { id: "welcome", label: "Home", icon: Home }, { id: "contact", label: "Contact", icon: Mail },
    { id: "settings", label: "Settings", icon: Settings },
  ].map(({ id, label, icon: Icon }) => <button key={id} onClick={() => open(id as AppId)} aria-label={label} aria-current={active === id ? "page" : undefined}><span className={`phone-app phone-app--${id}`}><Icon size={27} strokeWidth={1.7} /></span><i /></button>)}</nav>;
}
