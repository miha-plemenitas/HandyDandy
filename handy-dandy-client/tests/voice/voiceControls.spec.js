// tests/voice/voiceControls.spec.js
import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";

test("Voice control navigation works", async ({ page, baseURL }) => {
  // 1. Login so /profile works
  await login(page, baseURL);

  // 2. Inject FakeSpeechRecognition BEFORE app loads
  await page.addInitScript(() => {
    class FakeSpeechRecognition {
      constructor() {
        this.callbacks = {};
        window.__voiceInstance = this;
      }

      addEventListener(event, handler) {
        this.callbacks[event] = handler;
      }

      start() {}

      simulateResult(command) {
        const evt = {
          resultIndex: 0,
          results: {
            0: {
              0: { transcript: command, confidence: 0.9 },
              isFinal: true,
              length: 1,
            },
            length: 1,
          },
        };
        this.callbacks["result"]?.(evt);
      }
    }

    window.SpeechRecognition = FakeSpeechRecognition;
    window.webkitSpeechRecognition = FakeSpeechRecognition;
  });

  // 3. Load homepage
  await page.goto("/");

  // 4. Trigger creation of recognition instance
  await page.click("#voice-btn");

  // 5. Expose instance
  await page.evaluate(() => {
    window.__recognition = window.__voiceInstance;
  });

  // Helper function
  async function speak(command) {
    await page.evaluate((cmd) => {
      window.__recognition.simulateResult(cmd);
    }, command);
  }

  // GO TO GUIDES
  await speak("go to guides");
  await expect(page).toHaveURL(/\/guides/);

  // GO TO TOOLS
  await speak("go to tools");
  await expect(page).toHaveURL(/\/tools/);

  // GO TO PROFILE
  await speak("go to profile");
  await expect(page).toHaveURL(/\/profile/);

  // No logout test
});
