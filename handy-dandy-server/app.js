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

require("./passport"); // Import passport config

const app = express();

// Middleware
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

module.exports = app;
