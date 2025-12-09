"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const path = usePathname() ?? "/";
  const isActive = path.startsWith(href);

  return (
    <Link
      href={href}
      className={`text-white no-underline px-3 py-1.5 rounded transition-colors ${
        isActive ? "bg-white/10" : "hover:bg-white/5"
      }`}
    >
      {children}
    </Link>
  );
}
