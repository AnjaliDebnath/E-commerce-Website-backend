const express = require("express");
const app = express();
const mongoose= require("mongoose");
const cors = require("cors"); // Add CORS
require("dotenv").config();

const User=  require("./models/user");
const authRoutes = require("./routes/authRoutes")

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', credentials:true
})); 
app.use(express.json()); 

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, )
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

app.use('/auth', authRoutes);

// Start server
const PORT = process.env.AUTH_PORT ;

app.listen(PORT, () => console.log(`auth Server running on http://localhost:${PORT}`));
