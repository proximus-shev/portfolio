"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { projects } from "@/data/projects";
import { visibleApplications, type AppId } from "./registry";

export function CommandPalette({
  open,
  close,
  launch,
}: {
  open: boolean;
  close: () => void;
  launch: (id: AppId, slug?: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const results = [
    ...visibleApplications.map((app) => ({
      label: app.label,
      detail: "Application",
      id: app.id,
      slug: undefined as string | undefined,
    })),
    ...projects.map((project) => ({
      label: project.title,
      detail: project.status,
      id: "projects" as AppId,
      slug: project.slug,
    })),
  ].filter((result) =>
    `${result.label} ${result.detail}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current?.close();
  }, [open]);
  useEffect(() => {
    if (open)
      document
        .getElementById(`os-search-result-${selected}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [open, selected]);
  const activate = (index: number) => {
    const result = results[index];
    if (result) {
      launch(result.id, result.slug);
      close();
    }
  };
  return (
    <dialog
      ref={dialog}
      className="os-palette"
      aria-label="Search the portfolio"
      onCancel={close}
      onClose={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            close();
        }
      }}
    >
      <div className="os-palette__search">
        <Search size={20} />
        <input
          autoFocus
          placeholder="Search apps and projects…"
          aria-label="Search apps and projects"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls="os-search-results"
          aria-activedescendant={
            results.length
              ? `os-search-result-${Math.min(selected, results.length - 1)}`
              : undefined
          }
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setSelected((current) =>
                Math.min(current + 1, results.length - 1),
              );
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setSelected((current) => Math.max(0, current - 1));
            }
            if (event.key === "Enter") {
              event.preventDefault();
              activate(selected);
            }
          }}
        />
        <button onClick={close} aria-label="Close search">
          <X size={17} />
        </button>
      </div>
      <div
        className="os-palette__results"
        id="os-search-results"
        role="listbox"
        aria-label="Apps and projects"
      >
        {results.map((result, index) => (
          <div
            id={`os-search-result-${index}`}
            key={result.label}
            role="option"
            aria-selected={selected === index}
            onPointerMove={() => setSelected(index)}
            onClick={() => activate(index)}
          >
            <span>
              <strong>{result.label}</strong>
              <small>{result.detail}</small>
            </span>
            <ArrowUpRight size={16} />
          </div>
        ))}
        {!results.length && (
          <p>No matches. Try “projects”, “stack”, or “contact”.</p>
        )}
      </div>
      <footer>
        <span>↑ ↓ navigate · ↵ open · esc close</span>
        <span>PS / PORTFOLIO</span>
      </footer>
    </dialog>
  );
}
