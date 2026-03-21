"use client";

import { useEffect } from "react";

const SCROLL_KEY = "explorer-scroll";

export function saveExplorerScroll() {
  sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
}

export default function ScrollRestorer() {
  useEffect(() => {
    const saved = sessionStorage.getItem(SCROLL_KEY);
    if (saved) {
      sessionStorage.removeItem(SCROLL_KEY);
      const y = parseInt(saved, 10);
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
    }
  }, []);

  return null;
}
