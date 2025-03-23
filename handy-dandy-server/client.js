const axios = require("axios");

const API_URL = "http://localhost:5000/api/users";
const BASE_URL = "http://localhost:5000/api";

// Register a user
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

// Login a user
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

// Get user details
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

// Update user details
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

// Delete the user
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

// ========== GUIDES ==========
const createGuide = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/guides`, {
      title: "Fix a leaky faucet",
      description: "Step-by-step to fix a faucet",
      steps: ["Turn off water", "Disassemble faucet", "Replace washer"],
      images: [],
      videoUrl: "http://example.com/video",
      category: "Plumbing"
    });
    console.log("✅ Guide created:", res.data);
  } catch (err) {
    console.error("❌ Error creating guide:", err.response?.data || err.message);
  }
};

const getGuides = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/guides`);
    console.log("✅ All guides:", res.data);
  } catch (err) {
    console.error("❌ Error getting guides:", err.response?.data || err.message);
  }
};

const deleteGuide = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/guides/${id}`);
    console.log("✅ Guide deleted:", res.data);
  } catch (err) {
    console.error("❌ Error deleting guide:", err.response?.data || err.message);
  }
};

const getOfflineGuides = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/guides/offline`);
    console.log("✅ Offline guides:", res.data);
  } catch (err) {
    console.error("❌ Error getting offline guides:", err.response?.data || err.message);
  }
};

// ========== PROGRESS ==========
const saveProgress = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/progress`, {
      userId: "user123",
      guideId: "guide123",
      currentStep: 2,
      completed: false,
      badgeEarned: false
    });
    console.log("✅ Progress saved:", res.data);
  } catch (err) {
    console.error("❌ Error saving progress:", err.response?.data || err.message);
  }
};

const getProgress = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/progress/${userId}`);
    console.log("✅ User progress:", res.data);
  } catch (err) {
    console.error("❌ Error fetching progress:", err.response?.data || err.message);
  }
};

// ========== COMMENTS ==========
const addComment = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/comments`, {
      guideId: "guide123",
      userId: "user123",
      content: "Great tutorial!",
      rating: 5
    });
    console.log("✅ Comment added:", res.data);
  } catch (err) {
    console.error("❌ Error adding comment:", err.response?.data || err.message);
  }
};

const getComments = async (guideId) => {
  try {
    const res = await axios.get(`${BASE_URL}/comments/${guideId}`);
    console.log("✅ Comments for guide:", res.data);
  } catch (err) {
    console.error("❌ Error fetching comments:", err.response?.data || err.message);
  }
};

// ========== TOOLS ==========
const getAllTools = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/tools`);
    console.log("✅ Tools:", res.data);
  } catch (err) {
    console.error("❌ Error getting tools:", err.response?.data || err.message);
  }
};

const getToolById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/tools/${id}`);
    console.log("✅ Tool by ID:", res.data);
  } catch (err) {
    console.error("❌ Error getting tool:", err.response?.data || err.message);
  }
};

// Run Tests
const testAPI = async () => {
  await registerUser();
  const token = await loginUser();
  if (token) {
    await getUserInfo(token);
    await updateUser(token);
    await deleteUser(token);
  }

  await createGuide();
  await getGuides();
  await getOfflineGuides();
  await saveProgress();
  await getProgress("user123");
  await addComment();
  await getComments("guide123");
  await getAllTools();
  await getToolById("1");
};

testAPI();
