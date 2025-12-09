import Link from "next/link";
import NavLink from "./nav-link";
import { auth } from "@/lib/auth";
import { UserButton } from "./user-button";

export default async function MainHeader() {
  const session = await auth();

  return (
    <header className="bg-slate-900 text-white border-b border-white/5">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/" className="font-bold text-lg text-white no-underline" aria-label="PK - Strona główna">
          <img
            src="/politechnika-krakowska-logo.svg"
            alt="Politechnika Krakowska"
            className="h-10 w-auto block"
          />
        </Link>
        <nav className="flex items-center gap-6">
          <ul className="flex gap-3.5 list-none m-0 p-0">
            <li>
              <NavLink href="/product-list">Produkty</NavLink>
            </li>
            <li>
              <NavLink href="/basket">Koszyk</NavLink>
            </li>
            <li>
              <NavLink href="/order-history">Historia</NavLink>
            </li>
            <li>
              <NavLink href="/about">O sklepie</NavLink>
            </li>
          </ul>
          <div className="pl-6 border-l border-white/20">
            <UserButton user={session?.user} />
          </div>
        </nav>
      </div>
    </header>
  );
}
