"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import GuideComments from "./GuideComments";

export default function GuideDetails({ guide, onClose }) {
  if (!guide) return null;

  const { data: session } = useSession();
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 1-based index

  useEffect(() => {
    const fetchProgress = async () => {
      if (session?.user) {
        const res = await axios.get(`/api/progress?userId=${session.user.id}`);
        const all = res.data;
        const match = all.find((p) => p.guideId === guide._id);
        if (match) {
          setCurrentStepIndex(match.currentStep); // Already 1-based
        }
      }
    };
    fetchProgress();
  }, [session, guide._id]);

  const handleToggleStep = async (stepIndexZeroBased) => {
    if (!session?.user) {
      alert("You must be logged in to track progress.");
      return;
    }

    const stepIndex = stepIndexZeroBased + 1;

    let newStepIndex = currentStepIndex;
    if (stepIndex <= currentStepIndex) {
      newStepIndex = stepIndex - 1; // uncheck (backtrack)
    } else if (stepIndex === currentStepIndex + 1) {
      newStepIndex = stepIndex; // advance
    } else {
      alert("Please complete previous steps first.");
      return;
    }

    try {
      const payload = {
        userId: session.user.id,
        guideId: guide._id,
        currentStep: newStepIndex,
        completed: newStepIndex === guide.steps.length,
        badgeEarned: false,
      };

      await axios.post("/api/progress", payload);
      setCurrentStepIndex(newStepIndex);
    } catch (err) {
      console.error("Error saving progress:", err);
      alert("Error saving progress");
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoIdMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&mute=1`
      : null;
  };

  const embedUrl = getYouTubeEmbedUrl(guide.videoUrl);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] mx-4 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{guide.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
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
                  <>
                    <div className="mb-3 w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-green-500 h-full transition-all duration-300"
                        style={{
                          width: `${
                            (currentStepIndex / guide.steps.length) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <ul className="space-y-4">
                      {guide.steps.map((step, i) => {
                        const stepIndex = i + 1;
                        const checked = stepIndex <= currentStepIndex;
                        const disabled = stepIndex > currentStepIndex + 1;

                        return (
                          <li
                            key={i}
                            className={`flex items-center justify-between gap-4 px-4 py-3 rounded-lg border transition-shadow ${
                              checked
                                ? "bg-green-50 border-green-400 shadow-md"
                                : "bg-white border-gray-200"
                            } ${
                              disabled
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:shadow"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleToggleStep(i)}
                                disabled={disabled}
                                className="w-5 h-5 accent-green-600"
                              />
                              <span
                                className={`text-base ${
                                  checked
                                    ? "font-semibold text-green-700"
                                    : "text-gray-700"
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                            {checked && (
                              <span className="text-sm font-medium text-green-600">
                                ✓ Completed
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
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
                <p className="text-gray-600 mb-1">
                  {guide.author || "Unknown"}
                </p>
                <p className="text-gray-600">
                  {guide.createdAt ? formatDate(guide.createdAt) : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <GuideComments guideId={guide._id} />

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-lg"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
