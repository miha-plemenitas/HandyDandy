"use client";

import React from "react";

export default function GuideDetails({ guide, onClose }) {
  if (!guide) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  function getYouTubeEmbedUrl(url) {
    if (!url) return null;
    const videoIdMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    if (!videoIdMatch || videoIdMatch.length < 2) return null;
    return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&mute=1`;
  }

  const embedUrl = getYouTubeEmbedUrl(guide.videoUrl);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] mx-4 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{guide.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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

          <div className="space-y-8 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Description
              </h3>
              <p className="whitespace-pre-wrap text-gray-600 text-lg">
                {guide.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {embedUrl && (
                <div className="lg:col-span-2">
                  <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={embedUrl}
                      title="Guide Video"
                      allowFullScreen
                      className="w-full h-full min-h-[400px]"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </div>
              )}

              <div className="lg:col-span-1">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  Steps
                </h3>
                {guide.steps?.length ? (
                  <ol className="space-y-3 list-decimal list-inside bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-y-auto">
                    {guide.steps.map((step, i) => (
                      <li
                        key={i}
                        className="text-gray-600 pb-2 border-b border-gray-100 last:border-0"
                      >
                        {step}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-500">No steps provided.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Category
                </h3>
                <p className="text-gray-600">
                  {guide.category || "Uncategorized"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Tools
                </h3>
                {guide.tools?.length ? (
                  <ul className="space-y-1 list-disc list-inside bg-gray-50 p-4 rounded-lg">
                    {guide.tools.map((tool, i) => (
                      <li key={i} className="text-gray-600">
                        {tool}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No tools listed.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  Author & Date
                </h3>
                <p className="text-gray-600 mb-1">{guide.author || "Unknown"}</p>
                <p className="text-gray-600">
                  {guide.createdAt ? formatDate(guide.createdAt) : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-lg"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}