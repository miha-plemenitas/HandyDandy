"use client";
import { useEffect } from "react";

export default function VoiceControl({ onCommand }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("🛑 SpeechRecognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const button = document.getElementById("voice-btn");
    button?.addEventListener("click", () => {
      recognition.start();
    });

    recognition.addEventListener("result", (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      onCommand?.(command);
    });

    return () => recognition.abort();
  }, [onCommand]);

  return (
    <button id="voice-btn" className="bg-blue-600 text-white px-4 py-2 rounded">
      🎤 Start Voice Control
    </button>
  );
}
