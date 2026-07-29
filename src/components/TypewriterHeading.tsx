"use client";

import { useEffect, useState } from "react";

const phrases = [
  { first: "looks sharp", second: "and works." },
  { first: "stays concise", second: "and solves." },
  { first: "scales cleanly", second: "and performs." },
];

export function TypewriterHeading() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrase = phrases[phraseIndex];
  const totalCharacters = phrase.first.length + phrase.second.length;

  useEffect(() => {
    let delay = isDeleting ? 38 : 72;

    if (!isDeleting && characterCount === totalCharacters) {
      delay = 1700;
    }

    if (isDeleting && characterCount === 0) {
      delay = 350;
    }

    const timer = window.setTimeout(() => {
      if (!isDeleting && characterCount === totalCharacters) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && characterCount === 0) {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % phrases.length);
        return;
      }

      setCharacterCount((current) => current + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [characterCount, isDeleting, phraseIndex, totalCharacters]);

  const firstLine = phrase.first.slice(
    0,
    Math.min(characterCount, phrase.first.length),
  );

  const secondLine = phrase.second.slice(
    0,
    Math.max(0, characterCount - phrase.first.length),
  );

  const cursorIsOnFirstLine = characterCount <= phrase.first.length;

  return (
    <h1
      aria-label={`Code that ${phrase.first} ${phrase.second}`}
      className="relative z-10 text-[clamp(2.35rem,12vw,4.8rem)] font-black uppercase leading-[0.9] tracking-tight transition duration-500 group-hover:-translate-y-1 group-hover:text-shadow-blue lg:text-[clamp(3.2rem,5.7vw,5.8rem)]"
    >
      Code that
      <span
        aria-hidden="true"
        className="block min-h-[0.9em] text-blue-200 transition duration-500 group-hover:text-blue-100"
      >
        {firstLine}
        {cursorIsOnFirstLine && <span className="typewriter-cursor" />}
      </span>
      <span aria-hidden="true" className="block min-h-[0.9em]">
        {secondLine}
        {!cursorIsOnFirstLine && <span className="typewriter-cursor" />}
      </span>
    </h1>
  );
}
