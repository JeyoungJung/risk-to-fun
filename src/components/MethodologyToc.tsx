"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "risk", label: "Risk Score" },
  { id: "fun", label: "Fun Score" },
  { id: "outputs", label: "Output Metrics" },
  { id: "edge-cases", label: "Edge Cases" },
  { id: "science", label: "Scientific Foundations" },
  { id: "data-sources", label: "Data Sources" },
  { id: "limitations", label: "Limitations" },
  { id: "full-formula", label: "Complete Formula" },
];

export default function MethodologyToc() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="space-y-1">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
        On this page
      </p>
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={cn(
            "block text-sm py-1.5 px-3 rounded-md transition-colors",
            activeId === s.id
              ? "bg-zinc-800 text-zinc-100 font-medium"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
