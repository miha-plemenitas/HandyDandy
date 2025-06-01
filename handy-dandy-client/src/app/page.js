"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wrench,
  BookOpen,
  Hammer,
  UserCircle,
  Star,
  BadgeCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-6 py-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4 flex justify-center items-center gap-3">
          <Wrench className="w-10 h-10 text-blue-600 animate-pulse" />
          Welcome to HandyDandy
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Your ultimate Progressive Web App for managing tools, repair guides,
          user profiles, badges, and more — now with voice control and offline
          support.
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          {
            href: "/guides",
            title: "Guides",
            desc: "Browse step-by-step repair guides and learn to fix things like a pro.",
            icon: BookOpen,
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-800",
          },
          {
            href: "/tools",
            title: "Tools",
            desc: "View recommended tools and materials for your repairs.",
            icon: Hammer,
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-800",
          },
          {
            href: "/profile",
            title: "Profile",
            desc: "Access your user info, track repairs and earned badges.",
            icon: UserCircle,
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-800",
          },
        ].map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2 }}
          >
            <Link
              href={card.href}
              className={`block p-6 rounded-xl shadow-md border ${card.bg} ${card.border} hover:shadow-lg transition-all duration-300`}
            >
              <div
                className={`flex items-center gap-3 text-2xl font-semibold mb-2 ${card.text}`}
              >
                <card.icon className="w-6 h-6" />
                {card.title}
              </div>
              <p className="text-gray-700 text-sm">{card.desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Callout Section */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ✨ What You Can Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-gray-50 rounded-lg border hover:shadow">
            <BadgeCheck className="mx-auto text-green-500 w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Earn Badges</h3>
            <p className="text-sm text-gray-600">
              Complete guides to unlock badges and track your progress.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border hover:shadow">
            <Star className="mx-auto text-yellow-500 w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Save Favorites</h3>
            <p className="text-sm text-gray-600">
              Mark guides you love and revisit them any time.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border hover:shadow">
            <Wrench className="mx-auto text-blue-500 w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Use Voice Commands</h3>
            <p className="text-sm text-gray-600">
              Navigate the app hands-free using built-in voice control.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <div className="text-center mt-10 text-sm text-gray-500">
        HandyDandy is open-source and designed for tinkerers, makers, and fixers
        ✨
      </div>
    </main>
  );
}
