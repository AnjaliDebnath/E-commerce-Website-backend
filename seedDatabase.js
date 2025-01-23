const connectDB = require("./database");
const Product = require('./models/product.js');
const apiData = require("./data/productApi.js");

const seedDatabase = async () => {
  try {
    await connectDB(); 

    // Clear existing data
    await Product.deleteMany();

    // Insert API data
    await Product.insertMany(apiData);
    console.log("Data successfully seeded to the database");   
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seedDatabase();
