require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const webpush = require("web-push");

require("./passport");

const app = express();

// VAPID Config
webpush.setVapidDetails(
  "mailto:miha.plemenitas@email.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const subscribers = [];

// Middleware
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Session Middleware (needed for OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
const guidesRouter = require("./routes/guides");
const progressRouter = require("./routes/progress");
const commentsRouter = require("./routes/comments");
const toolsRouter = require("./routes/tools");
const usersRouter = require("./routes/users");

app.use("/api/guides", guidesRouter);
app.use("/api/progress", progressRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/users", usersRouter);

// --- Push Notifications Endpoints ---
app.post("/subscribe", (req, res) => {
  subscribers.push(req.body);
  console.log("New subscription:", req.body);
  res.status(201).json({ message: "Subscribed" });
});

app.post("/notify", async (req, res) => {
  const payload = JSON.stringify({
    title: "🔔 Notification",
    body: req.body.message || "Default Test Notification!",
  });
  try {
    await Promise.all(
      subscribers.map((sub) =>
        webpush
          .sendNotification(sub, payload)
          .catch((err) => console.error("Push error:", err))
      )
    );
    res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    res.status(500).json({ message: "Error sending notification" });
  }
});

// 404
app.use((req, res, next) => {
  next(createError(404));
});

module.exports = app;
