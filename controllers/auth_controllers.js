const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// * LOGIN
const login = asyncHandler(async (req, res) => {
  const { username, password } = req?.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ username }).exec();
  if (!user || !user.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!process.env.ACCESS_TOKEN || !process.env.REFRESH_TOKEN) {
    console.error("Missing token secrets in environment variables.");
    return res.status(500).json({ message: "Server error" });
  }

  // * Create JWT tokens
  const accessToken = jwt.sign(
    {
      userInfo: {
        username: user.username,
        roles: user.roles,
      },
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ accessToken });
});

// * REFRESH TOKEN
const refresh = asyncHandler(async (req, res) => {
  const cookies = req?.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "No Cookie Unauthorized" });
  }

  try {
    const decoded = jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN);
    const user = await User.findOne({ username: decoded.username }).exec();
    if (!user) {
      return res.status(401).json({ message: "User not found Unauthorized" });
    }

    // * Generate a new access token
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: user.username,
          roles: user.roles,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

// * LOGOUT
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "No Cookie Unauthorized" });
  }

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = { login, refresh, logout };
