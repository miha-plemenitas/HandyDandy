"use client";

import { useState, useEffect } from "react";
import GuideList from "./GuideList";
import GuideAddNew from "./GuideAddNew";

export default function GuidesSection({ showNotification }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [guides, setGuides] = useState([]);

  const fetchGuides = async () => {
    try {
      const res = await fetch("/api/guides");
      const data = await res.json();
      setGuides(data);

      const categories = Array.from(new Set(data.map((g) => g.category).filter(Boolean)));
      setAvailableCategories(categories);
    } catch {
      showNotification("Napaka pri pridobivanju vodičev", true);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleNewGuideAdded = (newGuide) => {
    setGuides(prev => [newGuide, ...prev]);
    if (newGuide.category && !availableCategories.includes(newGuide.category)) {
      setAvailableCategories(prev => [...prev, newGuide.category]);
    }
  };

  return (
    <section className="p-6" id="guides">
      <h2 className="text-2xl font-bold mb-4">Guides</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="Search by title or category"
        />

        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">All</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            title="Dodaj nov vodič"
          >
            +
          </button>
        </div>
      </div>

      <GuideList
        guides={guides}
        searchTerm={searchTerm}
        selectedCategory={categoryFilter}
        showNotification={showNotification}
      />

      {showAddForm && (
        <GuideAddNew
        onClose={() => setShowAddForm(false)}
        onGuideAdded={handleNewGuideAdded} // 👈 This is already correct
        showNotification={showNotification}
      />
      
      )}
    </section>
  );
}
