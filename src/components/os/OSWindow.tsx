"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { ArrowLeft, Maximize2, Minus, Minimize2, X } from "lucide-react";
import { applications } from "./registry";
import { type Action, type WindowState } from "./window-state";
import "./window-design.css";

type Props = {
  win: WindowState;
  active: boolean;
  mobile: boolean;
  width: number;
  height: number;
  dispatch: (action: Action) => void;
  onDismiss: () => void;
  children: ReactNode;
};

export function OSWindow({
  win,
  active,
  mobile,
  width,
  height,
  dispatch,
  onDismiss,
  children,
}: Props) {
  const app = applications.find((item) => item.id === win.id)!;
  const ref = useRef<HTMLElement>(null);
  const drag = useRef<{
    clientX: number;
    clientY: number;
    x: number;
    y: number;
    nextX: number;
    nextY: number;
    maxX: number;
    maxY: number;
  } | null>(null);
  const frame = useRef<number | null>(null);
  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    drag.current = null;
  }, []);

  const beginDrag = (event: PointerEvent<HTMLElement>) => {
    if (
      mobile ||
      win.maximized ||
      event.button !== 0 ||
      (event.target as HTMLElement).closest("button")
    )
      return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    // The section's capture handler already focuses the window once.
    drag.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      x: win.x,
      y: win.y,
      nextX: win.x,
      nextY: win.y,
      maxX: Math.max(0, width - win.width),
      maxY: Math.max(0, height - win.height),
    };
    ref.current?.setAttribute("data-dragging", "true");
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    const origin = drag.current;
    if (!origin) return;
    // Cache bounds at pointer-down; no layout reads or React updates per move.
    origin.nextX = Math.max(0, Math.min(origin.x + event.clientX - origin.clientX, origin.maxX));
    origin.nextY = Math.max(0, Math.min(origin.y + event.clientY - origin.clientY, origin.maxY));
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      if (drag.current && ref.current)
        ref.current.style.transform = `translate3d(${drag.current.nextX}px, ${drag.current.nextY}px, 0)`;
      frame.current = null;
    });
  };
  const end = (event: PointerEvent<HTMLElement>) => {
    const origin = drag.current;
    if (!origin) return;
    if (event.type === "pointerup") {
      origin.nextX = Math.max(0, Math.min(origin.x + event.clientX - origin.clientX, origin.maxX));
      origin.nextY = Math.max(0, Math.min(origin.y + event.clientY - origin.clientY, origin.maxY));
    }
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    drag.current = null;
    // Flush the final position before React commits so dropping cannot jump back.
    if (ref.current) {
      ref.current.style.transform = `translate3d(${origin.nextX}px, ${origin.nextY}px, 0)`;
      ref.current.removeAttribute("data-dragging");
    }
    if (origin.nextX !== origin.x || origin.nextY !== origin.y) {
      dispatch({ type: "move", id: win.id, x: origin.nextX, y: origin.nextY });
    }
  };
  return (
    <section
      ref={ref}
      className={`os-window os-window--${win.id}`}
      data-active={active}
      data-expanded={win.expanded}
      data-maximized={win.maximized}
      aria-labelledby={`window-${win.id}-title`}
      tabIndex={-1}
      hidden={
        win.status !== "open" || (mobile && (!active || win.id === "welcome"))
      }
      style={{
        width: win.maximized ? width : win.width,
        height: win.maximized ? height : win.height,
        transform: `translate3d(${win.maximized ? 0 : win.x}px, ${win.maximized ? 0 : win.y}px, 0)`,
        zIndex: win.z,
      }}
      onPointerDownCapture={() => {
        if (!active) dispatch({ type: "focus", id: win.id });
      }}
      onFocusCapture={() => {
        if (!active) dispatch({ type: "focus", id: win.id });
      }}
    >
      <header
        className="os-window__bar"
        onPointerDown={beginDrag}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onLostPointerCapture={end}
        onDoubleClick={(event) => {
          if (!mobile && !(event.target as HTMLElement).closest("button"))
            dispatch({ type: "maximize", id: win.id });
        }}
      >
        <button
          className="os-window__back"
          onClick={onDismiss}
          aria-label="Back to home"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="os-window__controls">
          <button
            className="os-window__close"
            onClick={onDismiss}
            aria-label={`Close ${app.label}`}
          >
            <X size={9} />
          </button>
          <button
            className="os-window__minimize"
            onClick={() => dispatch({ type: "minimize", id: win.id })}
            aria-label={`Minimize ${app.label}`}
          >
            <Minus size={9} />
          </button>
          <button
            className="os-window__maximize"
            onClick={() => dispatch({ type: "maximize", id: win.id })}
            aria-label={`${win.maximized ? "Restore" : "Maximize"} ${app.label}`}
          >
            {win.maximized ? <Minimize2 size={8} /> : <Maximize2 size={8} />}
          </button>
        </div>
        <span className="os-window__title" id={`window-${win.id}-title`}>
          <span className={`os-window__app-icon os-app-icon--${win.id}`}>
            <app.icon size={17} />
          </span>
          <span>
            {win.id === "projects" && !win.expanded
              ? "Featured Project"
              : app.title}
          </span>
        </span>
        <span className="os-window__meta">
          {win.id === "welcome" ? "v2.0" : win.id === "terminal" ? "~" : ""}
        </span>
      </header>
      <div className="os-window__body">{children}</div>
    </section>
  );
}
