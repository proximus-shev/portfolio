"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Expand, LockKeyhole, LockKeyholeOpen, Minimize, Moon, Sun } from "lucide-react";
import { setTheme } from "./registry";
import "./desktop-lock-screen.css";

type Clock = { time: string; date: string; iso: string };

const lockPhrases = [
  { first: "LOOKS SHARP", second: "AND WORKS." },
  { first: "STAYS CONCISE", second: "AND SOLVES." },
  { first: "RUNS FAST", second: "AND SCALES." },
];

function LockTypewriter() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const phrase = lockPhrases[phraseIndex];
  const totalCharacters = phrase.first.length + phrase.second.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (characterCount === totalCharacters) return;
      const reducedMotionFrame = window.requestAnimationFrame(() => {
        setCharacterCount(totalCharacters);
      });
      return () => window.cancelAnimationFrame(reducedMotionFrame);
    }

    let delay = isDeleting ? 38 : 72;
    if (!isDeleting && characterCount === totalCharacters) delay = 1700;
    if (isDeleting && characterCount === 0) delay = 350;

    const typeTimer = window.setTimeout(() => {
      if (!isDeleting && characterCount === totalCharacters) {
        setIsDeleting(true);
        return;
      }
      if (isDeleting && characterCount === 0) {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % lockPhrases.length);
        return;
      }
      setCharacterCount((current) => current + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(typeTimer);
  }, [characterCount, isDeleting, phraseIndex, totalCharacters]);

  const firstLine = phrase.first.slice(0, Math.min(characterCount, phrase.first.length));
  const secondLine = phrase.second.slice(0, Math.max(0, characterCount - phrase.first.length));
  const cursorIsOnFirstLine = characterCount <= phrase.first.length;

  return (
    <p className="ps-lock__typewriter" aria-label={`Code that ${phrase.first} ${phrase.second}`}>
      <span aria-hidden="true">CODE THAT </span>
      <span aria-hidden="true" className="ps-lock__typewriter-accent">
        {firstLine}
        {cursorIsOnFirstLine && <span className="ps-lock__typewriter-cursor" />}
      </span>
      {secondLine && <span aria-hidden="true"> {secondLine}</span>}
      {!cursorIsOnFirstLine && <span aria-hidden="true" className="ps-lock__typewriter-cursor" />}
    </p>
  );
}

/** Desktop entry screen. Mobile keeps its existing launcher until its design is supplied. */
export function DesktopLockScreen({ locked, onUnlock }: { locked: boolean; onUnlock: () => void }) {
  const [clock, setClock] = useState<Clock>({ time: "--:--", date: "", iso: "" });
  const [leaving, setLeaving] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState("");
  const unlocking = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockButton = useRef<HTMLButtonElement>(null);

  const unlock = useCallback(() => {
    if (unlocking.current || !window.matchMedia("(min-width: 768px)").matches) return;
    unlocking.current = true;
    setLeaving(true);
    timer.current = setTimeout(() => {
      onUnlock();
      setLeaving(false);
      unlocking.current = false;
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 60 : 560);
  }, [onUnlock]);

  useEffect(() => {
    if (!locked) return;
    const update = () => {
      const now = new Date();
      setClock({
        time: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now),
        date: new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(now),
        iso: now.toISOString(),
      });
    };
    const frame = requestAnimationFrame(update);
    const interval = setInterval(() => { if (!document.hidden) update(); }, 1000);
    const key = (event: KeyboardEvent) => {
      if (!window.matchMedia("(min-width: 768px)").matches || document.documentElement.dataset.psBoot === "play") return;
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat || event.isComposing) return;
      if (["Tab", "Shift", "Control", "Alt", "Meta", "CapsLock", "NumLock", "ScrollLock", "PrintScreen"].includes(event.key)) return;
      if ((event.target as HTMLElement).closest("[data-lock-control]")) return;
      event.preventDefault();
      unlock();
    };
    document.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", update);
    return () => { cancelAnimationFrame(frame); clearInterval(interval); document.removeEventListener("keydown", key); document.removeEventListener("visibilitychange", update); };
  }, [locked, unlock]);

  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const toggleAppearance = () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setNotice("");
    } catch { setNotice("Full screen is unavailable in this browser."); }
  };

  if (!locked) return null;

  return (
    <section className="ps-lock" data-leaving={leaving} aria-label="Portfolio desktop lock screen" onClick={unlock}>
      <div className="ps-lock__wallpaper" aria-hidden="true" />
      <div className="ps-lock__shade" aria-hidden="true" />
      <header className="ps-lock__header">
        <div className="ps-lock__brand"><Image src="/ps-logo.png" alt="" width={72} height={60} sizes="72px" /><span><strong>PROXIMUS SHEV</strong></span></div>
        <div className="ps-lock__controls" data-lock-control onClick={(event) => event.stopPropagation()}>
          <button onClick={toggleAppearance} aria-label="Toggle light and dark mode" title="Change appearance"><Sun className="ps-lock__dark-only" size={19} /><Moon className="ps-lock__light-only" size={19} /></button>
          <button onClick={toggleFullscreen} aria-label={fullscreen ? "Exit full screen" : "Enter full screen"} title={fullscreen ? "Exit full screen" : "Enter full screen"}>{fullscreen ? <Minimize size={18} /> : <Expand size={18} />}</button>
          <span className="ps-lock__status" aria-label={leaving ? "Desktop unlocking" : "Desktop locked"}><LockKeyhole className="ps-lock__closed-icon" size={17} aria-hidden="true" /><LockKeyholeOpen className="ps-lock__open-icon" size={17} aria-hidden="true" /></span>
        </div>
      </header>

      <button className="ps-lock__appearance" data-lock-control onClick={(event) => { event.stopPropagation(); toggleAppearance(); }} aria-label="Change lock screen appearance">
        <span className="ps-lock__appearance-icon"><Moon className="ps-lock__dark-only" strokeWidth={1.2} /><Sun className="ps-lock__light-only" strokeWidth={1.2} /></span>
        <span className="ps-lock__appearance-copy"><strong><span className="ps-lock__dark-only">Dark</span><span className="ps-lock__light-only">Light</span></strong><span className="ps-lock__appearance-name"><span className="ps-lock__dark-only">Nightfall</span><span className="ps-lock__light-only">Daylight</span></span><small>Change appearance <ArrowUpRight size={12} /></small></span>
      </button>

      <div className="ps-lock__clock" aria-label="Current local time and date">
        <time className="ps-lock__time" dateTime={clock.iso || undefined} aria-label={clock.time}><span className="ps-lock__time-dark" aria-hidden="true">{clock.time}</span><span className="ps-lock__time-light" aria-hidden="true">{clock.time}</span></time>
        <time className="ps-lock__date" dateTime={clock.iso || undefined}>{clock.date || "\u00a0"}</time>
        <span className="ps-lock__rule" aria-hidden="true" />
        <LockTypewriter />
      </div>

      <p className="ps-lock__motto">THINK BOLDLY<br />BUILD CLEARLY<br />MAKE IT MATTER<span /></p>
      <div className="ps-lock__manifesto" aria-hidden="true"><span>CLARITY</span><span>CRAFT</span><span>SYSTEMS</span><span>EXPERIENCES</span><span>WITH IMPACT</span></div>
      <button ref={unlockButton} className="ps-lock__unlock" onClick={(event) => { event.stopPropagation(); unlock(); }} disabled={leaving} aria-label="Unlock the desktop portfolio"><span className="ps-lock__unlock-icon"><LockKeyhole className="ps-lock__closed-icon" size={21} strokeWidth={1.5} aria-hidden="true" /><LockKeyholeOpen className="ps-lock__open-icon" size={21} strokeWidth={1.5} aria-hidden="true" /></span><span>{leaving ? "Opening the workspace..." : "Press any key or click to enter."}</span></button>
      <p className="ps-lock__notice" role="status">{notice}</p>
    </section>
  );
}
