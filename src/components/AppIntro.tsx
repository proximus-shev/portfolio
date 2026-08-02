"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const INTRO_DURATION_MS = 2050;
const REDUCED_MOTION_DURATION_MS = 250;

export function AppIntro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const documentRoot = document.documentElement;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    documentRoot.classList.add("intro-active");

    const timer = window.setTimeout(
      () => {
        documentRoot.classList.remove("intro-active");
        setIsVisible(false);
      },
      prefersReducedMotion ? REDUCED_MOTION_DURATION_MS : INTRO_DURATION_MS,
    );

    return () => {
      window.clearTimeout(timer);
      documentRoot.classList.remove("intro-active");
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="app-intro" aria-hidden="true">
      <div className="app-intro__glow" />

      <div className="app-intro__mark">
        <Image
          src="/ps-logo.png"
          alt=""
          width={1024}
          height={1024}
          preload
          sizes="(max-width: 639px) 240px, 420px"
          className="app-intro__logo"
        />
      </div>
    </div>
  );
}
