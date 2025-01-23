const express = require("express");
const Product = require("../models/product.js"); // Adjust the path to your product model
const router = express.Router();

// GET route to fetch all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find(); // Retrieve all products from the database
    res.status(200).json(products); // Send products as JSON response
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching products" });
  }
});

module.exports = router;
