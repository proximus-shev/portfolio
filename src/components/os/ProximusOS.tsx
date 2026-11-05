"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  ArrowUpRight,
  LayoutDashboard,
  Moon,
  RotateCcw,
  Search,
  Sun,
  LockKeyhole,
  Globe,
} from "lucide-react";
import {
  AboutApp,
  CodeApp,
  ContactApp,
  FeaturedProject,
  ProjectsApp,
  ResumeApp,
  TechStackApp,
} from "./Applications";
import {
  applications,
  dockApps,
  isAppId,
  launcherApps,
  visibleApplications,
  profile,
  setTheme,
  type AppId,
} from "./registry";
import { initialDesktop, windowReducer, type Action } from "./window-state";
import { OSWindow } from "./OSWindow";
import { CommandPalette } from "./CommandPalette";
import { projects } from "@/data/projects";
import { DesktopLockScreen } from "./DesktopLockScreen";
import { DesktopHome, DesktopSettings } from "./DesktopHome";
import { PhoneDock, PhoneHome, PhoneLockScreen } from "./PhoneExperience";
import { FocusTimerProvider } from "./FocusTimer";

function SystemClock() {
  const [clock, setClock] = useState({ time: "LOCAL TIME", date: "" });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock({
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: now.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    };
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);
  return (
    <time className="os-clock">
      <span>{clock.date}</span>
      {clock.time}
    </time>
  );
}

function ThemeToggle() {
  return (
    <button
      className="os-icon-button"
      aria-label="Toggle light and dark mode"
      title="Toggle theme"
      onClick={() =>
        setTheme(
          document.documentElement.dataset.theme === "light" ? "dark" : "light",
        )
      }
    >
      <Sun className="os-theme-sun" size={17} />
      <Moon className="os-theme-moon" size={17} />
    </button>
  );
}

export function ProximusOS() {
  const [state, dispatch] = useReducer(windowReducer, initialDesktop);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const [screenLocked, setScreenLocked] = useState(true);
  const [ready, setReady] = useState(false);
  const workspace = useRef<HTMLDivElement>(null);
  const shell = useRef<HTMLElement>(null);
  const lockScreen = useCallback(() => {
    try { sessionStorage.removeItem("ps-workspace-unlocked"); } catch { /* Storage is optional. */ }
    document.documentElement.dataset.psWorkspace = "locked";
    setSearchOpen(false);
    setScreenLocked(true);
  }, []);

  const writeLocation = useCallback(
    (id: AppId, slug?: string | null, replace = false) => {
      const url = new URL(window.location.href);
      url.hash = "";
      if (id === "welcome") {
        url.searchParams.delete("app");
        url.searchParams.delete("project");
      } else {
        url.searchParams.set("app", id);
        if (id === "projects" && slug) url.searchParams.set("project", slug);
        else url.searchParams.delete("project");
      }
      if (url.href !== window.location.href)
        window.history[replace ? "replaceState" : "pushState"](
          { ...window.history.state, proximusOS: true },
          "",
          url,
        );
    },
    [],
  );

  const focusWindow = useCallback((id: AppId) => {
    requestAnimationFrame(() => {
      if (id === "welcome") {
        document
          .getElementById(window.innerWidth < 768 ? "os-home-heading" : "os-desktop-home-heading")
          ?.focus({ preventScroll: true });
        return;
      }
      const region = document
        .getElementById(`window-${id}-title`)
        ?.closest<HTMLElement>(".os-window");
      region?.focus({ preventScroll: true });
    });
  }, []);

  const open = useCallback(
    (id: AppId, slug?: string) => {
      dispatch({ type: "open", id });
      if (id === "projects" && slug !== undefined) setSelectedProject(slug);
      writeLocation(id, id === "projects" ? slug ?? selectedProject : undefined);
      focusWindow(id);
    },
    [focusWindow, writeLocation, selectedProject],
  );

  useEffect(() => {
    let initial = true;
    let resizeFrame = 0;
    const syncSize = () => {
      const rect = workspace.current?.getBoundingClientRect();
      if (rect)
        dispatch({
          type: "resize",
          width: Math.max(1, Math.floor(rect.width)),
          height: Math.max(1, Math.floor(rect.height)),
          mobile: window.innerWidth < 768,
          initial,
        });
      initial = false;
    };
    const resize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(syncSize);
    };
    const syncURL = () => {
      const url = new URL(window.location.href);
      const aliases: Record<string, AppId> = {
        about: "about",
        contact: "contact",
        "tech-stack": "stack",
        projects: "projects",
        services: "about",
        top: "welcome",
      };
      const requested =
        url.searchParams.get("app") ?? aliases[url.hash.slice(1)] ?? "welcome";
      const id = isAppId(requested) ? requested : "welcome";
      dispatch({ type: "open", id });
      const slug = url.searchParams.get("project");
      setSelectedProject(
        projects.some((project) => project.slug === slug) ? slug : null,
      );
      if (url.hash) writeLocation(id, slug, true);
    };
    const bootstrap = requestAnimationFrame(() => {
      const unlocked = document.documentElement.dataset.psWorkspace === "unlocked";
      setScreenLocked(!unlocked);
      syncSize();
      syncURL();
      setReady(true);
    });
    const observer = new ResizeObserver(resize);
    if (workspace.current) observer.observe(workspace.current);
    const visibility = () => {
      if (shell.current) shell.current.dataset.paused = String(document.hidden);
    };
    const key = (event: KeyboardEvent) => {
      if (shell.current?.dataset.screenLocked === "true") return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((value) => !value);
      }
    };
    window.addEventListener("popstate", syncURL);
    window.addEventListener("hashchange", syncURL);
    window.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => {
      cancelAnimationFrame(bootstrap);
      cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      window.removeEventListener("popstate", syncURL);
      window.removeEventListener("hashchange", syncURL);
      window.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [writeLocation]);

  const dismiss = (id: AppId) => {
    dispatch({ type: "close", id });
    if (id === "projects") setSelectedProject(null);
    if (state.mobile) {
      dispatch({ type: "open", id: "welcome" });
      writeLocation("welcome");
      focusWindow("welcome");
    } else {
      const next =
        [...state.windows]
          .filter((win) => win.id !== id && win.status === "open")
          .sort((a, b) => b.z - a.z)[0]?.id ?? "welcome";
      writeLocation(next);
      focusWindow(next);
    }
  };
  const selectProject = (slug: string | null) => {
    setSelectedProject(slug);
    writeLocation("projects", slug);
  };
  const manageWindow = (action: Action) => {
    dispatch(action);
    if (action.type === "focus") {
      writeLocation(
        action.id,
        action.id === "projects" ? selectedProject : undefined,
      );
    } else if (action.type === "minimize") {
      const next =
        [...state.windows]
          .filter((win) => win.id !== action.id && win.status === "open")
          .sort((a, b) => b.z - a.z)[0]?.id ?? "welcome";
      writeLocation(next, next === "projects" ? selectedProject : undefined);
      focusWindow(next);
    }
  };

  const unlockScreen = useCallback((destination?: AppId) => {
    try { sessionStorage.setItem("ps-workspace-unlocked", "true"); } catch { /* Storage is optional. */ }
    document.documentElement.dataset.psWorkspace = "unlocked";
    setScreenLocked(false);
    if (destination) open(destination);
    else focusWindow(state.active);
  }, [focusWindow, open, state.active]);

  const runningDockApps = visibleApplications.filter((app) =>
    dockApps.some((pinned) => pinned.id === app.id) ||
    state.windows.some((win) => win.id === app.id && win.status !== "closed"),
  );

  return (
    <FocusTimerProvider>
    <main
      ref={shell}
      className="proximus-os"
      data-mobile-app={state.active !== "welcome"}
      data-quiet={quiet}
      data-ready={ready}
      data-desktop-locked={screenLocked}
      data-screen-locked={screenLocked}
      inert={screenLocked}
      aria-hidden={screenLocked ? true : undefined}
    >
      <Link className="os-skip" href="/projects">
        Skip to project directory
      </Link>
      <div className="os-wallpaper os-home-wallpaper" aria-hidden="true">
        <div className="os-wallpaper__landscape" />
        <div className="os-wallpaper__planet" />
        <div className="os-wallpaper__orbit" />
      </div>
      <header className="os-topbar">
        <button
          className="os-topbar__brand"
          onClick={() => open("welcome")}
          aria-label="Portfolio home"
        >
          <Image src="/ps-logo.png" width={40} height={40} alt="" />
        </button>
        <button className="os-desktop-search" onClick={() => setSearchOpen(true)} aria-label="Search projects and applications"><Search size={18} /><span>Search projects, apps, or anything...</span><kbd>Ctrl / ⌘ K</kbd></button>
        <div className="os-topbar__right">
          <button
            className="os-icon-button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search apps and projects"
            title="Search (Ctrl / Cmd + K)"
          >
            <Search size={17} />
          </button>
          <ThemeToggle />
          <button className="os-icon-button os-lock-desktop" aria-label="Lock desktop" title="Lock desktop" onClick={lockScreen}><LockKeyhole size={16} /></button>
          <button
            className="os-icon-button os-arrange"
            onClick={() => dispatch({ type: "arrange" })}
            aria-label="Arrange workspace"
            title="Arrange workspace"
          >
            <LayoutDashboard size={16} />
          </button>
          <SystemClock />
          <span className="os-dot" />
          <button className="os-profile-button" onClick={() => open("about")} aria-label={`About ${profile.name}`} title={profile.name}>
            <Image
              className="os-profile-button__image"
              src={profile.portrait}
              fill
              sizes="128px"
              quality={90}
              alt=""
            />
          </button>
        </div>
      </header>
      <aside className="os-launcher">
        <nav aria-label="Application launcher">
          {launcherApps.map((app) => (
            <button
              key={app.id}
              onClick={() => open(app.id)}
              aria-current={state.active === app.id ? "page" : undefined}
            >
              <span className={`os-app-icon os-app-icon--${app.id}`}>
                <app.icon size={23} strokeWidth={1.5} />
              </span>
              <span>{app.label}</span>
            </button>
          ))}
        </nav>
        <div className="os-system">
          <span className="os-dot" />
          <span>
            WORKSPACE
            <br />
            <strong>
              {applications.find((app) => app.id === state.active)?.label}
            </strong>
          </span>
          <small>
            {projects.length} projects
            <br />
            React · Next.js
          </small>
        </div>
      </aside>
      <DesktopHome open={open} />
      <div
        className="os-mobile-surface"
        hidden={state.active !== "welcome" && state.mobile}
      >
        <PhoneHome open={open} search={() => setSearchOpen(true)} lock={lockScreen} enabled={state.mobile && !screenLocked} />
      </div>
      <div
        ref={workspace}
        className="os-workspace"
        aria-label="Portfolio workspace"
      >
        {state.windows.filter((win) => win.id !== "welcome" && win.id !== "terminal").map((win) => {
          const active = state.active === win.id;
          return (
            <OSWindow
              key={win.id}
              win={win}
              active={active}
              mobile={state.mobile}
              width={state.width}
              height={state.height}
              dispatch={manageWindow}
              onDismiss={() => dismiss(win.id)}
            >
              {win.id === "projects" &&
                (win.expanded ? (
                  <ProjectsApp
                    selected={selectedProject}
                    select={selectProject}
                  />
                ) : (
                  <FeaturedProject open={open} />
                ))}
              {win.id === "about" && win.status !== "closed" && (
                <AboutApp open={open} />
              )}
              {win.id === "stack" && (
                <TechStackApp
                  compact={!win.expanded && !win.maximized}
                  open={open}
                />
              )}
              {win.id === "resume" && win.status !== "closed" && <ResumeApp />}
              {win.id === "contact" && win.status !== "closed" && (
                <ContactApp />
              )}
              {win.id === "code" && <CodeApp />}
              {win.id === "settings" && win.status !== "closed" && <DesktopSettings quiet={quiet} onQuietChange={setQuiet} open={open} lock={lockScreen} />}
            </OSWindow>
          );
        })}
        {!state.windows.some((win) => win.status === "open") && (
          <div className="os-empty-desktop">
            <Image src="/ps-logo.png" width={100} height={100} alt="" />
            <p>Ready when the next idea is.</p>
            <button className="os-button" onClick={() => open("welcome")}>
              Open Home <ArrowUpRight size={14} />
            </button>
          </div>
        )}
      </div>
      <nav className="os-dock" aria-label="Desktop application dock">
        {runningDockApps.map((app) => {
          const win = state.windows.find((win) => win.id === app.id)!;
          return (
            <button
              key={app.id}
              onClick={() => {
                if (win.expanded || win.status !== "open") open(app.id);
                else {
                  dispatch({ type: "focus", id: app.id });
                  writeLocation(app.id);
                  focusWindow(app.id);
                }
              }}
              aria-label={`${win.status === "minimized" ? "Restore" : "Open"} ${app.label}`}
              aria-current={state.active === app.id ? "page" : undefined}
              data-running={win.status !== "closed"}
              data-minimized={win.status === "minimized"}
            >
              <span className="os-dock__tooltip">
                {app.label}
                {win.status === "minimized" ? " · minimized" : ""}
              </span>
              <span className={`os-app-icon os-app-icon--${app.id}`}>
                {app.id === "stack" ? (
                  <Globe size={27} strokeWidth={1.7} />
                ) : (
                  <app.icon size={26} strokeWidth={1.5} />
                )}
              </span>
              <i />
            </button>
          );
        })}
        <span className="os-dock__divider" />
        <button className="os-dock__source" onClick={() => open("code")} aria-label="Open source preview">
          <span className="os-dock__tooltip">Source preview</span>
          <span className="os-app-icon os-app-icon--code">&lt;/&gt;</span>
        </button>
      </nav>
      <PhoneDock active={state.active} open={open} />
      <footer className="os-desktop-footer">
        <Link href="/projects">
          Browse case studies <ArrowUpRight size={11} />
        </Link>
        <div>
          <button
            onClick={() => setQuiet((value) => !value)}
            aria-pressed={quiet}
          >
            {quiet ? "Enable ambient motion" : "Pause ambient motion"}
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event("ps:replay-intro"))}
          >
            <RotateCcw size={11} /> Replay intro
          </button>
          <span>© 2026 PROXIMUS SHEV</span>
        </div>
      </footer>
      <CommandPalette
        open={searchOpen}
        close={() => setSearchOpen(false)}
        launch={open}
      />
    </main>
    <DesktopLockScreen locked={screenLocked} onUnlock={unlockScreen} />
    <PhoneLockScreen locked={screenLocked} onUnlock={unlockScreen} />
    </FocusTimerProvider>
  );
}
