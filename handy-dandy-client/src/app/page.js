"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <main className="max-w-4xl mx-auto px-6 py-16 text-center text-gray-900">
        <h1 className="text-4xl font-bold mb-4">🔧 Welcome to HandyDandy</h1>
        <p className="text-lg mb-8">
          Your ultimate Progressive Web App for managing tools, repair guides,
          user profiles, and more — with integrated voice control and admin
          dashboard.
        </p>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Link
            href="/guides"
            className="p-6 bg-green-100 rounded-lg hover:bg-green-200 shadow"
          >
            <h2 className="text-xl font-semibold">📚 Guides</h2>
            <p>Browse step-by-step repair guides.</p>
          </Link>
          <Link
            href="/tools"
            className="p-6 bg-blue-100 rounded-lg hover:bg-blue-200 shadow"
          >
            <h2 className="text-xl font-semibold">🧰 Tools</h2>
            <p>View recommended tools and materials.</p>
          </Link>
          <Link
            href="/profile"
            className="p-6 bg-yellow-100 rounded-lg hover:bg-yellow-200 shadow"
          >
            <h2 className="text-xl font-semibold">👤 Profile</h2>
            <p>Access and update your user info.</p>
          </Link>
        </div>
      </main>
    </>
  );
}
