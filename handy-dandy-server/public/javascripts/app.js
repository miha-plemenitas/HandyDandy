// ==================== Service Worker ====================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((reg) => {
        console.log("✅ Service Worker registered:", reg.scope);
        subscribeToPushNotifications();
      })
      .catch((err) =>
        console.error("❌ Service Worker registration failed:", err)
      );
  });
}

// ==================== Global Variables ====================
const apiUrl = "/api/users";
const dataList = document.getElementById("data-list");
const form = document.getElementById("data-form");
const searchInput = document.getElementById("search");
const notification = document.getElementById("notification");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const testNotifyBtn = document.getElementById("test-notification-btn");
const sessionInfo = document.getElementById("session-info");
let currentUser = null;

// ==================== Push Subscription ====================
async function subscribeToPushNotifications() {
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      "BGSjkT4Plc5rDwPWUeo1-t0nod1Xa8hw7_iloLRcTWQE5R83UMZxFUEG0DspFgCOF8elm-QS9xzRAize2zldpPk"
    ),
  });

  await fetch("/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  console.log("✅ Push Notification subscription successful");
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// ==================== Notify Button ====================
testNotifyBtn.addEventListener("click", async () => {
  await fetch("/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Test notification!" }),
  });
  showNotification("✅ Test notification sent");
});

// ==================== Session ====================
async function checkSession() {
  try {
    const res = await fetch(`${apiUrl}/session`);
    const data = await res.json();
    currentUser = data.user;
    sessionInfo.innerHTML = `✅ Logged in as: <strong>${currentUser.username}</strong>`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
    form.style.display = "block";
    testNotifyBtn.style.display = "inline";
    document.getElementById("data-id").value = currentUser._id;
    document.getElementById("data-username").value = currentUser.username;
    document.getElementById("data-email").value = currentUser.email;
    subscribeToPushNotifications();
  } catch {
    currentUser = null;
    sessionInfo.innerText = `⚠️ Not logged in`;
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
    form.style.display = "none";
    testNotifyBtn.style.display = "none";
  }
  loadData();
}

// ==================== Load Data ====================
async function loadData(search = "") {
  try {
    const res = await fetch(apiUrl);
    const users = await res.json();
    saveLocalData(users);
    displayData(
      users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  } catch {
    const users = getLocalData();
    if (users) {
      displayData(users);
      showNotification("⚠️ Offline: showing cached data", true);
    }
  }
}

// ==================== Display Data ====================
function displayData(users) {
  dataList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerHTML = `
                  <strong>${user.username}</strong> (${user.email})
                  ${
                    currentUser
                      ? currentUser._id === user._id
                        ? ` <span class="tag">You</span>`
                        : ` <button onclick="editUser('${user._id}', '${user.username}', '${user.email}')">✏️</button>
                                  <button onclick="deleteUser('${user._id}')">🗑️</button>`
                      : ""
                  }
              `;
    dataList.appendChild(li);
  });
}

// ==================== Add or Update ====================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return showNotification("Please login first", true);

  const id = document.getElementById("data-id").value;
  const username = document.getElementById("data-username").value;
  const email = document.getElementById("data-email").value;

  if (!username || !email) return showNotification("Missing fields", true);

  const method = id === "" ? "POST" : "PUT";
  const endpoint = id === "" ? "/add" : "/update";
  const payload = id === "" ? { username, email } : { id, username, email };

  try {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    showNotification(data.message);
    form.reset();
    document.getElementById("data-id").value = "";
    loadData();
  } catch {
    showNotification("Error saving user", true);
  }
});

// ==================== Edit User ====================
function editUser(id, username, email) {
  document.getElementById("data-id").value = id;
  document.getElementById("data-username").value = username;
  document.getElementById("data-email").value = email;
}

// ==================== Delete User ====================
async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  try {
    const res = await fetch(`${apiUrl}/delete/${id}`, { method: "DELETE" });
    const data = await res.json();
    showNotification(data.message);
    loadData();
  } catch {
    showNotification("Error deleting user", true);
  }
}

// ==================== Search ====================
searchInput.addEventListener("input", (e) => loadData(e.target.value));

// ==================== Notifications ====================
function showNotification(msg, error = false) {
  notification.innerText = msg;
  notification.style.color = error ? "red" : "green";
  notification.style.display = "block";
  setTimeout(() => (notification.style.display = "none"), 3000);
}

// ==================== Offline Cache ====================
function saveLocalData(users) {
  localStorage.setItem("cachedUsers", JSON.stringify(users));
}

function getLocalData() {
  const data = localStorage.getItem("cachedUsers");
  return data ? JSON.parse(data) : [];
}

// ==================== Online Sync ====================
window.addEventListener("online", () => {
  showNotification("🟢 Back online! Syncing data...");
  loadData();
});

// ==================== Login / Logout ====================
loginBtn.addEventListener("click", () => {
  window.location.href = `${apiUrl}/auth/google`;
});

logoutBtn.addEventListener("click", async () => {
  await fetch(`${apiUrl}/logout`);
  currentUser = null;
  showNotification("Logged out");
  checkSession();
});

// ==================== Init ====================
checkSession();
