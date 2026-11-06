"use client";

import { useEffect, useState } from "react";

const words = ["MATTER.", "INSPIRE.", "PERFORM.", "CONNECT.", "EMPOWER.", "LAST."];

export function PhoneLockTagline() {
  const [frame, setFrame] = useState({ wordIndex: 0, count: 0 });

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phone = window.matchMedia("(max-width: 767px)");
    let timer: ReturnType<typeof setTimeout>;
    let wordIndex = 0;
    let count = 0;
    let deleting = false;

    const tick = () => {
      if (reducedMotion.matches) {
        setFrame({ wordIndex: 0, count: words[0].length });
        return;
      }

      setFrame({ wordIndex, count });
      let delay = deleting ? 55 : 110;
      if (!deleting && count === words[wordIndex].length) {
        deleting = true;
        delay = 2000;
      } else if (deleting && count === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 350;
      } else {
        count += deleting ? -1 : 1;
      }
      timer = setTimeout(tick, delay);
    };

    const restart = () => {
      clearTimeout(timer);
      wordIndex = 0;
      count = 0;
      deleting = false;
      if (phone.matches) timer = setTimeout(tick, 200);
    };

    restart();
    reducedMotion.addEventListener("change", restart);
    phone.addEventListener("change", restart);
    return () => {
      clearTimeout(timer);
      reducedMotion.removeEventListener("change", restart);
      phone.removeEventListener("change", restart);
    };
  }, []);

  return (
    <p className="phone-lock__tagline">
      <span className="os-sr-only">Ideas built to matter.</span>
      <span aria-hidden="true">IDEAS BUILT TO </span>
      <strong className="phone-lock__word" aria-hidden="true">
        {words.map((word, index) => (
          <span className="phone-lock__word-reserve" data-primary={index === 0 ? "true" : undefined} key={word}>{word}</span>
        ))}
        <span className="phone-lock__word-text">{words[frame.wordIndex].slice(0, frame.count)}</span>
      </strong>
    </p>
  );
}
