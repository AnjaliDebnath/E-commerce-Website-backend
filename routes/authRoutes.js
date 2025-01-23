const express = require("express");
const User = require("../models/user.js"); // Adjust the path to your product model
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const sessions = new Set();

router.post("/register", async (req, res) => {
    try {

      const { username, password, email } = req.body;
      console.log(username, password, email);
  
      // Validate input
      if (!username || !password || !email) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user instance
      const user = new User({ username, email, password: hashedPassword });
  
      // Save the user to the database
      await user.save();
  
      res.status(201).json({ message: "User has been registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error registering user", error: err.message });
    }
  });


  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      // Find user in MongoDB
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Invalid email or password" });
      }
  
      // Compare passwords
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Generate tokens
      const accessToken = generateToken({ user: user.username });
      const refreshToken = jwt.sign({ user: user.username }, REFRESH_TOKEN_SECRET);
  
      // Store refresh token in session
      sessions.add(refreshToken);
  
      // Send response
      res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
        name: user.username, // Include additional user data as needed
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  });
  

  router.post("/token", (req, res) => {
    const { token: refreshToken } = req.body;
  
    // Check if the refresh token exists
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }
  
    // Check if the refresh token is valid in the session store
    if (!sessions.has(refreshToken)) {
      return res.status(401).json({ message: "You need to log in again" });
    }
  
    // Verify the refresh token
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(403).json({ message: "Refresh token expired" });
        }
        if (err.name === "JsonWebTokenError") {
          return res.status(403).json({ message: "Invalid refresh token" });
        }
        return res.status(403).json({ message: "Refresh token verification failed" });
      }
  
      // Generate a new access token
      const newAccessToken = generateToken({ user: user.user });
      res.json({ accessToken: newAccessToken });
    });
  });
  

  router.delete("/logout", (req, res) => {
    const { token: refreshToken } = req.body;
  
    // Check if the refresh token is provided
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
  
    // Check if the refresh token exists in the session store
    if (!sessions.has(refreshToken)) {
      return res.status(404).json({ message: "No active session found for the provided token" });
    }
  
    // Remove the refresh token from the session store
    sessions.delete(refreshToken);
  
    return res.status(200).json({ message: "Logged out successfully" });
  });
  
// Utility function to generate tokens
function generateToken(data) {
  return jwt.sign(data, ACCESS_TOKEN_SECRET);
}

module.exports = router;