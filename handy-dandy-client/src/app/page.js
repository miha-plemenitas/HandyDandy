"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="w-full max-w-6xl mx-auto px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-5xl font-bold text-gray-900 flex justify-center items-center gap-3 mb-4">
          <motion.span
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            🔧
          </motion.span>
          <span className="drop-shadow-sm">Welcome to HandyDandy</span>
        </h1>
        <p className="text-lg text-gray-600">
          Your ultimate Progressive Web App for managing tools, repair guides,
          user profiles, and more — with integrated voice control and admin
          dashboard.
        </p>
      </motion.div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto">
        {[
          {
            href: "/guides",
            title: "📚 Guides",
            desc: "Browse step-by-step repair guides and learn to fix things like a pro.",
            color: "green",
          },
          {
            href: "/tools",
            title: "🧰 Tools",
            desc: "View recommended tools and materials for your repairs.",
            color: "blue",
          },
          {
            href: "/profile",
            title: "👤 Profile",
            desc: "Access your user info, track repairs and earned badges.",
            color: "yellow",
          },
        ].map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.2 }}
          >
            <Link
              href={card.href}
              className={`bg-${card.color}-50 hover:bg-${card.color}-100 p-6 rounded-xl shadow-md transition duration-300 border border-${card.color}-100 text-left block`}
            >
              <h2
                className={`text-2xl font-semibold text-${card.color}-800 flex items-center gap-2 mb-2`}
              >
                {card.title}
              </h2>
              <p className="text-gray-700 text-sm">{card.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
