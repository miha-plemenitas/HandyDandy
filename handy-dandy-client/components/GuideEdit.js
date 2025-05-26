"use client";

import React from "react";

export default function GuideEdit({ 
  editFormData, 
  setEditFormData, 
  onSave, 
  onCancel,
  addArrayItem,
  removeArrayItem,
  handleArrayChange
}) {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Guide</h2>
            <button
              onClick={onCancel}
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
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Description
              </label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleInputChange}
                rows={4}
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
                  {editFormData.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-500">{index + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => handleArrayChange('steps', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter step ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('steps', index)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem('steps')}
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
                  {editFormData.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => handleArrayChange('images', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Paste image URL"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('images', index)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                      >
                       x
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem('images')}
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
                type="text"
                name="videoUrl"
                value={editFormData.videoUrl}
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
                  type="text"
                  name="category"
                  value={editFormData.category}
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
                  type="text"
                  name="author"
                  value={editFormData.author}
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
                {editFormData.tools.map((tool, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tool}
                      onChange={(e) => handleArrayChange('tools', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tool name"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tools', index)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayItem('tools')}
                className="mt-3 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
              >
                + Add Tool
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}