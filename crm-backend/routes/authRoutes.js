const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// 1. Register / Request OTP (Fastor Mobile App Flow)
router.post("/register", async (req, res) => {
  try {
    const { phone, dial_code } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    // Fastor API standard success response for OTP request
    return res.status(200).json({
      status: "Success",
      message: "OTP sent successfully",
      data: "123456" // Testing ke liye default OTP
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// 2. Login with OTP (Fastor Mobile App Flow)
router.post("/login", async (req, res) => {
  try {
    const { phone, otp, dial_code } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        message: "Phone and OTP are required",
      });
    }

    // Default test OTP check
    if (otp !== "123456") {
      return res.status(401).json({
        message: "Invalid OTP",
      });
    }

    // Generate JWT token for subsequent protected requests (like restaurants)
    const token = jwt.sign(
      { phone },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    return res.json({
      status: "Success",
      message: "Login successful",
      data: {
        token,
        phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;