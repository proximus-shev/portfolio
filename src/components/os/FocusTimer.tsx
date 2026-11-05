"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type FocusTimerState = { seconds: number; running: boolean; completed: boolean; toggle: () => void; reset: () => void };
const FocusTimerContext = createContext<FocusTimerState | null>(null);

/** One session shared by the desktop and phone widgets, including on resize. */
export function FocusTimerProvider({ children }: { children: ReactNode }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const deadline = useRef(0);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining === 0) { setRunning(false); setCompleted(true); }
    };
    const timer = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", tick); };
  }, [running]);

  const toggle = () => {
    if (running) {
      setSeconds(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
      setRunning(false);
    } else {
      const remaining = seconds > 0 ? seconds : 25 * 60;
      setSeconds(remaining);
      setCompleted(false);
      deadline.current = Date.now() + remaining * 1000;
      setRunning(true);
    }
  };
  const reset = () => { setRunning(false); setSeconds(25 * 60); setCompleted(false); };
  return <FocusTimerContext.Provider value={{ seconds, running, completed, toggle, reset }}>{children}</FocusTimerContext.Provider>;
}

export function useFocusTimer() {
  const timer = useContext(FocusTimerContext);
  if (!timer) throw new Error("Focus widgets must be inside FocusTimerProvider.");
  return timer;
}
