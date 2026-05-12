import exp from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import { userApp } from "./APIs/UserAPI.js";
import { authorApp } from "./APIs/AuthorAPI.js";
import { adminApp } from "./APIs/AdminAPI.js";
import { commonApp } from "./APIs/CommonAPI.js";

import cookieParser from "cookie-parser";
import cors from "cors";

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.resolve(__dirname, "../.env") });

// Create Express app
const app = exp();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app",
    ],
    credentials: true,
  })
);

// Middleware
app.use(cookieParser());
app.use(exp.json());

// Routes
app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);
app.use("/auth", commonApp);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("DB server connected");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });

  } catch (err) {
    console.log("Error in DB connect:", err);
    process.exit(1);
  }
};

connectDB();

// Invalid route handler
app.use((req, res) => {
  res.status(404).json({
    message: `Path ${req.url} is invalid`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.log("Error:", err);

  // Validation Error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      error: err.message,
    });
  }

  // Cast Error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Cast Error",
      error: err.message,
    });
  }

  // Duplicate Key Error
  const errCode =
    err.code ??
    err.cause?.code ??
    err.errorResponse?.code;

  const keyValue =
    err.keyValue ??
    err.cause?.keyValue ??
    err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

    return res.status(409).json({
      message: `${field} "${value}" already exists`,
    });
  }

  // Server Error
  res.status(500).json({
    message: "Server side error",
  });
});