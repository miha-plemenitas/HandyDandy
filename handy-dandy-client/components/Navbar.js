"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdmin = session?.user?.email === "miha.plemenitas@gmail.com";

  const isActive = (path) => pathname === path;

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-zinc-900 shadow-lg">
      {/* Clickable logo */}
      <Link
        href="/"
        className="text-white font-bold text-xl hover:text-blue-300"
      >
        🔧 HandyDandy
      </Link>

      <div className="flex items-center space-x-4">
        <NavLink href="/" label="Home" isActive={isActive("/")} />
        <NavLink href="/guides" label="Guides" isActive={isActive("/guides")} />
        <NavLink href="/tools" label="Tools" isActive={isActive("/tools")} />
        {session?.user && (
          <NavLink
            href="/profile"
            label="Profile"
            isActive={isActive("/profile")}
          />
        )}
        {isAdmin && (
          <NavLink href="/admin" label="Admin" isActive={isActive("/admin")} />
        )}
        {session ? (
          <button
            onClick={() => signOut()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, label, isActive }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1 rounded ${
        isActive
          ? "bg-white text-zinc-900 font-semibold"
          : "text-zinc-300 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
