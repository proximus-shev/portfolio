"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function AppIntro() {
  const [visible, setVisible] = useState(true);
  const [sequence, setSequence] = useState(0);
  useEffect(() => {
    let timer = 0;
    const finish = () => {
      setVisible(false);
      document.documentElement.dataset.psBoot = "skip";
      try {
        sessionStorage.setItem("ps-os-boot", "seen");
      } catch {
        /* Storage is optional. */
      }
    };
    const start = () => {
      clearTimeout(timer);
      document.documentElement.dataset.psBoot = "play";
      setSequence((value) => value + 1);
      setVisible(true);
      timer = window.setTimeout(
        finish,
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 180
          : 2700,
      );
    };
    const frame = requestAnimationFrame(() => {
      if (document.documentElement.dataset.psBoot === "skip") setVisible(false);
      else start();
    });
    window.addEventListener("ps:replay-intro", start);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      window.removeEventListener("ps:replay-intro", start);
    };
  }, []);
  if (!visible) return null;
  return (
    <div key={sequence} className="app-intro ps-os-boot" aria-hidden="true">
      <div className="ps-os-boot__ring" />
      <div className="ps-os-boot__mark">
        <Image
          src="/ps-logo.png"
          alt=""
          width={1024}
          height={1024}
          preload
          sizes="(max-width: 767px) 92px, 150px"
        />
      </div>
    </div>
  );
}
