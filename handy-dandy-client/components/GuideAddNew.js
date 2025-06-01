"use client";

import React, { useState, useEffect } from "react";

export default function GuideAddNew({ onClose, showNotification }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    steps: [""],
    images: [""],
    videoUrl: "",
    category: "",
    tools: [""],
    author: "",
  });
  const [availableTools, setAvailableTools] = useState([]);

  // Fetch all tools on mount
  useEffect(() => {
    async function fetchTools() {
      try {
        const res = await fetch("/api/tools");
        if (res.ok) {
          const data = await res.json();
          setAvailableTools(data);
        }
      } catch (e) {
        // Ignore
      }
    }
    fetchTools();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field, index) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add guide.");

      showNotification("Guide successfully added!");
      onClose();
    } catch (err) {
      showNotification(err.message || "Error adding guide", true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Guide</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Steps */}
              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-800">
                  Steps
                </label>
                <div className="space-y-3">
                  {formData.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-gray-500">{i + 1}.</span>
                      <input
                        value={step}
                        onChange={(e) => handleArrayChange("steps", i, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter step ${i + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("steps", i)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem("steps")}
                  className="mt-3 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
                >
                  + Add Step
                </button>
              </div>

              {/* Images */}
              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-800">
                  Image URLs
                </label>
                <div className="space-y-3">
                  {formData.images.map((url, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={url}
                        onChange={(e) => handleArrayChange("images", i, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Paste image URL"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("images", i)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem("images")}
                  className="mt-3 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
                >
                  + Add Image URL
                </button>
              </div>
            </div>

            {/* Video */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Video URL
              </label>
              <input
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-800">
                  Category*
                </label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-lg font-semibold mb-2 text-gray-800">
                  Author
                </label>
                <input
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Tools */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Tools
              </label>
              <div className="space-y-3">
                {formData.tools.map((tool, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <select
                      value={tool}
                      onChange={e => handleArrayChange("tools", i, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select tool</option>
                      {availableTools.map(t => (
                        <option key={t._id || t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("tools", i)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayItem("tools")}
                className="mt-3 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
              >
                + Add Tool
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Add Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}