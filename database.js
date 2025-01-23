require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI; // MongoDB URI stored in the .env file

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  }
};

module.exports = connectDB;
