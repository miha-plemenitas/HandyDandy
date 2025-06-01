"use client"

import { useState, useEffect } from "react";

export default function AddToolModal({ show, onClose, onAdd, editTool, availableCategories = [] }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState(""); // za novo kategorijo
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTool) {
      setName(editTool.name || "");
      setCategory(editTool.category || "");
      setCustomCategory("");
      setLink(editTool.link || "");
      setPreview(editTool.image || "");
      setImage(null);
    } else {
      setName(""); setCategory(""); setCustomCategory(""); setLink(""); setPreview(""); setImage(null);
    }
  }, [editTool, show]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Prava kategorija
    const trueCategory = category === "_custom" ? customCategory : category;

    // 1. Upload image, če je nova
    let imageUrl = preview;
    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      const imgRes = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const imgData = await imgRes.json();
      imageUrl = imgData?.url || preview;
    }

    const body = { name, category: trueCategory, link, image: imageUrl };

    // DODAJANJE
    if (!editTool) {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        onAdd(data);
        onClose();
      } else {
        alert(data?.error || "Failed to add tool.");
      }
    // UREJANJE
    } else {
      const res = await fetch(`/api/tools?id=${editTool._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        onAdd(data);
        onClose();
      } else {
        alert(data?.error || "Failed to update tool.");
      }
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview("");
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[95vh] overflow-y-auto">
        <form className="p-8" onSubmit={handleSubmit}>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editTool ? "Edit Tool" : "Add New Tool"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              tabIndex={-1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Tool Name */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Name*
              </label>
              <input
                type="text"
                placeholder="Tool name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            {/* Category - DROPDOWN ali vnos */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Category*
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="_custom">+ Add new category</option>
              </select>
              {category === "_custom" && (
                <input
                  type="text"
                  className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new category"
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  required
                />
              )}
            </div>

            {/* Buy Link */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Buy Link
              </label>
              <input
                type="url"
                placeholder="https://example.com/tool"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={link}
                onChange={e => setLink(e.target.value)}
              />
            </div>

            {/* Image upload & preview */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleFileChange}
              />
              {preview && (
                <img src={preview} alt="Preview" className="mt-3 rounded-xl w-28 h-28 object-contain border border-gray-200 shadow" />
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:bg-blue-300"
              disabled={loading || (category === "_custom" && !customCategory)}
            >
              {loading ? (editTool ? "Saving..." : "Adding...") : editTool ? "Save Changes" : "Add Tool"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
