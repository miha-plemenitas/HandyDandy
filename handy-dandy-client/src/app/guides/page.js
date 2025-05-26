"use client";

import GuidesSection from "@/components/GuidesSection";

export default function GuidesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-black">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-2">
          📚 Guides
        </h1>
        <p className="text-lg text-gray-600">
          Browse step-by-step repair guides and learn to fix things like a pro.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <GuidesSection showNotification={(msg) => console.log(msg)} />
      </div>
    </main>
  );
}
