"use client";

import { useEffect, useRef } from "react";

export type SciFiBackgroundVariant = "orbital" | "network" | "horizon";

type SciFiBackgroundProps = {
  variant: SciFiBackgroundVariant;
  priority?: boolean;
  fixed?: boolean;
  fullBleed?: boolean;
  intensity?: "soft" | "medium";
};

export function SciFiBackground({
  variant,
  priority = false,
  fixed = false,
  fullBleed = false,
  intensity = "medium",
}: SciFiBackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;

    if (!background) {
      return;
    }

    let isNearViewport = priority;

    const syncActivity = () => {
      background.dataset.active = String(
        isNearViewport && !document.hidden,
      );
    };

    const handleVisibilityChange = () => {
      syncActivity();
    };

    if (!("IntersectionObserver" in window)) {
      background.dataset.loaded = "true";
      isNearViewport = true;
      syncActivity();
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting;

        if (entry.isIntersecting) {
          background.dataset.loaded = "true";
        }

        syncActivity();
      },
      {
        rootMargin: "120px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(background);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    syncActivity();

    return () => {
      observer.disconnect();
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [priority]);

  return (
    <div
      ref={backgroundRef}
      aria-hidden="true"
      data-active={priority ? "true" : "false"}
      data-intensity={intensity}
      data-loaded={priority ? "true" : "false"}
      data-variant={variant}
      className={`sci-fi-background ${
        fixed ? "sci-fi-background--fixed" : ""
      } ${
        fullBleed ? "sci-fi-background--full-bleed" : ""
      }`}
    >
      <div className="sci-fi-background__image" />
      <div className="sci-fi-background__grid" />
      <div className="sci-fi-background__tracer" />
      <div className="sci-fi-background__glow" />
      <div className="sci-fi-background__veil" />
    </div>
  );
}
