"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="w-full max-w-6xl mx-auto px-6 py-16 text-center">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 flex justify-center items-center gap-3 mb-4">
          <span>🔧</span>
          <span className="drop-shadow-sm">Welcome to HandyDandy</span>
        </h1>
        <p className="text-lg text-gray-600">
          Your ultimate Progressive Web App for managing tools, repair guides,
          user profiles, and more — with integrated voice control and admin
          dashboard.
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto">
        <Link
          href="/guides"
          className="bg-green-50 hover:bg-green-100 p-6 rounded-xl shadow-md transition duration-300 border border-green-100 text-left"
        >
          <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2 mb-2">
            📚 Guides
          </h2>
          <p className="text-gray-700 text-sm">
            Browse step-by-step repair guides and learn to fix things like a
            pro.
          </p>
        </Link>

        <Link
          href="/tools"
          className="bg-blue-50 hover:bg-blue-100 p-6 rounded-xl shadow-md transition duration-300 border border-blue-100 text-left"
        >
          <h2 className="text-2xl font-semibold text-blue-800 flex items-center gap-2 mb-2">
            🧰 Tools
          </h2>
          <p className="text-gray-700 text-sm">
            View recommended tools and materials for your repairs.
          </p>
        </Link>

        <Link
          href="/profile"
          className="bg-yellow-50 hover:bg-yellow-100 p-6 rounded-xl shadow-md transition duration-300 border border-yellow-100 text-left"
        >
          <h2 className="text-2xl font-semibold text-yellow-800 flex items-center gap-2 mb-2">
            👤 Profile
          </h2>
          <p className="text-gray-700 text-sm">
            Access your user info, track repairs and earned badges.
          </p>
        </Link>
      </div>
    </main>
  );
}
