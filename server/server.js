import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";


import productRoutes from "./src/routes/productRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Sample Route
app.get("/", (req, res) => {
  res.send("Welcome to the Agrofix backend!");
});


app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
