const axios = require("axios");
const open = require("open").default;

const API_URL = "http://localhost:5000/api/users";
const BASE_URL = "http://localhost:5000/api";

// =========================
// JWT AUTH SECTION
// =========================

const registerUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    console.log("✅ Registration Response:", response.data);
  } catch (error) {
    console.error(
      "❌ Registration Error:",
      error.response?.data || error.message
    );
  }
};

const loginUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: "test@example.com",
      password: "password123",
    });
    console.log("✅ Login Response:", response.data);
    return response.data.token;
  } catch (error) {
    console.error("❌ Login Error:", error.response?.data || error.message);
  }
};

const getUserInfo = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ User Info:", response.data);
  } catch (error) {
    console.error(
      "❌ Get User Info Error:",
      error.response?.data || error.message
    );
  }
};

const updateUser = async (token) => {
  try {
    const response = await axios.put(
      `${API_URL}/update`,
      { username: "updatedUser", email: "updated@example.com" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Update Response:", response.data);
  } catch (error) {
    console.error("❌ Update Error:", error.response?.data || error.message);
  }
};

const deleteUser = async (token) => {
  try {
    const response = await axios.delete(`${API_URL}/delete`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Delete Response:", response.data);
  } catch (error) {
    console.error("❌ Delete Error:", error.response?.data || error.message);
  }
};

// =========================
// GOOGLE OAUTH SECTION
// =========================

const testOAuthLogin = async () => {
  console.log("🌐 Please log in with Google OAuth in your browser...");
  const oauthUrl = `${API_URL}/auth/google`;

  try {
    await open(oauthUrl);
    console.log(`👉 Opened: ${oauthUrl}`);
    console.log(
      "✅ After logging in, open this in your browser to verify session:"
    );
    console.log("👉 http://localhost:5000/api/users/session");
  } catch (err) {
    console.error("❌ Couldn't open browser:", err.message);
  }
};

// =========================
// RUN ALL TESTS
// =========================

const testAPI = async () => {
  console.log("\n=== 🔐 JWT AUTH TESTS ===");
  await registerUser();
  const token = await loginUser();
  let userId = null;
  if (token) {
    const res = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    userId = res.data._id;
    await getUserInfo(token);
    await updateUser(token);
    await deleteUser(token);
  }

  console.log("\n=== 🌐 OAUTH 2.0 TEST ===");
  await testOAuthLogin();
};

testAPI();
