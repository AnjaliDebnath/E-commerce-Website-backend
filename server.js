const dotenv= require('dotenv');


dotenv.config();

const express= require('express');
const mongodb= require('mongodb');

const cookieParser= require('cookie-parser');
const cors = require("cors");
const Product = require('./models/product');
const apiData = require("./data/productApi");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./database");
const User=  require("./models/user");
const {authLogin} = require("./middlewares/authMiddleware")

const app = express();
app.use(express.json());
// app.use(cookieParser());


const PORT = process.env.MAIN_PORT;
const MONGO_URI= process.env.MONGO_URI;

connectDB();

app.use(cors({
    origin: 'http://localhost:3000', credentials:true
  })); 

  
app.use("/api", productRoutes);
// app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
  });




app.get('/users/me', authLogin, (req, res)=>{
    try{
        console.log(req.user);
        res.json(req.user)
    } catch(err) {
        res.json({ message: err.message});
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
