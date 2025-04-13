const axios = require("axios");
const open = require("open").default;

const API_URL = "http://localhost:5001/api/users";

// =========================
// GOOGLE OAUTH TEST SUITE
// =========================

const oauthLogin = async () => {
  console.log("🌐 Opening Google OAuth login page...");
  const oauthUrl = `${API_URL}/auth/google`;

  try {
    await open(oauthUrl);
    console.log(`👉 Opened: ${oauthUrl}`);
    console.log(
      "✅ After logging in, test other endpoints manually or via browser"
    );
  } catch (err) {
    console.error("❌ Couldn't open browser:", err.message);
  }
};

const getSessionInfo = async () => {
  try {
    const res = await axios.get(`${API_URL}/session`, {
      withCredentials: true,
    });
    console.log("✅ Session Info:", res.data);
  } catch (err) {
    console.error("❌ No session or not authenticated");
  }
};

const updateUser = async () => {
  try {
    const res = await axios.put(
      `${API_URL}/update`,
      { username: "OAuthUpdatedUser", email: "updated-oauth@example.com" },
      { withCredentials: true }
    );
    console.log("✅ Update Response:", res.data);
  } catch (err) {
    console.error("❌ Update Error:", err.response?.data || err.message);
  }
};

const deleteUser = async () => {
  try {
    const res = await axios.delete(`${API_URL}/delete`, {
      withCredentials: true,
    });
    console.log("✅ Delete Response:", res.data);
  } catch (err) {
    console.error("❌ Delete Error:", err.response?.data || err.message);
  }
};

// =========================
// RUN ALL TESTS (OAuth only)
// =========================

const testAPI = async () => {
  console.log("\n=== 🌐 OAUTH 2.0 TEST ===");
  await oauthLogin();
  console.log("\n👉 After logging in via browser, you can manually call:");
  console.log(" - getSessionInfo()");
  console.log(" - updateUser()");
  console.log(" - deleteUser()");
};

testAPI();
