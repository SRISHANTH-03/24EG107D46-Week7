import exp from "express";
import { UserModel } from "../models/UserModel.js";
import { hash, compare } from "bcryptjs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

config();

const { sign } = jwt;

export const commonApp = exp.Router();

// ─────────────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────────────
commonApp.post(
  "/users",
  upload.single("profileImageUrl"),
  async (req, res, next) => {
    let cloudinaryResult;

    try {
      const allowedRoles = ["USER", "AUTHOR", "ADMIN"];

      const newUser = req.body;

      console.log(newUser);
      console.log(req.file);

      // Validate role
      if (!allowedRoles.includes(newUser.role)) {
        return res.status(400).json({
          message: "Invalid role",
        });
      }

      // Upload image to Cloudinary
      if (req.file && process.env.CLOUDINARY_API_KEY) {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      }

      // Add image URL
      newUser.profileImageUrl = cloudinaryResult?.secure_url;

      // Hash password
      newUser.password = await hash(newUser.password, 12);

      // Create user document
      const newUserDoc = new UserModel(newUser);

      // Save user
      await newUserDoc.save();

      // Response
      res.status(201).json({
        message: "User created",
      });
    } catch (err) {
      console.log("err is", err);

      // Delete uploaded image if DB save fails
      if (cloudinaryResult?.public_id) {
        await cloudinary.uploader.destroy(cloudinaryResult.public_id);
      }

      next(err);
    }
  }
);

// ─────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────
commonApp.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid email",
      });
    }

    // Compare passwords
    const isMatched = await compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({
        error: "Invalid password",
      });
    }

    // Create JWT token
    const signedToken = sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", signedToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60, // 1 hour
      path: "/",
    });

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    // Send response
    res.status(200).json({
      message: "Login success",
      payload: userObj,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Login failed",
    });
  }
});

// ─────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────
commonApp.get("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    message: "Logout success",
  });
});

// ─────────────────────────────────────────────────────
// CHECK AUTH
// ─────────────────────────────────────────────────────
commonApp.get(
  "/check-auth",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  (req, res) => {
    res.status(200).json({
      message: "Authenticated",
      payload: req.user,
    });
  }
);

// ─────────────────────────────────────────────────────
// CHANGE PASSWORD
// ─────────────────────────────────────────────────────
commonApp.put(
  "/password",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {
    res.status(200).json({
      message: "Password route working",
    });
  }
);