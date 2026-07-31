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
      className="typewriter-heading relative z-10 max-w-full text-[clamp(2rem,10.5vw,2.75rem)] font-black uppercase leading-[0.92] transition duration-500 group-hover:text-shadow-blue sm:text-[3.6rem] lg:text-[clamp(3rem,4.6vw,4.15rem)]"
    >
      <span aria-hidden="true" className="typewriter-line block">
        Code that
      </span>
      <span
        aria-hidden="true"
        className="typewriter-line hero-accent block transition duration-500"
      >
        {firstLine}
        {cursorIsOnFirstLine && <span className="typewriter-cursor" />}
      </span>
      <span aria-hidden="true" className="typewriter-line block">
        {secondLine}
        {!cursorIsOnFirstLine && <span className="typewriter-cursor" />}
      </span>
    </h1>
  );
}
