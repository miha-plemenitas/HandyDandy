"use client";

import { motion } from "framer-motion";
import ToolsSection from "@/components/ToolsSection";

export default function ToolsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-gray-900">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-2">
          🧰 Tools & Materials
        </h1>
        <p className="text-lg text-gray-600">
          Discover recommended tools and materials to get your repairs done right.<br />
          Search, filter, and add new tools below!
        </p>
      </motion.div>

      <motion.div
        className="bg-white shadow-lg rounded-xl p-6 sm:p-8"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ToolsSection />
      </motion.div>
    </main>
  );
}
