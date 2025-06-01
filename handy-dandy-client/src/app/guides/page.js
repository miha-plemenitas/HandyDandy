"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import GuidesSection from "@/components/GuidesSection";

export default function GuidesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-900">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center items-center gap-3 mb-3">
          <BookOpen className="w-8 h-8 text-green-600" />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Guides
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse step-by-step repair guides and learn to fix things like a pro.
        </p>
      </motion.div>

      <motion.div
        className="bg-white shadow-md border border-gray-200 rounded-xl p-6 sm:p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <GuidesSection showNotification={(msg) => console.log(msg)} />
      </motion.div>
    </main>
  );
}
