"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

export function HashLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const hrefStr = typeof href === "string" ? href : href.pathname ?? "";
  const [targetPath, hash] = hrefStr.split("#");
  const targetPathNormalized = targetPath === "" ? "/" : targetPath;

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (hash && pathname === targetPathNormalized) {
          const el = document.getElementById(hash);
          if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
        onClick?.(e);
      }}
      {...props}
    />
  );
}
