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

const app = exp();
const isProduction = process.env.NODE_ENV === "production";
const defaultLocalOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5175",
];

const allowedOrigins = [
  ...(process.env.ALLOWED_ORIGINS?.split(",") ?? []),
  process.env.FRONTEND_URL,
]
  .map((origin) => origin?.trim())
  .filter(Boolean)
  .concat(defaultLocalOrigins);

app.disable("x-powered-by");
app.set("trust proxy", isProduction ? 1 : 0);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Total-Count"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(exp.json({ limit: "10mb" }));
app.use(exp.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);
app.use("/auth", commonApp);

const startServer = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("Missing DB_URL environment variable");
    }

    await mongoose.connect(process.env.DB_URL);
    console.log("DB server connected");

    const port = process.env.PORT || 5001;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Error in DB connect:", err);
    process.exit(1);
  }
};

startServer();

app.use((req, res) => {
  res.status(404).json({
    message: `Path ${req.originalUrl} is invalid`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

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

  if (errCode === 11000 && keyValue) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

    return res.status(409).json({
      message: `${field} "${value}" already exists`,
    });
  }

  const status = err.status || 500;
  const payload = {
    message: status === 500 ? "Server side error" : err.message,
  };

  if (!isProduction) {
    payload.error = err.message;
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
});