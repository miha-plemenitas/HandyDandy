"use client";

import { motion } from "framer-motion";
import { Hammer } from "lucide-react";
import ToolsSection from "@/components/ToolsSection";

export default function ToolsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-900">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center items-center gap-3 mb-3">
          <Hammer className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Tools & Materials
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover recommended tools and materials to get your repairs done
          right.
        </p>
      </motion.div>

      <motion.div
        className="bg-white shadow-md border border-gray-200 rounded-xl p-6 sm:p-8"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ToolsSection />
      </motion.div>
    </main>
  );
}
