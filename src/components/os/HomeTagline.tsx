"use client";

import { useEffect, useState } from "react";
import "./home-tagline.css";

const phrases = [
  "I turn ambitious ideas into products people remember.",
  "I build products that feel as good as they work.",
  "I make every detail earn its place.",
  "I pair thoughtful design with dependable code.",
  "I build for speed, clarity, and everyday use.",
  "I deliver work I am proud to put my name on.",
];

export function HomeTagline({ enabled }: { enabled: boolean }) {
  const [frame, setFrame] = useState({ phraseIndex: 0, characterCount: 0 });
  const phrase = phrases[frame.phraseIndex];

  useEffect(() => {
    if (!enabled) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let phraseIndex = 0;
    let count = 0;
    let deleting = false;

    const tick = () => {
      if (reducedMotion.matches) {
        setFrame({ phraseIndex: 0, characterCount: phrases[0].length });
        return;
      }

      setFrame({ phraseIndex, characterCount: count });
      let delay = deleting ? 28 : 65;
      if (!deleting && count === phrases[phraseIndex].length) {
        deleting = true;
        delay = 3000;
      } else if (deleting && count === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 650;
      } else {
        count += deleting ? -1 : 1;
      }
      timer = setTimeout(tick, delay);
    };

    const restart = () => {
      clearTimeout(timer);
      phraseIndex = 0;
      count = 0;
      deleting = false;
      timer = setTimeout(tick, 200);
    };

    restart();
    reducedMotion.addEventListener("change", restart);
    return () => {
      clearTimeout(timer);
      reducedMotion.removeEventListener("change", restart);
    };
  }, [enabled]);

  return (
    <p className="home-tagline">
      <span className="os-sr-only">{phrases[0]}</span>
      {phrases.map((text, index) => (
        <span className="home-tagline__reserve" data-primary={index === 0 ? "true" : undefined} aria-hidden="true" key={text}>{text}</span>
      ))}
      <span className="home-tagline__text" aria-hidden="true">{phrase.slice(0, frame.characterCount)}</span>
    </p>
  );
}
