"use client";

import { motion } from "framer-motion";

export default function ToolsPage() {
  return (
    <main className="w-full max-w-6xl mx-auto px-6 py-16 text-center text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-2">
          🧰 Tools & Materials
        </h1>
        <p className="text-lg text-gray-600">
          Discover recommended tools and materials to get your repairs done
          right. We’re working hard to bring you curated lists and links soon!
        </p>
      </motion.div>

      <motion.div
        className="mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="inline-block px-6 py-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl shadow-sm">
          🛠️ Tool suggestions and recommendations coming soon...
        </div>
      </motion.div>
    </main>
  );
}
