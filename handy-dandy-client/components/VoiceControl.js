"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function VoiceControl() {
  const router = useRouter();

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
      console.log("🎙️ Voice command:", command);

      if (command.includes("go to profile")) {
        router.push("/profile");
      } else if (command.includes("go to tools")) {
        router.push("/tools");
      } else if (command.includes("go to guides")) {
        router.push("/guides");
      } else if (command.includes("go home")) {
        router.push("/");
      } else if (command.includes("logout") || command.includes("log out")) {
        signOut();
      }
    });

    return () => recognition.abort();
  }, [router]);

  return (
    <button
      id="voice-btn"
      aria-label="Start voice control"
      className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg z-50 hover:bg-blue-700"
      title="Activate voice control"
    >
      🎤
    </button>
  );
}
