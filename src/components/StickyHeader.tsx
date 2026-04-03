"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HashLink } from "./HashLink";

export function StickyHeader() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === "/";

  useEffect(() => {
    if (!isLanding) {
      setVisible(true);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLanding]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/40 bg-zinc-950/80 backdrop-blur-md transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 opacity-90 hover:opacity-100 transition-opacity">
          <span className="text-xl">⚖️</span>
          <span className="font-heading text-xl tracking-tight text-zinc-100">Fun÷Risk</span>
        </Link>
        <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          <HashLink href="/#explorer" className="hover:text-zinc-200 transition-colors">
            Explorer
          </HashLink>
          <Link href="/compare" className="hover:text-zinc-200 transition-colors">
            Compare
          </Link>
          <Link href="/methodology" className="hover:text-zinc-200 transition-colors">
            Methodology
          </Link>
        </div>
      </nav>
    </header>
  );
}
