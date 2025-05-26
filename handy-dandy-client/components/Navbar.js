"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === "miha.plemenitas@gmail.com";

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-zinc-900 shadow-lg">
      <h1 className="text-white font-bold text-xl">🔧 HandyDandy</h1>
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-zinc-300 hover:text-white">
          Home
        </Link>
        <Link href="/guides" className="text-zinc-300 hover:text-white">
          Guides
        </Link>
        <Link href="/tools" className="text-zinc-300 hover:text-white">
          Tools
        </Link>
        {session?.user && (
          <Link href="/profile" className="text-zinc-300 hover:text-white">
            Profile
          </Link>
        )}
        {isAdmin && (
          <Link href="/admin" className="text-zinc-300 hover:text-white">
            Admin
          </Link>
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
