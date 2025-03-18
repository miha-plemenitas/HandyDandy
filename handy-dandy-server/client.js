const axios = require("axios");

const API_URL = "http://localhost:5000/api/users";

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
    console.error("❌ Registration Error:", error.response.data);
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
    console.error("❌ Login Error:", error.response.data);
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
    console.error("❌ Get User Info Error:", error.response.data);
  }
};

// Run Tests
const testAPI = async () => {
  await registerUser();
  const token = await loginUser();
  if (token) await getUserInfo(token);
};

// Execute test API functions
testAPI();
