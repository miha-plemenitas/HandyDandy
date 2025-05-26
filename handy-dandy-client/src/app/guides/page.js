"use client";

import GuidesSection from "@/components/GuidesSection";

export default function GuidesPage() {
  return (
    <>
      <main className="max-w-4xl mx-auto px-6 py-8 text-black">
        <h1 className="text-2xl font-bold mb-4">📚 Guides</h1>
        <p className="mb-6">Browse step-by-step repair guides below.</p>
        <GuidesSection showNotification={(msg) => console.log(msg)} />
      </main>
    </>
  );
}
